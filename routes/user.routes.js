const express = require("express");
const verifyToken = require("../utils/jwtverify");
const router = express.Router();
const { getOneUserData ,modifyUserDetails,deleteUser } = require("../controllers/user.controller");
const { userroleverify } = require("../utils/roleverify");

router.get("/:id", verifyToken, userroleverify, getOneUserData);
router.put("/:id", verifyToken, userroleverify, modifyUserDetails);
router.delete("/:id", verifyToken, userroleverify, deleteUser);

module.exports = router;