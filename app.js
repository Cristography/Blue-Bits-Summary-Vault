/**
 * Blue Bits Summary Vault - Application (v2.0)
 * Author: Crist Yaghjian
 * Version: 2.0
 * 
 * Zero-build static site renderer
 * Supports: JSON Components, LaTeX (KaTeX), Mermaid diagrams
 * Navigation: Home → Years → Semester → Course Page (no modal)
 * 
 * Key Change from v1.0: No markdown parsing!
 * Content is stored as pre-structured JSON components.
 */

'use strict';

// ========================================
// Configuration
// ========================================

const CONFIG = {
  dataPath: 'data/courses.json',
  defaultStatus: 'none',
  debounceDelay: 300,
  storageKey: 'bbs_summary_vault',
  themeKey: 'bbs_theme'
};

// ========================================
// State
// ========================================

let state = {
  courses: [],
  currentYear: null,
  currentSemester: null,
  currentCourse: null,
  searchQuery: '',
  theme: 'light'
};

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initMermaid();
  await loadCourses();
  setupEventListeners();
  renderYears();
});

async function loadCourses() {
  try {
    const response = await fetch(CONFIG.dataPath);
    if (!response.ok) throw new Error('Failed to load courses');
    
    const courses = await response.json();
    state.courses = enrichCourses(courses);
    console.log(`Loaded ${courses.length} courses`);
  } catch (error) {
    console.error('Error loading courses:', error);
    showError('فشل تحميل المقررات. يرجى تحديث الصفحة.');
  }
}

function enrichCourses(courses) {
  const savedStatuses = loadStatuses();
  return courses.map(course => ({
    ...course,
    status: savedStatuses[course.id] || course.status
  }));
}

function loadStatuses() {
  try {
    const saved = localStorage.getItem(CONFIG.storageKey);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveStatuses() {
  try {
    const statuses = {};
    state.courses.forEach(course => {
      if (course.status && course.status !== 'none') {
        statuses[course.id] = course.status;
      }
    });
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(statuses));
  } catch (error) {
    console.error('Error saving statuses:', error);
  }
}

// ========================================
// Theme
// ========================================

function initTheme() {
  const savedTheme = localStorage.getItem(CONFIG.themeKey);
  if (savedTheme) {
    state.theme = savedTheme;
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    state.theme = prefersDark ? 'dark' : 'light';
  }
  applyTheme();
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  const themeIcon = document.querySelector('#themeToggle i');
  if (themeIcon) {
    themeIcon.className = state.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem(CONFIG.themeKey, state.theme);
  applyTheme();
}

// ========================================
// Mermaid
// ========================================

function initMermaid() {
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: false,
      theme: state.theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      },
      gantt: {
        useMaxWidth: true
      },
      sequence: {
        useMaxWidth: true
      },
      classDiagram: {
        useMaxWidth: true
      }
    });
  }
}

// ========================================
// View Management
// ========================================

function showView(viewName) {
  const views = ['yearsView', 'semesterView', 'coursePage', 'searchView'];
  views.forEach(v => {
    const el = document.getElementById(v);
    if (el) {
      el.style.display = v === viewName ? 'block' : 'none';
    }
  });
}

// ========================================
// Rendering - Years
// ========================================

function renderYears() {
  showView('yearsView');
  state.currentYear = null;
  state.currentSemester = null;
  
  const yearsGrid = document.getElementById('yearsGrid');
  if (!yearsGrid) return;
  
  const years = [1, 2, 3, 4, 5];
  yearsGrid.innerHTML = years.map(year => {
    const yearCourses = state.courses.filter(c => c.year === year);
    const semester1Count = yearCourses.filter(c => c.semester === 1).length;
    const semester2Count = yearCourses.filter(c => c.semester === 2).length;
    const reviewedCount = yearCourses.filter(c => c.status === 'reviewed').length;
    
    return `
      <article class="year-card" data-year="${year}">
        <div class="year-card-header">
          <span class="year-number">${year}</span>
          <span class="year-badge">${reviewedCount} / ${yearCourses.length}</span>
        </div>
        <h3 class="year-title">السنة ${getArabicNumber(year)}</h3>
        <p class="year-subtitle">${semester1Count + semester2Count} مقرر</p>
        <div class="semesters-row">
          <div class="semester-badge" data-year="${year}" data-semester="1">
            <i class="fas fa-book"></i>
            الفصل الأول
            <span>(${semester1Count})</span>
          </div>
          <div class="semester-badge" data-year="${year}" data-semester="2">
            <i class="fas fa-book"></i>
            الفصل الثاني
            <span>(${semester2Count})</span>
          </div>
        </div>
      </article>
    `;
  }).join('');
  
  updateBreadcrumb('الرئيسية');
}

