export const questions = {
  questions: [
    {
      id: 1,
      question: "Algoritma mana yang paling sering digunakan untuk masalah klasifikasi?",
      learning_path: "Machine Learning",
      answers: [
        { id: 1, point: 0, text: "Linear Regression" },
        { id: 2, point: 1, text: "Support Vector Machines" },
        { id: 3, point: 0, text: "K-Means" },
        { id: 4, point: 0, text: "Random Forest" },
      ],
    },
    {
      id: 2,
      question: "Apa itu overfitting dalam konteks machine learning?",
      learning_path: "Machine Learning",
      answers: [
        { id: 1, point: 1, text: "Model bekerja sangat baik pada data pelatihan tetapi buruk pada data pengujian." },
        { id: 2, point: 0, text: "Model bekerja sangat buruk pada data pelatihan tetapi baik pada data pengujian." },
        { id: 3, point: 0, text: "Model bekerja sangat baik pada kedua data pelatihan dan pengujian." },
        { id: 4, point: 0, text: "Model bekerja sangat buruk pada kedua data pelatihan dan pengujian." },
      ],
    },
    {
      id: 3,
      question: "Apa fungsi dari regularisasi dalam model machine learning?",
      learning_path: "Machine Learning",
      answers: [
        { id: 1, point: 1, text: "Mencegah overfitting" },
        { id: 2, point: 0, text: "Meningkatkan kecepatan pelatihan model" },
        { id: 3, point: 0, text: "Meningkatkan akurasi pada data pelatihan" },
        { id: 4, point: 0, text: "Mengurangi kompleksitas dataset" },
      ],
    },
    {
      id: 4,
      question: "Dalam neural networks, apa yang dimaksud dengan 'epoch'?",
      learning_path: "Machine Learning",
      answers: [
        { id: 1, point: 1, text: "Satu siklus penuh dari pelatihan model dengan seluruh dataset" },
        { id: 2, point: 0, text: "Jumlah lapisan dalam neural network" },
        { id: 3, point: 0, text: "Ukuran batch dalam pelatihan" },
        { id: 4, point: 0, text: "Jumlah neuron dalam satu lapisan" },
      ],
    },
    {
      id: 5,
      question: "Manakah teknik berikut yang digunakan untuk mengatasi masalah data yang tidak seimbang?",
      learning_path: "Machine Learning",
      answers: [
        { id: 1, point: 0, text: "Cross-validation" },
        { id: 2, point: 1, text: "SMOTE (Synthetic Minority Over-sampling Technique)" },
        { id: 3, point: 0, text: "PCA (Principal Component Analysis)" },
        { id: 4, point: 0, text: "Grid Search" },
      ],
    },
    {
      id: 6,
      question: "Apa tujuan dari menggunakan validation set dalam machine learning?",
      learning_path: "Machine Learning",
      answers: [
        { id: 1, point: 1, text: "Untuk menilai performa model selama pelatihan" },
        { id: 2, point: 0, text: "Untuk melatih model" },
        { id: 3, point: 0, text: "Untuk menguji model setelah pelatihan selesai" },
        { id: 4, point: 0, text: "Untuk mengumpulkan data baru" },
      ],
    },
    {
      id: 7,
      question: "Apa itu 'gradient descent'?",
      learning_path: "Machine Learning",
      answers: [
        { id: 1, point: 1, text: "Sebuah algoritma optimasi yang digunakan untuk meminimalkan fungsi biaya" },
        { id: 2, point: 0, text: "Sebuah teknik regulasi untuk mencegah overfitting" },
        { id: 3, point: 0, text: "Sebuah metode untuk membagi data menjadi train dan test set" },
        { id: 4, point: 0, text: "Sebuah teknik augmentasi data" },
      ],
    },
    {
      id: 8,
      question: "Apa itu 'dropout' dalam konteks neural networks?",
      learning_path: "Machine Learning",
      answers: [
        { id: 1, point: 1, text: "Teknik regulasi yang secara acak mengabaikan neuron selama pelatihan untuk mencegah overfitting" },
        { id: 2, point: 0, text: "Proses menghapus fitur yang tidak relevan dari dataset" },
        { id: 3, point: 0, text: "Proses menambah data baru ke dataset" },
        { id: 4, point: 0, text: "Teknik mengurangi dimensi dataset" },
      ],
    },
    {
      id: 9,
      question: "Apa perbedaan antara supervised dan unsupervised learning?",
      learning_path: "Machine Learning",
      answers: [
        { id: 1, point: 1, text: "Supervised learning menggunakan label untuk melatih model, sedangkan unsupervised learning tidak." },
        { id: 2, point: 0, text: "Supervised learning tidak menggunakan label untuk melatih model, sedangkan unsupervised learning menggunakan." },
        { id: 3, point: 0, text: "Supervised learning digunakan untuk clustering, sedangkan unsupervised learning digunakan untuk klasifikasi." },
        { id: 4, point: 0, text: "Supervised learning digunakan untuk regresi, sedangkan unsupervised learning digunakan untuk prediksi." },
      ],
    },
    {
      id: 10,
      question: "Apa itu 'confusion matrix'?",
      learning_path: "Machine Learning",
      answers: [
        { id: 1, point: 1, text: "Sebuah tabel yang digunakan untuk menilai performa model klasifikasi" },
        { id: 2, point: 0, text: "Sebuah grafik yang digunakan untuk menampilkan distribusi data" },
        { id: 3, point: 0, text: "Sebuah matriks yang digunakan untuk melakukan transformasi data" },
        { id: 4, point: 0, text: "Sebuah teknik untuk mengurangi dimensi data" },
      ],
    },
  ],
};
