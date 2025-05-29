import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signUp = (name, email, password) => {
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    if (existingUsers.some((u) => u.email === email)) {
      toast.error("Email already registered!");
      return false;
    }

    const newUser = { name, email, password };
    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    toast.success("Sign up successful!");
    return true;
  };

  const signIn = (email, password) => {
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = existingUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      localStorage.setItem("user", JSON.stringify(foundUser));
      setUser(foundUser);
      toast.success("Sign in successful!");
      return true;
    } else {
      toast.error("Invalid email or password!");
      return false;
    }
  };

  const signOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Signed out successfully!");
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, signUp, signIn, signOut } },
    children
  );
};

export const useAuth = () => useContext(AuthContext);
