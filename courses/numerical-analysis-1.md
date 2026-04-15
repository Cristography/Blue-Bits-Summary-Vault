# تحليل عددي 1 · Numerical Analysis 1

## 📐 التعاريف الأساسية · Core Definitions

- **الجذر (Root)**: قيمة $x$ تحقق $f(x) = 0$
- **الاستيفاء (Interpolation)**: تقدير قيم بين نقاط معطاة
- **التكامل العددي (Numerical Integration)**: حساب التكامل تقريبياً
- **أنظمة المعادلات الخطية (Linear Systems)**: مجموعة معادلات خطية متزامنة
- **الخطأ (Error)**: الفرق بين القيمة الحقيقية والمقدرة

## 🌿 إيجاد الجذور · Root Finding

### طريقة التنصيف · Bisection Method

#### الخوارزمية · Algorithm

1. ابحث عن $[a,b]$ بحيث $f(a) \cdot f(b) < 0$
2. احسب midpoint: $c = \frac{a+b}{2}$
3. إذا $f(c) = 0$ أو $|b-a| < \epsilon$ → توقف
4. غير bounds:
   - إذا $f(a) \cdot f(c) < 0$: $b = c$
   - إذا $f(c) \cdot f(b) < 0$: $a = c$
5. كرر

#### الصيغة · Formula

$$c_{n+1} = \frac{a_n + b_n}{2}$$

#### نظرية القيمة الوسيطة · Intermediate Value Theorem

إذا كانت $f$ مستمرة على $[a,b]$ و $f(a) \cdot f(b) < 0$:
$$\exists c \in [a,b]: f(c) = 0$$

### طريقة نيوتن-رافسون · Newton-Raphson Method

#### الصيغة · Formula

$$x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$$

#### المشتقة · Derivative

$$f'(x) = \text{مشتقة الدالة}$$

#### المتطلبات · Requirements

- $f$ قابلة للاشتقاق مرتين
- $f'(x) \neq 0$ في الجوار
- $x_0$ قريب من الجذر

### مقارنة الطريقتين · Method Comparison

| الخاصية | التنصيف | نيوتن-رافسون |
|---|---|---|
| التقارب | خطي | تربيعي |
| السرعة | بطيء | سريع |
| ضمان التقارب | نعم | لا |
| المشتقة | لا الحاجة | مطلوب |
| خطأ نهاية | $|b-a|/2^n$ | $\approx O(x_n^2)$ |

```mermaid
graph TD
    A[ابدأ] --> B{أوجد a,b where f(a)×f(b) < 0}
    B --> C[c = (a+b)/2]
    C --> D{f(c) = 0?}
    D -->|نعم| E[الجذر = c]
    D -->|لا| F{|b-a| < ε?}
    F -->|نعم| E
    F -->|لا| G{f(a)×f(c) < 0?}
    G -->|نعم| H[b = c]
    G -->|لا| I[a = c]
    H --> C
    I --> C
```

## 📐 الاستيفاء · Interpolation

### استيفاء لاغرانج · Lagrange Interpolation

#### الصيغة · Formula

$$P_n(x) = \sum_{i=0}^{n} y_i L_i(x)$$

#### أساسيات لاغرانج · Lagrange Basis

$$L_i(x) = \prod_{j=0, j \neq i}^{n} \frac{x - x_j}{x_i - x_j}$$

#### مثال · Example

لنقطتين $(x_0, y_0)$ و $(x_1, y_1)$:

$$P_1(x) = y_0 \frac{x-x_1}{x_0-x_1} + y_1 \frac{x-x_0}{x_1-x_0}$$

### استيفاء نيوتن · Newton Interpolation

#### الفرق المقسوم · Divided Differences

$$f[x_i] = f(x_i)$$

$$f[x_i, x_{i+1}] = \frac{f(x_{i+1}) - f(x_i)}{x_{i+1} - x_i}$$

$$f[x_i, x_{i+1}, x_{i+2}] = \frac{f[x_{i+1}, x_{i+2}] - f[x_i, x_{i+1}]}{x_{i+2} - x_i}$$

#### الصيغة · Formula

