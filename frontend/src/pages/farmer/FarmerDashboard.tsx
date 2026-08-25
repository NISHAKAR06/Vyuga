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
  CheckCircle2
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Farmer Greeting & Info Bar */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                REGISTERED FARMER
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">ID: {user.id}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {greeting()}, {user.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 pt-0.5">
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>{user.location}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 font-medium">
                <Tractor className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>{user.landArea} Acres Land</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-700 dark:bg-emerald-400" />
                <span>Crop: {user.crop || 'Paddy (Samba)'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setCurrentTab('register_produce')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{t.registerNewProduce}</span>
            </button>
            <button
              onClick={() => setCurrentTab('slots')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Calendar className="h-4 w-4 text-emerald-800 dark:text-emerald-400" />
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
          iconColor="text-emerald-800 dark:text-emerald-400"
          tooltipText="Declared Kharif harvest ready for weighbridge intake"
        />

        {/* KPI 2: Selected Slot */}
        <KPICard
          title={t.selectedSlot}
          value={activeFarmerToken ? activeFarmerToken.slotTimeWindow.split('–')[0].trim() : '10:00 AM'}
          subtitle={activeFarmerToken ? activeFarmerToken.centreName.split('–')[0].trim() : 'Centre A'}
          badge={{ text: activeFarmerToken ? activeFarmerToken.slotDate : '26 Aug', type: 'info' }}
          icon={Calendar}
          iconColor="text-blue-700 dark:text-blue-400"
          tooltipText="Confirmed procurement intake slot chosen by farmer"
        />

        {/* KPI 3: Queue Position */}
        <KPICard
          title={t.queuePosition}
          value={activeFarmerToken ? `Token #${activeFarmerToken.tokenNumber}` : 'No Token'}
          subtitle={activeFarmerToken ? `${activeFarmerToken.farmersAhead} Farmers Ahead` : 'Register to get token'}
          badge={{ text: activeFarmerToken ? `${activeFarmerToken.farmersAhead} Ahead` : 'Waiting', type: 'warning' }}
          icon={Users}
          iconColor="text-amber-700 dark:text-amber-400"
          tooltipText="Live position in the Mandi weighbridge intake queue"
          onClick={() => setCurrentTab('live_queue')}
        />

        {/* KPI 4: Estimated Waiting Time */}
        <KPICard
          title={t.aiWaitingTime}
          value={activeFarmerToken ? `${activeFarmerToken.estimatedWaitMinutes} min` : '24 min'}
          subtitle="Mandi Intake Velocity"
          badge={{ text: t.aiPrediction, type: 'success' }}
          icon={Clock}
          iconColor="text-slate-700 dark:text-slate-300"
          tooltipText={t.aiWaitTooltip}
          highlight={true}
          onClick={() => setCurrentTab('live_queue')}
        />
      </div>

      {/* Main Grid: Active Token + Wait Timer */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Active Token Card (5 cols) */}
        <div className="lg:col-span-5">
          {activeFarmerToken ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    GATE PASS
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t.tokenCardTitle}
                  </h3>
                </div>
                <Badge label={activeFarmerToken.status} variant="completed" size="sm" dot />
              </div>

              {/* Token Number Display */}
              <div className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    TOKEN NUMBER
                  </span>
                  <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    #{activeFarmerToken.tokenNumber}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    ID: {activeFarmerToken.produceId}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg bg-white dark:bg-slate-900 p-2 shadow-sm border border-slate-200 dark:border-slate-800">
                  <QrCode className="h-12 w-12 text-slate-800 dark:text-white" />
                  <span className="text-[8px] font-mono text-slate-500 mt-0.5">DPC VERIFIED</span>
                </div>
              </div>

              {/* Booking Info */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Centre</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeFarmerToken.centreName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Date & Slot</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {activeFarmerToken.slotDate} ({activeFarmerToken.slotTimeWindow})
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 dark:text-slate-400">Declared Quantity</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-400">
                    {activeFarmerToken.declaredQuantityKg.toLocaleString('en-IN')} kg ({activeFarmerToken.crop})
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setCurrentTab('live_queue')}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-emerald-800 dark:hover:bg-emerald-900 transition-colors shadow-sm"
                >
                  <span>{t.viewLiveQueue}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center bg-white dark:bg-slate-900 h-full">
              <Calendar className="h-9 w-9 text-slate-400 mb-2" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Active Slot Booked</h4>
              <p className="mt-1 text-xs text-slate-500 max-w-xs">
                Register your produce and choose an available time slot to generate your official token.
              </p>
              <button
                onClick={() => setCurrentTab('register_produce')}
                className="mt-4 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-900 transition-colors"
              >
                Register Produce
              </button>
            </div>
          )}
        </div>

        {/* Wait Timer Card (7 cols) */}
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
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {t.procurementStatusTitle}
            </h3>
          </div>
          <button
            onClick={() => setCurrentTab('procurement_status')}
            className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline"
          >
            View Detailed Timeline →
          </button>
        </div>

        <Stepper currentStage={activeFarmerToken ? activeFarmerToken.stage : 'waiting'} />
      </div>
    </div>
  );
};
