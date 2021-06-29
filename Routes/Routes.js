const Dokter = require("../Controller/Dokter");
const Appointment = require("../Controller/Appointment");
const Regisrant = require("../Controller/Regisrant");
const User = require("../Controller/User");
const Auth = require("../Controller/Auth");

function Route(app) {
  app.use("/dokter", Dokter);
  app.use("/user", User);
  app.use("/appointment", Appointment);
  app.use("/regis", Regisrant);
  app.use("/auth", Auth);

  // If route not found
  app.use(function (req, res, next) {
    if (!req.route)
      return res.status(404).json({ status: false, message: "Not Found" });
    next();
  });
}

module.exports = Route;
