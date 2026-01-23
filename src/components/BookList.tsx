import { useState, useEffect } from "react";
import { actions, type Book, type Status } from "@/lib";
import { Loading } from "./Loading";

const bookCoverMap: Record<string, string> = {
    'clean_code': '/books/clean_code.jpg',
    'clean_architecture': '/books/clean_architecture.jpg',
    'ddd': '/books/ddd.jpg',
    'system_design_interview': '/books/system_design_interview.jpg',
    'thinking_in_systems': '/books/thinking_in_systems.jpg',
};

const statusColor: Record<Status, string> = {
    done: 'bg-green-500',
    stopped: 'bg-yellow-500',
    reading: 'bg-primary',
    standby: 'bg-gray-500',
};

export function BookList() {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        actions.getBooks().then((books) => setBooks(books));
    }, []);

    if (books.length === 0) return (
        <div className="relative flex justify-center">
            <Loading />
        </div>
    )

    return (
        <>
            {books?.sort((a, b) => {
                if (a.status === 'reading' || b.status === 'reading') return -1;
                return 1;
            }).map((book) => (
                <div
                    className="flex items-center bg-offset rounded-2xl w-full md:max-w-2xl shadow-lg"
                    key={book.id}
                >
                    <img
                        src={bookCoverMap[book.id]}
                        alt={book.title}
                        width={200}
                        height={200}
                        className="hidden md:block object-cover bg-no-repeat rounded-2xl"
                    />
                    <div className="mx-4 my-2 w-full px-4 py-4">
                        <h3 className="text-2xl mb-4 font-bold">{book.title}</h3>
                        <div className="w-full h-5 bg-border rounded-full">
                            <div
                                className="rounded-full bg-primary h-5"
                                style={{ width: `${book.percentage * 100}%` }}
                            />
                        </div>
                        <div className="text-end mt-2">{`${(book.percentage * 100).toFixed(1)}% (${book.currentPage}/${book.pages})`}</div>
                        <p className="mt-4">{book.description}</p>
                        <div className="flex justify-between mt-8">
                            {book.link && <a target="_blank" href={book.link} className="bg-primary px-2 rounded-full hover:bg-secondary text-white">Link</a>}
                            <div className={`${statusColor[book.status]} rounded-full text-center px-2 text-white`}>
                                {book.status}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}