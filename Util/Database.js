var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dbdokter",
});

connection.connect(function (err) {
  if (!!err) {
    console.log("Gagal Koneksi Database");
  } else {
    console.log("Berhasil Koneksi Database");
  }
});

module.exports = connection;
