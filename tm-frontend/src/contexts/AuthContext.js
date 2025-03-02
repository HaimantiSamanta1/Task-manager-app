import React, { createContext, useState, useContext } from "react";
import { signUp } from "../api/authApi";

// Create Context
const AuthContext = createContext();

// Custom Hook to use Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const login = (token, user_id, email) => {
    console.log("Login function called with:", { token, user_id, email });
  
    if (!user_id) {
      console.error("Error: user_id is undefined");
      return;
    } 
    localStorage.setItem("token", token);
    localStorage.setItem("user_id", user_id) 
    setUser({ email,user_id });
   
  };
  
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const signup = async (email, password) => {
    try {
      console.log("Signup function called with:", email, password);
  
      const response = await signUp({ email, password });
  
      console.log("API Response:", response);
  
      if (response.data.Status) { // Check if registration was successful
        const { token, data } = response.data;
        localStorage.setItem("token", token);
        setUser(data);
        console.log("Signup successful, user stored:", data);
        return { success: true, message: response.data.message };
      } else {
        console.log("Signup failed:", response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || "Something went wrong" };
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout,signup  }}>
      {children}
    </AuthContext.Provider>
  );
};



