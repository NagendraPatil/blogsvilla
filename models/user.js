const { Schema, model } = require("mongoose");
const { randomBytes, createHmac } = require("node:crypto");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    pfpURL: {
      type: String,
      default: "/images/user-avatar.png",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPwd = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.password = hashedPwd;
  user.salt = salt;
  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found!");

    const hashedPassword = user.password;
    const salt = user.salt;
    const tempHashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    // console.log(tempHashedPassword === hashedPassword);
    if (!(tempHashedPassword === hashedPassword)) {
      throw new Error("Incorrect password!");
    } else {
      const token = createTokenForUser(user);
      return token;
    }
  }
);

const User = model("User", userSchema);

module.exports = User;
