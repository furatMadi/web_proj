# Humonitor – Human Rights Monitor MIS  
COMP4382 (Sec 1) • Computer Science Department

| Team Member | ID       |
|-------------|----------|
| **Furat Madi** | 1211543 |
| **Leen Odeh**  | 1210938 |
| **Aya Hammad** | 1211371 |

---

## 📚 Project Overview
Humonitor is a full-stack **Human Rights Monitoring Management Information System (MIS)**.  
It streamlines how NGOs document abuses, manage cases, and analyse trends through:

* **Secure incident reporting** (text + media, anonymous option)  
* **End-to-end case management** with status tracking & evidence uploads  
* **Victim / witness database** using role-based access & risk assessment  
* **Interactive dashboards** for analysts, with Excel/PDF export

The stack is **FastAPI + MongoDB** in the back-end and **React 18** in the front-end.

---

## 👥 User Roles

| Role        | Key Capabilities |
|-------------|------------------|
| **Admin**   | *Approve / reject* new incident reports, edit or archive cases |
| **Organisation** | Submit new reports, attach media, update or withdraw own reports |
| **Analyst** | View all approved data, filter by date/region/type, export charts & Excel summaries |

---

## 🔧 Installation & Setup

### 1. Prerequisites
* **Python 3.11+**     
* **Node.js ≥18**       
* **MongoDB 6** 

### 2. Clone & configure
```bash
git clone https://github.com/furatMadi/web_proj.git
cd react
cd FASTAPI
uvicorn main:app --reload
cd ..
cd Frontend
npm start
```
## 📦 Front-End Dependencies
Running **`npm install`** in that directory will pull everything listed below.

| Category | Key Packages |
|----------|--------------|
| Core React stack | `react` 18 · `react-dom` 18 · `react-scripts` 5 (CRA tooling) |
| Routing | `react-router-dom` 6/7 (latest works with both) |
| HTTP | `axios` 1.9 |
| UI / Styling | `bootstrap` 5.3 · `framer-motion` 12 (animation) · `lucide-react` 0.5 (icons) |
| Charts & Data Viz | `chart.js` 4 · `react-chartjs-2` 5, `plotly.js` 3 · `react-plotly.js` 2, `recharts` 2.15 |
| Maps & Geo | `leaflet` 1.9 · `react-leaflet` 4.2 |
| Quality & Metrics | `web-vitals` 2 |

