import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const getAllProducts = async () => {
  const res = await fetch("http://localhost:3000/api/products");
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data?.mesage || "Something went wrong");
  }
  console.log(res);
  const data = await res.json();

  return data.data;
};

export function ProductsList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts()
      .then((products) => setProducts(products))
      .catch((e) => {
        toast.error(e.message || "Something went wrong");
      });
  }, []);

  const [busy, setBusy] = useState(false);

  return (
    <div>
      <div className="flex justify-between max-w-5xl m-auto items-center">
        <h1 className="text-3xl font-extrabold text-primary py-6">Products</h1>
        <Link to="/edit/new" className="btn btn-primary btn-sm">
          New Product
        </Link>
      </div>
      <div className="overflow-x-auto max-w-5xl m-auto">
        <table className="table table-zebra border border-base-content">
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => {
              return (
                <tr key={p.id}>
                  <td className="">{p.name}</td>
                  <td className="w-full">{p.description}</td>
                  <td>{p.quantity}</td>
                  <td>{p.price}</td>
                  <td>
                    <div className="flex gap-2 items-center h-full">
                      <Link
                        to={`/edit/${p.id}`}
                        className="btn btn-sm btn-primary"
                      >
                        Edit
                      </Link>
                      <button
                        disabled={busy}
                        onClick={async () => {
                          setBusy(true);
                          async function handler() {
                            const res = await fetch(
                              `http://localhost:3000/api/products/${p.id}`,
                              {
                                method: "DELETE",
                              }
                            );
                            if (res.ok) {
                              const newProducts = products.filter(
                                (product) => product.id !== p.id
                              );
                              setProducts(newProducts);
                            } else {
                              throw new Error("Something went wrong");
                            }
                          }

                          await toast
                            .promise(handler(), {
                              loading: "Deleting...",
                              success: "Product deleted",
                              error: (e) =>
                                e.message || "Could not delete product",
                            })
                            .finally(() => setBusy(false));
                        }}
                        className="btn btn-sm btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
