import React, { useRef, useState } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import { fileService } from '../../services/fileService';

export default function FileUploader({ projectId, onFileUploaded }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      // Upload file directly or via mock store
      const url = URL.createObjectURL(file);
      const payload = {
        file_name: file.name,
        file_url: url,
        file_size: file.size,
        file_type: file.type || 'application/octet-stream'
      };

      const res = await fileService.uploadFile(projectId, payload);
      onFileUploaded?.(res?.data || res);
    } catch (err) {
      setError(err?.message || 'File upload failed.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary-500 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-900/50 group"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-2">
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          ) : (
            <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-primary-500 transition-colors" />
          )}
          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              {isUploading ? 'Uploading file...' : 'Upload project documentation or code files'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              PDFs, images, slides, design exports up to 50MB
            </p>
          </div>
        </div>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
