export default function HomePage() {
  return (
    <main className="center-container">
      <div className="card">
        <h1 className="title">
          ⚖️ Legal Template Engine
        </h1>

        <p className="subtitle">
          Convert legal documents into reusable templates and generate drafts using AI.
        </p>

        <div className="actions">
          <a href="/upload" className="action-btn primary">
            📄 Upload Template
          </a>

          <a href="/draft" className="action-btn">
            ✍️ Draft Document
          </a>

          <a href="/history" className="action-btn">
            🕘 Draft History
          </a>
        </div>
      </div>

      {/* UOIONHHC */}
    </main>
  );
}
