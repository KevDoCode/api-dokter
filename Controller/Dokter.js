var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");
const validate = require("../Validation/DoctorValidation");

router.get("/", function (req, res, next) {
  koneksi.any("select * from doctors").then((result) => {
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
  koneksi.any("select * from doctors where id = $1", [id]).then((result) => {
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
  });
});

router.post("/", validate(), handlerInput, function (req, res, next) {
  let sql = `INSERT INTO doctors (doctor,address,phonenumber) VALUES ($1,$2,$3)`;
  let data = [req.body.doctor, req.body.address, req.body.phonenumber];

  koneksi.any(sql, data);
  res.status(200).json({
    status: true,
    data: req.body,
  });

  //
});

router.put("/:id", function (req, res) {
  let id = req.params.id;
  let sql = `UPDATE doctors SET doctor = $1 ,address = $2 ,phonenumber = $3 WHERE id= $4`;
  let data = [req.body.doctor, req.body.address, req.body.phonenumber, id];

  koneksi.any(sql, data).catch((e) => {
    console.log(e);
  });

  res.status(200).json({
    status: true,
    data: req.body,
  });
  //
});

router.delete("/:id", function (req, res, next) {
  let id = req.params.id;
  let sql = `DELETE FROM doctors WHERE id=$1`;
  let data = [id];

  koneksi
    .any("select iddoctor from appointments where iddoctor = $1", [id])
    .then((result) => {
      if (result.length == 0) {
        koneksi.none(sql, data);
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
    });

  //
});
module.exports = router;
