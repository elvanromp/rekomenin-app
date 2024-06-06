from flask import Flask, request, jsonify
import pandas as pd
import tensorflow as tf
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:3000"}})  # Enable CORS for /predict route from localhost:3000

# Load your model
model = tf.keras.models.load_model('./model.h5')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    user_id = data.get('user_id')
    # Load Data
    courses_df = pd.read_csv('dr01_courses_cleaned.csv', delimiter=";")
    jobs_df = pd.read_csv('dr01_jobs_cleaned.csv', delimiter=";")
    ratings_df = pd.read_csv('ratings.csv', delimiter=";")
    applicant_df = pd.read_csv('job_applicant.csv', delimiter=";")

    # Ensure the combined fields are of type string
    courses_df['description'] = courses_df['description'].astype(str)
    courses_df['technology'] = courses_df['technology'].astype(str)
    courses_df['learning_path'] = courses_df['learning_path'].astype(str)
    jobs_df['position'] = jobs_df['position'].astype(str)
    jobs_df['description'] = jobs_df['description'].astype(str)

    # Combine relevant field
    courses_df['combined_course'] = courses_df['description'] + ' ' + courses_df['technology'] + ' ' + courses_df['learning_path']
    jobs_df['combined_job'] = jobs_df['position'] + ' ' + jobs_df['description']

    # Filter rating
    user_ratings = ratings_df[ratings_df['respondent_identifier'] == user_id]

    # Get courses rated by the user
    rated_courses = courses_df[courses_df['id'].isin(user_ratings['course_id'])]

    # Combine course descriptions rated by the user
    user_courses_combined = ' '.join(rated_courses['combined_course'])

    # Check for null values in the combined_job column
    print(jobs_df['combined_job'].isnull().sum())
    print(jobs_df.columns)
    # Fill or drop null values if any
    jobs_df['combined_job'] = jobs_df['combined_job'].fillna('')

    # Vectorize combined fields
    vectorizer = TfidfVectorizer()
    jobs_vectorized = vectorizer.fit_transform(jobs_df['combined_job'])
    user_vectorized = vectorizer.transform([user_courses_combined])

    # Prepare input and target data for the model
    X = jobs_vectorized.toarray()

    # Predict similarities for all jobs
    predicted_similarities = model.predict(X).flatten()

    # Add predicted similarities to jobs dataframe
    jobs_df['predicted_similarity'] = predicted_similarities

    # Filter out jobs already applied by the user
    applied_jobs = applicant_df[applicant_df['user_id'] == user_id]['vacancy_id']
    recommended_jobs = jobs_df[~jobs_df['id'].isin(applied_jobs)]

    # Sort jobs by predicted similarity
    top_10_recommendations = recommended_jobs.sort_values(by='predicted_similarity', ascending=False).head(10)

    # Return top 10 recommendations as JSON
    return jsonify(top_10_recommendations.to_dict(orient='records'))
    # return jsonify({"test": user_id})
if __name__ == '__main__':
    app.run(debug=True)
