const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
