import type { Command } from '../types';

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
