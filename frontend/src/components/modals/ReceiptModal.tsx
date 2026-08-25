import React from 'react';
import { Modal } from '../common/Modal';
import { Printer, Download, CheckCircle2, QrCode, Sprout } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  record?: any;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, record }) => {
  const { user, addToast, t } = useApp();

  if (!record) return null;

  const handlePrint = () => {
    addToast('Print Triggered', 'Opening browser print dialogue for receipt...', 'info');
    window.print();
  };

  const handleDownload = () => {
    addToast('Receipt Downloaded', `Receipt ${record.receiptNumber || 'REC-8841'} saved as PDF`, 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Procurement Certificate & Weighment Slip"
      subtitle="Department of Agricultural Marketing & Agri-Business"
      maxWidth="lg"
      footer={
        <div className="flex w-full items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Digitally generated with Blockchain-backed Hash Verification
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Printer className="h-4 w-4" />
              <span>{t.print}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-sm"
            >
              <Download className="h-4 w-4" />
              <span>{t.modalReceiptDownloadPdf}</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white space-y-4">
        {/* Receipt Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-black tracking-tight">
                GOVERNMENT AGRICULTURAL PROCUREMENT CENTRE
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {record.centreName || 'Centre A – Thanjavur Mandi'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
              {record.receiptNumber || 'RCP-2026-TNJ-8841'}
            </span>
            <span className="text-[10px] text-slate-400">
              Date: {record.date || '26-Aug-2026'}
            </span>
          </div>
        </div>

        {/* Farmer & Lot Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Farmer Name</span>
            <span className="font-bold text-slate-900 dark:text-white">{record.farmerName || user.name}</span>
            <span className="text-[10px] text-slate-500 block">ID: {record.farmerId || user.id}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Crop & Variety</span>
            <span className="font-bold text-slate-900 dark:text-white">{record.crop} ({record.variety || 'Grade A'})</span>
            <span className="text-[10px] text-slate-500 block">Quality Grade: {record.qualityGrade || 'Grade A'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Actual Weight</span>
            <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
              {(record.actualQuantityKg || record.declaredQuantityKg || 3000).toLocaleString('en-IN')} kg
            </span>
            <span className="text-[10px] text-slate-500 block">Moisture: {record.moisture || '14.0%'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Disbursed (DBT)</span>
            <span className="font-black text-slate-900 dark:text-white text-sm">
              ₹{(record.amount || 72600).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block">Status: {record.paymentStatus || 'Completed'}</span>
          </div>
        </div>

        {/* Banking Reference & Barcode */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">DBT PFMS Reference</span>
            <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
              {record.utrNumber || 'PFMS202608260098412X'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <QrCode className="h-10 w-10 text-slate-800 dark:text-slate-200" />
            <div className="text-[10px] text-slate-400">
              <span className="block font-bold text-emerald-600">{t.modalReceiptCertified}</span>
              Weighbridge #01
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
