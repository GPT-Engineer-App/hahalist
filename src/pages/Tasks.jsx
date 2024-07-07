import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerDemo } from "@/components/ui/date-picker";
import { toast } from "sonner";

const categories = ["Personal", "Work", "Shopping"];
const humorousMessages = [
  "Don't be late, or this task might haunt your dreams!",
  "Tick-tock! Your task is waiting!",
  "Procrastination alert! Get this done now!",
];

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: "", category: "", dueDate: null, reminder: "" });

  useEffect(() => {
    if (!("Notification" in window)) {
      toast.error("This browser does not support desktop notifications.");
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      tasks.forEach((task, index) => {
        if (task.dueDate) {
          const now = new Date();
          const dueDate = new Date(task.dueDate);
          const timeDiff = dueDate - now;

          if (timeDiff <= 0) {
            showNotification(task.name, humorousMessages[2]); // Overdue
          } else if (timeDiff <= 3600000) {
            showNotification(task.name, humorousMessages[1]); // Due soon (within an hour)
          } else if (timeDiff <= 86400000) {
            showNotification(task.name, humorousMessages[0]); // Upcoming (within a day)
          }
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [tasks]);

  const showNotification = (title, message) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body: message });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAddTask = () => {
    if (!newTask.name || !newTask.category) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setTasks([...tasks, newTask]);
    setNewTask({ name: "", category: "", dueDate: null, reminder: "" });
    toast.success("Task added successfully!");
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    toast.success("Task deleted successfully!");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ha-ha List</h1>
      <div className="mb-4">
        <Input
          placeholder="Task Name"
          name="name"
          value={newTask.name}
          onChange={handleInputChange}
          className="mb-2"
        />
        <Select onValueChange={(value) => setNewTask({ ...newTask, category: value })}>
          <SelectTrigger className="w-full mb-2">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DatePickerDemo
          selected={newTask.dueDate}
          onSelect={(date) => setNewTask({ ...newTask, dueDate: date })}
          className="mb-2"
        />
        <Input
          placeholder="Reminder"
          name="reminder"
          value={newTask.reminder}
          onChange={handleInputChange}
          className="mb-2"
        />
        <Button onClick={handleAddTask}>Add Task</Button>
      </div>
      <div>
        {tasks.map((task, index) => (
          <div key={index} className="border p-2 mb-2 flex justify-between items-center">
            <div>
              <h2 className="font-bold">{task.name}</h2>
              <p>Category: {task.category}</p>
              <p>Due Date: {task.dueDate ? task.dueDate.toLocaleDateString() : "None"}</p>
              <p>Reminder: {task.reminder}</p>
            </div>
            <Button variant="destructive" onClick={() => handleDeleteTask(index)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;