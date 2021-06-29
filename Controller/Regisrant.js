var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");
const validate = require("../Validation/RegisValidation");

router.get("/", function (req, res, next) {
  koneksi.query(
    `SELECT registrant.id, registrant.username, idappointments, date_regist, date_book, time_book, flagstatus
,users.firstName, users.lastName,.users.email, appointments.description, doctors.doctor
FROM registrant
inner JOIN users
on registrant.username = users.username
INNER join appointments
on appointments.id = registrant.idappointments
inner JOIN doctors
on doctors.id = appointments.iddoctor
`,
    function (er, result, field) {
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
  koneksi.query(
    `SELECT registrant.id, registrant.username, idappointments, date_regist, date_book, time_book, flagstatus
,users.firstName, users.lastName,.users.email, appointments.description, doctors.doctor
FROM registrant
inner JOIN users
on registrant.username = users.username
INNER join appointments
on appointments.id = registrant.idappointments
inner JOIN doctors
on doctors.id = appointments.iddoctor
 where appointments.id =?`,
    [id],
    function (er, result, field) {
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
  let sql = `INSERT INTO registrant (username, idappointments, date_regist, date_book, time_book, flagstatus) VALUES (?,?,?,?,?,?)`;
  let data = [
    req.username,
    req.body.idappointments,
    req.body.date_regist,
    req.body.date_book,
    req.body.time_book,
    req.body.flagstatus,
  ];
  koneksi.query(sql, data, function (er, result, field) {
    res.status(200).json({
      status: true,
      data: req.body,
    });
  });
});

router.put("/:id", validate(), handlerInput, function (req, res, next) {
  let id = req.params.id;
  let sql = `UPDATE  registrant SET username=?, idappointments=?, date_regist=?, date_book=?, time_book=?, flagstatus=? where id = ?`;
  let data = [
    req.username,
    req.body.idappointments,
    req.body.date_regist,
    req.body.date_book,
    req.body.time_book,
    req.body.flagstatus,
    id,
  ];
  koneksi.query(sql, data, function (er, result, field) {
    res.status(200).json({
      status: true,
      data: req.body,
    });
  });
});

router.delete("/:id", function (req, res, next) {
  let id = req.params.id;
  let sql = `DELETE FROM registrant WHERE id=?`;
  let data = [id];
  koneksi.query(sql, data, function (er, result, field) {
    if (er == null) {
      res.json({ error: "Data Gagal disimpan " });
    } else {
      res.json({ msg: "Data Berhasil disimpan" });
    }
  });
});
module.exports = router;
