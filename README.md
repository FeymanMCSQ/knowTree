```markdown
# 🌳 Knowledge Tree

**The internet has every answer — but no map.**

**Knowledge Tree** is a minimalist AI app that turns any topic into a _living concept map_.  
Type “Complex Analysis,” and it instantly builds a **knowledge tree** showing:

- **Roots** — what you must know first
- **Branches** — the main subtopics
- **Leaves** — atomic concepts (learnable in under 10 minutes)

Click any node to expand it further, and the app recursively breaks the topic down into smaller ideas.  
No accounts, no progress tracking — just a clear, expandable map of how knowledge fits together.

> It’s like _Google Earth for learning_: zoom in anywhere and watch understanding unfold.

---

## 🚀 Overview

### 🧩 Core Idea

You input a topic → the app uses AI to generate a small JSON tree → you explore it interactively.  
Each click fetches only the next layer of the map, so it stays fast and clean.

### ⚙️ Architecture

| Layer          | Tech                              | Purpose                                         |
| -------------- | --------------------------------- | ----------------------------------------------- |
| **Frontend**   | Next.js 14 + React-Force-Graph-2D | Renders the interactive knowledge tree          |
| **Backend**    | Next.js API route + OpenAI API    | Generates prerequisites and subtopics on demand |
| **State**      | Local React state (no DB)         | Keeps current nodes and edges in memory         |
| **Deployment** | Vercel                            | Frontend + API in one lightweight package       |

### 🧠 Data Flow
```

User Input → /api/expand → OpenAI → JSON → Graph Renderer → User Clicks Node → Repeat

````

---

## 🛠️ Setup

### 1. Clone and install

```bash
git clone https://github.com/yourname/knowledge-tree.git
cd knowledge-tree
npm install
````

### 2. Add your API key

Create `.env.local`:

```bash
OPENAI_API_KEY=sk-your-key
```

### 3. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🧩 Example API Response

`POST /api/expand` with `{ "topic": "Complex Analysis" }`

```json
{
  "prerequisites": [
    {
      "title": "Differentiation",
      "desc": "Finding instantaneous rates of change"
    },
    {
      "title": "Complex Numbers",
      "desc": "Numbers with real and imaginary parts"
    }
  ],
  "subtopics": [
    {
      "title": "Cauchy–Riemann Equations",
      "desc": "Conditions for analyticity"
    },
    {
      "title": "Contour Integration",
      "desc": "Integrating complex functions around paths"
    }
  ]
}
```

---

## 🎨 Visual Design

- **Colors:**

  - Roots — gray
  - Topics — blue
  - Subtopics — green
  - Atomic leaves — gold

- **Interactions:**

  - Click node → expands new branches
  - Hover → see title and short description
  - Reset → clears map

---

## 🧭 Roadmap (Lean Build)

| Level | Quest                               | Goal                        |  Time  |
| :---- | :---------------------------------- | :-------------------------- | :----: |
| **1** | Scaffold Next.js app                | Hello page visible          | < 1 hr |
| **2** | Create `/api/expand` with mock data | Returns sample JSON         | < 1 hr |
| **3** | Render interactive graph            | Nodes appear visually       | < 1 hr |
| **4** | Add click-to-expand                 | Recursive node loading      | < 1 hr |
| **5** | Connect OpenAI                      | Real AI-generated maps      | < 1 hr |
| **6** | Polish UI & deploy                  | Color, reset, Vercel deploy | < 1 hr |

---

## 🧩 Example Use

1. Type a topic like **"Quantum Mechanics"**.
2. Explore its roots: Linear Algebra, Differential Equations, Complex Numbers.
3. Click _“Schrödinger Equation”_ → expands into “Time-Independent Form,” “Normalization,” etc.
4. Click again → reach atomic nodes you can learn in minutes.

---

## 🌌 Philosophy

> **No content, just structure.**
> The app doesn’t teach — it reveals _what to learn and in what order._

Knowledge Tree is about **orientation**, not memorization.
Once you have the map, you can use any resource to traverse it.

---

## 🧠 License

MIT — free for personal and educational use.
Just don’t turn it into a bloated LMS. Keep it curious.

---

## 🪴 Author

Built by [Safi Ullah] —
a believer that learning should feel like exploration, not instruction.

```

---

```
