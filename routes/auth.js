import express from "express";
import User from "../models/User.js";
import CryptoJS from "crypto-js";
import Jwt from "jsonwebtoken";

const router = express.Router();

//Register
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).json({ status: true, data: savedUser });
  } catch (ex) {
    res.status(400).json({ status: false, message: ex });
  }
});

//loginn

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res
        .status(400)
        .json({ stautus: false, message: "Wrong Credentitals" });
    }
    const Originalpassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    ).toString(CryptoJS.enc.Utf8);
    if (Originalpassword !== req.body.password) {
      return res
        .status(400)
        .json({ status: false, message: "Wrong Credentals" });
    }
    const accessToken = Jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );
    const { password, ...others } = user._doc;

    res.status(200).json({
      status: true,
      message: "Sucessfully logged in",
      data: others,
      token: accessToken,
    });
  } catch (ex) {
    res.status(400).json({ status: false, Error: ex });
  }
});

export default router;
