import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { CreateSlotModal } from '../../components/modals/CreateSlotModal';
import { Modal } from '../../components/common/Modal';
import { SlotItem, TokenRecord } from '../../types';
import {
  Calendar,
  Clock,
  PlusCircle,
  Users,
  Edit2,
  Power,
  Eye,
  CheckCircle2,
  Search
} from 'lucide-react';

export const SlotManagement: React.FC = () => {
  const { slots, liveQueue, addToast, t } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewSlotFarmers, setViewSlotFarmers] = useState<SlotItem | null>(null);

  const bookedFarmersForSlot = (slotId: string): TokenRecord[] => {
    return liveQueue.filter(q => q.slotId === slotId);
  };

  const handleToggleActive = (slot: SlotItem) => {
    addToast('Slot Updated', `Slot ${slot.startTime} – ${slot.endTime} toggled`, 'info');
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {t.slotManagementTitle}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Define intake capacity per hour to regulate mandi queue velocity and prevent weighbridge jams
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-500 transition-all active:scale-95"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{t.createSlot}</span>
        </button>
      </div>

      {/* Slots Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3.5">{t.thTimeWindow}</th>
                <th className="px-5 py-3.5">{t.tableDate}</th>
                <th className="px-5 py-3.5">{t.thMaxCapacity}</th>
                <th className="px-5 py-3.5">{t.thAvailability}</th>
                <th className="px-5 py-3.5 text-right">{t.thActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium text-slate-700 dark:text-slate-300">
              {slots.map((slot) => {
                const isFull = slot.status === 'Full';
                const isLimited = slot.status === 'Limited';

                return (
                  <tr key={slot.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-sm">
                        <Clock className="h-4 w-4 text-emerald-500" />
                        <span>{slot.startTime} – {slot.endTime}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      {slot.date}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {slot.bookedCount} / {slot.maxCapacity}
                        </span>
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className={`h-full rounded-full ${
                              isFull ? 'bg-rose-500' : isLimited ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${(slot.bookedCount / slot.maxCapacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        label={slot.status}
                        variant={isFull ? 'full' : isLimited ? 'limited' : 'available'}
                        size="sm"
                        dot
                      />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewSlotFarmers(slot)}
                          className="rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          View Farmers ({slot.bookedCount})
                        </button>
                        <button
                          onClick={() => handleToggleActive(slot)}
                          title="Toggle slot status"
                          className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Power className="h-4 w-4 text-emerald-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Slot Modal */}
      <CreateSlotModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* View Booked Farmers Modal */}
      <Modal
        isOpen={!!viewSlotFarmers}
        onClose={() => setViewSlotFarmers(null)}
        title={`Booked Farmers: ${viewSlotFarmers?.startTime} – ${viewSlotFarmers?.endTime}`}
        subtitle={`Total Bookings: ${viewSlotFarmers?.bookedCount} farmers scheduled`}
        maxWidth="lg"
      >
        {viewSlotFarmers && (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {bookedFarmersForSlot(viewSlotFarmers.id).length > 0 ? (
              bookedFarmersForSlot(viewSlotFarmers.id).map((farmer) => (
                <div
                  key={farmer.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-800/40 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-600">Token #{farmer.tokenNumber}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{farmer.farmerName}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {farmer.crop} ({farmer.declaredQuantityKg} kg) • {farmer.farmerPhone}
                    </span>
                  </div>
                  <Badge label={farmer.status} variant="processing" size="sm" />
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-xs text-slate-400">{t.officerNoFarmersInSlot}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
