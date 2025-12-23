"use client";
import { useState } from "react";
import { uploadFile, saveTemplate, exportVariables } from "../../lib/api";

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
      alert("✅ Template saved successfully! You can now use it to generate drafts.");
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

  function handleExportJSON() {
    if (data && data.template_id) {
      exportVariables(data.template_id, 'json');
    }
  }

  function handleExportCSV() {
    if (data && data.template_id) {
      exportVariables(data.template_id, 'csv');
    }
  }

  return (
    <main className="center-container">
      <div className="card">
        <h2>📤 Upload & Extract Template</h2>
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
            <div style={{background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #10b981', marginBottom: '20px'}}>
              <h3 style={{color: '#059669', marginBottom: '8px'}}>✅ Template Extracted Successfully!</h3>
              <p style={{fontSize: '14px', color: '#065f46', marginBottom: '8px'}}>
                <strong>Title:</strong> {data.title || "Untitled"}
              </p>
              <p style={{fontSize: '14px', color: '#065f46', marginBottom: '8px'}}>
                <strong>Type:</strong> {data.doc_type || "Legal Document"}
              </p>
              <p style={{fontSize: '14px', color: '#065f46'}}>
                <strong>Variables Detected:</strong> {data.variables?.length || 0}
              </p>
            </div>

            <h3 style={{marginTop: '20px'}}>📋 Variables Detected:</h3>
            <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '12px'}}>
              The following variables were automatically extracted from your document. Each variable represents a field that can be customized when generating drafts.
            </p>
            
            <div style={{background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', maxHeight: '300px', overflowY: 'auto', marginBottom: '16px'}}>
              <pre style={{margin: 0, fontSize: '13px', whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>{JSON.stringify(data.variables, null, 2)}</pre>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                <button onClick={handleSave} disabled={loading} style={{marginBottom: '0', flex: 1, minWidth: '140px'}}>
                  {loading ? "Saving..." : "💾 Save Template"}
                </button>
                <button onClick={handleDiscard} disabled={loading} style={{background: '#ef4444', marginBottom: '0', flex: 1, minWidth: '140px'}}>
                  🗑️ Discard
                </button>
              </div>

              <div style={{borderTop: '1px solid #e5e7eb', paddingTop: '12px'}}>
                <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '8px', fontWeight: '500'}}>
                  📊 Export Variables:
                </p>
                <div style={{display: 'flex', gap: '8px'}}>
                  <button onClick={handleExportJSON} style={{background: '#6366f1', marginBottom: '0', flex: 1}}>
                    📄 Export as JSON
                  </button>
                  <button onClick={handleExportCSV} style={{background: '#10b981', marginBottom: '0', flex: 1}}>
                    📊 Export as CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}