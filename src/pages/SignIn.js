import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import "./SignIn.css";

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const success = signIn(formData.email, formData.password);
      if (success) {
        navigate("/profile");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return React.createElement('div', { className: 'signin-container' },
    React.createElement(motion.div, {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      className: 'signin-form'
    },
      React.createElement('h1', { className: 'signin-title' }, 'Sign In'),
      React.createElement('form', { onSubmit: handleSubmit },
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'email' }, 'Email'),
          React.createElement('input', {
            type: 'email',
            id: 'email',
            name: 'email',
            value: formData.email,
            onChange: handleChange,
            className: errors.email ? "input-error" : ""
          }),
          errors.email && React.createElement('p', { className: 'error-text' }, errors.email)
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'password' }, 'Password'),
          React.createElement('input', {
            type: 'password',
            id: 'password',
            name: 'password',
            value: formData.password,
            onChange: handleChange,
            className: errors.password ? "input-error" : ""
          }),
          errors.password && React.createElement('p', { className: 'error-text' }, errors.password)
        ),
        React.createElement(motion.button, {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          type: 'submit',
          className: 'signin-btn'
        }, 'Sign In')
      ),
      React.createElement('p', { className: 'signin-footer' },
        "Don't have an account? ",
        React.createElement('a', { href: '/signup', className: 'link' }, 'Sign Up')
      )
    )
  );
}

export default SignIn;
