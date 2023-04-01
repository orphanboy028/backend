const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "please Tell us your name!"],
    },

    email: {
      type: String,
      require: [true, "Please Provide your email!"],
      unique: true,
    },
    mobileNumber: {
      type: Number,
      require: [true, "Please Provide your email!"],
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      require: [true, "please provide your password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      require: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el == this.password;
        },
        message: "confirm password didn't match",
      },
    },

    otp: String,
    otpTimestamp: Date,
    isActive: Boolean,
    otpgenerateToken: String,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.createOTPToken = function () {
  const UrlToken = crypto.randomBytes(32).toString("hex");
  this.otpgenerateToken = crypto
    .createHash("sha256")
    .update(UrlToken)
    .digest("hex");

  return UrlToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
