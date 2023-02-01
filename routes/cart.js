import express from "express";

import Cart from "../models/Cart.js";
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndisAdmin,
} from "./verifyToken.js";

const router = express.Router();

//CREATE CARTS

router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json({ status: true, data: savedCart });
  } catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

//UPDATE CARTS

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({ status: true, data: updatedCart });
  } catch (ex) {
    res.status(400).json({ status: false, message: "Cannot perform update" });
  }
});

// // DELETE CART

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: sucess,
      message: "Cart  has been sucessfully deleted",
    });
  } catch (ex) {
    res.status(400).json({ status: false, Error: ex });
  }
});

// //Get INDIVIDUAL user cart

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const carts = await Cart.findOne({ userId: req.params.userId });

    res.status(200).json({ status: true, data: carts });
  } catch (ex) {
    res.status(400).json({ status: false, Error: ex });
  }
});

// //Get all

router.get(
  "/all",
  //  verifyTokenAndisAdmin,

  async (req, res) => {
    try {
      const carts = await Cart.find();
      res.status(200).json({ status: true, data: carts });
    } catch (err) {
      res.status(400).json({ status: false, message: err });
    }
  }
);

export default router;
