import express from "express";
import Product from "../models/Product.js";
import {
  verifyTokenAndAuthorization,
  verifyTokenAndisAdmin,
} from "./verifyToken.js";

const router = express.Router();

//CREATE PRODUCTS

router.post("/", verifyTokenAndisAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json({ status: true, data: savedProduct });
  } catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

//UPDATE PRODUTS

router.put("/:id", verifyTokenAndisAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({ status: true, data: updatedProduct });
  } catch (ex) {
    res.status(400).json({ status: false, message: "Cannot perform update" });
  }
});

// DELETE PRODUCT

router.delete("/:id", verifyTokenAndisAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: sucess,
      message: "Producct  has been sucessfully deleted",
    });
  } catch (ex) {
    res.status(400).json({ status: false, Error: ex });
  }
});

//Get INDIVIDUAL products

router.get("/find/:id", async (req, res) => {
  try {
    const products = await Product.findById(req.params.id);

    res.status(200).json({ status: true, data: products });
  } catch (ex) {
    res.status(400).json({ status: false, Error: ex });
  }
});

//Get all products

router.get("/allproducts", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json({ status: true, data: products });
  } catch (ex) {
    res.status(400).json({ status: false, message: "Not allowed to display" });
  }
});

export default router;
