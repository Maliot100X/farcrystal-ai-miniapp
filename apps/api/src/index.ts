import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info'
  }
});

// Register plugins
async function registerPlugins() {
  // CORS
  await server.register(cors, {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://farcrystal.xyz', 'https://warpcast.com'] 
      : true,
    credentials: true
  });
  
  // Rate limiting
  await server.register(rateLimit, {
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000')
  });
  
  // JWT
  await server.register(jwt, {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production'
  });
}

// Health check
server.get('/health', async () => {
  return { 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  };
});

// Routes
server.register(import('./routes/auth'), { prefix: '/auth' });
server.register(import('./routes/agents'), { prefix: '/agents' });
server.register(import('./routes/tokens'), { prefix: '/tokens' });
server.register(import('./routes/game'), { prefix: '/game' });

// Error handler
server.setErrorHandler((error, request, reply) => {
  server.log.error(error);
  reply.status(error.statusCode || 500).send({
    error: error.message || 'Internal Server Error',
    code: error.code || 'INTERNAL_ERROR'
  });
});

async function start() {
  try {
    await registerPlugins();
    const port = parseInt(process.env.PORT || '3001');
    const host = process.env.HOST || '0.0.0.0';
    
    await server.listen({ port, host });
    server.log.info(`🚀 API Server running at http://${host}:${port}`);
    server.log.info(`📊 Health check: http://${host}:${port}/health`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
