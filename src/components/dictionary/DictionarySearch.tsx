'use client';

import { useState, useMemo } from 'react';

interface Word {
  id: string;
  name: string;
  phonetic?: string;
  definition: string;
  audio?: string | null | { url: string; type: string };
  descriptions: string[];
  similar?: string[];
}

interface DictionarySearchProps {
  words: Word[];
}

export function DictionarySearch({ words }: DictionarySearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWords = useMemo(() => {
    if (!searchTerm.trim()) {
      return words;
    }

    const term = searchTerm.toLowerCase().trim();
    return words.filter(
      (word) =>
        word.name.toLowerCase().includes(term) ||
        word.definition.toLowerCase().includes(term) ||
        word.id.toLowerCase().includes(term) ||
        (word.similar && word.similar.some((similar) => similar.toLowerCase().includes(term)))
    );
  }, [searchTerm, words]);

  return (
    <div className="w-full">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search for a word..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>

      {filteredWords.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            No words found matching "{searchTerm}"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.map((word) => (
            <a
              key={word.id}
              href={`/dictionary/${word.id}`}
              className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary hover:shadow-md transition-all"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                {word.name}
              </h3>
              {word.phonetic && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {word.phonetic}
                </p>
              )}
              <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                {word.definition}
              </p>
            </a>
          ))}
        </div>
      )}

      {searchTerm && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Found {filteredWords.length} word{filteredWords.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
