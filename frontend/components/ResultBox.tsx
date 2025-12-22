import { UploadResponse } from "@/types/response";

interface Props {
  result: UploadResponse | null;
}

export default function ResultBox({ result }: Props) {
  if (!result) return null;

  return (
    <div className="card" style={{ marginTop: "30px" }}>
      <h2>Extracted Template</h2>
      <p>
        <strong>File:</strong> {result.filename}
      </p>
      <textarea readOnly value={result.template} />
    </div>
  );
}
