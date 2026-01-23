import type { Command } from '../types';
import { fileSystem } from '../filesystem';

export class CatCommand implements Command {
    execute(args: string[]): string {
        if (args.length === 0) {
            return [
                "Usage: **cat** [FILE]",
                "",
                "Display the contents of a file.",
                "",
                "Example: **cat about.txt**"
            ].join("\n");
        }

        const path = args[0];
        const content = fileSystem.getFileContent(path);
        
        if (content === null) {
            return `cat: ${path}: No such file or directory`;
        }

        if (content.startsWith('cat: ')) {
            return content; // Error message
        }

        return content;
    }
}