$$P_n(x) = f[x_0] + f[x_0, x_1](x-x_0) + f[x_0, x_1, x_2](x-x_0)(x-x_1) + ...$$

### مقارنة الطريقتين · Comparison

| الخاصية | لاغرانج | نيوتن |
|---|---|---|
| الحساب | أطول | أقصر |
| إضافة نقطة | إعادة الحساب | تحديث |
| استقرار | أقل | أفضل |
| الفروق | لا يستخدم | يستخدم |

## 🧮 التكامل العددي · Numerical Integration

### طريقة شبه المنحرف · Trapezoidal Rule

#### الصيغة · Formula

$$\int_a^b f(x)dx \approx \frac{h}{2}[f(x_0) + 2\sum_{i=1}^{n-1} f(x_i) + f(x_n)]$$

حيث $h = \frac{b-a}{n}$

#### الخطأ · Error

$$E_T = -\frac{(b-a)^3}{12n^2}f''(\xi)$$

### طريقة سيمبسون · Simpson's Rule

#### الصيغة · Formula (1/3 Rule)

$$\int_a^b f(x)dx \approx \frac{h}{3}[f(x_0) + 4f(x_1) + f(x_2)]$$

لـ $n$ زوجي (نقطتان + 3 نقاط):

$$h = \frac{b-a}{2}$$

#### الصيغة · Formula (1/3 General)

$$\int_a^b f(x)dx \approx \frac{h}{3}[f_0 + 4f_1 + 2f_2 + 4f_3 + ... + f_n]$$

#### الخطأ · Error

$$E_S = -\frac{(b-a)^5}{180n^4}f^{(4)}(\xi)$$

### جدول دقة التكامل · Integration Accuracy Table

| الطريقة | الترتيب | الخطأ |
|---|---|---|
| المستطيل | 0 | $O(h)$ |
| شبه المنحرف | 1 | $O(h^2)$ |
| سيمبسون | 3 | $O(h^4)$ |
| بوينكوت | 5 | $O(h^6)$ |

### قاعدة ريتشبرغ · Richardson Extrapolation

لتحسين الدقة:

$$I \approx \frac{4I_{h/2} - I_h}{3}$$

```mermaid
graph LR
    A[دالة f(x)] --> B[تقسيم المجال]
    B --> C{الطريقة}
    C -->|شبه منحرف| D[D= h/2 ×مجموع]
    C -->|سيمبسون| E[E= h/3 ×مجموع مرجح]
    D --> F[حساب التكامل]
    E --> F
    F --> G[الخطأ المقدر]
```

## 📊 حل الأنظمة الخطية · Solving Linear Systems

### طريقة جاوس للحذف · Gaussian Elimination

#### الخطوات · Steps

1. اكتب المعادلات في شكل مصفوفة معززة
2. استخدم عمليات الصف لتكون مثلثية
3. است Substitute للرجوع

#### العمليات الأولية · Elementary Operations

- تبديل الصفوف: $R_i \leftrightarrow R_j$
- ضرب صف في ثابت: $R_i \to cR_i$
- جمع صف مضروب: $R_i \to R_i + cR_j$

### طريقة جاوس-جوردان · Gauss-Jordan Method

يبقى على الصيغة المختزلة row echelon:

$$\begin{bmatrix} 1 & 0 & 0 & | & a \\ 0 & 1 & 0 & | & b \\ 0 & 0 & 1 & | & c \end{bmatrix}$$

### تحليل LU · LU Decomposition

$$A = LU$$

- $L$: Lower triangular
- $U$: Upper triangular

$$Ax = b \Rightarrow L(Ux) = b$$
$$Ly = b$$
$$Ux = y$$

### طريقة جاكوبي · Jacobi Method (Iterative)

#### الصيغة · Formula

$$x_i^{(k+1)} = \frac{1}{a_{ii}}(b_i - \sum_{j \neq i} a_{ij}x_j^{(k)})$$

#### شرط التقارب · Convergence Condition

$$\sum_{j \neq i} |a_{ij}| < |a_{ii}|$$

### طريقة جاوس-سايدل · Gauss-Seidel Method

#### الصيغة · Formula

