const express = require("express");
const router = express.Router();

const Home = require("./Defaults/Home/Home");
const Preferance = require("./Defaults/Preferance/Preferance");

router.use("/", Home);
router.use("/Preferance", Preferance);

module.exports = router;
