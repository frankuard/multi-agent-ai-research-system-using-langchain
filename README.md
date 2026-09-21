# AI Research Assistant

A multi-agent research assistant built with **LangChain**, **Groq LLM**, **Tavily Web Search**, **FastAPI**, **React**, and **Tailwind CSS**.

---

## 🌟 Key Features

- **Autonomous 4-Agent Orchestration**:
  1. **🌐 Search Agent**: Leverages Tavily to fetch real-time, authoritative search snippets and top URLs.
  2. **📖 Reader Agent**: Selects the most informative link and extracts clean, full-text content using BeautifulSoup.
  3. **✍️ Writer Chain**: Synthesizes findings using LangChain LCEL into an organized report (Introduction, Key Findings, Conclusion, and Sources).
  4. **⚖️ Critic Chain**: Strictly evaluates and scores the report, outlining key strengths, flaws, and a verdict.
- **Modern Tailwind CSS Interface**:
  - **Dynamic Pipeline Tracker**: Visualizes the 4 autonomous stages in real-time.
  - **Structured Markdown Report**: Styled with typography, word count, reading time, and direct markdown export.
  - **Audit & Critic Card**: Color-coded score badge, strengths tags, areas for improvement, and verdict callout.
  - **Agent Telemetry Drawer**: Inspect raw Tavily search hits and scraped webpage content for full transparency.
  - **One-Click Quick Topics**: Instant inspiration pills for trending research topics.

---

## 📁 Project Architecture

```
multi-agent-ai-research/
├── backend/
│   ├── main.py              # FastAPI server (exposes /research endpoint & CORS)
│   ├── agents.py            # Search & reader agents, writer & critic chains
│   ├── tools.py             # Tavily web search & BeautifulSoup scraping tools
│   ├── pipeline.py          # Sequential multi-agent pipeline orchestrator
│   ├── .env                 # API keys (GROQ_API_KEY, TAVILY_API_KEY)
│   └── requirements.txt     # Python backend dependencies
│
└── frontend/
    ├── src/
    │   ├── App.jsx          # Master application shell & state orchestration
    │   ├── api.js           # API bridge to FastAPI backend
    │   ├── index.css        # Tailwind CSS v4 & custom glassmorphism styles
    │   ├── main.jsx         # React DOM entry point
    │   ├── apis/
    │   │   └── api.js       # Fetch client implementation
    │   └── components/
    │       ├── SearchForm.jsx       # Topic input & trending suggestions
    │       ├── PipelineProgress.jsx # 4-stage agent pipeline tracker
    │       ├── ReportView.jsx       # Markdown report viewer & export tools
    │       ├── CriticView.jsx       # Critic scoring & strengths/flaws card
    │       └── RawDataDrawer.jsx    # Raw search & scraped content telemetry
    ├── index.html           # HTML template with fonts & metadata
    ├── package.json         # React 19, Tailwind CSS v4, Lucide icons
    └── vite.config.js       # Vite 8 config with @tailwindcss/vite plugin
```

---

## ⚙️ Prerequisites

Before getting started, make sure you have:
- **Python**: 3.10 or higher installed ([python.org](https://www.python.org/))
- **Node.js**: 18.0 or higher & npm installed ([nodejs.org](https://nodejs.org/))
- **API Keys**:
  - [Groq Cloud API Key](https://console.groq.com/keys) (Free & ultra-fast inference)
  - [Tavily Search API Key](https://app.tavily.com/) (Free tier available for search)

---

## 🚀 Step-by-Step Installation & Setup

### 1. Clone or Open the Repository
Open your terminal in the project root directory:
```bash
cd multi-agent-ai-resezrch-langchain
```

---

### 2. Backend Setup

#### A. Navigate to backend
```bash
cd backend
```

#### B. Create & Activate Virtual Environment
- **Windows (PowerShell)**:
  ```powershell
  python -m venv .venv
  .venv\Scripts\Activate.ps1
  ```
  *(If you encounter execution policy restrictions, run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`)*

- **Windows (Command Prompt)**:
  ```cmd
  python -m venv .venv
  .venv\Scripts\activate.bat
  ```

- **macOS / Linux**:
  ```bash
  python3 -m venv .venv
  source .venv/bin/activate
  ```

#### C. Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### D. Configure Environment Variables
Ensure a `.env` file exists in the `backend/` directory with your API keys:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
TAVILY_API_KEY=tvly-your_tavily_api_key_here
```

#### E. Start the Backend Server
```bash
uvicorn main:app --reload --port 8000
```
- The backend will start on: **`http://localhost:8000`**
- Interactive Swagger documentation: **`http://localhost:8000/docs`**

---

### 3. Frontend Setup

Open a **new terminal window** and follow these steps:

#### A. Navigate to frontend
```bash
cd frontend
```

#### B. Install Node Dependencies
```bash
npm install
```
*(Installs React 19, `@tailwindcss/vite`, `tailwindcss`, `lucide-react`, and `react-markdown`)*

#### C. Run the Development Server
```bash
npm run dev
```
- Open your browser and navigate to: **`http://localhost:5173`**

---

## 💻 Running the Full System

Run both processes side-by-side:

| Terminal | Directory | Command | Port |
| :--- | :--- | :--- | :--- |
| **Terminal 1 (Backend)** | `backend/` | `uvicorn main:app --reload --port 8000` | `http://localhost:8000` |
| **Terminal 2 (Frontend)** | `frontend/` | `npm run dev` | `http://localhost:5173` |

Once both are running, go to **`http://localhost:5173`**, enter any research topic or pick one of the trending suggestions, and click **Launch Research**.

---

##  🙋‍♂️ Author
#### Roshan Karki