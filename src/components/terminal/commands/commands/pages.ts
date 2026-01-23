import type { Command } from '../types';
import { pages } from '../constants';

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
