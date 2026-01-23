import type { Command } from '../types';
import { social } from '@/config/cv.json';

export class SocialCommand implements Command {
    execute() {
        const maxTitleLength = Math.max(...social.map((s) => s.title.length));
        return [
            "**Social Networks:**",
            "",
            ...social.map((item) => {
                const padding = " ".repeat(maxTitleLength - item.title.length + 4);
                return `${item.title}${padding}[${item.url}](${item.url})`;
            }),
            "",
            "Connect with me on any of these platforms!"
        ].join("\n");
    }
}
