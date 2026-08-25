import React from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { User, Phone, MapPin, Building, CreditCard, ShieldCheck, Tractor } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, role, t } = useApp();

  const getSubtitle = () => {
    switch (role) {
      case 'farmer':
        return t.profileSubtitleFarmer;
      case 'officer':
        return t.profileSubtitleOfficer;
      default:
        return t.profileSubtitleAdmin;
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case 'farmer':
        return t.profileRoleFarmer;
      case 'officer':
        return t.profileRoleOfficer;
      default:
        return t.profileRoleAdmin;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.profile}
      subtitle={getSubtitle()}
      maxWidth="md"
      footer={
        <button
          onClick={onClose}
          className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          {t.btnClose}
        </button>
      }
    >
      <div className="space-y-5">
        {/* User Card Header */}
        <div className="flex items-center gap-4 rounded-2xl bg-emerald-500/10 p-4 border border-emerald-500/20">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-black text-white shadow-md shadow-emerald-500/30">
            {user.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
              {user.name}
            </h4>
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              ID: {user.id}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {getRoleTitle()}
            </p>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 dark:border-slate-800 p-3">
            <Phone className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">{t.modalProfileMobile}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{user.phone}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 dark:border-slate-800 p-3">
            <MapPin className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">{t.modalProfileLocation}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{user.location}</span>
            </div>
          </div>

          {user.landArea && (
            <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 dark:border-slate-800 p-3">
              <Tractor className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">{t.modalProfileLand}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{user.landArea} {t.farmerLandAcres}</span>
              </div>
            </div>
          )}

          {user.bankAccount && (
            <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 dark:border-slate-800 p-3">
              <CreditCard className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">{t.modalProfileDbt}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{user.bankAccount}</span>
                <span className="text-[10px] text-slate-400 block font-mono">{user.ifscCode}</span>
              </div>
            </div>
          )}

          {user.centreName && (
            <div className="col-span-1 sm:col-span-2 flex items-start gap-2.5 rounded-xl border border-slate-100 dark:border-slate-800 p-3">
              <Building className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">{t.modalProfileCentre}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{user.centreName}</span>
              </div>
            </div>
          )}
        </div>

        {/* Security & Verification Notice */}
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>{t.modalProfileEkycNotice}</span>
        </div>
      </div>
    </Modal>
  );
};
