import { useState, useEffect, useRef, type ReactNode, useReducer } from "react";
import asciiArt from "./ascii-art";

import {
    CommandInvoker,
    ClearCommand,
    CVCommand,
    EchoCommand,
    EducationCommand,
    ExperienceCommand,
    HelpCommand,
    ProjectsCommand,
    SkillsCommand,
    SocialCommand,
    ThemeCommand,
    WelcomeCommand,
    WhoAmICommand,
    GamesCommand,
    PagesCommand,
    ToolsCommand,
    QuoteCommand,
    BooksCommand,
    ColorsCommand,
    LsCommand,
    CdCommand,
    PwdCommand,
    CatCommand,
    BackCommand,
    getCurrentPath
} from "./commands";

import { transformMarkdown } from "./transform-markdown";
import { keydownReducer, type Keydown } from "./keydown-reducer";

export function Terminal() {
    const [currentPath, setCurrentPath] = useState('~');

    const [output, setOutput] = useState<React.ReactNode[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getBash = () => `[math-term:${currentPath}$]`;

    const [state, dispatch] = useReducer(keydownReducer, {
        prev: "",
        next: "",
        position: 0,
        history: [],
        historyIndex: 0,
    });

    const [isMobile, setIsMobile] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const commandRef = useRef<HTMLPreElement>(null);

    const invoker = new CommandInvoker();
    invoker.registerCommand("whoami", new WhoAmICommand());
    invoker.registerCommand("experience", new ExperienceCommand());
    invoker.registerCommand("education", new EducationCommand());
    invoker.registerCommand("skills", new SkillsCommand());
    invoker.registerCommand("projects", new ProjectsCommand());
    invoker.registerCommand("social", new SocialCommand());
    invoker.registerCommand("cv", new CVCommand());
    invoker.registerCommand("theme", new ThemeCommand());
    invoker.registerCommand("games", new GamesCommand());
    invoker.registerCommand("pages", new PagesCommand());
    invoker.registerCommand("tools", new ToolsCommand());
    invoker.registerCommand("quote", new QuoteCommand());
    invoker.registerCommand("books", new BooksCommand());
    invoker.registerCommand("colors", new ColorsCommand());
    invoker.registerCommand("ls", new LsCommand());
    invoker.registerCommand("cd", new CdCommand());
    invoker.registerCommand("pwd", new PwdCommand());
    invoker.registerCommand("cat", new CatCommand());
    invoker.registerCommand("help", new HelpCommand());
    invoker.registerCommand("welcome", new WelcomeCommand());
    invoker.registerCommand("echo", new EchoCommand());
    invoker.registerCommand("clear", new ClearCommand());
    invoker.registerCommand("back", new BackCommand());

    async function handleCommand(input: string) {
        const output = invoker.executeCommand(input);

        dispatch({ type: 'Enter', invoker });

        if (input === 'clear') {
            setOutput([]);
            return;
        }

        // Update path after cd command (even if it fails, to show error)
        if (input.startsWith('cd ')) {
            setCurrentPath(getCurrentPath());
            // If cd succeeded (empty output), don't show anything
            if (output === "") {
                return;
            }
        } else {
            // Update path for other commands that might change directory
            setCurrentPath(getCurrentPath());
        }

        // Handle async commands (like books)
        if (output === "BOOKS_ASYNC") {
            setIsLoading(true);
            try {
                const booksCommand = invoker.getCommand("books") as BooksCommand;
                if (booksCommand) {
                    const booksOutput = await booksCommand.executeAsync();
                    appendOutput(input, transformMarkdown(booksOutput));
                }
            } catch (error) {
                appendOutput(input, transformMarkdown("Error loading books. Please try again later."));
            } finally {
                setIsLoading(false);
            }
        } else if (output !== "") {
            // Only append output if it's not empty (cd returns empty on success)
            appendOutput(input, transformMarkdown(output));
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        // Block input when loading
        if (isLoading) {
            e.preventDefault();
            return;
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            handleCommand(state.prev + state.next).catch(console.error);
            return;
        }

        if (e.key.length === 1) {
            !isMobile && dispatch({ type: 'Letter', letter: e.key });
            return;
        }

        dispatch({ type: e.key as Keydown });
    }

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        // Block input when loading
        if (isLoading) return;
        if (!isMobile) return;

        const input = e.target.value;

        if (state.prev.length > input.length) dispatch({ type: 'Delete' });
        else if (state.prev.length < input.length) dispatch({ type: 'Letter', letter: input.slice(-1) });
    }

    function appendOutput(command: string, content: ReactNode[][]) {
        setOutput((prev) => [
            ...prev,
            <pre className="flex">
                <p className="font-bold text-primary">{getBash()}</p>&nbsp;<br />
                <p>{command}</p>
            </pre>,
            <br />,
            command === "welcome" ? asciiArt : null,
            <br />,
            ...content.map((c, i) => (
                <pre className="whitespace-pre-wrap" key={i}>
                    {c}
                </pre>
            )),
            <br />,
        ]);
    }

    useEffect(() => {
        setTimeout(() => {
            commandRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 0);
    }, [output]);

    // Restore focus when loading finishes
    useEffect(() => {
        if (!isLoading && textareaRef.current) {
            // Small delay to ensure the textarea is re-enabled and DOM is updated
            const timeoutId = setTimeout(() => {
                if (textareaRef.current && !textareaRef.current.disabled) {
                    textareaRef.current.focus();
                }
            }, 10);
            
            return () => clearTimeout(timeoutId);
        }
    }, [isLoading]);

    useEffect(() => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        setIsMobile(isTouchDevice);

        // Initialize current path
        setCurrentPath(getCurrentPath());

        handleCommand("welcome");

        const focusTextarea = (event: MouseEvent) => {
            if (textareaRef.current && event.target !== textareaRef.current) {
                // Only focus if not loading and textarea is not disabled
                if (!textareaRef.current.disabled) {
                    textareaRef.current.focus();
                }
            }
        };

        document.addEventListener("click", focusTextarea);
        return () => document.removeEventListener("click", focusTextarea);
    }, []);

    return (
        <div className="max-w-6x h-full m-4">
            <pre className="output">
                {output.map((line, index) => (
                    <pre key={index}>{line}</pre>
                ))}
            </pre>

            <pre
                className="flex items-center"
                ref={commandRef}
            >
                <p className="font-bold text-primary font-mono">{getBash()}</p>&nbsp;
                {isLoading ? (
                    <>
                        <span className="text-text-offset">Loading books...</span>
                        <span className="ml-2 inline-block">
                            <div className="animate-spin">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 15 15" className="text-primary">
                                    <path fill="currentColor" fillRule="evenodd" d="M8 .5V5H7V.5zM5.146 5.854l-3-3l.708-.708l3 3zm4-.708l3-3l.708.708l-3 3zm.855 1.849L14.5 7l-.002 1l-4.5-.006zm-9.501 0H5v1H.5zm5.354 2.859l-3 3l-.708-.708l3-3zm6.292 3l-3-3l.708-.708l3 3zM8 10v4.5H7V10z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </span>
                    </>
                ) : (
                    <>
                        <p>{state.prev}</p>
                        <span className="inline-block w-[10px] h-[1.5em] bg-text animate-[blinker_1s_linear_infinite] font-mono"></span>
                        <p>{state.next}</p>
                    </>
                )}
            </pre>

            <textarea
                ref={textareaRef}
                autoFocus
                className="position absolute -left-96"
                value={state.prev + state.next}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                autoCapitalize="off"
                disabled={isLoading}
            />
        </div>
    )
}