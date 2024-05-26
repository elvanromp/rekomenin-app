import pandas as pd
import numpy as np
import random
import tensorflow as tf
from surprise import AlgoBase, Dataset, Reader, accuracy, PredictionImpossible
from surprise.model_selection import train_test_split

# CourseData class to handle loading and processing the dataset
class CourseData:
    def __init__(self, courses_path, ratings_path):
        self.courses_path = courses_path
        self.ratings_path = ratings_path

    def load_data(self):
        # Load courses and ratings from CSV files
        self.courses = pd.read_csv(self.courses_path)
        self.ratings = pd.read_csv(self.ratings_path)
        
        # Adjust the columns to match the expected format
        self.ratings.rename(columns={'respondent_identifier': 'user_id'}, inplace=True)
        
        reader = Reader(rating_scale=(1, 5))
        data = Dataset.load_from_df(self.ratings[['user_id', 'course_id', 'rating']], reader)
        return data

    def get_popularity_ranks(self):
        # Dummy implementation for course popularity ranks
        course_ranks = self.ratings.groupby('course_id').size().sort_values(ascending=False)
        return course_ranks.to_dict()

    def get_course_name(self, courseID):
        # Get course name from the courses dataframe
        course_name = self.courses[self.courses['id'] == courseID]['name']
        if course_name.empty:
            return "Unknown Course"
        return course_name.values[0]

# AutoRec class implementing the AutoRec model
class AutoRec:
    def __init__(self, visibleDimensions, epochs=20, hiddenDimensions=50, learningRate=0.1, batchSize=100):
        self.visibleDimensions = visibleDimensions
        self.epochs = epochs
        self.hiddenDimensions = hiddenDimensions
        self.learningRate = learningRate
        self.batchSize = batchSize
        self.optimizer = tf.keras.optimizers.RMSprop(self.learningRate)
                
    def Train(self, X):
        self.initialize_weights_biases()
        for epoch in range(self.epochs):
            for i in range(0, X.shape[0], self.batchSize):
                epochX = X[i:i+self.batchSize].astype(np.float32)
                self.run_optimization(epochX)
            print("Trained epoch ", epoch)

    def GetRecommendations(self, inputUser):
        inputUser = tf.convert_to_tensor(inputUser, dtype=tf.float32)
        rec = self.neural_net(inputUser)
        return rec[0]
    
    def initialize_weights_biases(self):
        self.weights = {
            'h1': tf.Variable(tf.random.normal([self.visibleDimensions, self.hiddenDimensions], dtype=tf.float32)),
            'out': tf.Variable(tf.random.normal([self.hiddenDimensions, self.visibleDimensions], dtype=tf.float32))
        }
        self.biases = {
            'b1': tf.Variable(tf.random.normal([self.hiddenDimensions], dtype=tf.float32)),
            'out': tf.Variable(tf.random.normal([self.visibleDimensions], dtype=tf.float32))
        }
    
    def neural_net(self, inputUser):
        layer_1 = tf.add(tf.matmul(inputUser, self.weights['h1']), self.biases['b1'])
        layer_1 = tf.nn.sigmoid(layer_1)
        out_layer = tf.add(tf.matmul(layer_1, self.weights['out']), self.biases['out'])
        return out_layer

    def run_optimization(self, X):
        X = tf.convert_to_tensor(X, dtype=tf.float32)
        with tf.GradientTape() as g:
            pred = self.neural_net(X)
            loss = self.loss_fn(X, pred)
        gradients = g.gradient(loss, [self.weights['h1'], self.weights['out'], self.biases['b1'], self.biases['out']])
        self.optimizer.apply_gradients(zip(gradients, [self.weights['h1'], self.weights['out'], self.biases['b1'], self.biases['out']]))

    def loss_fn(self, original, reconstructed):
        return tf.reduce_mean(tf.square(original - reconstructed))

