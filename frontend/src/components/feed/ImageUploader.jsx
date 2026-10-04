import React, { useRef } from 'react';
import { Image, X, UploadCloud, Loader2 } from 'lucide-react';
import { compressImage } from '../../lib/imageCompression';

export default function ImageUploader({
  images = [],
  onChange,
  maxImages = 4,
  isCompressing = false,
  setIsCompressing
}) {
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = maxImages - images.length;
    const toProcess = files.slice(0, remainingSlots);

    try {
      setIsCompressing?.(true);
      const newUrls = [];

      for (const file of toProcess) {
        if (!file.type.startsWith('image/')) continue;
        const compressed = await compressImage(file);
        const url = URL.createObjectURL(compressed);
        newUrls.push(url);
      }

      onChange([...images, ...newUrls]);
    } catch (err) {
      console.error('Image upload/compression failed:', err);
    } finally {
      setIsCompressing?.(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (indexToRemove) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Attachments ({images.length}/{maxImages})
        </label>
        <span className="text-[11px] text-slate-400">JPG, PNG, WebP (max 5MB each)</span>
      </div>

      {/* Previews Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {images.map((url, idx) => (
            <div
              key={url + idx}
              className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group bg-slate-100 dark:bg-slate-800"
            >
              <img src={url} alt="Attachment" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/60 text-white hover:bg-red-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Trigger */}
      {images.length < maxImages && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary-500 rounded-xl p-4 text-center cursor-pointer transition-colors group bg-slate-50/50 dark:bg-slate-900/50"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            accept="image/*"
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center gap-1.5">
            {isCompressing ? (
              <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
            ) : (
              <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
            )}
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-primary-600">
              {isCompressing ? 'Optimizing images...' : 'Click or drop images to attach'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
