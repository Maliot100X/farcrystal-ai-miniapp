import { FastifyInstance } from 'fastify';

const games = new Map();
const leaderboard = [
  { rank: 1, fid: 1, name: '@alex.eth', score: 15420, prize: '0.5 ETH' },
  { rank: 2, fid: 2, name: '@sarah.wr', score: 12890, prize: '0.3 ETH' },
  { rank: 3, fid: 3, name: '@mike.base', score: 11200, prize: '0.2 ETH' }
];

export default async function gameRoutes(fastify: FastifyInstance) {
  // List games
  fastify.get('/', async () => {
    return { 
      success: true,
      games: Array.from(games.values()) 
    };
  });

  // Get leaderboard
  fastify.get('/leaderboard', async () => {
    return { 
      success: true,
      leaderboard 
    };
  });

  // Create game
  fastify.post('/create', async (request, reply) => {
    const { type, title, reward, duration } = request.body as any;
    
    const id = `game-${Date.now()}`;
    
    const newGame = {
      id,
      type,
      title,
      reward,
      endTime: new Date(Date.now() + duration).toISOString(),
      participants: 0,
      active: true,
      createdAt: new Date().toISOString()
    };
    
    games.set(id, newGame);
    
    return { 
      success: true, 
      game: newGame 
    };
  });

  // Submit game result
  fastify.post('/:id/submit', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { result, userFid } = request.body as any;
    
    const game = games.get(id);
    if (!game) {
      return reply.status(404).send({ 
        success: false,
        error: 'Game not found' 
      });
    }
    
    // TODO: Verify result, distribute rewards
    
    return { 
      success: true, 
      message: 'Result submitted',
      result: {
        gameId: id,
        userFid,
        submittedAt: new Date().toISOString()
      }
    };
  });
}
