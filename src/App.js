import { useState, useEffect } from "react";
import { FaCheckCircle, FaTrash, FaEdit } from "react-icons/fa";
import './App.css'; 

export default function App() {
  // State to manage tasks 
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);
  // Save tasks to localstorage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Function to add a new task or update an existing task
  const addTask = () => {
    if (!input.trim()) return;   // Prevents empty tasks
    if (editId !== null) {
      // Update existing task
      setTasks(tasks.map(task => task.id === editId ? { ...task, text: input } : task));
      setEditId(null);
    } else {
      // Add new task
      setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
    }
    setInput(""); // Clear input field after adding task 
  };

  // Function to toogle task completion
  const toggleComplete = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  //Function to delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  // Function to edit a task
  const editTask = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    setInput(taskToEdit.text);
    setEditId(id);
  };
  // Filtering tasks based on selected filter
  const filteredTasks = tasks.filter(task => 
    filter === "all" ? true : filter === "completed" ? task.completed : !task.completed
  );

  return (
    <div className="container">
      <h1 className="header">Task List</h1>
      {/* Input field for adding or updating tasks */}
      <div className="input-container">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          className="input-field"
          placeholder="Add a task..." 
        />
        <button 
          onClick={addTask} 
          className="add-task-btn"
        >{editId ? "Update Task" : "Add Task"}</button>
      </div>
      {/* Filter buttons to switch between all,completed , and pending tasks */}
      <div className="filter-btns">
        {["all", "completed", "pending"].map((status) => (
          <button 
            key={status} 
            className={`filter-btn ${filter === status ? "active-filter" : ""}`}
            onClick={() => setFilter(status)}
          >{status.charAt(0).toUpperCase() + status.slice(1)}</button>
        ))}
      </div>

      {/* Display the list of tasks based on the selected filter */}
      <ul className="task-list">
        {filteredTasks.map(task => (
          <li key={task.id} className="task-item">
            <span className={`task-text ${task.completed ? "completed-task" : ""}`}>{task.text}</span>
            <div className="task-actions">
              <FaCheckCircle 
                className="task-action-icon complete-icon"
                onClick={() => toggleComplete(task.id)}
              />
              <FaEdit 
                className="task-action-icon edit-icon"
                onClick={() => editTask(task.id)}
              />
              <FaTrash 
                className="task-action-icon delete-icon"
                onClick={() => deleteTask(task.id)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

