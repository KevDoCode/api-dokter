var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");
const validate = require("../Validation/AppointmentValidation");

router.get("/", function (req, res, next) {
  koneksi.query(
    "SELECT appointments.id, iddoctor, `start`, `end`, description, duration , doctors.doctor, doctors.address, doctors.address FROM appointments INNER JOIN doctors on doctors.id = appointments.iddoctor",
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
    "SELECT appointments.id, iddoctor, `start`, `end`, description, duration , doctors.doctor, doctors.address, doctors.address FROM appointments INNER JOIN doctors on doctors.id = appointments.iddoctor where appointments.id =?",
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
  let sql = `INSERT INTO appointments (iddoctor,start,end, description, duration) VALUES (?,?,?,?,?)`;
  let data = [
    req.body.iddoctor,
    req.body.start,
    req.body.end,
    req.body.description,
    req.body.duration,
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

  let sql = `UPDATE appointments set iddoctor=?,start=?,end=?, description=?, duration=? where id=?`;
  let data = [
    req.body.iddoctor,
    req.body.start,
    req.body.end,
    req.body.description,
    req.body.duration,
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
  let sql = `DELETE FROM appointments WHERE id=?`;
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
