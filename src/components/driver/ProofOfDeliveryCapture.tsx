import React, { useState } from 'react';

interface Props {
  orderId: string;
  onPhotoUploaded: (url: string) => void;
}

export const ProofOfDeliveryCapture: React.FC<Props> = ({ orderId, onPhotoUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setPreview(URL.createObjectURL(file));

    // Upload to Supabase Storage / Cloudflare R2
    const formData = new FormData();
    formData.append('file', file);
    formData.append('orderId', orderId);

    try {
      const res = await fetch('/api/driver/upload-proof', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setUploading(false);
      if (data.url) onPhotoUploaded(data.url);
    } catch (err) {
      setUploading(false);
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
      <p className="text-sm text-zinc-300 font-medium">Preuve de Livraison (Photo)</p>
      {preview && (
        <img src={preview} alt="Proof" className="w-32 h-32 object-cover rounded-lg border border-orange-500/40" />
      )}
      <label className="cursor-pointer px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-semibold transition">
        {uploading ? 'Téléversement...' : 'Prendre une Photo'}
        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCapture} />
      </label>
    </div>
  );
};
