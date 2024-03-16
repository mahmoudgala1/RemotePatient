const express = require("express");
const { getUser, changeEmail, changePassword, forgotPassword, updateUser } = require('../services/userService');

const router = express.Router();

router.get("/getUser/:id", getUser);
router.put("/updateUser/:id", updateUser);
router.put("/changeEmail/:id", changeEmail);
router.put("/changePassword/:id", changePassword);
router.post("/forgotPassword", forgotPassword);

module.exports = router;