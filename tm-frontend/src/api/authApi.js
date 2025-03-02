import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/user";
const TASK_API_BASE_URL = "http://localhost:5000/api/task";

export const signUp = async (userData) => {
  return await axios.post(`${API_BASE_URL}/registration`, userData);
};

export const signIn = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/loginUser`, userData);
    console.log("Full API Response:", response.data);

    if (response.data.status) {
      console.log("Extracted Token:", response.data.accessToken);
      console.log("Extracted User ID:", response.data.user_id, typeof response.data.user_id);

    }

    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};


export const createTask = async (taskData) => {
  try {
    const token = localStorage.getItem("token"); 

    if (!token) {
      throw new Error("No token found. Please login again!");
    }

    const response = await axios.post(`${TASK_API_BASE_URL}/createTask`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("API Response:", response.data); 
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error.response?.data || error.message);
    throw error;
  }
};


export const getTasksByUser = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found. Please log in again.");
    }

    const response = await axios.get(`${TASK_API_BASE_URL}/getTaskByUser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; 
  } catch (error) {
    console.error("Error fetching tasks:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please log in again.");

    const response = await axios.delete(`${TASK_API_BASE_URL}/deleteTask/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error.response?.data || error.message);
    throw error;
  }
};



export const updateTaskStatus = async (taskId, status) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found. Please log in again.");
    }

    const response = await axios.put(
      `${TASK_API_BASE_URL}/updateTask/${taskId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating task status:", error.response?.data || error.message);
    throw error;
  }
};

export const updateTask = async (taskId, updatedTaskData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found. Please log in again.");
    }

    const response = await axios.put(
      `${TASK_API_BASE_URL}/updateTask/${taskId}`,
      updatedTaskData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Task updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error.response?.data || error.message);
    throw error;
  }
};

