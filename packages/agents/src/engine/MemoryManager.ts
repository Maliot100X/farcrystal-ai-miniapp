import { AgentMessage } from '../types';

export class MemoryManager {
  private memory: AgentMessage[] = [];
  private maxSize: number;

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize;
  }

  add(message: AgentMessage): void {
    this.memory.push(message);
    if (this.memory.length > this.maxSize) {
      this.memory.shift();
    }
  }

  getRecent(count: number = 10): AgentMessage[] {
    return this.memory.slice(-count);
  }

  getAll(): AgentMessage[] {
    return [...this.memory];
  }

  clear(): void {
    this.memory = [];
  }

  summarize(): string {
    return this.memory.map(m => `${m.role}: ${m.content}`).join('\n');
  }
}
