import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Mail, Download, Copy, Trash2, Search, Check } from 'lucide-react';

export const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      if (!db) {
        setLoading(false);
        return;
      }
      const querySnapshot = await getDocs(collection(db, 'subscribers'));
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      // Sort by date newest first
      list.sort((a, b) => {
        const dateA = a.subscribedAt?.toMillis ? a.subscribedAt.toMillis() : 0;
        const dateB = b.subscribedAt?.toMillis ? b.subscribedAt.toMillis() : 0;
        return dateB - dateA;
      });

      setSubscribers(list);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubscriber = async (id) => {
    if (!window.confirm("Are you sure you want to remove this subscriber?")) return;
    try {
      if (db) {
        await deleteDoc(doc(db, 'subscribers', id));
        setSubscribers(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error("Error deleting subscriber:", err);
    }
  };

  const handleCopyEmails = () => {
    const emailsList = filteredSubscribers.map(s => s.email).join(', ');
    navigator.clipboard.writeText(emailsList);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    const csvHeader = "Email,Date Subscribed,Status\n";
    const csvRows = filteredSubscribers.map(s => `"${s.email}","${s.date || 'Recent'}","${s.status || 'active'}"`).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `curos_investing_subscribers_${Date.now()}.csv`;
    a.click();
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-emerald-500 py-12 text-center">Loading newsletter subscribers...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
            <Mail className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Newsletter Subscribers</h1>
            <p className="text-slate-400 text-sm">Manage user emails subscribed to Curos Investing updates ({subscribers.length} total)</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCopyEmails}
            disabled={subscribers.length === 0}
            className="bg-slate-800 hover:bg-slate-700 text-white border border-white/10 px-4 py-2.5 rounded-xl font-medium text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-emerald-400" />}
            {copied ? 'Emails Copied!' : 'Copy All Emails'}
          </button>

          <button
            onClick={handleExportCSV}
            disabled={subscribers.length === 0}
            className="bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 hover:bg-emerald-400 glow-primary transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search subscriber emails..."
          className="w-full bg-slate-900 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* Subscribers Table */}
      <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-slate-300 text-sm">
          <thead className="bg-slate-900 border-b border-white/5 text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Subscriber Email</th>
              <th className="px-6 py-4 font-semibold">Date Subscribed</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredSubscribers.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                  {searchTerm ? 'No subscribers match your search term.' : 'No newsletter subscribers yet. Subscriptions from footer and header will appear here automatically!'}
                </td>
              </tr>
            ) : (
              filteredSubscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                        {sub.email.charAt(0).toUpperCase()}
                      </div>
                      <span>{sub.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {sub.date || (sub.subscribedAt?.toDate ? sub.subscribedAt.toDate().toLocaleDateString() : 'Recent')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-medium">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteSubscriber(sub.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete subscriber"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
