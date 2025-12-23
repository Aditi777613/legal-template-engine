# Legal Template Engine

**Created by UOIONHHC**

An AI-powered legal document templating system that converts legal documents into reusable Markdown templates with intelligent variable extraction and chat-based drafting.

## 🎯 Features

- **Document Upload**: Upload PDF/DOCX files (single or batch up to 5) and automatically extract variables
- **Batch Template Creation**: Upload up to 5 documents at once for efficient template generation
- **Smart Templating**: AI-powered variable detection with Vertex AI (Gemini)
- **Chat-Based Drafting**: Intuitive chat interface for document generation
- **Template Matching**: Vector similarity search for best template selection
- **Web Bootstrap**: Falls back to Exa.ai when no local template matches (bonus feature)
- **Draft History**: Track all generated documents
- **Export Options**: Download drafts as Markdown (.md) or Word documents (.docx)
- **Modern UI**: Beautiful, responsive interface with glassmorphism design

## 🛠️ Tech Stack

### Backend
- **Python 3.10+** with FastAPI
- **Vertex AI (Gemini 2.0 Flash)** for LLM operations and embeddings
- **SQLAlchemy** with SQLite for database
- **pdfplumber** for PDF text extraction
- **python-docx** for DOCX parsing and generation

### Frontend
- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS** for styling
- **Modern glassmorphism UI**

### Optional (Bonus)
- **Exa.ai** for web document retrieval when no local template matches

## 📋 Prerequisites

1. **Python 3.10+**
2. **Node.js 20+**
3. **Google Cloud Project** with Vertex AI API enabled
4. **Google Cloud credentials** configured (set GOOGLE_APPLICATION_CREDENTIALS or use gcloud auth)
5. (Optional) **Exa API Key** for web bootstrap feature

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd legal-template-engine
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# Create a .env file in backend/ folder
```

**Google Cloud Setup:**
1. Create a Google Cloud project
2. Enable Vertex AI API
3. Set up authentication (one of):
   - `gcloud auth application-default login` (recommended)
   - Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable to service account key file
4. Update `backend/gemini.py`, `backend/embeddings/embedder.py`, and other files with your project ID

**backend/.env** file (optional, for Exa):
```env
EXA_API_KEY=your_exa_api_key_here  # Optional for bonus feature
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# No environment variables needed - API calls go through localhost:8000
```

### 4. Database Initialization

The database will be automatically created on first run. Tables include:
- `templates` - Stores document templates with embeddings
- `template_variables` - Variable definitions
- `documents` - Uploaded documents
- `instances` - Draft history

## 🏃 Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## 📐 Architecture Overview

```
┌─────────────┐
│   Next.js   │
│   Frontend  │
└──────┬──────┘
       │ HTTP/REST
       ▼
┌─────────────┐      ┌──────────┐
│   FastAPI   │─────▶│  Gemini  │
│   Backend   │      │   API    │
└──────┬──────┘      └──────────┘
       │
       ├──▶ SQLite DB
       │
       └──▶ Exa.ai (optional)
```

### Key Components

1. **Document Upload Flow**
   - Extract text from PDF/DOCX
   - Send to Gemini for variable extraction
   - Store template with embeddings in database

2. **Drafting Flow**
   - User enters request in chat
   - Generate embedding and find matching template
   - Ask questions for missing variables
   - Render final draft with variable substitution

3. **Web Bootstrap** (Bonus)
   - When no local template matches
   - Use Exa.ai to find similar documents
   - Templatize and continue normal flow

## 🎨 Prompt Design

### Variable Extraction Prompt
```python
system_prompt = """
You are a legal document templating assistant.

STRICT RULES:
1. Extract ONLY party-specific, case-specific facts
2. DO NOT variable-ize statutes or legal provisions
3. Date format MUST be ISO 8601 (YYYY-MM-DD)
4. Keys MUST be snake_case
5. Output STRICT JSON ONLY

For each variable include:
- key, label, description, example, required, dtype, regex
"""
```

### Template Selection Prompt
```python
classifier_prompt = """
Given this user ask, return the best template_id(s) and justification.
If confidence < 0.6, return none.
Consider doc_type, jurisdiction, and similarity_tags.
"""
```

### Question Generation Prompt
```python
question_prompt = """
Convert each variable into a polite, unambiguous question.
Bad: "policy_number?"
Good: "What is the insurance policy number exactly as it appears on the policy schedule?"
"""
```

## 📁 Project Structure

```
legal-template-engine/
├── backend/
│   ├── main.py              # FastAPI endpoints
│   ├── gemini.py            # Gemini API integration
│   ├── templating/          # Template building logic
│   │   ├── builder.py
│   │   ├── normalizer.py
│   │   ├── replacer.py
│   │   └── schema.py
│   ├── embeddings/          # Vector embeddings
│   │   └── embedder.py
│   ├── retrieval/           # Template selection
│   │   └── selector.py
│   ├── qa/                  # Question generation
│   │   └── questions.py
│   ├── drafting/            # Draft rendering
│   │   └── renderer.py
│   ├── web_bootstrap/       # Exa.ai integration
│   │   └── exa_client.py
│   ├── db/                  # Database models
│   │   ├── database.py
│   │   ├── models.py
│   │   └── crud.py
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Homepage
│   │   ├── upload/
│   │   │   └── page.tsx     # Upload interface
│   │   ├── draft/
│   │   │   └── page.tsx     # Chat interface
│   │   └── history/
│   │       └── page.tsx     # Draft history
│   ├── lib/
│   │   └── api.ts           # API client
│   └── components/          # Reusable components
└── README.md
```

## 🔒 Data Model

### Template
- `template_id`: Unique identifier (e.g., tpl_abc123)
- `title`: Human-readable name
- `doc_type`: Category (e.g., "legal_notice")
- `jurisdiction`: Legal jurisdiction (e.g., "IN")
- `similarity_tags`: Array of tags for matching
- `body_md`: Markdown template with {{variables}}
- `embedding`: Vector embedding for similarity search

### TemplateVariable
- `template_id`: Foreign key to template
- `key`: Variable name (snake_case)
- `label`: Human-friendly label
- `description`: What this variable represents
- `example`: Sample value
- `required`: Boolean flag
- `dtype`: Data type (string, date, number)
- `regex`: Optional validation pattern

## 🎯 Template Format

```markdown
---
template_id: tpl_incident_notice_v1
title: Incident Notice to Insurer
jurisdiction: IN
doc_type: legal_notice
variables:
  - key: claimant_full_name
    label: Claimant's full name
    description: Person/entity raising the claim
    example: "Rajesh Kumar"
    required: true
    dtype: string
  - key: incident_date
    label: Date of incident
    description: ISO 8601 format
    example: "2025-07-12"
    required: true
    dtype: date
