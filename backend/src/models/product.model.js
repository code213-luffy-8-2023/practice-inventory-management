import mongoose from "mongoose";

export const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide product name"],
  },
  description: {
    type: String,
    required: [true, "Please provide product description"],
  },
  price: {
    type: Number,
    required: [true, "Please provide product price"],
  },
  quantity: {
    type: Number,
    required: [true, "Please provide product quantity"],
  },
});

// override toJSON method to hide version and _id
ProductSchema.methods.toJSON = function () {
  var obj = this.toObject();
  obj.id = obj._id;
  delete obj.__v;
  delete obj._id;
  return obj;
};

export const ProductModel = mongoose.model("Product", ProductSchema);
