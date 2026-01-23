import React from "react";

interface SyntaxPattern {
    pattern: RegExp;
    transform: (match: RegExpMatchArray) => React.ReactNode;
};

const syntaxPatterns: SyntaxPattern[] = [
    {
        pattern: /\[([^\]]+)\]\(([^)]+)\)/,
        transform: ([, text, href]) => (
            <a href={href} target="_blank" className="text-primary hover:text-secondary">
                {text}
            </a>
        ),
    },
    {
        pattern: /\*\*([^*]+)\*\*/,
        transform: ([, text]) => <span className="text-primary">{text}</span>,
    },
    {
        pattern: /`([^`]+)`/,
        transform: ([, text]) => <mark className="bg-highlight">{text}</mark>,
    },
    {
        pattern: /_([^_]+)_/,
        transform: ([, text]) => <em>{text}</em>,
    },
    {
        pattern: /\[([#\w().,]+)\]\s*████/,
        transform: ([, color]) => (
            <span 
                className="inline-block w-4 h-4 rounded border border-gray-400 mr-2" 
                style={{ backgroundColor: color }}
                title={color}
            />
        ),
    },
];

export function transformMarkdown(text: string): React.ReactNode[][] {
    const parts: React.ReactNode[][] = [];

    for (const line of text.split("\n")) {
        if (line.trim().length === 0) {
            parts.push([<br />]);
        }

        const lineParts: React.ReactNode[] = [];
        let remainingText = line;

        while (remainingText.length) {
            let matched = false;

            for (const { pattern, transform } of syntaxPatterns) {
                const match = remainingText.match(pattern);

                if (match) {
                    matched = true;
                    const [matchedText] = match;
                    const index = remainingText.indexOf(matchedText);

                    if (index > 0) {
                        lineParts.push(remainingText.slice(0, index));
                    }

                    lineParts.push(transform(match));

                    remainingText = remainingText.slice(index + matchedText.length);
                }
            }

            if (!matched) {
                lineParts.push(remainingText);
                break;
            }
        }

        parts.push(lineParts);
    }

    return parts;
}
