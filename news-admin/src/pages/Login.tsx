import React, { useState } from 'react';
import { Shield } from 'lucide-react';

interface LoginProps {
    onLogin: (e: React.FormEvent, email: string, pass: string) => void;
    isLoading: boolean;
    notification: { msg: string; type: 'success' | 'error' } | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, isLoading, notification }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-700">
                <div className="flex justify-center mb-6 text-brand-600">
                    <Shield size={48} />
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">Admin Portal</h2>

                <form onSubmit={(e) => onLogin(e, email, password)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="admin@gathered.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="admin"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2 rounded-lg transition-colors flex justify-center items-center"
                    >
                        {isLoading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span> : 'Login'}
                    </button>
                </form>
                {notification && (
                    <div className={`mt-4 p-2 rounded text-center text-sm ${notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {notification.msg}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
