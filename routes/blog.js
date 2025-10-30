const { Router } = require("express");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const upload = require("../middleware/multer");
const uploadCloudinary = require("../services/cloudinary");
const router = Router();

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  try {
    const coverImageLocalPath = req.file.path;
  if (!coverImageLocalPath) throw new Error("Image is required");
  const coverImage = await uploadCloudinary(coverImageLocalPath);
  // console.log(req.file)
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    coverImageURL: coverImage?.url || "",
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${blog._id}`);
  }
  catch (error) {
    console.log("error creating blog", error) 
  }
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate(
      "createdBy"
    );

    console.log("comments : ", comments);
    console.log("blog", blog);
    // .populate() will bring the object of user to which it was pointing
    return res.render("blog", {
      user: req.user,
      blog,
      comments,
    });
  } catch (error) {
    console.log("/:id error", error);
    res.status(500).send("server error");
  }
});

// comment routes
router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;
