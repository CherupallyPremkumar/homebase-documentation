import { useState, useEffect } from 'react';
import { X, Clock, User, ExternalLink, Eye } from 'lucide-react';
import { githubService, type GitHubCommit } from '@/services/github';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface VersionHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    documentPath: string;
    documentTitle: string;
}

export function VersionHistoryModal({
    isOpen,
    onClose,
    documentPath,
    documentTitle,
}: VersionHistoryModalProps) {
    const [commits, setCommits] = useState<GitHubCommit[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCommit, setSelectedCommit] = useState<string | null>(null);
    const [versionContent, setVersionContent] = useState<string | null>(null);
    const [loadingContent, setLoadingContent] = useState(false);

    useEffect(() => {
        if (isOpen && documentPath) {
            loadCommits();
        } else {
            setCommits([]);
            setSelectedCommit(null);
            setVersionContent(null);
        }
    }, [isOpen, documentPath]);

    const loadCommits = async () => {
        setLoading(true);
        try {
            // Document path comes from import.meta.glob like: '../public/docs/documentation/file.md'
            // We need to convert it to: 'src/docs/documentation/file.md' for GitHub API
            let cleanPath = documentPath;

            // Remove '../public/docs/' and replace with 'src/docs/'
            if (cleanPath.includes('../public/docs/')) {
                cleanPath = cleanPath.replace('../public/docs/', 'src/docs/');
            } else if (cleanPath.includes('public/docs/')) {
                cleanPath = cleanPath.replace('public/docs/', 'src/docs/');
            }

            console.log('Loading commits for path:', cleanPath);
            const history = await githubService.getFileCommits(cleanPath);
            setCommits(history);
        } catch (error) {
            console.error('Failed to load version history:', error);
            alert('Failed to load version history. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewVersion = async (commit: GitHubCommit) => {
        setSelectedCommit(commit.sha);
        setLoadingContent(true);
        try {
            let cleanPath = documentPath;

            if (cleanPath.includes('../public/docs/')) {
                cleanPath = cleanPath.replace('../public/docs/', 'src/docs/');
            } else if (cleanPath.includes('public/docs/')) {
                cleanPath = cleanPath.replace('public/docs/', 'src/docs/');
            }

            const content = await githubService.getFileAtCommit(cleanPath, commit.sha);
            setVersionContent(content);
        } catch (error) {
            console.error('Failed to load version content:', error);
            alert('Failed to load version content. Please try again.');
        } finally {
            setLoadingContent(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        return formatDate(dateString);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Version History</h2>
                        <p className="text-sm text-gray-500 mt-1">{documentTitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex">
                    {/* Commits List */}
                    <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">
                                <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300 animate-spin" />
                                <p className="text-sm">Loading version history...</p>
                            </div>
                        ) : commits.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                <p className="text-sm">No version history found</p>
                            </div>
                        ) : (
                            <div className="py-2">
                                {commits.map((commit, index) => (
                                    <div
                                        key={commit.sha}
                                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${selectedCommit === commit.sha ? 'bg-green-50 border-l-4 border-l-green-600' : ''
                                            }`}
                                        onClick={() => handleViewVersion(commit)}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {commit.message.split('\n')[0]}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <User className="h-3 w-3 text-gray-400" />
                                                    <span className="text-xs text-gray-600">{commit.author}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Clock className="h-3 w-3 text-gray-400" />
                                                    <span className="text-xs text-gray-500">
                                                        {getRelativeTime(commit.date)}
                                                    </span>
                                                </div>
                                            </div>
                                            {index === 0 && (
                                                <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                                                    Latest
                                                </span>
                                            )}
                                        </div>
                                        <a
                                            href={commit.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mt-2"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            View on GitHub
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Version Content */}
                    <div className="flex-1 overflow-y-auto bg-gray-50">
                        {!selectedCommit ? (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <div className="text-center">
                                    <Eye className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                    <p className="text-sm">Select a version to view its content</p>
                                </div>
                            </div>
                        ) : loadingContent ? (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <div className="text-center">
                                    <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300 animate-spin" />
                                    <p className="text-sm">Loading version content...</p>
                                </div>
                            </div>
                        ) : versionContent ? (
                            <div className="p-8">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="prose prose-lg max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {versionContent}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
                    <p>
                        {commits.length} version{commits.length !== 1 ? 's' : ''} found
                        {selectedCommit && ' • Click a version to view its content'}
                    </p>
                </div>
            </div>
        </div>
    );
}
