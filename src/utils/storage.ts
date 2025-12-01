const DRAFT_KEY = 'risk_form_draft_v1';

export function saveDraft(values: any) {
  try {
    const serial = JSON.stringify(values, replacer);
    localStorage.setItem(DRAFT_KEY, serial);
    return true;
  } catch (e) {
    console.error('saveDraft error', e);
    return false;
  }
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw, reviver);
  } catch (e) {
    console.error('loadDraft error', e);
    return null;
  }
}

function replacer(key: string, value: any) {
  if (value instanceof File) return { __file: true, name: value.name, size: value.size, type: value.type };
  return value;
}

function reviver(key: string, value: any) {
  return value;
}
