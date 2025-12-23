"use client";
import { useState } from "react";
import { uploadFile, saveTemplate } from "../../lib/api";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const res = await uploadFile(file);
      setData(res);
    } catch (err: any) {
      setError("Failed to process document. Please try another file.");
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!data) return;
    setLoading(true);
    try {
      await saveTemplate(data.template_id);
      setError("");
      alert("Template saved successfully!");
      setData(null);
      setFile(null);
    } catch (err: any) {
      setError("Failed to save template.");
    } finally {
      setLoading(false);
    }
  }

  function handleDiscard() {
    setData(null);
    setFile(null);
    setError("");
  }

  return (
    <main className="center-container">
      <div className="card">
        <h2>Upload & Extract Template</h2>
        <p className="subtitle" style={{marginBottom: '20px'}}>Upload a legal document to automatically extract variables and create a reusable template.</p>
        
        <input 
          type="file" 
          accept=".pdf,.doc,.docx,.txt"
          onChange={e => setFile(e.target.files?.[0] || null)} 
          disabled={loading}
        />
        <button onClick={submit} disabled={!file || loading}>
          {loading ? "Processing..." : "📤 Upload & Analyze"}
        </button>

        {error && <p style={{color: '#dc2626', marginBottom: '16px'}}>{error}</p>}

        {data && (
          <div style={{marginTop: '24px'}}>
            <h3>📋 Extracted Template</h3>
            <p><strong>Title:</strong> {data.title || "Untitled"}</p>
            <p><strong>Type:</strong> {data.doc_type || "Legal Document"}</p>
            <h3 style={{marginTop: '20px'}}>Variables Detected:</h3>
            <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '12px'}}>
              The following variables were automatically extracted from your document. Each variable represents a field that can be customized when generating drafts.
            </p>
            <pre>{JSON.stringify(data.variables, null, 2)}</pre>
            <div style={{display: 'flex', gap: '12px', marginTop: '16px'}}>
              <button onClick={handleSave} disabled={loading} style={{marginBottom: '0'}}>
                {loading ? "Saving..." : "💾 Save Template"}
              </button>
              <button onClick={handleDiscard} disabled={loading} style={{background: '#ef4444', marginBottom: '0'}}>
                🗑️ Discard
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
