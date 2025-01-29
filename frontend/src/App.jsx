import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaEdit } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/v1/tasks").then((res) => setTasks(res.data));
  }, []);

  const addTask = () => {
    if (!newTask.trim()) return;
    axios
      .post("http://localhost:5000/api/v1/tasks", { title: newTask })
      .then((res) => {
        setTasks([...tasks, res.data]);
        setNewTask("");
      });
  };

  const toggleTask = (id, completed) => {
    axios
      .put(`http://localhost:5000/api/v1/tasks/${id}`, { completed: !completed })
      .then((res) => {
        setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
      });
  };

  const startEditing = (task) => {
    setEditTaskId(task._id);
    setEditTaskTitle(task.title);
  };

  const updateTask = () => {
    if (!editTaskTitle.trim()) return;
    axios
      .put(`http://localhost:5000/api/v1/tasks/${editTaskId}`, {
        title: editTaskTitle,
      })
      .then((res) => {
        setTasks(
          tasks.map((task) => (task._id === editTaskId ? res.data : task))
        );
        setEditTaskId(null);
        setEditTaskTitle("");
      });
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/api/v1/tasks/${id}`).then(() => {
      setTasks(tasks.filter((task) => task._id !== id));
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-white shadow-md py-4 px-10 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="https://nimbuscluster.blob.core.windows.net/server01/brained-3-0/undefined/0.7893156340902756.png-tWl15TUBPFp8UbyOvmvgT-1733119766"
            alt="Logo"
            className="h-12 w-32 md:h-14 md:w-32 lg:h-12 lg:w-48 object-contain"
          />
        </div>
        <div className="relative border border-purple-800 px-4 py-2 rounded-md bg-white shadow-[3px_3px_0_0] shadow-purple-800 flex items-center gap-2 group cursor-pointer">
          <span>Schedule a Discovery Call</span>
          <div className="transition-transform duration-300 group-hover:rotate-0 rotate-[-45deg] text-purple-800">
            <BsArrowRight size={20} />
          </div>
        </div>
      </div>

      <div className="flex justify-center py-10">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            To-Do List
          </h1>
          <div className="flex mb-4 gap-2">
            <input
              type="text"
              className="border rounded-lg p-3 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a new task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg"
              onClick={addTask}
            >
              Add
            </button>
          </div>
          <ul className="space-y-2 max-h-[30rem] overflow-y-auto">
            {tasks.map((task, index) => (
              <li
                key={task._id}
                className="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow"
              >
                <span className="text-gray-500 font-medium">{index + 1}.</span>
                {editTaskId === task._id ? (
                  <input
                    type="text"
                    className="border p-2 flex-grow mx-2"
                    value={editTaskTitle}
                    onChange={(e) => setEditTaskTitle(e.target.value)}
                  />
                ) : (
                  <span
                    className={`cursor-pointer text-lg flex-grow mx-2 ${
                      task.completed
                        ? "line-through text-gray-500"
                        : "text-gray-800"
                    }`}
                    onClick={() => toggleTask(task._id)}
                  >
                    {task.title}
                  </span>
                )}
                <div className="flex space-x-2 items-center">
                  {editTaskId === task._id ? (
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
                      onClick={updateTask}
                    >
                      Save
                    </button>
                  ) : (
                    <FaEdit
                      className="text-blue-500 cursor-pointer"
                      onClick={() => startEditing(task)}
                    />
                  )}
                  <FaTrash
                    className="text-red-500 cursor-pointer"
                    onClick={() => deleteTask(task._id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
