import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import "./MyProducts.css";

function MyProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from localStorage
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(storedProducts);
  }, []);

  const handleDelete = (productId) => {
    // Remove product from localStorage
    const updatedProducts = products.filter(product => product.id !== productId);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
    toast.success("Product deleted successfully!");
  };

  return (
    <motion.div
      initial={{ x: 50 }}
      animate={{ x: 0 }}
      className="my-products-container"
    >
      <h2>My Products</h2>
      {products.length > 0 ? (
        <div className="products-list">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <img src={product.image} alt={product.title} />
              <div className="product-details">
                <h3>{product.title}</h3>
                <p>Price: ${product.price.toFixed(2)}</p>
                <p>Description: {product.description}</p>
                <p>Category: {product.category}</p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="delete-btn"
                  onClick={() => handleDelete(product.id)}
                  aria-label="Delete product"
                >
                  <FaTrash />
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-products">No products found.</p>
      )}
    </motion.div>
  );
}

export default MyProducts;