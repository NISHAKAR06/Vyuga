import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, Users } from 'lucide-react';

interface CreateSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateSlotModal: React.FC<CreateSlotModalProps> = ({ isOpen, onClose }) => {
  const { createSlot, centres, user, t } = useApp();

  const [date, setDate] = useState('2026-08-26');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const [maxCapacity, setMaxCapacity] = useState(20);
  const [centreId, setCentreId] = useState(user.centreId || 'cnt-a');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selCentre = centres.find(c => c.id === centreId) || centres[0];

    createSlot({
      centreId: selCentre.id,
      centreName: selCentre.name,
      date,
      startTime,
      endTime,
      maxCapacity: Number(maxCapacity)
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.createSlot}
      subtitle={t.createSlotSubtitle}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {t.selectCentre}
          </label>
          <select
            value={centreId}
            onChange={e => setCentreId(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100"
          >
            {centres.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {t.selectDate}
          </label>
          <div className="relative mt-1.5">
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 pl-9 text-xs font-semibold text-slate-800 dark:text-slate-100"
            />
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t.startTime}
            </label>
            <div className="relative mt-1.5">
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 pl-9 text-xs font-semibold text-slate-800 dark:text-slate-100"
              />
              <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t.endTime}
            </label>
            <div className="relative mt-1.5">
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 pl-9 text-xs font-semibold text-slate-800 dark:text-slate-100"
              />
              <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {t.maxCapacity}
          </label>
          <div className="relative mt-1.5">
            <input
              type="number"
              min={5}
              max={100}
              value={maxCapacity}
              onChange={e => setMaxCapacity(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 pl-9 text-xs font-semibold text-slate-800 dark:text-slate-100"
            />
            <Users className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-md shadow-emerald-500/20"
          >
            {t.createSlotSubmit}
          </button>
        </div>
      </form>
    </Modal>
  );
};
