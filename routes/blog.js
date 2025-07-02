const { Router } = require("express");
const multer = require("multer");
const BlogRouter = Router();

const Blog = require("../models/blog").Blog;
const Comment = require("../models/comments").Comment;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/uploads/`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

BlogRouter.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

BlogRouter.post("/", upload.single("coverImageURL"), async (req, res) => {
  // console.log(req.body, req.file);
  const blog = await Blog.create({
    title: req.body.title,
    content: req.body.content,
    coverImageURL: req.file ? `/uploads/${req.file.filename}` : null,
    createdBy: req.user._id,
  });

  return res.redirect("/blog/" + blog._id);
});

BlogRouter.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
  return res.render("blog", {
    user: req.user,
    blog: blog,
    comments:comments
  });
});

BlogRouter.post("/comment/:blogId", async (req, res) => {
  const comment = await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect("/blog/" + req.params.blogId);
});

module.exports = BlogRouter;
