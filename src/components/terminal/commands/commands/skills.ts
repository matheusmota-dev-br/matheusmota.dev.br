import type { Command } from '../types';
import { basic } from '@/config/cv.json';

export class SkillsCommand implements Command {
    execute() {
        return [
            "**Technical Skills:**",
            "",
            basic.skills.map((item) => `  • **${item.name}**`).join('\n'),
            "",
            `Total: ${basic.skills.length} skills`
        ].join("\n");
    }
}
