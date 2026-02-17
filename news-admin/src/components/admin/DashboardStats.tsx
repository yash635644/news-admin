import React from 'react';
import { Layout, Bot, Sparkles } from 'lucide-react';

interface StatsProps {
    stats: {
        total: number;
        aiCount: number;
        breakingCount: number;
        featuredCount: number;
        originals: number;
        live: number;
        feeds: number;
        categories?: Record<string, number>;
    };
}

const DashboardStats: React.FC<StatsProps> = ({ stats }) => {
    // Calculate max value for bar scaling
    // @ts-ignore - Object.values inference issue
    const values = Object.values(stats.categories || { 'None': 0 }) as number[];
    const maxVal = Math.max(...values, 1);

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
                <div className="flex gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-500"></span> Live Feeds: {stats.feeds}</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> AI Articles: {stats.aiCount}</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Content</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{stats.total}</h3>
                            <div className="flex gap-2 mt-2 text-xs font-medium text-gray-400">
                                <span>Orig: {stats.originals}</span> • <span>Live: ~{stats.live}</span>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-brand-600">
                            <Layout size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">AI Generated</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{stats.aiCount}</h3>
                            <p className="text-xs text-gray-400 mt-2">100% Original Content</p>
                        </div>
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                            <Bot size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Breaking News</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{stats.breakingCount}</h3>
                            <p className="text-xs text-gray-400 mt-2">Includes Live Alerts</p>
                        </div>
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600">
                            <Sparkles size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Featured</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{stats.featuredCount}</h3>
                            <p className="text-xs text-gray-400 mt-2">Curated & Top RSS</p>
                        </div>
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600">
                            <Layout size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Visual Charts Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-6">Content Distribution by Category</h3>
                <div className="space-y-4">
                    {Object.entries(stats.categories || {}).map(([category, count]) => (
                        <div key={category} className="flex items-center gap-4">
                            <div className="w-24 text-sm font-medium text-gray-500 dark:text-gray-400 truncate text-right">{category}</div>
                            <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${((count as number) / maxVal) * 100}%` }}
                                ></div>
                            </div>
                            <div className="w-12 text-sm font-bold text-gray-900 dark:text-white text-right">{count as number}</div>
                        </div>
                    ))}
                    {Object.keys(stats.categories || {}).length === 0 && (
                        <p className="text-center text-gray-400 py-4">No content data available yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
