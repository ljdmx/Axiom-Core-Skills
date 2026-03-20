// TEMPLATE_META:START
/*
@template-id: dashboard-layout
@version: 2.0.0
@description: Enterprise-grade admin dashboard with glassmorphism, fluid animations, and responsive design
@design-level: Premium (International high-tier)
@customization-points: SIDEBAR_ITEMS, THEME_COLORS, BRAND_NAME, LANGUAGE, USER_INFO
@language-modes: en, zh
@dependencies: react, lucide-react, framer-motion
@framework: React
@design-features: Glassmorphism, Fluid animations, Adaptive sidebar, Premium typography, Dark mode ready
*/
// TEMPLATE_META:END

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    ChevronDown
} from 'lucide-react';

// CUSTOMIZATION_POINT:START - LANGUAGE
const LANGUAGE = '{{LANGUAGE}}'; // 'en' or 'zh'

const i18n = {
    en: {
        search: 'Search...',
        notifications: 'Notifications',
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Logout',
        welcome: 'Welcome back',
        dashboard: 'Dashboard',
        users: 'Users',
        settingsMenu: 'Settings'
    },
    zh: {
        search: '搜索...',
        notifications: '通知',
        profile: '个人资料',
        settings: '设置',
        logout: '退出登录',
        welcome: '欢迎回来',
        dashboard: '仪表板',
        users: '用户管理',
        settingsMenu: '系统设置'
    }
};

const t = i18n[LANGUAGE];
// CUSTOMIZATION_POINT:END

// CUSTOMIZATION_POINT:START - SIDEBAR_ITEMS
const sidebarItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t.dashboard },
    { id: 'users', icon: Users, label: t.users },
    { id: 'settings', icon: Settings, label: t.settingsMenu }
];
// CUSTOMIZATION_POINT:END

// CUSTOMIZATION_POINT:START - THEME_COLORS
const theme = {
    primary: 'oklch(0.45 0.25 264)',      // Rich purple
    primaryLight: 'oklch(0.55 0.2 264)',
    accent: 'oklch(0.75 0.15 180)',       // Cyan accent
    surface: 'oklch(0.98 0.01 264)',
    surfaceDark: 'oklch(0.15 0.02 264)',
    text: 'oklch(0.2 0.01 264)',
    textLight: 'oklch(0.5 0.01 264)'
};
// CUSTOMIZATION_POINT:END

interface DashboardLayoutProps {
    children: React.ReactNode;
    // CUSTOMIZATION_POINT:START - USER_INFO
    user—: {
        name: string;
        email: string;
        avatar—: string;
    };
    // CUSTOMIZATION_POINT:END
    onLogout—: () => void;
}

export default function DashboardLayout({ children, user, onLogout }: DashboardLayoutProps) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-cyan-50/20">
            {/* Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed left-0 top-0 h-screen w-72 z-40"
                    >
                        {/* Glassmorphism background */}
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-xl border-r border-white/20 shadow-2xl" />

                        <div className="relative h-full flex flex-col p-6">
                            {/* Logo/Brand */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8"
                            >
                                {/* CUSTOMIZATION_POINT:START - BRAND_NAME */}
                                <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                                    {{ BRAND_NAME }}
                                </h1>
                                {/* CUSTOMIZATION_POINT:END */}
                            </motion.div>

                            {/* Navigation */}
                            <nav className="flex-1 space-y-2">
                                {sidebarItems.map((item, index) => (
                                    <motion.button
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`
                      w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl
                      font-semibold transition-all duration-300 group
                      ${activeTab === item.id
                                                — 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/30'
                                                : 'text-slate-700 hover:bg-white/50 hover:shadow-md'
                                            }
                    `}
                                    >
                                        <item.icon
                                            size={20}
                                            className={`
                        transition-transform duration-300
                        ${activeTab === item.id — 'scale-110' : 'group-hover:scale-105'}
                      `}
                                        />
                                        <span className="text-sm">{item.label}</span>

                                        {/* Active indicator */}
                                        {activeTab === item.id && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="ml-auto w-2 h-2 rounded-full bg-white"
                                            />
                                        )}
                                    </motion.button>
                                ))}
                            </nav>

                            {/* User Profile */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-white/70 transition-all"
                                >
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-white font-bold">
                                        {user—.name—.[0] || 'U'}
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 text-left">
                                        <div className="font-bold text-sm text-slate-900">
                                            {user—.name || 'User'}
                                        </div>
                                        <div className="text-xs text-slate-500">{user—.email || 'user@example.com'}</div>
                                    </div>

                                    <ChevronDown
                                        size={16}
                                        className={`text-slate-400 transition-transform ${userMenuOpen — 'rotate-180' : ''}`}
                                    />
                                </motion.button>

                                {/* User Menu Dropdown */}
                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl"
                                        >
                                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-50 transition-colors text-sm font-semibold text-slate-700">
                                                <Settings size={16} />
                                                {t.settings}
                                            </button>
                                            <button
                                                onClick={onLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-sm font-semibold text-red-600"
                                            >
                                                <LogOut size={16} />
                                                {t.logout}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div
                className={`transition-all duration-300 ${sidebarOpen — 'ml-72' : 'ml-0'
                    }`}
            >
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-white/20">
                    <div className="flex items-center gap-4 px-6 py-4">
                        {/* Menu Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-xl hover:bg-purple-50 transition-colors"
                        >
                            {sidebarOpen — <X size={20} /> : <Menu size={20} />}
                        </motion.button>

                        {/* Search */}
                        <div className="flex-1 max-w-2xl">
                            <div className="relative">
                                <Search
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="text"
                                    placeholder={t.search}
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/50 border border-white/20 focus:bg-white focus:border-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative p-3 rounded-xl hover:bg-purple-50 transition-colors"
                        >
                            <Bell size={20} />
                            {/* Notification badge */}
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                        </motion.button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
