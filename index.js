const express = require("express");
const path = require("path");
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const {
  checkForAuthenticationInCookie,
} = require("./middlewares/authentication");
const Blogs = require("./models/blog").Blog;

mongoose.connect("mongodb://localhost:27017/blogsvilla").then(() => {
  console.log("mongoDB connected!");
});

const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(cookieParser());
app.use(checkForAuthenticationInCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blogs.find({}).sort({ createdAt: -1 });
  return res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(PORT, () => {
  console.log(`server in running on port ${PORT}!`);
});
