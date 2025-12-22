const API = "http://127.0.0.1:8000";

export async function uploadFile(file: File) {
  const form = new FormData();
  form.append("file", file);
  return fetch(`${API}/upload`, { method: "POST", body: form }).then(r => r.json());
}

export async function saveTemplate(template_id: string) {
  return fetch(`${API}/templates/save?template_id=${template_id}`, { method: "POST" }).then(r => r.json());
}

export async function startDraft(query: string) {
  return fetch(`${API}/draft/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_query: query })
  }).then(r => r.json());
}

export async function getVars(template_id: string) {
  return fetch(`${API}/vars/${template_id}`).then(r => r.json());
}

export async function answerVars(template_id: string, answers: any) {
  return fetch(`${API}/vars/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ template_id, answers })
  });
}

export async function generateDraft(template_id: string) {
  return fetch(`${API}/draft/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ template_id })
  }).then(r => r.json());
}

export async function history() {
  return fetch(`${API}/draft/history`).then(r => r.json());
}
