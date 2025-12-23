import { UploadResponse } from "@/types/response";

interface Props {
  result: UploadResponse | null;
}

export default function ResultBox({ result }: Props) {
  if (!result) return null;

  return (
    <div className="card" style={{ marginTop: "30px" }}>
      <h2>✅ Extracted Template</h2>
      <p style={{marginBottom: '12px'}}>
        <strong>File:</strong> {result.filename}
      </p>
      <div style={{background: '#f9fafb', padding: '16px', borderRadius: '8px', maxHeight: '400px', overflowY: 'auto'}}>
        <pre style={{margin: 0, fontSize: '13px', whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>{result.template}</pre>
      </div>
    </div>
  );
}
