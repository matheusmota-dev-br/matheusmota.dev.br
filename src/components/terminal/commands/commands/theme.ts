import type { Command } from '../types';
import { toggleMarkdownTheme, updateToggleThemeIcon } from '@/scripts/theme';

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
