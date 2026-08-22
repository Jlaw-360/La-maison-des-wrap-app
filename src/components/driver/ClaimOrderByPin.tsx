// components/driver/ClaimOrderByPin.tsx
import React, { useState } from 'react';

export const ClaimOrderByPin: React.FC<{ onClaimSuccess: (orderId: string, orderNumber: string) => void }> = ({ onClaimSuccess }) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput || pinInput.length < 4) {
      setErrorMsg('Veuillez saisir un code PIN valide à 4 chiffres.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/driver/claim-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Code PIN invalide ou commande pas encore prête en cuisine.');
      } else {
        setSuccessMsg(`✅ Commande #${data.orderNumber || 'Acceptée'} assignée avec succès !`);
        setPinInput('');
        onClaimSuccess(data.orderId, data.orderNumber);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg('Erreur de connexion avec le serveur. Réessayez.');
    }
  };

  return (
    <form onSubmit={handleClaim} className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="text-orange-400">🔢</span> Saisir le PIN Affiché sur la Tablette Cuisine
        </h3>
        <span className="text-xs bg-orange-950 text-orange-400 border border-orange-800/40 px-2 py-0.5 rounded-full font-bold">
          4 Chiffres
        </span>
      </div>

      {errorMsg && (
        <div className="text-xs text-red-400 bg-red-950/50 border border-red-800/40 p-3 rounded-xl font-bold flex items-center gap-2">
          <span>⚠️</span> {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 p-3 rounded-xl font-bold flex items-center gap-2">
          {successMsg}
        </div>
      )}

      <div className="flex gap-3">
        <input
          type="text"
          maxLength={4}
          required
          inputMode="numeric"
          pattern="[0-9]*"
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="Ex: 5232"
          className="w-full text-center tracking-widest text-3xl font-mono font-black py-3 bg-zinc-950 border border-zinc-700 rounded-2xl text-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
        />
        <button
          type="submit"
          disabled={loading || pinInput.length < 4}
          className="px-8 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed font-extrabold text-base text-white rounded-2xl transition shadow-lg flex items-center justify-center cursor-pointer"
        >
          {loading ? '...' : 'Valider'}
        </button>
      </div>
      <p className="text-[11px] text-zinc-400 text-center">
        Demandez au chef de cuisine ou lisez le PIN affiché sur la commande terminée.
      </p>
    </form>
  );
};
