"use client";
import { useEffect, useState } from "react";
import { history } from "../../lib/api";

export default function History() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    history().then(res => setItems(res.drafts));
  }, []);

  return (
    <>
      <h2>Draft History</h2>
      <ul>
        {items.map(i => (
          <li key={i.instance_id}>
            Draft #{i.instance_id} – {i.template_id}
          </li>
        ))}
      </ul>
    </>
  );
}
