var express = require("express");
var router = express.Router();
var koneksi = require("../Util/Database");
const handlerInput = require("../Util/ValidationHandler");
const validate = require("../Validation/RegisValidation");

router.get("/", async function (req, res, next) {
  let result;
  if (req.query.limit == undefined) {
    result = await koneksi.query(
      `SELECT registrant.id, registrant.username, idappointments, date_regist, date_book, time_book, flagstatus
,users.firstName, users.lastName,users.email, appointments.description, doctors.doctor
FROM registrant
inner JOIN users
on registrant.username = users.username
INNER join appointments
on appointments.id = registrant.idappointments
inner JOIN doctors
on doctors.id = appointments.iddoctor
`
    );
  } else {
    result = await koneksi.query(
      `SELECT registrant.id, registrant.username, idappointments, date_regist, date_book, time_book, flagstatus
,users.firstName, users.lastName,users.email, appointments.description, doctors.doctor
FROM registrant
inner JOIN users
on registrant.username = users.username
INNER join appointments
on appointments.id = registrant.idappointments
inner JOIN doctors
on doctors.id = appointments.iddoctor
  limit ` +
        req.query.limit +
        ` order by date_book, time_book desc`
    );
  }

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
router.get("/dashboard", async function (req, res, next) {
  let result = await koneksi.query(`select count(id) as count from registrant`);
  let result1 = await koneksi.query(
    `select count(username) as count from users where roles = 2`
  );
  res.status(200).json({
    status: true,
    data: { regist: result[0], user: result1[0] },
  });
});

router.get("/appointment/:id", async function (req, res, next) {
  let id = req.params.id;
  let result = await koneksi.query(
    `SELECT registrant.id, registrant.username, idappointments, date_regist, date_book, time_book, flagstatus
,users.firstName, users.lastName,users.email, appointments.description, doctors.doctor
FROM registrant
inner JOIN users
on registrant.username = users.username
INNER join appointments
on appointments.id = registrant.idappointments
inner JOIN doctors
on doctors.id = appointments.iddoctor
 where appointments.id = $1` + ` order by date_book, time_book desc`,
    [id]
  );
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

router.get("/username/:id", async function (req, res, next) {
  let id = req.params.id;
  let result = await koneksi.query(
    `SELECT registrant.id, registrant.username, idappointments, date_regist, date_book, time_book, flagstatus
,users.firstName, users.lastName,users.email, appointments.description, doctors.doctor
FROM registrant
inner JOIN users
on registrant.username = users.username
INNER join appointments
on appointments.id = registrant.idappointments
inner JOIN doctors
on doctors.id = appointments.iddoctor
 where registrant.username = $1` + ` order by date_book, time_book desc`,
    [id]
  );
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

router.get("/:id", async function (req, res, next) {
  let id = req.params.id;

  let result = await koneksi.query(
    `SELECT registrant.id, registrant.username, idappointments, date_regist, date_book, time_book, flagstatus
,users.firstName, users.lastName,users.email, appointments.description, doctors.doctor
FROM registrant
inner JOIN users
on registrant.username = users.username
INNER join appointments
on appointments.id = registrant.idappointments
inner JOIN doctors
on doctors.id = appointments.iddoctor
 where registrant.id = $1`,
    [id]
  );
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

router.post("/", validate(), handlerInput, function (req, res, next) {
  let sql = `INSERT INTO registrant (username, idappointments, date_regist, date_book, time_book, flagstatus) VALUES ($1,$2,$3,$4,$5,$6)`;
  let data = [
    req.body.username,
    req.body.idappointments,
    req.body.date_regist,
    req.body.date_book,
    req.body.time_book,
    req.body.flagstatus,
  ];
  koneksi.none(sql, data);
  res.status(200).json({
    status: true,
    data: req.body,
  });

  //
});

router.put("/:id", validate(), handlerInput, function (req, res, next) {
  let id = req.params.id;
  let sql = `UPDATE  registrant SET username=$1, idappointments=$2, date_regist=$3, date_book=$4, time_book=$5, flagstatus=$6 where id = $7`;
  let data = [
    req.body.username,
    req.body.idappointments,
    req.body.date_regist,
    req.body.date_book,
    req.body.time_book,
    req.body.flagstatus,
    id,
  ];
  koneksi.none(sql, data);
  res.status(200).json({
    status: true,
    data: req.body,
  });

  //
});

router.delete("/:id", function (req, res, next) {
  let id = req.params.id;
  let sql = `DELETE FROM registrant WHERE id=$1`;
  let data = [id];
  koneksi.none(sql, data);
  res.status(200).json({
    status: true,
  });
});
module.exports = router;
