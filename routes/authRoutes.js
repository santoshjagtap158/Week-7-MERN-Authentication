const express = require("express");
const router = express.Router();

const {
  registerUser,
  login,
  refreshToken,
  logout
} = require("../controllers/authController");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", login);

// Refresh Access Token
router.post("/refresh-token", refreshToken);

// Logout
router.post("/logout", logout);

module.exports = router;