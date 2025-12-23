"use client";
import { useState } from "react";
import { startDraft, getVars, answerVars, generateDraft, downloadDraftMd, downloadDraftDocx } from "../../lib/api";

export default function Draft() {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<any[]>([]);
  const [templateId, setTemplateId] = useState("");
  const [vars, setVars] = useState<any>(null);
  const [draft, setDraft] = useState("");
  const [instanceId, setInstanceId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [webDocs, setWebDocs] = useState<any[]>([]);
  const [showWebBootstrap, setShowWebBootstrap] = useState(false);
  const [processingDocIndex, setProcessingDocIndex] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [webSearchLoading, setWebSearchLoading] = useState(false);

  async function start() {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setMatches([]);
    setTemplateId(""); 
    setVars(null); 
    setDraft(""); 
    setInstanceId(null);
    setShowAlternatives(false);
    setWebDocs([]);
    setShowWebBootstrap(false);
    try {
      const res = await startDraft({ user_query: query });
      if (res.matches && res.matches.length > 0) {
        setMatches(res.matches);
        setError(""); 
      } else if (res.web_bootstrap) {
        // Trigger web bootstrap
        setShowWebBootstrap(true);
        triggerWebBootstrap();
      } else {
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

  async function triggerWebBootstrap() {
    setWebSearchLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/draft/web-bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_query: query })
      });
      const data = await res.json();
      
      if (data.documents && data.documents.length > 0) {
        setWebDocs(data.documents);
        setError("");
      } else {
        setError("No similar documents found online. Please try uploading a template.");
      }
    } catch (err: any) {
      setError("Web search failed. " + (err.message || "Please check if EXA_API_KEY is configured."));
    } finally {
      setWebSearchLoading(false);
    }
  }

  async function createFromWebDoc(docIndex: number) {
    setLoading(true);
    setProcessingDocIndex(docIndex);
    console.log("Creating template from web doc index:", docIndex);
    console.log("Current query:", query);
    
    try {
      console.log("Making fetch request...");
      const res = await fetch("http://127.0.0.1:8000/draft/web-bootstrap/create-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_query: query,
          doc_index: docIndex 
        })
      });
      
      console.log("Response received, status:", res.status);
      
      if (!res.ok) {
        console.error("HTTP error:", res.status, res.statusText);
        const errorText = await res.text();
        console.error("Error response:", errorText);
        setError(`HTTP ${res.status}: ${res.statusText}`);
        return;
      }
      
      const data = await res.json();
      console.log("Parsed response data:", data);
      
      if (data.success && data.template_id) {
        console.log("Template created successfully:", data.template_id);
        alert(`✅ Template created: ${data.title}`);
        // Load the newly created template
        await loadVars(data.template_id);
        setShowWebBootstrap(false);
        setWebDocs([]);
      } else {
        console.error("Template creation failed:", data);
        setError(data.message || "Failed to create template from web document.");
      }
    } catch (err: any) {
      console.error("Network or parsing error:", err);
      setError("Failed to create template from web document: " + (err.message || "Network error"));
    } finally {
      setLoading(false);
      setProcessingDocIndex(null);
    }
  }

  async function loadVars(id: string) {
    setLoading(true);
    setError("");
    try {
      setTemplateId(id);
      const v = await getVars(id);
      setVars(v);
      setShowAlternatives(false);
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
      setInstanceId(res.instance_id);
    } catch (err: any) {
      setError("Failed to generate draft. Please try again.");
      console.error("Generate error:", err);
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    if (draft) {
      navigator.clipboard.writeText(draft);
      alert("Draft copied to clipboard!");
    }
  }

  function handleDownloadMd() {
    if (instanceId) {
      downloadDraftMd(instanceId);
    }
  }

  function handleDownloadDocx() {
    if (instanceId) {
      downloadDraftDocx(instanceId);
    }
  }

  function handleEditVariables() {
    setDraft("");
    setInstanceId(null);
    setEditMode(true);
    // Variables are still loaded, user can edit and regenerate
  }

  function handleRegenerate() {
    generate();
  }

  return (
    <main className="center-container">
      <div className="card">
        <h2>💬 Chat Function - Generate Document Draft</h2>
        <p className="subtitle" style={{marginBottom: '20px'}}>Describe what kind of document you need, and we'll find matching templates.</p>
        
        <input 
          type="text"
          placeholder="e.g., 'Draft a notice to insurer in India' or /draft 'Service agreement for freelance work'" 
          value={query} 
          onChange={e => setQuery(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && start()}
          disabled={loading}
        />
        <button onClick={start} disabled={!query.trim() || loading}>
          {loading && !matches.length ? "Searching..." : "🔍 Find Templates"}
        </button>

        {error && <p style={{color: '#dc2626', marginTop: '12px'}}>{error}</p>}

        {/* Web Bootstrap Section */}
        {showWebBootstrap && (
          <div style={{marginTop: '24px'}}>
            {webSearchLoading ? (
              <div style={{background: '#fef3c7', padding: '20px', borderRadius: '12px', border: '1px solid #f59e0b', marginBottom: '16px'}}>
                <h3 style={{color: '#92400e', marginBottom: '8px'}}>🌐 Web Bootstrap: Searching Online</h3>
                <p style={{fontSize: '14px', color: '#78350f'}}>
                  No local template found, searching the web for similar documents...
                </p>
                <div style={{display: 'flex', alignItems: 'center', marginTop: '12px'}}>
                  <div style={{width: '20px', height: '20px', border: '2px solid #f59e0b', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '12px'}}></div>
                  <span style={{color: '#92400e'}}>Searching...</span>
                </div>
              </div>
            ) : webDocs.length > 0 ? (
              <>
                <div style={{background: '#fef3c7', padding: '20px', borderRadius: '12px', border: '1px solid #f59e0b', marginBottom: '16px'}}>
                  <h3 style={{color: '#92400e', marginBottom: '8px'}}>🌐 Web Bootstrap: Similar Documents Found</h3>
                  <p style={{fontSize: '14px', color: '#78350f'}}>
                    No local template matched your request. We found {webDocs.length} similar document(s) online. Select one to create a template and continue.
                  </p>
                </div>

                {webDocs.map((doc, idx) => (
                  // Only show the document being processed, or all if none are processing
                  (processingDocIndex === null || processingDocIndex === idx) && (
                    <div key={idx} style={{background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #e5e7eb'}}>
                      <h4 style={{fontSize: '16px', fontWeight: '600', marginBottom: '8px'}}>{doc.title}</h4>
                      <p style={{fontSize: '13px', color: '#6b7280', marginBottom: '8px'}}>
                        <strong>Source:</strong> <a href={doc.source} target="_blank" rel="noopener noreferrer" style={{color: '#4f46e5', wordBreak: 'break-all', display: 'inline-block', maxWidth: '100%'}}>{doc.source}</a>
                      </p>
                      <p style={{fontSize: '13px', color: '#374151', marginBottom: '12px', lineHeight: '1.5'}}>
                        {doc.snippet.substring(0, 200)}...
                      </p>
                      <button onClick={() => createFromWebDoc(idx)} disabled={loading}>
                        {processingDocIndex === idx ? "Creating..." : loading ? "Please wait..." : "🔄 Create Template & Continue"}
                      </button>
                    </div>
                  )
                ))}
              </>
            ) : null}
          </div>
        )}

        {matches.length > 0 && !templateId && (
          <div style={{marginTop: '24px'}}>
            <div style={{background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb'}}>
              <h3>📚 Template Match Card</h3>
              
              {/* Top Match */}
              <div style={{background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '2px solid #4f46e5'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px'}}>
                  <div style={{flex: 1}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                      <span style={{background: '#4f46e5', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600'}}>
                        TOP MATCH
                      </span>
                      <span style={{color: '#4f46e5', fontWeight: '600', fontSize: '14px'}}>
                        {(matches[0].confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    <p style={{fontWeight: '600', fontSize: '18px', marginBottom: '6px'}}>{matches[0].title}</p>
                    <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '8px'}}>
                      <strong>Why this matches:</strong> {matches[0].reason}
                    </p>
                    <p style={{fontSize: '13px', color: '#9ca3af'}}>Template ID: {matches[0].template_id}</p>
                  </div>
                </div>
                <button onClick={() => loadVars(matches[0].template_id)} style={{marginRight: '8px', marginBottom: '0'}}>
                  ✅ Use This Template
                </button>
                {matches.length > 1 && (
                  <button 
                    onClick={() => setShowAlternatives(!showAlternatives)}
                    style={{background: '#6b7280', marginBottom: '0'}}
                  >
                    {showAlternatives ? '▲' : '▼'} See Alternatives ({matches.length - 1})
                  </button>
                )}
              </div>

              {/* Alternatives */}
              {showAlternatives && matches.length > 1 && (
                <div>
                  <h4 style={{fontSize: '14px', color: '#6b7280', marginBottom: '12px'}}>Alternative Templates:</h4>
                  {matches.slice(1).map((m, idx) => (
                    <div key={m.template_id} style={{background: 'white', padding: '12px', borderRadius: '8px', marginBottom: '8px', border: '1px solid #e5e7eb'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div style={{flex: 1}}>
                          <p style={{fontWeight: '600', marginBottom: '4px'}}>{m.title}</p>
                          <p style={{fontSize: '13px', color: '#6b7280'}}>Match: {(m.confidence * 100).toFixed(0)}%</p>
                        </div>
                        <button onClick={() => loadVars(m.template_id)} style={{padding: '8px 16px', fontSize: '13px'}}>
                          Use This
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {vars && !draft && (
          <div style={{marginTop: '24px'}}>
            <div style={{background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '20px'}}>
              <h3>📊 Progress: {vars.title}</h3>
              <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '12px'}}>
                Template: <strong>{vars.template_id}</strong>
              </p>
              <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
                <div>
                  <span style={{color: '#059669', fontWeight: '600'}}>✓ Answered:</span> {Object.keys(vars.answered || {}).length}
                </div>
                <div>
                  <span style={{color: '#dc2626', fontWeight: '600'}}>○ Missing:</span> {vars.missing?.length || 0}
                </div>
              </div>
            </div>

            <h3>❓ {editMode ? "Edit Variables" : "Answer Questions"}</h3>
            <p style={{color: '#6b7280', marginBottom: '16px', fontSize: '14px'}}>
              {editMode ? "Edit the variable values below:" : "Fill in the missing information to customize your document"}
            </p>
            
            {/* Show all variables in edit mode, only missing in normal mode */}
            {(editMode ? vars?.all_variables : vars?.missing)?.map((q: any) => (
              <div key={q.key} style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '6px', fontWeight: '500'}}>
                  {editMode ? q.label : q.question}
                </label>
                <input 
                  type="text"
                  placeholder={q.example || "Enter value"}
                  defaultValue={vars?.answered?.[q.key] || ""}
                  onBlur={e => answer(q.key, e.target.value)} 
                />
              </div>
            ))}
            
            {editMode && (!vars?.all_variables || vars.all_variables.length === 0) && (
              <p style={{color: '#6b7280', fontStyle: 'italic'}}>No variables to edit.</p>
            )}
            
            {!editMode && (!vars?.missing || vars.missing.length === 0) && (
              <p style={{color: '#059669', fontStyle: 'italic'}}>All required variables have been filled. Click "Generate Draft" to continue.</p>
            )}
            
            <button onClick={generate} disabled={loading}>
              {loading ? "Generating..." : editMode ? "🔄 Update & Regenerate Draft" : "✍️ Generate Draft"}
            </button>
          </div>
        )}

        {draft && (
          <div style={{marginTop: '24px'}}>
            <div style={{background: '#f0fdf4', padding: '20px', borderRadius: '12px', border: '2px solid #10b981', marginBottom: '20px'}}>
              <h3 style={{color: '#059669', marginBottom: '12px'}}>✅ Draft Generated Successfully!</h3>
              <p style={{fontSize: '14px', color: '#065f46'}}>
                Your document has been generated. You can copy it, download it, or edit variables and regenerate.
              </p>
            </div>

            <div style={{marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
              <button onClick={copyToClipboard} style={{marginBottom: '0'}}>
                📋 Copy to Clipboard
              </button>
              <button onClick={handleDownloadMd} style={{background: '#059669', marginBottom: '0'}}>
                📄 Download .md
              </button>
              <button onClick={handleDownloadDocx} style={{background: '#2563eb', marginBottom: '0'}}>
                📄 Download .docx
              </button>
              <button onClick={handleEditVariables} style={{background: '#f59e0b', marginBottom: '0'}}>
                ✏️ Edit Variables
              </button>
              <button onClick={handleRegenerate} disabled={loading} style={{background: '#8b5cf6', marginBottom: '0'}}>
                {loading ? "Regenerating..." : "🔄 Regenerate"}
              </button>
            </div>

            <h3>📄 Generated Document</h3>
            <div style={{background: '#f9fafb', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', maxHeight: '500px', overflowY: 'auto'}}>
              <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, fontSize: '13px', lineHeight: '1.6'}}>{draft}</pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}