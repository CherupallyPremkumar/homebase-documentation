import React, { useState } from 'react';
import { X, Key, ExternalLink } from 'lucide-react';
import { githubService } from '../services/github';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAuthenticated: () => void;
}

export function AuthModal({ isOpen, onClose, onAuthenticated }: AuthModalProps) {
    const [token, setToken] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsValidating(true);

        try {
            githubService.setToken(token);
            const isValid = await githubService.validateToken();

            if (isValid) {
                onAuthenticated();
                onClose();
            } else {
                setError('Invalid token. Please check and try again.');
                githubService.clearToken();
            }
        } catch (err) {
            setError('Failed to validate token. Please try again.');
            githubService.clearToken();
        } finally {
            setIsValidating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <Key className="h-5 w-5 text-gray-700" />
                        <h2 className="text-xl font-bold text-gray-900">GitHub Authentication</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Personal Access Token
                        </label>
                        <input
                            type="password"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            required
                        />
                        <p className="mt-2 text-sm text-gray-500">
                            Token needs <code className="px-1 py-0.5 bg-gray-100 rounded">repo</code> scope
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900 font-medium mb-2">How to get a token:</p>
                        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                            <li>Go to GitHub Settings → Developer settings</li>
                            <li>Click "Personal access tokens" → "Tokens (classic)"</li>
                            <li>Generate new token with <code className="px-1 bg-blue-100 rounded">repo</code> scope</li>
                            <li>Copy and paste the token here</li>
                        </ol>
                        <a
                            href="https://github.com/settings/tokens/new?scopes=repo&description=Homebase%20Documentation"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Create token on GitHub
                            <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isValidating || !token}
                            className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isValidating ? 'Validating...' : 'Authenticate'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
