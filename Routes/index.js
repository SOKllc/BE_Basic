const express = require("express");
const router = express.Router();

let SRVRes = {
  WelcomeMessage: "Welcom...",
};

const Home = require("./Defaults/Home/Home");
router.use("/", Home);

const Login = require("./Login/Login");
router.use("/Login", Login);

// Admin
const Admin = require("./Admin/Admin");
router.use("/Admin", Admin);

// Relations
const Preferances = require("./Relations/Preferances/Preferances");
router.use("/Preferances", Preferances);
const Priviliges = require("./Relations/Priviliges/Priviliges");
router.use("/Priviliges", Priviliges);

router.use((err, req, res, next) => {
  SRVRes = {
    ...SRVRes,
    Error: true,
    Connection: { Code: err.code, Name: err.name, Message: err.message },
  };
  console.log(err);
  res.status(err.status || 550);
  res.send(SRVRes);
});

module.exports = router;
