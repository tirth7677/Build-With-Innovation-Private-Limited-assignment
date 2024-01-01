const Person = require("../models/person.model");

const getOneUserData = async (req, res) => {
  const requestedUserId = req.params.id;
  const authenticatedUserId = req.user ? req.user._id : null;
  const rawId = authenticatedUserId.toString();
  try {
    const user = await Person.findById(requestedUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (rawId !== requestedUserId) {
      console.log("Access denied. User IDs do not match.");
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not authorized to view this user.",
      });
    }

    res.json({
      success: true,
      message: "User data retrieved successfully",
      user: user,
    });
  } catch (err) {
    console.error("Error in getoneuserdata:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const modifyUserDetails = async (req, res) => {
  const requestedUserId = req.params.id;
  const authenticatedUserId = req.user ? req.user._id : null;
  const rawId = authenticatedUserId.toString();
  if (rawId !== requestedUserId) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You are not authorized to modify details for this user.",
    });
  }
  const allowedFields = ["name", "profileImage"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) => allowedFields.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({
      success: false,
      message: "Invalid updates. Only name and profile image can be modified.",
    });
  }

  try {
    const user = await Person.findByIdAndUpdate(requestedUserId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      message: "User details modified successfully",
      user: user,
    });
  } catch (err) {
    console.error("Error in modifyUserDetails:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteUser = async (req, res) => {
  const requestedUserId = req.params.id;
  const authenticatedUserId = req.user ? req.user._id : null;
  const rawId = authenticatedUserId.toString();
  if (rawId !== requestedUserId) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You are not authorized to delete this user.",
    });
  }

  try {
    const user = await Person.findByIdAndDelete(requestedUserId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      message: "User account deleted successfully",
      user: user,
    });
  } catch (err) {
    console.error("Error in deleteUser:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { getOneUserData, modifyUserDetails ,deleteUser };