# Dynamic Risk Assessment Form Builder

## Tech
- React 18 + TypeScript
- Formik + Yup
- Tailwind CSS
- Vite

## Setup
1. Install: `npm install`
2. Dev: `npm run dev`
3. Build: `npm run build`

## Features implemented
- Dynamic rendering from JSON (`src/formConfig.ts`)
- Supported field types: text, number, select, checkbox, file (PDF <=10MB), date
- Conditional logic (show/hide based on previous answers)
- Real-time risk scoring (weighted)
- Auto-save draft (30s + on change), restore from `localStorage`
- Preview mode (JSON dump)
- Accessible labels, aria attributes
- Responsive (Tailwind)

## Notes
- File upload is client-side only — saved as in-memory `File` and metadata in draft.
- To implement actual file upload, add an API endpoint and upload handler.
