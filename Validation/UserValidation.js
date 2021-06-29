const { body } = require("express-validator");
const db = require("../Util/Database");

function validate() {
  return [
    body("email").isEmail().custom(checkEmail),
    body("username").custom(checkUsername),
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password Minimal must be 8 letter"),
    body("roles").notEmpty(),
  ];
}

function checkUsername(username, { req }) {
  let sql;
  if (req.method == "PUT") {
    sql =
      "select username from users where username = ? and username !='" +
      req.params.id +
      "'";
  } else {
    sql = "select username from users where username = ?";
  }
  return new Promise((resolve, reject) => {
    db.query(sql, [username], function (err, res, field) {
      if (res.length > 0) {
        reject("Username already used");
      }
      resolve();
    });
  });
}

function checkEmail(email, { req }) {
  let sql;
  if (req.method == "PUT") {
    sql =
      "select email from users where email = ? and username !='" +
      req.params.id +
      "'";
  } else {
    sql = "select email from users where email = ?";
  }
  return new Promise((resolve, reject) => {
    db.query(sql, [email], function (err, res, field) {
      if (res.length > 0) {
        reject("Email already used");
      }
      resolve();
    });
  });
}

module.exports = validate;
