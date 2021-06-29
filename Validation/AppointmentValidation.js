const { body } = require("express-validator");
const db = require("../Util/Database");
function validate() {
  return [
    body("iddoctor").custom(checkDoctor),
    body("start").isDate(),
    body("end").isDate(),
    body("description").notEmpty(),
    body("duration").isNumeric(),
  ];
}

function checkDoctor(id) {
  let sql = "SELECT doctor FROM doctors WHERE id =?";
  return new Promise((resolve, reject) => {
    db.query(sql, [id], function (err, res, field) {
      if (res.length == 0) {
        reject("Doctor Not Found");
      }
      resolve();
    });
  });
}

module.exports = validate;
