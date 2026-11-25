const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"]
    },

    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: [true, "Password is required"]
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    refreshTokens: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Hide sensitive information from JSON response
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.refreshTokens;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("User", userSchema);