# AutoRecAlgorithm class implementing a simple AutoRec model
class AutoRecAlgorithm(AlgoBase):
    def __init__(self, epochs=20, hiddenDim=50, learningRate=0.1, batchSize=100, sim_options={}):
        AlgoBase.__init__(self)
        self.epochs = epochs
        self.hiddenDim = hiddenDim
        self.learningRate = learningRate
        self.batchSize = batchSize

    def fit(self, trainset):
        AlgoBase.fit(self, trainset)

        numUsers = trainset.n_users
        numItems = trainset.n_items
        
        trainingMatrix = np.zeros([numUsers, numItems], dtype=np.float32)
        
        for (uid, iid, rating) in trainset.all_ratings():
            trainingMatrix[int(uid), int(iid)] = rating / 5.0
        
        self.autoRec = AutoRec(trainingMatrix.shape[1], hiddenDimensions=self.hiddenDim, learningRate=self.learningRate, batchSize=self.batchSize, epochs=self.epochs)
        self.autoRec.Train(trainingMatrix)

        return self

    def estimate(self, u, i):
        if not (self.trainset.knows_user(u) and self.trainset.knows_item(i)):
            raise PredictionImpossible('User and/or item is unknown.')

        # Predict the rating for the requested user
        user_vector = np.zeros((1, self.trainset.n_items), dtype=np.float32)
        for iid, rating in self.trainset.ur[u]:
            user_vector[0, iid] = rating / 5.0
        
        recs = self.autoRec.GetRecommendations(user_vector)
        rating = recs[i] * 5.0
        
        if (rating < 0.001):
            raise PredictionImpossible('No valid prediction exists.')
            
        return rating

# Evaluator class for evaluating and generating recommendations
class Evaluator:
    def __init__(self, dataset, rankings, course_data):
        self.dataset = dataset
        self.rankings = rankings
        self.course_data = course_data

    def SetAlgorithm(self, algorithm, name):
        self.algorithm = algorithm
        self.name = name

    def Evaluate(self, testSubject=None, k=10):
        trainset, testset = train_test_split(self.dataset, test_size=0.25)
        self.algorithm.fit(trainset)
        
        if testSubject is None:
            testSubject = random.choice(list(trainset.all_users()))
        
        print(f"\nTop {k} recommendations for user {testSubject}")
        
        testset = self._construct_testset_for_user(trainset, testSubject)
        predictions = self.algorithm.test(testset)
        print(predictions)
        
        recommendations = []
        for userID, courseID, actualRating, estimatedRating, _ in predictions:
            intCourseID = int(courseID)
            recommendations.append((intCourseID, estimatedRating))

        recommendations.sort(key=lambda x: x[1], reverse=True)
        for ratings in recommendations[:10]:
          print(self.course_data.get_course_name(ratings[0]), ratings[1])
        
        print("\nEvaluating metrics...")
        trainset, testset = train_test_split(self.dataset, test_size=0.25)
        self.algorithm.fit(trainset)
        predictions = self.algorithm.test(testset)
        mse = accuracy.mse(predictions, verbose=True)
        mae = accuracy.mae(predictions, verbose=True)
        
        print(f"MSE: {mse}")
        print(f"MAE: {mae}")

    def _construct_testset_for_user(self, trainset, user_id):
        anti_testset = []
        fill = trainset.global_mean
        try:
            u = trainset.to_inner_uid(user_id)
        except ValueError:
            raise ValueError(f"User {user_id} is not part of the trainset.")
        
        user_items = set([j for (j, _) in trainset.ur[u]])
        anti_testset += [(trainset.to_raw_uid(u), trainset.to_raw_iid(i), fill) for
                         i in trainset.all_items() if
                         i not in user_items]
        return anti_testset

# Main script to run the evaluation
def main():
    # Load the data
    courses_path = './dr01_courses.csv'
    ratings_path = './ratings.csv'
    course_data = CourseData(courses_path, ratings_path)
    data = course_data.load_data()
    rankings = course_data.get_popularity_ranks()

    # Construct an Evaluator
    evaluator = Evaluator(data, rankings, course_data)

    # Set AutoRec algorithm
    autorec = AutoRecAlgorithm(epochs=20)  # Set epochs to 20
    evaluator.SetAlgorithm(autorec, "AutoRec")

    # Evaluate and Sample top N recommendations
    valid_users = list(evaluator.dataset.raw_ratings)
    valid_user_ids = set(rating[0] for rating in valid_users)
    testSubject = random.choice(list(valid_user_ids))
    
    evaluator.Evaluate(testSubject=testSubject, k=10)  # Use a valid user for evaluation

if __name__ == "__main__":
    main()
