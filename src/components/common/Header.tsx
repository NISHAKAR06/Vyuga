import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, Language } from '../../types';
import {
  Sprout,
  Sun,
  Moon,
  Globe,
  Bell,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Building2,
  Tractor,
  Menu,
  Check
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenProfile }) => {
  const {
    role,
    setRole,
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

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.read && (n.roleTarget === role || n.roleTarget === 'all')).length;

  const roleConfigs = {
    farmer: {
      label: t.roleFarmer,
      icon: Tractor,
      badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
    },
    officer: {
      label: t.roleOfficer,
      icon: Building2,
      badgeColor: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30'
    },
    admin: {
      label: t.roleAdmin,
      icon: ShieldCheck,
      badgeColor: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
    }
  };

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' }
  ];

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90 sm:px-6">
      {/* Left: Brand Logo & Mobile Toggle */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Custom AgriTech Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-500/20">
            <Sprout className="h-6 w-6 stroke-[2.2]" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-amber-400 dark:border-slate-900" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                {t.appName}
              </span>
              <span className="rounded bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                PROCURING
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
              {t.taglineShort}
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls: Role, Language, Theme, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowLangDropdown(false);
              setShowNotifDropdown(false);
            }}
            className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${roleConfigs[role].badgeColor}`}
          >
            {React.createElement(roleConfigs[role].icon, { className: 'h-4 w-4 shrink-0' })}
            <span className="hidden md:inline">{roleConfigs[role].label}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t.switchRole}
              </div>
              {(['farmer', 'officer', 'admin'] as UserRole[]).map((r) => {
                const cfg = roleConfigs[r];
                const Icon = cfg.icon;
                const isSelected = role === r;
                return (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setShowRoleDropdown(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" />
                      <span>{cfg.label}</span>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLangDropdown(!showLangDropdown);
              setShowRoleDropdown(false);
              setShowNotifDropdown(false);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Globe className="h-3.5 w-3.5 text-emerald-500" />
            <span className="hidden sm:inline">
              {languages.find(l => l.code === language)?.native}
            </span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900 z-50">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setShowLangDropdown(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold ${
                    language === l.code
                      ? 'bg-emerald-500 text-white'
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
              setShowRoleDropdown(false);
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
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 px-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    {t.notifications}
                  </h4>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-black text-rose-600 dark:text-rose-400">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
                >
                  {t.markAllRead}
                </button>
              </div>

              <div className="mt-2 max-h-72 space-y-1.5 overflow-y-auto pr-1">
                {notifications
                  .filter(n => n.roleTarget === role || n.roleTarget === 'all')
                  .map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`cursor-pointer rounded-xl p-2.5 transition-colors ${
                        !n.read
                          ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                          {n.title}
                        </h5>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
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
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 font-bold text-white text-xs">
            {user.name.charAt(0)}
          </div>
          <div className="hidden text-left xl:block">
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
          onClick={logout}
          title={t.logout}
          className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-rose-500 hover:bg-rose-50 hover:border-rose-200 dark:border-slate-800 dark:bg-slate-800/80 dark:hover:bg-rose-950/40 transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
