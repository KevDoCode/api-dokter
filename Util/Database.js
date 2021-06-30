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

var promise = require("bluebird");

var options = {
  // Initialization Options
  promiseLib: promise,
};

var pgp = require("pg-promise")(options);
// var connectionString =
//   "postgres://ogkhatpkhgdein:48ef020621fda4972802a48bee243d962ca8bd11e04029019b8111c0e39aa626@ec2-34-195-143-54.compute-1.amazonaws.com:5432/d2ke523leggc54";

var connectionString =
  "postgres://postgres:itbrain1milyar@localhost:5432/apidokter";
connectionString =
  "postgres://ogkhatpkhgdein:48ef020621fda4972802a48bee243d962ca8bd11e04029019b8111c0e39aa626@ec2-34-195-143-54.compute-1.amazonaws.com:5432/d2ke523leggc54";
var db = pgp(connectionString);

module.exports = db;
