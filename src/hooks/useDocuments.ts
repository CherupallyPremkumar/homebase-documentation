import { useMemo } from 'react';
import matter from 'gray-matter';
import type { DocItem, Category } from '@/types';

// Import all markdown files from src/docs
const docFiles = import.meta.glob('../docs/**/*.md', { query: '?raw', import: 'default', eager: true });

export function useDocuments() {
    const docs = useMemo(() => {
        const parsedDocs: DocItem[] = [];

        Object.entries(docFiles).forEach(([path, content]) => {
            const { data, content: markdown } = matter(content as string);
            const category = data.category as Category;

            if (category) {
                parsedDocs.push({
                    id: path,
                    title: data.title || path.split('/').pop()?.replace('.md', '') || 'Untitled',
                    category,
                    content: markdown,
                    order: data.order,
                    priority: data.priority,
                });
            }
        });

        return parsedDocs.sort((a, b) => (a.order || 999) - (b.order || 999));
    }, []);

    return docs;
}
