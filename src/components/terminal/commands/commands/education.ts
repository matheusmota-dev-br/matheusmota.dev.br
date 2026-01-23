import type { Command } from '../types';
import { education } from '@/config/cv.json';

export class EducationCommand implements Command {
    execute() {
        return education.flatMap((item) => [
            `**${item.title} [${item.sub_title}] ${item.years}**`,
            "",
            `${item.details}`,
            "",
            "----",
            "",
        ]).join("\n");
    }
}
