import { Skill } from '../../types'
import axios from 'axios'

export const provideLiquiditySkill: Skill = {
  name: 'bankr_liquidity',
  description: 'Provide liquidity to a pool',
  parameters: {
    tokenA: 'string',
    tokenB: 'string',
    amountA: 'string',
    amountB: 'string'
  },
  async execute(params: any) {
    const { tokenA, tokenB, amountA, amountB } = params
    
    try {
      const response = await axios.post(
        'https://api.bankr.bot/v1/liquidity',
        {
          tokenA,
          tokenB,
          amountA,
          amountB
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.BANKR_API_KEY}`
          }
        }
      )
      
      return {
        success: true,
        lpTokens: response.data.lpTokens,
        txHash: response.data.txHash
      }
    } catch (error) {
      throw new Error(`Liquidity provision failed: ${error}`)
    }
  }
}
