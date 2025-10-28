require("dotenv").config() // prefer on top

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middleware/auth");
const Blog = require("./models/blog");

const app = express();
const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public"))) // for accessing img/files


// connect db
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log(err));

// routes
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({}).sort("-createdAt"); 
  // minus(-) -> descending sort
  return res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
