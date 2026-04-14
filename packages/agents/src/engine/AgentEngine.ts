import { AgentConfig, AgentState, AgentMessage, Skill } from '../types';
import { SkillRegistry } from './SkillRegistry';
import { MemoryManager } from './MemoryManager';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.FIREWORKS_API_KEY || '',
  baseURL: 'https://api.fireworks.ai/inference/v1'
});

export class AgentEngine {
  private config: AgentConfig;
  private state: AgentState;
  private skillRegistry: SkillRegistry;
  private memory: MemoryManager;

  constructor(config: AgentConfig, skillRegistry: SkillRegistry) {
    this.config = config;
    this.skillRegistry = skillRegistry;
    this.memory = new MemoryManager();
    this.state = {
      status: 'idle',
      lastAction: '',
      lastActionTime: new Date().toISOString(),
      performance: {
        trades: 0,
        profitLoss: 0,
        winRate: 0
      },
      memory: []
    };
  }

  async initialize(): Promise<void> {
    this.state.status = 'idle';
    this.memory.add({
      role: 'system',
      content: `You are an AI agent named ${this.config.name}. Strategy: ${this.config.strategy}`,
      timestamp: new Date().toISOString()
    });
    console.log(`✅ Agent ${this.config.name} initialized`);
  }

  async think(input: string): Promise<string> {
    this.state.status = 'working';
    
    this.memory.add({
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    });

    const context = this.memory.getRecent(10);
    
    try {
      const response = await openai.chat.completions.create({
        model: 'accounts/fireworks/models/llama-v3p3-70b-instruct',
        messages: [
          { role: 'system', content: context[0]?.content || '' },
          ...context.slice(1).map(m => ({ role: m.role as any, content: m.content }))
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const content = response.choices[0]?.message?.content || '';
      
      this.memory.add({
        role: 'assistant',
        content,
        timestamp: new Date().toISOString()
      });

      this.state.lastAction = 'think';
      this.state.lastActionTime = new Date().toISOString();
      this.state.status = 'idle';

      return content;
    } catch (error) {
      this.state.status = 'error';
      throw error;
    }
  }

  async executeSkill(skillName: string, params: any): Promise<any> {
    this.state.status = 'working';
    this.state.lastAction = `execute:${skillName}`;
    
    try {
      const result = await this.skillRegistry.execute(skillName, params);
      this.state.lastActionTime = new Date().toISOString();
      this.state.status = 'idle';
      return result;
    } catch (error) {
      this.state.status = 'error';
      throw error;
    }
  }

  getState(): AgentState {
    return { ...this.state };
  }

  updatePerformance(trade: { profit: number; success: boolean }): void {
    this.state.performance.trades++;
    this.state.performance.profitLoss += trade.profit;
    const wins = trade.success ? 1 : 0;
    this.state.performance.winRate = 
      (this.state.performance.winRate * (this.state.performance.trades - 1) + wins * 100) / 
      this.state.performance.trades;
  }
}
