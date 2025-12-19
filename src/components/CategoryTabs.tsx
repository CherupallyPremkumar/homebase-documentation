import React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category, CategoryConfig, DocItem } from '@/types';

interface CategoryTabsProps {
    categories: CategoryConfig[];
    activeCategory: Category;
    onCategoryChange: (category: Category) => void;
    documents: DocItem[];
    onNewDocument: () => void;
}

export function CategoryTabs({
    categories,
    activeCategory,
    onCategoryChange,
    documents,
    onNewDocument,
}: CategoryTabsProps) {
    return (
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex gap-1 overflow-x-auto py-3">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeCategory === cat.id;
                        const count = documents.filter(d => d.category === cat.id).length;

                        return (
                            <button
                                key={cat.id}
                                onClick={() => onCategoryChange(cat.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap",
                                    isActive
                                        ? `${cat.color} text-white shadow-lg transform scale-105`
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span className="text-sm">{cat.label}</span>
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-semibold",
                                    isActive
                                        ? "bg-white/20 text-white"
                                        : "bg-gray-200 text-gray-600"
                                )}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                    <button
                        onClick={onNewDocument}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap bg-green-600 text-white hover:bg-green-700 ml-auto"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="text-sm">New</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
