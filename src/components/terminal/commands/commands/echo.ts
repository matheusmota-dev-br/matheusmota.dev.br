import type { Command } from '../types';

export class EchoCommand implements Command {
    execute(args: string[]): string {
        if (args.length === 0) {
            return [
                "Usage: **echo** [TEXT]",
                "",
                "Echo the provided text back to the terminal.",
                "",
                "Example: **echo Hello, World!**"
            ].join("\n");
        }
        return args.join(" ");
    }
}
