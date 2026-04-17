# PRD - Blue Bits Summary Vault

## 1. Document Control

| Property | Value |
|----------|-------|
| **Project Name** | Blue Bits Summary Vault |
| **Version** | 1.0 |
| **Owner** | Crist Yaghjian |
| **Stakeholders** | Blue Bits, University Classmates |
| **Last Updated** | 2026-04-17 |
| **Status** | Draft |

---

## 2. Product Overview

### Problem Statement

University students face significant challenges when preparing for exams:
- Handwritten summaries are often low quality and difficult to read
- Content is scattered across various sources
- No standardized format for organizing study materials
- Difficulty finding and accessing relevant notes quickly

### Product Summary

A **scalable, lightweight, user-friendly** static website that aggregates university course summaries in a unified, structured format. The core philosophy centers on presenting each topic as a **card-based** component for optimal readability and navigation.

### Target Users

- University students preparing for exams
- Self-learners seeking structured course materials
- Study groups collaborating on course content

### Primary Use Case

Students can quickly learn, revise, and review core concepts, equations, and notes in a clean, organized, and easily accessible format — both on desktop and mobile devices.

### Why Now

- Beginning of a new semester — ideal time to establish the platform
- Growing need for digital, accessible study materials
- Opportunity to build a foundation for the entire academic journey

### Expected Outcome

A clean, organized website featuring:
- 5 years of study, each with 2 semesters
- ~7 courses per semester
- Each course containing topics and summary cards

---

## 3. Goals

| Goal Type | Description |
|-----------|-------------|
| **Business** | Volunteering project — no commercial objectives |
| **User** | Make learning and revision as easy as possible for students |
| **Technical** | Enable adding new content (AI-generated or manual) with minimal friction |

### Success Metrics

- Seamless content creation workflow
- High user satisfaction for study/revision tasks
- Fast, responsive interface on all devices

---

## 4. Non-Goals

- **NOT** building a complex backend system
- **NOT** implementing user authentication/authorization
- **NOT** creating a full LMS (Learning Management System)

The focus is on a **practical, static, zero-build** solution that emphasizes content accessibility over platform complexity.

---

## 5. Scope

### In Scope

- End-to-end system: Prompt → Generation → Publishing
- Static site rendering with Markdown, LaTeX, and Mermaid support
- Card-based UI with responsive layout
- Dark/Light mode toggle
- Global search functionality
- Progress tracking (localStorage)

### Out of Scope

- Full-featured content management system
- User accounts and authentication
- Real-time collaboration
- Complex backend infrastructure

---

## 6. Users and Personas

### Persona 1: The Nerd (Content Creator)

| Attribute | Description |
|-----------|-------------|
| **Name** | The Nerd |
| **Role** | Add summaries (Admin/Content Creator) |
| **Needs** | Generate or write summaries in the required format and publish to the website |
| **Pain Points** | Using Git and manual editing to polish output and verify information accuracy |
| **Frequency** | Before each exam (at least 1 week before), or when editing existing content |

### Persona 2: The Student (Content Consumer)

| Attribute | Description |
|-----------|-------------|
| **Name** | The Student |
| **Role** | View and consume content |
| **Needs** | Quick access to course materials for learning and revision |
| **Pain Points** | None — the system is designed for ease of use |
| **Frequency** | Before exams (1-2 days), beginning of study sessions |

---

## 7. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | **Nerd** | Publish my summaries | Others can access them easily |
| US-02 | **Student** | Access course information | I can learn and revise effectively |
| US-03 | **Nerd** | Generate summaries using AI | I can quickly create content in the correct format |
| US-04 | **Student** | Toggle between light and dark mode | I can read comfortably in any lighting condition |
| US-05 | **Student** | Search across all courses | I can find specific topics quickly |
| US-06 | **Student** | Track my progress | I know which courses I've reviewed |

---

## 8. Product Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Display 5 years, each with 2 semesters, ~7 courses per semester | Must |
| FR-02 | Card-based UI where each `##` heading becomes a summary card | Must |
| FR-03 | Render Markdown content with proper formatting | Must |
| FR-04 | Render LaTeX math equations (KaTeX) | Must |
| FR-05 | Render Mermaid diagrams | Must |
| FR-06 | Global search across all courses (Arabic & English) | Should |
| FR-07 | Dark/Light theme toggle with persistence | Should |
| FR-08 | Progress/status tracking per course | Could |
| FR-09 | Responsive design (mobile + desktop) | Must |

### Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | Lightweight — fast load times, minimal dependencies |
| **Scalability** | Easy to add new courses and content |
| **Maintainability** | Component-based architecture, easy to extend |
| **Browser Support** | Chrome, Firefox, Safari, Edge (latest versions) |
| **Device Support** | Desktop (landscape) + Mobile (portrait) |
| **Accessibility** | Proper contrast ratios, keyboard navigation |

### Edge Cases

- Mathematical symbols and equations (LaTeX)
- Mixed Arabic/English bilingual content
- Complex diagrams and figures (Mermaid)
- RTL text direction for Arabic content
- Empty course content placeholder

### Acceptance Criteria

1. **Bug-free output**: No rendering errors in Markdown, LaTeX, or Mermaid
2. **High quality content**: Structured, accurate summaries
3. **Easy to publish**: AI prompts generate ready-to-use Markdown
4. **Easy to view**: Responsive, fast, intuitive interface
5. **Theme toggle works**: Dark/Light mode persists and applies correctly

---

## 9. Technical Architecture

### Zero-Build, GitHub Pages Friendly Stack (v2.0 - Component-Based)

| Layer | Tool/Approach | Why |
|-------|---------------|-----|
| **Data** | `courses.json` + per-course `.json` files | Structured JSON components, type-safe, extensible |
| **Renderer** | Vanilla JS + Component System | No build step. Fetches JSON → renders components → builds DOM |
| **Hosting** | GitHub Pages (`/docs` or `gh-pages` branch) | Free, supports static JSON/HTML/JS natively |
| **Search/Filter** | Vanilla JS (client-side) | Runs client-side, no backend needed |
| **Styling** | CSS Grid/Flex + CSS Variables + RTL support | Responsive, themeable, Arabic-friendly |

### Component System (v2.0)

Instead of parsing Markdown at runtime, content is stored as structured JSON components. This provides:
- Type-safe component definitions
- Easier AI generation (structured output vs markdown)
- Better scalability for complex content
- Component composition (nested cards, sections)

#### Supported Component Types

| Type | Description | Properties |
|------|-------------|-------------|
| **card** | Main container for related content | title, icon, children[] |
| **heading** | Section heading | level(1-3), text, style |
| **paragraph** | Rich text with inline LaTeX | text, align |
| **equation** | LaTeX formula | formula, display(boolean), label |
| **definition** | Term + description | term, term_en, description, formula |
| **list** | Bullet/numbered list | ordered, items[] |
| **table** | Tabular data | headers[], rows[][], caption |
| **diagram** | Mermaid diagram | chart(type), code, caption |
| **code** | Code block | language, code, caption |
| **warning** | Note/warning/tip | variant, title, text |
| **theorem** | Theorem with optional proof | name, name_en, statement, proof, formula |
| **example** | Worked example | title, given, solution, result |
| **divider** | Visual divider | style |

### JSON Schema

```json
{
  "type": "card",
  "title": "📐 التعاريف الأساسية · Core Definitions",
  "children": [
    { "type": "definition", "term": "...", "description": "..." },
    { "type": "equation", "formula": "\\sum...", "display": true },
    { "type": "diagram", "chart": "flowchart", "code": "graph TD..." }
  ]
}
```

### CDN Dependencies

```html
<!-- LaTeX (KaTeX) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>

<!-- Mermaid Diagrams -->
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>

<!-- DOM Sanitizer -->
<script src="https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.js"></script>

<!-- (No marked.js needed - components are pre-structured) -->
```

### Rendering Pipeline (v2.0 - Component-Based)

1. **Fetch courses.json** → Build course grid
2. **Open Course** → Fetch `.json` file
3. **Parse Components** → Iterate through component array
4. **Render to DOM** → Build HTML from component tree
5. **Render LaTeX** → `renderMathInElement()` (KaTeX)
6. **Render Diagrams** → Async `mermaid.render()` + safe injection
7. **Attach Events** → Status buttons, theme toggle

> **Why v2.0?** No runtime markdown parsing. Components are pre-structured, type-safe, and easier to generate via AI.

---

## 10. UI/UX Design

### Key Screens

