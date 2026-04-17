# AI Prompt for Blue Bits Summary Vault (v2.0)
## Component-Based JSON Generation - Works with ALL LLMs

---

## 🎯 Universal Prompt

Use this **exact prompt** with any LLM (ChatGPT, Claude, Gemini, Grok, DeepSeek, etc.):

```
أنت خبير أكاديمي في تلخيص المواد الجامعية. أنشئ ملخصاً للمقرر التالي كـمكونات JSON منظمة وفق المعايير التالية:

## المتطلبات الإلزامية:

1. **الناتج**: JSON صالح فقط (بدون markdown، بدون نص إضافي، بدون مقدمة أو خاتمة)
2. **البنية**: مصفوفة من cards، كل card يحتوي children
3. **العناوين**: عربي مع الإنجليزية بين أقواس: "title": "📐 العنوان · English"
4. **الرياضيات**: صيغ LaTeX في حقول "formula" مع "display": true للـ $$
5. **الرسوم**: مخطط Mermaid في حقل "code" مع تحديد "chart": "flowchart"
6. **الجداول**: مصفوفة headers وصفوف في "table"
7. **الكود**: كود برمجي في حقل "code" مع تحديد اللغة
8. **اللغة**: عربية أكاديمية، الإنجليزية في حقول منفصلة (term_en, name_en)

## هيكل الـ JSON المطلوب:

{
  "course": {
    "id": "course-slug",
    "title_ar": "اسم المقرر بالعربي",
    "title_en": "Course Name in English"
  },
  "components": [
    {
      "type": "card",
      "title": "📐 التعاريف الأساسية · Core Definitions",
      "icon": "📐",
      "children": [
        { "type": "definition", "term": "المصطلح", "term_en": "Term", "description": "التعريف", "formula": "\\ LaTeX \\" },
        { "type": "definition", ... }
      ]
    },
    {
      "type": "card", 
      "title": "🧮 النظريات والصيغ · Theorems & Formulas",
      "children": [
        { "type": "equation", "formula": "\\ LaTeX \\", "display": true, "label": "اسم النظرية" },
        { "type": "theorem", "name": "النظرية", "name_en": "Theorem", "statement": "العبارة", "proof": " proof optional" }
      ]
    },
    {
      "type": "card",
      "title": "🔁 الخوارزميات والعمليات · Algorithms & Processes",
      "children": [
        { "type": "diagram", "chart": "flowchart", "code": "mermaid syntax" },
        { "type": "list", "ordered": false, "items": [{ "text": "خطأ 1" }, { "text": "خطأ 2" }] }
      ]
    },
    {
      "type": "card",
      "title": "📊 الجداول المرجعية · Reference Tables", 
      "children": [
        { "type": "table", "headers": ["عمود 1", "عمود 2"], "rows": [["قيمة 1", "قيمة 2"]] }
      ]
    },
    {
      "type": "card",
      "title": "⚠️ الأخطاء الشائعة · Common Pitfalls",
      "children": [
        { "type": "warning", "variant": "warning", "title": "الخطأ", "text": "الشرح" }
      ]
    },
    {
      "type": "card",
      "title": "📝 ملخص · Summary",
      "children": [
        { "type": "list", "items": [{ "text": "نقطة 1" }, { "text": "نقطة 2" }] }
      ]
    }
  ]
}

## المقرر: [اسم المقرر]
## المنهج: [المواضيع أو ملاحظات المحاضرات]
```

---

## 📋 How to Use

1. **Copy** the universal prompt above
2. **Replace** `[اسم المقرر]` with the course name
3. **Replace** `[المواضيع أو ملاحظات المحاضرات]` with the topics
4. **Paste** into any LLM
5. **Copy** the raw JSON output
6. **Save** as `courses/[course-id].json`

---

## ✅ Quality Checklist

Before using the output, verify:

- [ ] JSON صالح (يبدأ بـ { وينتهي بـ })
- [ ] كل card يحتوي title, children
- [ ] معادلات LaTeX في حقول "formula"
- [ ] مخطط Mermaid واحد على الأقل (إن أمكن)
- [ ] جداول في components ذات table
- [ ] warning للأخطاء الشائعة
- [ ] list في الملخص
- [ ] بدون مقدمة أو خاتمة
- [ ] بدون markdown خارج الـ JSON

---

## 📝 Example

**Input to LLM:**
```
 المقرر: نظرية المخططات
 المنهج: أنواع المخططات، درجات الرؤوس، المصاصة، المستوية، خوارزميات MST (بريم، كروسكال)
```