function getArabicNumber(num) {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(d => arabicNumerals[parseInt(d)]).join('');
}

function updateBreadcrumb(currentLabel, year = null, semester = null) {
  const breadcrumb = document.getElementById('breadcrumb');
  if (!breadcrumb) return;
  
  if (year && semester) {
    breadcrumb.innerHTML = `
      <span class="breadcrumb-item" id="breadcrumbHome">الرئيسية</span>
      <span class="breadcrumb-separator">›</span>
      <span class="breadcrumb-item" id="breadcrumbYear">السنة ${year}</span>
      <span class="breadcrumb-separator">›</span>
      <span class="breadcrumb-item active">${currentLabel}</span>
    `;
  } else if (year) {
    breadcrumb.innerHTML = `
      <span class="breadcrumb-item" id="breadcrumbHome">الرئيسية</span>
      <span class="breadcrumb-separator">›</span>
      <span class="breadcrumb-item active">${currentLabel}</span>
    `;
  } else {
    breadcrumb.innerHTML = `<span class="breadcrumb-item active">${currentLabel}</span>`;
  }
}

// ========================================
// Rendering - Semester Courses
// ========================================

function renderSemesterCourses(year, semester) {
  state.currentYear = year;
  state.currentSemester = semester;
  showView('semesterView');
  
  const semesterTitle = document.getElementById('semesterTitle');
  const coursesGrid = document.getElementById('coursesGrid');
  
  if (!coursesGrid) return;
  
  semesterTitle.textContent = `السنة ${year} - الفصل ${semester === 1 ? 'الأول' : 'الثاني'}`;
  
  // Update breadcrumb
  updateBreadcrumb(`الفصل ${semester === 1 ? 'الأول' : 'الثاني'}`, year, semester);
  
  // Filter and render courses
  let courses = state.courses.filter(c => c.year === year && c.semester === semester);
  
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    courses = courses.filter(c => 
      c.title_ar.toLowerCase().includes(query) || 
      c.title_en.toLowerCase().includes(query)
    );
  }
  
  if (courses.length === 0) {
    coursesGrid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search"></i>
        <p>لا توجد مقررات مطابقة للبحث</p>
      </div>
    `;
    return;
  }
  
  coursesGrid.innerHTML = courses.map(course => `
    <article class="course-card-large" data-course-id="${course.id}">
      <div class="card-status-indicator" data-status="${course.status}"></div>
      <div class="card-icon-wrapper">
        <i class="fas fa-graduation-cap"></i>
      </div>
      <h3 class="course-title-large">${course.title_ar}</h3>
      <p class="course-title-en-large">${course.title_en}</p>
      <div class="course-status-badge-large" data-status="${course.status}">${getStatusLabel(course.status)}</div>
    </article>
  `).join('');
}

function getStatusLabel(status) {
  const labels = {
    'none': 'قيد الانتظار',
    'planned': 'مخطط',
    'reviewed': 'مراجع',
    'flagged': 'مُعلم'
  };
  return labels[status] || 'قيد الانتظار';
}

// ========================================
// Global Search
// ========================================

function performGlobalSearch(query) {
  if (!query || query.length < 2) {
    goHome();
    return;
  }

  const lowerQuery = query.toLowerCase();
  
  const matchingCourses = state.courses.filter(c => 
    c.title_ar.toLowerCase().includes(lowerQuery) || 
    c.title_en.toLowerCase().includes(lowerQuery) ||
    c.id.toLowerCase().includes(lowerQuery)
  );

  showSearchResults(query, matchingCourses);
}

function showSearchResults(query, courses) {
  showView('searchView');
  state.currentYear = null;
  state.currentSemester = null;
  state.currentCourse = null;

  const title = document.getElementById('searchResultsTitle');
  const grid = document.getElementById('searchResultsGrid');

  if (title) {
    title.textContent = `نتائج البحث عن "${query}" - ${courses.length} نتيجة`;
  }

  if (!grid) return;

  if (courses.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search"></i>
        <p>لا توجد نتائج مطابقة للبحث</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = courses.map(course => `
    <article class="course-card-large" data-course-id="${course.id}" data-year="${course.year}" data-semester="${course.semester}">
      <div class="card-status-indicator" data-status="${course.status}"></div>
      <div class="card-icon-wrapper">
        <i class="fas fa-graduation-cap"></i>
      </div>
      <h3 class="course-title-large">${course.title_ar}</h3>
      <p class="course-title-en-large">${course.title_en}</p>
      <p class="course-year-semester">السنة ${course.year} - الفصل ${course.semester === 1 ? 'الأول' : 'الثاني'}</p>
      <div class="course-status-badge-large" data-status="${course.status}">${getStatusLabel(course.status)}</div>
    </article>
  `).join('');

  updateBreadcrumb(`نتائج البحث`);
}

function clearSearch() {
  state.searchQuery = '';
  
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  
  goHome();
}

// ========================================
// Rendering - Course Page (v2.0 - JSON Components)
// ========================================

async function openCourse(courseId) {
  const course = state.courses.find(c => c.id === courseId);
  if (!course) return;
  
  state.currentCourse = course;
  showView('coursePage');
  
  // Update page header
  const courseTitle = document.getElementById('courseTitle');
  const courseTitleEn = document.getElementById('courseTitleEn');
  const statusSelect = document.getElementById('statusSelect');
  const courseContent = document.getElementById('courseContent');
  
  if (courseTitle) courseTitle.textContent = course.title_ar;
  if (courseTitleEn) courseTitleEn.textContent = course.title_en;
  if (statusSelect) statusSelect.value = course.status;
  
  // Update breadcrumb
  updateBreadcrumb(course.title_ar, course.year, course.semester);
  
  // Show loading
  if (courseContent) {
    courseContent.innerHTML = `
      <div class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>جاري التحميل...</p>
      </div>
    `;
  }
  
  // Load JSON components (NOT markdown!)
  if (course.summary_json) {
    await renderCourseComponents(course.summary_json, courseContent);
  } else if (course.summary_md) {
    // Backward compatibility: try loading markdown
    console.warn('Using legacy markdown format:', course.summary_md);
    await renderLegacyMarkdown(course.summary_md, courseContent);
  } else {
    if (courseContent) {
      courseContent.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-file-alt"></i>
          <p>لم يتم إضافة ملخص لهذا المقرر بعد.</p>
          <p class="hint">يرجى إنشاء ملف JSON للمقرر</p>
        </div>
      `;
    }
  }
}

