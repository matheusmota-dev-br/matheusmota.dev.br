import type { FileSystemNode } from './types';

class FileSystem {
    private root: FileSystemNode;
    private currentPath: string[];

    constructor() {
        this.currentPath = ['~'];
        this.root = this.buildFileSystem();
    }

    private buildFileSystem(): FileSystemNode {
        const root: FileSystemNode = {
            name: '~',
            type: 'directory',
            children: new Map(),
        };

        // Home directory structure
        const home = root.children!;

        // Projects directory
        home.set('projects', {
            name: 'projects',
            type: 'directory',
            children: new Map([
                ['README.md', {
                    name: 'README.md',
                    type: 'file',
                    content: '# My Projects\n\nThis directory contains all my personal and professional projects.\n\nUse `cat README.md` to view this file.',
                }],
                ['web-apps', {
                    name: 'web-apps',
                    type: 'directory',
                    children: new Map([
                        ['portfolio.txt', {
                            name: 'portfolio.txt',
                            type: 'file',
                            content: 'Portfolio website built with Astro and React.\nFeatures: Terminal interface, blog, tools, and more.',
                        }],
                        ['ecommerce.txt', {
                            name: 'ecommerce.txt',
                            type: 'file',
                            content: 'E-commerce platform with payment integration.\nTech stack: Next.js, PostgreSQL, Stripe API.',
                        }],
                    ]),
                }],
                ['apis', {
                    name: 'apis',
                    type: 'directory',
                    children: new Map([
                        ['rest-api.txt', {
                            name: 'rest-api.txt',
                            type: 'file',
                            content: 'RESTful API for managing resources.\nBuilt with NestJS and TypeScript.',
                        }],
                        ['graphql-api.txt', {
                            name: 'graphql-api.txt',
                            type: 'file',
                            content: 'GraphQL API with Apollo Server.\nIncludes authentication and authorization.',
                        }],
                    ]),
                }],
            ]),
        });

        // Documents directory
        home.set('documents', {
            name: 'documents',
            type: 'directory',
            children: new Map([
                ['resume.txt', {
                    name: 'resume.txt',
                    type: 'file',
                    content: 'Software Engineer with 5+ years of experience.\nSpecialized in Full-Stack Development.',
                }],
                ['notes', {
                    name: 'notes',
                    type: 'directory',
                    children: new Map([
                        ['learning.txt', {
                            name: 'learning.txt',
                            type: 'file',
                            content: 'Current learning topics:\n- System Design\n- Machine Learning\n- Cloud Architecture',
                        }],
                        ['ideas.txt', {
                            name: 'ideas.txt',
                            type: 'file',
                            content: 'Project ideas and future plans.\nAlways open to new challenges!',
                        }],
                    ]),
                }],
            ]),
        });

        // Config directory
        home.set('config', {
            name: 'config',
            type: 'directory',
            children: new Map([
                ['skills.txt', {
                    name: 'skills.txt',
                    type: 'file',
                    content: 'Technical Skills:\n- React, Vue.js, TypeScript\n- Node.js, Python\n- PostgreSQL, MongoDB\n- AWS, Docker, Kubernetes',
                }],
                ['preferences.txt', {
                    name: 'preferences.txt',
                    type: 'file',
                    content: 'Development Preferences:\n- Editor: VS Code\n- Theme: Dark mode\n- Terminal: Zsh with Oh My Zsh',
                }],
            ]),
        });

        // About file in home
        home.set('about.txt', {
            name: 'about.txt',
            type: 'file',
            content: 'Welcome to my virtual file system!\n\nThis is a simulated Linux file system.\nExplore directories with `cd` and `ls`.\nView files with `cat` command.',
        });

        return root;
    }

    getCurrentPath(): string {
        return this.currentPath.join('/');
    }

    getCurrentDirectory(): FileSystemNode {
        let current = this.root;
        for (let i = 1; i < this.currentPath.length; i++) {
            const dirName = this.currentPath[i];
            if (current.children && current.children.has(dirName)) {
                const next = current.children.get(dirName)!;
                if (next.type === 'directory') {
                    current = next;
                } else {
                    throw new Error(`Not a directory: ${dirName}`);
                }
            } else {
                throw new Error(`Directory not found: ${dirName}`);
            }
        }
        return current;
    }

    listDirectory(): FileSystemNode[] {
        const current = this.getCurrentDirectory();
        if (!current.children) {
            return [];
        }
        return Array.from(current.children.values())
            .sort((a, b) => {
                // Directories first, then files
                if (a.type !== b.type) {
                    return a.type === 'directory' ? -1 : 1;
                }
                return a.name.localeCompare(b.name);
            });
    }

    changeDirectory(path: string): string | null {
        if (path === '~' || path === '/') {
            this.currentPath = ['~'];
            return null;
        }

        if (path === '..') {
            if (this.currentPath.length > 1) {
                this.currentPath.pop();
            }
            return null;
        }

        const current = this.getCurrentDirectory();
        if (!current.children || !current.children.has(path)) {
            return `cd: no such file or directory: ${path}`;
        }

        const target = current.children.get(path)!;
        if (target.type !== 'directory') {
            return `cd: not a directory: ${path}`;
        }

        this.currentPath.push(path);
        return null;
    }

    getFileContent(path: string): string | null {
        const parts = path.split('/').filter(p => p);
        let current: FileSystemNode;

        // Handle absolute paths starting with ~
        if (path.startsWith('~/') || path === '~') {
            current = this.root;
            if (parts[0] === '~') {
                parts.shift();
            }
        } else {
            // Relative path - start from current directory
            current = this.getCurrentDirectory();
        }

        // If no path parts, it's an error (can't cat a directory)
        if (parts.length === 0) {
            return `cat: ${path}: Is a directory`;
        }

        // Navigate to the file's directory
        for (let i = 0; i < parts.length - 1; i++) {
            if (current.children && current.children.has(parts[i])) {
                const next = current.children.get(parts[i])!;
                if (next.type === 'directory') {
                    current = next;
                } else {
                    return `cat: ${path}: Is a directory`;
                }
            } else {
                return `cat: ${path}: No such file or directory`;
            }
        }

        // Get the file
        const fileName = parts[parts.length - 1];
        if (current.children && current.children.has(fileName)) {
            const file = current.children.get(fileName)!;
            if (file.type === 'file') {
                return file.content || '';
            } else {
                return `cat: ${path}: Is a directory`;
            }
        } else {
            return `cat: ${path}: No such file or directory`;
        }
    }
}

// Global file system instance
const fileSystem = new FileSystem();

// Export function to get current path
export function getCurrentPath(): string {
    return fileSystem.getCurrentPath();
}

// Export fileSystem instance for commands
export { fileSystem };
