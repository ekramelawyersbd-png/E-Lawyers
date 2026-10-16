import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RefreshCcw, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  ArrowUpRight,
  Filter,
  DollarSign,
  Activity
} from 'lucide-react';
import { usePurchases, TransactionRecord } from '../../contexts/PurchaseContext';

export function PaymentStatusWidget() {
  const { transactions, downloadReceipt } = usePurchases();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'refunded'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRefreshStatus = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1200);
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (tx.referenceId && tx.referenceId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 px-6 py-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Payment Status & Live Link Tracker</h3>
              <p className="text-xs text-slate-300">Real-time gateway status for active payment links & transactions</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshStatus}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/10 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Gateway'}</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-slate-50 border-b border-slate-200">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Payments</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">
              {transactions.filter(t => t.status === 'completed').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Links</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">
              {transactions.filter(t => t.status === 'pending').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Payment Link</p>
            <p className="text-xs font-bold text-indigo-600 truncate max-w-[160px] mt-1" title="https://elawyers.paymently.io/paymentlink/pay/o9ZKzkrjjTj1vUbxJ37HdPZf4lijbJUSyBMKdL3U">
              elawyers.paymently.io/...
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <ExternalLink className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Payment Link Spotlight */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-br from-indigo-50/50 via-white to-emerald-50/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-indigo-100 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 tracking-wider uppercase">
                Active Gateway Link
              </span>
              <span className="text-xs text-slate-500 font-medium">UddoktaPay SSL Secure</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">Personal Income Tax Return Filing & 2026-27 Kit</h4>
            <p className="text-xs text-slate-600 font-mono break-all bg-slate-100 p-2 rounded-lg border border-slate-200">
              https://elawyers.paymently.io/paymentlink/pay/o9ZKzkrjjTj1vUbxJ37HdPZf4lijbJUSyBMKdL3U
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleCopyLink('https://elawyers.paymently.io/paymentlink/pay/o9ZKzkrjjTj1vUbxJ37HdPZf4lijbJUSyBMKdL3U', 'spotlight')}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              {copiedId === 'spotlight' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'spotlight' ? 'Copied Link' : 'Copy Payment Link'}</span>
            </button>
            <a
              href="https://elawyers.paymently.io/paymentlink/pay/o9ZKzkrjjTj1vUbxJ37HdPZf4lijbJUSyBMKdL3U"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Test Checkout</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search transaction or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            {(['all', 'completed', 'pending', 'refunded'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer shrink-0 ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Product / Item</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Gateway / Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No payment transactions found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => {
                    const isCompleted = tx.status === 'completed';
                    const isPending = tx.status === 'pending';
                    const isRefunded = tx.status === 'refunded';

                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                          {tx.transactionId}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-900 max-w-[200px] truncate" title={tx.productTitle}>
                          {tx.productTitle}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          ৳{tx.amount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            isCompleted ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            isPending ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            {isPending && <Clock className="w-3 h-3 text-amber-600" />}
                            {isRefunded && <AlertCircle className="w-3 h-3 text-rose-600" />}
                            <span>{tx.status}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          <div className="font-medium text-slate-700">{tx.paymentMethod}</div>
                          <div className="text-[10px] text-slate-400">{new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => downloadReceipt(tx)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all cursor-pointer"
                            title="Download Official Receipt"
                          >
                            <span>Receipt</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
