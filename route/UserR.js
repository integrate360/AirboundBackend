// studentRoutes.js
const express = require("express");
const { login, register } = require("../controller/UserC");
const router = express.Router();

router.post("/user/login/", login);
router.post("/user/register/", register);

module.exports = router;
