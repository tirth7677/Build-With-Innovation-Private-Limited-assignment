const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Person = require("../models/person.model");

const signUp = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const existingUser = await Person.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or phone already in use",
      });
    }
    const hashedPassword = await bcryptjs.hashSync(password, 10);
    const newPerson = new Person({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "User",
    });
    const data = await newPerson.save();
    const { password: pass, ...rest } = data._doc;
    res.status(201).json({
      success: true,
      message: "New User create succesfully",
      data: {
        rest,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(err.statuscode || 500).json({
      success: false,
      statuscode: err.statuscode || 500,
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    const User = await Person.findOne({ $or: [{ email }, { phone }] });
    if (!User) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or phone number or password",
      });
    }
    const passwordvalid = await bcryptjs.compareSync(password, User.password);
    if (!passwordvalid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or phone number or password",
      });
    }
    const token = jwt.sign(
      { Id: User._id, role: User.role },
      process.env.SECRETKEY,
      { expiresIn: "1h" }
    );
    const { password: pass, ...rest } = User._doc;
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token: token,
        user: { ...rest, role: User.role },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(err.statuscode || 500).json({
      success: false,
      statuscode: err.statuscode || 500,
      message: err.message,
    });
  }
};

module.exports = { signUp, login };