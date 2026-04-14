import { FastifyInstance } from 'fastify';

// In-memory storage for now - will use Redis/DB
const agents = new Map();

export default async function agentRoutes(fastify: FastifyInstance) {
  // List all agents
  fastify.get('/', async () => {
    return { 
      success: true,
      agents: Array.from(agents.values()) 
    };
  });

  // Get agent by ID
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const agent = agents.get(id);
    
    if (!agent) {
      return reply.status(404).send({ 
        success: false,
        error: 'Agent not found' 
      });
    }
    
    return { success: true, agent };
  });

  // Create new agent
  fastify.post('/', async (request, reply) => {
    const { name, type, strategy, ownerFid } = request.body as any;
    
    const id = `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newAgent = {
      id,
      name,
      type,
      status: 'active',
      strategy,
      ownerFid,
      performance: {
        trades: 0,
        profitLoss: 0,
        winRate: 0
      },
      createdAt: new Date().toISOString()
    };
    
    agents.set(id, newAgent);
    
    return { 
      success: true, 
      agent: newAgent,
      message: 'Agent created successfully'
    };
  });

  // Update agent status
  fastify.patch('/:id/status', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status: string };
    
    const agent = agents.get(id);
    if (!agent) {
      return reply.status(404).send({ 
        success: false,
        error: 'Agent not found' 
      });
    }
    
    agent.status = status;
    agent.updatedAt = new Date().toISOString();
    
    return { success: true, agent };
  });
}
