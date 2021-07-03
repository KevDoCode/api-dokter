var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const { encrypt } = require("../Util/Encrypt");
const validate = require("../Validation/UserValidation");
const handlerInput = require("../Util/ValidationHandler");

router.get("/", async function (req, res) {
  let result = await koneksi.query(
    `SELECT username, email, firstName, lastName, password, roles.roles, roles.id FROM users
INNER JOIN roles
ON users.roles = roles.id`
  );
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
  //
});

router.get("/:id", async function (req, res, next) {
  let id = req.params.id;
  let result = await koneksi.query(
    `SELECT username, email, firstName, lastName, password, roles.roles, roles.id FROM users
INNER JOIN roles
ON users.roles = roles.id where username =$1`,
    [id]
  );
  if (result.length == 1) {
    res.status(200).json({
      status: true,
      data: result[0],
    });
  } else {
    res.status(204).json({
      status: false,
      data: [],
    });
  }
  //
});

router.post("/", validate(), handlerInput, function (req, res, next) {
  let sql = `INSERT INTO users (username,email,firstName, lastName, password,roles) VALUES ($1,$2,$3,$4,$5,$6)`;
  let data = [
    req.body.username,
    req.body.email,
    req.body.firstName,
    req.body.lastName,
    encrypt(req.body.password),
    req.body.roles,
  ];
  koneksi.none(sql, data);
  res.status(200).json({
    status: true,
    data: req.body,
  });

  //
});

router.put("/:id", validate(), handlerInput, function (req, res, next) {
  let id = req.params.id;
  let sql = `update users set username=$1,email=$2,firstName=$3, lastName=$4, password=$5,roles=$6 where username=$7`;
  let data = [
    req.body.username,
    req.body.email,
    req.body.firstName,
    req.body.lastName,
    req.body.password,
    req.body.roles,
    id,
  ];
  koneksi.none(sql, data);
  res.status(200).json({
    status: true,
    data: req.body,
  });

  //
});

router.delete("/:id", async function (req, res, next) {
  let id = req.params.id;
  let sql = `DELETE FROM users WHERE username=$1`;
  let data = [id];

  let result = await koneksi.query(
    `SELECT username from registrant where username =$1`,
    [id]
  );

  if (result.length == 0) {
    koneksi.none(sql, data);
    res.status(200).json({
      status: true,
      data: result[0],
    });
  } else {
    res.status(204).json({
      status: false,
      data: [],
    });
  }
  //
});
module.exports = router;
