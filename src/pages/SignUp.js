import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import "./SignUp.css";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const success = signUp(formData.name, formData.email, formData.password);
      if (success) {
        navigate("/profile");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return React.createElement(
    motion.div,
    { className: 'signup-container' },
    React.createElement(
      motion.div,
      { className: 'signup-form' },
      React.createElement('h1', { className: 'signup-title' }, 'Sign Up'),
      React.createElement(
        'form',
        { onSubmit: handleSubmit },
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
            className: errors.name ? 'input-error' : '',
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
            className: errors.email ? 'input-error' : '',
            required: true
          })
        ),
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement('label', { htmlFor: 'password' }, 'Password'),
          React.createElement('input', {
            type: 'password',
            id: 'password',
            name: 'password',
            value: formData.password,
            onChange: handleChange,
            className: errors.password ? 'input-error' : '',
            required: true
          })
        ),
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement('label', { htmlFor: 'confirmPassword' }, 'Confirm Password'),
          React.createElement('input', {
            type: 'password',
            id: 'confirmPassword',
            name: 'confirmPassword',
            value: formData.confirmPassword,
            onChange: handleChange,
            className: errors.confirmPassword ? 'input-error' : '',
            required: true
          })
        ),
        React.createElement(
          motion.button,
          {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            type: 'submit',
            className: 'signup-btn'
          },
          'Sign Up'
        )
      ),
      React.createElement('p', { className: 'signup-footer' }, 'Already have an account? ', React.createElement('a', { href: '/signin', className: 'link' }, 'Sign In'))
    )
  );
}

export default SignUp;
