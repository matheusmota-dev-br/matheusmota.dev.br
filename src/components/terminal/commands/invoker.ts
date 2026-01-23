import type { Command } from './types';

export class CommandInvoker {
    private commands: Map<string, Command> = new Map();

    registerCommand(name: string, command: Command) {
        this.commands.set(name, command);
    }

    getCommand(name: string): Command | undefined {
        return this.commands.get(name);
    }

    executeCommand(input: string) {
        const [name, ...args] = input.trim().split(" ");
        const command = this.commands.get(name);

        if (!command) {
            return [
                `Error: Command "${input.split(' ')[0]}" not found.`,
                "",
                "Type **help** to see all available commands.",
                "",
                "For command-specific help, use: **[command] help**",
                "",
                "Example: **cv help** or **games help**"
            ].join("\n");
        }

        return command.execute(args);
    }
}
