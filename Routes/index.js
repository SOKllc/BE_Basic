const express = require("express");
const router = express.Router();

const Home = require("./Defaults/Home/Home");
const Preferances = require("./Defaults/Preferances/Preferances");

const Admin = require("./Admin/Admin");

router.use("/", Home);
router.use("/Preferances", Preferances);

// Admin
router.use("/Admin", Admin);

module.exports = router;
