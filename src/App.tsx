import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, FileText, Target, Rocket, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

type Category = 'documentation' | 'current-plan' | 'future-plans' | 'tasks';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  category: Category;
}

const SEED_ITEMS: Todo[] = [
  // Documentation
  {
    id: 'doc-1',
    text: '📦 Package Management: Using Git URL dependencies (v1.0.0) for @homebase/shared',
    completed: false,
    createdAt: Date.now() - 1000,
    category: 'documentation',
  },
  {
    id: 'doc-2',
    text: '🏗️ Architecture: Modular Monolith with Chenile Framework (Java backend)',
    completed: false,
    createdAt: Date.now() - 2000,
    category: 'documentation',
  },
  {
    id: 'doc-3',
    text: '⚛️ Frontend Stack: React + TypeScript + Tailwind CSS',
    completed: false,
    createdAt: Date.now() - 3000,
    category: 'documentation',
  },

  // Current Plan
  {
    id: 'current-1',
    text: '🛠️ Building product management module with variants and pricing',
    completed: false,
    createdAt: Date.now() - 4000,
    category: 'current-plan',
  },
  {
    id: 'current-2',
    text: '🎨 Developing user-facing e-commerce UI (homebase-user-ui)',
    completed: false,
    createdAt: Date.now() - 5000,
    category: 'current-plan',
  },

  // Future Plans
  {
    id: 'future-1',
    text: '📦 Phase 2: Migrate to GitHub Packages for dependency management',
    completed: false,
    createdAt: Date.now() - 6000,
    category: 'future-plans',
  },
  {
    id: 'future-2',
    text: '🏗️ Phase 3: Evaluate Monorepo (Turborepo/Nx) when team grows',
    completed: false,
    createdAt: Date.now() - 7000,
    category: 'future-plans',
  },
  {
    id: 'future-3',
    text: '📝 Document API contracts between frontend and backend',
    completed: false,
    createdAt: Date.now() - 8000,
    category: 'future-plans',
  },

  // Tasks
  {
    id: 'task-1',
    text: 'Fix CI build for homebase-user-ui',
    completed: true,
    createdAt: Date.now() - 9000,
    category: 'tasks',
  },
];

const CATEGORIES = [
  { id: 'documentation' as Category, label: 'Documentation', icon: FileText, color: 'blue' },
  { id: 'current-plan' as Category, label: 'Current Plan', icon: Target, color: 'green' },
  { id: 'future-plans' as Category, label: 'Future Plans', icon: Rocket, color: 'purple' },
  { id: 'tasks' as Category, label: 'Tasks', icon: CheckSquare, color: 'orange' },
];

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('tasks');
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('homebase-items');
    if (saved) {
      return JSON.parse(saved);
    }
    return SEED_ITEMS;
  });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    localStorage.setItem('homebase-items', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
      category: activeCategory,
    };

    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => todo.category === activeCategory);
  const activeConfig = CATEGORIES.find(c => c.id === activeCategory)!;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Homebase Documentation
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Solo Developer Hub: Docs, Plans & Tasks
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap",
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <form onSubmit={addTodo} className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Add to ${activeConfig.label}...`}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-200 placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {filteredTodos.length === 0 ? (
              <div className="p-12 text-center text-gray-400 dark:text-gray-500">
                <p className="text-lg">No items yet</p>
                <p className="text-sm mt-1">Add your first {activeConfig.label.toLowerCase()} item</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredTodos.map((todo) => (
                  <li
                    key={todo.id}
                    className="group flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={cn(
                          "flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-all duration-200",
                          todo.completed
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "border-gray-300 dark:border-gray-500 hover:border-indigo-500 text-transparent"
                        )}
                      >
                        <Check className="h-3 w-3" />
                      </button>
                      <span
                        className={cn(
                          "text-gray-900 dark:text-gray-100 transition-all duration-200",
                          todo.completed && "text-gray-400 dark:text-gray-500 line-through"
                        )}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all duration-200 focus:opacity-100"
                      aria-label="Delete item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 flex justify-between items-center">
            <span>{filteredTodos.filter(t => !t.completed).length} items left</span>
            {filteredTodos.some(t => t.completed) && (
              <button
                onClick={() => setTodos(todos.filter(t => t.category !== activeCategory || !t.completed))}
                className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
              >
                Clear completed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
