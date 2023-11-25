import { Router } from "express";
import { ProductModel } from "../models/product.model.js";

export const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  try {
    const query = req.query;

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;
    const name = query.name || undefined;

    const dbQuery = {};
    if (name) {
      // partial text search
      dbQuery.name = { $regex: name, $options: "i" };
    }

    const count = await ProductModel.countDocuments(dbQuery);
    const products = await ProductModel.find(dbQuery).skip(skip).limit(limit);

    const maxPages = Math.ceil(count / limit);

    res.json({
      maxPages: maxPages,
      page: page,
      limit: limit,
      data: products,
    });
  } catch (e) {
    // TODO: don't send the error message in production
    res.status(500).json({
      message: e.message,
    });
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const product = req.body;
    if (
      !product.name ||
      !product.description ||
      !product.price ||
      !product.quantity
    ) {
      res.status(400).json({
        message: "Please provide all required fields",
      });
    }
    let newProduct = new ProductModel({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
    });

    await newProduct.save();

    res.json(newProduct);
  } catch (e) {
    res.status(500).json({
      // TODO: don't send the error message in production
      message: e.message,
    });
  }
});

productsRouter.get("/:id", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        message: "Product not found",
      });
    } else {
      res.json(product);
    }
  } catch (e) {
    // TODO: don't send the error message in production
    res.status(500).json({
      message: e.message,
    });
  }
});

productsRouter.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const data = req.body;

    const product = await ProductModel.findById(id);

    if (!product) {
      res.status(404).json({
        message: "Product not found",
      });
    } else {
      if (data.name) {
        product.name = data.name;
      }
      if (data.description) {
        product.description = data.description;
      }
      if (data.price) {
        product.price = data.price;
      }
      if (data.quantity) {
        product.quantity = data.quantity;
      }
      await product.save();

      res.json(product);
    }
  } catch (e) {
    res.status(500).json({
      // TODO: don't send the error message in production
      // this is usually a bad idea, but we can do it for now
      // This could leak sensitive information about our application
      message: e.message,
    });
  }
});

productsRouter.delete("/:id", async (req, res) => {
  await ProductModel.findByIdAndDelete(req.params.id).then((product) => {
    if (product) {
      res.json({
        message: "Product deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  });
});
