import type { Command } from '../types';
import { fileSystem } from '../filesystem';

export class CdCommand implements Command {
    execute(args: string[]): string {
        if (args.length === 0) {
            // cd without arguments goes to home
            fileSystem.changeDirectory('~');
            return "";
        }

        const path = args[0];
        const error = fileSystem.changeDirectory(path);
        
        if (error) {
            return error;
        }

        return "";
    }
}
