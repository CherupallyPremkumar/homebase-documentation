import { Users, Edit, MessageSquare, Upload } from 'lucide-react';

interface CollaborativeBannerProps {
    onAuthClick: () => void;
    isAuthenticated: boolean;
}

export function CollaborativeBanner({ onAuthClick, isAuthenticated }: CollaborativeBannerProps) {
    if (isAuthenticated) return null;

    return (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-4 mb-6 w-full">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                        🌟 Open Collaborative Documentation
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">
                        This is a <strong>community-driven documentation platform</strong>. Anyone can contribute by authenticating with their GitHub account!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                            <Edit className="h-3.5 w-3.5 text-green-600" />
                            <span>Edit & improve documents</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                            <MessageSquare className="h-3.5 w-3.5 text-green-600" />
                            <span>Add comments & discussions</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                            <Upload className="h-3.5 w-3.5 text-green-600" />
                            <span>Upload images & diagrams</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                            <Users className="h-3.5 w-3.5 text-green-600" />
                            <span>Create new documentation</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onAuthClick}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors shadow-sm text-sm"
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
