/**
 * GitHub API Service
 * Handles all interactions with GitHub REST API for file operations
 */

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'CherupallyPremkumar';
const REPO_NAME = 'homebase-documentation';
const BRANCH = 'main';

export interface GitHubFile {
    path: string;
    content: string;
    sha?: string;
}

export class GitHubService {
    private token: string | null = null;

    constructor() {
        // Try to load token from environment variable first (build-time)
        const envToken = import.meta.env.VITE_GITHUB_TOKEN;
        if (envToken) {
            this.token = envToken;
        } else {
            // Fall back to localStorage (runtime)
            this.token = localStorage.getItem('github_token');
        }
    }

    /**
     * Set GitHub Personal Access Token
     */
    setToken(token: string): void {
        this.token = token;
        localStorage.setItem('github_token', token);
    }

    /**
     * Clear stored token
     */
    clearToken(): void {
        this.token = null;
        localStorage.removeItem('github_token');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.token;
    }

    /**
     * Get current token
     */
    getToken(): string | null {
        return this.token;
    }

    /**
     * Validate token by making a test API call
     */
    async validateToken(): Promise<boolean> {
        if (!this.token) return false;

        try {
            const response = await fetch(`${GITHUB_API_BASE}/user`, {
                headers: this.getHeaders(),
            });
            return response.ok;
        } catch (error) {
            console.error('Token validation failed:', error);
            return false;
        }
    }

    /**
     * Get file content from repository
     */
    async getFile(path: string): Promise<GitHubFile | null> {
        if (!this.token) throw new Error('Not authenticated');

        try {
            const response = await fetch(
                `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`,
                { headers: this.getHeaders() }
            );

            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`Failed to get file: ${response.statusText}`);
            }

            const data = await response.json();
            const content = atob(data.content); // Decode base64

            return {
                path: data.path,
                content,
                sha: data.sha,
            };
        } catch (error) {
            console.error('Error getting file:', error);
            throw error;
        }
    }

    /**
     * Create a new file in the repository
     */
    async createFile(
        path: string,
        content: string,
        message: string = 'Create new document'
    ): Promise<void> {
        if (!this.token) throw new Error('Not authenticated');

        try {
            const response = await fetch(
                `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
                {
                    method: 'PUT',
                    headers: this.getHeaders(),
                    body: JSON.stringify({
                        message,
                        content: btoa(unescape(encodeURIComponent(content))), // Encode to base64
                        branch: BRANCH,
                    }),
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create file');
            }
        } catch (error) {
            console.error('Error creating file:', error);
            throw error;
        }
    }

    /**
     * Update an existing file in the repository
     */
    async updateFile(
        path: string,
        content: string,
        sha: string,
        message: string = 'Update document'
    ): Promise<void> {
        if (!this.token) throw new Error('Not authenticated');

        try {
            const response = await fetch(
                `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
                {
                    method: 'PUT',
                    headers: this.getHeaders(),
                    body: JSON.stringify({
                        message,
                        content: btoa(unescape(encodeURIComponent(content))), // Encode to base64
                        sha,
                        branch: BRANCH,
                    }),
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update file');
            }
        } catch (error) {
            console.error('Error updating file:', error);
            throw error;
        }
    }

    /**
     * Delete a file from the repository
     */
    async deleteFile(
        path: string,
        sha: string,
        message: string = 'Delete document'
    ): Promise<void> {
        if (!this.token) throw new Error('Not authenticated');

        try {
            const response = await fetch(
                `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
                {
                    method: 'DELETE',
                    headers: this.getHeaders(),
                    body: JSON.stringify({
                        message,
                        sha,
                        branch: BRANCH,
                    }),
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete file');
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }

    /**
     * Get headers for GitHub API requests
     */
    private getHeaders(): HeadersInit {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
        };
    }
}

// Export singleton instance
export const githubService = new GitHubService();
