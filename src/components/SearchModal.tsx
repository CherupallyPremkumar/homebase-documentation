import { useState, useEffect, useRef } from 'react';
import { Search, X, FileText } from 'lucide-react';
import Fuse from 'fuse.js';
import type { DocItem } from '@/types';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    documents: DocItem[];
    onSelectDocument: (docId: string) => void;
}

export function SearchModal({ isOpen, onClose, documents, onSelectDocument }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<DocItem[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize Fuse.js for fuzzy search
    const fuse = new Fuse(documents, {
        keys: [
            { name: 'title', weight: 2 },
            { name: 'content', weight: 1 },
            { name: 'category', weight: 0.5 }
        ],
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 2,
    });

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setQuery('');
            setResults([]);
            setSelectedIndex(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
            return;
        }

        const searchResults = fuse.search(query);
        setResults(searchResults.map(result => result.item));
        setSelectedIndex(0);
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const handleSelect = (doc: DocItem) => {
        onSelectDocument(doc.id);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-20">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[600px] flex flex-col">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                    <Search className="h-5 w-5 text-gray-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search documentation... (type at least 2 characters)"
                        className="flex-1 outline-none text-lg"
                    />
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Results */}
                <div className="flex-1 overflow-y-auto">
                    {query.trim().length < 2 ? (
                        <div className="p-8 text-center text-gray-500">
                            <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-sm">Type at least 2 characters to search</p>
                            <p className="text-xs mt-2 text-gray-400">
                                Use ↑↓ to navigate, Enter to select, Esc to close
                            </p>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-sm">No documents found for "{query}"</p>
                            <p className="text-xs mt-2 text-gray-400">
                                Try different keywords or check spelling
                            </p>
                        </div>
                    ) : (
                        <div className="py-2">
                            {results.map((doc, index) => (
                                <button
                                    key={doc.id}
                                    onClick={() => handleSelect(doc)}
                                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-l-4 ${index === selectedIndex
                                            ? 'bg-green-50 border-green-600'
                                            : 'border-transparent'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <FileText className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900 truncate">
                                                {doc.title}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                                    {doc.category}
                                                </span>
                                                {doc.priority && (
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${doc.priority === 'high' ? 'bg-red-100 text-red-700' :
                                                            doc.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-green-100 text-green-700'
                                                        }`}>
                                                        {doc.priority}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                {doc.content.substring(0, 150)}...
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">↑↓</kbd>
                            Navigate
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Enter</kbd>
                            Select
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Esc</kbd>
                            Close
                        </span>
                    </div>
                    <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
                </div>
            </div>
        </div>
    );
}
