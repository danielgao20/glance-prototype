import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Task } from './taskSchema';

interface TaskItemProps {
  task: Task;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, setTasks }) => {
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(task.duration * 60);
  const [isTaskActive, setIsTaskActive] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const startTask = useCallback(() => {
    setIsTaskActive(true);

    if (currentCheckpoint === 0) {
      setEstimatedTimeRemaining(task.duration * 60);
      triggerCheckpoint(0);
    } else {
      triggerCheckpoint(currentCheckpoint);
    }
  }, [task.duration, currentCheckpoint]);

  const triggerCheckpoint = (checkpointIndex: number) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const checkpointTimeout = setTimeout(() => {
      showCheckpointToast(checkpointIndex);
    }, task.interval * 1000);

    setTimeoutId(checkpointTimeout);
  };

  const showCheckpointToast = (checkpointIndex: number) => {
    toast.dismiss();

    toast((t) => (
      <span>
        Did you complete {task.subtasks[checkpointIndex].name}?
        <button
          style={{ marginLeft: '0.5rem', color: 'green' }}
          onClick={() => {
            toast.dismiss(t.id);
            completeCheckpoint();
          }}
        >
          Yes
        </button>
        <button
          style={{ marginLeft: '0.5rem', color: 'red' }}
          onClick={() => toast.dismiss(t.id)}
        >
          No
        </button>
      </span>
    ), { duration: Infinity });
  };

  // Updated completeCheckpoint function
  const completeCheckpoint = () => {
    // Create a new array for subtasks with all previous and current subtasks marked as completed
    const updatedSubtasks = task.subtasks.map((subtask, index) => ({
      ...subtask,
      completed: index <= currentCheckpoint
    }));

    // Update the task with the new subtasks array
    const updatedTask = { ...task, subtasks: updatedSubtasks };

    // Update tasks state
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );

    // Update checkpoint and estimated time
    setCurrentCheckpoint((prevCheckpoint) => {
      const newCheckpoint = prevCheckpoint + 1;

      setEstimatedTimeRemaining(task.interval * (task.subtasks.length - newCheckpoint));

      if (newCheckpoint < task.subtasks.length) {
        triggerCheckpoint(newCheckpoint);
      } else {
        stopTask(true);
      }

      return newCheckpoint;
    });
  };

  const stopTask = useCallback((pauseOnly = false) => {
    setIsTaskActive(false);

    if (!pauseOnly) {
      setElapsedTime(0);
      setEstimatedTimeRemaining(task.duration * 60);
      setCurrentCheckpoint(0);

      const resetSubtasks = task.subtasks.map((subtask) => ({ ...subtask, completed: false }));
      const resetTask = { ...task, subtasks: resetSubtasks };
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === resetTask.id ? resetTask : t))
      );
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [task, timeoutId, setTasks]);

  useEffect(() => {
    if (!isTaskActive) return;

    const stopwatchInterval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(stopwatchInterval);
  }, [isTaskActive]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3>{task.title} - {task.progress}% Complete</h3>
      <div style={{ fontSize: '0.9rem', color: '#555' }}>
        Elapsed Time: {formatTime(elapsedTime)}
      </div>
      <div style={{ fontSize: '0.9rem', color: '#555' }}>
        Estimated Time Remaining: {formatTime(estimatedTimeRemaining)}
      </div>
      <button onClick={startTask} style={{ marginTop: '0.5rem', marginRight: '0.5rem' }}>Start Task</button>
      <button onClick={() => stopTask(true)} style={{ marginTop: '0.5rem', backgroundColor: 'red', color: 'white' }}>Pause Task</button>
      <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
        {task.subtasks.map((subtask, index) => (
          <div
            key={index}
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: subtask.completed ? 'green' : 'lightgray',
              borderRadius: '50%',
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default TaskItem;
