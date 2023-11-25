import express from "express";
import cors from "cors";
import { connectToDB } from "./models/db.js";
import { productsRouter } from "./routes/products.routes.js";

connectToDB();

const app = express();

// use cors middleware
app.use(cors());

// use json middleware
app.use(express.json());

app.use("/api/products", productsRouter);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
