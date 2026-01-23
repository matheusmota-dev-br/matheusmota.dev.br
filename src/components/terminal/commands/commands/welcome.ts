import type { Command } from '../types';

export class WelcomeCommand implements Command {
    execute() {
        return [
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
            "",
            "  Welcome to my Terminal Portfolio!",
            "",
            "  This is an interactive terminal interface to explore my work, skills,",
            "  projects, and more. Type commands to navigate and discover information.",
            "",
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
            "",
            "Quick start:",
            "  • Type **help** to see all available commands",
            "  • Type **whoami** to learn about me",
            "  • Type **[command] help** for detailed command information",
            "",
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        ].join("\n");
    }
}
