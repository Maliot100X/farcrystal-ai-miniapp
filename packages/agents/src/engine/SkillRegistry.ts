import { Skill } from '../types';

export class SkillRegistry {
  private skills: Map<string, Skill> = new Map();

  register(skill: Skill): void {
    this.skills.set(skill.name, skill);
  }

  get(name: string): Skill | undefined {
    return this.skills.get(name);
  }

  list(): string[] {
    return Array.from(this.skills.keys());
  }

  async execute(name: string, params: any): Promise<any> {
    const skill = this.get(name);
    if (!skill) {
      throw new Error(`Skill not found: ${name}`);
    }
    return await skill.execute(params);
  }
}

export const skillRegistry = new SkillRegistry();
