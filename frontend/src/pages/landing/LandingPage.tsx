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
    { crop: 'Paddy (Grade A / Fine)', season: 'Kharif 2026-27', mspPerQtl: '₹2,320', moistureLimit: 'Max 17.0%' },
    { crop: 'Paddy (Common)', season: 'Kharif 2026-27', mspPerQtl: '₹2,300', moistureLimit: 'Max 17.0%' },
    { crop: 'Ragi / Finger Millet', season: 'Kharif 2026-27', mspPerQtl: '₹4,290', moistureLimit: 'Max 14.0%' },
    { crop: 'Maize (Hybrid)', season: 'Kharif 2026-27', mspPerQtl: '₹2,225', moistureLimit: 'Max 14.0%' },
    { crop: 'Black Gram (Urad)', season: 'Kharif 2026-27', mspPerQtl: '₹7,400', moistureLimit: 'Max 12.0%' }
  ];

  const faqs = [
    {
      q: 'How does the AgriProcure slot booking system work for farmers?',
      a: 'Farmers select an available 1-hour arrival window at their assigned Mandi or Direct Purchase Centre (DPC). The automated scheduling system balances truck arrivals evenly, reducing mandi wait times from 14+ hours to under 25 minutes.'
    },
    {
      q: 'How is grain moisture, quality, and MSP price assessed?',
      a: 'Centres utilize standardized electronic moisture meters and calibrated digital weighbridges. Prices are directly applied according to the official Government MSP schedule (Grade A / Common) with zero middleman deductions.'
    },
    {
      q: 'When is the payment credited to the farmer’s account?',
      a: 'Following electronic weighment and digital slip generation, payment orders are processed directly through the Public Financial Management System (PFMS / DBT) to the farmer’s Aadhaar-linked bank account within 24 to 48 hours.'
    },
    {
      q: 'Can farmers check live token queues before arriving at the Mandi?',
      a: 'Yes. Farmers can view the live token queue directly from this portal or receive automated SMS and WhatsApp token call-up alerts when their arrival slot is called.'
    },
    {
      q: 'What documents are required for produce registration?',
      a: 'Farmers require their Aadhaar Card, Land Record verification (Patta / Chitta number), and bank passbook linked with Aadhaar for Direct Benefit Transfer.'
    }
  ];

  const stats = [
    { label: 'Direct MSP Disbursed', value: '₹1,850+ Cr', icon: CreditCard, subtitle: '100% via DBT' },
    { label: 'Grain Procured', value: '4.2 Lakh MT', icon: Scale, subtitle: 'Kharif 2026 Season' },
    { label: 'Registered Farmers', value: '1,24,000+', icon: Users, subtitle: 'Across 38 Districts' },
    { label: 'Avg Mandi Processing Time', value: '18 Mins', icon: Clock, subtitle: 'Gate to Payment Slip' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      
      {/* Official Government Top Bar */}
      <div className="border-b border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900/90 text-[11px] font-medium text-slate-600 dark:text-slate-400 py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Government of Tamil Nadu • தமிழ்நாடு அரசு
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline">Department of Food, Civil Supplies and Consumer Protection</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#msp-rates" className="hover:text-emerald-700 dark:hover:text-emerald-400">Official MSP Rates</a>
            <span>•</span>
            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              <PhoneCall className="h-3 w-3 text-emerald-600" />
              Toll Free: 1800-425-7890
            </span>
          </div>
        </div>
      </div>

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
                Direct Grain Procurement & Mandi Token Management System
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            <a href="#how-it-works" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">How It Works</a>
            <a href="#portals" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Portals</a>
            <a href="#msp-rates" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">MSP Rates</a>
            <a href="#faq" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Farmer FAQ</a>
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
              Portal Login
            </button>

            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-900 transition-colors"
            >
              <span>Farmer Registration</span>
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
                <span>Tamil Nadu Civil Supplies Corporation (TNCSC)</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.2]">
                Transparent Mandi Procurement. <br />
                Direct MSP Transfer in 24–48 Hours.
              </h1>

              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Empowering farmers with verified slot booking, electronic moisture assessment, calibrated digital weighment slips, and direct bank account payment transfers (DBT) without intermediaries.
              </p>

              {/* Action Button Group */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 px-6 py-3 text-xs font-bold text-white shadow-sm transition-all"
                >
                  <Tractor className="h-4 w-4" />
                  <span>Register Farmer & Book Slot</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                  <Lock className="h-4 w-4 text-slate-500" />
                  <span>Officer & Directorate Login</span>
                </button>
              </div>

              {/* Official Indicators */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                  <span>100% Aadhaar DBT Disbursals</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                  <span>Electronic Weighbridge Integrated</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                  <span>SMS & WhatsApp Token Updates</span>
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
                      Live Mandi Queue Telemetry
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Centre A – Thanjavur Direct Purchase Centre (DPC)
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
                        Current Serving Token
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
                      <strong className="text-emerald-700 dark:text-emerald-400">13.8% (Passed)</strong>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Quality Grade</span>
                      <strong className="text-slate-800 dark:text-slate-200">Grade A (Fine)</strong>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 block">MSP Value</span>
                      <strong className="text-emerald-800 dark:text-emerald-300">₹69,600</strong>
                    </div>
                  </div>
                </div>

                {/* 1-Click Role Direct Demo Access */}
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 text-center">
                    Quick Portal Access
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleQuickLogin('farmer')}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-700 text-xs font-bold text-slate-800 dark:text-slate-200 text-center"
                    >
                      <Tractor className="h-4 w-4 mx-auto mb-1 text-emerald-700" />
                      <span>Farmer</span>
                    </button>
                    <button
                      onClick={() => handleQuickLogin('officer')}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-700 text-xs font-bold text-slate-800 dark:text-slate-200 text-center"
                    >
                      <Building2 className="h-4 w-4 mx-auto mb-1 text-slate-700 dark:text-slate-300" />
                      <span>Mandi Officer</span>
                    </button>
                    <button
                      onClick={() => handleQuickLogin('admin')}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-700 text-xs font-bold text-slate-800 dark:text-slate-200 text-center"
                    >
                      <Landmark className="h-4 w-4 mx-auto mb-1 text-slate-700 dark:text-slate-300" />
                      <span>Directorate</span>
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
              5-Stage Procurement Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Clear, transparent steps from farm harvest registration to direct bank account deposit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: 'Step 1',
                title: 'Produce Registration',
                desc: 'Farmer submits crop variety, land patta/chitta details, and declared quantity.',
                icon: FileCheck
              },
              {
                step: 'Step 2',
                title: 'Slot Selection',
                desc: 'Farmer picks an available 1-hour arrival window at the designated centre.',
                icon: Calendar
              },
              {
                step: 'Step 3',
                title: 'Queue & Gate Entry',
                desc: 'Digital token allocated with live tracking and SMS call-up notification.',
                icon: Smartphone
              },
              {
                step: 'Step 4',
                title: 'Moisture & Weighment',
                desc: 'Standard electronic moisture test and automated weighbridge gross-tare recording.',
                icon: Scale
              },
              {
                step: 'Step 5',
                title: 'Direct Bank Transfer',
                desc: 'Government MSP amount credited directly to Aadhaar-linked bank account in 24–48h.',
                icon: CreditCard
              },
            ].map((st, idx) => {
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
                Minimum Support Price (MSP) Schedule 2026-27
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Official procurement rates notified by the Department of Food & Public Distribution.
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
                  <th className="py-3 px-4">Commodity / Crop</th>
                  <th className="py-3 px-4">Season</th>
                  <th className="py-3 px-4">MSP Rate (₹ / Quintal)</th>
                  <th className="py-3 px-4">Moisture Standard</th>
                  <th className="py-3 px-4">Status</th>
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
                        Active
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
              Authorized Stakeholder Access
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Farmer Portal */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                  <Tractor className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Farmer Portal (விவசாயி உள்நுழைவு)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Available in Tamil, Hindi & English. Register crops, select DPC time-slots, track token position live, and view payment disbursement records.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Slot selection at nearest DPC centre</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Live digital token tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                    <span>PFMS / DBT bank payment status</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleQuickLogin('farmer')}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 px-4 py-2.5 text-xs font-bold text-white transition-colors"
              >
                <span>Enter Farmer Portal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Mandi Officer Portal */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Procurement Officer Desk
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Terminal for direct purchase centre officers to manage gate arrivals, record electronic moisture tests, operate digital weighbridge, and issue procurement certificates.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-700" />
                    <span>Gate token check-in & counter dispatch</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-700" />
                    <span>Moisture & quality grade entry</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-700" />
                    <span>Weighment slip & payment generation</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleQuickLogin('officer')}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition-colors"
              >
                <span>Enter Officer Desk</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Directorate & Admin */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold">
                  <Landmark className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  State Directorate Overview
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Executive dashboard for the Food & Civil Supplies Department. State-wide mandi capacity monitoring, district-wise target quotas, and cryptographic audit ledger.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-700" />
                    <span>State & district harvest intake telemetry</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-700" />
                    <span>Tamper-evident audit & anomaly review</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-700" />
                    <span>MSP price schedule configuration</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleQuickLogin('admin')}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition-colors"
              >
                <span>Enter Directorate Overview</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="py-14 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Farmer Help & Guidance
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="h-4 w-4 text-emerald-700 flex-shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronRight
                    className={`h-4 w-4 text-slate-400 transition-transform duration-150 ${
                      activeFaq === index ? 'rotate-90 text-emerald-700' : ''
                    }`}
                  />
                </button>
                {activeFaq === index && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950 py-8 text-xs text-slate-600 dark:text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-emerald-800 flex items-center justify-center text-white">
                <Sprout className="h-4 w-4" />
              </div>
              <span className="font-bold text-slate-900 dark:text-slate-200">
                AgriProcure • தமிழ்நாடு நுகர்பொருள் வாணிபக் கழகம்
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Toll Free Farmer Helpline: 1800-425-7890</span>
              <span>•</span>
              <span>Kharif Season 2026-27</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-4 text-center sm:text-left">
            © 2026 Tamil Nadu Civil Supplies Corporation (TNCSC), Government of Tamil Nadu. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
