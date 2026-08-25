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
  CheckCircle2,
  Phone,
  User,
  CreditCard,
  MapPin,
  FileText,
  Lock,
  Sun,
  Moon,
  Landmark
} from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, theme, toggleTheme, language, setLanguage, addToast } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [district, setDistrict] = useState('Thanjavur');
  const [taluk, setTaluk] = useState('Thiruvaiyaru');
  const [village, setVillage] = useState('Kalyanapuram');
  const [landArea, setLandArea] = useState('3.5');
  const [pattaNumber, setPattaNumber] = useState('PTA-2026-9812');
  const [primaryCrop, setPrimaryCrop] = useState('Paddy (ADT-53)');
  const [bankName, setBankName] = useState('State Bank of India');
  const [accountNumber, setAccountNumber] = useState('30981234567');
  const [ifscCode, setIfscCode] = useState('SBIN0001234');
  const [password, setPassword] = useState('farmer123');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!fullName.trim() || !phone.trim()) {
        addToast('Missing Details', 'Please fill in your full name and mobile number', 'error');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!village.trim() || !landArea.trim()) {
        addToast('Missing Details', 'Please enter your village and land acreage', 'error');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      addToast(
        'Registration Completed',
        `Farmer record created for ${fullName || 'Farmer'}. Farmer ID: F-TN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        'success'
      );

      // Log in the user into context
      login(selectedRole, phone || '+91 98421 76540');
      navigate(`/${selectedRole}`);
    }, 600);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      
      {/* Official Top Bar */}
      <div className="border-b border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900/90 text-[11px] font-medium text-slate-600 dark:text-slate-400 py-1.5 px-4 sm:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <span>Government of Tamil Nadu • தமிழ்நாடு அரசு | TNCSC</span>
          <span>Form A-1: Farmer Produce & Direct Benefit Transfer Registration</span>
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
                FARMER REGISTRATION
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Kharif Season 2026-27
            </p>
          </div>
        </div>

        {/* Controls */}
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
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-xl">
          
          {/* Back to Home / Login link */}
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-800 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Public Portal</span>
            </button>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Already registered?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-emerald-800 dark:text-emerald-400 font-bold hover:underline"
              >
                Sign In
              </button>
            </span>
          </div>

          {/* Registration Card */}
          <div className="rounded-xl border border-slate-300 bg-white p-6 sm:p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            
            {/* Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Farmer Onboarding Application
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Link your land & bank details for verified DPC slot booking and direct MSP payments.
                  </p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-800 dark:text-emerald-300">
                  <Landmark className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Stepper Indicator */}
            <div className="grid grid-cols-3 gap-2 mb-6 text-center">
              {[
                { s: 1, label: '1. Personal Info' },
                { s: 2, label: '2. Land & Harvest' },
                { s: 3, label: '3. DBT Bank Info' }
              ].map(st => (
                <div
                  key={st.s}
                  className={`flex flex-col items-center gap-1 pb-2 border-b-2 transition-all ${
                    step === st.s
                      ? 'border-emerald-800 text-emerald-900 dark:border-emerald-500 dark:text-emerald-300 font-bold'
                      : step > st.s
                      ? 'border-emerald-600/60 text-emerald-700/80 dark:text-emerald-400/80 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400 font-normal'
                  }`}
                >
                  <span className="text-xs">{st.label}</span>
                </div>
              ))}
            </div>

            {/* Form Steps */}
            <form onSubmit={handleNext} className="space-y-4">
              {/* STEP 1: Personal Details */}
              {step === 1 && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Full Name (as per Aadhaar Card) *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. R. Murugesan"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-9 pr-3 text-xs font-semibold focus:border-emerald-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Mobile Number (for SMS & Token Notifications) *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98421 76540"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-9 pr-3 text-xs font-semibold focus:border-emerald-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Aadhaar Number (Virtual ID)
                      </label>
                      <input
                        type="text"
                        placeholder="XXXX-XXXX-7890"
                        value={aadhaar}
                        onChange={e => setAadhaar(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-3 text-xs font-semibold focus:border-emerald-800 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Portal Security PIN / Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="password"
                          placeholder="••••••"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-9 pr-3 text-xs font-semibold focus:border-emerald-800 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Land & Crop Information */}
              {step === 2 && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        District *
                      </label>
                      <select
                        value={district}
                        onChange={e => setDistrict(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-3 text-xs font-semibold focus:border-emerald-800 focus:outline-none"
                      >
                        <option value="Thanjavur">Thanjavur</option>
                        <option value="Tiruvarur">Tiruvarur</option>
                        <option value="Nagapattinam">Nagapattinam</option>
                        <option value="Madurai">Madurai</option>
                        <option value="Trichy">Trichy</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Taluk *
                      </label>
                      <input
                        type="text"
                        value={taluk}
                        onChange={e => setTaluk(e.target.value)}
                        placeholder="Thiruvaiyaru"
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-3 text-xs font-semibold focus:border-emerald-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Village *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={village}
                          onChange={e => setVillage(e.target.value)}
                          placeholder="Kalyanapuram"
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-9 pr-3 text-xs font-semibold focus:border-emerald-800 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Cultivated Land (Acres) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={landArea}
                        onChange={e => setLandArea(e.target.value)}
                        placeholder="3.5"
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-3 text-xs font-semibold focus:border-emerald-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Patta / Chitta Document No.
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="text"
                          value={pattaNumber}
                          onChange={e => setPattaNumber(e.target.value)}
                          placeholder="PTA-2026-9812"
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-9 pr-3 text-xs font-semibold focus:border-emerald-800 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Primary Crop Variety
                      </label>
                      <select
                        value={primaryCrop}
                        onChange={e => setPrimaryCrop(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-3 text-xs font-semibold focus:border-emerald-800 focus:outline-none"
                      >
                        <option value="Paddy (ADT-53)">Paddy (ADT-53 - Fine)</option>
                        <option value="Paddy (CO-51)">Paddy (CO-51 - Common)</option>
                        <option value="Ragi / Millets">Ragi / Millets</option>
                        <option value="Maize">Maize</option>
                        <option value="Black Gram (Pulses)">Black Gram (Pulses)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Bank Account for DBT */}
              {step === 3 && (
                <div className="space-y-3.5">
                  <div className="rounded-lg border border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950 p-3 text-xs text-emerald-900 dark:text-emerald-300">
                    <p className="font-bold mb-0.5 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-800 dark:text-emerald-400" />
                      Direct Benefit Transfer (DBT) Mandate
                    </p>
                    <p className="text-[11px] leading-relaxed text-emerald-800/90 dark:text-emerald-300/90">
                      Procurement amount will be deposited directly into this Aadhaar-linked account within 24–48 hours of mandi weighment.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      placeholder="State Bank of India"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-3 text-xs font-semibold focus:border-emerald-800 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Account Number *
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={accountNumber}
                          onChange={e => setAccountNumber(e.target.value)}
                          placeholder="30981234567"
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-9 pr-3 text-xs font-semibold focus:border-emerald-800 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        IFSC Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={ifscCode}
                        onChange={e => setIfscCode(e.target.value)}
                        placeholder="SBIN0001234"
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-3 text-xs font-semibold uppercase focus:border-emerald-800 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    Previous Step
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 py-2.5 text-xs font-bold text-white shadow transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting Application...</span>
                  ) : step === 3 ? (
                    <>
                      <span>Submit Farmer Registration</span>
                      <CheckCircle2 className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>Proceed to Step 0{step + 1}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
        © 2026 AgriProcure • Department of Food and Consumer Protection, Government of Tamil Nadu
      </footer>
    </div>
  );
};
