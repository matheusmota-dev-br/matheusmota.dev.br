import type { Command, SubCommand } from '../types';
import { basic } from '@/config/cv.json';

class CvHelpSubCommand implements SubCommand {
    execute(): string {
        return [
            "Usage: **cv** [OPTION]",
            "",
            "Manage and access my curriculum vitae.",
            "",
            "Options:",
            "  **cv help**        Display this help message",
            "  **cv online**      Open CV in a new browser tab",
            "  **cv download**    Download CV as PDF file",
            "",
            "Examples:",
            "  **cv online**      Opens the online version of my CV",
            "  **cv download**    Downloads a PDF copy to your device",
        ].join("\n");
    }
}

class CVOnlineSubCommand implements SubCommand {
    execute() {
        window.open(basic.cv_link, "_blank");
        return null;
    }
}

class CVDownloadSubCommand implements SubCommand {
    execute() {
        const link = document.createElement("a");
        link.href = `${basic.cv_link}/export?format=pdf`;
        link.download = "";
        link.click();

        return null;
    }
}

export class CVCommand implements Command {
    private subCommands: Map<string, SubCommand> = new Map();

    constructor() {
        this.registerSubCommand("help", new CvHelpSubCommand());
        this.registerSubCommand("online", new CVOnlineSubCommand());
        this.registerSubCommand("download", new CVDownloadSubCommand());
    }

    registerSubCommand(name: string, command: SubCommand) {
        this.subCommands.set(name, command);
    }

    execute(args: string[]) {
        if (args.length === 0) {
            return [
                "Error: **cv** command requires an option.",
                "",
                "Usage: **cv** [OPTION]",
                "",
                "Use **cv help** to see available options."
            ].join("\n");
        }

        const subCommand = this.subCommands.get(args[0]);
        if (!subCommand) {
            return [
                `Error: Unknown option "${args[0]}"`,
                "",
                "Available options:",
                "  **cv help**        Display help message",
                "  **cv online**      Open CV online",
                "  **cv download**   Download CV as PDF",
                "",
                "Use **cv help** for more information."
            ].join("\n");
        }

        return subCommand.execute(args.slice(1));
    }
}
