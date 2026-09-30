# 🚀 TalentOS: AI-Driven Recruitment & Student Intelligence Platform

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11%2B-blue?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-005571?style=for-the-badge&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Neon_DB-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini_AI-API-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

**An enterprise-grade, modular AI recruitment platform** that automates resume parsing, skill gap analysis, recruiter queries via Copilot, and real-time webcam-streamed AI mock interviews.

</div>

---

## 🌟 Key Features

| Feature | Description |
|---------|-------------|
| **📄 AI Resume Parsing & 360° Talent Score** | Automatically extracts technical skills, calculates talent scores out of 100, and identifies skill gaps using Google Gemini AI. |
| **🗺️ Dynamic Learning Roadmaps** | Generates personalized action plans and learning steps tailored to target enterprise roles (e.g., SDE-1, DevOps, AI/ML). |
| **🤖 Recruiter Copilot Chatbot** | An embedded HR assistant powered by Gemini that answers natural language queries about candidates in the talent database. |
| **📊 Recruiter Leaderboard & CSV Export** | Real-time candidate ranking, secure PDF CV viewer (`/static/uploads`), and instant Excel-compatible CSV export. |
| **🎙️ Live AI Mock Interview** | Real-time webcam secure video stream, timer, and instant AI answer evaluation with score + constructive technical feedback. |
| **🔒 Enterprise Security & Portability** | Uses `.env` configuration, secure file handling, and cloud-hosted Neon PostgreSQL for seamless multi-device portability. |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js (App Router), Tailwind CSS, TypeScript |
| **Backend** | FastAPI (Python), Uvicorn, Pydantic v2 |
| **AI Engine** | Google Gemini API (`google-genai`) |
| **Database & ORM** | Neon DB (Serverless PostgreSQL), SQLAlchemy, Psycopg v3 |
| **Document Processing** | PyPDF2, Python-Multipart |

---

## ⚙️ Quick Start & Multi-Device Setup Guide

Follow these steps to run TalentOS on your local machine or any new device.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/talentos.git
cd talentos
```

### 2. Backend Setup (`talentos-backend`)

```bash
cd talentos-backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the backend root directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Start the FastAPI server:

```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup (`talentos-frontend`)

Open a **new terminal** window:

```bash
cd talentos-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser to access the application.

---

## 📂 Project Architecture

```
TalentOS/
├── talentos-backend/
│   ├── main.py            # FastAPI endpoints (Resume upload, Copilot, Interview eval)
│   ├── models.py          # SQLAlchemy database schemas (candidates_v2)
│   ├── database.py        # Neon DB connection & session handling
│   ├── requirements.txt   # Python dependencies
│   ├── .env               # Secure environment variables
│   └── uploads/           # Secure CV PDF storage folder
└── talentos-frontend/
    ├── app/
    │   ├── page.tsx       # Landing page
    │   ├── student/       # Student Talent Dashboard & Roadmap
    │   ├── recruiter/     # Recruiter Leaderboard, Copilot & CSV Export
    │   └── interview/     # Live Webcam Stream & AI Mock Interview
    └── package.json
```

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

**Built with ❤️ for smarter hiring & better student growth**

</div>
