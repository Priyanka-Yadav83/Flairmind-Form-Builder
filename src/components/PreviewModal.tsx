import React from 'react';

const PreviewModal: React.FC<{ open: boolean; onClose: () => void; values: any }> = ({ open, onClose, values }) => {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
      <div className="bg-white max-w-2xl w-full p-4 rounded">
        <h2 className="text-xl font-bold mb-2">Preview</h2>
        <pre className="max-h-96 overflow-auto text-sm bg-gray-50 p-2 rounded">{JSON.stringify(values, null, 2)}</pre>
        <div className="mt-3 text-right">
          <button onClick={onClose} className="px-3 py-1 border rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