**Expected Output:**
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
        {
          "type": "definition",
          "term": "المخطط",
          "term_en": "Graph",
          "description": "بنية رياضية تتكون من مجموعة رؤوس ومجموعة حواف",
          "formula": "G(V,E)"
        },
        {
          "type": "definition", 
          "term": "درجة الرأس",
          "term_en": "Degree",
          "description": "عدد الحواف المتصلة بالرأس",
          "formula": "\\deg(v)"
        }
      ]
    },
    {
      "type": "card",
      "title": "🧮 النظريات والصيغ · Theorems & Formulas",
      "icon": "🧮",
      "children": [
        {
          "type": "equation",
          "formula": "\\sum_{v \\in V} \\deg(v) = 2|E|",
          "display": true,
          "label": "Handshaking Lemma"
        },
        {
          "type": "theorem",
          "name": "نظرية مصافقة الأيدي",
          "name_en": "Handshaking Lemma",
          "statement": "مجموع درجات جميع الرؤوس يساوي ضعف عدد الحواف"
        }
      ]
    },
    {
      "type": "card",
      "title": "🔁 خوارزمية بريم · Prim's Algorithm",
      "icon": "🔁",
      "children": [
        {
          "type": "diagram",
          "chart": "flowchart",
          "code": "graph TD\n    A[ابدأ] --> B[اختر حافة الأصغر]\n    B --> C{اكتملت الشجرة؟}\n    C -->|No| B\n    C -->|Yes| D[انتهى]"
        },
        {
          "type": "code",
          "language": "pseudo",
          "code": "1. اختر رأساً ابتدائياً\n2. أضف الحواف الأصغر\n3. ��رر حتى الاكتمال",
          "caption": "خوارزمية بريم"
        }
      ]
    },
    {
      "type": "card",
      "title": "📊 جدول المخططات · Graphs Table",
      "icon": "📊",
      "children": [
        {
          "type": "table",
          "headers": ["المخطط", "|V|", "|E|", "مستوي؟"],
          "rows": [
            ["K₃", "3", "3", "نعم"],
            ["K₄", "4", "6", "نعم"],
            ["K₅", "5", "10", "لا"]
          ]
        }
      ]
    },
    {
      "type": "card",
      "title": "⚠️ الأخطاء الشائعة · Common Pitfalls",
      "icon": "⚠️",
      "children": [
        {
          "type": "warning",
          "variant": "warning",
          "title": "شرط لازم ≠ شرط كافٍ",
          "text": "الشرط m ≤ 3n-6 شرط لازم للمستوية لكنه ليس كافياً"
        }
      ]
    },
    {
      "type": "card",
      "title": "📝 ملخص · Summary",
      "icon": "📝",
      "children": [
        {
          "type": "list",
          "items": [
            { "text": "نظرية مصافقة الأيدي: مجموع الدرجات = 2|E|" },
            { "text": "خوارزميات MST: بريم (O(E log V))، كروسكال" }
          ]
        }
      ]
    }
  ]
}
```

---

## 💡 Tips for Better Results

1. **Be specific**: Include topics, not just course name
2. **Request math**: Add "أضف صيغ LaTeX للمعادلات"
3. **Request diagrams**: أضف "مخططات Mermaid للعمليات"
4. **For code courses**: "كود مع شرح وتعقيد O(n)"
5. **For math courses**: "أمثلة محلولة خطوة بخطوة"

---

## 🔧 Component Types Reference

### card
```json
{ "type": "card", "title": "العنوان", "icon": "📐", "children": [] }
```

### heading (deprecated - use card instead)
```json
{ "type": "heading", "level": 2, "text": "العنوان" }
```

### paragraph
```json
{ "type": "paragraph", "text": "نص مع $معادلة$", "align": "right" }
```

### equation
```json
{ "type": "equation", "formula": "\\frac{a}{b}", "display": true, "label": "الصيغة" }
```

### definition
```json
{ "type": "definition", "term": "المصطلح", "term_en": "Term", "description": "التعريف", "formula": "\\ LaTeX \\" }
```

### list
```json
{ "type": "list", "ordered": false, "items": [{ "text": "عنصر 1" }, { "text": "عنصر 2" }] }
```

### table
```json
{ "type": "table", "headers": ["عمود 1", "عمود 2"], "rows": [["ق1", "ق2"]], "caption": "الجدول" }
```

### diagram
```json
{ "type": "diagram", "chart": "flowchart", "code": "graph TD\n    A --> B", "caption": "المخطط" }
```

### code
```json
{ "type": "code", "language": "cpp", "code": "int main() {}", "caption": "كود" }
```

### warning
```json
{ "type": "warning", "variant": "warning", "title": "العنوان", "text": "النص" }
```

### theorem
```json
{ "type": "theorem", "name": "النظرية", "name_en": "Theorem", "statement": "العبارة", "proof": "البرهان" }
```

### example
```json
{ "type": "example", "title": "المثال 1", "given": "المعطيات", "solution": "الحل", "result": "النتيجة" }
```

### divider
```json
{ "type": "divider", "style": "solid" }
```

---

*Universal Prompt v2.0 - JSON Components - Works with All LLMs*