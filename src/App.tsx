import { useState, useEffect } from 'react';
import matter from 'gray-matter';
import { githubService } from './services/github';
import { AuthModal } from './components/AuthModal';
import { EditorModal } from './components/EditorModal';
import { Header } from './components/Header';
import { CategoryTabs } from './components/CategoryTabs';
import { Sidebar } from './components/Sidebar';
import { DocumentViewer } from './components/DocumentViewer';
import { SearchModal } from './components/SearchModal';
import { VersionHistoryModal } from './components/VersionHistoryModal';
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
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versionHistoryDoc, setVersionHistoryDoc] = useState<DocItem | null>(null);

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

  const handleSelectDocument = (docId: string) => {
    const doc = docs.find(d => d.id === docId);
    if (doc) {
      setActiveCategory(doc.category);
      setSelectedDoc(docId);
    }
  };

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleViewHistory = (doc: DocItem) => {
    setVersionHistoryDoc(doc);
    setShowVersionHistory(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isAuthenticated={isAuthenticated}
        onAuthClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onSearchClick={() => setShowSearchModal(true)}
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
            onViewHistory={handleViewHistory}
            isAuthenticated={isAuthenticated}
            onAuthRequired={() => setShowAuthModal(true)}
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

      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        documents={docs}
        onSelectDocument={handleSelectDocument}
      />

      <VersionHistoryModal
        isOpen={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        documentPath={versionHistoryDoc?.id || ''}
        documentTitle={versionHistoryDoc?.title || ''}
      />
    </div>
  );
}

export default App;
