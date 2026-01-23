import type { Command } from '../types';
import { projects } from '@/config/cv.json';

export class ProjectsCommand implements Command {
    execute() {
        const maxTitleLength = Math.max(...projects.map((s) => s.title.length));
        return [
            "**My Projects:**",
            "",
            ...projects.map((item) => {
                const padding = " ".repeat(maxTitleLength - item.title.length + 4);
                return `${item.title}${padding}[${item.url}](${item.url})`;
            }),
            "",
            `Total: ${projects.length} projects`
        ].join("\n");
    }
}
