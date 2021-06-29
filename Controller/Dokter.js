var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");
const validate = require("../Validation/DoctorValidation");

router.get("/", function (req, res, next) {
  koneksi.query("select * from doctors", function (er, result, field) {
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
  });
});

router.get("/:id", function (req, res, next) {
  let id = req.params.id;
  koneksi.query(
    "select * from doctors where id =?",
    [id],
    function (er, result, field) {
      if (result.length == 1) {
        res.json(result[0]);
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
  let sql = `INSERT INTO doctors (doctor,address,phonenumber) VALUES (?,?,?)`;
  let data = [req.body.doctor, req.body.address, req.body.phonenumber];
  koneksi.query(sql, data, function (er, result, field) {
    res.status(200).json({
      status: true,
      data: req.body,
    });
  });
});

router.put("/:id", validate, handlerInput, function (req, res, next) {
  let id = req.params.id;
  let sql = `UPDATE doctors SET doctor = ?,address =?,phonenumber =? WHERE id=?`;
  let data = [req.body.doctor, req.body.address, req.body.phonenumber, id];
  koneksi.query(sql, data, function (er, result, field) {
    res.status(200).json({
      status: true,
      data: req.body,
    });
  });
});

router.delete("/:id", function (req, res, next) {
  let id = req.params.id;
  let sql = `DELETE FROM doctors WHERE id=?`;
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
