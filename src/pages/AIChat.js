import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa6";
import "./AIChat.css";

const AIChat = () => {
  const { state } = useLocation();
  const product = state?.product;
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const getAIResponse = async (userInput) => {
    try {
      setIsLoading(true);
  
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBbtMa5ZHxO9zQroMqKz_2Bu6sTtbQLdqY',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: userInput
                  }
                ]
              }
            ]
          })
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
  
      const data = await response.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  
      return aiText || "I'm here to help with your shopping needs. What would you like to know?";
    } catch (error) {
      console.error('Error getting AI response:', error);
  
      // fallback mock replies
      const mockResponses = {
        "hello": "Hello! I'm your AI shopping assistant. How can I help you today?",
        "hi": "Hi there! I'm here to help with your shopping needs. What would you like to know?",
        "help": "I can help you with:\n- Product information and details\n- Shopping recommendations\n- Price comparisons\n- General questions about our store\nWhat would you like to know?",
        "price": "Our prices are competitive and we offer regular discounts. Would you like to see our current deals?",
        "shipping": "We offer fast shipping options:\n- Standard delivery (3-5 business days)\n- Express delivery (1-2 business days)\n- Free shipping on orders over $50",
        "return": "We have a 30-day return policy. Items must be unused and in original packaging. Would you like me to explain the return process?"
      };
  
      const lower = userInput.toLowerCase();
      for (const [key, value] of Object.entries(mockResponses)) {
        if (lower.includes(key)) {
          return value;
        }
      }
  
      return "I'm here to help with your shopping needs. You can ask me about products, prices, shipping, returns, or anything else related to our store. What would you like to know?";
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const response = await getAIResponse(input);
    const aiMessage = { id: Date.now() + 1, text: response, sender: "ai" };
    setMessages((prev) => [...prev, aiMessage]);
  };

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="ai-chat-container"
    >
      <div className="chat-header">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="back-button"
          aria-label="Go back"
        >
          <FaArrowLeft />
        </motion.button>
        <h1 className="chat-title">AI Assistant</h1>
      </div>
      <div className="chat-messages">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            className={`message ${msg.sender === "user" ? "user-message" : "ai-message"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <p>{msg.text}</p>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            className="message ai-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p>Thinking...</p>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <motion.form
        onSubmit={handleSubmit}
        className="chat-input-form"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="chat-input"
          rows="2"
          disabled={isLoading}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="send-button"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default AIChat;