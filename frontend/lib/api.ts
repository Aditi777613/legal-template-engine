const API = "http://127.0.0.1:8000";

export async function uploadFile(file: File) {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(`${API}/upload`, { method: "POST", body: form });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `Upload failed: ${response.statusText}`);
  }
  return response.json();
}

export async function saveTemplate(template_id: string) {
  const response = await fetch(`${API}/templates/save?template_id=${template_id}`, { method: "POST" });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `Request failed: ${response.statusText}`);
  }
  return response.json();
}

export async function startDraft(query: { user_query: string }) {
  const response = await fetch(`${API}/draft/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query)
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `Request failed: ${response.statusText}`);
  }
  return response.json();
}

export async function getVars(template_id: string) {
  try {
    const response = await fetch(`${API}/vars/${template_id}`);
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || `Request failed: ${response.statusText}`);
    }
    return response.json();
  } catch (error: any) {
    if (error.message && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please ensure the backend is running.');
    }
    throw error;
  }
}

export async function answerVars(template_id: string, answers: any) {
  const response = await fetch(`${API}/vars/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ template_id, answers })
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `Request failed: ${response.statusText}`);
  }
  return response.json();
}

export async function generateDraft(template_id: string) {
  const response = await fetch(`${API}/draft/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ template_id })
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `Request failed: ${response.statusText}`);
  }
  return response.json();
}

export async function history() {
  const response = await fetch(`${API}/draft/history`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `Request failed: ${response.statusText}`);
  }
  return response.json();
}

export async function downloadDraftMd(instanceId: number) {
  const response = await fetch(`${API}/draft/${instanceId}/download-md`);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `draft_${instanceId}.md`;
  a.click();
  window.URL.revokeObjectURL(url);
}

export async function downloadDraftDocx(instanceId: number) {
  const response = await fetch(`${API}/draft/${instanceId}/download-docx`);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `draft_${instanceId}.docx`;
  a.click();
  window.URL.revokeObjectURL(url);
}

export async function exportVariables(templateId: string, format: 'json' | 'csv' = 'json') {
  const response = await fetch(`${API}/templates/${templateId}/variables/export?format=${format}`);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${templateId}_variables.${format}`;
  a.click();
  window.URL.revokeObjectURL(url);
}

export async function webBootstrap(query: { user_query: string }) {
  const response = await fetch(`${API}/draft/web-bootstrap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query)
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `Request failed: ${response.statusText}`);
  }
  return response.json();
}

export async function createTemplateFromWeb(docIndex: number, query: string) {
  const response = await fetch(`${API}/draft/web-bootstrap/create-template`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_query: query, doc_index: docIndex })
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `Request failed: ${response.statusText}`);
  }
  return response.json();
}