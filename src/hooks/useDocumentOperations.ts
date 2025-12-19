import matter from 'gray-matter';
import { githubService } from '@/services/github';
import type { DocItem, Category } from '@/types';

export function useDocumentOperations(
    isAuthenticated: boolean,
    activeCategory: Category,
    onAuthRequired: () => void
) {
    const handleNewDocument = (
        setEditingDoc: (doc: DocItem | null) => void,
        setShowEditorModal: (show: boolean) => void
    ) => {
        if (!isAuthenticated) {
            onAuthRequired();
            return;
        }
        setEditingDoc(null);
        setShowEditorModal(true);
    };

    const handleEditDocument = (
        doc: DocItem,
        setEditingDoc: (doc: DocItem | null) => void,
        setShowEditorModal: (show: boolean) => void
    ) => {
        if (!isAuthenticated) {
            onAuthRequired();
            return;
        }
        setEditingDoc(doc);
        setShowEditorModal(true);
    };

    const handleDeleteDocument = async (doc: DocItem) => {
        if (!isAuthenticated) {
            onAuthRequired();
            return;
        }

        if (!confirm(`Are you sure you want to delete "${doc.title}"? This cannot be undone.`)) {
            return;
        }

        try {
            // Extract path from doc.id (convert src/docs to repo path)
            const path = doc.id.replace('./docs/', 'src/docs/');

            // Get file SHA
            const file = await githubService.getFile(path);
            if (!file || !file.sha) {
                alert('File not found');
                return;
            }

            await githubService.deleteFile(path, file.sha, `Delete ${doc.title}`);
            alert('Document deleted! The page will reload in 3 seconds to show the changes.');
            setTimeout(() => window.location.reload(), 3000);
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete document. Please try again.');
        }
    };

    const handleSaveDocument = async (
        content: string,
        commitMessage: string,
        editingDoc: DocItem | null
    ) => {
        try {
            const { data } = matter(content);
            const filename = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.md';
            const path = `src/docs/${activeCategory}/${filename}`;

            if (editingDoc) {
                // Update existing file
                const existingPath = editingDoc.id.replace('./docs/', 'src/docs/');
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

            alert('Document saved! The page will reload in 3 seconds to show the changes.');
            setTimeout(() => window.location.reload(), 3000);
        } catch (error) {
            console.error('Save failed:', error);
            throw error;
        }
    };

    return {
        handleNewDocument,
        handleEditDocument,
        handleDeleteDocument,
        handleSaveDocument,
    };
}
