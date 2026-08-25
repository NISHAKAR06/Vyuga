import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';
import {
  Sprout,
  Sun,
  Moon,
  Globe,
  Bell,
  LogOut,
  ChevronDown,
  Menu
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenProfile }) => {
  const navigate = useNavigate();
  const {
    role,
    user,
    theme,
    toggleTheme,
    language,
    setLanguage,
    t,
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
    logout
  } = useApp();

  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.read && (n.roleTarget === role || n.roleTarget === 'all')).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' }
  ];

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 sm:px-6 shadow-sm">
      {/* Left: Brand Logo & Mobile Toggle */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Toggle navigation sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Custom AgriProcure Logo */}
        <div
          onClick={() => navigate(`/${role}`)}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-95 transition-opacity"
          title="AgriProcure Portal"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-800 text-white shadow">
            <Sprout className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                AgriProcure
              </span>
              <span className="rounded bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                {role.toUpperCase()}
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
              {t.taglineShort}
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls: Language, Theme, Notifications, Profile, Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLangDropdown(!showLangDropdown);
              setShowNotifDropdown(false);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <Globe className="h-3.5 w-3.5 text-emerald-800 dark:text-emerald-400" />
            <span className="hidden sm:inline">
              {languages.find(l => l.code === language)?.native}
            </span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900 z-50">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setShowLangDropdown(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold ${
                    language === l.code
                      ? 'bg-emerald-800 text-white'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{l.native}</span>
                  <span className="text-[10px] opacity-70">({l.label})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'light' ? t.darkMode : t.lightMode}
          className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4 text-slate-700" />
          ) : (
            <Sun className="h-4 w-4 text-amber-400" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              setShowLangDropdown(false);
            }}
            className="relative rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-3 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {t.notifications}
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-semibold text-emerald-800 hover:underline dark:text-emerald-400"
                  >
                    {t.markAllRead}
                  </button>
                )}
              </div>

              <div className="mt-2 max-h-72 space-y-2 overflow-y-auto pr-1">
                {notifications
                  .filter(n => n.roleTarget === role || n.roleTarget === 'all')
                  .slice(0, 8)
                  .map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`cursor-pointer rounded-lg p-2.5 transition-colors ${
                        n.read
                          ? 'bg-transparent text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
                          : 'bg-emerald-50 text-slate-900 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold leading-tight">{n.title}</p>
                        <span className="shrink-0 text-[10px] opacity-60">{n.timestamp}</span>
                      </div>
                      <p className="mt-1 text-[11px] opacity-80 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Button */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 py-1 pl-1.5 pr-2.5 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-800 font-bold text-white text-xs">
            {user.name.charAt(0)}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold leading-tight text-slate-900 dark:text-white">
              {user.name}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {user.id}
            </p>
          </div>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title={t.logout}
          className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-rose-600 hover:bg-rose-50 hover:border-rose-300 dark:border-slate-800 dark:bg-slate-800/80 dark:hover:bg-rose-950/40 transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
