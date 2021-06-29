const express = require("express");
const app = express();

var path = require("path");
const Middleware = require("../Middleware/Middleware");
const Route = require("../Routes/Routes");
const Cors = require("cors");
//CORS
app.use(Cors);

//Make body readable
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//Add middleware
// app.use(Middleware);

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
