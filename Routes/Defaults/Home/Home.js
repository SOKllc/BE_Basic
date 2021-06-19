const currentPage = "Home";

const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send(`Welcome in ${currentPage} page...`);
});

module.exports = router;
