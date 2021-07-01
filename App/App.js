const express = require("express");
const app = express();

var path = require("path");
const Middleware = require("../Middleware/Middleware");
const Route = require("../Routes/Routes");
const Cors = require("cors");
//CORS
var whitelist = ["https://webdokter.herokuapp.com", "http://localhost:3000"];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(Cors(corsOptions));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://webdokter.herokuapp.com"
  );

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//Make body readable
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//Add middleware
app.use(Middleware);

//Add Routes
Route(app);

app.get("/", (req, res) => {
  var startTime = "10:00";
  var endTime = "17:00";

  var start_time = parseTime(startTime),
    end_time = parseTime(endTime),
    interval = 79;

  var times_ara = calculate_time_slot(start_time, end_time, interval);

  res.send({ waktu: times_ara });
});

function parseTime(s) {
  var c = s.split(":");
  return parseInt(c[0]) * 60 + parseInt(c[1]);
}

function convertHours(mins) {
  var hour = Math.floor(mins / 60);
  var mins = mins % 60;
  var converted = pad(hour, 2) + ":" + pad(mins, 2);
  return converted;
}

function pad(str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

function calculate_time_slot(start_time, end_time, interval = "30") {
  var i, formatted_time;
  var time_slots = new Array();
  for (var i = start_time; i <= end_time; i = i + interval) {
    formatted_time = convertHours(i);
    time_slots.push(formatted_time);
  }
  return time_slots;
}

module.exports = app;
