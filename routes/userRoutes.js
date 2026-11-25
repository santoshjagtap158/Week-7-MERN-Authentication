const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile
} = require("../controllers/userController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const User = require("../models/User");

// Get All Users (Admin Only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      count: users.length,
      users
    });

  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch users"
    });
  }
};

// Get Own Profile
router.get("/profile", protect, getProfile);

// Update Own Profile
router.put("/profile", protect, updateProfile);

// Get Users (Admin Only)
router.get(
  "/users",
  protect,
  authorizeRoles("admin"),
  getAllUsers
);

// Admin Dashboard Users
router.get(
  "/admin/users",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const users = await User.find();

      res.status(200).json({
        admin: req.user.name,
        count: users.length,
        users
      });

    } catch (error) {
      res.status(500).json({
        message: "Unable to fetch users"
      });
    }
  }
);

module.exports = router;