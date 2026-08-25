import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockCropData } from '../../data/mockData';
import { RiskGaugeChart } from '../../components/common/SimpleCharts';
import { Badge } from '../../components/common/Badge';
import {
  User,
  MapPin,
  Tractor,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Building,
  Info,
  Sprout
} from 'lucide-react';
import { AnomalyAssessment } from '../../types';

export const RegisterProduce: React.FC = () => {
  const { user, setCurrentTab, addToast, setProduceDraft, t } = useApp();

  const [step, setStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [produceId, setProduceId] = useState<string>('');
  const [anomalyResult, setAnomalyResult] = useState<AnomalyAssessment | null>(null);

  // Form states
  const [personal, setPersonal] = useState({
    name: user.name || 'R. Murugesan',
    phone: user.phone || '+91 98421 76540',
    aadhar: user.aadharNumber || 'XXXX-XXXX-4812',
    village: 'Thiruvaiyaru',
    district: 'Thanjavur',
    state: 'Tamil Nadu'
  });

  const [land, setLand] = useState({
    surveyNumber: '142/3B',
    landAreaAcres: user.landArea || 3.5,
    soilType: 'Alluvial Clay Loam',
    irrigation: 'Cauvery River Canal & Borewell',
    season: 'Kharif'
  });

  const [produce, setProduce] = useState({
    crop: 'Paddy',
    variety: 'Ponni Samba (Grade A)',
    quantityKg: 3000,
    expectedDate: '2026-08-26',
    bankAccount: user.bankAccount || 'SBI 30987123901',
    ifsc: user.ifscCode || 'SBIN0001244'
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const genId = 'PRD-TNJ-2026-' + Math.floor(1000 + Math.random() * 9000);
    setProduceId(genId);

    // AI Anomaly assessment simulation
    const declaredQty = Number(produce.quantityKg);
    const acreage = Number(land.landAreaAcres);
    const yieldPerAcre = Math.round(declaredQty / acreage);
    const historicalAvg = acreage * 850;

    let anomaly: AnomalyAssessment;

    if (declaredQty > 5500 || yieldPerAcre > 1800) {
      anomaly = {
        detected: true,
        riskScore: 87,
        riskLevel: 'HIGH',
        status: 'Verification Required',
        currentQuantityKg: declaredQty,
        historicalAvgKg: historicalAvg,
        landAreaAcres: acreage,
        yieldPerAcre: yieldPerAcre,
        expectedMaxYieldKg: acreage * 2400,
        reason: 'Declared quantity differs significantly from historical procurement pattern.'
      };
    } else {
      anomaly = {
        detected: false,
        riskScore: 18,
        riskLevel: 'LOW',
        status: 'Normal',
        currentQuantityKg: declaredQty,
        historicalAvgKg: historicalAvg,
        landAreaAcres: acreage,
        yieldPerAcre: yieldPerAcre,
        expectedMaxYieldKg: acreage * 2400,
        reason: 'Declared quantity matches historical baseline and land yield parameters.'
      };
    }

    setAnomalyResult(anomaly);
    setProduceDraft({ personal, land, produce, produceId: genId, anomaly });
    setIsSubmitted(true);

    addToast(t.registrationSuccess, `${t.produceIdGenerated}: ${genId}`, 'success');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {t.navRegisterProduce}
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Declare crop harvest and acreage for verified Mandi procurement under MSP
        </p>
      </div>

      {!isSubmitted ? (
        <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          {/* Step Progress Indicators */}
          <div className="grid grid-cols-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-xs font-bold">
            {[
              { num: 1, label: t.stepPersonal },
              { num: 2, label: t.stepLand },
              { num: 3, label: t.stepProduce },
              { num: 4, label: t.stepReview }
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center justify-center gap-2 py-3.5 border-b-2 text-center transition-colors ${
                  step === s.num
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900'
                    : step > s.num
                    ? 'border-emerald-500/50 text-emerald-700 dark:text-emerald-500'
                    : 'border-transparent text-slate-400'
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${
                    step === s.num
                      ? 'bg-emerald-500 text-white'
                      : step > s.num
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-emerald-500" />
                  <span>{t.stepPersonal}</span>
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {t.fullName}
                    </label>
                    <input
                      type="text"
                      value={personal.name}
                      onChange={e => setPersonal({ ...personal, name: e.target.value })}
                      required
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {t.mobileNumber}
                    </label>
                    <input
                      type="text"
                      value={personal.phone}
                      onChange={e => setPersonal({ ...personal, phone: e.target.value })}
                      required
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {t.aadharNo}
                    </label>
                    <input
                      type="text"
                      value={personal.aadhar}
                      onChange={e => setPersonal({ ...personal, aadhar: e.target.value })}
                      required
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {t.village}
                    </label>
                    <input
                      type="text"
                      value={personal.village}
                      onChange={e => setPersonal({ ...personal, village: e.target.value })}
                      required
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {t.district}
                    </label>
                    <input
                      type="text"
                      value={personal.district}
                      onChange={e => setPersonal({ ...personal, district: e.target.value })}
                      required
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {t.stateName}
                    </label>
                    <input
                      type="text"
                      value={personal.state}
                      onChange={e => setPersonal({ ...personal, state: e.target.value })}
                      required
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Land Details */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Tractor className="h-5 w-5 text-emerald-500" />
                  <span>{t.stepLand}</span>
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {t.surveyNumber}
                    </label>
                    <input
                      type="text"
                      value={land.surveyNumber}
                      onChange={e => setLand({ ...land, surveyNumber: e.target.value })}
                      required
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {t.landAreaAcres}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={land.landAreaAcres}
                      onChange={e => setLand({ ...land, landAreaAcres: Number(e.target.value) })}
                      required
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {t.soilType}
                    </label>
                    <input
                      type="text"
                      value={land.soilType}
                      onChange={e => setLand({ ...land, soilType: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {t.irrigationSource}
                    </label>
                    <input
                      type="text"
                      value={land.irrigation}
                      onChange={e => setLand({ ...land, irrigation: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {t.season}
                    </label>
                    <select
                      value={land.season}
                      onChange={e => setLand({ ...land, season: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                    >
                      <option value="Kharif">{t.farmerSeasonKharif}</option>
                      <option value="Rabi">{t.farmerSeasonRabi}</option>
                      <option value="Zaid">{t.farmerSeasonZaid}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Produce Details */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-emerald-500" />
                  <span>{t.stepProduce}</span>
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {t.cropName}
                    </label>
                    <select
                      value={produce.crop}
                      onChange={e => setProduce({ ...produce, crop: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                    >
                      {mockCropData.map(c => (
                        <option key={c.id} value={c.name}>
                          {c.name} (MSP: ₹{c.mspPerQuintal}/q)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {t.cropVariety}
                    </label>
                    <input
                      type="text"
                      value={produce.variety}
                      onChange={e => setProduce({ ...produce, variety: e.target.value })}
                      required
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {t.declaredQuantity}
                    </label>
                    <input
                      type="number"
                      min="100"
                      step="50"
                      value={produce.quantityKg}
                      onChange={e => setProduce({ ...produce, quantityKg: Number(e.target.value) })}
                      required
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Tip: Enter 7,000 kg to trigger and test the Anomaly Detection check.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {t.expectedDate}
                    </label>
                    <input
                      type="date"
                      value={produce.expectedDate}
                      onChange={e => setProduce({ ...produce, expectedDate: e.target.value })}
                      required
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {t.bankAccountNo} (DBT)
                    </label>
                    <input
                      type="text"
                      value={produce.bankAccount}
                      onChange={e => setProduce({ ...produce, bankAccount: e.target.value })}
                      required
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {t.bankIfsc}
                    </label>
                    <input
                      type="text"
                      value={produce.ifsc}
                      onChange={e => setProduce({ ...produce, ifsc: e.target.value })}
                      required
                      className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span>{t.stepReview}</span>
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4">
                    <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] text-emerald-600">
                      Personal
                    </h4>
                    <p className="mt-2 font-bold text-slate-800 dark:text-slate-200">{personal.name}</p>
                    <p className="text-slate-500">{personal.phone}</p>
                    <p className="text-slate-500">{personal.village}, {personal.district}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4">
                    <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] text-emerald-600">
                      Land & Season
                    </h4>
                    <p className="mt-2 font-bold text-slate-800 dark:text-slate-200">{land.landAreaAcres} Acres</p>
                    <p className="text-slate-500">Patta: {land.surveyNumber}</p>
                    <p className="text-slate-500">Season: {land.season}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4">
                    <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] text-emerald-600">
                      Produce & DBT
                    </h4>
                    <p className="mt-2 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      {produce.quantityKg.toLocaleString('en-IN')} kg {produce.crop}
                    </p>
                    <p className="text-slate-500">A/C: {produce.bankAccount}</p>
                    <p className="text-slate-500">Date: {produce.expectedDate}</p>
                  </div>
                </div>

                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>{t.farmerCertifyDeclaration}</span>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{t.btnBack}</span>
                </button>
              ) : <div />}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-md shadow-emerald-500/20"
                >
                  <span>{t.btnContinue}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-500 hover:to-teal-400"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{t.submitRegistration}</span>
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        /* Anomaly Result & Success View */
        <div className="space-y-6 animate-scale-up">
          {/* Success Banner */}
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/40 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="mt-3 text-xl font-black text-slate-900 dark:text-white">
              {t.registrationSuccess}
            </h3>
            <p className="mt-1 font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300">
              {t.produceIdGenerated}: {produceId}
            </p>
          </div>

          {/* Anomaly Result Card */}
          {anomalyResult && (
            <div className={`overflow-hidden rounded-3xl border p-6 sm:p-8 ${
              anomalyResult.detected
                ? 'border-amber-500/40 bg-amber-50/40 dark:bg-amber-950/20 shadow-lg shadow-amber-500/5'
                : 'border-emerald-500/30 bg-white dark:bg-slate-900'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <Sparkles className={`h-5 w-5 ${anomalyResult.detected ? 'text-amber-500' : 'text-emerald-500'}`} />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {t.anomalyTitle}
                  </h3>
                </div>
                <Badge
                  label={anomalyResult.status}
                  variant={anomalyResult.detected ? 'verification' : 'cleared'}
                  size="md"
                  dot
                />
              </div>

              <div className="my-6 grid grid-cols-1 items-center gap-6 md:grid-cols-12">
                {/* Risk Score Gauge (5 cols) */}
                <div className="md:col-span-5 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200/80 dark:border-slate-800 pb-4 md:pb-0 md:pr-4">
                  <RiskGaugeChart
                    score={anomalyResult.riskScore}
                    statusText={anomalyResult.status}
                  />
                </div>

                {/* Metrics Breakdown (7 cols) */}
                <div className="md:col-span-7 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Declared Quantity
                      </span>
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        {anomalyResult.currentQuantityKg.toLocaleString('en-IN')} kg
                      </span>
                    </div>

                    <div className="rounded-xl bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {t.historicalAverage}
                      </span>
                      <span className="text-base font-black text-slate-700 dark:text-slate-300">
                        {anomalyResult.historicalAvgKg.toLocaleString('en-IN')} kg
                      </span>
                    </div>

                    <div className="rounded-xl bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {t.landDeclared}
                      </span>
                      <span className="text-base font-black text-slate-700 dark:text-slate-300">
                        {anomalyResult.landAreaAcres} Acres
                      </span>
                    </div>

                    <div className="rounded-xl bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {t.expectedMax}
                      </span>
                      <span className="text-base font-black text-slate-700 dark:text-slate-300">
                        {anomalyResult.expectedMaxYieldKg.toLocaleString('en-IN')} kg
                      </span>
                    </div>
                  </div>

                  {/* AI Explanation Notice */}
                  <div className={`rounded-xl p-3.5 border ${
                    anomalyResult.detected
                      ? 'bg-amber-100/60 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  }`}>
                    <div className="flex items-start gap-2.5">
                      {anomalyResult.detected ? (
                        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-bold text-xs">
                          {anomalyResult.detected ? t.anomalyMessage : t.anomalySafeMessage}
                        </p>
                        <p className="mt-1 text-[11px] opacity-90 leading-relaxed">
                          {anomalyResult.reason}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span>{t.manualReviewNote}</span>
                  </p>
                </div>
              </div>

              {/* Action Button to proceed to Slot Booking */}
              <div className="mt-6 flex justify-end border-t border-slate-200/80 dark:border-slate-800 pt-4">
                <button
                  onClick={() => setCurrentTab('slots')}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-500 hover:to-teal-400 transition-all active:scale-95"
                >
                  <span>{t.nextStepSlot}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
