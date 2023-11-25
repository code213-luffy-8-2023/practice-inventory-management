import "./App.css";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import { ProductsList } from "./pages/ProductsList";
import { EditProduct } from "./pages/EditProduct";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ProductsList />} />
        <Route path="/edit/:id" element={<EditProduct />} />
      </Routes>
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
