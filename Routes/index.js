const express = require("express");
const router = express.Router();

const Home = require("./Defaults/Home/Home");
const Preferances = require("./Defaults/Preferances/Preferances");

router.use("/", Home);
router.use("/Preferances", Preferances);

module.exports = router;
