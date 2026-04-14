import { FastifyInstance } from 'fastify'
import axios from 'axios'

export default async function socialRoutes(fastify: FastifyInstance) {
  // Share cast to Farcaster
  fastify.post('/cast', async (request, reply) => {
    try {
      const { text, embeds } = request.body as any
      
      // Post via Neynar
      const response = await axios.post(
        'https://api.neynar.com/v2/farcaster/cast',
        { text, embeds, signer_uuid: process.env.FARCASTER_SIGNER_UUID },
        {
          headers: {
            'api_key': process.env.FARCASTER_NEYNAR_API_KEY
          }
        }
      )
      
      return { cast: response.data }
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to post cast' })
    }
  })

  // Get user timeline
  fastify.get('/timeline/:fid', async (request, reply) => {
    const { fid } = request.params as { fid: string }
    
    try {
      const response = await axios.get(
        `https://api.neynar.com/v2/farcaster/feed/user/${fid}`,
        {
          headers: {
            'api_key': process.env.FARCASTER_NEYNAR_API_KEY
          }
        }
      )
      
      return { feed: response.data }
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to fetch timeline' })
    }
  })
}
