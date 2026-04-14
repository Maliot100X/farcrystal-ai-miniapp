import axios from 'axios';
import { Skill, BankrSkillParams } from '../../types';

const BANKR_API_URL = 'https://api.bankr.bot/v1';
const BANKR_API_KEY = process.env.BANKR_API_KEY || 'bk_usr_s7zNmRb9_cm6R8rHCDEjA4nkKRdme6EBzHPWYDnhF';

export const BankrSkill: Skill = {
  name: 'bankr',
  description: 'Execute trades, manage liquidity, and check balances via Bankr API',
  parameters: {
    action: { type: 'string', enum: ['swap', 'liquidity', 'stake', 'balance'] },
    tokenIn: { type: 'string' },
    tokenOut: { type: 'string' },
    amount: { type: 'string' },
    pool: { type: 'string' }
  },
  
  execute: async (params: BankrSkillParams) => {
    try {
      const headers = {
        'Authorization': `Bearer ${BANKR_API_KEY}`,
        'Content-Type': 'application/json'
      };

      switch (params.action) {
        case 'swap': {
          if (!params.tokenIn || !params.tokenOut || !params.amount) {
            throw new Error('Missing required parameters for swap');
          }
          
          const response = await axios.post(
            `${BANKR_API_URL}/swap`,
            {
              tokenIn: params.tokenIn,
              tokenOut: params.tokenOut,
              amount: params.amount,
              chain: 'base'
            },
            { headers }
          );
          
          return {
            success: true,
            txHash: response.data.txHash,
            amountIn: response.data.amountIn,
            amountOut: response.data.amountOut,
            tokenIn: params.tokenIn,
            tokenOut: params.tokenOut
          };
        }

        case 'balance': {
          const response = await axios.get(
            `${BANKR_API_URL}/wallet/balance`,
            { headers }
          );
          
          return {
            success: true,
            balance: response.data.balance,
            tokens: response.data.tokens
          };
        }

        case 'liquidity': {
          if (!params.pool || !params.amount) {
            throw new Error('Missing required parameters for liquidity');
          }
          
          const response = await axios.post(
            `${BANKR_API_URL}/liquidity`,
            {
              pool: params.pool,
              amount: params.amount,
              chain: 'base'
            },
            { headers }
          );
          
          return {
            success: true,
            txHash: response.data.txHash,
            pool: params.pool,
            lpTokens: response.data.lpTokens
          };
        }

        case 'stake': {
          const response = await axios.post(
            `${BANKR_API_URL}/stake`,
            {
              amount: params.amount,
              chain: 'base'
            },
            { headers }
          );
          
          return {
            success: true,
            txHash: response.data.txHash,
            stakedAmount: params.amount
          };
        }

        default:
          throw new Error(`Unknown action: ${params.action}`);
      }
    } catch (error: any) {
      console.error('Bankr skill error:', error.message);
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }
};
