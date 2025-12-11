
import React from 'react';
import Navbar from '../components/Navbar';
import { User, Mail, Calendar, ShieldCheck, Edit, ArrowLeft } from 'lucide-react';

interface ProfileProps {
    user: { name: string; email: string };
    setPage: (page: string) => void;
    onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, setPage, onLogout }) => {
    // Generate initials
    const initials = user.name 
        ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
        : 'JD';

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar setPage={setPage} user={user} onLogout={onLogout} />
            
            <div className="max-w-3xl mx-auto px-4 py-8">
                 <button
                    onClick={() => setPage('home')}
                    className="flex items-center text-gray-600 hover:text-emerald-600 text-lg font-medium transition mb-6"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-600"></div>
                    
                    <div className="px-8 pb-8">
                        {/* Avatar & Action */}
                        <div className="flex justify-between items-end -mt-12 mb-6">
                            <div className="w-24 h-24 rounded-full bg-white p-1.5 shadow-md">
                                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-3xl font-bold text-emerald-700">
                                    {initials}
                                </div>
                            </div>
                            <button 
                                onClick={() => setPage('settings')}
                                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
                            >
                                <Edit className="w-4 h-4 mr-2" /> Edit Profile
                            </button>
                        </div>

                        {/* Info */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                            <p className="text-gray-500 text-lg">{user.email}</p>
                            
                            <div className="flex items-center mt-3 text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full text-sm font-medium">
                                <ShieldCheck className="w-4 h-4 mr-1.5" /> Verified Account
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-gray-100">
                            <div className="flex items-start p-4 bg-gray-50 rounded-xl">
                                <div className="bg-white p-2.5 rounded-lg shadow-sm mr-4">
                                    <User className="w-6 h-6 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Account Type</p>
                                    <p className="text-lg font-semibold text-gray-900">Buyer & Seller</p>
                                </div>
                            </div>

                            <div className="flex items-start p-4 bg-gray-50 rounded-xl">
                                <div className="bg-white p-2.5 rounded-lg shadow-sm mr-4">
                                    <Calendar className="w-6 h-6 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Member Since</p>
                                    <p className="text-lg font-semibold text-gray-900">October 2023</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
