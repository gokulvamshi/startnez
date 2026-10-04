import React from 'react';
import Modal from '../shared/Modal';

export default function FilePreview({ file, isOpen, onClose }) {
  if (!file) return null;

  const isImage = file.file_type?.startsWith('image/');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={file.file_name} size="lg">
      <div className="flex flex-col items-center justify-center p-2">
        {isImage ? (
          <img
            src={file.file_url}
            alt={file.file_name}
            className="max-h-[70vh] rounded-xl object-contain shadow-lg"
          />
        ) : (
          <div className="text-center py-8 space-y-3">
            <p className="text-sm text-slate-500">
              Preview is not available for this file type.
            </p>
            <a
              href={file.file_url}
              download={file.file_name}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-semibold"
            >
              Download File
            </a>
          </div>
        )}
      </div>
    </Modal>
  );
}
