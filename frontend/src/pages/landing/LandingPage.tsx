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
  CheckCircle2,
  Scale,
  CreditCard,
  Sun,
  Moon,
  Clock,
  Users,
  MapPin,
  FileCheck,
  Smartphone,
  ChevronRight,
  HelpCircle,
  PhoneCall,
  Activity,
  FileText,
  Calendar,
  Lock,
  Landmark,
  BadgeAlert,
  Search,
  ExternalLink
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme, language, setLanguage, t, login } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleQuickLogin = (role: UserRole) => {
    login(role);
    navigate(`/${role}`);
  };

  const mspRates = [
    { crop: t.landingMspCrop1, season: t.landingMspSeason1, mspPerQtl: t.landingMspPrice1, moistureLimit: t.landingMspMoisture1 },
    { crop: t.landingMspCrop2, season: t.landingMspSeason2, mspPerQtl: t.landingMspPrice2, moistureLimit: t.landingMspMoisture2 },
    { crop: t.landingMspCrop3, season: t.landingMspSeason3, mspPerQtl: t.landingMspPrice3, moistureLimit: t.landingMspMoisture3 },
    { crop: t.landingMspCrop4, season: t.landingMspSeason4, mspPerQtl: t.landingMspPrice4, moistureLimit: t.landingMspMoisture4 },
    { crop: t.landingMspCrop5, season: t.landingMspSeason5, mspPerQtl: t.landingMspPrice5, moistureLimit: t.landingMspMoisture5 }
  ];

  const faqs = [
    { q: t.landingFaqQ1, a: t.landingFaqA1 },
    { q: t.landingFaqQ2, a: t.landingFaqA2 },
    { q: t.landingFaqQ3, a: t.landingFaqA3 },
    { q: t.landingFaqQ4, a: t.landingFaqA4 },
    { q: t.landingFaqQ5, a: t.landingFaqA5 }
  ];

  const stats = [
    { label: t.landingStatDisbursed, value: '₹1,850+ Cr', icon: CreditCard, subtitle: '100% DBT' },
    { label: t.landingStatProcured, value: '4.2 Lakh MT', icon: Scale, subtitle: 'Kharif 2026' },
    { label: t.landingStatFarmers, value: '1,24,000+', icon: Users, subtitle: '38 Districts' },
    { label: t.landingStatTime, value: '18 Mins', icon: Clock, subtitle: 'Gate to Slip' }
  ];

  const sopSteps = [
    { step: '1', title: t.landingSopStage1Title, desc: t.landingSopStage1Desc, icon: FileCheck },
    { step: '2', title: t.landingSopStage2Title, desc: t.landingSopStage2Desc, icon: Calendar },
    { step: '3', title: t.landingSopStage3Title, desc: t.landingSopStage3Desc, icon: Smartphone },
    { step: '4', title: t.landingSopStage4Title, desc: t.landingSopStage4Desc, icon: Scale },
    { step: '5', title: t.landingSopStage5Title, desc: t.landingSopStage5Desc, icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Main Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-800 text-white shadow">
              <Sprout className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  AgriProcure
                </span>
                <span className="rounded bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  KHARIF 2026-27
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {t.landingMandiTagline || 'Direct Grain Procurement & Mandi Token Management System'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            <a href="#how-it-works" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">{t.landingNavHowItWorks || 'How It Works'}</a>
            <a href="#portals" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">{t.landingNavPortals || 'Portals'}</a>
            <a href="#msp-rates" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">{t.landingNavMsp || 'MSP Rates'}</a>
            <a href="#faq" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">{t.landingNavFaq || 'Farmer FAQ'}</a>
          </nav>

          {/* Controls: Language, Theme & Access */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 p-0.5 text-xs font-bold">
              <button
                onClick={() => setLanguage('en')}
                className={`rounded px-2.5 py-1 transition-colors ${language === 'en' ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`rounded px-2.5 py-1 transition-colors ${language === 'ta' ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
              >
                தமிழ்
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`rounded px-2.5 py-1 transition-colors ${language === 'hi' ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
              >
                हिन्दी
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
              title="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}
            </button>

            {/* Login / Register */}
            <button
              onClick={() => navigate('/login')}
              className="hidden sm:inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              {t.landingPortalLogin || 'Portal Login'}
            </button>

            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-900 transition-colors"
            >
              <span>{t.landingFarmerRegistration || 'Farmer Registration'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-emerald-50/60 to-white dark:from-slate-900 dark:to-slate-950 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-md bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 px-3 py-1 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                <Landmark className="h-3.5 w-3.5 text-emerald-800 dark:text-emerald-400" />
                <span>{t.landingHeroBadge || 'Tamil Nadu Civil Supplies Corporation (TNCSC)'}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.2]">
                {t.landingHeroTitle1 || 'Transparent Mandi Procurement.'} <br />
                {t.landingHeroTitle2 || 'Direct MSP Transfer in 24–48 Hours.'}
              </h1>

              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {t.landingHeroDesc || 'Empowering farmers with verified slot booking, electronic moisture assessment, calibrated digital weighment slips, and direct bank account payment transfers (DBT) without intermediaries.'}
              </p>

              {/* Action Button Group */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 px-6 py-3 text-xs font-bold text-white shadow-sm transition-all"
                >
                  <Tractor className="h-4 w-4" />
                  <span>{t.landingHeroRegisterBtn || 'Register Farmer & Book Slot'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                  <Lock className="h-4 w-4 text-slate-500" />
                  <span>{t.landingHeroLoginBtn || 'Officer & Directorate Login'}</span>
                </button>
              </div>

              {/* Official Indicators */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                  <span>{t.landingHeroHighlight1 || '100% Aadhaar DBT Disbursals'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                  <span>{t.landingHeroHighlight2 || 'Electronic Weighbridge Integrated'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                  <span>{t.landingHeroHighlight3 || 'SMS & WhatsApp Token Updates'}</span>
                </div>
              </div>
            </div>

            {/* Right Live Mandi Status Card */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                      {t.landingTelemetryTitle || 'Live Mandi Queue Telemetry'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {t.landingTelemetrySub || 'Centre A – Thanjavur Direct Purchase Centre (DPC)'}
                    </h3>
                  </div>
                  <span className="rounded bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                    OPERATIONAL
                  </span>
                </div>

                {/* Token Display Box */}
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                        {t.landingCurrentServing || 'Current Serving Token'}
                      </span>
                      <div className="text-2xl font-black text-slate-900 dark:text-white">
                        Token #42
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        R. Murugesan • ADT-53 Paddy (3,000 Kg declared)
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="rounded bg-emerald-800 text-white text-[11px] font-bold px-2.5 py-1">
                        Weighbridge 01
                      </span>
                      <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                        Status: Weighing
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200 dark:border-slate-700/60 text-xs">
                    <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Moisture Test</span>
                      <strong className="text-emerald-700 dark:text-emerald-400">{t.landingMoisturePass || '13.8% (Passed)'}</strong>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Quality Grade</span>
                      <strong className="text-slate-800 dark:text-slate-200">{t.landingQualityGradeA || 'Grade A (Fine)'}</strong>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 block">MSP Value</span>
                      <strong className="text-emerald-800 dark:text-emerald-300">{t.landingMspValue || '₹69,600'}</strong>
                    </div>
                  </div>
                </div>

                {/* 1-Click Role Direct Demo Access */}
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 text-center">
                    {t.landingQuickAccess || 'Quick Portal Access'}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleQuickLogin('farmer')}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-700 text-xs font-bold text-slate-800 dark:text-slate-200 text-center"
                    >
                      <Tractor className="h-4 w-4 mx-auto mb-1 text-emerald-700" />
                      <span>{t.roleFarmer}</span>
                    </button>
                    <button
                      onClick={() => handleQuickLogin('officer')}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-700 text-xs font-bold text-slate-800 dark:text-slate-200 text-center"
                    >
                      <Building2 className="h-4 w-4 mx-auto mb-1 text-slate-700 dark:text-slate-300" />
                      <span>{t.roleOfficer}</span>
                    </button>
                    <button
                      onClick={() => handleQuickLogin('admin')}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-700 text-xs font-bold text-slate-800 dark:text-slate-200 text-center"
                    >
                      <Landmark className="h-4 w-4 mx-auto mb-1 text-slate-700 dark:text-slate-300" />
                      <span>{t.roleAdmin}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Statistics Bar */}
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((st, i) => (
              <div key={i} className="border-r last:border-r-0 border-slate-200 dark:border-slate-800 px-2">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {st.value}
                </div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                  {st.label}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {st.subtitle}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step-by-Step Procedure */}
      <section id="how-it-works" className="py-14 sm:py-16 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Standard Operating Procedure (SOP)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {t.landingHowItWorksTitle || '5-Stage Procurement Workflow'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {t.landingHowItWorksSub || 'Clear, transparent steps from farm harvest registration to direct bank account deposit.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {sopSteps.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                      {st.step}
                    </span>
                    <Icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Official MSP Rates Schedule */}
      <section id="msp-rates" className="py-14 bg-slate-100/70 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Government Approved Prices
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {t.landingMspScheduleTitle || 'Minimum Support Price (MSP) Schedule 2026-27'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {t.landingMspScheduleSub || 'Official procurement rates notified by the Department of Food & Public Distribution.'}
              </p>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              * Rates per Quintal (100 Kg) conforming to Fair Average Quality (FAQ) norms.
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/80 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">{t.tableCrop || 'Commodity / Crop'}</th>
                  <th className="py-3 px-4">{t.season || 'Season'}</th>
                  <th className="py-3 px-4">MSP Rate (₹ / Quintal)</th>
                  <th className="py-3 px-4">{t.moisturePercent || 'Moisture Standard'}</th>
                  <th className="py-3 px-4">{t.tableStatus || 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {mspRates.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{r.crop}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{r.season}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700 dark:text-emerald-400 text-sm">{r.mspPerQtl}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{r.moistureLimit}</td>
                    <td className="py-3 px-4">
                      <span className="rounded bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                        {t.statusNormal || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Role-Based Portals */}
      <section id="portals" className="py-14 sm:py-16 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Dedicated User Portals
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {t.landingPortalsTitle || 'Authorized Stakeholder Access'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {t.landingPortalsSub || 'Unified agricultural procurement platform with role-based security access.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Farmer Portal */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <Tractor className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t.roleFarmer} Portal
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Register harvest volumes, choose convenient DPC arrival windows, monitor live mandi token queues, and track Aadhaar DBT payment statuses.
                </p>
                <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                    <span>Self-service 1-hour slot booking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                    <span>Real-time weighbridge call-up alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                    <span>Direct MSP PFMS payment vouchers</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleQuickLogin('farmer')}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 py-2.5 text-xs font-bold text-white shadow-sm transition-colors"
              >
                <span>Enter {t.roleFarmer} Portal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Officer Portal */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t.roleOfficer} Desk
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Operational console for Mandi Superintendents and Intake Officers. Manage live weighbridge queues, record electronic moisture readings, and certify consignments.
                </p>
                <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-700 shrink-0" />
                    <span>1-click Token caller & desk dispatch</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-700 shrink-0" />
                    <span>Electronic weighbridge & tare verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-700 shrink-0" />
                    <span>Field yield anomaly review desk</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleQuickLogin('officer')}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 py-2.5 text-xs font-bold text-white shadow-sm transition-colors"
              >
                <span>Enter {t.roleOfficer} Portal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Admin Portal */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  <Landmark className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  State {t.roleAdmin} Command
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  State-wide procurement dashboard for the Department of Agricultural Marketing & Civil Supplies. Live monitoring across 38 districts with capacity telemetry.
                </p>
                <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-700 shrink-0" />
                    <span>38-District intake velocity monitoring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-700 shrink-0" />
                    <span>MSP disbursal audit & statutory reporting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-700 shrink-0" />
                    <span>State-wide mandi utilization index</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleQuickLogin('admin')}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 py-2.5 text-xs font-bold text-white shadow-sm transition-colors"
              >
                <span>Enter {t.roleAdmin} Portal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-14 sm:py-16 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Assistance & Guidelines
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {t.landingFaqTitle || 'Frequently Asked Questions (FAQ)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {t.landingFaqSub || 'Essential information regarding mandi slot booking, grain quality testing, weighbridges, and direct DBT payments.'}
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-slate-400 text-base font-bold ml-2">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Official Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Sprout className="h-5 w-5 text-emerald-400" />
                <span>AgriProcure</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Direct Agricultural Produce Procurement & Digital Token Management System. An initiative by the Government of Tamil Nadu.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-2">Government Helplines</h4>
              <ul className="space-y-1 text-[11px]">
                <li>Toll Free: 1800-425-7890</li>
                <li>Kisan Call Centre: 1800-180-1551</li>
                <li>PFMS DBT Support: 1800-118-111</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-2">Quick Portals</h4>
              <ul className="space-y-1 text-[11px]">
                <li><button onClick={() => handleQuickLogin('farmer')} className="hover:text-emerald-400">{t.roleFarmer} Portal</button></li>
                <li><button onClick={() => handleQuickLogin('officer')} className="hover:text-emerald-400">{t.roleOfficer} Desk</button></li>
                <li><button onClick={() => handleQuickLogin('admin')} className="hover:text-emerald-400">State {t.roleAdmin} Command</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-2">Regulatory Compliance</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Operated under the Tamil Nadu Civil Supplies Corporation (TNCSC) in accordance with the National Food Security Act (NFSA) and MSP procurement guidelines.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <span>{t.footerRights || '© 2026 Government of Tamil Nadu. All rights reserved.'}</span>
            <span>{t.footerVersion || 'AgriProcure Platform v1.0 • Direct Purchase Centres (DPC) Network'}</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
