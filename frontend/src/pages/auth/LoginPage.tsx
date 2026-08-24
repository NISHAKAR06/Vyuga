import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Sprout,
  Tractor,
  Building2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Phone,
  CheckCircle2,
  Scale,
  CreditCard,
  Sun,
  Moon,
  Globe
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, role, setRole, theme, toggleTheme, language, setLanguage, t } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>(role || 'farmer');
  const [mobileOrId, setMobileOrId] = useState('9842176540');
  const [passwordOrOtp, setPasswordOrOtp] = useState('123456');

  const handleRoleChange = (r: UserRole) => {
    setSelectedRole(r);
    if (r === 'farmer') {
      setMobileOrId('9842176540');
    } else if (r === 'officer') {
      setMobileOrId('OFF-TN-042');
    } else {
      setMobileOrId('ADM-TN-001');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole, mobileOrId);
  };

  const roleOptions: { key: UserRole; title: string; desc: string; icon: any }[] = [
    {
      key: 'farmer',
      title: t.roleFarmer,
      desc: 'Register produce, choose slots, live token queue',
      icon: Tractor
    },
    {
      key: 'officer',
      title: t.roleOfficer,
      desc: 'Manage mandi slots, queue desk & verification',
      icon: Building2
    },
    {
      key: 'admin',
      title: t.roleAdmin,
      desc: 'State procurement monitoring & AI forecasts',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">
      {/* Top Navbar */}
      <header className="flex items-center justify-between p-4 sm:px-8 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-md shadow-emerald-500/25">
            <Sprout className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              AgriProcure
            </span>
            <span className="ml-2 rounded-md bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
              Kharif 2026
            </span>
          </div>
        </div>

        {/* Top Controls: Language & Theme */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-1 text-xs font-semibold">
            <button
              onClick={() => setLanguage('en')}
              className={`rounded-lg px-2.5 py-1 ${language === 'en' ? 'bg-emerald-500 text-white' : 'text-slate-600 dark:text-slate-400'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`rounded-lg px-2.5 py-1 ${language === 'ta' ? 'bg-emerald-500 text-white' : 'text-slate-600 dark:text-slate-400'}`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`rounded-lg px-2.5 py-1 ${language === 'hi' ? 'bg-emerald-500 text-white' : 'text-slate-600 dark:text-slate-400'}`}
            >
              हिन्दी
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* Main Login Body */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-8">
        <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-12">
          {/* Left Hero & Feature Highlights (5 cols) */}
          <div className="relative flex flex-col justify-between bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 p-8 text-white lg:col-span-5">
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>Next-Gen Agricultural Queue Platform</span>
              </div>

              <div>
                <h2 className="text-3xl font-black tracking-tight leading-tight">
                  {t.loginTitle}
                </h2>
                <p className="mt-3 text-sm text-emerald-100 font-medium leading-relaxed">
                  {t.loginSub}
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-4 pt-4 text-xs">
                <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur-sm border border-white/10">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/40 text-emerald-300">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">AI Waiting-Time Prediction</h4>
                    <p className="text-emerald-100/80">Dynamic queue forecasting & crowd load management.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur-sm border border-white/10">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/40 text-emerald-300">
                    <Scale className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Procurement Officer Slots</h4>
                    <p className="text-emerald-100/80">No forced automated slots. Farmers choose available windows.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur-sm border border-white/10">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/40 text-emerald-300">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Direct Benefit Transfer (DBT)</h4>
                    <p className="text-emerald-100/80">Transparent MSP calculation & instant bank credit tracking.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-8 border-t border-white/10 pt-4 text-[11px] text-emerald-200">
              <span>National Agricultural Procurement Portal • Smart India Hackathon Prototype</span>
            </div>
          </div>

          {/* Right Form & Quick Access (7 cols) */}
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:col-span-7">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {t.selectYourRole}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Choose your access level to enter the digital procurement workspace.
              </p>
            </div>

            {/* Role Cards Selector */}
            <div className="mt-5 grid grid-cols-3 gap-2.5">
              {roleOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedRole === opt.key;

                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleRoleChange(opt.key)}
                    className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 ring-2 ring-emerald-500/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                    <span className="mt-1.5 text-xs font-bold">{opt.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t.enterMobileOrUserId}
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    value={mobileOrId}
                    onChange={e => setMobileOrId(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 p-3 pl-10 text-xs font-semibold text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t.enterPasswordOrOtp}
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="password"
                    value={passwordOrOtp}
                    onChange={e => setPasswordOrOtp(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 p-3 pl-10 text-xs font-semibold text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-500 hover:to-emerald-400 active:scale-[0.99] transition-all"
              >
                <span>{t.loginButton}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Quick Demo Access Switcher */}
            <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t.quickDemoAccess}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">1-Click Test</span>
              </div>
              <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => {
                    handleRoleChange('farmer');
                    login('farmer');
                  }}
                  className="rounded-xl border border-emerald-500/30 bg-white dark:bg-slate-800 p-2.5 text-left hover:border-emerald-500 transition-colors shadow-sm"
                >
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">🌾 Farmer Demo</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">R. Murugesan (Paddy)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleRoleChange('officer');
                    login('officer');
                  }}
                  className="rounded-xl border border-blue-500/30 bg-white dark:bg-slate-800 p-2.5 text-left hover:border-blue-500 transition-colors shadow-sm"
                >
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">🏢 Officer Demo</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">K. Senthil (Centre A)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleRoleChange('admin');
                    login('admin');
                  }}
                  className="rounded-xl border border-purple-500/30 bg-white dark:bg-slate-800 p-2.5 text-left hover:border-purple-500 transition-colors shadow-sm"
                >
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">🏛 Admin Demo</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Directorate Level</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 p-4 text-center text-xs text-slate-500 dark:text-slate-400">
        AgriProcure – Smart Agricultural Procurement & Queue Management System • Smart India Hackathon
      </footer>
    </div>
  );
};
