import * as Yup from 'yup';
import { FormConfig } from '../types';

export const buildValidationSchema = (config: FormConfig) => {
  const shape: any = {};

  config.sections.forEach((section) => {
    section.questions.forEach((q) => {
      switch (q.type) {
        case 'text':
          shape[q.id] = q.required ? Yup.string().required('Required') : Yup.string();
          break;

        case 'number':
          let rule = Yup.number().typeError('Must be a number');
          if (q.required) rule = rule.required('Required');
          if (typeof q.min === 'number') rule = rule.min(q.min, `Min ${q.min}`);
          if (typeof q.max === 'number') rule = rule.max(q.max, `Max ${q.max}`);
          shape[q.id] = rule;
          break;

        case 'select':
          shape[q.id] = q.required ? Yup.string().required('Required') : Yup.string();
          break;

        case 'checkbox':
          shape[q.id] = q.required ? Yup.array().min(1, 'Select at least one') : Yup.array();
          break;

        case 'file':
          let fileRule: Yup.MixedSchema<File | null> = Yup.mixed();
          if (q.required) fileRule = fileRule.required('Required');

          fileRule = fileRule
            .test('fileSize', `Max ${q.maxSize || 10}MB`, (val: unknown) => {
              if (!val) return !q.required;

              const file = val as File;
              return file.size / 1024 / 1024 <= (q.maxSize || 10);
            })
            .test('fileType', 'PDF only', (val: unknown) => {
              if (!val) return !q.required;

              const file = val as File;
              return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
            });

          shape[q.id] = fileRule;
          break;

        case 'date':
          shape[q.id] = q.required ? Yup.date().required('Required') : Yup.date();
          break;

        default:
          shape[q.id] = Yup.mixed();
      }
    });
  });

  return Yup.object().shape(shape);
};
