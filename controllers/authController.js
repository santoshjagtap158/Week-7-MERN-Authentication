const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/generateTokens");

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokens.push(refreshToken);
    await user.save();

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

// Refresh Access Token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token is required"
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(403).json({
        message: "Invalid refresh token"
      });
    }

    // Rotate refresh token
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshTokens = user.refreshTokens.filter(
      token => token !== refreshToken
    );

    user.refreshTokens.push(newRefreshToken);

    await user.save();

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired refresh token"
    });
  }
};

// Logout User
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token is required"
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.refreshTokens = user.refreshTokens.filter(
      token => token !== refreshToken
    );

    await user.save();

    res.status(200).json({
      message: "Logout successful"
    });

  } catch (error) {
    res.status(401).json({
      message: "Invalid refresh token"
    });
  }
};