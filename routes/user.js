const { Router } = require("express");
const User = require("../models/user");

const userRouter = Router();

userRouter.get("/signin", (req, res) => {
  return res.render("signin");
});

userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    // if (!token) return res.redirect("/user/signin");
    return res.cookie("token", token).redirect("/");
  } catch (err) {
    return res.render("signin", {
      Error: "Incorrect Email or Password!",
    });
  }
});

userRouter.get("/signup", (req, res) => {
  return res.render("signup");
});

userRouter.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;
  await User.create({ fullname, email, password });
  return res.redirect("/");
});

userRouter.get("/logout",(req,res)=>{
  return res.clearCookie("token").redirect("/");
})

module.exports = userRouter;