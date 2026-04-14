import { AgentEngine } from '../engine/AgentEngine'
import { SkillRegistry } from '../engine/SkillRegistry'
import { AgentConfig } from '../types'
import { publishCastSkill } from '../skills/farcaster/publishCast'

export class SocialAgent extends AgentEngine {
  constructor(config: AgentConfig) {
    const registry = new SkillRegistry()
    registry.register(publishCastSkill)
    super(config, registry)
  }

  async postUpdate(message: string): Promise<any> {
    return await this.executeSkill('farcaster_cast', {
      text: message,
      embeds: []
    })
  }

  async engageWithCommunity(): Promise<void> {
    // TODO: Monitor mentions, reply to comments
    await this.think('What engagement actions should I take today?')
  }
}