$$x_i^{(k+1)} = \frac{1}{a_{ii}}(b_i - \sum_{j < i} a_{ij}x_j^{(k+1)} - \sum_{j > i} a_{ij}x_j^{(k)})$$

#### التقارب · Convergence

أسرع من جاكوبي Generally

### جدول الطرق · Methods Comparison

| الطريقة | التعقيد | الذاكرة | التقارب |
|---|---|---|---|
| جاوس | $O(n^3)$ | صغير | --
| LU | $O(n^3)$ | صغير | --
| جاكوبي | $O(n^2)$ | كبير | بطيء |
| جاوس-سايدل | $O(n^2)$ | صغير | Faster |

## 📝 أمثلة محلولة · Worked Examples

### المثال 1: طريقة التنصيف

**المطلوب**: جد جذر $f(x) = x^3 - 2x - 5$ في $[2,3]$

$$f(2) = 8 - 4 - 5 = -1$$
$$f(3) = 27 - 6 - 5 = 16$$

| Iteration | a | b | c | f(c) |
|---|---|---|---|---|
| 1 | 2 | 3 | 2.5 | 15.625 - 5 - 5 = 5.625 |
| 2 | 2 | 2.5 | 2.25 | 11.39 - 4.5 - 5 = 1.89 |
| 3 | 2 | 2.25 | 2.125 | ... |
| 4 | 2 | 2.125 | 2.0625 | ... |
| 5 | 2 | 2.0625 | 2.03125 | ... |

**الجذر ≈ 2.09** (بعد عدة تكرارات)

### المثال 2: طريقة نيوتن-رافسون

**المطلوب**: جد جذر $f(x) = x^2 - 5$ بـ $x_0 = 3$

$$f'(x) = 2x$$

$$x_1 = 3 - \frac{9-5}{6} = 3 - \frac{4}{6} = 2.333$$

$$x_2 = 2.333 - \frac{5.444-5}{4.667} = 2.333 - 0.095 = 2.238$$

$$x_3 = 2.238 - \frac{5.009-5}{4.476} = 2.238 - 0.002 = 2.236$$

**الجذر ≈ 2.236** ($\sqrt{5}$)

### المثال 3: استيفاء لاغرانج

**المطلوب**: أوجد كثيرة الحدود مروراً بـ $(1,1), (2,3), (3,9)$

$$L_0 = \frac{(x-2)(x-3)}{(1-2)(1-3)} = \frac{(x-2)(x-3)}{2}$$

$$L_1 = \frac{(x-1)(x-3)}{(2-1)(2-3)} = -(x-1)(x-3)$$

$$L_2 = \frac{(x-1)(x-2)}{(3-1)(3-2)} = \frac{(x-1)(x-2)}{2}$$

$$P(x) = 1 \cdot L_0 + 3 \cdot L_1 + 9 \cdot L_2$$

### المثال 4: التكامل بشبه المنحرف

**المطلوب**: $\int_0^2 x^2 dx$ بـ $n=4$

$$h = \frac{2-0}{4} = 0.5$$

$$x_0=0, x_1=0.5, x_2=1, x_3=1.5, x_4=2$$

$$\int \approx \frac{0.5}{2}[f(0) + 2(f(0.5)+f(1)+f(1.5)) + f(2)]$$

$$= 0.25[0 + 2(0.25+1+2.25) + 4]$$

$$= 0.25[0 + 2(3.5) + 4] = 0.25[0 + 7 + 4] = 2.75$$

**الدقيق = 8/3 ≈ 2.667** (خطأ صغير)

### المثال 5: طريقة جاوس

**المطلوب**: حل النظام:
$$\begin{cases} x + y + z = 6 \\ 2x - y + z = 3 \\ x + 2y - z = 0 \end{cases}$$

**المصفوفة المعززة**:
$$\begin{bmatrix} 1 & 1 & 1 & | & 6 \\ 2 & -1 & 1 & | & 3 \\ 1 & 2 & -1 & | & 0 \end{bmatrix}$$

$R_2 \leftarrow R_2 - 2R_1$:
$$\begin{bmatrix} 1 & 1 & 1 & | & 6 \\ 0 & -3 & -1 & | & -9 \\ 1 & 2 & -1 & | & 0 \end{bmatrix}$$

