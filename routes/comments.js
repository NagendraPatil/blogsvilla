const { Router } = require("express");
const { Comment } = require("../models/comments");
const CommentRouter = Router();

CommentRouter.post("/comment/:blogId",async(req,res)=>{
    const comment = await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });
    return res.redirect("/blog/"+req.params.blogId);
})

module.exports={CommentRouter};