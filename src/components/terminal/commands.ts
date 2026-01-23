import { toggleMarkdownTheme, updateToggleThemeIcon } from '@/scripts/theme';
import { basic, social, experiences, education, projects, phrase } from '@/config/cv.json';
import toolsData from '@/config/tools.json';
import { actions } from '@/actions';

/* Abstractions */

interface Command {
    execute(args: string[]): null | string;
}

interface SubCommand {
    execute(args: string[]): null | string;
}

const games: string[] = [
    "flappy-bird",
    "pong",
    "tic-tac-toe",
    "hangman",
    "memory",
    "tetris",
];

const pages = [
    { name: "Home", href: "/" },
    { name: "Bio", href: "/bio" },
    { name: "Tools", href: "/tools" },
    { name: "Books", href: "/books" },
    { name: "Terminal", href: "/terminal" },
    { name: "Academic - Master", href: "/academic/master" },
];

/* Sub-commands */

class CvHelpSubCommnad implements SubCommand {
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
            "  **games run tetris**        Starts the Tetris game",
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
            "Example: **games run tetris**"
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
                "Example: **games run tetris**"
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
        /* TODO: Implements games run on screen */
        return `Starting **${args[0]}**...\n\n(Note: Game functionality coming soon!)`;
    }
}

/* Commands */

export class WhoAmICommand implements Command {
    execute() {
        return [
            `**${basic.name}**`,
            "",
            basic.summary,
            "",
            `Role: ${basic.job}`,
            "",
            "Use **help** to see available commands."
        ].join("\n");
    }
}

export class ExperienceCommand implements Command {
    execute() {
        return experiences.flatMap((item) => [
            `**${item.title} [${item.sub_title}] ${item.years}**`,
            "",
            `${item.details}`,
            "",
            `Skills: [${item.skills.map((s) => `**${s.name}**`).join(', ')}]`,
            "",
            "----",
            ""
        ]).join("\n");
    }
}

export class EducationCommand implements Command {
    execute() {
        return education.flatMap((item) => [
            `**${item.title} [${item.sub_title}] ${item.years}**`,
            "",
            `${item.details}`,
            "",
            "----",
            "",
        ]).join("\n");
    }
}

export class SkillsCommand implements Command {
    execute() {
        return [
            "**Technical Skills:**",
            "",
            basic.skills.map((item) => `  • **${item.name}**`).join('\n'),
            "",
            `Total: ${basic.skills.length} skills`
        ].join("\n");
    }
}

export class ProjectsCommand implements Command {
    execute() {
        const maxTitleLength = Math.max(...projects.map((s) => s.title.length));
        return [
            "**My Projects:**",
            "",
            ...projects.map((item) => {
                const padding = " ".repeat(maxTitleLength - item.title.length + 4);
                return `${item.title}${padding}[${item.url}](${item.url})`;
            }),
            "",
            `Total: ${projects.length} projects`
        ].join("\n");
    }
}

export class SocialCommand implements Command {
    execute() {
        const maxTitleLength = Math.max(...social.map((s) => s.title.length));
        return [
            "**Social Networks:**",
            "",
            ...social.map((item) => {
                const padding = " ".repeat(maxTitleLength - item.title.length + 4);
                return `${item.title}${padding}[${item.url}](${item.url})`;
            }),
            "",
            "Connect with me on any of these platforms!"
        ].join("\n");
    }
}

export class CVCommand implements Command {
    private subCommands: Map<string, SubCommand> = new Map();

