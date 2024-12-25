
const express = require("express");
const { login, register,getAllUsers ,deleteUser,logout,getUser} = require("../controller/UserC");
const router = express.Router();

router.post("/user/login/", login);
router.post("/user/register/", register);
router.get("/user/logout/", logout);
router.get("/users/", getAllUsers);
router.get("/user/:id/", getUser);
router.delete("/user/:id/", deleteUser);


module.exports = router;
