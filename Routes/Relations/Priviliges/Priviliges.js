const controller = require("../../../Controllers/Users/Related/Priviliges");

const express = require("express");
const router = express.Router();

router.param('ID', controller.PARAM)

router.get("/", controller.GET_ALL);
router.get("/:ID", controller.GET_BYID);

module.exports = router;
