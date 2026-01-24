import type { Command, SubCommand } from '../types';
import { games } from '../constants';

class GamesHelpSubCommand implements SubCommand {
    execute() {
        return [
            "Usage: **games** [COMMAND] [GAME_NAME]",
            "",
            "Interactive games available in this terminal.",
            "",
            "Commands:",
            "  **games help**              Display this help message",
            "  **games list**              List all available games",
            "  **games run [game_name]**   Launch and play a specific game",
            "",
            "Examples:",
            "  **games list**              Shows all available games",
            "  **games run snake**         Starts the Snake game",
        ].join("\n");
    }
}

class GamesListSubCommand implements SubCommand {
    execute() {
        return [
            "Available games:",
            "",
            ...games.map((game) => `  • ${game}`),
            "",
            "To start a game, use: **games run [game_name]**",
            "",
            "Example: **games run snake**"
        ].join("\n");
    }
}

class GamesRunSubCommand implements SubCommand {
    execute(args: string[]) {
        if (args.length === 0) {
            return [
                "Error: No game specified.",
                "",
                "Usage: **games run [game_name]**",
                "",
                "Available games:",
                ...games.map((game) => `  • ${game}`),
                "",
                "Example: **games run snake**"
            ].join("\n");
        }
        if (!games.includes(args[0])) {
            return [
                `Error: Game "${args[0]}" not found.`,
                "",
                "Available games:",
                ...games.map((game) => `  • ${game}`),
                "",
                "Use **games list** to see all available games."
            ].join("\n");
        }
        
        // Dispatch custom event to open game modal
        const openGameEvent = new CustomEvent('openGame', {
            detail: args[0]
        });
        window.dispatchEvent(openGameEvent);
        
        return `✓ Opening **${args[0]}** game...`;
    }
}

export class GamesCommand implements Command {
    private subCommands: Map<string, SubCommand> = new Map();

    constructor() {
        this.registerSubCommand("help", new GamesHelpSubCommand());
        this.registerSubCommand("list", new GamesListSubCommand());
        this.registerSubCommand("run", new GamesRunSubCommand());
    }

    registerSubCommand(name: string, command: SubCommand) {
        this.subCommands.set(name, command);
    }

    execute(args: string[]) {
        if (args.length === 0) {
            return [
                "Error: **games** command requires a subcommand.",
                "",
                "Usage: **games** [COMMAND]",
                "",
                "Available commands:",
                "  **games help**    Display help message",
                "  **games list**    List all available games",
                "  **games run**     Launch a game",
                "",
                "Use **games help** for more information."
            ].join("\n");
        }

        const subCommand = this.subCommands.get(args[0]);
        if (!subCommand) {
            return [
                `Error: Unknown subcommand "${args[0]}"`,
                "",
                "Available subcommands:",
                "  **games help**    Display help message",
                "  **games list**    List all available games",
                "  **games run**     Launch a game",
                "",
                "Use **games help** for more information."
            ].join("\n");
        }

        return subCommand.execute(args.slice(1));
    }
}
