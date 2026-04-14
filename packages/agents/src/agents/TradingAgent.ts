import { AgentEngine } from '../engine/AgentEngine'
import { SkillRegistry } from '../engine/SkillRegistry'
import { AgentConfig } from '../types'
import { executeSwapSkill } from '../skills/bankr/executeSwap'

export class TradingAgent extends AgentEngine {
  constructor(config: AgentConfig) {
    const registry = new SkillRegistry()
    registry.register(executeSwapSkill)
    super(config, registry)
  }

  async analyzeMarket(): Promise<any> {
    // TODO: Fetch market data
    return await this.think('Analyze current market conditions for trading opportunities')
  }

  async executeTrade(tokenIn: string, tokenOut: string, amount: string): Promise<any> {
    return await this.executeSkill('bankr_swap', {
      tokenIn,
      tokenOut,
      amount,
      slippage: 0.5
    })
  }
}
