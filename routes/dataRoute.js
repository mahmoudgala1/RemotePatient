const express = require("express");
const { getAllData, getDataById, sendData, deleteAllData, deleteDataById } = require("../services/dataService");
const router = express.Router();
router.get("/getAllData", getAllData);
router.get("/getDataById/:id", getDataById);
router.post("/sendData/:id", sendData);
router.delete("/deleteAllData", deleteAllData);
router.delete("/deleteDataById/:id", deleteDataById);
module.exports = router;