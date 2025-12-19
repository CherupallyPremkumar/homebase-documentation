import { Menu, X, Key, LogOut } from 'lucide-react';

interface HeaderProps {
    isAuthenticated: boolean;
    onAuthClick: () => void;
    onLogout: () => void;
    onToggleSidebar: () => void;
    sidebarOpen: boolean;
}

export function Header({
    isAuthenticated,
    onAuthClick,
    onLogout,
    onToggleSidebar,
    sidebarOpen,
}: HeaderProps) {
    return (
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
                                onClick={onLogout}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={onAuthClick}
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-800 text-white hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <Key className="h-4 w-4" />
                                Authenticate
                            </button>
                        )}
                        <button
                            onClick={onToggleSidebar}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
