// App.tsx
import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Task } from './taskSchema';
import TaskList from './TaskList';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState<number>(1);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask = new Task(`task-${tasks.length + 1}`, title, duration);
    setTasks([...tasks, newTask]);
    setTitle('');
    setDuration(1);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Glance: Feature Prototype</h1>
      <form onSubmit={addTask} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          min="1"
          required
        />
        <button type="submit">Add Task</button>
      </form>
      <TaskList tasks={tasks} setTasks={setTasks} />
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
