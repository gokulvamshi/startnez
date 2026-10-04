import React, { useState, useEffect } from 'react';
import { fileService } from '../../services/fileService';
import FileCard from './FileCard';
import FileUploader from './FileUploader';
import FilePreview from './FilePreview';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function FilesList({ projectId }) {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const res = await fileService.getFiles(projectId);
      const list = res?.data || res || [];
      setFiles(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load project files:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [projectId]);

  const handleDelete = async (fileId) => {
    if (!window.confirm('Delete this file from the project workspace?')) return;
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    try {
      await fileService.deleteFile(fileId);
    } catch (err) {
      console.error('Failed to delete file:', err);
      fetchFiles();
    }
  };

  return (
    <div className="space-y-6">
      <FileUploader
        projectId={projectId}
        onFileUploaded={(newFile) => setFiles((prev) => [newFile, ...prev])}
      />

      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Shared Project Files ({files.length})
        </h4>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : files.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            No files shared in this workspace yet. Upload documents, slides, or schemas above.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onPreview={(f) => setPreviewFile(f)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <FilePreview
        file={previewFile}
        isOpen={Boolean(previewFile)}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}