$R_3 \leftarrow R_3 - R_1$:
$$\begin{bmatrix} 1 & 1 & 1 & | & 6 \\ 0 & -3 & -1 & | & -9 \\ 0 & 1 & -2 & | & -6 \end{bmatrix}$$

$R_2 \leftarrow -\frac{1}{3}R_2$:
$$\begin{bmatrix} 1 & 1 & 1 & | & 6 \\ 0 & 1 & 1/3 & | & 3 \\ 0 & 1 & -2 & | & -6 \end{bmatrix}$$

**etc...** → الحل: $x=1, y=2, z=3$

## 📊 جدول أخطاء التقارب · Error & Convergence Table

| الطريقة | معدل التقارب | تقدير الخطأ |
|---|---|---|
| التنصيف | $\frac{1}{2^n}$ | $\frac{b-a}{2^n}$ |
|Newton-Raphson | quadratic | $\|x_{n+1} - x_n\|$ |
| Secant | $\phi^{n}$ | $\|x_{n+1} - x_n\|$ |
| Fixed-point | $\|g'(c)\|^n$ | $\|x_n - c\|$ |

### رتبة التقارب · Order of Convergence

$$|x_{n+1} - c| \approx K|x_n - c|^p$$

- $p = 1$: خطي Linear
- $p = 2$: تربيعي Quadratic
- $p = 3$: تكعيبي Cubic

## 📊 جدول مرجعي شامل · Master Reference Table

| المفهوم | الصيغة | الملاحظات |
|---|---|---|
| التنصيف | $c = \frac{a+b}{2}$ | ضمان التقارب |
| Newton-Raphson | $x_{n+1} = x_n - f/f'$ | سريع لكن قد يتباعد |
| لاغرانج | $P(x) = \sum y_i L_i$ | سهل التنفيذ |
| نيوتن | $P(x) = f[x_0] + ...$ | يضاف نقطة بسهولة |
| شبه المنحرف | $\frac{h}{2}[f_0 + 2f_1 + f_2]$ | خطأ $O(h^2)$ |
| سيمبسون | $\frac{h}{3}[f_0 + 4f_1 + f_2]$ | خطأ $O(h^4)$ |
| جاوس | $O(n^3)$ | مباشر |
| LU | $A = LU$ | لحل متكرر |
| جاكوبي | $x^{(k+1)} = D^{-1}(b - (L+U)x^{(k)})$ | تكراري |
| Gauss-Seidel | تحديث متتابع | أسرع |

## ⚠️ أخطاء شائعة وملاحظات · Common Pitfalls & Notes

- **نيوتن-رافسون يتباعد**: إذا كانت $f'(x) = 0$ near root, اختر طريقة أخرى
- **التنصيف بطيء**: جيد للضمان لكن بطيء عملياً
- **شبه المنحرف ل arcsin**: قد يفشل إذا كانت الدالة غير منتظمة
- **سيمبسون تتطلب n زوجي**: Number of intervals must be even
- **جاكبي لا تقرب دائماً**: شرط التقارب: diagonal dominance
- **أخطاء التدوير**: استخدم pivot جزئي for stability
- **LU لا يوجد دائماً**: يتطلب all leading principal minors > 0
- **استيفاء polynomial عالي الدرجة**: Runge's phenomenon - تجنب الدرجات العالية
- **التقارب المحلي فقط**: Newton-Raphson قد يتقارب لجذر بعيد عن $x_0$

💡 **تلميح**: دائماً تحقق من استقرار الحل
- استخدم more than one method للمقارنة
- ابدأ بـ bisection للضمان ثم حـّن بـ Newton

💡 **تلميح2**: لحل أنظمة خطية:
1. Small n → Gaussian elimination
2. Large sparse → iterative methods
3. Same matrix, different b → LU decompose once

💡 **تلميح3**: للتكامل العددي:
- سيمبسون أكثر دقة من trapezoidal للدوال الملساء
- قلل h (increase n) لتقليل الخطأ

# 📚 المراجع · References

- **Book**: Numerical Analysis, Burden & Faires
- **Book**: Numerical Methods for Engineers, Chapra & Canale
- **Online**: Wikipedia - Numerical analysis