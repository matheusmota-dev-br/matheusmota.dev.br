import type { Command } from '../types';
import { actions } from '@/lib';

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
            const topBorder = "┌" + "─".repeat(maxTitleLength + 2) + "┬" + "─".repeat(12) + "┼" + "─".repeat(progressBarLength + 8) + "┼" + "─".repeat(12) + "┐";
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
