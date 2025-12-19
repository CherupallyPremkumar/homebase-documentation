import React from 'react';
import { cn } from '@/lib/utils';
import type { DocItem, CategoryConfig } from '@/types';

interface SidebarProps {
    documents: DocItem[];
    selectedDoc: string | null;
    onSelectDoc: (docId: string) => void;
    isOpen: boolean;
    categoryConfig: CategoryConfig;
}

export function Sidebar({
    documents,
    selectedDoc,
    onSelectDoc,
    isOpen,
    categoryConfig,
}: SidebarProps) {
    return (
        <div className={cn(
            "lg:col-span-1",
            !isOpen && "hidden lg:block"
        )}>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-8">
                <div className={cn(
                    "p-4 border-b border-gray-200",
                    categoryConfig.color
                )}>
                    <h2 className="font-semibold text-white flex items-center gap-2">
                        {React.createElement(categoryConfig.icon, { className: "h-5 w-5" })}
                        {categoryConfig.label}
                    </h2>
                    <p className="text-sm text-white/80 mt-1">
                        {documents.length} {documents.length === 1 ? 'document' : 'documents'}
                    </p>
                </div>
                <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
                    {documents.map((doc, idx) => (
                        <button
                            key={doc.id}
                            onClick={() => onSelectDoc(doc.id)}
                            className={cn(
                                "w-full text-left px-4 py-3 hover:bg-gray-50 transition-all",
                                selectedDoc === doc.id && `bg-gray-100 border-l-4`,
                                idx !== documents.length - 1 && "border-b border-gray-100"
                            )}
                            style={selectedDoc === doc.id ? { borderLeftColor: '#374151' } : {}}
                        >
                            <div className="font-medium text-gray-900 text-sm">
                                {doc.title}
                            </div>
                            {doc.priority && (
                                <span className={cn(
                                    "inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium",
                                    doc.priority === 'high' && "bg-red-100 text-red-700",
                                    doc.priority === 'medium' && "bg-yellow-100 text-yellow-700",
                                    doc.priority === 'low' && "bg-green-100 text-green-700"
                                )}>
                                    {doc.priority} priority
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
