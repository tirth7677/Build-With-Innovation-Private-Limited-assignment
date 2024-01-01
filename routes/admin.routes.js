const express = require("express");
const verifyToken = require("../utils/jwtverify");
const router = express.Router();
const { viewAllUser, modifyOneUser, deleteAllUser, createAdmin} = require("../controllers/admin.controller");
const { adminroleverify } = require("../utils/roleverify");

router.get("/", verifyToken, adminroleverify, viewAllUser);
router.put("/:id",verifyToken, adminroleverify, modifyOneUser);
router.delete("/",verifyToken, adminroleverify, deleteAllUser);
router.post("/createadmin", verifyToken, adminroleverify, createAdmin);

module.exports = router;