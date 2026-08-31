import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { ExpenseItem } from '../types';
import {
  DollarSign,
  Plus,
  Trash2,
  TrendingUp,
  PieChart,
  Layers,
  MapPin,
  Wheat,
  Receipt,
  FileSpreadsheet
} from 'lucide-react';

export const ExpensesView: React.FC = () => {
  const {
    expenses,
    farms,
    crops,
    addExpense,
    deleteExpense,
    setIsExportModalOpen
  } = useFarm();

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [farmId, setFarmId] = useState(farms[0]?.id || '');
  const [cropId, setCropId] = useState('');
  const [category, setCategory] = useState<ExpenseItem['category']>('Fertilizer');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Calculations
  const totalCost = expenses.reduce((acc, e) => acc + e.amount, 0);

  // Group by category
  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    addExpense({
      farmId: farmId || farms[0].id,
      cropId: cropId || undefined,
      category,
      description,
      amount: parseFloat(amount),
      date
    });

    setDescription('');
    setAmount('');
    setIsAddExpenseOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-lime-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-lime-100 text-emerald-800 rounded-lg font-bold text-base flex items-center justify-center w-9 h-9 font-serif">
              ₹
            </span>
            <h1 className="text-2xl font-extrabold text-emerald-950 font-serif">Input Costs & Expense Ledger</h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Track seed, fertilizer, pesticide, machinery, and labor expenditures across plots to maintain seasonal profitability in Indian Rupees (₹).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 bg-white hover:bg-lime-50 text-emerald-900 font-semibold px-3 py-2 rounded-xl border border-lime-300 shadow-xs transition text-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Export Balance Sheet</span>
          </button>

          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2.5 rounded-xl shadow-xs transition active:scale-95 text-xs sm:text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-lime-400 stroke-[3]" />
            <span>Log Expense</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-lime-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 block">Total Season Expenditure</span>
          <span className="text-3xl font-extrabold text-emerald-950 font-mono mt-1 block">
            ₹{totalCost.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-stone-500 block mt-1">Across {expenses.length} ledger entries</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-lime-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 block">Top Input Category</span>
          <span className="text-2xl font-bold text-emerald-950 mt-1 block">
            {(Object.entries(categoryTotals) as [string, number][]).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
          </span>
          <span className="text-[11px] text-stone-500 block mt-1">
            ₹{((Object.entries(categoryTotals) as [string, number][]).sort((a, b) => b[1] - a[1])[0]?.[1] || 0).toLocaleString('en-IN')} invested
          </span>
        </div>

        <div className="bg-emerald-900 text-white p-5 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold text-emerald-200 block">Projected Harvest Valuation</span>
          <span className="text-3xl font-extrabold text-lime-300 font-mono mt-1 block">
            ₹{(totalCost * 2.85).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
          <span className="text-[11px] text-emerald-200 block mt-1">Estimated Net Margin: ~65%</span>
        </div>
      </div>

      {/* Category Breakdown Bar */}
      <div className="bg-white p-5 rounded-2xl border border-lime-200 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-emerald-950">Expense Distribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {(Object.entries(categoryTotals) as [string, number][]).map(([cat, amt]) => {
            const pct = Math.round((amt / (totalCost || 1)) * 100);
            return (
              <div key={cat} className="bg-lime-50/50 p-3 rounded-xl border border-lime-100 text-xs">
                <span className="text-stone-500 block truncate font-medium">{cat}</span>
                <span className="font-extrabold text-emerald-950 block mt-0.5">₹{amt.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-emerald-700 font-bold block">{pct}% of total</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-lime-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-lime-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-emerald-950">Recent Expense Entries</h3>
          <span className="text-xs text-stone-500">{expenses.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Farm / Crop</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {expenses.map((exp) => {
                const linkedFarm = farms.find(f => f.id === exp.farmId);
                const linkedCrop = crops.find(c => c.id === exp.cropId);
                return (
                  <tr key={exp.id} className="hover:bg-lime-50/40 transition">
                    <td className="py-3 px-4 font-mono text-stone-600">{exp.date}</td>
                    <td className="py-3 px-4">
                      <span className="bg-lime-100 text-emerald-900 font-semibold px-2 py-0.5 rounded text-[11px] border border-lime-200">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-900">{exp.description}</td>
                    <td className="py-3 px-4 text-stone-600">
                      {linkedFarm?.farmName || 'General'} {linkedCrop ? `(${linkedCrop.cropName})` : ''}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-950 text-sm">
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 rounded transition cursor-pointer"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-lime-200">
            <div className="flex items-center justify-between border-b border-lime-100 pb-3">
              <h3 className="text-base font-bold text-emerald-950">Log Field Expense</h3>
              <button onClick={() => setIsAddExpenseOpen(false)} className="text-stone-400 hover:text-stone-700 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Plot Location *</label>
                <select
                  value={farmId}
                  onChange={(e) => setFarmId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                >
                  {farms.map(f => (
                    <option key={f.id} value={f.id}>{f.farmName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Target Crop (Optional)</label>
                <select
                  value={cropId}
                  onChange={(e) => setCropId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                >
                  <option value="">-- General Plot Expense --</option>
                  {crops.map(c => (
                    <option key={c.id} value={c.id}>{c.cropName} ({c.stage})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Expense Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                >
                  <option value="Seeds">Seeds & Seedlings</option>
                  <option value="Fertilizer">Fertilizer & Nutrients</option>
                  <option value="Pesticides">Pesticides & Crop Protection</option>
                  <option value="Labor">Manual Labor & Workers</option>
                  <option value="Machinery / Fuel">Machinery Rental & Fuel</option>
                  <option value="Irrigation">Irrigation Electricity / Water</option>
                  <option value="Other">Other Miscellaneous</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2 bags of Urea 45kg"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    step="1"
                    required
                    placeholder="e.g. 1200"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-100 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
