const currentPage = "Users";

const controller = require("../../../Controllers/Users/Users");

const express = require("express");
const router = express.Router();

router.param("ID", controller.PARAM);

router.get("/", controller.GET_ALL);

router.get("/:ID", controller.GET_BYID);

router.post("/", controller.POST);

router.put("/:ID", controller.PUT);

router.delete("/:ID", controller.DELETE);

module.exports = router;
