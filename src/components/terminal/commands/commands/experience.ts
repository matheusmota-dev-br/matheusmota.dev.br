import type { Command } from '../types';
import { experiences } from '@/config/cv.json';

export class ExperienceCommand implements Command {
    execute() {
        return experiences.flatMap((item) => [
            `**${item.title} [${item.sub_title}] ${item.years}**`,
            "",
            `${item.details}`,
            "",
            `Skills: [${item.skills.map((s) => `**${s.name}**`).join(', ')}]`,
            "",
            "----",
            ""
        ]).join("\n");
    }
}
