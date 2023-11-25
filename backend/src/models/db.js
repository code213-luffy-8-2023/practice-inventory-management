import mongoose from "mongoose";

export async function connectToDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/inventory-management");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
}
