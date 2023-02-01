import express from "express";
import User from "../models/User.js";
import {
  verifyTokenAndAuthorization,
  verifyTokenAndisAdmin,
} from "./verifyToken.js";

const router = express.Router();
//update

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({ status: true, data: updateUser });
  } catch (ex) {
    res.status(400).json({ status: false, message: "Cannot perform update" });
  }
});

//delete Users

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ status: sucess, message: "User has been sucessfully deleted" });
  } catch (ex) {
    res.status(400).json({ status: false, Error: ex });
  }
});

//get Users

router.get("/find/:id", verifyTokenAndisAdmin, async (req, res) => {
  try {
    const users = await User.findById(req.params.id);
    const { password, ...others } = users._doc;

    res.status(200).json({ status: true, data: others });
  } catch (ex) {
    res.status(400).json({ status: false, Error: ex });
  }
});
//Get all users
router.get("/allusers", verifyTokenAndisAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: 1 }).limit(5)
      : await User.find();
    res.status(200).json({ status: true, data: users });
  } catch (ex) {
    res.status(400).json({ status: false, message: "Not allowed to display" });
  }
});

router.get("/stats", async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: { _id: "$month", total: { $sum: 1 } },
      },
    ]);
    res.status(200).json({ status: true, data: data, message: "Ok xa ta" });
  } catch (ex) {
    res.status(400).json({ status: true, message: ex });
  }
});
export default router;
