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

async function checkUsername(username, { req }) {
  let sql;
  if (req.method == "PUT") {
    sql =
      "select username from users where username = $1 and username !='" +
      req.params.id +
      "'";
  } else {
    sql = "select username from users where username = $1";
  }
  let res = await db.query(sql, [username]);
  return new Promise((resolve, reject) => {
    if (res.length > 0) {
      reject("Username already used");
    }
    resolve();
  });
}

async function checkEmail(email, { req }) {
  let sql;
  if (req.method == "PUT") {
    sql =
      "select email from users where username = $1 and username !='" +
      req.params.id +
      "'";
  } else {
    sql = "select email from users where username = $1";
  }
  let res = await db.query(sql, [email]);
  return new Promise((resolve, reject) => {
    if (res.length > 0) {
      reject("Email already used");
    }
    resolve();
  });
}

module.exports = validate;
