const mysql = require("mysql");

const db = mysql.createConnection({
  host: "34.101.181.155",
  user: "root",
  password: "root",
  database: "rekomenin"
});

db.connect(err => {
  if (err) {
    console.errorA("Error connecting to MySQL database:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

module.exports = db;