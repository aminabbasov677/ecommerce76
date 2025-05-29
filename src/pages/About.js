import React from "react";
import { motion } from "framer-motion";
import "./About.css";

function About() {
  return React.createElement('div', { className: 'about-container' },
    React.createElement(motion.div, {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      className: 'about-header'
    },
      React.createElement('h1', null, 'About Us'),
      React.createElement('p', null, 'Your Trusted E-Commerce Platform')
    ),
    React.createElement('div', { className: 'about-content' },
      React.createElement(motion.section, {
        initial: { x: -50 },
        animate: { x: 0 },
        className: 'about-section'
      },
        React.createElement('h2', null, 'Our Vision'),
        React.createElement('p', null,
          'We strive to provide the best shopping experience with cutting-edge technology and exceptional customer service. Our platform brings together quality products and satisfied customers.'
        )
      ),
      React.createElement(motion.section, {
        initial: { x: 50 },
        animate: { x: 0 },
        className: 'about-section'
      },
        React.createElement('h2', null, 'Why Choose Us'),
        React.createElement('ul', null,
          React.createElement('li', null, 'Wide selection of products'),
          React.createElement('li', null, 'Secure payment system'),
          React.createElement('li', null, 'Fast delivery worldwide'),
          React.createElement('li', null, '24/7 customer support')
        )
      ),
      React.createElement(motion.section, {
        initial: { y: 50 },
        animate: { y: 0 },
        className: 'about-section'
      },
        React.createElement('h2', null, 'Our Technology'),
        React.createElement('p', null,
          'Built with modern web technologies including React, Node.js, and MongoDB, our platform ensures a smooth and responsive shopping experience.'
        )
      )
    )
  );
}

export default About;