| Screen | Description |
|--------|-------------|
| **Home (Years Grid)** | 5 year cards, each showing semester counts and progress |
| **Semester View** | Course cards for selected year/semester |
| **Course Page** | Card-based content with math and diagrams |
| **Search Results** | Global search across all courses |

### Navigation Structure

```
Home → Year X → Semester Y → Course Z
              ↘ Search Results → Course Z
```

### Layout Specifications

- **Header**: Logo, global search input, theme toggle
- **Breadcrumb**: Navigation trail with clickable links
- **Content Area**: Responsive grid (3 columns desktop, 2 tablet, 1 mobile)
- **Cards**: Each `##` heading becomes a card with icon, title, and body

### Typography

- **Primary Font**: `IBM Plex Sans Arabic` (with fallback)
- **Monospace**: `JetBrains Mono` for code/math
- **Base Size**: 16px
- **Line Height**: 1.6

### Color Palette (Light Mode)

| Variable | Hex | Usage |
|----------|-----|-------|
| `--bg` | `#f2ede8` | Page background |
| `--surf` | `#faf7f4` | Card/header background |
| `--card` | `#ffffff` | Elevated surfaces |
| `--border` | `#ddd5c8` | Borders |
| `--txt` | `#1e1a17` | Primary text |
| `--muted` | `#6a5a4e` | Secondary text |
| `--p5` | `#90b8d8` | Primary accent (blue) |

### Color Palette (Dark Mode)

| Variable | Hex | Usage |
|----------|-----|-------|
| `--bg` | `#1a1816` | Page background |
| `--surf` | `#252220` | Card/header background |
| `--card` | `#2d2927` | Elevated surfaces |
| `--border` | `#3d3734` | Borders |
| `--txt` | `#e8e4e0` | Primary text |
| `--muted` | `#a0948c` | Secondary text |
| `--p5` | `#7aa8d4` | Primary accent (lighter blue) |

### Interactive Behaviors

- **Hover**: Cards lift with shadow (`transform: translateY(-3px)`)
- **Transitions**: 200ms ease for all interactive elements
- **Focus**: Visible focus rings for accessibility

---

## 11. AI Integration

### Purpose

The platform does **not** have direct AI integration. Instead, the system includes **detailed prompts** that users can use with any LLM (ChatGPT, Claude, Gemini, etc.) to generate summaries in the correct format.

### Prompt Requirements

- Output MUST be raw Markdown (no code fences, no explanations)
- Structure: Each `##` heading becomes a card
- Bilingual: Arabic primary with English in parentheses
- Math: LaTeX `$inline$` and `$$display$$`
- Diagrams: Mermaid syntax in fenced blocks

### AI Output Validation

| Check | Description |
|-------|-------------|
| Quality | Content accuracy, completeness |
| Format | Correct Markdown, LaTeX, Mermaid syntax |
| Structure | Each `##` is a distinct card |
| Language | Arabic academic with English terms |

---

## 12. Course Catalog

### Year 1

| Semester 1 | Semester 2 |
|-----------|------------|
| مبادئ عمل الحاسوب | الجبر الخطي |
| تحليل 1 | التحليل 2 |
| فيزياء 1 | الدارات الكهربائية |
| رياضيات متقطعة | فيزياء 2 |
| لغة 1 | اللغة العربية |
| برمجة 1 | برمجة 2 |

### Year 2

| Semester 1 | Semester 2 |
|-----------|------------|
| التحليل 3 | التحليل العددي 2 |
| التحليل العددي 1 | مهارات التواصل |
| برمجة 3 | خوارزميات 1 |
| إلكترونيات | إحصاء |
| احتمالات | دارات منطقية |
| برمجة رياضية | — |

### Year 3

| Semester 1 | Semester 2 |
|-----------|------------|
| رسوميات حاسوبية | مبادئ الذكاء الاصطناعي |
| خوارزميات 2 | خوارزميات 3 |
| نظرية المخططات | اتصالات تشابهية ورقمية |
| معالج مصغر | بنية وتنظيم الحاسب 1 |
| معالجة الإشارة | شبكات حاسوبية |
| نظرية المعلومات | لغات صورية |
| قواعد المعطيات 1 | هندسة البرمجيات 1 |

### Year 4

