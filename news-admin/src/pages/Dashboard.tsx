import React, { useState, useEffect } from 'react';
import { Shield, Plus, BarChart3, List, Rss, Menu, X, Check, Sun, Moon, LogOut } from 'lucide-react';

// Services & Types
import { api } from '../services/api';
import { NewsItem } from '../types';

// Sub-components
import DashboardStats from '../components/admin/DashboardStats';
import NewsTable from '../components/admin/NewsTable';
import Editor from '../components/admin/Editor';
import RSSManager from '../components/admin/RSSManager';
import SubscriberList from '../components/admin/SubscriberList';

interface DashboardProps {
    onLogout: () => void;
    isDark: boolean;
    toggleDark: () => void;
}

type Tab = 'overview' | 'news-list' | 'add-news' | 'sources' | 'subscribers';

const Dashboard: React.FC<DashboardProps> = ({ onLogout, isDark, toggleDark }) => {
    // ---/ UI State /---
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notification, setNotification] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

    // ---/ Data State /---
    const [newsList, setNewsList] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState({ total: 0, aiCount: 0, breakingCount: 0, featuredCount: 0, originals: 0, live: 0, feeds: 0 });
    const [rssFeeds, setRssFeeds] = useState<any[]>([]);
    const [subscribers, setSubscribers] = useState<any[]>([]);

    // RSS State
    const [newFeed, setNewFeed] = useState({ name: '', url: '', category: 'World' });
    const [isAddingFeed, setIsAddingFeed] = useState(false);

    // Editor State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editItem, setEditItem] = useState<Partial<NewsItem>>({
        title: '', summary: [], content: '', category: 'World', tags: [], imageUrl: '', isBreaking: false, isFeatured: false, isAiGenerated: false
    });
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);

    // ---/ Initial Fetch /---
    useEffect(() => {
        fetchNews();
        fetchRssFeeds();
        fetchSubscribers();
    }, []);

    const showNotification = (msg: string, type: 'success' | 'error') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // ---/ Fetchers /---
    const fetchNews = async () => {
        setIsLoading(true);
        try {
            const data = await api.getAllNews();
            if (data) {
                const mapped = data.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    summary: item.summary,
                    content: item.content,
                    category: item.category,
                    tags: item.tags || [],
                    imageUrl: item.image_url,
                    videoUrl: item.video_url,
                    source: item.source || 'Gathered Original',
                    url: item.source_url,
                    author: item.author,
                    publishedAt: item.published_at,
                    isBreaking: item.is_breaking,
                    isFeatured: item.is_featured,
                    isAiGenerated: item.is_ai_generated,
                }));
                setNewsList(mapped);
            }
            const realStats = await api.getStats();
            if (realStats) setStats(realStats);
        } catch (e) { console.error('Failed to fetch news', e); }
        setIsLoading(false);
    };

    const fetchRssFeeds = async () => {
        try {
            const feeds = await api.getRSSFeeds();
            setRssFeeds(feeds);
        } catch (e) { console.error('Failed to load RSS feeds'); }
    };

    const fetchSubscribers = async () => {
        try {
            const subs = await api.getSubscribers();
            setSubscribers(subs);
        } catch (e) { console.error('Failed to load subscribers'); }
    };

    // ---/ Operations /---
    const handleAddFeed = async () => {
        if (!newFeed.name || !newFeed.url) return showNotification('Name and URL required', 'error');
        setIsAddingFeed(true);
        try {
            await api.addRSSFeed(newFeed.name, newFeed.url, newFeed.category);
            showNotification('Feed added successfully', 'success');
            setNewFeed({ name: '', url: '', category: 'World' });
            fetchRssFeeds();
        } catch (e: any) { showNotification(e.message, 'error'); }
        setIsAddingFeed(false);
    };

    const handleDeleteFeed = async (id: string) => {
        if (!window.confirm('Delete this feed?')) return;
        try {
            await api.deleteRSSFeed(id);
            showNotification('Feed deleted', 'success');
            fetchRssFeeds();
        } catch (e: any) { showNotification(e.message, 'error'); }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete article?')) return;
        setIsLoading(true);
        try {
            await api.deleteNews(id);
            showNotification('Article deleted', 'success');
            fetchNews();
        } catch (e: any) { showNotification(e.message, 'error'); }
        setIsLoading(false);
    };

    const handleEdit = (item: NewsItem) => {
        setEditingId(item.id);
        setEditItem(item);
        setActiveTab('add-news');
    };

    const handleAiGenerate = async () => {
        if (!aiPrompt) return showNotification('Enter text or URL', 'error');
        setIsGeneratingAi(true);
        try {
            const generated = await api.generateContent(aiPrompt);
            setEditItem(prev => ({
                ...prev,
                title: generated.headline || generated.title,
                summary: generated.summary,
                category: generated.category,
                tags: generated.tags,
                isAiGenerated: true
            }));
            showNotification('AI Generated!', 'success');
        } catch (err) { showNotification('AI Generation failed', 'error'); }
        setIsGeneratingAi(false);
    };

    const handleSave = async () => {
        setIsLoading(true);
        if (!editItem.title || !editItem.content) {
            showNotification('Title and Content required', 'error');
            setIsLoading(false);
            return;
        }

        const payload = {
            title: editItem.title,
            summary: editItem.summary,
            content: editItem.content,
            category: editItem.category,
            tags: editItem.tags,
            image_url: editItem.imageUrl || `https://picsum.photos/seed/${Math.random()}/800/600`,
            is_breaking: editItem.isBreaking,
            is_featured: editItem.isFeatured,
            is_ai_generated: editItem.isAiGenerated,
            author: 'Admin'
        };

        try {
            if (editingId) {
                await api.updateNews(editingId, payload);
                showNotification('Updated successfully', 'success');
            } else {
                await api.publishNews(payload);
                showNotification('Published successfully', 'success');
            }
            setEditingId(null);
            setEditItem({ category: 'World', tags: [], summary: [], isBreaking: false, isFeatured: false, isAiGenerated: false, title: '', content: '' });
            setActiveTab('news-list');
            fetchNews();
        } catch (error: any) { showNotification(error.message, 'error'); }
        setIsLoading(false);
    };

    // ---/ Render /---
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h1 className="text-xl font-black font-serif text-gray-900 dark:text-white">
                        GATH<span className="text-brand-600">ERED</span> <span className="text-xs font-sans font-medium text-gray-400 block mt-1">Admin Console</span>
                    </h1>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400"><X size={24} /></button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {[
                        { id: 'overview', icon: <BarChart3 size={20} />, label: 'Overview' },
                        { id: 'news-list', icon: <List size={20} />, label: 'Manage News' },
                        { id: 'add-news', icon: <Plus size={20} />, label: 'Add News' },
                        { id: 'sources', icon: <Rss size={20} />, label: 'RSS Manager' },
                        { id: 'subscribers', icon: <Shield size={20} />, label: 'Subscribers' },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id as Tab);
                                setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
                    <button onClick={toggleDark} className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 transition-colors">
                        {isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
                        {isDark ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button onClick={onLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-600 px-4 py-2 transition-colors w-full">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Header, Overlay, Main Content... similar structure to original */}
            <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between sticky top-0 z-40">
                <h1 className="text-xl font-black font-serif text-gray-900 dark:text-white">GATH<span className="text-brand-600">ERED</span></h1>
                <div className="flex gap-2">
                    <button onClick={toggleDark} className="p-2 text-gray-600 dark:text-gray-300">{isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}</button>
                    <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-600 dark:text-gray-300"><Menu size={24} /></button>
                </div>
            </div>

            {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />}

            <main className="flex-1 overflow-y-auto p-4 md:p-8 h-[calc(100vh-65px)] md:h-screen">
                {notification && (
                    <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg animate-bounce font-bold flex items-center gap-2 ${notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                        {notification.type === 'error' ? <X size={18} /> : <Check size={18} />}
                        {notification.msg}
                    </div>
                )}

                {activeTab === 'overview' && <DashboardStats stats={stats} />}
                {activeTab === 'news-list' && <NewsTable newsList={newsList} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} onCreate={() => { setEditingId(null); setActiveTab('add-news'); }} />}
                {activeTab === 'add-news' && <Editor editItem={editItem} setEditItem={setEditItem} editingId={editingId} aiPrompt={aiPrompt} setAiPrompt={setAiPrompt} isGeneratingAi={isGeneratingAi} handleAiGenerate={handleAiGenerate} handleSave={handleSave} isLoading={isLoading} onCancel={() => setActiveTab('news-list')} />}
                {activeTab === 'sources' && <RSSManager rssFeeds={rssFeeds} newFeed={newFeed} setNewFeed={setNewFeed} isAddingFeed={isAddingFeed} handleAddFeed={handleAddFeed} handleDeleteFeed={handleDeleteFeed} />}
                {activeTab === 'subscribers' && <SubscriberList subscribers={subscribers} />}
            </main>
        </div>
    );
};

export default Dashboard;
