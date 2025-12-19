import { useState } from 'react';
import plantumlEncoder from 'plantuml-encoder';

interface PlantUMLDiagramProps {
    code: string;
    className?: string;
}

export function PlantUMLDiagram({ code, className = '' }: PlantUMLDiagramProps) {
    const [error, setError] = useState<string | null>(null);

    try {
        // Encode the PlantUML code
        const encoded = plantumlEncoder.encode(code);

        // Use the official PlantUML server
        const imageUrl = `https://www.plantuml.com/plantuml/svg/${encoded}`;

        return (
            <div className={`my-6 ${className}`}>
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <img
                        src={imageUrl}
                        alt="PlantUML Diagram"
                        className="max-w-full h-auto mx-auto"
                        onError={() => setError('Failed to load diagram')}
                    />
                    {error && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (err) {
        return (
            <div className="my-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 font-semibold">Error rendering PlantUML diagram</p>
                    <pre className="mt-2 text-sm text-red-600 overflow-x-auto">
                        {err instanceof Error ? err.message : 'Unknown error'}
                    </pre>
                </div>
            </div>
        );
    }
}
