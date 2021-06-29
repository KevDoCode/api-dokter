const { body } = require("express-validator");
const db = require("../Util/Database");
function validate() {
  return [
    body("username").custom(checkUsername),
    body("idappointments").custom(checkAppointment),
    body("date_regist").isDate(),
    body("date_book").isDate(),
    body("time_book").isDate(),
    body("flagstatus").isNumeric(),
  ];
}
function checkAppointment(id) {
  let sql = "SELECT id FROM appointments WHERE id =?";
  return new Promise((resolve, reject) => {
    db.query(sql, [id], function (err, res, field) {
      if (res.length == 0) {
        reject("Appointment Not Found");
      }
      resolve();
    });
  });
}

function checkUsername(username) {
  let sql = "SELECT username FROM users WHERE username =? and roles=2";
  return new Promise((resolve, reject) => {
    db.query(sql, [username], function (err, res, field) {
      if (res.length == 0) {
        reject("Username Not Found");
      }
      resolve();
    });
  });
}

module.exports = validate;
