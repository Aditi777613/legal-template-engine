"use client";
import { useState } from "react";
import { startDraft, getVars, answerVars, generateDraft } from "../../lib/api";

export default function Draft() {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<any[]>([]);
  const [templateId, setTemplateId] = useState("");
  const [vars, setVars] = useState<any>(null);
  const [draft, setDraft] = useState("");

  async function start() {
    const res = await startDraft(query);
    setMatches(res.matches || []);
  }

  async function loadVars(id: string) {
    setTemplateId(id);
    const v = await getVars(id);
    setVars(v);
  }

  async function answer(key: string, value: string) {
    await answerVars(templateId, { [key]: value });
    setVars(await getVars(templateId));
  }

  async function generate() {
    const res = await generateDraft(templateId);
    setDraft(res.draft_md);
  }

  return (
    <>
      <h2>Draft</h2>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button onClick={start}>Start</button>

      {matches.map(m => (
        <div key={m.template_id}>
          <b>{m.title}</b> ({m.confidence})
          <button onClick={() => loadVars(m.template_id)}>Use</button>
        </div>
      ))}

      {vars?.missing?.map((q: any) => (
        <div key={q.key}>
          <p>{q.question}</p>
          <input onBlur={e => answer(q.key, e.target.value)} />
        </div>
      ))}

      {vars && <button onClick={generate}>Generate Draft</button>}

      {draft && <pre>{draft}</pre>}
    </>
  );
}
