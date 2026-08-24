import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { TokenRecord } from '../../types';
import {
  Search,
  Filter,
  UserCheck,
  Phone,
  MapPin,
  Calendar,
  Scale,
  Eye,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const FarmerRecords: React.FC = () => {
  const { liveQueue, t } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState<TokenRecord | null>(null);

  const filtered = liveQueue.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.farmerId.toLowerCase().includes(term) ||
      item.farmerName.toLowerCase().includes(term) ||
      item.farmerPhone.toLowerCase().includes(term) ||
      item.tokenNumber.toString().includes(term) ||
      item.produceId.toLowerCase().includes(term)
    );
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {t.navFarmerRecords}
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Master registry of declared farmers, Aadhaar verified landholdings, produce lots and anomaly states
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by Farmer ID, Mobile (+91), Token #, or Produce ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-white"
          />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Records Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Farmer ID / Token</th>
                <th className="px-5 py-3.5">Farmer Name</th>
                <th className="px-5 py-3.5">Land Area</th>
                <th className="px-5 py-3.5">Produce & Qty</th>
                <th className="px-5 py-3.5">Slot Booked</th>
                <th className="px-5 py-3.5">Anomaly Status</th>
                <th className="px-5 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4 font-mono">
                    <span className="font-bold text-slate-900 dark:text-white block">{item.farmerId}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Token #{item.tokenNumber}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-900 dark:text-white block">{item.farmerName}</span>
                    <span className="text-[10px] text-slate-400">{item.farmerPhone}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-700 dark:text-slate-300">
                    {item.anomaly.landAreaAcres} Acres
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-900 dark:text-white">{item.crop}</span>
                    <span className="block text-[10px] text-emerald-600 font-bold">{item.declaredQuantityKg.toLocaleString('en-IN')} kg</span>
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {item.slotTimeWindow}
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      label={item.anomaly.status}
                      variant={item.anomaly.detected ? 'verification' : 'cleared'}
                      size="sm"
                      dot
                    />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedFarmer(item)}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Eye className="h-3.5 w-3.5 inline mr-1" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedFarmer}
        onClose={() => setSelectedFarmer(null)}
        title={selectedFarmer ? `Farmer Record: ${selectedFarmer.farmerName}` : ''}
        subtitle={selectedFarmer ? `ID: ${selectedFarmer.farmerId} • Token #${selectedFarmer.tokenNumber}` : ''}
        maxWidth="lg"
      >
        {selectedFarmer && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Village & District</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedFarmer.farmerVillage}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedFarmer.farmerPhone}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Produce ID</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedFarmer.produceId}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Slot Time</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedFarmer.slotTimeWindow}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">Agronomic & Yield Assessment</h4>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">Declared Quantity</span>
                  <span className="font-black text-emerald-600">{selectedFarmer.declaredQuantityKg} kg</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Historical Average</span>
                  <span className="font-bold">{selectedFarmer.anomaly.historicalAvgKg} kg</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Risk Score</span>
                  <span className="font-bold text-amber-600">{selectedFarmer.anomaly.riskScore}/100</span>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2">
                {selectedFarmer.anomaly.reason}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
