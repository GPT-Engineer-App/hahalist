import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerDemo } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { useTasks, useAddTask, useUpdateTask, useDeleteTask } from "@/integrations/supabase/index.js";

const categories = ["Personal", "Work", "Shopping"];
const humorousMessages = [
  "Don't be late, or this task might haunt your dreams!",
  "Tick-tock! Your task is waiting!",
  "Procrastination alert! Get this done now!",
];

const Tasks = () => {
  const { data: tasks, error, isLoading } = useTasks();
  const addTaskMutation = useAddTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const [newTask, setNewTask] = useState({ title: "", category: "", due_date: null, reminder: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.category) {
      toast.error("Please fill in all required fields.");
      return;
    }
    addTaskMutation.mutate(newTask, {
      onSuccess: () => {
        toast.success("Task added successfully!");
        setNewTask({ title: "", category: "", due_date: null, reminder: "" });
      },
      onError: (error) => {
        toast.error(`Error adding task: ${error.message}`);
      },
    });
  };

  const handleDeleteTask = (id) => {
    deleteTaskMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Task deleted successfully!");
      },
      onError: (error) => {
        toast.error(`Error deleting task: ${error.message}`);
      },
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tasks: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ha-ha List</h1>
      <div className="mb-4">
        <Input
          placeholder="Task Name"
          name="title"
          value={newTask.title}
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
          selected={newTask.due_date}
          onSelect={(date) => setNewTask({ ...newTask, due_date: date })}
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
        {tasks.map((task) => (
          <div key={task.id} className="border p-2 mb-2 flex justify-between items-center">
            <div>
              <h2 className="font-bold">{task.title}</h2>
              <p>Category: {task.category}</p>
              <p>Due Date: {task.due_date ? new Date(task.due_date).toLocaleDateString() : "None"}</p>
              <p>Reminder: {task.reminder}</p>
            </div>
            <Button variant="destructive" onClick={() => handleDeleteTask(task.id)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;