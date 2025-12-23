"use client";
import { useEffect, useState } from "react";
import { history } from "../../lib/api";

export default function History() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await history();
        setItems(res.drafts || []);
      } catch (err: any) {
        setError("Failed to load draft history.");
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  return (
    <main className="center-container">
      <div className="card">
        <h2>📋 Draft History</h2>
        <p className="subtitle">View all previously generated documents</p>

        {loading && <p style={{textAlign: 'center', color: '#6b7280'}}>Loading history...</p>}
        {error && <p style={{color: '#dc2626'}}>{error}</p>}

        {!loading && items.length === 0 && (
          <p style={{textAlign: 'center', color: '#6b7280', padding: '40px 0'}}>No drafts yet. <a href="/draft" style={{color: '#4f46e5', textDecoration: 'none'}}>Create your first draft</a></p>
        )}

        {items.length > 0 && (
          <div>
            {items.map((i, idx) => (
              <div key={i.instance_id || idx} style={{padding: '16px', background: '#f9fafb', borderRadius: '8px', marginBottom: '12px', border: '1px solid #e5e7eb'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                  <div>
                    <p style={{fontWeight: '600', marginBottom: '4px'}}>Draft #{i.instance_id}</p>
                    <p style={{fontSize: '13px', color: '#6b7280'}}>Template: {i.template_id}</p>
                    {i.created_at && <p style={{fontSize: '13px', color: '#6b7280'}}>Created: {new Date(i.created_at).toLocaleDateString()}</p>}
                  </div>
                  <button style={{whiteSpace: 'nowrap'}}>View</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
