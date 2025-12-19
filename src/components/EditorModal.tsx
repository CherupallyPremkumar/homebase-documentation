import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Image } from 'lucide-react';
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
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB');
            return;
        }

        setIsUploadingImage(true);

        try {
            // Read file as base64
            const reader = new FileReader();
            reader.onload = async () => {
                const base64Content = (reader.result as string).split(',')[1];

                // Generate filename
                const timestamp = Date.now();
                const extension = file.name.split('.').pop();
                const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${timestamp}.${extension}`;
                const path = `public/images/${filename}`;

                try {
                    // Upload to GitHub
                    const { githubService } = await import('../services/github');
                    await githubService.createFile(
                        path,
                        base64Content,
                        `Add image ${filename}`,
                        true // isBase64
                    );

                    // Insert markdown at cursor position
                    const textarea = textareaRef.current;
                    if (textarea) {
                        const cursorPos = textarea.selectionStart;
                        const imageMarkdown = `\n![${file.name}](/images/${filename})\n`;
                        const newContent =
                            content.substring(0, cursorPos) +
                            imageMarkdown +
                            content.substring(cursorPos);
                        setContent(newContent);
                    }

                    alert('Image uploaded successfully!');
                } catch (error) {
                    console.error('Upload failed:', error);
                    alert('Failed to upload image. Please try again.');
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Failed to read file:', error);
            alert('Failed to read image file.');
        } finally {
            setIsUploadingImage(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

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
                        <div className="flex gap-4 items-center justify-between">
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
                            <div className="flex gap-2">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploadingImage || showPreview}
                                    className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    title="Upload image to GitHub"
                                >
                                    <Image className="h-4 w-4" />
                                    {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-hidden">
                        {!showPreview ? (
                            <textarea
                                ref={textareaRef}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your markdown content here...\n\nTip: Click 'Upload Image' to add images directly!"
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
