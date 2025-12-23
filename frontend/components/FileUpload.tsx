"use client";

import { useState } from "react";
import { uploadFile } from "@/lib/api";
import { UploadResponse } from "@/types/response";

interface Props {
  onResult: (data: UploadResponse) => void;
}

export default function FileUpload({ onResult }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const result = await uploadFile(file);
      onResult(result);
    } catch (err) {
      setError("Upload failed. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>📤 Upload Legal Document</h2>
      <p style={{marginBottom: '20px', color: '#6b7280'}}>Upload a PDF, Word document, or text file to extract template variables</p>

      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        disabled={loading}
      />

      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? "Processing..." : "📄 Upload & Process"}
      </button>

      {error && <p style={{ color: "#dc2626", marginTop: "12px" }}>{error}</p>}
    </div>
  );
}
