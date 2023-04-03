const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const superAdminSchema = new mongoose.Schema(
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
      default: "Super-admin",
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
    isActive: Boolean,
  },
  { timestamps: true }
);

superAdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// check password is correct
superAdminSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);

module.exports = SuperAdmin;
