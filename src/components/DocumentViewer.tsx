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
                    <div className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-gray-700 prose-code:text-gray-700 prose-pre:bg-gray-900">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {document.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
}
