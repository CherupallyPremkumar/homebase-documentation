import type { LucideProps } from 'lucide-react';
import type { FC } from 'react';

export type Category = 'documentation' | 'current-plan' | 'future-plans' | 'tasks' | 'habit-tracker';

export interface DocItem {
    id: string;
    title: string;
    category: Category;
    content: string;
    order?: number;
    priority?: string;
}

export interface CategoryConfig {
    id: Category;
    label: string;
    icon: FC<LucideProps>;
    color: string;
}
