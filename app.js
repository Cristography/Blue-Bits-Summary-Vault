/**
 * Blue Bits Summary Vault - Application
 * Author: Crist Yaghjian
 * Version: 2.0
 * 
 * Zero-build static site renderer
 * Supports: Markdown, LaTeX (KaTeX), Mermaid diagrams
 * Navigation: Home → Years → Semester → Course Page (no modal)
 */

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
      theme: 'default',
      securityLevel: 'strict',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      }
    });
  }
}

// ========================================
// View Management
// ========================================

function showView(viewName) {
  const views = ['yearsView', 'semesterView', 'coursePage'];
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
  
  // Filter and render courses - LARGER CARD GRID
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
  
  // BIGGER CARDS with larger font
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
// Rendering - Course Page (Dedicated Page)
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
  const semesterLabel = `الفصل ${course.semester === 1 ? 'الأول' : 'الثاني'}`;
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
  
  // Load markdown content
  if (course.summary_md) {
    await renderCourseContent(course.summary_md, courseContent);
  } else {
    if (courseContent) {
      courseContent.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-file-alt"></i>
          <p>لم يتم إضافة ملخص لهذا المقرر بعد.</p>
          <p class="hint">يرجى إضافة ملف الملخص في المجلد المناسب</p>
        </div>
      `;
    }
  }
}

async function renderCourseContent(mdPath, container) {
  if (!container) return;
  
  console.log('Loading:', mdPath); // Debug log
  
  try {
    const response = await fetch(mdPath);
    console.log('Response status:', response.status); // Debug log
    
    if (!response.ok) throw new Error(`Failed to load: ${response.status} ${response.statusText}`);
    
    const md = await response.text();
    console.log('Loaded MD length:', md.length); // Debug log
    
    // Preprocess card syntax  
    const processedMd = preprocessCards(md);
    
    // Parse markdown to HTML
    const html = marked.parse(processedMd);
    
    // Sanitize with DOMPurify
    const safeHtml = DOMPurify.sanitize(html);
    
    // Wrap content in container
    container.innerHTML = `
      <div class="summary-content" id="summaryContent">
        ${safeHtml}
      </div>
    `;
    
    // Transform content into cards - wrap each h2 in a card
    transformToCards(container);
    
    // Render LaTeX (KaTeX)
    renderMath(container);
    
    // Render Mermaid diagrams
    await renderMermaidDiagrams(container);
    
  } catch (error) {
    console.error('Error rendering course content:', error);
    console.error('Error details:', error.message); // More detail
    container.innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>فشل تحميل المحتوى: ${mdPath}</p>
        <p class="hint">${error.message}</p>
      </div>
    `;
  }
}

function preprocessCards(md) {
  // No longer needed - transformToCards handles card wrapping
  return md;
}

function transformToCards(container) {
  const summaryContent = container.querySelector('.summary-content');
  if (!summaryContent) return;
  
  // Get all children
  const children = Array.from(summaryContent.children);
  
  // Group content by h2 sections
  let sections = [];
  let currentSection = null;
  let contentBuffer = [];
  
  children.forEach(child => {
    if (child.tagName === 'H2') {
      if (currentSection) {
        sections.push({ title: currentSection, content: [...contentBuffer] });
      }
      currentSection = child.textContent;
      contentBuffer = [];
    } else {
      contentBuffer.push(child);
    }
  });
  
  if (currentSection) {
    sections.push({ title: currentSection, content: contentBuffer });
  }
  
  // If no sections, make everything one card
  if (sections.length === 0) {
    sections = [{ title: 'المحتوى', content: children }];
  }
  
  // Build HTML - each section becomes a card
  summaryContent.innerHTML = sections.map((section) => {
    const icon = getSectionIcon(section.title);
    return `
      <div class="content-card">
        <div class="card-header">
          <span class="card-icon">${icon}</span>
          <h3 class="card-title">${section.title}</h3>
        </div>
        <div class="card-body">
          ${section.content.map(el => el.outerHTML).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function getSectionIcon(title) {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('تعاريف') || titleLower.includes('مفاهيم') || titleLower.includes('definition')) return '📐';
  if (titleLower.includes('أنواع') || titleLower.includes('types') || titleLower.includes('data')) return '🧮';
  if (titleLower.includes('تحكم') || titleLower.includes('control') || titleLower.includes('flow')) return '🔁';
  if (titleLower.includes('دوال') || titleLower.includes('functions')) return '⚙️';
  if (titleLower.includes('جدول') || titleLower.includes('table')) return '📊';
  if (titleLower.includes('مخطط') || titleLower.includes('diagram')) return '📈';
  if (titleLower.includes('ملخص') || titleLower.includes('summary')) return '📝';
  if (titleLower.includes('أخطاء') || titleLower.includes('pitfalls') || titleLower.includes('mistakes')) return '⚠️';
  return '📚';
}

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

async function renderMermaidDiagrams(container) {
  if (typeof mermaid === 'undefined') return;
  
  const mermaidBlocks = container.querySelectorAll('.language-mermaid, pre code.language-mermaid');
  
  for (const block of mermaidBlocks) {
    try {
      const graphDefinition = block.textContent || block.innerText;
      const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const { svg } = await mermaid.render(id, graphDefinition);
      
      const wrapper = document.createElement('div');
      wrapper.className = 'mermaid';
      wrapper.innerHTML = svg;
      
      block.replaceWith(wrapper);
    } catch (error) {
      console.error('Mermaid render error:', error);
    }
  }
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
    if (state.currentYear && state.currentSemester) {
      renderSemesterCourses(state.currentYear, state.currentSemester);
    } else {
      renderYears();
    }
  }, CONFIG.debounceDelay));
  
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
  
  // Course card click → go to course page
  document.getElementById('coursesGrid')?.addEventListener('click', (e) => {
    const courseCard = e.target.closest('.course-card-large');
    if (courseCard) {
      const courseId = courseCard.dataset.courseId;
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
    // Go from course page to semester
    state.currentCourse = null;
    if (state.currentYear && state.currentSemester) {
      showView('semesterView');
      updateBreadcrumb(`الفصل ${state.currentSemester === 1 ? 'الأول' : 'الثاني'}`, state.currentYear, state.currentSemester);
    } else {
      renderYears();
    }
  } else if (state.currentYear) {
    // Go from semester to years
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