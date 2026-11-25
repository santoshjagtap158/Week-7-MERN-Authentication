const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      user
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Update Name
    if (name) {
      user.name = name;
    }

    // Update Password
    if (currentPassword || newPassword) {

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message: "Current and new password are required"
        });
      }

      const isMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isMatch) {
        return res.status(401).json({
          message: "Current password is incorrect"
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          message: "New password must be at least 8 characters"
        });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};