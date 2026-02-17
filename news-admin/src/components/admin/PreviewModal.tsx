import React from 'react';
import { X, Calendar, Share2, Bookmark } from 'lucide-react';
import { NewsItem } from '../../types';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    news: Partial<NewsItem>;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, news }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-4xl h-[90vh] overflow-hidden shadow-2xl relative flex flex-col">

                {/* Modal Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 z-10">
                    <h3 className="font-bold text-gray-500 uppercase tracking-widest text-xs">Live Preview</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6 md:p-10">
                    {/* Simulation of Client Article View */}
                    <article className="max-w-3xl mx-auto">
                        <div className="flex gap-2 mb-6">
                            <span className="px-3 py-1 bg-brand-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                                {news.category || 'Category'}
                            </span>
                            {news.isBreaking && (
                                <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                                    Breaking
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-6">
                            {news.title || 'Your Headline Here'}
                        </h1>

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-gray-500 text-sm mb-8 border-b border-gray-100 dark:border-gray-800 pb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs text-gray-600">
                                    {(news.author || 'Admin').charAt(0)}
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">{news.author || 'Admin'}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                <span>{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Featured Image */}
                        {news.imageUrl && (
                            <div className="rounded-2xl overflow-hidden mb-10 shadow-lg aspect-video relative">
                                <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* AI Summary */}
                        {news.summary && news.summary.length > 0 && (
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border-l-4 border-brand-500 mb-10">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-3 uppercase text-sm tracking-wider">AI Summary</h4>
                                <ul className="space-y-2">
                                    {news.summary.map((point: string, i: number) => (
                                        <li key={i} className="flex gap-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                            <span className="text-brand-500 font-bold">•</span> {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Content */}
                        <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed text-lg">
                            {news.content ? (
                                news.content.split('\n').map((paragraph, idx) => (
                                    <p key={idx} className="mb-4">{paragraph}</p>
                                ))
                            ) : (
                                <p className="italic text-gray-400">Start writing to see your content here...</p>
                            )}
                        </div>

                        {/* Tags */}
                        {news.tags && news.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                                {news.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </article>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex justify-center text-sm text-gray-500">
                    To close, click the X or press ESC
                </div>
            </div>
        </div>
    );
};

export default PreviewModal;
