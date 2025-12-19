import { FileText, Target, Rocket, CheckSquare } from 'lucide-react';
import type { Category, CategoryConfig } from '@/types';

export const CATEGORIES: CategoryConfig[] = [
    { id: 'documentation' as Category, label: 'Documentation', icon: FileText, color: 'bg-gray-700' },
    { id: 'current-plan' as Category, label: 'Current Plan', icon: Target, color: 'bg-gray-600' },
    { id: 'future-plans' as Category, label: 'Future Plans', icon: Rocket, color: 'bg-gray-500' },
    { id: 'tasks' as Category, label: 'Tasks', icon: CheckSquare, color: 'bg-gray-800' },
];
