import { useState, useEffect } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const SEED_TASKS: Todo[] = [
  {
    id: 'seed-1',
    text: '📦 Migrate from Git URL to GitHub Packages for @homebase/shared (Phase 2)',
    completed: false,
    createdAt: Date.now() - 1000,
  },
  {
    id: 'seed-2',
    text: '🏗️ Evaluate Monorepo migration (Turborepo/Nx) when team grows (Phase 3)',
    completed: false,
    createdAt: Date.now() - 2000,
  },
  {
    id: 'seed-3',
    text: '📝 Document API contracts between frontend and backend',
    completed: false,
    createdAt: Date.now() - 3000,
  },
];

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('homebase-todos');
    if (saved) {
      return JSON.parse(saved);
    }
    return SEED_TASKS;
  });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    localStorage.setItem('homebase-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
            Homebase Todo
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Stay organized with your daily tasks
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <form onSubmit={addTodo} className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="What needs to be done?"
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
            {todos.length === 0 ? (
              <div className="p-12 text-center text-gray-400 dark:text-gray-500">
                <p className="text-lg">No tasks yet</p>
                <p className="text-sm mt-1">Add a new task to get started</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {todos.map((todo) => (
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
                          "text-gray-900 dark:text-gray-100 truncate transition-all duration-200",
                          todo.completed && "text-gray-400 dark:text-gray-500 line-through"
                        )}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all duration-200 focus:opacity-100"
                      aria-label="Delete todo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 flex justify-between items-center">
            <span>{todos.filter(t => !t.completed).length} items left</span>
            {todos.some(t => t.completed) && (
              <button
                onClick={() => setTodos(todos.filter(t => !t.completed))}
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
