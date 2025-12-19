import React from 'react';
import { Edit2, Trash2, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { PlantUMLDiagram } from './PlantUMLDiagram';
import { CommentsSection } from './CommentsSection';
import type { DocItem, CategoryConfig } from '@/types';

interface DocumentViewerProps {
    document: DocItem | undefined;
    categoryConfig: CategoryConfig;
    onEdit: (doc: DocItem) => void;
    onDelete: (doc: DocItem) => void;
    onViewHistory: (doc: DocItem) => void;
    isAuthenticated: boolean;
    onAuthRequired: () => void;
}

export function DocumentViewer({
    document,
    categoryConfig,
    onEdit,
    onDelete,
    onViewHistory,
    isAuthenticated,
    onAuthRequired,
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
                                    onClick={() => onViewHistory(document)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="View version history"
                                >
                                    <Clock className="h-5 w-5" />
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
                        prose-headings:font-bold prose-headings:text-gray-900
                        prose-h1:text-4xl prose-h1:mb-4 prose-h1:mt-0 prose-h1:pb-3 prose-h1:border-b-4 prose-h1:border-green-600
                        prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-gray-800 prose-h2:border-l-4 prose-h2:border-green-600 prose-h2:pl-4 prose-h2:bg-green-50 prose-h2:py-2 prose-h2:rounded-r
                        prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-gray-800 prose-h3:border-l-4 prose-h3:border-green-500 prose-h3:pl-3
                        prose-h4:text-xl prose-h4:mb-2 prose-h4:mt-5 prose-h4:text-gray-700 prose-h4:font-semibold
                        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-p:text-base
                        prose-a:text-green-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline hover:prose-a:text-green-700
                        prose-strong:text-gray-900 prose-strong:font-bold prose-strong:bg-yellow-100 prose-strong:px-1
                        prose-em:text-gray-800 prose-em:not-italic prose-em:font-semibold
                        prose-code:text-red-600 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:border prose-code:border-gray-300 prose-code:before:content-[''] prose-code:after:content-['']
                        prose-pre:bg-gray-50 prose-pre:text-gray-900 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-6 prose-pre:border-2 prose-pre:border-gray-300 prose-pre:shadow-sm
                        prose-ul:my-4 prose-ul:space-y-2 prose-ul:list-disc prose-ul:pl-6
                        prose-ol:my-4 prose-ol:space-y-2 prose-ol:list-decimal prose-ol:pl-6
                        prose-li:text-gray-700 prose-li:leading-relaxed prose-li:text-base prose-li:marker:text-green-600
                        prose-li>p:my-1
                        prose-blockquote:border-l-4 prose-blockquote:border-yellow-500 prose-blockquote:bg-yellow-50 prose-blockquote:pl-4 prose-blockquote:pr-4 prose-blockquote:py-3 prose-blockquote:my-6 prose-blockquote:not-italic prose-blockquote:text-gray-700 prose-blockquote:rounded-r
                        prose-img:rounded-lg prose-img:shadow-md prose-img:my-6 prose-img:border prose-img:border-gray-200
                        prose-table:border-collapse prose-table:w-full prose-table:my-6 prose-table:border prose-table:border-gray-300
                        prose-thead:bg-green-600
                        prose-th:bg-green-600 prose-th:text-white prose-th:p-3 prose-th:text-left prose-th:font-bold prose-th:text-sm prose-th:border prose-th:border-green-700
                        prose-td:p-3 prose-td:border prose-td:border-gray-300 prose-td:text-gray-700 prose-td:text-sm
                        prose-tr:even:bg-gray-50
                        prose-hr:border-gray-300 prose-hr:my-8">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code(props) {
                                    const { node, inline, className, children, ...rest } = props as any;
                                    const match = /language-(\w+)/.exec(className || '');
                                    const language = match ? match[1] : '';
                                    const codeContent = String(children).replace(/\n$/, '');

                                    // Check if it's a PlantUML diagram
                                    if (!inline && (language === 'plantuml' || language === 'uml')) {
                                        return <PlantUMLDiagram code={codeContent} />;
                                    }

                                    // Regular code block
                                    if (!inline) {
                                        return (
                                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto shadow-lg">
                                                <code className={className} {...rest}>
                                                    {children}
                                                </code>
                                            </pre>
                                        );
                                    }

                                    // Inline code
                                    return (
                                        <code className={className} {...rest}>
                                            {children}
                                        </code>
                                    );
                                }
                            }}
                        >
                            {document.content}
                        </ReactMarkdown>
                    </div>

                    {/* Comments Section */}
                    <CommentsSection
                        documentTitle={document.title}
                        documentPath={document.id}
                        isAuthenticated={isAuthenticated}
                        onAuthRequired={onAuthRequired}
                    />
                </div>
            </div>
        </div>
    );
}
