import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Rss, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

interface RSSFeed {
    id: string;
    name: string;
    url: string;
    category: string;
}

interface RSSManagerProps {
    rssFeeds: RSSFeed[];
    newFeed: { name: string; url: string; category: string };
    setNewFeed: (feed: { name: string; url: string; category: string }) => void;
    isAddingFeed: boolean;
    handleAddFeed: () => void;
    handleDeleteFeed: (id: string) => void;
}

const RSSManager: React.FC<RSSManagerProps> = ({
    rssFeeds, newFeed, setNewFeed, isAddingFeed, handleAddFeed, handleDeleteFeed
}) => {
    const [healthStatus, setHealthStatus] = useState<Record<string, 'ok' | 'error'>>({});
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        checkHealth();
    }, [rssFeeds.length]); // Re-check when feeds change

    const checkHealth = async () => {
        setIsChecking(true);
        try {
            const status = await api.checkRSSHealth();
            setHealthStatus(status);
        } catch (e) {
            console.error("Health check failed", e);
        }
        setIsChecking(false);
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <header className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">RSS Feed Manager</h2>
                    <p className="text-gray-500">Add or remove external RSS sources for the live feed.</p>
                </div>
                <button
                    onClick={checkHealth}
                    disabled={isChecking}
                    className="text-sm flex items-center gap-1 text-brand-600 hover:text-brand-700 disabled:opacity-50"
                >
                    {isChecking ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    {isChecking ? 'Checking Health...' : 'Re-check Health'}
                </button>
            </header>

            {/* Add New Feed */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Plus size={20} className="text-brand-600" /> Add New Source
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Source Name (e.g. TechCrunch)"
                        className="md:col-span-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
                        value={newFeed.name}
                        onChange={e => setNewFeed({ ...newFeed, name: e.target.value })}
                    />
                    <input
                        type="url"
                        placeholder="RSS Feed URL"
                        className="md:col-span-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
                        value={newFeed.url}
                        onChange={e => setNewFeed({ ...newFeed, url: e.target.value })}
                    />
                    <select
                        className="md:col-span-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
                        value={newFeed.category}
                        onChange={e => setNewFeed({ ...newFeed, category: e.target.value })}
                    >
                        {['India', 'World', 'Technology', 'Sports', 'Business', 'Environment', 'Education'].map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={handleAddFeed}
                    disabled={isAddingFeed}
                    className="mt-4 w-full md:w-auto px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    {isAddingFeed ? 'Adding...' : 'Add Source'}
                </button>
            </div>

            {/* List Feeds */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 font-semibold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Source Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">RSS URL</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {rssFeeds.map((feed) => (
                            <tr key={feed.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Rss size={16} className="text-orange-500" /> {feed.name}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-bold text-gray-600 dark:text-gray-300">
                                        {feed.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs" title={feed.url}>
                                    {feed.url}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {healthStatus[feed.id] === 'ok' ? (
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600" title="Operational">
                                            <CheckCircle size={14} />
                                        </span>
                                    ) : healthStatus[feed.id] === 'error' ? (
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600" title="Unreachable">
                                            <XCircle size={14} />
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400" title="Checking...">
                                            <Loader2 size={14} className="animate-spin" />
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDeleteFeed(feed.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {rssFeeds.length === 0 && (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No custom feeds added. Using defaults.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RSSManager;
