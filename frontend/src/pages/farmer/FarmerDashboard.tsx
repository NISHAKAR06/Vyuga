import React from 'react';
import { useApp } from '../../context/AppContext';
import { KPICard } from '../../components/common/KPICard';
import { CircularTimer } from '../../components/common/CircularTimer';
import { Stepper } from '../../components/common/Stepper';
import { Badge } from '../../components/common/Badge';
import {
  Tractor,
  Calendar,
  Users,
  Clock,
  PlusCircle,
  QrCode,
  ArrowRight,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const { user, activeFarmerToken, setCurrentTab, t, liveQueue } = useApp();

  const nowServingToken = liveQueue.find(q => q.status === 'Now Serving');

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.greetingMorning;
    if (hour < 17) return t.greetingAfternoon;
    return t.greetingEvening;
  };

  return (
    <div className="space-y-6">
      {/* Farmer Greeting & Info Bar */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-600/15 via-teal-500/10 to-transparent p-6 dark:bg-emerald-950/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                Kisan Member
              </span>
              <span className="text-xs text-slate-400">ID: {user.id}</span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {greeting()}, {user.name}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                <span>{user.location}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Tractor className="h-3.5 w-3.5 text-emerald-500" />
                <span>{user.landArea} Acres Land</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Crop: {user.crop || 'Paddy (Samba)'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setCurrentTab('register_produce')}
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-500 transition-all active:scale-95"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{t.registerNewProduce}</span>
            </button>
            <button
              onClick={() => setCurrentTab('slots')}
              className="flex items-center gap-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              <Calendar className="h-4 w-4 text-emerald-500" />
              <span>{t.bookSlotNow}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* KPI 1: Current Procurement */}
        <KPICard
          title={t.currentProcurement}
          value="3,000 kg"
          subtitle="Paddy (Ponni Samba)"
          badge={{ text: activeFarmerToken ? t.slotBooked : 'Pending', type: 'success' }}
          icon={Tractor}
          iconColor="text-emerald-500"
          tooltipText="Declared Kharif harvest ready for weighbridge intake"
        />

        {/* KPI 2: Selected Slot */}
        <KPICard
          title={t.selectedSlot}
          value={activeFarmerToken ? activeFarmerToken.slotTimeWindow.split('–')[0].trim() : '10:00 AM'}
          subtitle={activeFarmerToken ? activeFarmerToken.centreName.split('–')[0].trim() : 'Centre A'}
          badge={{ text: activeFarmerToken ? activeFarmerToken.slotDate : '26 Aug', type: 'info' }}
          icon={Calendar}
          iconColor="text-blue-500"
          tooltipText="Confirmed procurement intake slot chosen by farmer"
        />

        {/* KPI 3: Queue Position */}
        <KPICard
          title={t.queuePosition}
          value={activeFarmerToken ? `Token #${activeFarmerToken.tokenNumber}` : 'No Token'}
          subtitle={activeFarmerToken ? `${activeFarmerToken.farmersAhead} Farmers Ahead` : 'Register to get token'}
          badge={{ text: activeFarmerToken ? `${activeFarmerToken.farmersAhead} Ahead` : 'Waiting', type: 'warning' }}
          icon={Users}
          iconColor="text-amber-500"
          tooltipText="Live position in the Mandi weighbridge intake queue"
          onClick={() => setCurrentTab('live_queue')}
        />

        {/* KPI 4: AI Waiting Time */}
        <KPICard
          title={t.aiWaitingTime}
          value={activeFarmerToken ? `${activeFarmerToken.estimatedWaitMinutes} min` : '24 min'}
          subtitle="Dynamic Queue Model"
          badge={{ text: t.aiPrediction, type: 'success' }}
          icon={Sparkles}
          iconColor="text-purple-500"
          tooltipText={t.aiWaitTooltip}
          highlight={true}
          onClick={() => setCurrentTab('live_queue')}
        />
      </div>

      {/* Main Grid: Active Token + AI Wait Timer */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Active Token Card (5 cols) */}
        <div className="lg:col-span-5">
          {activeFarmerToken ? (
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-xs font-black text-emerald-700 dark:text-emerald-300">
                    PASS
                  </span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {t.tokenCardTitle}
                  </h3>
                </div>
                <Badge label={activeFarmerToken.status} variant="completed" size="sm" dot />
              </div>

              {/* Token Number Display */}
              <div className="my-5 flex items-center justify-between rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-50 dark:to-slate-800/50 p-5 border border-emerald-500/20">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    TOKEN NUMBER
                  </span>
                  <div className="text-4xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                    #{activeFarmerToken.tokenNumber}
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                    ID: {activeFarmerToken.produceId}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-slate-900 p-2.5 shadow-sm border border-slate-100 dark:border-slate-800">
                  <QrCode className="h-16 w-16 text-slate-800 dark:text-white" />
                  <span className="text-[9px] font-mono text-slate-400 mt-1">VERIFIED QR</span>
                </div>
              </div>

              {/* Booking Info */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-400">Centre</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{activeFarmerToken.centreName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-400">Date & Slot</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {activeFarmerToken.slotDate} ({activeFarmerToken.slotTimeWindow})
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Declared Quantity</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {activeFarmerToken.declaredQuantityKg.toLocaleString('en-IN')} kg ({activeFarmerToken.crop})
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <button
                  onClick={() => setCurrentTab('live_queue')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors shadow-sm"
                >
                  <span>{t.viewLiveQueue}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center bg-slate-50/50 dark:bg-slate-900/40">
              <Calendar className="h-10 w-10 text-slate-400 mb-2" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Active Slot Booked</h4>
              <p className="mt-1 text-xs text-slate-500 max-w-xs">
                Register your produce and choose an available time slot to generate your official token.
              </p>
              <button
                onClick={() => setCurrentTab('register_produce')}
                className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500"
              >
                Register Produce
              </button>
            </div>
          )}
        </div>

        {/* AI Waiting Time Prediction Card (7 cols) */}
        <div className="lg:col-span-7">
          <CircularTimer
            waitMinutes={activeFarmerToken ? activeFarmerToken.estimatedWaitMinutes : 24}
            tokenNumber={activeFarmerToken ? activeFarmerToken.tokenNumber : 47}
            nowServingNumber={nowServingToken ? nowServingToken.tokenNumber : 41}
            farmersAhead={activeFarmerToken ? activeFarmerToken.farmersAhead : 6}
            tooltipText={t.aiWaitTooltip}
            onViewQueue={() => setCurrentTab('live_queue')}
          />
        </div>
      </div>

      {/* Procurement Journey Stepper Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.procurementStatusTitle}
            </h3>
          </div>
          <button
            onClick={() => setCurrentTab('procurement_status')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            View Detailed Timeline →
          </button>
        </div>

        <Stepper currentStage={activeFarmerToken ? activeFarmerToken.stage : 'waiting'} />
      </div>
    </div>
  );
};
