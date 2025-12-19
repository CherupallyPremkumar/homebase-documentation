import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import type { DocItem, CategoryConfig } from '@/types';

interface DocumentViewerProps {
    document: DocItem | undefined;
    categoryConfig: CategoryConfig;
    onEdit: (doc: DocItem) => void;
    onDelete: (doc: DocItem) => void;
}

export function DocumentViewer({
    document,
    categoryConfig,
    onEdit,
    onDelete,
}: DocumentViewerProps) {
    if (!document) {
        return (
            <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            {React.createElement(categoryConfig.icon, { className: "h-8 w-8 text-gray-400" })}
                        </div>
                        <p className="text-lg text-gray-500 font-medium">No documents found</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Click "New" to create your first document
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-8 lg:p-12">
                    <div className="mb-8">
                        <div className="flex items-start justify-between mb-3">
                            <h1 className="text-4xl font-bold text-gray-900 flex-1">
                                {document.title}
                            </h1>
                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => onEdit(document)}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Edit document"
                                >
                                    <Edit2 className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => onDelete(document)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete document"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white",
                                categoryConfig.color
                            )}>
                                {React.createElement(categoryConfig.icon, { className: "h-3.5 w-3.5" })}
                                {categoryConfig.label}
                            </span>
                            {document.priority && (
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-xs font-medium",
                                    document.priority === 'high' && "bg-red-100 text-red-700",
                                    document.priority === 'medium' && "bg-yellow-100 text-yellow-700"
                                )}>
                                    {document.priority} priority
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="prose prose-lg max-w-none 
                        prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
                        prose-h1:text-4xl prose-h1:mb-4 prose-h1:mt-8
                        prose-h2:text-3xl prose-h2:mb-3 prose-h2:mt-6 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
                        prose-h3:text-2xl prose-h3:mb-2 prose-h3:mt-5
                        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-gray-900 prose-strong:font-semibold
                        prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
                        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:shadow-lg
                        prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4 prose-ul:space-y-2
                        prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4 prose-ol:space-y-2
                        prose-li:text-gray-700 prose-li:leading-relaxed
                        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                        prose-img:rounded-lg prose-img:shadow-md
                        prose-table:border-collapse prose-table:w-full
                        prose-th:bg-gray-100 prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-th:border prose-th:border-gray-300
                        prose-td:p-3 prose-td:border prose-td:border-gray-300
                        prose-hr:border-gray-300 prose-hr:my-8">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {document.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
}
