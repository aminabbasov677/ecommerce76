import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import "./AddProduct.css";

function AddProduct() {
  const [productInfo, setProductInfo] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductInfo({ ...productInfo, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    if (
      !productInfo.title ||
      !productInfo.price ||
      !productInfo.description ||
      !productInfo.category ||
      !productInfo.image
    ) {
      toast.error("Please fill in all fields!");
      return;
    }

    // Store product in localStorage
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    const newProduct = {
      id: products.length + 1,
      ...productInfo,
      price: parseFloat(productInfo.price),
    };
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));

    // Reset form
    setProductInfo({
      title: "",
      price: "",
      description: "",
      category: "",
      image: "",
    });

    toast.success("Product added successfully!");
  };

  return (
    <motion.div
      initial={{ x: 50 }}
      animate={{ x: 0 }}
      className="add-product-container"
    >
      <h2>Add New Product</h2>
      <div className="form-group">
        <label htmlFor="title">Product Title</label>
        <input
          type="text"
          id="title"
          value={productInfo.title}
          onChange={(e) =>
            setProductInfo({ ...productInfo, title: e.target.value })
          }
        />
      </div>
      <div className="form-group">
        <label htmlFor="price">Price ($)</label>
        <input
          type="number"
          id="price"
          value={productInfo.price}
          onChange={(e) =>
            setProductInfo({ ...productInfo, price: e.target.value })
          }
          step="0.01"
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={productInfo.description}
          onChange={(e) =>
            setProductInfo({ ...productInfo, description: e.target.value })
          }
          rows="4"
        />
      </div>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input
          type="text"
          id="category"
          value={productInfo.category}
          onChange={(e) =>
            setProductInfo({ ...productInfo, category: e.target.value })
          }
        />
      </div>
      <div className="form-group">
        <label htmlFor="image">Product Image</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
        />
        {productInfo.image && (
          <img
            src={productInfo.image}
            alt="Preview"
            className="image-preview"
          />
        )}
      </div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="add-product-btn"
        onClick={handleAddProduct}
      >
        Add Product
      </motion.div>
    </motion.div>
  );
}

export default AddProduct;