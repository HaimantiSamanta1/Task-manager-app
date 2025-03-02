import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Dashboard.css";
import plusIcon from "../Assets/Plus.png";
import { createTask,getTasksByUser, updateTaskStatus,deleteTask,updateTask } from "../api/authApi";

const Dashboard = () => {
  const { user ,logout } = useAuth();
  const [selectedSection, setSelectedSection] = useState("Inbox");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [priority, setPriority] = useState(""); 
  const [dueDate, setDueDate] = useState(""); 
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");  

  const menuItems = ["Inbox", "Today", "Upcoming", "Completed"];

  useEffect(() => {
    fetchTasks();
  }, []);
  
  const fetchTasks = async () => {
    try {
      const response = await getTasksByUser();
      console.log("Fetched Tasks Response:", response);
      if (response && response.data && response.data.tasks) {  
        setTasks(response.data.tasks);       
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error.message);
    }
  };
  
  const handleAddTask = () => {
    setShowTaskModal(true);
  };

  const handleCreateTask = async () => {
    if (!taskTitle.trim()) {
      alert("Task title is required!");
      return;
    }
    if (!dueDate) {
      alert("Date is required!");
      return;
    }
    const user_id = localStorage.getItem("user_id");
    console.log("Retrieved User ID from localStorage:", user_id);
    if (!user_id) {
      alert("User ID not found. Please log in again.");
      return;
    }
    const taskData = {
      title: taskTitle,
      description: taskDescription,
      task_assign_date: dueDate,
      category: priority,
      status: "pending",
      createdBy: user?.email,
      usermasters: user_id,
    };
    try {
      await createTask(taskData);
      alert("Task added successfully!");
      setShowTaskModal(false);
      setTaskTitle("");
      setTaskDescription("");
      setDueDate("");
      setPriority("");
      fetchTasks();
    } catch (error) {
      console.error("Failed to add task:", error.response?.data || error.message);
    alert(`Error adding task: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task); 
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setPriority(task.category || "");
    setDueDate(new Date(task.task_assign_date).toISOString().split("T")[0]);
    setShowTaskModal(true);
  };
  
 const handleTaskCompletion = async (taskId) => {
    try {
      await updateTaskStatus(taskId, "completed");
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? { ...task, status: "completed" } : task
        )
      );
    } catch (error) {
      console.error("Failed to update task status:", error.message);
    }
  };
 
  const formatDate = (dateString) => {
    const taskDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);
    const timeDifference = taskDate.getTime() - today.getTime();
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
    if (dayDifference === 0) {
      return "Today";
    } else if (dayDifference === 1) {
      return "Tomorrow";
    } else if (dayDifference === -1) {
      return "Yesterday";
    } else {
      return taskDate.toLocaleDateString();
    }
  };
  
  const handleTaskDeletion = async (taskId) => {
    try {
      await deleteTask(taskId); 
      setTasks((prevTasks) => prevTasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error.message);
    }
  };

  const handleUpdateTask = async () => {
    if (!taskTitle.trim()) {
      alert("Task title is required!");
      return;
    }  
    if (!dueDate) {
      alert("Date is required!");
      return;
    } 
    const updatedTaskData = {
      title: taskTitle,
      description: taskDescription,
      task_assign_date: dueDate,
      category: priority,
    }; 
    try {
      await updateTask(editingTask._id, updatedTaskData);
      alert("Task updated successfully!");
      setShowTaskModal(false);
      setEditingTask(null);
      fetchTasks(); // Refresh task list after updating
    } catch (error) {
      console.error("Failed to update task:", error.response?.data || error.message);
      alert(`Error updating task: ${error.response?.data?.message || error.message}`);
    }
  };
  
    // Filter tasks based on search query
    const filteredTasks = tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
  return (
    <div className="dashboard-container">
      {/*  Menu Div for Mobile */}
      <div className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        &#9776;
      </div>

      {/* Left Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>

        {/* User Profile Section */}
        <div className="profile">
        <div className="user-avatar">
          {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
        </div>
          <div className="user-email-container">
            <span className="user-email">{user?.email || "User Email"}</span>
            <span className="tooltip">{user?.email || "User Email"}</span>
          </div>
        </div>

        {/* Add Task Button */}
        <div className="add-task" onClick={handleAddTask}>
          <img src={plusIcon} alt="Add Task" className="plus-icon" />
          <span>Add Task</span>
        </div>
        {/* Sidebar Menu */}
        <ul>
          {menuItems.map((item) => (
            <li
              key={item}
              className={selectedSection === item ? "active" : ""}
              onClick={() => {
                setSelectedSection(item);
                setSidebarOpen(false);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
        {/* Logout Button (Positioned at Bottom) */}
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>

      {/* Right Content Section */}
      <main className="content">
        {/* Top bar with menu and email */}
        <div className="top-bar">
          <h2 className="section-title">{selectedSection} Tasks</h2>
        </div>

        {/* Search Input */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        {/* Dynamic Content */}
        <div className="task-content">
          {/* {selectedSection === "Inbox"} */}
           {selectedSection === "Inbox" && (
                  <div className="task-list">
                    {filteredTasks.filter(task => task.status === "pending").length > 0 ? (
                      Object.entries(
                        filteredTasks
                          .filter(task => task.status === "pending")
                          .reduce((acc, task) => {
                            const taskDate = new Date(task.task_assign_date).toDateString();
                            if (!acc[taskDate]) acc[taskDate] = [];
                            acc[taskDate].push(task);
                            return acc;
                          }, {})
                      )
                        .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                        .map(([date, tasksForDate]) => {
                          return (
                            <div key={date} className="task-date-group">
                              <h3>{formatDate(date)}</h3>
                              {tasksForDate.map((task) => (
                                <div key={task._id} className="task-item">
                                  <input 
                                    type="radio" 
                                    className={`priority-${task.category?.toLowerCase() || "default"}`} 
                                    onChange={() => handleTaskCompletion(task._id)} 
                                  />
                                    <div>
                                        <h4>{task.title}</h4>
                                        <p>{task.description}</p>
                                        <p>Due: {formatDate(task.task_assign_date)}</p>
                                      </div>
                                     
                                      <span className="delete-task" onClick={() => handleTaskDeletion(task._id)}>
                                        &#x1F5D1;
                                      </span>
                                      <span className="edit-task" onClick={() => handleEditTask(task)}>
                                        &#9998;
                                      </span>
                                </div>
                                
                              ))}
                            </div>
                          );
                        })
                    ) : (
                      <p>No tasks found.</p>
                    )}
                  </div>
                )}


              {/* {selectedSection === "Today"} */}
              {selectedSection === "Today" && (
                <div className="task-list">
                  {tasks.filter(task => {
                    const taskDate = new Date(task.task_assign_date);
                    const today = new Date();
                    
                    return (
                      taskDate.getFullYear() === today.getFullYear() &&
                      taskDate.getMonth() === today.getMonth() &&
                      taskDate.getDate() === today.getDate() &&
                      task.status === "pending"
                    );
                  }).length > 0 ? (
                    tasks
                      .filter(task => {
                        const taskDate = new Date(task.task_assign_date);
                        const today = new Date();
                        
                        return (
                          taskDate.getFullYear() === today.getFullYear() &&
                          taskDate.getMonth() === today.getMonth() &&
                          taskDate.getDate() === today.getDate() &&
                          task.status === "pending"
                        );
                      })
                      .sort((a, b) => {
                        const priorityOrder = { "p1": 1, "p2": 2, "p3": 3, "": 4 };
                        return (priorityOrder[a.category?.toLowerCase()] || 5) - (priorityOrder[b.category?.toLowerCase()] || 5);
                      })
                      .map((task) => (
                        <div key={task._id} className="task-item">
                          <input
                            type="radio"
                            className={`priority-${task.category?.toLowerCase() || "default"}`}
                            onChange={() => handleTaskCompletion(task._id)}
                          />
                          <div>
                            <h4>{task.title}</h4>
                            <p>{task.description}</p>
                            <p>Due: {formatDate(task.task_assign_date)}</p>
                          </div>                     
                          <span className="delete-task" onClick={() => handleTaskDeletion(task._id)}>
                            &#x1F5D1;
                          </span>
                          <span className="edit-task" onClick={() => handleEditTask(task)}>
                                    &#9998;
                          </span>
                        </div>
                      ))
                  ) : (
                    <p>No tasks for today.</p>
                  )}
                </div>
              )}
              
          {selectedSection === "Upcoming" && (
          <div className="task-list">
            {/* Upcoming Tasks (Excluding Today & Overdue) */}
            {tasks
              .filter(task => {
                const taskDate = new Date(task.task_assign_date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                taskDate.setHours(0, 0, 0, 0);

                return taskDate > today && task.status === "pending"; 
              })
              .sort((a, b) => new Date(a.task_assign_date) - new Date(b.task_assign_date))
              .map((task, index) => (
                <div key={task._id || index} className="task-item">
                  <input
                    type="radio"
                    className={`priority-${task.category?.toLowerCase() || "default"}`}
                    onChange={() => handleTaskCompletion(task._id)}
                  />
                  <div>
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <p>Due: {formatDate(task.task_assign_date)}</p>
                  </div>
                  <span className="delete-task" onClick={() => handleTaskDeletion(task._id)}>
                    &#x1F5D1;
                  </span>
                  <span className="edit-task" onClick={() => handleEditTask(task)}>
                    &#9998;
                  </span>
                </div>
              ))}

            {/* No Upcoming Tasks Message */}
            {tasks.filter(task => new Date(task.task_assign_date) > new Date() && task.status === "pending").length === 0 && (
              <p>No upcoming tasks.</p>
            )}
          </div>
        )}
        {/* {selectedSection === "Completed"} */}
          {selectedSection === "Completed" && (
          <div className="task-list">
            {tasks.filter(task => task.status === "completed").length > 0 ? (
              tasks
                .filter(task => task.status === "completed")
                .map((task) => (
                  <div key={task._id} className="task-item">
                    <div>
                      <h4>{task.title}</h4>
                      <p>{task.description}</p>
                      <p>Task assign: {formatDate(task.task_assign_date)}</p>
                    </div>
                  </div>
                ))
            ) : (
              <p>No completed tasks.</p>
            )}
          </div>
        )}
        </div>
      </main>
        {/* Task Modal */}
        {showTaskModal && (
          <div className="task-modal">
            <div className="modal-content">
              <h3>Add New Task</h3>
              {/* Task Title Input */}
              <input
                type="text"
                placeholder="Task Title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
              {/* Task Description Input */}
              <textarea
                placeholder="Task Description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
              {/* Priority Dropdown */}
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="" disabled>Select Priority</option>
                <option value="p1">High</option>
                <option value="p2">Medium</option>
                <option value="p3">Low</option>
              </select>
              {/* Date Picker */}
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
              {/* Buttons */}
              <div className="modal-buttons">
              {editingTask ? (
                <button onClick={handleUpdateTask}>Update Task</button>
              ) : (
                <button onClick={handleCreateTask}>Add Task</button>
              )}
                <button onClick={() => setShowTaskModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
    
    </div>
  );
};

export default Dashboard;