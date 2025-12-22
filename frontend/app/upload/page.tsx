"use client";
import { useState } from "react";
import { uploadFile, saveTemplate } from "../../lib/api";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any>(null);

  async function submit() {
    if (!file) return;
    const res = await uploadFile(file);
    setData(res);
  }

  return (
    <>
      <h2>Upload Legal Document</h2>
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={submit}>Upload</button>

      {data && (
        <>
          <h3>Detected Variables</h3>
          <pre>{JSON.stringify(data.variables, null, 2)}</pre>
          <button onClick={() => saveTemplate(data.template_id)}>Save Template</button>
        </>
      )}
    </>
  );
}
