import type { Command } from '../types';
import { phrase } from '@/config/cv.json';

export class QuoteCommand implements Command {
    execute() {
        return [
            "",
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
            "",
            `  "${phrase.text}"`,
            "",
            `  — ${phrase.author}`,
            "",
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        ].join("\n");
    }
}
