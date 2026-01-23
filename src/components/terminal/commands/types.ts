export interface Command {
    execute(args: string[]): null | string;
}

export interface SubCommand {
    execute(args: string[]): null | string;
}

export interface FileSystemNode {
    name: string;
    type: 'file' | 'directory';
    content?: string; // For files, this is the comment/content
    children?: Map<string, FileSystemNode>; // For directories
}
