import React, { useState } from 'react';
import Modal from '../shared/Modal';

export default function PostImages({ images = [] }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) return null;

  const count = images.length;

  return (
    <>
      <div
        className={`grid gap-2 my-3 rounded-2xl overflow-hidden ${
          count === 1
            ? 'grid-cols-1 max-h-[420px]'
            : count === 2
            ? 'grid-cols-2 max-h-72'
            : count === 3
            ? 'grid-cols-2 max-h-80'
            : 'grid-cols-2 max-h-96'
        }`}
      >
        {images.slice(0, 4).map((url, idx) => (
          <div
            key={url + idx}
            onClick={() => setSelectedImage(url)}
            className={`relative overflow-hidden cursor-pointer group bg-slate-100 dark:bg-slate-800 ${
              count === 3 && idx === 0 ? 'row-span-2' : ''
            }`}
          >
            <img
              src={url}
              alt="Post attachment"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {count > 4 && idx === 3 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xl font-bold">
                +{count - 4}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <Modal
          isOpen={Boolean(selectedImage)}
          onClose={() => setSelectedImage(null)}
          title="Image Attachment"
          size="xl"
        >
          <div className="flex items-center justify-center p-2">
            <img
              src={selectedImage}
              alt="Enlarged preview"
              className="max-h-[75vh] w-auto rounded-xl object-contain shadow-2xl"
            />
          </div>
        </Modal>
      )}
    </>
  );
}
