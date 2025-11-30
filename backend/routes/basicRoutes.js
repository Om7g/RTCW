// routes.js
const express = require("express");
const router = express.Router();

const basic = require("../controllers/BasicController.js");

router.get("/", basic.home);
router.get("/about", basic.about);
router.post("/submit", basic.submit);

module.exports = router;