similarity_tags: ["insurance", "notice", "india"]
---

Dear Sir/Madam,

On {{incident_date}}, {{claimant_full_name}} hereby notifies you under Policy {{policy_number}}...

[Template body continues...]
```

## 🧪 Testing the Application

### 1. Upload Templates
**Single Upload:**
1. Go to Upload page
2. Drag & drop or select a legal document (PDF/DOCX)
3. Review extracted variables
4. Click "Confirm & Save Template"

**Batch Upload (up to 5 templates):**
1. Go to Upload page
2. Toggle "Batch" mode
3. Drag & drop or select multiple documents (up to 5)
4. Review all extracted templates
5. Templates are automatically saved

### 2. Draft a Document
1. Go to Draft page
2. Type: "Draft a notice to insurer in India"
3. System will find matching template
4. Answer the questions presented
5. Click "Generate Final Draft"
6. Download or copy the result

### 3. View History
1. Go to History page
2. See all generated drafts
3. Click to view details

## 🚨 Important Notes

1. **Gemini API Limits**: Free tier has rate limits. Monitor usage.
2. **File Size**: Max 10MB per upload (configurable in code)
3. **Supported Formats**: PDF, DOCX, TXT
4. **Database**: SQLite is used for development. For production, consider PostgreSQL.

## 🎁 Bonus Features

- ✅ Web bootstrap with Exa.ai for missing templates
- ✅ Beautiful modern UI with glassmorphism
- ✅ Real-time chat interface
- ✅ Variable validation with regex
- ✅ Draft history tracking
- ✅ Export to Markdown
- ✅ Copy to clipboard functionality

## 🐛 Troubleshooting

### Backend won't start
- Check if Python virtual environment is activated
- Verify all dependencies are installed
- Ensure Gemini API key is set in .env

### Frontend won't start
- Run `npm install` again
- Check Node.js version (should be 20+)
- Clear Next.js cache: `rm -rf .next`

### "No template found" always
- Make sure you've uploaded at least one template
- Check database file exists: `backend/legal_templates.db`
- Try uploading a test document first

### Gemini API errors
- Verify API key is correct
- Check rate limits haven't been exceeded
- Ensure internet connectivity

## 📊 Sample Output

### Example Template
```markdown
---
template_id: tpl_8a9b2cd3ef
title: Property Lease Agreement
---

LEASE AGREEMENT

THIS AGREEMENT made on {{agreement_date}} between:

1. {{lessor_name}} (hereinafter "Lessor")
2. {{lessee_name}} (hereinafter "Lessee")

For property located at: {{property_address}}

Monthly rent: ₹{{monthly_rent}}
Lease period: {{lease_start_date}} to {{lease_end_date}}

[... template continues ...]
```

### Example Questions Generated
- "What is the full name of the Lessor (property owner)?"
- "What is the full name of the Lessee (tenant)?"
- "What is the complete address of the property?"
- "What is the monthly rent amount in INR?"
- "What is the lease start date (YYYY-MM-DD)?"

### Example Final Draft
```markdown
LEASE AGREEMENT

THIS AGREEMENT made on 2025-01-15 between:

1. Rajesh Kumar (hereinafter "Lessor")
2. Priya Sharma (hereinafter "Lessee")

For property located at: 123 MG Road, Bangalore 560001

Monthly rent: ₹25000
Lease period: 2025-02-01 to 2026-01-31
```

## 📝 Watermark

All files contain the tracking identifier: **UOIONHHC**

## 🤝 Credits

- Built for Lexi (YC F25)
- Powered by Google Gemini API
- Optional web search by Exa.ai
- Created with ❤️ by UOIONHHC

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review the code comments
- Test with sample documents first

---

**UOIONHHC - Production Ready Legal Template Engine**