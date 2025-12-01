import { FormConfig } from '../types';

export function calculateRiskScore(values: any, config: FormConfig) {
  let totalWeight = 0;
  let obtained = 0;

  config.sections.forEach((section) => {
    section.questions.forEach((q) => {
      const weight = q.riskWeight || 0;
      totalWeight += weight;
      const val = values[q.id];

      if (q.type === 'number') {
        if (typeof val === 'number' && !isNaN(val) && val > 0) obtained += Math.min(val, 100) * (weight / 100);
      } else if (q.type === 'checkbox') {
        if (Array.isArray(val) && val.length > 0) obtained += weight * (val.length / (q.options?.length || val.length));
      } else {
        if (val) obtained += weight;
      }
    });
  });

  if (totalWeight === 0) return 0;
  const raw = (obtained / totalWeight) * 100;
  const risk = Math.max(0, 100 - Math.round(raw));
  return risk;
}

export function riskLevel(risk: number) {
  if (risk >= 80) return 'Critical';
  if (risk >= 60) return 'High';
  if (risk >= 30) return 'Medium';
  return 'Low';
}
