# Blue Bits Summary Vault

University course summaries in Arabic/English. Card-based layout with LaTeX math and Mermaid diagrams.

Demo: https://cristography.github.io/Blue-Bits-Summary-Vault/

## Quick Start

1. **View Online**: Open `index.html` in a browser
2. **Search**: Use the search bar to find courses
3. **Theme**: Toggle dark/light mode with the button in the header

## Add New Course

1. Add course to `data/courses.json`
2. Create `courses/[course-id].md`
3. Use AI prompt from `prompt.md` to generate content
4. Commit to GitHub Pages

## Structure

```
├── index.html          # Main page
├── style.css           # Styles
├── app.js              # App logic
├── data/courses.json   # Course list
├── courses/            # Individual course MD files
└── prompt.md           # AI prompt for generating summaries
```

## Features

- 5 years, 10 semesters, 70+ courses
- Bilingual Arabic/English content
- LaTeX math rendering (KaTeX)
- Mermaid diagram support
- Dark/Light theme
- Global search
- Card-based layout

---

Built with vanilla JS, no build required. Hosted on GitHub Pages.