// components/admin/UserManagementTable.tsx
import React, { useState, useEffect } from 'react';

export interface UserCRM {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'kitchen' | 'driver' | 'admin';
  total_orders: number;
  total_spent: number;
  loyalty_points: number;
  created_at?: string;
}

export const UserManagementTable: React.FC = () => {
  const [users, setUsers] = useState<UserCRM[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (e) {
      console.warn("Could not fetch users:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u)));
        const targetUser = users.find(u => u.id === userId);
        showToastNotification(`Rôle de ${targetUser?.name || 'Utilisateur'} modifié vers ${newRole.toUpperCase()} !`);
      } else {
        alert("Erreur lors de la mise à jour du rôle.");
      }
    } catch (e) {
      alert("Erreur réseau.");
    }
  };

  const showToastNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredUsers = users.filter((u) => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.includes(searchTerm)
  );

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-white space-y-6 shadow-2xl">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white font-bold px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span>✅</span> {toastMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-orange-400">Répertoire Clients & Gestion des Rôles (RBAC)</h2>
          <p className="text-xs text-zinc-400">Gestion des accès d'équipe et suivi de la fidélité client en temps réel.</p>
        </div>
        
        <input
          type="text"
          placeholder="Rechercher nom, courriel, tél..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:border-orange-500 outline-none w-full md:w-72"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950 text-zinc-400 uppercase font-extrabold tracking-wider border-b border-zinc-800">
            <tr>
              <th className="py-4 px-4">Utilisateur</th>
              <th className="py-4 px-4">Courriel / Téléphone</th>
              <th className="py-4 px-4 text-center">Commandes</th>
              <th className="py-4 px-4 text-right">Dépenses Totales</th>
              <th className="py-4 px-4 text-center">Points Fidélité</th>
              <th className="py-4 px-4 text-center">Rôle d'Accès Actuel</th>
              <th className="py-4 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-medium">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-500 font-bold">
                  {loading ? 'Chargement des utilisateurs...' : 'Aucun utilisateur trouvé.'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-800/40 transition">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-black text-orange-400">
                      {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span>{u.name || 'Utilisateur'}</span>
                  </td>
                  <td className="py-3 px-4 text-zinc-300">
                    <div>{u.email}</div>
                    {u.phone && <div className="text-[11px] text-zinc-500">{u.phone}</div>}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-center text-zinc-200">
                    {u.total_orders || 0}
                  </td>
                  <td className="py-3 px-4 font-mono font-black text-right text-orange-400">
                    {(u.total_spent || 0).toFixed(2)}$ CAD
                  </td>
                  <td className="py-3 px-4 font-mono font-black text-center text-emerald-400">
                    {u.loyalty_points || 0} pts
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      u.role === 'admin' ? 'bg-orange-950 text-orange-400 border border-orange-700/50' :
                      (u.role === 'kitchen' ? 'bg-amber-950 text-amber-400 border border-amber-700/50' :
                      (u.role === 'driver' ? 'bg-blue-950 text-blue-400 border border-blue-700/50' :
                      'bg-emerald-950 text-emerald-400 border border-emerald-700/50'))
                    }`}>
                      {u.role || 'customer'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <select
                      value={u.role || 'customer'}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="bg-zinc-950 border border-zinc-700 text-white rounded-xl px-3 py-1.5 text-xs font-bold focus:border-orange-500 outline-none cursor-pointer"
                    >
                      <option value="customer">🛍️ Client</option>
                      <option value="kitchen">🍳 Cuisine (KDS)</option>
                      <option value="driver">🚗 Livreur</option>
                      <option value="admin">👑 Administrateur</option>
                    </select>
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
