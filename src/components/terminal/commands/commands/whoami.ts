import type { Command } from '../types';
import { basic } from '@/config/cv.json';

export class WhoAmICommand implements Command {
    execute() {
        return [
            `**${basic.name}**`,
            "",
            basic.summary,
            "",
            `Role: ${basic.job}`,
            "",
            "Use **help** to see available commands."
        ].join("\n");
    }
}
