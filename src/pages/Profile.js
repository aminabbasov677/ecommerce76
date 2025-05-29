import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./Profile.css";

function Profile() {
  const { state } = useCart();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [userInfo, setUserInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update localStorage with new user info
    const updatedUser = { ...user, ...userInfo };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    toast.success("Profile updated successfully!");
  };

  return React.createElement(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      className: "profile-container"
    },
    React.createElement(
      motion.div,
      {
        initial: { y: 20 },
        animate: { y: 0 },
        className: "profile-header"
      },
      React.createElement('h1', null, 'My Profile')
    ),
    React.createElement(
      'div',
      { className: 'profile-content' },
      React.createElement(
        'div',
        { className: 'profile-tabs' },
        React.createElement(
          'button',
          {
            className: `tab-btn ${activeTab === "profile" ? "active" : ""}`,
            onClick: () => setActiveTab("profile")
          },
          'Profile'
        ),
        React.createElement(
          'button',
          {
            className: `tab-btn ${activeTab === "orders" ? "active" : ""}`,
            onClick: () => setActiveTab("orders")
          },
          'Order History'
        ),
        React.createElement(
          'button',
          { className: 'tab-btn', onClick: signOut },
          'Sign Out'
        )
      ),
      activeTab === "profile" ? (
        React.createElement(
          motion.div,
          {
            initial: { x: -50 },
            animate: { x: 0 },
            className: 'profile-section'
          },
          React.createElement('h2', null, 'Personal Information'),
          React.createElement(
            'form',
            { onSubmit: handleSubmit },
            React.createElement(
              'div',
              { className: 'form-group' },
              React.createElement('label', { htmlFor: 'name' }, 'Name'),
              React.createElement(
                'input',
                {
                  type: 'text',
                  id: 'name',
                  value: userInfo.name,
                  onChange: (e) =>
                    setUserInfo({ ...userInfo, name: e.target.value })
                }
              )
            ),
            React.createElement(
              'div',
              { className: 'form-group' },
              React.createElement('label', { htmlFor: 'email' }, 'Email'),
              React.createElement(
                'input',
                {
                  type: 'email',
                  id: 'email',
                  value: userInfo.email,
                  onChange: (e) =>
                    setUserInfo({ ...userInfo, email: e.target.value })
                }
              )
            ),
            React.createElement(
              'div',
              { className: 'form-group' },
              React.createElement('label', { htmlFor: 'phone' }, 'Phone'),
              React.createElement(
                'input',
                {
                  type: 'tel',
                  id: 'phone',
                  value: userInfo.phone,
                  onChange: (e) =>
                    setUserInfo({ ...userInfo, phone: e.target.value })
                }
              )
            ),
            React.createElement(
              'div',
              { className: 'form-group' },
              React.createElement('label', { htmlFor: 'address' }, 'Address'),
              React.createElement(
                'textarea',
                {
                  id: 'address',
                  value: userInfo.address,
                  onChange: (e) =>
                    setUserInfo({ ...userInfo, address: e.target.value }),
                  rows: '3'
                }
              )
            ),
            React.createElement(
              motion.button,
              {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                type: 'submit',
                className: 'update-btn'
              },
              'Update Profile'
            )
          )
        )
      ) : (
        React.createElement(
          motion.div,
          {
            initial: { x: 50 },
            animate: { x: 0 },
            className: 'orders-section'
          },
          React.createElement('h2', null, 'Order History'),
          state.items.length > 0 ? (
            React.createElement(
              'div',
              { className: 'orders-list' },
              state.items.map((item) => (
                React.createElement(
                  'div',
                  { key: item.id, className: 'order-item' },
                  React.createElement('img', { src: item.image, alt: item.title }),
                  React.createElement(
                    'div',
                    { className: 'order-details' },
                    React.createElement('h3', null, item.title),
                    React.createElement('p', null, 'Quantity: ', item.quantity),
                    React.createElement('p', null, 'Price: $', item.price),
                    React.createElement('p', null, 'Total: $', (item.price * item.quantity).toFixed(2))
                  )
                )
              ))
            )
          ) : (
            React.createElement('p', { className: 'no-orders' }, 'No orders found.')
          )
        )
      )
    )
  );
}

export default Profile;