| Semester 1 | Semester 2 |
|-----------|------------|
| نظرية الأرتال | تسويق وإدارة مشاريع |
| نظم تشغيل 1 | شبكات عصبونية ومنطق الترجيح |
| تصميم المترجمات | نظم تشغيل 2 |
| قواعد المعطيات 2 | روبوتيا |
| بنية وتنظيم الحواسيب 2 | أمن المعلومات |
| شبكات متقدمة | هندسة البرمجيات 2 |
| نظم وسائط متعددة | نظم رقمية مبرمجة |
| برمجة منطقية | برمجة تفرعية |
| بحوث عمليات | تطبيقات الإنترنت |

### Year 5

| Semester 1 | Semester 2 |
|-----------|------------|
| أمن الشبكات | معالجة لغات طبيعية |
| هندسة البرمجيات 3 | تنقيب المعطيات |
| تحكم منطقي مبرمج PLC | إدارة نظم إنتاجية |
| نظم خبيرة | نظم الزمن الحقيقي |
| رؤية حاسوبية | الشبكات اللاسلكية |
| نمذجة ومحاكاة | إدارة الشبكات |
| جودة ووثوقية | — |
| نظم موزعة | — |

---

## 13. Data Format (v2.0 - Component-Based)

### courses.json Structure

```json
[
  {
    "id": "graph-theory",
    "year": 3,
    "semester": 1,
    "title_ar": "نظرية المخططات",
    "title_en": "Graph Theory",
    "status": "reviewed",
    "summary_json": "courses/graph-theory.json"
  }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | URL-safe slug, used for localStorage tracking |
| `year` | Number | University year (1-5) |
| `semester` | Number | Semester (1 or 2) |
| `title_ar` | String | Arabic course name |
| `title_en` | String | English course name |
| `status` | String | `"none"`, `"planned"`, `"reviewed"`, or `"flagged"` |
| `summary_json` | String | Relative path to JSON component file |

### Course Summary JSON Structure

Each course has a `.json` file containing an array of components:

```json
{
  "course": {
    "id": "graph-theory",
    "title_ar": "نظرية المخططات",
    "title_en": "Graph Theory"
  },
  "components": [
    {
      "type": "card",
      "title": "📐 التعاريف الأساسية · Core Definitions",
      "icon": "📐",
      "children": [
        { "type": "definition", "term": "المخطط", "term_en": "Graph", "description": "...", "formula": "G(V,E)" },
        { "type": "definition", "term": "درجة الرأس", "term_en": "Degree", "description": "...", "formula": "\\deg(v)" }
      ]
    },
    {
      "type": "card",
      "title": "🧮 النظريات والصيغ · Theorems & Formulas",
      "children": [
        { "type": "equation", "formula": "\\sum_{v \\in V} \\deg(v) = 2|E|", "display": true, "label": "Handshaking Lemma" }
      ]
    },
    {
      "type": "card",
      "title": "🔁 الخوارزميات · Algorithms",
      "children": [
        { "type": "diagram", "chart": "flowchart", "code": "graph TD..." },
        { "type": "list", "items": [{ "text": "Step 1..." }, { "text": "Step 2..." }] }
      ]
    }
  ]
}
```

The root is always an array of `card` components. Each card contains child components that render the actual content (definitions, equations, lists, tables, diagrams, etc.).

---

## 14. Deployment

### GitHub Pages Setup

1. Create a GitHub repository
2. Enable **Settings → Pages → Deploy from main branch → `/`**
3. Commit all files:
   ```
   index.html
   style.css
   app.js
   data/courses.json
   courses/*.md
   ```
4. Wait ~60 seconds for deployment
5. Visit `https://<username>.github.io/<repo>/`

### Cache Handling

When updating content, append a version query to force refresh:
```javascript
summary_md: "courses/graph-theory.md?v=1.2"
```

---

## 15. Future Enhancements

| Priority | Feature | Notes |
|----------|---------|-------|
| 🟢 High | GitHub Actions CI | Validate JSON, lint MD, auto-deploy |
| 🟢 High | PDF/Print Stylesheet | `@media print` for clean printing |
| 🟡 Medium | Cross-Linking | Auto-suggest related courses |
| 🟡 Medium | PWA/Offline | Service worker + manifest for mobile |
| 🟠 Low | Tag System | Filter by `#algorithms`, `#math`, etc. |
| 🟠 Low | Multi-Lang Toggle | Switch AR/EN primary dynamically |
| 🔵 Future | Progressive Loading | Lazy-render cards on scroll |

---

*Document Version: 1.0 | Last Updated: 2026-04-17*