# Blue Bits Summary Vault (v2.0)

University course summaries in Arabic/English. Component-based JSON architecture with LaTeX math and Mermaid diagrams.

Demo: https://cristography.github.io/Blue-Bits-Summary-Vault/

## Quick Start

1. **View Online**: Open `index.html` in a browser
2. **Search**: Use the search bar to find courses
3. **Theme**: Toggle dark/light mode with the button in the header

## Add New Course (v2.0)

1. Add course to `data/courses.json` (with `summary_json` field)
2. Create `courses/[course-id].json` using the AI prompt
3. Use AI prompt from `prompt.md` to generate JSON components
4. Commit to GitHub Pages

## Structure (v2.0)

```
├── index.html          # Main page
├── style.css           # Styles
├── app.js              # App logic (v2.0 - JSON components)
├── data/
│   ├── courses.json   # Course list (summary_json field)
│   └── components.schema.json  # Component definitions
├── courses/            # Individual course .json files
└── prompt.md           # AI prompt for generating JSON
```

## Features (v2.0)

- 5 years, 10 semesters, 70+ courses
- Bilingual Arabic/English content
- Component-based JSON architecture (no markdown parsing!)
- 13 component types: card, definition, equation, list, table, diagram, code, warning, theorem, example, etc.
- LaTeX math rendering (KaTeX)
- Mermaid diagram support
- Dark/Light theme
- Global search
- Card-based layout

## Component Types

| Type | Description |
|------|-------------|
| `card` | Main container with title and children |
| `definition` | Term + English term + description + formula |
| `equation` | LaTeX formula with display mode |
| `list` | Ordered/unordered list |
| `table` | Headers + rows |
| `diagram` | Mermaid chart |
| `code` | Code block with language |
| `warning` | Note/warning/tip |
| `theorem` | Theorem with statement and optional proof |
| `example` | Worked example |

## Migration from v1.0

v2.0 uses JSON components instead of Markdown:
- Old: `summary_md: "courses/graph-theory.md"`
- New: `summary_json: "courses/graph-theory.json"`

The app supports backward compatibility for legacy markdown files.

---

Built with vanilla JS, no build required. Hosted on GitHub Pages.