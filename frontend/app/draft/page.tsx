"use client";
import { useState } from "react";
import { startDraft, getVars, answerVars, generateDraft } from "../../lib/api";

export default function Draft() {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<any[]>([]);
  const [templateId, setTemplateId] = useState("");
  const [vars, setVars] = useState<any>(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function start() {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setMatches([]);
    setTemplateId(""); // Clear previous template selection
    setVars(null); // Clear previous questions/variables
    setDraft(""); // Clear previous draft
    try {
      const res = await startDraft({ user_query: query });
      if (res.matches && res.matches.length > 0) {
        setMatches(res.matches);
        setError(""); // Clear any previous errors
      } else {
        // No matches found - show user-friendly message
        setError(res.message || "No suitable local template found. Please upload a template first or try a different query.");
        setMatches([]);
      }
    } catch (err: any) {
      const errorMsg = err.message || "No suitable local template found";
      if (errorMsg.includes('connect to server') || errorMsg.includes('fetch')) {
        setError("Unable to connect to the server. Please ensure the backend is running.");
      } else {
        setError("No suitable local template found. Please upload a template first or try a different query.");
      }
      setMatches([]);
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadVars(id: string) {
    setLoading(true);
    setError("");
    try {
      setTemplateId(id);
      const v = await getVars(id);
      setVars(v);
    } catch (err: any) {
      const errorMsg = err.message || "Failed to load template";
      if (errorMsg.includes('connect to server')) {
        setError("Unable to connect to the server. Please ensure the backend is running.");
      } else {
        setError("Failed to load template. Please try again.");
      }
      console.error("Load vars error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function answer(key: string, value: string) {
    try {
      await answerVars(templateId, { [key]: value });
      setVars(await getVars(templateId));
    } catch (err: any) {
      setError("Failed to save answer. Please try again.");
      console.error("Answer error:", err);
    }
  }

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const res = await generateDraft(templateId);
      setDraft(res.draft_md);
    } catch (err: any) {
      setError("Failed to generate draft. Please try again.");
      console.error("Generate error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="center-container">
      <div className="card">
        <h2>Generate Document Draft</h2>
        <p className="subtitle" style={{marginBottom: '20px'}}>Describe what kind of document you need, and we'll find matching templates.</p>
        
        <input 
          type="text"
          placeholder="e.g., 'Service agreement for freelance work'" 
          value={query} 
          onChange={e => setQuery(e.target.value)}
          disabled={loading}
        />
        <button onClick={start} disabled={!query.trim() || loading}>
          {loading && !matches.length ? "Searching..." : "🔍 Find Templates"}
        </button>

        {error && <p style={{color: '#dc2626'}}>{error}</p>}

        {matches.length > 0 && (
          <div style={{marginTop: '24px'}}>
            <h3>📚 Available Templates</h3>
            {matches.map(m => (
              <div key={m.template_id} style={{padding: '12px', background: '#f3f4f6', borderRadius: '8px', marginBottom: '10px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <p style={{fontWeight: '600', marginBottom: '4px'}}>{m.title}</p>
                    <p style={{fontSize: '13px', color: '#6b7280'}}>Match: {(m.confidence * 100).toFixed(0)}%</p>
                  </div>
                  <button onClick={() => loadVars(m.template_id)}>Use This</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {vars && (
          <div style={{marginTop: '24px'}}>
            <h3>❓ Answer Questions</h3>
            <p style={{color: '#6b7280', marginBottom: '16px', fontSize: '14px'}}>Fill in the missing information to customize your document</p>
            {vars?.missing?.map((q: any) => (
              <div key={q.key} style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '6px', fontWeight: '500'}}>{q.question}</label>
                <input 
                  type="text"
                  placeholder={q.example || "Enter value"}
                  onBlur={e => answer(q.key, e.target.value)} 
                />
              </div>
            ))}
            <button onClick={generate} disabled={loading}>
              {loading ? "Generating..." : "✍️ Generate Draft"}
            </button>
          </div>
        )}

        {draft && (
          <div style={{marginTop: '24px'}}>
            <h3>📄 Generated Document</h3>
            <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>{draft}</pre>
          </div>
        )}
      </div>
    </main>
  );
}
