import React from "react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import "./Cart.css";

function Cart() {
  const { state, dispatch } = useCart();
  console.log("Cart State:", state); // Debug log

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity: newQuantity } });
    toast.success(`Quantity updated to ${newQuantity}`);
  };

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
    toast.success("Item removed from cart");
  };

  if (!state.items.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="cart-container"
      >
        <h2 className="cart-title">Your Cart</h2>
        <p className="empty-cart">Your cart is empty.</p>
        <a href="/" className="continue-shopping">
          Continue Shopping
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="cart-container"
    >
      <h2 className="cart-title">Your Cart</h2>
      <div className="cart-items">
        {state.items.map((item) => (
          <motion.div
            key={item.id}
            className="cart-item"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="item-image">
              <img src={item.image} alt={item.title} />
            </div>
            <div className="item-details">
              <h3 className="item-title">{item.title}</h3>
              <p className="item-price">${item.price.toFixed(2)}</p>
              <div className="quantity-controls">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="quantity-btn"
                  aria-label="Decrease quantity"
                >
                  <FaMinus />
                </motion.button>
                <span className="quantity">{item.quantity}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="quantity-btn"
                  aria-label="Increase quantity"
                >
                  <FaPlus />
                </motion.button>
              </div>
            </div>
            <p className="item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => removeFromCart(item.id)}
              className="remove-btn"
              aria-label="Remove item"
            >
              <FaTrash />
            </motion.button>
          </motion.div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="summary-row total">
          <span>Total:</span>
          <span>${state.total.toFixed(2)}</span>
        </div>
        <motion.a
          href="/Checkout"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="checkout-btn"
        >
          Proceed to Checkout
        </motion.a>
      </div>
    </motion.div>
  );
}

export default Cart;