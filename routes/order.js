import express from "express";

import Order from "../models/Order.js";
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndisAdmin,
} from "./verifyToken.js";

const router = express.Router();

//CREATE Order

router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  //   console.log(newOrder);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json({ status: true, data: savedOrder });
  } catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

//UPDATE Order

router.put("/:id", verifyTokenAndisAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({ status: true, data: updatedOrder });
  } catch (ex) {
    res.status(400).json({ status: false, message: "Cannot perform update" });
  }
});

// // DELETE Order

router.delete("/:id", verifyTokenAndisAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: sucess,
      message: "Cart  has been sucessfully deleted",
    });
  } catch (ex) {
    res.status(400).json({ status: false, Error: ex });
  }
});

// //Get INDIVIDUAL user Order

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });

    res.status(200).json({ status: true, data: orders });
  } catch (ex) {
    res.status(400).json({ status: false, Error: ex });
  }
});

// //Get all

router.get("/all", verifyTokenAndisAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ status: true, data: orders });
  } catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

// GET MONTHLY Income

router.get("/incomes", verifyTokenAndisAdmin, async (req, res) => {
  const date = new Date(); // todays date eg september
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1)); //august
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1)); //july
  //   console.log(previousMonth);
  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json({ status: true, income });
  } catch (err) {
    res.status(400).json({ status: false, error: err, message: "fail bbhay" });
  }
});

export default router;
