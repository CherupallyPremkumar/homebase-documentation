import React, { useState, useMemo } from 'react';
import { FileText, Target, Rocket, CheckSquare, Menu, X, Plus, Edit2, Trash2, Key, LogOut } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import matter from 'gray-matter';
import { cn } from '@/lib/utils';
import { githubService } from './services/github';
import { AuthModal } from './components/AuthModal';
import { EditorModal } from './components/EditorModal';

type Category = 'documentation' | 'current-plan' | 'future-plans' | 'tasks';

interface DocItem {
  id: string;
  title: string;
  category: Category;
  content: string;
  order?: number;
  priority?: string;
}

// Import all markdown files from /docs folder (copied from public/docs during build)
const docFiles = import.meta.glob('../public/docs/**/*.md', { query: '?raw', import: 'default', eager: true });

const CATEGORIES = [
  { id: 'documentation' as Category, label: 'Documentation', icon: FileText, color: 'bg-gray-700' },
  { id: 'current-plan' as Category, label: 'Current Plan', icon: Target, color: 'bg-gray-600' },
  { id: 'future-plans' as Category, label: 'Future Plans', icon: Rocket, color: 'bg-gray-500' },
  { id: 'tasks' as Category, label: 'Tasks', icon: CheckSquare, color: 'bg-gray-800' },
];

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('documentation');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(githubService.isAuthenticated());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocItem | null>(null);

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

    return parsedDocs.sort((a, b) => (a.order || 999) - (b.order || 999));
  }, []);

  const filteredDocs = docs.filter(doc => doc.category === activeCategory);
  const activeDoc = selectedDoc ? docs.find(d => d.id === selectedDoc) : filteredDocs[0];
  const activeConfig = CATEGORIES.find(c => c.id === activeCategory)!;

  const handleNewDocument = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setEditingDoc(null);
    setShowEditorModal(true);
  };

  const handleEditDocument = (doc: DocItem) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setEditingDoc(doc);
    setShowEditorModal(true);
  };

  const handleDeleteDocument = async (doc: DocItem) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!confirm(`Are you sure you want to delete "${doc.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      // Extract path from doc.id (remove /public/ prefix)
      const path = doc.id.replace('/public/', '');

      // Get file SHA
      const file = await githubService.getFile(path);
      if (!file || !file.sha) {
        alert('File not found');
        return;
      }

      await githubService.deleteFile(path, file.sha, `Delete ${doc.title}`);
      alert('Document deleted successfully!');
      // Navigate to category home (first document in the category)
      setSelectedDoc(null);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete document. Please try again.');
    }
  };

  const handleSaveDocument = async (content: string, commitMessage: string) => {
    try {
      const { data } = matter(content);
      const filename = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.md';
      const path = `public/docs/${activeCategory}/${filename}`;

      if (editingDoc) {
        // Update existing file
        const existingPath = editingDoc.id.replace('/public/', '');
        const file = await githubService.getFile(existingPath);
        if (!file || !file.sha) {
          alert('File not found');
          return;
        }
        await githubService.updateFile(existingPath, content, file.sha, commitMessage);
      } else {
        // Create new file
        await githubService.createFile(path, content, commitMessage);
      }

      alert('Document saved successfully!');
      // Close modal and navigate to category home
      setShowEditorModal(false);
      setEditingDoc(null);
      setSelectedDoc(null);
    } catch (error) {
      console.error('Save failed:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    githubService.clearToken();
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Homebase Documentation
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Solo Developer Hub
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-800 text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Key className="h-4 w-4" />
                  Authenticate
                </button>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3">
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
                    {docs.filter(d => d.category === cat.id).length}
                  </span>
                </button>
              );
            })}
            <button
              onClick={handleNewDocument}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap bg-green-600 text-white hover:bg-green-700 ml-auto"
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm">New</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className={cn(
            "lg:col-span-1",
            !sidebarOpen && "hidden lg:block"
          )}>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-8">
              <div className={cn(
                "p-4 border-b border-gray-200",
                activeConfig.color
              )}>
                <h2 className="font-semibold text-white flex items-center gap-2">
                  {React.createElement(activeConfig.icon, { className: "h-5 w-5" })}
                  {activeConfig.label}
                </h2>
                <p className="text-sm text-white/80 mt-1">
                  {filteredDocs.length} {filteredDocs.length === 1 ? 'document' : 'documents'}
                </p>
              </div>
              <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
                {filteredDocs.map((doc, idx) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 hover:bg-gray-50 transition-all",
                      selectedDoc === doc.id && `bg-gray-100 border-l-4`,
                      idx !== filteredDocs.length - 1 && "border-b border-gray-100"
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

          {/* Document Viewer */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {activeDoc ? (
                <div className="p-8 lg:p-12">
                  <div className="mb-8">
                    <div className="flex items-start justify-between mb-3">
                      <h1 className="text-4xl font-bold text-gray-900 flex-1">
                        {activeDoc.title}
                      </h1>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditDocument(activeDoc)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit document"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(activeDoc)}
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
                        activeConfig.color
                      )}>
                        {React.createElement(activeConfig.icon, { className: "h-3.5 w-3.5" })}
                        {activeConfig.label}
                      </span>
                      {activeDoc.priority && (
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          activeDoc.priority === 'high' && "bg-red-100 text-red-700",
                          activeDoc.priority === 'medium' && "bg-yellow-100 text-yellow-700"
                        )}>
                          {activeDoc.priority} priority
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-gray-700 prose-code:text-gray-700 prose-pre:bg-gray-900">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {activeDoc.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    {React.createElement(activeConfig.icon, { className: "h-8 w-8 text-gray-400" })}
                  </div>
                  <p className="text-lg text-gray-500 font-medium">No documents found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Click "New" to create your first document
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthenticated={() => setIsAuthenticated(true)}
      />
      <EditorModal
        isOpen={showEditorModal}
        onClose={() => {
          setShowEditorModal(false);
          setEditingDoc(null);
        }}
        onSave={handleSaveDocument}
        initialContent={editingDoc ? matter.stringify(editingDoc.content, {
          title: editingDoc.title,
          category: editingDoc.category,
          order: editingDoc.order,
          priority: editingDoc.priority,
        }) : ''}
        category={activeCategory}
        title={editingDoc?.title || 'New Document'}
      />
    </div>
  );
}

export default App;
