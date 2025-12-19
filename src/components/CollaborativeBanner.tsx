import { Users, Edit, MessageSquare, Upload } from 'lucide-react';

interface CollaborativeBannerProps {
    onAuthClick: () => void;
    isAuthenticated: boolean;
}

export function CollaborativeBanner({ onAuthClick, isAuthenticated }: CollaborativeBannerProps) {
    if (isAuthenticated) return null;

    return (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 mb-6 w-full">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                        🌟 Open Collaborative Documentation
                    </h3>
                    <p className="text-gray-700 mb-4">
                        This is a <strong>community-driven documentation platform</strong>. Anyone can contribute by authenticating with their GitHub account!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Edit className="h-4 w-4 text-green-600" />
                            <span>Edit & improve documents</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <MessageSquare className="h-4 w-4 text-green-600" />
                            <span>Add comments & discussions</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Upload className="h-4 w-4 text-green-600" />
                            <span>Upload images & diagrams</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Users className="h-4 w-4 text-green-600" />
                            <span>Create new documentation</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onAuthClick}
                            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors shadow-sm"
                        >
                            Start Contributing
                        </button>
                        <p className="text-xs text-gray-600">
                            All changes are tracked with your GitHub identity
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