    constructor() {
        this.registerSubCommand("help", new CvHelpSubCommnad());
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

export class ThemeCommand implements Command {
    execute(args: string[]) {
        const theme = args[0];
        const options = ["light", "dark"];

        if (args.length === 0) {
            return [
                "Usage: **theme** [THEME_NAME]",
                "",
                "Change the terminal color theme.",
                "",
                "Available themes:",
                ...options.map((option) => `  • **${option}**`),
                "",
                "Example: **theme dark**"
            ].join("\n");
        }

        if (options.includes(theme)) {
            document.documentElement.dataset.theme = theme;
            localStorage.setItem("theme", theme);
            updateToggleThemeIcon();
            toggleMarkdownTheme(theme);

            return `✓ Theme changed to **${theme}** mode.`;
        }

        return [
            `Error: Invalid theme "${theme}"`,
            "",
            "Available themes:",
            ...options.map((option) => `  • **${option}**`),
            "",
            "Example: **theme dark**"
        ].join("\n");
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

export class HelpCommand implements Command {
    execute(): string {
        return [
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
            "",
            "  Available Commands",
            "",
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
            "",
            "**Information Commands:**",
            "  **whoami**       Display personal information and introduction",
            "  **experience**   Show professional work experience",
            "  **education**   Display educational background",
            "  **skills**       List technical skills and technologies",
            "  **projects**     Show portfolio projects with links",
            "  **social**       Display social media profiles",
            "",
            "**CV & Documents:**",
            "  **cv**           Manage curriculum vitae (use 'cv help' for options)",
            "",
            "**Navigation & Tools:**",
            "  **pages**        List and navigate to website pages",
            "  **tools**        Access available web tools",
            "",
            "**Content & Media:**",
            "  **quote**        Display an inspirational quote",
            "  **books**        Show reading collection with progress tracking",
            "",
            "**Customization:**",
            "  **theme**        Switch between light/dark theme",
            "  **colors**       Display theme color palettes",
            "",
            "**Entertainment:**",
            "  **games**        Play interactive terminal games",
            "",
            "**System Commands:**",
            "  **help**         Display this help message",
            "  **welcome**      Show welcome message",
            "  **echo**         Echo text back to terminal",
            "  **clear**        Clear terminal screen",
            "",
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
            "",
            "For detailed information about a specific command, use: **[command] help**",
            "",
            "Example: **cv help** or **games help**",
        ].join("\n");
    }
}

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

export class ClearCommand implements Command {
    execute() {
        return null;
    }
}

export class PagesCommand implements Command {
    execute(args: string[]) {
        if (args.length === 0) {
            const maxNameLength = Math.max(...pages.map((p) => p.name.length));
            return [
                "**Available Pages:**",
                "",
                ...pages.map((page) => {
                    const padding = " ".repeat(maxNameLength - page.name.length + 4);
                    return `  ${page.name}${padding}[${page.href}](${page.href})`;
                }),
                "",
                "To open a page in a new tab, use: **pages open [page_name]**",
                "",
                "Examples:",
                "  **pages open home**",
                "  **pages open bio**",
            ].join("\n");
        }

        if (args[0] === "open" && args.length > 1) {
            const pageName = args.slice(1).join(" ").toLowerCase();
            const page = pages.find(
                (p) => p.name.toLowerCase() === pageName
            );

            if (!page) {
                return [
                    `Error: Page "${args.slice(1).join(" ")}" not found.`,
                    "",
                    "Available pages:",
                    ...pages.map((p) => `  • ${p.name}`),
                    "",
                    "Use **pages** to see all available pages."
                ].join("\n");
            }

            window.open(page.href, "_blank");
            return `✓ Opening **${page.name}** in a new browser tab...`;
        }

        if (args[0] === "help") {
            return [
                "Usage: **pages** [COMMAND] [PAGE_NAME]",
                "",
                "Navigate to different pages of this website.",
                "",
                "Commands:",
                "  **pages**              List all available pages",
                "  **pages open [name]**  Open a page in a new browser tab",
                "  **pages help**         Display this help message",
                "",
                "Examples:",
                "  **pages**                    Shows all available pages",
                "  **pages open home**         Opens the home page",
                "  **pages open bio**          Opens the bio page",
            ].join("\n");
        }

        return [
            `Error: Unknown subcommand "${args[0]}"`,
            "",
            "Available subcommands:",
            "  **pages**              List all available pages",
            "  **pages open [name]**  Open a page in a new tab",
            "  **pages help**         Show help message",
            "",
            "Use **pages help** for more information."
        ].join("\n");
    }
}

export class ToolsCommand implements Command {
    execute(args: string[]) {
        if (args.length === 0) {
            const maxTitleLength = Math.max(...toolsData.tools.map((t) => t.title.length));
            return [
                "**Available Tools:**",
                "",
                ...toolsData.tools.map((tool) => {
                    const padding = " ".repeat(maxTitleLength - tool.title.length + 4);
                    return `  ${tool.title}${padding}[${tool.url}](${tool.url})`;
                }),
                "",
                "To open a tool in a new tab, use: **tools open [tool_name]**",
                "",
                "Example: **tools open url-pretty**",
            ].join("\n");
        }

        if (args[0] === "open" && args.length > 1) {
            const toolName = args.slice(1).join(" ").toLowerCase();
            const tool = toolsData.tools.find(
                (t) => t.title.toLowerCase() === toolName
            );

            if (!tool) {
                return [
                    `Error: Tool "${args.slice(1).join(" ")}" not found.`,
                    "",
                    "Available tools:",
                    ...toolsData.tools.map((t) => `  • ${t.title}`),
                    "",
                    "Use **tools** to see all available tools."
                ].join("\n");
            }

            window.open(tool.url, "_blank");
            return `✓ Opening **${tool.title}** in a new browser tab...`;
        }

        if (args[0] === "help") {
            return [
                "Usage: **tools** [COMMAND] [TOOL_NAME]",
                "",
                "Access and use web-based tools.",
                "",
                "Commands:",
                "  **tools**              List all available tools",
                "  **tools open [name]**  Open a tool in a new browser tab",
                "  **tools help**         Display this help message",
                "",
                "Examples:",
                "  **tools**                        Shows all available tools",
                "  **tools open url-pretty**        Opens the URL Pretty tool",
                "  **tools open password-generator** Opens the Password Generator",
            ].join("\n");
        }

        return [
            `Error: Unknown subcommand "${args[0]}"`,
            "",
            "Available subcommands:",
            "  **tools**              List all available tools",
            "  **tools open [name]**  Open a tool in a new tab",
            "  **tools help**         Show help message",
            "",
            "Use **tools help** for more information."
        ].join("\n");
    }
}

export class QuoteCommand implements Command {
    execute() {
        return [
            "",
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
            "",
            `  "${phrase.text}"`,
            "",
            `  — ${phrase.author}`,
            "",
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        ].join("\n");
    }
}

export class BooksCommand implements Command {
    async executeAsync(): Promise<string> {
        try {
            const books = await actions.getBooks();
            
            if (books.length === 0) {
                return [
                    "No books found in the collection.",
                    "",
                    "The reading list may be empty or there was an issue loading the data.",
                    "Please try again later."
                ].join("\n");
            }

            // Sort books: reading first, then by status
            const sortedBooks = books.sort((a, b) => {
                if (a.status === 'reading' && b.status !== 'reading') return -1;
                if (a.status !== 'reading' && b.status === 'reading') return 1;
                return 0;
            });

            const statusEmoji: Record<string, string> = {
                'reading': '📖',
                'done': '✅',
                'stopped': '⏸️',
                'standby': '⏳',
            };

            const statusLabel: Record<string, string> = {
                'reading': 'Reading',
                'done': 'Done',
                'stopped': 'Stopped',
                'standby': 'Standby',
            };

            const maxTitleLength = Math.min(Math.max(...sortedBooks.map((b) => b.title.length)), 40);
            const progressBarLength = 25;

            const tableRows = sortedBooks.map((book) => {
                const title = book.title.length > maxTitleLength 
                    ? book.title.substring(0, maxTitleLength - 3) + '...' 
                    : book.title;
                const titlePadding = " ".repeat(Math.max(0, maxTitleLength - title.length));
                const progressBar = this.createProgressBar(book.percentage, progressBarLength);
                const percentage = `${(book.percentage * 100).toFixed(1)}%`.padStart(6);
                const status = statusLabel[book.status] || book.status;
                const pagesInfo = `${book.currentPage}/${book.pages}`.padStart(10);
                
                return `│ ${title}${titlePadding} │ ${statusEmoji[book.status] || '📚'} ${status.padEnd(8)} │ ${progressBar} ${percentage} │ ${pagesInfo} │`;
            });

            const header = `│ ${"Title".padEnd(maxTitleLength)} │ ${"Status".padEnd(10)} │ ${"Progress".padEnd(progressBarLength + 6)} │ ${"Pages".padEnd(10)} │`;
            const topBorder = "┌" + "─".repeat(maxTitleLength + 2) + "┬" + "─".repeat(12) + "┬" + "─".repeat(progressBarLength + 8) + "┬" + "─".repeat(12) + "┐";
            const bottomBorder = "└" + "─".repeat(maxTitleLength + 2) + "┴" + "─".repeat(12) + "┴" + "─".repeat(progressBarLength + 8) + "┴" + "─".repeat(12) + "┘";

            return [
                "**My Reading Collection**",
                "",
                `Total books: ${sortedBooks.length}`,
                "",
                topBorder,
                header,
                "├" + "─".repeat(maxTitleLength + 2) + "┼" + "─".repeat(12) + "┼" + "─".repeat(progressBarLength + 8) + "┼" + "─".repeat(12) + "┤",
                ...tableRows,
                bottomBorder,
                "",
                "**Status Legend:**",
                "  📖 Reading  - Currently reading",
                "  ✅ Done     - Completed",
                "  ⏸️ Stopped  - Reading paused",
                "  ⏳ Standby  - Queued for reading",
            ].join("\n");
        } catch (error) {
            return [
                "Error: Failed to load books collection.",
                "",
                "Possible causes:",
                "  • Network connection issue",
                "  • Data source temporarily unavailable",
                "",
                "Please try again later or check your internet connection."
            ].join("\n");
        }
    }

    execute(): string {
        // For async operations, we'll need to handle this differently
        // For now, return a message and handle async in Terminal component
        return "BOOKS_ASYNC";
    }

    private createProgressBar(percentage: number, length: number = 20): string {
        const filled = Math.round(percentage * length);
        const empty = length - filled;
        return "█".repeat(filled) + "░".repeat(empty);
    }
}

export class ColorsCommand implements Command {
    execute() {
        const lightTheme = {
            primary: "#3b82f6",      // blue.500
            secondary: "#818cf8",    // indigo.400
            text: "#111827",         // gray.900
            "text-offset": "#4b5563", // gray.600
            background: "#f9fafb",   // gray.50
            "background-offset": "#f3f4f6", // gray.100
            border: "rgba(17, 24, 39, 0.1)",
        };

        const darkTheme = {
            primary: "#60a5fa",      // blue.400
            secondary: "#a5b4fc",    // indigo.300
            text: "#f9fafb",         // gray.50
            "text-offset": "#9ca3af", // gray.400
            background: "#111827",   // gray.900
            "background-offset": "#1f2937", // gray.800
            border: "rgba(249, 250, 251, 0.1)",
        };

        const formatColorRow = (name: string, color: string) => {
            const maxNameLength = 20;
            const padding = " ".repeat(Math.max(0, maxNameLength - name.length));
            return `[${color}] ████ ${name}${padding} ${color}`;
        };

        return [
            "**Theme Color Palettes**",
            "",
            "This terminal supports two color themes. Each theme defines colors for",
            "different UI elements. Use **theme [light|dark]** to switch themes.",
            "",
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
            "",
            "**Light Theme Colors:**",
            "",
            ...Object.entries(lightTheme).map(([name, color]) => formatColorRow(name, color)),
            "",
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
            "",
            "**Dark Theme Colors:**",
            "",
            ...Object.entries(darkTheme).map(([name, color]) => formatColorRow(name, color)),
            "",
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
            "",
            "To change theme: **theme light** or **theme dark**",
        ].join("\n");
    }
}

/* Invoker */

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