import type { Command } from '../types';
import { fileSystem } from '../filesystem';

export class PwdCommand implements Command {
    execute(): string {
        return fileSystem.getCurrentPath();
    }
}
