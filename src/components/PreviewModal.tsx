import React from "react";
import { formConfig } from "../formConfig";

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  values: any;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ open, onClose, values }) => {
  if (!open) return null;

  const getDisplayValue = (q: any) => {
    const val = values[q.id];
    if (q.type === "file" && val instanceof File) return val.name;
    if (Array.isArray(val)) return val.join(", ");
    return val || "-";
  };

  const isVisible = (q: any) => {
    if (!q.conditional) return true;
    const parentVal = values[q.conditional.questionId];
    return String(parentVal) === String(q.conditional.answer);
  };

  return (
    <div className="inset-0 z-50 bg-black/40 p-4 flex justify-center items-start overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded shadow-lg max-h-[90vh] overflow-y-auto">

        {/* Header with Close button */}
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold">Preview</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 border rounded hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4">
          {formConfig.sections.map((section) => (
            <div key={section.id} className="mb-4">
              <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
              <div className="space-y-2">
                {section.questions.map((q) => {
                  if (!isVisible(q)) return null;
                  return (
                    <div
                      key={q.id}
                      className="flex justify-between border-b py-1 text-sm sm:text-base"
                    >
                      <span className="font-medium">{q.label}</span>
                      <span className="text-gray-700">{getDisplayValue(q)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};

export default PreviewModal;
