import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { NewsItem } from '../../types';

interface NewsTableProps {
    newsList: NewsItem[];
    isLoading: boolean;
    onEdit: (item: NewsItem) => void;
    onDelete: (id: string) => void;
    onCreate: () => void;
}

const NewsTable: React.FC<NewsTableProps> = ({ newsList, isLoading, onEdit, onDelete, onCreate }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All News (Originals)</h2>
                <button onClick={onCreate} className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-700">
                    <Plus size={18} /> Create New
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 font-semibold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {newsList.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900 dark:text-white truncate max-w-xs">{item.title}</p>
                                        <span className="text-xs text-gray-400">ID: {item.id.substring(0, 8)}...</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-bold text-gray-600 dark:text-gray-300">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(item.publishedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1">
                                            {item.isBreaking && <span className="w-2 h-2 rounded-full bg-red-500" title="Breaking"></span>}
                                            {item.isFeatured && <span className="w-2 h-2 rounded-full bg-amber-500" title="Featured"></span>}
                                            {item.isAiGenerated && <span className="w-2 h-2 rounded-full bg-purple-500" title="AI"></span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => onEdit(item)} className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => onDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {newsList.length === 0 && !isLoading && (
                        <div className="p-8 text-center text-gray-500">No articles found in database.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsTable;
