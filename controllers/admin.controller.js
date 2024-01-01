const Person = require("../models/person.model");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const viewAllUser = async (req, res) => {
  try {
    const users = await Person.find({ role: "User" });

    res.json({
      success: true,
      message: "All users retrieved successfully",
      users: users,
    });
  } catch (err) {
    console.error("Error in viewalluser:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const modifyOneUser = async (req, res) => {
  const userId = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const user = await Person.findById(userId);

    const allowedFields = ["name", "email", "phone", "profileImage"];
    allowedFields.forEach((field) => {
      if (req.body[field]) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.json({
      success: true,
      message: "User details modified successfully",
      user: user,
    });
  } catch (err) {
    console.error("Error in modifyoneuser:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteAllUser = async (req, res) => {
  try {
    const result = await Person.deleteMany({ role: "User" });

    res.json({
      success: true,
      message: `${result.deletedCount} users with role 'User' deleted successfully`,
    });
  } catch (err) {
    console.error("Error in deletealluser:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const createAdmin = async (req, res) => {
  try {
    const hashedPassword = await bcryptjs.hash(req.body.password, 10);
    const newAdmin = new Person({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      role: "Admin",
    });
    await newAdmin.save();

    res.json({
      success: true,
      message: "Admin user created successfully",
      user: newAdmin,
    });
  } catch (err) {
    console.error("Error in createAdmin:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { viewAllUser, modifyOneUser, deleteAllUser, createAdmin };