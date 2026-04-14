import { Skill } from '../../types'
import axios from 'axios'

export const publishCastSkill: Skill = {
  name: 'farcaster_cast',
  description: 'Publish a cast to Farcaster',
  parameters: {
    text: 'string',
    embeds: 'array'
  },
  async execute(params: any) {
    const { text, embeds = [] } = params
    
    try {
      const response = await axios.post(
        'https://api.neynar.com/v2/farcaster/cast',
        {
          text,
          embeds,
          signer_uuid: process.env.FARCASTER_SIGNER_UUID
        },
        {
          headers: {
            'api_key': process.env.FARCASTER_NEYNAR_API_KEY
          }
        }
      )
      
      return {
        success: true,
        castHash: response.data.cast.hash
      }
    } catch (error) {
      throw new Error(`Cast failed: ${error}`)
    }
  }
}
