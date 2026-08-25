import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Sprout,
  Tractor,
  Building2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Lock,
  Phone,
  CheckCircle2,
  Scale,
  CreditCard,
  Sun,
  Moon,
  UserPlus,
  Landmark,
  Clock
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, role, theme, toggleTheme, language, setLanguage, t } = useApp();

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
    navigate(`/${selectedRole}`);
  };

  const handleDirectDemoLogin = (r: UserRole) => {
    handleRoleChange(r);
    login(r);
    navigate(`/${r}`);
  };

  const roleOptions: { key: UserRole; title: string; desc: string; icon: any }[] = [
    {
      key: 'farmer',
      title: t.roleFarmer,
      desc: 'Crop registration, slot booking, live token queue',
      icon: Tractor
    },
    {
      key: 'officer',
      title: t.roleOfficer,
      desc: 'Mandi gate desk, electronic moisture & weighbridge',
      icon: Building2
    },
    {
      key: 'admin',
      title: t.roleAdmin,
      desc: 'State directorate oversight & harvest monitoring',
      icon: Landmark
    }
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      
      {/* Official Top Bar */}
      <div className="border-b border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900/90 text-[11px] font-medium text-slate-600 dark:text-slate-400 py-1.5 px-4 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span>Government of Tamil Nadu • தமிழ்நாடு அரசு | TNCSC</span>
          <span>{t.authPortalBadge}</span>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="flex items-center justify-between p-4 sm:px-8 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-800 text-white shadow">
            <Sprout className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                AgriProcure
              </span>
              <span className="rounded bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                PORTAL LOGIN
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Department of Food & Consumer Protection
            </p>
          </div>
        </div>

        {/* Top Controls: Language & Theme */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 p-0.5 text-xs font-bold">
            <button
              onClick={() => setLanguage('en')}
              className={`rounded px-2.5 py-1 ${language === 'en' ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`rounded px-2.5 py-1 ${language === 'ta' ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`rounded px-2.5 py-1 ${language === 'hi' ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              हिन्दी
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* Main Login Body */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl">
          
          {/* Navigation link back to home & Sign up */}
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t.authBackToPublic}</span>
            </button>

            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>{t.authNewFarmerReg}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-12">
            
            {/* Left Info Panel (5 cols) */}
            <div className="flex flex-col justify-between bg-emerald-900 p-8 text-white lg:col-span-5">
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded bg-emerald-800 px-2.5 py-1 text-[11px] font-bold text-emerald-200 mb-3">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>{t.authOfficialVerified}</span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Authorized Sign-In
                  </h2>
                  <p className="mt-2 text-xs text-emerald-100 leading-relaxed">
                    Direct government portal for agricultural produce procurement, live mandi token management, and direct MSP payment transfers.
                  </p>
                </div>

                {/* System Highlights */}
                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex items-start gap-3 rounded-lg bg-emerald-950/60 p-3 border border-emerald-800/80">
                    <Scale className="h-4 w-4 shrink-0 text-emerald-300 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white">{t.authWeighbridgeTitle}</h4>
                      <p className="text-[11px] text-emerald-200/80 mt-0.5">{t.authWeighbridgeDesc}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg bg-emerald-950/60 p-3 border border-emerald-800/80">
                    <Clock className="h-4 w-4 shrink-0 text-emerald-300 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white">{t.authSlotTitle}</h4>
                      <p className="text-[11px] text-emerald-200/80 mt-0.5">{t.authSlotDesc}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg bg-emerald-950/60 p-3 border border-emerald-800/80">
                    <CreditCard className="h-4 w-4 shrink-0 text-emerald-300 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white">{t.authDbtTitle}</h4>
                      <p className="text-[11px] text-emerald-200/80 mt-0.5">{t.authDbtDesc}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-emerald-800 pt-3 text-[10px] text-emerald-300">
                <span>{t.authHelpline}</span>
              </div>
            </div>

            {/* Right Form & Quick Access (7 cols) */}
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-7">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Select User Category
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select your role to access the corresponding departmental services.
                </p>
              </div>

              {/* Role Cards Selector */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {roleOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedRole === opt.key;

                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleRoleChange(opt.key)}
                      className={`flex flex-col items-center justify-center rounded-lg border p-2.5 text-center transition-all ${
                        isSelected
                          ? 'border-emerald-800 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/80 dark:border-emerald-700 dark:text-emerald-200 ring-1 ring-emerald-800 font-bold'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isSelected ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-500'}`} />
                      <span className="mt-1 text-xs font-bold leading-tight">{opt.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="mt-5 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    {t.enterMobileOrUserId}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={mobileOrId}
                      onChange={e => setMobileOrId(e.target.value)}
                      required
                      placeholder="e.g. 9842176540"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 pl-9 text-xs font-semibold text-slate-900 dark:text-white focus:border-emerald-800 focus:outline-none"
                    />
                    <Phone className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    {t.enterPasswordOrOtp}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={passwordOrOtp}
                      onChange={e => setPasswordOrOtp(e.target.value)}
                      required
                      placeholder="••••••"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 pl-9 text-xs font-semibold text-slate-900 dark:text-white focus:border-emerald-800 focus:outline-none"
                    />
                    <Lock className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 p-3 text-xs font-bold uppercase tracking-wide text-white shadow transition-colors mt-2"
                >
                  <span>{t.loginButton}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              {/* 1-Click Verification / Evaluation Accounts */}
              <div className="mt-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Quick Role Test Accounts
                  </span>
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold">{t.authQuick1Click}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDirectDemoLogin('farmer')}
                    className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-left hover:border-emerald-800 transition-colors text-xs font-bold"
                  >
                    <span className="block text-slate-900 dark:text-white font-bold">🌾 Farmer</span>
                    <span className="text-[10px] text-slate-500 font-normal">R. Murugesan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDirectDemoLogin('officer')}
                    className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-left hover:border-emerald-800 transition-colors text-xs font-bold"
                  >
                    <span className="block text-slate-900 dark:text-white font-bold">🏢 Officer</span>
                    <span className="text-[10px] text-slate-500 font-normal">Centre A Mandi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDirectDemoLogin('admin')}
                    className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-left hover:border-emerald-800 transition-colors text-xs font-bold"
                  >
                    <span className="block text-slate-900 dark:text-white font-bold">🏛 Admin</span>
                    <span className="text-[10px] text-slate-500 font-normal">State Directorate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 p-4 text-center text-xs text-slate-500 dark:text-slate-400">
        AgriProcure • Tamil Nadu Civil Supplies Corporation (TNCSC), Government of Tamil Nadu
      </footer>
    </div>
  );
};
