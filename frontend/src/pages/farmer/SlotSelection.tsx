import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { SlotItem } from '../../types';
import {
  Calendar,
  Clock,
  Building,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  QrCode,
  Users,
  MapPin,
  Phone
} from 'lucide-react';

export const SlotSelection: React.FC = () => {
  const {
    centres,
    slots,
    bookSlotAndGenerateToken,
    activeFarmerToken,
    produceDraft,
    setCurrentTab,
    t
  } = useApp();

  const [selectedCentreId, setSelectedCentreId] = useState<string>(centres[0].id);
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-26');
  const [selectedSlot, setSelectedSlot] = useState<SlotItem | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [newlyGeneratedToken, setNewlyGeneratedToken] = useState<any>(null);

  const selectedCentre = centres.find(c => c.id === selectedCentreId) || centres[0];
  const centreSlots = slots.filter(s => s.centreId === selectedCentreId || s.centreId === 'cnt-a');

  const handleOpenConfirm = (slot: SlotItem) => {
    if (slot.status === 'Full') return;
    setSelectedSlot(slot);
    setShowConfirmModal(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedSlot) return;

    const crop = produceDraft?.produce?.crop || 'Paddy';
    const variety = produceDraft?.produce?.variety || 'Ponni Samba (Grade A)';
    const qty = produceDraft?.produce?.quantityKg || 3000;
    const anomaly = produceDraft?.anomaly;

    const token = bookSlotAndGenerateToken(
      selectedSlot.id,
      selectedCentre.id,
      crop,
      variety,
      qty,
      anomaly
    );

    setNewlyGeneratedToken(token);
    setShowConfirmModal(false);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.navMySlots}
        </h2>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          Official arrival slots at Direct Purchase Centres. Select a 1-hour arrival window to avoid mandi queues.
        </p>
      </div>

      {/* If token was just generated, show token card banner */}
      {newlyGeneratedToken && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/80 p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-200 dark:border-emerald-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-800 text-white">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                  SLOT BOOKING CONFIRMED
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Token #{newlyGeneratedToken.tokenNumber} Generated
                </h3>
              </div>
            </div>
            <Badge label="Confirmed" variant="completed" size="md" dot />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
            <div className="rounded-lg bg-white dark:bg-slate-900 p-3.5 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Centre</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white block mt-0.5">
                {newlyGeneratedToken.centreName}
              </span>
            </div>

            <div className="rounded-lg bg-white dark:bg-slate-900 p-3.5 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Date & Arrival Window</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white block mt-0.5">
                {newlyGeneratedToken.slotDate} ({newlyGeneratedToken.slotTimeWindow})
              </span>
            </div>

            <div className="rounded-lg bg-white dark:bg-slate-900 p-3.5 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Estimated Turnaround Wait</span>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 block mt-0.5">
                {newlyGeneratedToken.estimatedWaitMinutes} mins ({newlyGeneratedToken.farmersAhead} Ahead)
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={() => setCurrentTab('live_queue')}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors"
            >
              <span>{t.viewLiveQueue}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Centre Selection Cards */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
          {t.selectCentre}
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {centres.map((c) => {
            const isSelected = selectedCentreId === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCentreId(c.id)}
                className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-emerald-800 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/80 dark:border-emerald-700 dark:text-emerald-200 ring-1 ring-emerald-800'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex w-full items-start justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                    <Building className="h-4 w-4" />
                  </div>
                  <Badge
                    label={c.status}
                    variant={c.status === 'High Load' ? 'high_load' : c.status === 'Moderate' ? 'moderate' : 'normal'}
                    size="sm"
                  />
                </div>
                <h4 className="mt-2.5 text-xs font-bold text-slate-900 dark:text-white">
                  {c.name}
                </h4>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {c.address}
                </p>
                <div className="mt-2.5 flex items-center justify-between w-full border-t border-slate-100 dark:border-slate-800 pt-2 text-[11px] text-slate-500">
                  <span>Turnaround: <strong>{c.currentAvgWaitMinutes}m</strong></span>
                  <span>Intake Pace: <strong>{c.utilizationRate}%</strong></span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Picker */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Calendar className="h-5 w-5 text-emerald-800 dark:text-emerald-400" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t.selectDate}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Direct Purchase Centre booking open 7 days in advance
            </p>
          </div>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:border-emerald-800 focus:outline-none"
        />
      </div>

      {/* Available Slots Grid */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {t.availableSlotsTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedCentre.name} • {selectedDate}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-700" />
              <span className="text-slate-600 dark:text-slate-400">{t.available}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-600" />
              <span className="text-slate-600 dark:text-slate-400">{t.limited}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-600" />
              <span className="text-slate-600 dark:text-slate-400">{t.full}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {centreSlots.map((slot) => {
            const isFull = slot.status === 'Full';
            const isLimited = slot.status === 'Limited';

            return (
              <div
                key={slot.id}
                className={`flex flex-col justify-between rounded-lg border p-4 transition-all ${
                  isFull
                    ? 'border-slate-200 bg-slate-50 opacity-60 dark:border-slate-800 dark:bg-slate-900'
                    : 'border-slate-200 hover:border-emerald-800 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs">
                      <Clock className="h-3.5 w-3.5 text-emerald-800 dark:text-emerald-400" />
                      <span>{slot.startTime} – {slot.endTime}</span>
                    </div>
                    <Badge
                      label={slot.status}
                      variant={isFull ? 'full' : isLimited ? 'limited' : 'available'}
                      size="sm"
                    />
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      <span>Intake Capacity</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {slot.bookedCount} / {slot.maxCapacity} booked
                      </span>
                    </div>
                    {/* Capacity Progress Bar */}
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isFull
                            ? 'bg-rose-600'
                            : isLimited
                            ? 'bg-amber-600'
                            : 'bg-emerald-700'
                        }`}
                        style={{ width: `${(slot.bookedCount / slot.maxCapacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                  <button
                    disabled={isFull}
                    onClick={() => handleOpenConfirm(slot)}
                    className={`w-full rounded-lg py-2 text-xs font-bold transition-colors ${
                      isFull
                        ? 'cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800'
                        : 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm'
                    }`}
                  >
                    {isFull ? t.slotFullBtn : t.selectSlotBtn}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={t.confirmBookingTitle}
        subtitle={t.confirmBookingDesc}
        maxWidth="md"
        footer={
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleConfirmBooking}
              className="rounded-lg bg-emerald-800 hover:bg-emerald-900 px-5 py-2 text-xs font-bold text-white shadow-sm transition-colors"
            >
              {t.generateTokenBtn}
            </button>
          </div>
        }
      >
        {selectedSlot && (
          <div className="space-y-3 text-xs">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Selected Centre:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedCentre.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Date:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Time Window:</span>
                <span className="font-bold text-emerald-800 dark:text-emerald-400">{selectedSlot.startTime} – {selectedSlot.endTime}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400">Slot Status:</span>
                <Badge label={selectedSlot.status} variant={selectedSlot.status === 'Limited' ? 'limited' : 'available'} size="sm" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-[11px]">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>An official verified Gate Pass Token with QR code and live queue tracker will be created for you.</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
