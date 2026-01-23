import type { Command } from '../types';

export class BackCommand implements Command {
    execute(args: string[]): string {
        if (args.length > 0 && args[0] === "help") {
            return [
                "Usage: **back**",
                "",
                "Navigate back to the previous page in browser history.",
                "",
                "This command uses the browser's history API to go back to the",
                "previously visited page, similar to clicking the browser's back button.",
                "",
                "Examples:",
                "  **back**    Go back to the previous page",
                "  **back help**  Display this help message",
            ].join("\n");
        }

        // Use browser history to go back
        if (typeof window !== 'undefined') {
            window.location.href = '/';
            return "✓ Going back to the previous page...";
        }

        return "Error: Cannot go back.";
    }
}
