
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { User, Mail, Save, ArrowLeft } from 'lucide-react';

interface SettingsProps {
    user: { name: string; email: string };
    setPage: (page: string) => void;
    onUpdateUser: (user: { name: string; email: string }) => void;
    onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, setPage, onUpdateUser, onLogout }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [saved, setSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateUser({ name, email });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar setPage={setPage} user={user} onLogout={onLogout} />
            <div className="max-w-2xl mx-auto px-4 py-8">
                 <button
                    onClick={() => setPage('home')}
                    className="flex items-center text-gray-600 hover:text-emerald-600 text-lg font-medium transition mb-6"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </button>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                        <p className="text-gray-500">Manage your profile information.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5 z-10" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{ colorScheme: 'light' }}
                                    className="pl-10 block w-full bg-white text-gray-900 border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 border p-3"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                             <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5 z-10" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ colorScheme: 'light' }}
                                    className="pl-10 block w-full bg-white text-gray-900 border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 border p-3"
                                />
                            </div>
                        </div>
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition flex items-center"
                            >
                                <Save className="w-5 h-5 mr-2" />
                                {saved ? 'Saved Successfully' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default Settings;
