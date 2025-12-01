import React, { useRef } from "react";

const FileInput = ({ q, formik }: any) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const value = formik.values[q.id];

  const handleChange = (e: any) => {
    const file = e.target.files?.[0];

    if (!file) {
      formik.setFieldValue(q.id, "");
      return;
    }

    if (q.maxSize && file.size / 1024 / 1024 > q.maxSize) {
      alert(`Max file size allowed is ${q.maxSize}MB`);
      return;
    }

    if (q.accept && !file.name.toLowerCase().endsWith(q.accept)) {
      alert(`Only ${q.accept} files allowed`);
      return;
    }

    formik.setFieldValue(q.id, file);
  };

  return (
    <div>
      <input
        ref={ref}
        type="file"
        accept={q.accept}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      {value && typeof value === "object" && (
        <div className="mt-1 text-sm">
          <strong>{value.name}</strong>

          <button
            type="button"
            className="ml-3 text-red-600 underline"
            onClick={() => {
              formik.setFieldValue(q.id, "");
              if (ref.current) ref.current.value = "";
            }}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default FileInput;
