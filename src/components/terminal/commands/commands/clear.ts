import type { Command } from '../types';

export class ClearCommand implements Command {
    execute() {
        return null;
    }
}
