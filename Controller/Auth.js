var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const { generate } = require("../Util/JWT");
const { encrypt } = require("../Util/Encrypt");
const validate = require("../Validation/UserValidation");
const handlerInput = require("../Util/ValidationHandler");

router.post("/register", validate, handlerInput, function (req, res, next) {
  let sql = `INSERT INTO users (username,email,firstName, lastName, password,roles) VALUES ( $1, $2, $3, $4, $5, $6)`;
  let data = [
    req.body.username,
    req.body.email,
    req.body.firstName,
    req.body.lastName,
    encrypt(req.body.password),
    "2",
  ];
  koneksi.none(sql, data);
  let token = generate(req.body.username, "2");
  res.status(200).json({
    status: true,
    data: req.body,
    token: token,
  });
});

router.post("/login", async function (req, res, next) {
  let sql = `SELECT * FROM users where username=$1 and password=$2`;
  let data = [req.body.username, encrypt(req.body.password)];
  let result = await koneksi.any(sql, data);
  if (result.length > 0) {
    let token = generate(result[0].username, result[0].roles);
    res.json({ token: token });
  } else {
    res.status(404).json({ msg: "Username atau Password tidak ditemukan" });
  }
  //
});

module.exports = router;
