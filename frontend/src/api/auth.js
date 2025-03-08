import axios from "axios";

const API_URL = "/api/users"; 

// Register user
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        console.error("Registration error:", error.response?.data?.message || error.message);
        return { error: error.response?.data?.message || "Something went wrong" };
    }
};

// Login user
export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData);
        return response.data; 
    } catch (error) {
        return { error: error.response?.data?.error || "Login failed" };
    }
};
