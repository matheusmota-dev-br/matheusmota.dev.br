export type Status = 'reading' | 'stopped' | 'standby' | 'done';

export interface Book {
    id: string;
    title: string;
    description: string;
    pages: string;
    currentPage: number;
    percentage: number;
    status: Status;
    link: string;
};

export interface EmailOptions {
    from: string;
    to: string;
    cc: string;
    subject: string;
    text: string;
    html?: string;
};

export interface ShortenUrl {
    id: number;
    shortURL: string;
    originURL: string;
    hash: string;
};

export const actions = {
    getLatestVersion: async () => {
        const response = await fetch(`/api/latest-version`);
        if (!response.ok) return { version: '' };
        return await response.json() as { version: string };
    },
    getBooks: async () => {
        const response = await fetch(`/api/books`);
        if (!response.ok) return [];
        return await response.json() as Book[];
    },
    sendEmail: async (options: EmailOptions) => {
        const url = 'https://email-notification-api-09se.onrender.com';
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(options),
        });
    },
    shortenUrl: async (originURL: string) => {
        const url = 'https://url-shortener-api-zno9.onrender.com';
        const response = await fetch(`${url}/shorten`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ originURL }),
        });
        if (!response.ok) return {} as ShortenUrl;
        return await response.json() as ShortenUrl;
    },
};
