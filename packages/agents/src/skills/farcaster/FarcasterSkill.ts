import axios from 'axios';
import { Skill, FarcasterSkillParams } from '../../types';

const NEYNAR_API_URL = 'https://api.neynar.com/v2';
const NEYNAR_API_KEY = process.env.FARCASTER_NEYNAR_API_KEY || '850D694E-8FF3-4454-90E6-CF1FDABFCC2C';

export const FarcasterSkill: Skill = {
  name: 'farcaster',
  description: 'Post casts, replies, and interact with Farcaster via Neynar',
  parameters: {
    action: { type: 'string', enum: ['cast', 'reply', 'like', 'timeline'] },
    text: { type: 'string' },
    castHash: { type: 'string' },
    embeds: { type: 'array' }
  },
  
  execute: async (params: FarcasterSkillParams) => {
    try {
      const headers = {
        'api_key': NEYNAR_API_KEY,
        'Content-Type': 'application/json'
      };

      switch (params.action) {
        case 'cast': {
          if (!params.text) {
            throw new Error('Text is required for cast');
          }
          
          const response = await axios.post(
            `${NEYNAR_API_URL}/farcaster/cast`,
            {
              signer_uuid: process.env.NEYNAR_SIGNER_UUID,
              text: params.text,
              embeds: params.embeds || []
            },
            { headers }
          );
          
          return {
            success: true,
            castHash: response.data.cast.hash,
            text: params.text,
            url: `https://warpcast.com/~/conversations/${response.data.cast.hash}`
          };
        }

        case 'reply': {
          if (!params.castHash || !params.text) {
            throw new Error('castHash and text are required for reply');
          }
          
          const response = await axios.post(
            `${NEYNAR_API_URL}/farcaster/cast`,
            {
              signer_uuid: process.env.NEYNAR_SIGNER_UUID,
              text: params.text,
              parent: params.castHash
            },
            { headers }
          );
          
          return {
            success: true,
            castHash: response.data.cast.hash,
            parentHash: params.castHash
          };
        }

        case 'timeline': {
          const response = await axios.get(
            `${NEYNAR_API_URL}/farcaster/feed`,
            {
              headers,
              params: { feed_type: 'following', fid: params.castHash }
            }
          );
          
          return {
            success: true,
            casts: response.data.casts
          };
        }

        default:
          throw new Error(`Unknown action: ${params.action}`);
      }
    } catch (error: any) {
      console.error('Farcaster skill error:', error.message);
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }
};
