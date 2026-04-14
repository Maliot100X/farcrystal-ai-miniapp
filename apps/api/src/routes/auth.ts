import { FastifyInstance } from 'fastify';
import axios from 'axios';

export default async function authRoutes(fastify: FastifyInstance) {
  // Verify Farcaster sign-in
  fastify.post('/verify', async (request, reply) => {
    try {
      const { message, signature, nonce } = request.body as any;
      
      // Verify with Neynar API
      const response = await axios.post(
        'https://api.neynar.com/v2/farcaster/signer/verify',
        { message, signature, nonce },
        {
          headers: {
            'api_key': process.env.FARCASTER_NEYNAR_API_KEY
          }
        }
      );
      
      if (response.data.valid) {
        // Generate JWT
        const token = fastify.jwt.sign({
          fid: response.data.fid,
          username: response.data.username,
          custodyAddress: response.data.custodyAddress
        });
        
        return { 
          success: true,
          token, 
          user: {
            fid: response.data.fid,
            username: response.data.username,
            displayName: response.data.displayName,
            pfpUrl: response.data.pfpUrl,
            custodyAddress: response.data.custodyAddress
          }
        };
      }
      
      return reply.status(401).send({ 
        success: false,
        error: 'Invalid signature' 
      });
    } catch (error: any) {
      fastify.log.error('Auth verification error:', error.message);
      return reply.status(500).send({ 
        success: false,
        error: 'Verification failed',
        details: error.message
      });
    }
  });

  // Get current user
  fastify.get('/me', async (request, reply) => {
    try {
      await request.jwtVerify();
      return { 
        success: true,
        user: request.user 
      };
    } catch {
      return reply.status(401).send({ 
        success: false,
        error: 'Unauthorized' 
      });
    }
  });
}
