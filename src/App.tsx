import { useState, useMemo } from 'react';
import { FileText, Target, Rocket, CheckSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import matter from 'gray-matter';
import { cn } from '@/lib/utils';

type Category = 'documentation' | 'current-plan' | 'future-plans' | 'tasks';

interface DocItem {
  id: string;
  title: string;
  category: Category;
  content: string;
  order?: number;
  priority?: string;
}

// Import all markdown files
const docFiles = import.meta.glob('../docs/**/*.md', { as: 'raw', eager: true });

const CATEGORIES = [
  { id: 'documentation' as Category, label: 'Documentation', icon: FileText, color: 'blue' },
  { id: 'current-plan' as Category, label: 'Current Plan', icon: Target, color: 'green' },
  { id: 'future-plans' as Category, label: 'Future Plans', icon: Rocket, color: 'purple' },
  { id: 'tasks' as Category, label: 'Tasks', icon: CheckSquare, color: 'orange' },
];

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('documentation');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  // Parse all markdown files
  const docs = useMemo(() => {
    const parsedDocs: DocItem[] = [];

    Object.entries(docFiles).forEach(([path, content]) => {
      const { data, content: markdown } = matter(content);
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

    // Sort by order if available
    return parsedDocs.sort((a, b) => (a.order || 999) - (b.order || 999));
  }, []);

  const filteredDocs = docs.filter(doc => doc.category === activeCategory);
  const activeDoc = selectedDoc ? docs.find(d => d.id === selectedDoc) : filteredDocs[0];
  const activeConfig = CATEGORIES.find(c => c.id === activeCategory)!;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedDoc(null);
                }}
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

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Document List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {activeConfig.label}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredDocs.length} {filteredDocs.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDocs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                      selectedDoc === doc.id && "bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-600"
                    )}
                  >
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {doc.title}
                    </div>
                    {doc.priority && (
                      <span className={cn(
                        "inline-block mt-1 text-xs px-2 py-0.5 rounded",
                        doc.priority === 'high' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                        doc.priority === 'medium' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      )}>
                        {doc.priority}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Markdown Viewer */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {activeDoc ? (
                <div className="p-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    {activeDoc.title}
                  </h1>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {activeDoc.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-gray-400 dark:text-gray-500">
                  <p className="text-lg">No documents found</p>
                  <p className="text-sm mt-1">Add markdown files to /docs/{activeCategory}/</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
