import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { PlantUMLDiagram } from './PlantUMLDiagram';
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
                    <div className="prose prose-xl max-w-none 
                        prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
                        prose-h1:text-5xl prose-h1:mb-6 prose-h1:mt-0 prose-h1:leading-tight
                        prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:pb-3 prose-h2:border-b-2 prose-h2:border-gray-300
                        prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-gray-800
                        prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6 prose-h4:text-gray-700
                        prose-p:text-gray-700 prose-p:leading-loose prose-p:mb-6 prose-p:text-lg
                        prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline hover:prose-a:text-blue-700
                        prose-strong:text-gray-900 prose-strong:font-bold
                        prose-em:text-gray-800 prose-em:italic
                        prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:text-base prose-code:font-mono prose-code:font-medium prose-code:before:content-[''] prose-code:after:content-['']
                        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:shadow-xl prose-pre:my-8 prose-pre:border prose-pre:border-gray-700
                        prose-ul:my-6 prose-ul:space-y-3
                        prose-ol:my-6 prose-ol:space-y-3
                        prose-li:text-gray-700 prose-li:leading-loose prose-li:text-lg prose-li:pl-2
                        prose-li>p:my-2
                        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-4 prose-blockquote:my-8 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:rounded-r-lg
                        prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                        prose-table:border-collapse prose-table:w-full prose-table:my-8 prose-table:shadow-md prose-table:rounded-lg prose-table:overflow-hidden
                        prose-thead:bg-gray-800
                        prose-th:bg-gray-800 prose-th:text-white prose-th:p-4 prose-th:text-left prose-th:font-bold prose-th:text-base prose-th:border-b-2 prose-th:border-gray-600
                        prose-td:p-4 prose-td:border-b prose-td:border-gray-200 prose-td:text-gray-700
                        prose-tr:hover:bg-gray-50
                        prose-hr:border-gray-300 prose-hr:my-12 prose-hr:border-t-2">
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
                </div>
            </div>
        </div>
    );
}
