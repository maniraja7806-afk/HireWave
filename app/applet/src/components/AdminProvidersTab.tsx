import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, Key, Trash2, Search, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminProvidersTab = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [resetModalProvider, setResetModalProvider] = useState<any>(null);
  const [newPasswordResult, setNewPasswordResult] = useState<string | null>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/providers');
      setProviders(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error('Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (providerId: string) => {
    try {
      const res = await api.post(`/admin/providers/${providerId}/reset-password`, {});
      setNewPasswordResult(res.data.newPassword);
      toast.success(`Password reset successfully for ${res.data.username}`);
      fetchProviders();
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };

  const handleDeleteProvider = async (providerId: string) => {
    if (!window.confirm('Are you sure you want to delete this provider account?')) return;
    try {
      await api.delete(`/admin/providers/${providerId}`);
      toast.success('Provider deleted successfully');
      fetchProviders();
    } catch (error) {
      toast.error('Failed to delete provider');
    }
  };

  const filteredProviders = providers.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Provider Account Management ({providers.length})
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage provider credentials, reset secure passwords, or view seeded accounts.
          </p>
        </div>
        <a 
          href="/provider-credentials.csv" 
          download 
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm text-sm"
        >
          <Download className="w-4 h-4" /> Download Credentials CSV
        </a>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by name, username, city, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none focus:outline-none text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading providers...</div>
        ) : filteredProviders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No providers found matching your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Provider Name</th>
                  <th className="p-4">Username</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">City</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
                {filteredProviders.map(provider => (
                  <tr key={provider._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                      <img 
                        src={provider.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}`} 
                        alt="" 
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-bold">{provider.name}</div>
                        <div className="text-xs text-slate-400">{provider.phoneNumber || 'No phone'}</div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-blue-600 dark:text-blue-400">{provider.username || 'N/A'}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{provider.email}</td>
                    <td className="p-4">
                      <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full text-xs font-semibold">
                        {provider.category || 'General'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{provider.city || 'Chennai'}</td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => {
                          setResetModalProvider(provider);
                          setNewPasswordResult(null);
                        }}
                        className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                      >
                        <Key className="w-3.5 h-3.5" /> Reset Pass
                      </button>
                      <button 
                        onClick={() => handleDeleteProvider(provider._id)}
                        className="inline-flex items-center gap-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {resetModalProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-500" /> Reset Password for {resetModalProvider.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Username: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{resetModalProvider.username}</span>
            </p>

            {newPasswordResult ? (
              <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 p-4 rounded-lg space-y-2">
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase">New Temporary Password Generated:</p>
                <div className="bg-white dark:bg-slate-900 p-3 rounded font-mono font-bold text-lg text-slate-900 dark:text-white select-all border border-emerald-300 dark:border-emerald-700">
                  {newPasswordResult}
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">Copy this password and share it with the provider securely.</p>
              </div>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Clicking confirm will generate a secure new temporary password, hash it with bcrypt, and update the provider's account.
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setResetModalProvider(null)}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200"
              >
                Close
              </button>
              {!newPasswordResult && (
                <button 
                  onClick={() => handleResetPassword(resetModalProvider._id)}
                  className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium shadow-sm"
                >
                  Confirm Reset
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
