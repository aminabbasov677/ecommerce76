import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    toast.success("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return React.createElement(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      className: 'contact-container'
    },
    React.createElement(
      motion.div,
      {
        initial: { y: 20 },
        animate: { y: 0 },
        className: 'contact-header'
      },
      React.createElement('h1', null, 'Contact Us'),
      React.createElement('p', null, "We'd love to hear from you")
    ),
    React.createElement(
      'div',
      { className: 'contact-content' },
      React.createElement(
        motion.div,
        {
          initial: { x: -50 },
          animate: { x: 0 },
          className: 'contact-info'
        },
        React.createElement('h2', null, 'Get in Touch'),
        React.createElement(
          'div',
          { className: 'info-item' },
          React.createElement('h3', null, 'Email'),
          React.createElement('p', null, 'support@ecommerce.com')
        ),
        React.createElement(
          'div',
          { className: 'info-item' },
          React.createElement('h3', null, 'Phone'),
          React.createElement('p', null, '+1 (555) 123-4567')
        ),
        React.createElement(
          'div',
          { className: 'info-item' },
          React.createElement('h3', null, 'Address'),
          React.createElement('p', null, '123 E-Commerce Street\nNew York, NY 10001')
        )
      ),
      React.createElement(
        motion.form,
        {
          initial: { x: 50 },
          animate: { x: 0 },
          className: 'contact-form',
          onSubmit: handleSubmit
        },
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement('label', { htmlFor: 'name' }, 'Name'),
          React.createElement('input', {
            type: 'text',
            id: 'name',
            name: 'name',
            value: formData.name,
            onChange: handleChange,
            required: true
          })
        ),
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement('label', { htmlFor: 'email' }, 'Email'),
          React.createElement('input', {
            type: 'email',
            id: 'email',
            name: 'email',
            value: formData.email,
            onChange: handleChange,
            required: true
          })
        ),
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement('label', { htmlFor: 'message' }, 'Message'),
          React.createElement('textarea', {
            id: 'message',
            name: 'message',
            value: formData.message,
            onChange: handleChange,
            required: true,
            rows: 5
          })
        ),
        React.createElement(
          motion.button,
          {
            type: 'submit',
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 }
          },
          'Send Message'
        )
      )
    )
  );
};

export default Contact;
