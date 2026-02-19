import React from 'react';

interface Subscriber {
    id: string;
    email: string;
    name?: string;
    whatsapp?: string;
    created_at: string;
}

interface SubscriberListProps {
    subscribers: Subscriber[];
}

const SubscriberList: React.FC<SubscriberListProps> = ({ subscribers }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <header>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Newsletter Subscribers</h2>
                <p className="text-gray-500">List of users who have subscribed to the newsletter.</p>
            </header>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 font-semibold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email Address</th>
                            <th className="px-6 py-4">WhatsApp</th>
                            <th className="px-6 py-4">Subscribed At</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {subscribers.map((sub) => (
                            <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{sub.name || '-'}</td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{sub.email}</td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{sub.whatsapp || '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{new Date(sub.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {subscribers.length === 0 && (
                            <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No subscribers yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubscriberList;
