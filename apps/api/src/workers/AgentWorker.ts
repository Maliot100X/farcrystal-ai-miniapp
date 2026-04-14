import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { skillRegistry, BankrSkill, FarcasterSkill, BaseSkill } from '@farcrystal/agents';

// Register skills
skillRegistry.register(BankrSkill);
skillRegistry.register(FarcasterSkill);
skillRegistry.register(BaseSkill);

// Redis connection
const redis = new IORedis(process.env.REDIS_URL || '', {
  maxRetriesPerRequest: null
});

// Queues
export const agentQueue = new Queue('agent-tasks', { connection: redis });
export const tradeQueue = new Queue('trade-tasks', { connection: redis });

// Worker
export const agentWorker = new Worker('agent-tasks', async (job) => {
  console.log(`[Worker] Processing job ${job.id}: ${job.name}`);
  
  const { skill, params } = job.data;
  
  try {
    const result = await skillRegistry.execute(skill, params);
    console.log(`[Worker] Job ${job.id} completed:`, result);
    return result;
  } catch (error) {
    console.error(`[Worker] Job ${job.id} failed:`, error);
    throw error;
  }
}, { connection: redis });

// Trade worker
export const tradeWorker = new Worker('trade-tasks', async (job) => {
  console.log(`[TradeWorker] Processing trade ${job.id}`);
  
  const { tokenIn, tokenOut, amount } = job.data;
  
  try {
    const result = await skillRegistry.execute('bankr', {
      action: 'swap',
      tokenIn,
      tokenOut,
      amount
    });
    
    console.log(`[TradeWorker] Trade executed:`, result);
    return result;
  } catch (error) {
    console.error(`[TradeWorker] Trade failed:`, error);
    throw error;
  }
}, { connection: redis });

console.log('✅ Agent workers initialized');
console.log('   Registered skills:', skillRegistry.list().join(', '));
