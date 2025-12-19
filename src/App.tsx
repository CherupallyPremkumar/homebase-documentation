import { useState } from 'react';
import matter from 'gray-matter';
import { githubService } from './services/github';
import { AuthModal } from './components/AuthModal';
import { EditorModal } from './components/EditorModal';
import { Header } from './components/Header';
import { CategoryTabs } from './components/CategoryTabs';
import { Sidebar } from './components/Sidebar';
import { DocumentViewer } from './components/DocumentViewer';
import { useDocuments } from './hooks/useDocuments';
import { useDocumentOperations } from './hooks/useDocumentOperations';
import { CATEGORIES } from './constants/categories';
import type { Category, DocItem } from './types';

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('documentation');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(githubService.isAuthenticated());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocItem | null>(null);

  const docs = useDocuments();
  const documentOps = useDocumentOperations(
    isAuthenticated,
    activeCategory,
    () => setShowAuthModal(true)
  );

  const filteredDocs = docs.filter(doc => doc.category === activeCategory);
  const activeDoc = selectedDoc ? docs.find(d => d.id === selectedDoc) : filteredDocs[0];
  const activeConfig = CATEGORIES.find(c => c.id === activeCategory)!;

  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category);
    setSelectedDoc(null);
  };

  const handleLogout = () => {
    githubService.clearToken();
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isAuthenticated={isAuthenticated}
        onAuthClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      <CategoryTabs
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        documents={docs}
        onNewDocument={() => documentOps.handleNewDocument(setEditingDoc, setShowEditorModal)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Sidebar
            documents={filteredDocs}
            selectedDoc={selectedDoc}
            onSelectDoc={setSelectedDoc}
            isOpen={sidebarOpen}
            categoryConfig={activeConfig}
          />

          <DocumentViewer
            document={activeDoc}
            categoryConfig={activeConfig}
            onEdit={(doc) => documentOps.handleEditDocument(doc, setEditingDoc, setShowEditorModal)}
            onDelete={documentOps.handleDeleteDocument}
          />
        </div>
      </div>

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
        onSave={(content, commitMessage) =>
          documentOps.handleSaveDocument(content, commitMessage, editingDoc)
        }
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
