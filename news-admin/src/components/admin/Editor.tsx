import React from 'react';
import { ArrowRight, Bot, Sparkles, Upload, Save } from 'lucide-react';
import { NewsItem, Category } from '../../types';

interface EditorProps {
    editItem: Partial<NewsItem>;
    setEditItem: React.Dispatch<React.SetStateAction<Partial<NewsItem>>>;
    editingId: string | null;
    aiPrompt: string;
    setAiPrompt: (val: string) => void;
    isGeneratingAi: boolean;
    handleAiGenerate: () => void;
    handleSave: () => void;
    isLoading: boolean;
    onCancel: () => void;
}

const Editor: React.FC<EditorProps> = ({
    editItem, setEditItem, editingId,
    aiPrompt, setAiPrompt, isGeneratingAi, handleAiGenerate,
    handleSave, isLoading, onCancel
}) => {
    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><ArrowRight className="rotate-180" /></button>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingId ? 'Edit Article' : 'Compose News'}
                </h2>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4 text-purple-700 dark:text-purple-300">
                    <Bot size={24} />
                    <h2 className="font-bold">AI Assistant</h2>
                </div>
                <div className="flex gap-2">
                    <textarea
                        className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder="Enter a topic (e.g., 'SpaceX Launch') to write from scratch, OR paste a rough draft to polish..."
                        rows={2}
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                    />
                    <button
                        onClick={handleAiGenerate}
                        disabled={isGeneratingAi}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        {isGeneratingAi ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Sparkles size={18} />}
                        Generate
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="label block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Headline</label>
                        <input type="text" className="input-field w-full p-2 border rounded-md text-lg font-bold" value={editItem.title} onChange={e => setEditItem({ ...editItem, title: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                        <label className="label block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Summary (Bullet Points)</label>
                        {editItem.summary?.map((point, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <span className="text-gray-400 mt-2">•</span>
                                <input type="text" className="input-field w-full p-2 border rounded-md text-sm" value={point} onChange={e => { const newSummary = [...(editItem.summary || [])]; newSummary[idx] = e.target.value; setEditItem({ ...editItem, summary: newSummary }); }} />
                            </div>
                        ))}
                        <button onClick={() => setEditItem({ ...editItem, summary: [...(editItem.summary || []), ''] })} className="text-sm text-brand-600 font-medium hover:underline mt-1">+ Add Bullet Point</button>
                    </div>
                    <div className="col-span-2">
                        <label className="label block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Content</label>
                        <textarea rows={10} className="input-field w-full p-2 border rounded-md font-serif" value={editItem.content} onChange={e => setEditItem({ ...editItem, content: e.target.value })} />
                    </div>
                    <div>
                        <label className="label block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <select className="input-field w-full p-2 border rounded-md" value={editItem.category} onChange={e => setEditItem({ ...editItem, category: e.target.value as Category })}>
                            {['India', 'Originals', 'World', 'Sports', 'Technology', 'Education', 'Environment', 'Business'].map(c => (<option key={c} value={c}>{c}</option>))}
                        </select>
                    </div>
                    <div>
                        <label className="label block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (Comma separated)</label>
                        <input type="text" className="input-field w-full p-2 border rounded-md" value={editItem.tags?.join(', ')} onChange={e => setEditItem({ ...editItem, tags: e.target.value.split(',').map(t => t.trim()) })} />
                    </div>
                    <div className="col-span-2">
                        <label className="label block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                        <div className="flex gap-2">
                            <input type="text" className="input-field w-full p-2 border rounded-md" placeholder="https://..." value={editItem.imageUrl} onChange={e => setEditItem({ ...editItem, imageUrl: e.target.value })} />
                            <button className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 hover:text-brand-600"><Upload size={20} /></button>
                        </div>
                        {editItem.imageUrl && <img src={editItem.imageUrl} alt="Preview" className="mt-4 h-40 rounded-lg object-cover border border-gray-200" />}
                    </div>
                    <div className="col-span-2 flex gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <label className="flex items-center gap-2 cursor-pointer select-none"><input type="checkbox" checked={editItem.isBreaking} onChange={e => setEditItem({ ...editItem, isBreaking: e.target.checked })} className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500" /><span className="font-medium text-red-600">Mark as Breaking</span></label>
                        <label className="flex items-center gap-2 cursor-pointer select-none"><input type="checkbox" checked={editItem.isFeatured} onChange={e => setEditItem({ ...editItem, isFeatured: e.target.checked })} className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500" /><span className="font-medium text-gray-700 dark:text-gray-300">Feature on Homepage</span></label>
                    </div>
                </div>
                <div className="flex justify-end gap-4 pt-6">
                    <button onClick={onCancel} className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                    <button onClick={handleSave} disabled={isLoading} className="px-8 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold shadow-lg shadow-brand-500/30 flex items-center gap-2">
                        {isLoading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <><Save size={18} /> {editingId ? 'Update News' : 'Publish News'}</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Editor;