async function renderCourseComponents(jsonPath, container) {
  if (!container) return;
  
  try {
    const response = await fetch(jsonPath);
    if (!response.ok) throw new Error(`Failed to load: ${response.status}`);
    
    const data = await response.json();
    
    // Validate component structure
    if (!data.components || !Array.isArray(data.components)) {
      throw new Error('Invalid component format: missing components array');
    }
    
    // Render components
    container.innerHTML = `<div class="summary-content" id="summaryContent"></div>`;
    const contentDiv = container.querySelector('#summaryContent');
    
    // Render each card component
    contentDiv.innerHTML = data.components.map(comp => renderComponent(comp)).join('');
    
    // Render LaTeX equations
    renderMath(container);
    
    // Render Mermaid diagrams
    await renderMermaidDiagrams(container);
    
    console.log(`Rendered ${data.components.length} components`);
    
  } catch (error) {
    console.error('Error rendering course components:', error);
    container.innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>فشل تحميل المحتوى</p>
        <p class="hint">${error.message}</p>
      </div>
    `;
  }
}

// ========================================
// Component Rendering System (v2.0)
// ========================================

function renderComponent(comp) {
  switch (comp.type) {
    case 'card':
      return renderCard(comp);
    case 'heading':
      return renderHeading(comp);
    case 'paragraph':
      return renderParagraph(comp);
    case 'equation':
      return renderEquation(comp);
    case 'definition':
      return renderDefinition(comp);
    case 'list':
      return renderList(comp);
    case 'table':
      return renderTable(comp);
    case 'diagram':
      return renderDiagram(comp);
    case 'code':
      return renderCode(comp);
    case 'warning':
      return renderWarning(comp);
    case 'theorem':
      return renderTheorem(comp);
    case 'example':
      return renderExample(comp);
    case 'divider':
      return renderDivider(comp);
    default:
      console.warn('Unknown component type:', comp.type);
      return '';
  }
}

function renderCard(card) {
  const icon = card.icon || getCardIcon(card.title);
  const children = (card.children || []).map(child => renderComponent(child)).join('');
  
  return `
    <div class="content-card">
      <div class="card-header">
        <span class="card-icon">${icon}</span>
        <h3 class="card-title">${safeText(card.title)}</h3>
      </div>
      <div class="card-body">
        ${children}
      </div>
    </div>
  `;
}

function renderHeading(heading) {
  const Tag = `h${heading.level || 2}`;
  return `<${Tag} class="content-heading">${safeText(heading.text)}</${Tag}>`;
}

function renderParagraph(p) {
  return `<p class="content-paragraph" style="text-align: ${p.align || 'right'}">${safeText(p.text)}</p>`;
}

function renderEquation(eq) {
  const label = eq.label ? `<span class="equation-label">${safeText(eq.label)}</span>` : '';
  const formula = eq.display ? `$$${safeText(eq.formula)}` : '$' + safeText(eq.formula);
  return `
    <div class="content-equation">
      ${label}
      <span class="katex-formula">${formula}$</span>
    </div>
  `;
}

function renderDefinition(def) {
  // Wrap formula in $ delimiters for KaTeX
  const formula = def.formula ? `<code class="formula-inline">$${safeText(def.formula)}$</code>` : '';
  const termEn = def.term_en ? `<span class="term-en">(${safeText(def.term_en)})</span>` : '';
  
  // Make sure description is also processed for inline LaTeX
  const desc = def.description || '';
  const hasLatex = desc.includes('$') || desc.includes('\\');
  const description = hasLatex ? `<span class="katex-inline">$${desc}$</span>` : safeText(desc);
  
  return `
    <div class="content-definition">
      <dt>${safeText(def.term)} ${termEn}</dt>
      <dd>${description} ${formula}</dd>
    </div>
  `;
}

function renderList(list) {
  const Tag = list.ordered ? 'ol' : 'ul';
  const items = (list.items || []).map(item => `
    <li>${safeText(item.text)}</li>
  `).join('');
  
  return `<${Tag} class="content-list">${items}</${Tag}>`;
}

function renderTable(table) {
  // Process headers and cells for LaTeX (wrap in $ if contains \ or math operators)
  const processCell = (text) => {
    const t = String(text || '');
    // Check if text contains LaTeX commands or math operators
    if (t.includes('\\') || t.includes('^') || t.includes('_') || t.includes('frac') || t.includes('times') || t.includes('leq') || t.includes('geq') || t.includes('infty') || t.includes('sum') || t.includes('int')) {
      return `<span class="katex-inline">$${t}$</span>`;
    }
    return safeText(t);
  };
  
  const headers = (table.headers || []).map(h => `<th>${processCell(h)}</th>`).join('');
  const rows = (table.rows || []).map(row => `
    <tr>${row.map(cell => `<td>${processCell(cell)}</td>`).join('')}</tr>
  `).join('');
  
  return `
    <div class="content-table-wrapper">
      ${table.caption ? `<p class="table-caption">${safeText(table.caption)}</p>` : ''}
      <table class="content-table">
        <thead><tr>${headers}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderDiagram(diag) {
  const caption = diag.caption ? `<p class="diagram-caption">${safeText(diag.caption)}</p>` : '';
  return `
    <div class="content-diagram">
      ${caption}
      <pre class="mermaid">${safeText(diag.code)}</pre>
    </div>
  `;
}

function renderCode(code) {
  const lang = code.language || '';
  const caption = code.caption ? `<p class="code-caption">${safeText(code.caption)}</p>` : '';
  
  return `
    <div class="content-code">
      ${caption}
      <pre><code class="language-${lang}">${safeText(code.code)}</code></pre>
    </div>
  `;
}

function renderWarning(warn) {
  const icon = warn.variant === 'warning' ? '⚠️' : warn.variant === 'tip' ? '💡' : warn.variant === 'important' ? '🔴' : '📝';
  
  return `
    <div class="content-warning variant-${warn.variant || 'note'}">
      <div class="warning-header">
        <span class="warning-icon">${icon}</span>
        <span class="warning-title">${safeText(warn.title || '')}</span>
      </div>
      <p class="warning-text">${safeText(warn.text)}</p>
    </div>
  `;
}

function renderTheorem(th) {
  // Wrap formula in $ delimiters for KaTeX
  const formula = th.formula ? `<div class="theorem-formula"><code class="katex-formula">$${th.formula}$</code></div>` : '';
  const proof = th.proof ? `<div class="theorem-proof"><strong>Proof:</strong> ${safeText(th.proof)}</div>` : '';
  
  return `
    <div class="content-theorem">
      <h4 class="theorem-name">${safeText(th.name)}${th.name_en ? ` <span class="term-en">(${safeText(th.name_en)})</span>` : ''}</h4>
      <p class="theorem-statement">${safeText(th.statement)}</p>
      ${formula}
      ${proof}
    </div>
  `;
}

function renderExample(ex) {
  return `
    <div class="content-example">
      <h4 class="example-title">${safeText(ex.title || 'مثال')}</h4>
      <div class="example-given"><strong>المعطيات:</strong> ${safeText(ex.given)}</div>
      <div class="example-solution"><strong>الحل:</strong> ${safeText(ex.solution)}</div>
      ${ex.result ? `<div class="example-result"><strong>النتيجة:</strong> ${safeText(ex.result)}</div>` : ''}
    </div>
  `;
}

function renderDivider(div) {
  return `<hr class="content-divider style-${div.style || 'solid'}">`;
}

// ========================================
// Helper Functions
// ========================================

function getCardIcon(title) {
  if (!title) return '📚';
  const t = title.toLowerCase();
  if (t.includes('تعاريف') || t.includes('مفاهيم') || t.includes('definition')) return '📐';
  if (t.includes('نظريات') || t.includes('theorems')) return '🧮';
  if (t.includes('خوارزميات') || t.includes('algorithms')) return '🔁';
  if (t.includes('جداول') || t.includes('tables')) return '📊';
  if (t.includes('مخطط') || t.includes('diagram')) return '📈';
  if (t.includes('ملخص') || t.includes('summary')) return '📝';
  if (t.includes('أخطاء') || t.includes('pitfalls')) return '⚠️';
  return '📚';
}

function renderTextWithLatex(text) {
  if (!text) return '';
  // Simple approach - just escape but preserve literal $ for LaTeX
  return text.replace(/([^$])(\$[^$]+\$)/g, '$1$2');
}

function safeText(text) {
  if (!text) return '';
  return String(text);
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ========================================
// LaTeX Rendering
// ========================================

function renderMath(container) {
  if (typeof renderMathInElement !== 'undefined' && container) {
    renderMathInElement(container, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ],
      throwOnError: false,
      trust: true
    });
  }
}

// ========================================
// Mermaid Rendering
// ========================================

async function renderMermaidDiagrams(container) {
  if (typeof mermaid === 'undefined') return;
  
  const mermaidBlocks = container.querySelectorAll('pre.mermaid');
  
  for (const block of mermaidBlocks) {
    try {
      const graphDefinition = (block.textContent || block.innerText || '').trim();
      if (!graphDefinition) continue;
      
      const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const { svg } = await mermaid.render(id, graphDefinition);
      
      const wrapper = document.createElement('div');
      wrapper.className = 'mermaid';
      wrapper.innerHTML = svg;
      wrapper.style.direction = 'ltr';
      wrapper.style.textAlign = 'left';
      
      block.replaceWith(wrapper);
    } catch (error) {
      console.error('Mermaid render error:', error);
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-state';
      errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i><p>خطأ في رسم المخطط البياني</p><p class="hint">${error.message}</p>`;
      block.replaceWith(errorDiv);
    }
  }
}

// ========================================
// Legacy Markdown Support (Backward Compatibility)
// ========================================

async function renderLegacyMarkdown(mdPath, container) {
  console.warn('Using legacy markdown renderer for:', mdPath);
  
  // Simple fallback - show message that this needs conversion
  container.innerHTML = `
    <div class="legacy-notice">
      <i class="fas fa-exclamation-triangle"></i>
      <p>هذا المقرر يستخدم تنسيق Markdown القديم.</p>
      <p class="hint">يرجى تحويله إلى تنسيق JSON الجديد.</p>
    </div>
  `;
}

// ========================================
// Event Listeners
// ========================================

function setupEventListeners() {
  // Theme toggle
  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
  
  // Search
  const searchInput = document.getElementById('searchInput');
  searchInput?.addEventListener('input', debounce((e) => {
    state.searchQuery = e.target.value;
    performGlobalSearch(state.searchQuery);
  }, CONFIG.debounceDelay));
  
  // Clear search button
  document.getElementById('clearSearchBtn')?.addEventListener('click', clearSearch);
  
  // Year card click → go to semester
  document.getElementById('yearsGrid')?.addEventListener('click', (e) => {
    const semesterBadge = e.target.closest('.semester-badge');
    if (semesterBadge) {
      const year = parseInt(semesterBadge.dataset.year);
      const semester = parseInt(semesterBadge.dataset.semester);
      renderSemesterCourses(year, semester);
    }
  });
  
  // Back button (from semester to years)
  document.getElementById('backBtn')?.addEventListener('click', goBack);
  
  // Back to semester (from course page to semester)
  document.getElementById('backToSemester')?.addEventListener('click', goBack);
  
  // Breadcrumb home click
  document.getElementById('breadcrumbHome')?.addEventListener('click', goHome);
  
  // Breadcrumb year click
  document.getElementById('breadcrumbYear')?.addEventListener('click', () => {
    if (state.currentYear) {
      renderYears();
    }
  });
  
  // Course card click → go to course page (semester view)
  document.getElementById('coursesGrid')?.addEventListener('click', (e) => {
    const courseCard = e.target.closest('.course-card-large');
    if (courseCard) {
      const courseId = courseCard.dataset.courseId;
      openCourse(courseId);
    }
  });
  
  // Search results card click → go directly to course page
  document.getElementById('searchResultsGrid')?.addEventListener('click', (e) => {
    const courseCard = e.target.closest('.course-card-large');
    if (courseCard) {
      const courseId = courseCard.dataset.courseId;
      const year = parseInt(courseCard.dataset.year);
      const semester = parseInt(courseCard.dataset.semester);
      state.currentYear = year;
      state.currentSemester = semester;
      openCourse(courseId);
    }
  });
  
  // Status select change
  document.getElementById('statusSelect')?.addEventListener('change', (e) => {
    if (state.currentCourse) {
      updateCourseStatus(state.currentCourse.id, e.target.value);
    }
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      goBack();
    }
  });
}

function goBack() {
  if (state.currentCourse) {
    state.currentCourse = null;
    if (state.currentYear && state.currentSemester) {
      showView('semesterView');
      updateBreadcrumb(`الفصل ${state.currentSemester === 1 ? 'الأول' : 'الثاني'}`, state.currentYear, state.currentSemester);
    } else if (state.searchQuery) {
      performGlobalSearch(state.searchQuery);
    } else {
      renderYears();
    }
  } else if (state.searchQuery) {
    state.searchQuery = '';
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    renderYears();
  } else if (state.currentYear) {
    state.currentYear = null;
    state.currentSemester = null;
    renderYears();
  }
}

function goHome() {
  state.currentYear = null;
  state.currentSemester = null;
  state.currentCourse = null;
  state.searchQuery = '';
  
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  
  renderYears();
}

function updateCourseStatus(courseId, status) {
  const course = state.courses.find(c => c.id === courseId);
  if (course) {
    course.status = status;
    saveStatuses();
  }
}

function showError(message) {
  console.error(message);
}

function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ========================================
// Utility Functions
// ========================================

function getStatusClass(status) {
  return `status-${status || 'none'}`;
}