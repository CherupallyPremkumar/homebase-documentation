import { useState, useEffect } from 'react';
import { MessageSquare, Send, ExternalLink, Loader2 } from 'lucide-react';
import { githubService, type GitHubIssue, type GitHubComment } from '@/services/github';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CommentsSectionProps {
    documentTitle: string;
    documentPath: string;
    isAuthenticated: boolean;
    onAuthRequired: () => void;
}

export function CommentsSection({
    documentTitle,
    documentPath,
    isAuthenticated,
    onAuthRequired,
}: CommentsSectionProps) {
    const [issue, setIssue] = useState<GitHubIssue | null>(null);
    const [comments, setComments] = useState<GitHubComment[]>([]);
    const [loading, setLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        if (showComments && isAuthenticated) {
            loadComments();
        }
    }, [showComments, documentTitle, isAuthenticated]);

    const loadComments = async () => {
        setLoading(true);
        try {
            // Try to find existing issue
            let documentIssue = await githubService.getDocumentIssue(documentTitle);

            if (!documentIssue) {
                // Create new issue if it doesn't exist
                documentIssue = await githubService.createDocumentIssue(documentTitle, documentPath);
            }

            setIssue(documentIssue);

            // Load comments
            const issueComments = await githubService.getIssueComments(documentIssue.number);
            setComments(issueComments);
        } catch (error) {
            console.error('Failed to load comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !issue) return;

        setSubmitting(true);
        try {
            await githubService.addComment(issue.number, newComment);
            setNewComment('');
            // Reload comments
            await loadComments();
        } catch (error) {
            console.error('Failed to submit comment:', error);
            alert('Failed to submit comment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(date);
    };

    return (
        <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
                    {issue && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-sm">
                            {issue.commentsCount}
                        </span>
                    )}
                </div>
                {!showComments && (
                    <button
                        onClick={() => {
                            if (!isAuthenticated) {
                                onAuthRequired();
                                return;
                            }
                            setShowComments(true);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                        Show Comments
                    </button>
                )}
            </div>

            {showComments && (
                <>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* Comment Form */}
                            <form onSubmit={handleSubmitComment} className="mb-8">
                                <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Write a comment... (Markdown supported)"
                                        className="w-full p-4 resize-none focus:outline-none min-h-[120px]"
                                        disabled={submitting}
                                    />
                                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
                                        <p className="text-xs text-gray-500">
                                            Markdown is supported. Comments are posted to GitHub Issues.
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={!newComment.trim() || submitting}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                        >
                                            {submitting ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Posting...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="h-4 w-4" />
                                                    Comment
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Comments List */}
                            {comments.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-6">
                                            <div className="flex items-start gap-4">
                                                <img
                                                    src={comment.authorAvatar}
                                                    alt={comment.author}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-semibold text-gray-900">
                                                            {comment.author}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {formatDate(comment.createdAt)}
                                                        </span>
                                                        {comment.createdAt !== comment.updatedAt && (
                                                            <span className="text-xs text-gray-400">(edited)</span>
                                                        )}
                                                    </div>
                                                    <div className="prose prose-sm max-w-none">
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                            {comment.body}
                                                        </ReactMarkdown>
                                                    </div>
                                                    <a
                                                        href={comment.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mt-2"
                                                    >
                                                        <ExternalLink className="h-3 w-3" />
                                                        View on GitHub
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* View on GitHub Link */}
                            {issue && (
                                <div className="mt-6 text-center">
                                    <a
                                        href={issue.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        View full discussion on GitHub
                                    </a>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
