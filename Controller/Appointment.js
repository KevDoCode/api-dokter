var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");
const validate = require("../Validation/AppointmentValidation");

router.get("/", async function (req, res) {
  let data = await koneksi.any(
    `SELECT appointments.id, iddoctor, starttime, endtime, description, duration , doctors.doctor, doctors.address, doctors.address FROM appointments INNER JOIN doctors on doctors.id = appointments.iddoctor`
  );
  res.status(200).json({
    status: true,
    data: data,
  });
});

router.get("/:id", async function (req, res, next) {
  let id = req.params.id;

  let data = await koneksi.query(
    "SELECT appointments.id, iddoctor, starttime, endtime, description, duration , doctors.doctor, doctors.address, doctors.address FROM appointments INNER JOIN doctors on doctors.id = appointments.iddoctor where appointments.id = $1",
    [id]
  );
  if (data.length == 1) {
    res.status(200).json({
      status: true,
      data: data[0],
    });
  } else {
    res.status(403).json({
      status: false,
      data: [],
    });
  }
  //
});

router.post("/", validate(), handlerInput, function (req, res) {
  let sql = `INSERT INTO appointments (iddoctor,starttime,endtime, description, duration) VALUES ( $1 , $2 , $3 , $4, $5 )`;
  let data = [
    req.body.iddoctor,
    req.body.starttime,
    req.body.endtime,
    req.body.description,
    req.body.duration,
  ];
  koneksi.none(sql, data);
  res.status(200).json({
    status: true,
    data: req.body,
  });

  //
});

router.put("/:id", validate(), handlerInput, async function (req, res) {
  let id = req.params.id;

  let sql = `UPDATE appointments set iddoctor=$1,starttime=$2,endtime=$3, description=$4, duration=$5 where id=$6`;
  let data = [
    req.body.iddoctor,
    req.body.starttime,
    req.body.endtime,
    req.body.description,
    req.body.duration,
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
  let sql = `DELETE FROM appointments WHERE id=$1`;
  let data = [id];
  let exists = await koneksi.any(
    "SELECT registrant.idappointments FROM registrant where idappointments = $1",
    [id]
  );
  if (exists.length == 0) {
    koneksi.any(sql, data);
    res.status(200).json({
      status: true,
      data: exists[0],
    });
  } else {
    res.status(403).json({
      status: false,
      data: [],
    });
  }
  //
});
module.exports = router;
