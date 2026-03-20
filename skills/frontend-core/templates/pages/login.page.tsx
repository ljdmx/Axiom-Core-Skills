// TEMPLATE_META:START
/*
@template-id: login-page
@version: 1.0.0
@description: Clean login page with language purity (no mixed Chinese-English)
@customization-points: BRAND_NAME, API_ENDPOINT, LANGUAGE
@language-modes: en, zh
@dependencies: react, lucide-react
@framework: React
*/
// TEMPLATE_META:END

import React, { useState } from 'react';
import { LogIn } from 'lucide-react';

// CUSTOMIZATION_POINT:START - LANGUAGE
const LANGUAGE = '{{LANGUAGE}}'; // 'en' or 'zh'

const i18n = {
    en: {
        title: 'Sign In',
        subtitle: 'Welcome back',
        emailLabel: 'Email Address',
        emailPlaceholder: 'your@email.com',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Enter your password',
        loginButton: 'Sign In',
        forgotPassword: 'Forgot password?',
        noAccount: "Don't have an account?",
        signUp: 'Sign up',
        loggingIn: 'Signing in...'
    },
    zh: {
        title: '登录',
        subtitle: '欢迎回来',
        emailLabel: '邮箱地址',
        emailPlaceholder: '请输入邮箱',
        passwordLabel: '密码',
        passwordPlaceholder: '请输入密码',
        loginButton: '登录',
        forgotPassword: '忘记密码？',
        noAccount: '还没有账号？',
        signUp: '注册',
        loggingIn: '正在登录...'
    }
};

const t = i18n[LANGUAGE];
// CUSTOMIZATION_POINT:END

interface LoginProps {
    onLogin: (token: string, user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // CUSTOMIZATION_POINT:START - API_ENDPOINT
            const response = await fetch('{{API_ENDPOINT}}/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            // CUSTOMIZATION_POINT:END

            const data = await response.json();
            if (response.ok) {
                onLogin(data.token, data.user);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <LogIn className="text-white" size={32} />
                        </div>
                        {/* CUSTOMIZATION_POINT:START - BRAND_NAME */}
                        <h1 className="text-3xl font-black text-slate-900 mb-2">{{ BRAND_NAME }}</h1>
                        {/* CUSTOMIZATION_POINT:END */}
                        <p className="text-slate-500 font-medium">{t.subtitle}</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                {t.emailLabel}
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t.emailPlaceholder}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 transition-colors"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                {t.passwordLabel}
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t.passwordPlaceholder}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 transition-colors"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? t.loggingIn : t.loginButton}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 text-center text-sm">
                        <a href="#" className="text-slate-600 hover:text-slate-900 font-medium">
                            {t.forgotPassword}
                        </a>
                    </div>

                    <div className="mt-4 text-center text-sm text-slate-600">
                        {t.noAccount}{' '}
                        <a href="#" className="text-slate-900 font-bold hover:underline">
                            {t.signUp}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
