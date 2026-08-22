// components/kitchen/KitchenTicketCard.tsx
import React, { useEffect, useRef } from 'react';

export interface KitchenOrder {
  id: string;
  order_number: string;
  order_type: 'delivery' | 'pickup';
  status: 'pending' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered';
  pickup_pin: string;
  customer_name: string;
  customer_phone?: string;
  items: Array<{
    quantity: number;
    name: string;
    bread?: string;
    format?: string;
    modifiers?: string[];
    special_notes?: string;
  }>;
  createdAt: string;
}

export const KitchenTicketCard: React.FC<{ 
  order: KitchenOrder; 
  onAccept: () => void; 
  onReady: () => void; 
}> = ({
  order,
  onAccept,
  onReady,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (order.status === 'pending') {
      try {
        audioRef.current = new Audio('/sounds/kitchen-alert.mp3');
        audioRef.current.loop = true;
        audioRef.current.play().catch((err) => {
          console.warn("Audio autoplay blocked, waiting for kitchen interaction:", err);
        });
      } catch (e) {
        console.warn("Audio playback not supported:", e);
      }
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [order.status]);

  const handleAcceptClick = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    onAccept();
  };

  return (
    <div className={`p-6 rounded-3xl border-2 shadow-2xl flex flex-col justify-between transition-all duration-300 ${
      order.status === 'pending' 
        ? 'bg-amber-950/90 border-amber-500 animate-pulse ring-4 ring-amber-500/20' 
        : (order.status === 'preparing' 
            ? 'bg-zinc-900 border-orange-500/40' 
            : 'bg-zinc-900/90 border-emerald-500/40')
    }`}>
      <div>
        {/* Header with Large Order Number & Type */}
        <div className="flex justify-between items-center pb-4 border-b border-zinc-700">
          <div>
            <span className="text-3xl font-black text-white tracking-tight">#{order.order_number}</span>
            <div className="text-xs text-zinc-400 font-medium mt-0.5">{order.customer_name}</div>
          </div>
          <span className={`px-4 py-1.5 text-white font-black text-sm rounded-full uppercase tracking-wider ${
            order.order_type === 'delivery' ? 'bg-orange-600' : 'bg-blue-600'
          }`}>
            {order.order_type === 'delivery' ? '🚗 Livraison' : '🛍️ Cueillette'}
          </span>
        </div>

        {/* Large Item Listings (Optimized for 10-inch+ Tablets) */}
        <div className="mt-5 space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="bg-zinc-950/60 p-3.5 rounded-2xl border border-zinc-800/80">
              <div className="text-lg font-black text-white flex items-center flex-wrap gap-2">
                <span className="text-orange-400 text-2xl font-black">{item.quantity}x</span>
                <span className="text-lg">{item.name.toUpperCase()}</span>
                {item.bread && (
                  <span className="text-xs font-extrabold bg-orange-950/80 text-orange-300 border border-orange-700/50 px-2.5 py-0.5 rounded-lg uppercase">
                    PAIN {item.bread}
                  </span>
                )}
                {item.format && item.format.toLowerCase().includes('trio') && (
                  <span className="text-xs font-extrabold bg-amber-950/80 text-amber-300 border border-amber-700/50 px-2.5 py-0.5 rounded-lg uppercase">
                    TRIO 🍟🥤
                  </span>
                )}
              </div>

              {/* Modifiers & Custom Tags in High-Contrast */}
              {item.modifiers && item.modifiers.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.modifiers.map((mod, modIdx) => (
                    <span key={modIdx} className="text-xs font-bold bg-zinc-800 text-zinc-200 px-2 py-0.5 rounded-md">
                      {mod}
                    </span>
                  ))}
                </div>
              )}

              {item.special_notes && (
                <div className="mt-2 text-xs font-bold text-red-400 bg-red-950/40 border border-red-800/40 p-2 rounded-lg">
                  ⚠️ NOTE: {item.special_notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons & Handover PIN */}
      <div className="mt-6 pt-4 border-t border-zinc-800">
        {order.status === 'pending' && (
          <button
            onClick={handleAcceptClick}
            className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-black text-xl rounded-2xl transition shadow-xl flex items-center justify-center gap-3 cursor-pointer"
          >
            <span className="animate-bounce">🔔</span> ACCEPTER LA COMMANDE
          </button>
        )}
        {order.status === 'preparing' && (
          <button
            onClick={onReady}
            className="w-full py-5 bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white font-black text-xl rounded-2xl transition shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            ✅ MARQUER PRÊTE
          </button>
        )}
        {order.status === 'ready' && (
          <div className="text-center p-4 bg-zinc-950 rounded-2xl border-2 border-orange-500/40 shadow-inner">
            <span className="text-xs uppercase font-extrabold tracking-wider text-zinc-400">PIN de Retrait / Livreur</span>
            <div className="text-4xl font-mono font-black text-orange-400 tracking-widest mt-1">
              {order.pickup_pin || '52325'}
            </div>
            <div className="text-[11px] text-emerald-400 font-bold mt-1">En attente de prise en charge</div>
          </div>
        )}
      </div>
    </div>
  );
};
