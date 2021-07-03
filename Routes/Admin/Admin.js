const express = require("express");
const router = express.Router();

const Users = require("./Users/Users");

router.use("/Users", Users);

module.exports = router;
