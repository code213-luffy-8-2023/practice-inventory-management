import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const getProduct = async (id) => {
  if (id == "new") return null;
  const res = await fetch(`http://localhost:3000/api/products/${id}`);
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data?.mesage || "Something went wrong");
  }

  const data = await res.json();

  return data;
};

export function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    quantity: "",
    price: "",
  });

  useEffect(() => {
    getProduct(id)
      .then((product) => {
        if (product) setProduct(product);
      })
      .catch((e) => {
        toast.error(e.message || "Something went wrong");
      });
  }, [id]);

  return (
    <div className=" max-w-5xl m-auto p-4">
      <h1 className="text-3xl font-extrabold text-primary text-center py-6 border-b-2 mb-6 border-b-primary">
        {product.id ? "Edit" : "New"} Product
      </h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log(product);

          const isNew = product.id === undefined;

          const res = await fetch(
            `http://localhost:3000/api/products/${isNew ? "" : id}`,
            {
              method: isNew ? "POST" : "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(product),
            }
          );

          if (!res.ok) {
            toast.error("Something went wrong");
            return;
          } else {
            toast.success("Product saved successfully");
            const data = await res.json();
            setProduct(data);
            if (isNew) {
              navigate(`/edit/${data.id}`);
            }
          }
        }}
        className="flex flex-col gap-2"
      >
        <input
          required
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          type="text"
          placeholder="Name"
          className="input input-bordered"
        />
        <textarea
          required
          type="text"
          placeholder="Description"
          className="textarea textarea-bordered"
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
        />
        <input
          required
          type="number"
          placeholder="Quantity"
          className="input input-bordered"
          value={product.quantity}
          onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
        />
        <input
          required
          type="number"
          placeholder="Price"
          className="input input-bordered"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
        />
        <button className="btn btn-primary">Update</button>
        <Link to="/" className="link link-primary text-center w-full">
          Back
        </Link>
      </form>
    </div>
  );
}
