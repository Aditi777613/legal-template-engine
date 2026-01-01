# Legal Template Engine
AI-assisted internal tool for automating repetitive legal drafting

A production-capable MVP that converts legal documents into reusable templates and generates new drafts via a guided chat flow. Designed for law firms, startups, and agencies that want to reduce repetitive drafting time without building tooling from scratch.

★ Who This Is For
~ Small & mid-size law firms
~ Startups dealing with repetitive legal documents
~ Agencies handling contracts, notices, agreements
~ Founders who want an internal legal drafting assistant

👉🏻 This is an internal productivity tool, not a consumer SaaS.

★ The Problem It Solves
Legal drafting is repetitive, slow, and expensive.

Teams often:
~ Rewrite the same documents again and again
~ Copy-paste old drafts manually
~ Miss fields or introduce inconsistencies
~ Waste hours on documents that follow the same structure

👉🏻 This tool automates that workflow.

★ What This Tool Does
1️⃣ Turn Documents into Reusable Templates
~ Upload PDF or DOCX legal documents
~ Automatically extracts only case-specific variables
~ Converts documents into clean Markdown templates

2️⃣ Draft New Documents via Chat
~ Ask for a document in natural language
(e.g. “Draft a notice to insurer in India”)
~ System selects the best matching template
~ Asks only the required questions
~ Generates a clean final draft

3️⃣ Keep Everything Organized
~ Template library with similarity matching
~ Draft history
~ Export drafts as Markdown or Word

★ What Makes It Valuable
~ Cuts repetitive drafting time
~ Enforces structured, consistent documents
~ Works as a private internal tool
~ No vendor lock-in — LLM provider is swappable
~ Clean architecture, easy to customize

★ Demo (2–3 Minutes)
👉🏻 Upload a legal document
👉🏻 Review extracted variables
👉🏻 Ask for a new draft in chat
👉🏻 Answer a few questions
👉🏻 Download the final document

(Demo uses sample documents and demo credentials.)

★ Features at a Glance
~ PDF / DOCX upload (single or batch)
~ Intelligent variable extraction
~ Chat-based document drafting
~ Template similarity search
~ Draft history tracking
~ Export to .md and .docx
~ Modern, responsive UI

★ Tech Overview (for Buyers & Developers)
👉🏻 Backend
~ FastAPI (Python)
~ Pluggable LLM layer (Gemini / OpenAI / Azure compatible)
~ Vector similarity search
~ SQLite (Postgres-ready)

👉🏻 Frontend
~ Next.js (App Router)
~ TypeScript + Tailwind CSS
~ The LLM provider can be swapped easily based on buyer preference.

★ What You Get When You Buy
✅ Full source code (frontend + backend)
✅ Setup & deployment instructions
✅ Demo configuration
✅ Clean, modular architecture
✅ Rights to modify, self-host, and rebrand

★ Typical Use Cases
~ Automating notices, agreements, contracts
~ Internal legal drafting assistant
~ Template-driven document generation
~ Legal ops tooling for startups

★ Customization Examples
~ Add jurisdiction-specific logic
~ Plug in OpenAI / Azure instead of Gemini
~ Add role-based access
~ Replace SQLite with Postgres
~ Extend template categories

★ Important Notes
~ This is a production-capable MVP, not a hosted SaaS
~ Designed for internal use
~ Demo environment uses mock / limited credentials
~ Buyers are expected to configure their own LLM keys

★ License & Usage
~ Source code is provided for internal or commercial use
~ Redistribution as a competing SaaS requires modification
~ No legal advice is provided by this software

★ Support
👉🏻 Includes:
~ Setup guidance
~ Code walkthrough (async)
~ Optional paid customization support

★ Built by
Aditi Chourasia
Full-Stack & DevOps Engineer
