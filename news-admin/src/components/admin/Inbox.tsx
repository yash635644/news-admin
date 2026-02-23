import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Check, Inbox as InboxIcon, Loader2, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

const Inbox = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMessages = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.getContactMessages();
            setMessages(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load messages');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleMarkRead = async (id: string) => {
        try {
            await api.markContactRead(id);
            setMessages(messages.map(m => m.id === id ? { ...m, status: 'read' } : m));
        } catch (err) {
            console.error('Failed to mark as read', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        try {
            await api.deleteContactMessage(id);
            setMessages(messages.filter(m => m.id !== id));
        } catch (err) {
            console.error('Failed to delete message', err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-brand-600" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
                <span>⚠️ {error}</span>
                <button onClick={fetchMessages} className="underline text-sm ml-auto">Retry</button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-white flex items-center gap-2">
                    <InboxIcon className="text-brand-500" size={28} />
                    Contact Inbox
                    <span className="ml-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-0.5 rounded-full font-sans font-medium">
                        {messages.length}
                    </span>
                </h2>
                <button
                    onClick={fetchMessages}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            {messages.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
                    <Mail size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Your inbox is empty</h3>
                    <p className="text-gray-500 dark:text-gray-400">When users submit the contact form, their messages will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`bg-white dark:bg-gray-800 p-6 rounded-xl border transition-all shadow-sm ${msg.status === 'unread'
                                    ? 'border-l-4 border-l-brand-500 border-t-gray-200 border-r-gray-200 border-b-gray-200 dark:border-t-gray-700 dark:border-r-gray-700 dark:border-b-gray-700'
                                    : 'border-gray-200 dark:border-gray-700 opacity-80'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4 gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        {msg.name}
                                        {msg.status === 'unread' && (
                                            <span className="bg-brand-100 text-brand-700 text-xs px-2 py-0.5 rounded-md font-bold dark:bg-brand-900/30 dark:text-brand-400">
                                                New
                                            </span>
                                        )}
                                    </h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                                        <a href={`mailto:${msg.email}`} className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline flex items-center gap-1">
                                            <Mail size={14} /> {msg.email}
                                        </a>
                                        <span className="text-gray-400 dark:text-gray-500 text-xs">
                                            {new Date(msg.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {msg.status === 'unread' && (
                                        <button
                                            onClick={() => handleMarkRead(msg.id)}
                                            className="p-2 bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 rounded-lg transition-colors"
                                            title="Mark as Read"
                                        >
                                            <Check size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(msg.id)}
                                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                                        title="Delete Message"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700 line-clamp-4 hover:line-clamp-none transition-all cursor-pointer">
                                <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
                                    {msg.message}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Inbox;
