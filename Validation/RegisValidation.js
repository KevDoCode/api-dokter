const { body } = require("express-validator");
const db = require("../Util/Database");
function validate() {
  return [
    body("username").custom(checkUsername),
    body("idappointments").custom(checkAppointment),
    body("date_regist").isDate(),
    body("date_book").isDate(),
    body("time_book").matches("^([0-2][0-9]):[0-5][0-9]$"),
    body("flagstatus").isNumeric(),
  ];
}
async function checkAppointment(id) {
  let sql = "SELECT id FROM appointments WHERE id =$1";
  let res = await db.query(sql, [id]);
  return new Promise((resolve, reject) => {
    if (res.length == 0) {
      reject("Appointment Not Found");
    }
    resolve();
  });
}

async function checkUsername(username) {
  let sql = "SELECT username FROM users WHERE username =$1 and roles=2";
  let res = await db.query(sql, [username]);
  return new Promise((resolve, reject) => {
    if (res.length == 0) {
      reject("Username Not Found");
    }
    resolve();
  });
}

module.exports = validate;
