const { Router } = require("express");
const User = require("../models/user");
const { createHmac } = require("crypto");

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("signup", { error: "Email already registered." });
    }
    await User.create({ fullName, email, password });
    return res.redirect("/user/signin");
  } catch (err) {
    console.error(err);
    return res.render("signup", { error: "Something went wrong. Try again." });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    // 7 days for cookie expiry
    return res
      .cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 })
      .redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});
module.exports = router;
