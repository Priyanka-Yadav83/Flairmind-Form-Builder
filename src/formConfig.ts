import { FormConfig } from './types';

export const formConfig: FormConfig = {
  sections: [
    {
      id: 'compliance',
      title: 'Compliance Assessment',
      questions: [
        {
          id: 'q1',
          type: 'select',
          label: 'Do you have SOC2 certification?',
          options: ['Yes', 'No', 'In Progress'],
          required: true,
          riskWeight: 4
        },
        {
          id: 'q2',
          type: 'file',
          label: 'Upload compliance certificate',
          accept: '.pdf',
          maxSize: 10,
          required: false,
          riskWeight: 5,
          conditional: { questionId: 'q1', answer: 'Yes' }
        },
        {
          id: 'q1_text',
          type: 'text',
          label: 'Please explain why SOC2 is not available',
          required: false,
          riskWeight: 3,
          conditional: { questionId: "q1", answer: "No" }
        },
        {
          id: "q1_date",
          type: "date",
          label: "When was your last SOC2 audit?",
          required: false,
          riskWeight: 2
        }
      ]
    },

    {
      id: 'cyber',
      title: 'Cybersecurity',
      questions: [
        {
          id: 'q3',
          type: 'select',
          label: 'Do you have cybersecurity insurance?',
          options: ['Yes', 'No'],
          required: true,
          riskWeight: 12
        },
        {
          id: 'q4',
          type: 'text',
          label: 'Explain why no insurance',
          required: false,
          riskWeight: 6,
          conditional: { questionId: 'q3', answer: 'No' }
        }
      ]
    },

    {
      id: 'ops',
      title: 'Operational',
      questions: [
        {
          id: 'q5',
          type: 'number',
          label: 'Number of critical incidents in last year',
          min: 0,
          max: 100,
          required: true,
          riskWeight: 15
        },
        {
          id: 'q6',
          type: 'checkbox',
          label: 'Which security controls are implemented?',
          options: ['MFA', 'WAF', 'SIEM', 'Endpoint Protection'],
          required: true,
          riskWeight: 10
        }
      ]
    }
  ]
};
