export { AgentEngine } from './engine/AgentEngine';
export { SkillRegistry, skillRegistry } from './engine/SkillRegistry';
export { MemoryManager } from './engine/MemoryManager';
export { BankrSkill } from './skills/bankr/BankrSkill';
export { FarcasterSkill } from './skills/farcaster/FarcasterSkill';
export { BaseSkill } from './skills/base/BaseSkill';
export { FarcrystalAgent } from './FarcrystalAgent';
export * from './types';

import { skillRegistry } from './engine/SkillRegistry';
import { BankrSkill } from './skills/bankr/BankrSkill';
import { FarcasterSkill } from './skills/farcaster/FarcasterSkill';
import { BaseSkill } from './skills/base/BaseSkill';

// Auto-register default skills
skillRegistry.register(BankrSkill);
skillRegistry.register(FarcasterSkill);
skillRegistry.register(BaseSkill);
