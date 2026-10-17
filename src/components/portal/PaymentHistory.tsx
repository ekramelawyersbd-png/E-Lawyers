import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  RotateCcw,
  Copy,
  Check,
  FileText,
  Printer,
  Eye,
  ExternalLink,
  ShieldCheck,
  Building2,
  X,
  AlertCircle,
  Plus,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { usePurchases, TransactionRecord } from '../../contexts/PurchaseContext';
import { generatePdfReceipt } from '../../utils/receiptGenerator';

interface PaymentHistoryProps {
  compact?: boolean;
  limit?: number;
  onViewAll?: () => void;
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  compact = false,
  limit,
  onViewAll
}) => {
  const { transactions, downloadReceipt, purchaseProduct } = usePurchases();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'completed' | 'pending' | 'refunded'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [previewTransaction, setPreviewTransaction] = useState<TransactionRecord | null>(null);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);

  // New simulated payment form state
  const [simTitle, setSimTitle] = useState('Corporate Legal Retainer & Compliance Advisory');
  const [simAmount, setSimAmount] = useState('5000');
  const [simMethod, setSimMethod] = useState('bKash Personal');
  const [simStatus, setSimStatus] = useState<'completed' | 'pending'>('completed');

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesStatus = selectedStatus === 'all' || tx.status === selectedStatus;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = !query ||
        tx.productTitle.toLowerCase().includes(query) ||
        tx.transactionId.toLowerCase().includes(query) ||
        (tx.referenceId && tx.referenceId.toLowerCase().includes(query)) ||
        tx.paymentMethod.toLowerCase().includes(query);

      return matchesStatus && matchesQuery;
    });
  }, [transactions, selectedStatus, searchQuery]);

  const displayedTransactions = limit ? filteredTransactions.slice(0, limit) : filteredTransactions;

  // Aggregate metrics
  const metrics = useMemo(() => {
    const totalPaid = transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const totalPending = transactions
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const paidCount = transactions.filter(t => t.status === 'completed').length;
    const pendingCount = transactions.filter(t => t.status === 'pending').length;

    return { totalPaid, totalPending, paidCount, pendingCount, total: transactions.length };
  }, [transactions]);

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (e: React.MouseEvent, tx: TransactionRecord) => {
    e.stopPropagation();
    setDownloadingId(tx.id);
    try {
      generatePdfReceipt(tx);
    } catch (err) {
      console.error('Error generating PDF receipt:', err);
      downloadReceipt(tx);
    } finally {
      setTimeout(() => setDownloadingId(null), 1500);
    }
  };

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(simAmount) || 2000;
    const fakeId = `prod-custom-${Date.now().toString().slice(-4)}`;
    purchaseProduct(fakeId, simTitle, amountNum, simMethod, simStatus);
    setIsSimulateModalOpen(false);
  };

  const getStatusBadge = (status: TransactionRecord['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Paid</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending</span>
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Refunded</span>
          </span>
        );
    }
  };

  return (
    <div id="client-portal-payment-history" className="space-y-6">
      {/* Widget Header & Metrics */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-xl font-bold text-slate-900">Payment History &amp; Receipts</h3>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Audit Certified</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Official transaction record for retainer fees, compliance materials, and consultation disbursements
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsSimulateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Payment</span>
            </button>
          </div>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Cleared</span>
            <div className="text-2xl font-black text-slate-900">
              ৳{metrics.totalPaid.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{metrics.paidCount} Paid Invoices</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pending Clearance</span>
            <div className="text-2xl font-black text-amber-700">
              ৳{metrics.totalPending.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>{metrics.pendingCount} Awaiting Verification</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">All Transactions</span>
            <div className="text-2xl font-black text-slate-900">
              {metrics.total}
            </div>
            <span className="text-[11px] text-slate-500 block">
              Lifetime portal payment entries
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-200/80 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700 block">Designated bKash</span>
            <div className="text-lg font-black text-pink-900 font-mono">
              01744883636
            </div>
            <span className="text-[11px] font-semibold text-pink-800 block">
              bKash Personal (Send Money)
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/70 overflow-x-auto">
            <button
              type="button"
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Entries ({metrics.total})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedStatus === 'completed'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Paid ({metrics.paidCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedStatus === 'pending'
                  ? 'bg-white text-amber-800 shadow-xs'
                  : 'text-slate-600 hover:text-amber-800'
              }`}
            >
              <Clock className="w-3 h-3 text-amber-600" />
              <span>Pending ({metrics.pendingCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by transaction ID, item, or reference..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Transactions Table / Card List */}
        {displayedTransactions.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No payment records found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {searchQuery || selectedStatus !== 'all'
                ? 'Try clearing your search query or switching filters.'
                : 'Completed and pending transactions will be recorded here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedTransactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => setPreviewTransaction(tx)}
                className="group p-4 sm:p-5 rounded-2xl border border-slate-200/80 hover:border-emerald-300 bg-white hover:bg-slate-50/60 transition-all cursor-pointer shadow-2xs"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Transaction Description & Details */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 group-hover:bg-emerald-50 group-hover:border-emerald-200 group-hover:text-emerald-700 transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900 group-hover:text-emerald-900 transition-colors">
                          {tx.productTitle}
                        </span>
                        {getStatusBadge(tx.status)}
                      </div>

                      {/* Typographic Metadata Line */}
                      <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500 mt-1.5">
                        <span className="font-mono text-slate-600 font-semibold flex items-center gap-1">
                          <span>{tx.transactionId}</span>
                          <button
                            type="button"
                            onClick={(e) => handleCopy(e, tx.transactionId)}
                            className="p-0.5 text-slate-400 hover:text-slate-600 rounded"
                            title="Copy Transaction ID"
                          >
                            {copiedId === tx.transactionId ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </span>
                        <span>·</span>
                        {tx.referenceId && (
                          <>
                            <span className="text-slate-600">Ref: {tx.referenceId}</span>
                            <span>·</span>
                          </>
                        )}
                        <span>{tx.paymentMethod}</span>
                        <span>·</span>
                        <span>
                          {new Date(tx.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Amount
                      </span>
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        ৳{tx.amount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleDownload(e, tx)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs ${
                          downloadingId === tx.id
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}
                        title="Download official digital PDF receipt"
                      >
                        {downloadingId === tx.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>Downloaded</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Download Receipt</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTransaction(tx);
                        }}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                        title="View Receipt Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer info & view all link */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital receipts certified under Bangladesh Income Tax Act 2023 &amp; VAT and SD Act 2012</span>
          </div>

          {limit && filteredTransactions.length > limit && onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
            >
              View all {filteredTransactions.length} transactions →
            </button>
          )}
        </div>
      </div>

      {/* RECEIPT PREVIEW MODAL */}
      {previewTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Digital Receipt Details</h4>
                  <p className="text-xs font-mono text-slate-500">TrxID: {previewTransaction.transactionId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewTransaction(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Content */}
            <div className="py-5 space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Receipt Reference:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {previewTransaction.referenceId || previewTransaction.id}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Payment Status:</span>
                  {getStatusBadge(previewTransaction.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Payment Method:</span>
                  <span className="font-bold text-slate-900">{previewTransaction.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Date &amp; Time:</span>
                  <span className="text-slate-900 font-semibold">
                    {new Date(previewTransaction.date).toLocaleString('en-GB')}
                  </span>
                </div>
              </div>

              {/* Item Details */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">{previewTransaction.productTitle}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Legal &amp; Tax Compliance Advisory Service / Digital Asset
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-sm text-slate-900">
                      ৳{previewTransaction.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">Total Settled:</span>
                  <span className="text-base font-black text-emerald-800">
                    BDT {previewTransaction.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Merchant Details */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Authorized Merchant:</div>
                <div>Accounticca &amp; E-Lawyers Bangladesh Chambers</div>
                <div>Panthapath, Dhaka-1205 • Tax License TIN: 4829-1029-4412</div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <button
                type="button"
                onClick={(e) => handleDownload(e, previewTransaction)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATE / RECORD PAYMENT MODAL */}
      {isSimulateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Record Client Payment</h4>
                  <p className="text-xs text-slate-500">Record a new payment or invoice entry</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSimulateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSimulateSubmit} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Matter / Service Description
                </label>
                <input
                  type="text"
                  required
                  value={simTitle}
                  onChange={(e) => setSimTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Amount (BDT)
                  </label>
                  <input
                    type="number"
                    required
                    value={simAmount}
                    onChange={(e) => setSimAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={simStatus}
                    onChange={(e) => setSimStatus(e.target.value as 'completed' | 'pending')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="completed">Paid (Completed)</option>
                    <option value="pending">Pending Clearance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={simMethod}
                  onChange={(e) => setSimMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="bKash Personal">bKash Personal (01744883636)</option>
                  <option value="SSL Secure Gateway">SSL Secure Gateway</option>
                  <option value="Bank Transfer (City Bank PLC)">Bank Transfer (City Bank PLC)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSimulateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Add Transaction Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
