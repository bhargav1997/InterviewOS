# InterviewOS 🚀

> **"Turn every job posting into an interview-ready resume."**

InterviewOS is a production-quality, privacy-first Manifest V3 Chrome Extension designed to help job seekers optimize their resumes for job applications **WITHOUT using external AI APIs**.

The extension performs 100% local client-side preprocessing, entity extraction, rule-based ATS scoring, and skill match analysis. It compiles a structured, context-stuffed prompt with guardrails that users can copy and paste into ChatGPT, Claude, Gemini, or any LLM assistant of their choice.

---

## ✨ Features

- **🛡️ 100% Local Privacy Architecture**: Zero external API calls. All parsing (PDF, DOCX, TXT) and entity extraction occur locally in your browser.
- **🔍 Auto-DOM Job Description Extraction**: Detects active job postings on LinkedIn, Indeed, Greenhouse, Lever, Workday, Ashby, BambooHR, and company career pages.
- **📑 Multi-Resume Manager**: Store tailored resume versions locally (e.g., Amazon Resume, Startup Resume, Frontend Resume).
- **📊 Rule-Based ATS Engine**: Evaluates your resume from 0–100 across 13 core ATS metrics (formatting, bullet point quality, quantifiable metrics usage, section order).
- **🧠 Intelligent Match Engine**: Calculates overall match %, skill match %, keyword match %, experience alignment %, missing tech stack, and weak bullet points.
- **⚡ Prompt Studio (16 Role Templates)**: Generates detailed prompts tailored for roles like Senior Software Engineer, Frontend Developer, Backend Developer, Full Stack Developer, React Specialist, Java Developer, DevOps, Cloud, Startup, Healthcare, and Finance.
- **📌 Local Job Application Tracker**: Built-in application stage pipeline (Wishlist, Saved, Applied, Interview, Offer, Rejected, Ghosted) with salary tracking and interview notes.

---

## 🛠️ Technology Stack

- **Framework**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide Icons
- **Parsers**: PDF.js (`pdfjs-dist`), Mammoth.js (`mammoth`)
- **Storage**: Chrome Storage API, IndexedDB
- **Extension Standard**: Chrome Manifest V3 (Side Panel & Dashboard)

---

## 🚀 Getting Started & Loading into Chrome

### 1. Installation & Build

Ensure you have Node.js (v18+) installed, then run:

```bash
# Clone or navigate to the directory
cd InterviewOS

# Install dependencies
npm install

# Build the production Chrome Extension bundle
npm run build
```

The compiled build will be generated inside the `dist/` directory.

---

### 2. Load Extension in Chrome

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** using the toggle switch in the top right corner.
3. Click the **Load unpacked** button in the top left corner.
4. Select the `dist/` directory inside your `InterviewOS` project folder.
5. Click on the extension icon or open Chrome Side Panel to launch **InterviewOS**!

---

## 📂 Project Folder Structure

```
InterviewOS/
├── public/
│   └── manifest.json         # Chrome Manifest V3 definition
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── layout/           # Sidebar, Navbar, Layout wrappers
│   │   └── ui/               # CircularScore gauge, KeywordHeatmap, ProgressBar
│   ├── content/              # Content scripts & DOM job scrapers
│   ├── background/           # Service worker background scripts
│   ├── engine/               # Matching, ATS scoring, Prompt generator & templates
│   ├── parser/               # Local PDF, DOCX, TXT & section extractors
│   ├── pages/                # Dashboard, Resume, Analysis, ATS, Prompt, Tracker, Settings
│   ├── services/             # Local storage & Job tracker database services
│   ├── taxonomy/             # Local skill taxonomy & action verb dictionaries
│   ├── types/                # Strict TypeScript interfaces
│   ├── App.tsx               # Main state coordinator
│   └── index.css             # Tailwind CSS tokens & custom styling
├── vite.config.ts            # Extension multi-entry Vite config
└── package.json
```

---

## 🛣️ Future Roadmap

- Cover letter generation pre-processor
- LinkedIn profile & summary optimizer
- Auto-fill application form companion
- Multi-language support (ES, FR, DE, JA)
- Offline export/import encrypted backups
