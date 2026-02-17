import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';

const Newsletter = () => {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sentStatus, setSentStatus] = useState<{ count: number } | null>(null);

    const handleSend = async () => {
        if (!subject || !content) return;
        setIsSending(true);
        try {
            const res = await api.sendNewsletter(subject, content);
            if (res.success) {
                setSentStatus({ count: res.count });
                setSubject('');
                setContent('');
                setTimeout(() => setSentStatus(null), 5000);
            }
        } catch (e) {
            alert('Failed to send newsletter');
        }
        setIsSending(false);
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <header>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Newsletter Composer</h2>
                <p className="text-gray-500">Send updates to your subscribers.</p>
            </header>

            {sentStatus ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center animate-fade-in">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Sent Successfully!</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Your newsletter has been queued for {sentStatus.count} subscribers.
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Subject Line</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-brand-500 font-bold text-lg"
                            placeholder="e.g. Weekly Roundup: Top Tech Stories"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Body</label>
                        <textarea
                            rows={12}
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-brand-500 font-serif text-lg leading-relaxed"
                            placeholder="Dear Reader, Here are the top stories for you..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleSend}
                            disabled={isSending || !subject || !content}
                            className="px-8 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold rounded-lg shadow-lg shadow-brand-500/30 flex items-center gap-2 transition-all"
                        >
                            {isSending ? (
                                <>Sending...</>
                            ) : (
                                <><Send size={20} /> Send to All Subscribers</>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Newsletter;
