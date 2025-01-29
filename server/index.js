const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());



// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", taskSchema);





app.get("/api/v1/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tasks",
    });
  }
});

app.post("/api/v1/tasks", async (req, res) => {
  try {
    const { title } = req.body;
    const newTask = new Task({ title });
    await newTask.save();
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task" });
  }
});

app.put("/api/v1/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, completed },
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
});

app.delete("/api/v1/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
});



app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
