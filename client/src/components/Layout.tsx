import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, Users, User, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Layout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const navigation = [
        { name: 'Chat', href: '/chat', icon: MessageCircle },
        { name: 'Matches', href: '/matches', icon: Users },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
                    <div className="flex h-16 items-center justify-between px-4">
                        <h1 className="text-xl font-bold gradient-text">ChatterBox AI</h1>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <nav className="flex-1 space-y-1 px-2 py-4">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        navigate(item.href);
                                        setSidebarOpen(false);
                                    }}
                                    className={`group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${isActive(item.href)
                                            ? 'bg-primary-100 text-primary-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon size={20} className="mr-3" />
                                    {item.name}
                                </button>
                            );
                        })}
                    </nav>
                    <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                        >
                            <LogOut size={20} className="mr-3" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
                <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
                    <div className="flex items-center h-16 px-4">
                        <h1 className="text-xl font-bold gradient-text">ChatterBox AI</h1>
                    </div>
                    <nav className="flex-1 space-y-1 px-2 py-4">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => navigate(item.href)}
                                    className={`group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${isActive(item.href)
                                            ? 'bg-primary-100 text-primary-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon size={20} className="mr-3" />
                                    {item.name}
                                </button>
                            );
                        })}
                    </nav>
                    <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                        >
                            <LogOut size={20} className="mr-3" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64 flex flex-col flex-1">
                {/* Mobile header */}
                <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
                    <h1 className="text-lg font-semibold gradient-text">ChatterBox AI</h1>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Page content */}
                <main className="flex-1 overflow-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout; 