import type { Command } from '../types';
import { fileSystem } from '../filesystem';

export class LsCommand implements Command {
    execute(): string {
        const items = fileSystem.listDirectory();

        if (items.length === 0) {
            return "Directory is empty.";
        }

        // Format: directories in blue, files in white
        const formatted = items.map(item => {
            const icon = item.type === 'directory' ? '📁' : '📄';
            const name = item.type === 'directory' ? `**${item.name}/**` : item.name;
            return `  ${icon}  ${name}`;
        });

        return [
            `Contents of ${fileSystem.getCurrentPath()}:`,
            "",
            ...formatted,
            "",
            `Total: ${items.length} ${items.length === 1 ? 'item' : 'items'}`,
        ].join("\n");
    }
}
