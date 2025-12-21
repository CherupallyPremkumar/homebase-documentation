import { useState, useEffect } from 'react';
import { Check, X, Calendar, Save } from 'lucide-react';
import { githubService } from '@/services/github';

interface HabitData {
    [date: string]: {
        [habit: string]: 'completed' | 'missed' | null;
    };
}

export function HabitTracker() {
    const [currentMonth] = useState(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));
    const [habits] = useState([
        'Exercise',
        'Reading',
        'Meditation',
        'Water (8 cups)',
        'Healthy Eating',
        'Sleep 8hrs',
        'Journal'
    ]);

    const [habitData, setHabitData] = useState<HabitData>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const dataFilePath = `src/docs/habit-tracker/data/${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}.json`;

    // Load data from Git on mount
    useEffect(() => {
        loadDataFromGit();
    }, []);

    const loadDataFromGit = async () => {
        try {
            const file = await githubService.getFile(dataFilePath);
            if (file && file.content) {
                const decoded = atob(file.content);
                const data = JSON.parse(decoded);
                setHabitData(data);
            }
        } catch (error) {
            console.log('No existing data file, starting fresh');
            setHabitData({});
        } finally {
            setLoading(false);
        }
    };

    const saveDataToGit = async (newData: HabitData) => {
        setSaving(true);
        try {
            const content = JSON.stringify(newData, null, 2);
            const file = await githubService.getFile(dataFilePath);

            if (file && file.sha) {
                // Update existing file
                await githubService.updateFile(
                    dataFilePath,
                    content,
                    file.sha,
                    `Update habit tracker data for ${currentMonth}`
                );
            } else {
                // Create new file
                await githubService.createFile(
                    dataFilePath,
                    content,
                    `Create habit tracker data for ${currentMonth}`
                );
            }

            setLastSaved(new Date());
        } catch (error) {
            console.error('Failed to save habit data:', error);
            alert('Failed to save data. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const toggleHabit = async (day: number, habit: string) => {
        const key = `${day}`;
        const current = habitData[key]?.[habit];

        let newStatus: 'completed' | 'missed' | null;
        if (current === null || current === undefined) {
            newStatus = 'completed';
        } else if (current === 'completed') {
            newStatus = 'missed';
        } else {
            newStatus = null;
        }

        const newData = {
            ...habitData,
            [key]: {
                ...habitData[key],
                [habit]: newStatus
            }
        };

        setHabitData(newData);

        // Save to Git automatically
        await saveDataToGit(newData);
    };

    const getStatusIcon = (day: number, habit: string) => {
        const status = habitData[`${day}`]?.[habit];
        if (status === 'completed') {
            return <Check className="h-4 w-4 text-green-600" />;
        } else if (status === 'missed') {
            return <X className="h-4 w-4 text-red-600" />;
        }
        return null;
    };

    const getStatusColor = (day: number, habit: string) => {
        const status = habitData[`${day}`]?.[habit];
        if (status === 'completed') return 'bg-green-50 hover:bg-green-100';
        if (status === 'missed') return 'bg-red-50 hover:bg-red-100';
        return 'bg-white hover:bg-gray-50';
    };

    const calculateStats = (habit: string) => {
        let completed = 0;
        let missed = 0;

        days.forEach(day => {
            const status = habitData[`${day}`]?.[habit];
            if (status === 'completed') completed++;
            if (status === 'missed') missed++;
        });

        const total = completed + missed;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { completed, missed, rate };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-green-600" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Monthly Habit Tracker</h2>
                        <p className="text-sm text-gray-600">{currentMonth}</p>
                    </div>
                </div>

                {/* Save Status */}
                <div className="flex items-center gap-2 text-sm">
                    {loading ? (
                        <span className="text-gray-500">Loading...</span>
                    ) : saving ? (
                        <span className="flex items-center gap-1 text-blue-600">
                            <Save className="h-4 w-4 animate-pulse" />
                            Saving...
                        </span>
                    ) : lastSaved ? (
                        <span className="text-green-600">
                            ✓ Saved to Git
                        </span>
                    ) : null}
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Click cells to track:</strong> First click = ✓ Completed, Second click = ✗ Missed, Third click = Clear
                </p>
            </div>

            {/* Habit Tracker Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="sticky left-0 z-10 bg-gray-100 px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-r border-gray-200">
                                Day
                            </th>
                            {habits.map(habit => (
                                <th key={habit} className="px-3 py-3 text-center text-sm font-semibold text-gray-900 border-b border-gray-200 min-w-[100px]">
                                    {habit}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {days.map(day => (
                            <tr key={day} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="sticky left-0 z-10 bg-white px-4 py-2 text-sm font-medium text-gray-900 border-r border-gray-200">
                                    {day}
                                </td>
                                {habits.map(habit => (
                                    <td
                                        key={`${day}-${habit}`}
                                        className={`px-3 py-2 text-center cursor-pointer transition-colors border-r border-gray-100 ${getStatusColor(day, habit)}`}
                                        onClick={() => toggleHabit(day, habit)}
                                    >
                                        {getStatusIcon(day, habit)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Statistics */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Statistics</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Habit</th>
                                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-900">Completed</th>
                                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-900">Missed</th>
                                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-900">Success Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {habits.map(habit => {
                                const stats = calculateStats(habit);
                                return (
                                    <tr key={habit} className="border-b border-gray-100">
                                        <td className="px-4 py-2 text-sm text-gray-900">{habit}</td>
                                        <td className="px-4 py-2 text-center text-sm text-green-600 font-medium">{stats.completed}</td>
                                        <td className="px-4 py-2 text-center text-sm text-red-600 font-medium">{stats.missed}</td>
                                        <td className="px-4 py-2 text-center text-sm font-medium">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${stats.rate >= 80 ? 'bg-green-100 text-green-800' :
                                                stats.rate >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {stats.rate}%
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tips */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">💡 Tips for Success</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Track your habits daily for best results</li>
                    <li>• Aim for 80% consistency or higher</li>
                    <li>• Don't break the chain - consistency is key!</li>
                    <li>• Review your stats weekly to stay motivated</li>
                </ul>
            </div>
        </div>
    );
}
