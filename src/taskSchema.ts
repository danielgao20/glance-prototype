// taskSchema.ts

export interface Subtask {
    name: string;
    duration: number;  // Duration in seconds for each subtask
    completed: boolean;
  }
  
  export class Task {
    id: string;
    title: string;
    duration: number;  // Total duration in minutes
    interval: number;  // Duration for each checkpoint in seconds
    subtasks: Subtask[];
    progress: number;
  
    constructor(id: string, title: string, duration: number) {
      this.id = id;
      this.title = title;
      this.duration = duration;
      this.interval = (duration * 60) / 4;  // 1/4 of the total duration in seconds
      this.progress = 0;
      this.subtasks = Array.from({ length: 4 }, (_, i) => ({
        name: `Checkpoint ${i + 1}`,
        duration: this.interval,
        completed: false,
      }));
    }
  }
  