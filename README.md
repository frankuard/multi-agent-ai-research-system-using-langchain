# Multi-Agent AI Research System

An autonomous multi-agent research platform built with **LangChain**, **Groq LLM**, **Tavily**, **FastAPI**, and **React (Vite)**.

---

## 📁 Project Structure

```
multi-agent-ai-research/
├── backend/
│   ├── main.py              # FastAPI app — exposes /research endpoint
│   ├── agents.py            # Search and reader agents, writer and critic chains
│   ├── tools.py             # Tavily web search and URL scraping tools
│   ├── pipeline.py          # Sequential multi-agent pipeline orchestrator
│   ├── .env                 # API keys & environment secrets
│   └── requirements.txt     # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── App.jsx          # Main application component
    │   ├── api.js           # Fetch calls to backend API
    │   ├── components/
    │   │   ├── SearchForm.jsx  # Topic search input form
    │   │   ├── ReportView.jsx  # Research report display
    │   │   └── CriticView.jsx  # Critic evaluation display
    │   └── main.jsx         # React application entry point
    ├── index.html           # HTML template
    ├── package.json         # Node.js dependencies and scripts
    └── vite.config.js       # Vite configuration
```

---

## ⚙️ Prerequisites

- **Python**: 3.10 or higher
- **Node.js**: 18.0 or higher
- **API Keys**:
  - [Groq API Key](https://console.groq.com/)
  - [Tavily API Key](https://tavily.com/)

---

## 🚀 Backend Setup & Execution

### 1. Navigate to the backend directory
```bash
cd backend
```

### 2. Create and activate a virtual environment
- **Windows (PowerShell)**:
  ```powershell
  python -m venv .venv
  .venv\Scripts\Activate.ps1
  ```
- **macOS / Linux**:
  ```bash
  python -m venv .venv
  source .venv/bin/activate
  ```

### 3. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment variables
Create a `.env` file in the `backend/` folder (or verify existing `.env`):
```env
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

### 5. Run the Backend Server
Start the FastAPI server with hot reloading:
```bash
uvicorn main:app --reload --port 8000
```
- API will be accessible at: `http://localhost:8000`
- Interactive API Docs (Swagger): `http://localhost:8000/docs`

Alternatively, you can run the pipeline directly in the terminal:
```bash
python pipeline.py
```

---

## 💻 Frontend Setup & Execution

### 1. Navigate to the frontend directory
```bash
cd frontend
```

### 2. Install Node dependencies
```bash
npm install
```

### 3. Start the Vite development server
```bash
npm run dev
```
- Frontend will be accessible at: `http://localhost:5173`

---

## 🤖 Multi-Agent Workflow

1. **Search Agent (`build_search_agent`)**: Uses Tavily search to fetch relevant links, titles, and snippets for the given topic.
2. **Reader Agent (`build_reader_agent`)**: Analyzes the top search results, selects the most informative URL, and scrapes detailed page content using BeautifulSoup.
3. **Writer Chain (`writer_chain`)**: Synthesizes the search results and scraped content into a comprehensive research report (Introduction, Key Findings, Conclusion, Sources).
4. **Critic Chain (`critic_chain`)**: Reviews and evaluates the drafted report with scoring, strengths, areas to improve, and a final verdict.
