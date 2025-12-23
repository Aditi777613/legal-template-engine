export default function HomePage() {
  return (
    <main className="center-container">
      <div className="card">
        <h1 className="title">
          Legal Template Engine
        </h1>

        <p className="subtitle">
          Transform legal documents into intelligent templates. Upload documents, extract variables, and generate customized drafts with AI assistance.
        </p>

        <div className="actions">
          <a href="/upload" className="action-btn primary">
            📄 Upload & Extract Template
          </a>

          <a href="/draft" className="action-btn">
            ✍️ Generate Draft
          </a>

          <a href="/history" className="action-btn">
            📋 View History
          </a>
        </div>
      </div>
    </main>
  );
}
