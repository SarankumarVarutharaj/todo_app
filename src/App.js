import React, { useState, useEffect } from 'react';

const TaskManager = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [taskInput, setTaskInput] = useState('');
  const [taskDateTime, setTaskDateTime] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    // Set reminders for tasks
    tasks.forEach((task) => {
      const taskDate = new Date(task.dateTime);
      const now = new Date();
      const timeUntilReminder = taskDate - now;

      if (timeUntilReminder > 0 && !task.completed) {
        const timer = setTimeout(() => {
          alert(`Reminder: ${task.text}`);
        }, timeUntilReminder);

        // Cleanup function to clear the timer if the component unmounts
        return () => clearTimeout(timer);
      }
    });
  }, [tasks]);

  const addTask = () => {
    if (taskInput && taskDateTime) {
      setTasks((prevTasks) => [
        ...prevTasks,
        { text: taskInput, dateTime: taskDateTime, completed: false },
      ]);
      setTaskInput('');
      setTaskDateTime('');
    }
  };

  const toggleTaskCompletion = (index) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks[index].completed = !updatedTasks[index].completed;
      return updatedTasks;
    });
  };

  const removeTask = (index) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <input
        type="text"
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
        placeholder="Enter a new task"
      />
      <input
        type="datetime-local"
        value={taskDateTime}
        onChange={(e) => setTaskDateTime(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>

      <h2>Tasks</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={index} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            <span onClick={() => toggleTaskCompletion(index)}>
              {task.text} - {new Date(task.dateTime).toLocaleString()}
            </span>
            <button onClick={() => removeTask(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
