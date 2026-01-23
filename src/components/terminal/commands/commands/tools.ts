import type { Command } from '../types';
import toolsData from '@/config/tools.json';

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
