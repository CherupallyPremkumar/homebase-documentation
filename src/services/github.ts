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
        // Load token from localStorage (user enters via UI)
        this.token = localStorage.getItem('github_token');
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
        message: string = 'Create new document',
        isBase64: boolean = false
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
                        content: isBase64 ? content : btoa(unescape(encodeURIComponent(content))), // Encode to base64 if not already
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
     * Get commit history for a file
     */
    async getFileCommits(path: string): Promise<GitHubCommit[]> {
        if (!this.token) throw new Error('Not authenticated');

        try {
            const response = await fetch(
                `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/commits?path=${path}&sha=${BRANCH}`,
                { headers: this.getHeaders() }
            );

            if (!response.ok) {
                throw new Error(`Failed to get commits: ${response.statusText}`);
            }

            const commits = await response.json();
            return commits.map((commit: any) => ({
                sha: commit.sha,
                message: commit.commit.message,
                author: commit.commit.author.name,
                date: commit.commit.author.date,
                url: commit.html_url,
            }));
        } catch (error) {
            console.error('Error getting file commits:', error);
            throw error;
        }
    }

    /**
     * Get file content at a specific commit
     */
    async getFileAtCommit(path: string, sha: string): Promise<string> {
        if (!this.token) throw new Error('Not authenticated');

        try {
            const response = await fetch(
                `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${sha}`,
                { headers: this.getHeaders() }
            );

            if (!response.ok) {
                throw new Error(`Failed to get file at commit: ${response.statusText}`);
            }

            const data = await response.json();
            return atob(data.content); // Decode base64
        } catch (error) {
            console.error('Error getting file at commit:', error);
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

export interface GitHubCommit {
    sha: string;
    message: string;
    author: string;
    date: string;
    url: string;
}

// Export singleton instance
export const githubService = new GitHubService();
