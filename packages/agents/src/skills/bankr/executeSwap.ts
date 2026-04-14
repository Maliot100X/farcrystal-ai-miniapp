import { Skill } from '../../types'
import axios from 'axios'

export const executeSwapSkill: Skill = {
  name: 'bankr_swap',
  description: 'Execute token swap via Bankr',
  parameters: {
    tokenIn: 'string',
    tokenOut: 'string',
    amount: 'string',
    slippage: 'number'
  },
  async execute(params: any) {
    const { tokenIn, tokenOut, amount, slippage = 0.5 } = params
    
    try {
      const response = await axios.post(
        'https://api.bankr.bot/v1/swap',
        {
          tokenIn,
          tokenOut,
          amount,
          slippage
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.BANKR_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      return {
        success: true,
        txHash: response.data.txHash,
        amountOut: response.data.amountOut
      }
    } catch (error) {
      throw new Error(`Swap failed: ${error}`)
    }
  }
}
