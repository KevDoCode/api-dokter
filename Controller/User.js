var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const { encrypt } = require("../Util/Encrypt");
const validate = require("../Validation/UserValidation");
const handlerInput = require("../Util/ValidationHandler");

router.get("/", function (req, res, next) {
  koneksi.any(
    `SELECT username, email, firstName, lastName, password, roles.roles FROM users
INNER JOIN roles
ON users.roles = roles.id`,
    function (result) {
      if (result.length > 0) {
        res.status(200).json({
          status: true,
          data: result,
        });
      } else {
        res.status(200).json({
          status: true,
          data: [],
        });
      }
    }
  );
});

router.get("/:id", function (req, res, next) {
  let id = req.params.id;
  koneksi.any(
    `SELECT username, email, firstName, lastName, password, roles.roles FROM users
INNER JOIN roles
ON users.roles = roles.id where username =?`,
    [id],
    function (result) {
      if (result.length == 1) {
        res.status(200).json({
          status: true,
          data: result[0],
        });
      } else {
        res.status(403).json({
          status: false,
          data: [],
        });
      }
    }
  );
});

router.post("/", validate(), handlerInput, function (req, res, next) {
  let sql = `INSERT INTO users (username,email,firstName, lastName, password,roles) VALUES (?,?,?,?,?,?)`;
  let data = [
    req.body.username,
    req.body.email,
    req.body.firstName,
    req.body.lastName,
    encrypt(req.body.password),
    req.body.roles,
  ];
  koneksi.any(sql, data);
  res.status(200).json({
    status: true,
    data: req.body,
  });

  //
});

router.put("/:id", validate(), handlerInput, function (req, res, next) {
  let id = req.params.id;
  let sql = `update users set username=?,email=?,firstName=?, lastName=?, password=?,roles=? where username=?`;
  let data = [
    req.body.username,
    req.body.email,
    req.body.firstName,
    req.body.lastName,
    encrypt(req.body.password),
    req.body.roles,
    id,
  ];
  koneksi.any(sql, data);
  res.status(200).json({
    status: true,
    data: req.body,
  });

  //
});

router.delete("/:id", function (req, res, next) {
  let id = req.params.id;
  let sql = `DELETE FROM users WHERE username=?`;
  let data = [id];
  koneksi.any(sql, data, function (result) {
    if (er == null) {
      res.json({ error: "Data Gagal disimpan " });
    } else {
      res.json({ msg: "Data Berhasil disimpan" });
    }
  });
});
module.exports = router;
