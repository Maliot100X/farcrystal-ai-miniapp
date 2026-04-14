import { ethers } from 'ethers';
import { Skill } from '../../types';

const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://base-mainnet.g.alchemy.com/v2/l5IVzTf6IJ35Vl3peen2Y';
const BASE_CHAIN_ID = 8453;

export const BaseSkill: Skill = {
  name: 'base',
  description: 'Interact with Base blockchain - read balances, send transactions',
  parameters: {
    action: { type: 'string', enum: ['getBalance', 'getTokenBalance', 'estimateGas', 'readContract'] },
    address: { type: 'string' },
    tokenAddress: { type: 'string' },
    contractAddress: { type: 'string' },
    abi: { type: 'array' },
    method: { type: 'string' },
    params: { type: 'array' }
  },
  
  execute: async (params: any) => {
    try {
      const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);

      switch (params.action) {
        case 'getBalance': {
          if (!params.address) {
            throw new Error('Address is required');
          }
          
          const balance = await provider.getBalance(params.address);
          
          return {
            success: true,
            address: params.address,
            balance: ethers.formatEther(balance),
            balanceWei: balance.toString()
          };
        }

        case 'getTokenBalance': {
          if (!params.address || !params.tokenAddress) {
            throw new Error('Address and tokenAddress are required');
          }
          
          const erc20Abi = ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'];
          const contract = new ethers.Contract(params.tokenAddress, erc20Abi, provider);
          
          const balance = await contract.balanceOf(params.address);
          const decimals = await contract.decimals();
          
          return {
            success: true,
            tokenAddress: params.tokenAddress,
            address: params.address,
            balance: ethers.formatUnits(balance, decimals),
            rawBalance: balance.toString()
          };
        }

        case 'estimateGas': {
          const feeData = await provider.getFeeData();
          
          return {
            success: true,
            gasPrice: feeData.gasPrice?.toString(),
            maxFeePerGas: feeData.maxFeePerGas?.toString(),
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString()
          };
        }

        case 'readContract': {
          if (!params.contractAddress || !params.abi || !params.method) {
            throw new Error('contractAddress, abi, and method are required');
          }
          
          const contract = new ethers.Contract(params.contractAddress, params.abi, provider);
          const result = await contract[params.method](...(params.params || []));
          
          return {
            success: true,
            result: result.toString ? result.toString() : result
          };
        }

        default:
          throw new Error(`Unknown action: ${params.action}`);
      }
    } catch (error: any) {
      console.error('Base skill error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
};
