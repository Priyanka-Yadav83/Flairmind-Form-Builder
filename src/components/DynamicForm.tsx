import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { formConfig } from "../formConfig";
import { calculateRiskScore, riskLevel } from "../utils/risk";
import { saveDraft, loadDraft } from "../utils/storage";
import Section from "./Section";
import RiskMeter from "./RiskMeter";
import PreviewModal from "./PreviewModal";

// File input component
const FileInput: React.FC<{ q: any; formik: any }> = ({ q, formik }) => (
  <input
    type="file"
    name={q.id}
    accept={q.accept}
    onChange={(e) => {
      const file = e.target.files?.[0] ?? null;
      formik.setFieldValue(q.id, file);
    }}
    className="border rounded w-full px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm md:text-base"
  />
);

// Build Yup validation schema dynamically
const buildValidationSchema = (config: typeof formConfig) => {
  const shape: any = {};

  config.sections.forEach((section) => {
    section.questions.forEach((q) => {
      switch (q.type) {
        case "text":
          shape[q.id] = q.required ? Yup.string().required("This field is required") : Yup.string();
          break;

        case "number":
          shape[q.id] = q.required
            ? Yup.number()
                .min(q.min ?? -Infinity, `Min ${q.min}`)
                .max(q.max ?? Infinity, `Max ${q.max}`)
                .required("This field is required")
            : Yup.number();
          break;

        case "select":
          shape[q.id] = q.required ? Yup.string().required("This field is required") : Yup.string();
          break;

        case "checkbox":
          shape[q.id] = q.required
            ? Yup.array().min(1, "Select at least one option")
            : Yup.array();
          break;

        case "date":
          shape[q.id] = q.required ? Yup.date().required("This field is required") : Yup.date();
          break;

        case "file":
          shape[q.id] = Yup.mixed().test(
            "required-if-yes",
            "File is required",
            function (value) {
              const conditional = q.conditional;
              if (conditional && this.parent[conditional.questionId] === conditional.answer) {
                return value instanceof File;
              }
              return true;
            }
          );
          break;
      }
    });
  });

  return Yup.object().shape(shape);
};

const AUTOSAVE_MS = 30000;

const DynamicForm: React.FC = () => {
  const initialValues = useMemo(() => {
    const vals: any = {};
    formConfig.sections.forEach((s) =>
      s.questions.forEach((q) => {
        if (q.type === "checkbox") vals[q.id] = [];
        else vals[q.id] = "";
      })
    );

    const draft = loadDraft();
    if (draft) Object.assign(vals, draft);

    return vals;
  }, []);

  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [savingStatus, setSavingStatus] = useState<string>("");

  const formik = useFormik({
    initialValues,
    validationSchema: buildValidationSchema(formConfig),
    onSubmit: (values) => {
      console.log("Form submitted:", values);
      alert("Form submitted successfully!");
      saveDraft(values);
      setLastSaved(new Date().toLocaleString());
    },
  });

  const risk = useMemo(() => calculateRiskScore(formik.values, formConfig), [formik.values]);
  const level = riskLevel(risk);

  // Auto-save every 30s
  useEffect(() => {
    const id = setInterval(() => {
      saveDraft(formik.values);
      setLastSaved(new Date().toLocaleString());
      setSavingStatus("Auto-saved");
      setTimeout(() => setSavingStatus(""), 2000);
    }, AUTOSAVE_MS);
    return () => clearInterval(id);
  }, [formik.values]);

  // Conditional logic for visibility
  const isVisible = (q: any) => {
    if (!q.conditional) return true;
    const v = formik.values[q.conditional.questionId];
    return String(v) === String(q.conditional.answer);
  };

  // Manual Save Draft handler
  const handleSaveDraft = () => {
    saveDraft(formik.values);
    setLastSaved(new Date().toLocaleString());
    setSavingStatus("Draft saved");
    setTimeout(() => setSavingStatus(""), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
        <h1 className="text-2xl font-bold">Dynamic Risk Assessment</h1>
        <div className="text-sm text-left sm:text-right">
          <div>
            Risk: <strong>{risk}</strong> ({level})
          </div>
          <div className="text-xs text-gray-500">
            Last saved: {lastSaved ?? "Not yet saved"} {savingStatus && ` - ${savingStatus}`}
          </div>
        </div>
      </div>

      <RiskMeter risk={risk} level={level} />

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {formConfig.sections.map((section) => (
          <Section key={section.id} title={section.title}>
            {section.questions.map(
              (q) =>
                isVisible(q) && (
                  <div key={q.id} className="mb-3 w-full">
                    <label className="block font-medium mb-1 text-sm sm:text-base">
                      {q.label} {q.required && <span className="text-red-500">*</span>}
                    </label>

                    {/* TEXT INPUT */}
                    {q.type === "text" && (
                      <input
                        name={q.id}
                        value={formik.values[q.id] || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="border rounded w-full px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm md:text-base"
                      />
                    )}

                    {/* NUMBER INPUT */}
                    {q.type === "number" && (
                      <input
                        type="number"
                        name={q.id}
                        value={formik.values[q.id]}
                        onChange={formik.handleChange}
                        className="border rounded w-full px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm md:text-base"
                      />
                    )}

                    {/* SELECT */}
                    {q.type === "select" && (
                      <select
                        name={q.id}
                        value={formik.values[q.id] || ""}
                        onChange={formik.handleChange}
                        className="border rounded w-full px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm md:text-base"
                      >
                        <option value="">Select</option>
                        {q.options?.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* CHECKBOX */}
                    {q.type === "checkbox" && (
                      <div className="flex flex-col gap-2">
                        {q.options?.map((opt) => (
                          <label key={opt} className="inline-flex items-center text-xs sm:text-sm md:text-base">
                            <input
                              type="checkbox"
                              value={opt}
                              checked={(formik.values[q.id] || []).includes(opt)}
                              onChange={(e) => {
                                const next = new Set(formik.values[q.id] || []);
                                e.target.checked ? next.add(opt) : next.delete(opt);
                                formik.setFieldValue(q.id, Array.from(next));
                              }}
                              className="mr-2"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    )}

                    {/* DATE */}
                    {q.type === "date" && (
                      <input
                        type="date"
                        name={q.id}
                        value={formik.values[q.id] || ""}
                        onChange={formik.handleChange}
                        className="border rounded w-full px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm md:text-base"
                      />
                    )}

                    {/* FILE */}
                    {q.type === "file" && <FileInput q={q} formik={formik} />}

                    {formik.touched[q.id] && formik.errors[q.id] && (
                      <div className="error-text">{String(formik.errors[q.id])}</div>
                    )}
                  </div>
                )
            )}
          </Section>
        ))}

        {/* BUTTONS */}
        <div className="button-group">
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
            Submit
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="border px-3 py-1 rounded hover:bg-gray-100 transition "
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="border px-3 py-1 rounded hover:bg-gray-100 transition"
          >
            Preview
          </button>
        </div>
      </form>

      <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} values={formik.values} />
    </div>
  );
};

export default DynamicForm;
