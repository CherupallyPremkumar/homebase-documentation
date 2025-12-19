import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import matter from 'gray-matter';

type Category = 'documentation' | 'current-plan' | 'future-plans' | 'tasks';

interface EditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (content: string, commitMessage: string) => Promise<void>;
    initialContent?: string;
    category: Category;
    title?: string;
}

export function EditorModal({
    isOpen,
    onClose,
    onSave,
    initialContent = '',
    category,
    title: initialTitle = '',
}: EditorModalProps) {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState('');
    const [order, setOrder] = useState('');
    const [priority, setPriority] = useState('');
    const [commitMessage, setCommitMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (initialContent) {
            const { data, content: markdown } = matter(initialContent);
            setTitle(data.title || initialTitle);
            setContent(markdown);
            setOrder(data.order?.toString() || '');
            setPriority(data.priority || '');
        } else {
            setTitle(initialTitle);
            setContent('');
            setOrder('');
            setPriority('');
        }
        setCommitMessage(initialContent ? `Update ${initialTitle}` : `Create ${initialTitle}`);
    }, [initialContent, initialTitle]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // Build frontmatter
            const frontmatter: any = {
                title,
                category,
            };
            if (order) frontmatter.order = parseInt(order);
            if (priority) frontmatter.priority = priority;

            // Combine frontmatter and content
            const fullContent = matter.stringify(content, frontmatter);

            await onSave(fullContent, commitMessage);
            onClose();
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save document. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialContent ? 'Edit Document' : 'New Document'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    {/* Metadata */}
                    <div className="p-6 border-b border-gray-200 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <input
                                    type="text"
                                    value={category}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Order (optional)
                                </label>
                                <input
                                    type="number"
                                    value={order}
                                    onChange={(e) => setOrder(e.target.value)}
                                    placeholder="1, 2, 3..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Priority (optional)
                                </label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                >
                                    <option value="">None</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Commit Message *
                            </label>
                            <input
                                type="text"
                                value={commitMessage}
                                onChange={(e) => setCommitMessage(e.target.value)}
                                placeholder="Describe your changes..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Editor Tabs */}
                    <div className="border-b border-gray-200 px-6">
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setShowPreview(false)}
                                className={`px-4 py-2 font-medium border-b-2 transition-colors ${!showPreview
                                        ? 'border-gray-800 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Write
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowPreview(true)}
                                className={`px-4 py-2 font-medium border-b-2 transition-colors ${showPreview
                                        ? 'border-gray-800 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Preview
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-hidden">
                        {!showPreview ? (
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your markdown content here..."
                                className="w-full h-full p-6 font-mono text-sm resize-none focus:outline-none"
                                required
                            />
                        ) : (
                            <div className="h-full overflow-y-auto p-6 prose prose-lg max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {content}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 p-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Save className="h-4 w-4" />
                            {isSaving ? 'Saving...' : 'Save to GitHub'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
