# تحليل 2 · Calculus 2

## 🧮 التكامل بالتجزيء · Integration by Parts

### الصيغة الأساسية · Basic Formula

$$\int u \, dv = uv - \int v \, du$$

### اختيار u (قاعدة LIATE) · Choosing u (LIATE Rule)

| الترتيب | النوع | مثال |
|---|---|---|
| L | Logarithmic (لوغاريتمي) | $\ln x$, $\log_2 x$ |
| I | Inverse trig (عكسية مثلثية) | $\arcsin x$, $\arctan x$ |
| A | Algebraic (جبرية) | $x^2$, $x^3$, $\sqrt{x}$ |
| T | Trig (مثلثية) | $\sin x$, $\cos x$ |
| E | Exponential (أسية) | $e^x$, $a^x$ |

### التككرار · Repeated Integration

لتكامل يتطلب تجزيء متكرر:

$$\int x^n e^x dx$$

**الخطوات**:
1. $u = x^n$, $dv = e^x dx$
2. $du = nx^{n-1}dx$, $v = e^x$
3. كرر حتى ينتهي الأس

### حالة خاصة: التكامل المعكوس للمثلثات · Special Cases

$$\int \ln x \, dx = x \ln x - x + C$$

$$\int \arcsin x \, dx = x \arcsin x + \sqrt{1-x^2} + C$$

---

## ¹⁄ₓ التكامل بالكسور الجزئية · Partial Fractions

### الحالات الأربع · Four Cases

#### 1. كسر بسيط linear denominator · مقام خطي بسيط

$$\int \frac{P(x)}{ax+b} dx = \int \frac{A}{ax+b} dx = \frac{A}{a} \ln|ax+b| + C$$

#### 2. كسر linear repeated · مقام خطي متكرر

$$\int \frac{P(x)}{(ax+b)^n} dx = \int \left(\frac{A}{ax+b} + \frac{B}{(ax+b)^2} + ...\right) dx$$

#### 3. quadratic irreducible · مربع غير قابل للتحليل

$$\int \frac{P(x)}{ax^2+bx+c} dx = \int \frac{Ax+B}{ax^2+bx+c} dx$$

#### 4. quadratic repeated · مربع متكرر

$$\int \frac{P(x)}{(ax^2+bx+c)^n} dx$$

### خطوات التحليل · Decomposition Steps

1. **تحليل المقام** إلى عوامل أولية
2. **كتابة الكسر** ك مجموع كسور بسيطة
3. **إيجاد المعاملات** بالمساواة
4. **تكامل كل كسر** على حدة

### مثال توضيحي · Example

$$\frac{x+1}{x^2-4} = \frac{x+1}{(x-2)(x+2)} = \frac{A}{x-2} + \frac{B}{x+2}$$

بالمساواة: $x+1 = A(x+2) + B(x-2)$

بالتعويض: $A = \frac{3}{4}$, $B = \frac{1}{4}$

---

## ∫ التكامل المثلثي · Trigonometric Integrals

### قوى الزاوية الواحدة · Powers of Single Angle

#### قوة زوجية من sin و cos

$$\int \sin^n x \cos^m x \, dx$$

- **m أو n زوجية**: استخدم $\sin^2 x = \frac{1-\cos 2x}{2}$ أو $\cos^2 x = \frac{1+\cos 2x}{2}$
- **أحدهما奇female**: استخدم $u = \sin x$ أو $u = \cos x$

#### مثال: $\int \sin^2 x \, dx$

$$\int \sin^2 x \, dx = \int \frac{1-\cos 2x}{2} dx = \frac{x}{2} - \frac{\sin 2x}{4} + C$$

### حاصل ضرب دوال مثلثية · Products of Trig Functions

| الحالة | التكامل | النتيجة |
|---|---|---|
| $\int \sin ax \cos bx \, dx$ | | $-\frac{\cos(a-b)x}{2(a-b)} - \frac{\cos(a+b)x}{2(a+b)} + C$ |
| $\int \sin ax \sin bx \, dx$ | | $-\frac{\sin(a-b)x}{2(a-b)} + \frac{\sin(a+b)x}{2(a+b)} + C$ |
| $\int \cos ax \cos bx \, dx$ | | $\frac{\sin(a-b)x}{2(a-b)} + \frac{\sin(a+b)x}{2(a+b)} + C$ |

### التكامل بالiót substitution · Tangent Substitution

للتكامل $\int \frac{dx}{\sqrt{a^2-x^2}}$:

$$x = a \sin \theta \quad \Rightarrow \quad dx = a \cos \theta \, d\theta$$

للتكامل $\int \frac{dx}{a^2+x^2}$:

$$x = a \tan \theta \quad \Rightarrow \quad dx = a \sec^2 \theta \, d\theta$$

---

## ∞ المتسلسلات · Series

### تعريف المتسلسلة · Series Definition

$$S = \sum_{n=1}^{\infty} a_n = a_1 + a_2 + a_3 + ...$$

### تقارب المتسلسلات · Series Convergence

#### 1. اختبار الحد n- · nth Term Test

$$\lim_{n \to \infty} a_n = 0$$

إذا لم = 0، المتسلسلة تتباعد.

#### 2. اختبار التكامل · Integral Test

$$\int_1^{\infty} f(x) dx \text{ converges } \Rightarrow \sum_{n=1}^{\infty} f(n) \text{ converges}$$

#### 3. اختبار المقارنة · Comparison Test

- إذا $a_n \leq b_n$ و $\sum b_n$ تتقارب → $\sum a_n$ تتقارب
- إذا $a_n \geq b_n$ و $\sum b_n$ تتباعد → $\sum a_n$ تتباعد

#### 4. اختبار النسبة · Ratio Test

$$L = \lim_{n \to \infty} \left|\frac{a_{n+1}}{a_n}\right|$$

- $L < 1$: تتقارب
- $L > 1$: تتباعد
- $L = 1$: غير حاسم

#### 5. اختبار الجذر · Root Test

$$L = \lim_{n \to \infty} \sqrt[n]{|a_n|}$$

- $L < 1$: تتقارب
- $L > 1$: تتباعد
- $L = 1$: غير حاسم

### المتسلسلات المهمة · Important Series

| المتسلسلة | المجموع | التقارب |
|---|---|---|
| هندسية | $\sum_{n=0}^{\infty} ar^n = \frac{a}{1-r}$ | $\|r\| < 1$ |
| توافقية | $\sum_{n=1}^{\infty} \frac{1}{n}$ | تتباعد |
| p-series | $\sum_{n=1}^{\infty} \frac{1}{n^p}$ | $p > 1$ |
| متناوبة | $\sum_{n=1}^{\infty} (-1)^{n-1} a_n$ | converges if $a_n$ ↓ and $\to 0$ |

---

## 📐 متسلسلة تايلور · Taylor Series

### تعريف · Definition

$$f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!} (x-a)^n$$

$$= f(a) + f'(a)(x-a) + \frac{f''(a)}{2!}(x-a)^2 + ...$$

### متسلسلات ماكلورين المهمة · Important Maclaurin Series

$$e^x = \sum_{n=0}^{\infty} \frac{x^n}{n!} = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + ...$$

$$\sin x = \sum_{n=0}^{\infty} (-1)^n \frac{x^{2n+1}}{(2n+1)!} = x - \frac{x^3}{3!} + \frac{x^5}{5!} - ...$$

$$\cos x = \sum_{n=0}^{\infty} (-1)^n \frac{x^{2n}}{(2n)!} = 1 - \frac{x^2}{2!} + \frac{x^4}{4!} - ...$$

$$\ln(1+x) = \sum_{n=1}^{\infty} (-1)^{n-1} \frac{x^n}{n} = x - \frac{x^2}{2} + \frac{x^3}{3} - ... \quad (-1 < x \leq 1)$$

$$\frac{1}{1-x} = \sum_{n=0}^{\infty} x^n = 1 + x + x^2 + ... \quad (|x| < 1)$$

### خطأ تايلور · Taylor Remainder

$$R_n(x) = \frac{f^{(n+1)}(c)}{(n+1)!} (x-a)^{n+1} \quad \text{where } c \in (a,x)$$

### نصف قطر التقارب · Radius of Convergence

```mermaid
graph LR
    A[دالة f(x)] --> B{نصف قطر التقارب R}
    B --> C[|x-a| < R]
    B --> D[|x-a| = R]
    B --> E[|x-a| > R]
    C --> F[تتقارب مطلقاً]
    D --> G[تحقق على طرف]
    E --> H[تتباعد]
```

---

## 📍 الإحداثيات القطبية · Polar Coordinates

### التحويل · Conversion

$$x = r \cos \theta$$

$$y = r \sin \theta$$

$$r = \sqrt{x^2 + y^2}$$

$$\theta = \arctan\left(\frac{y}{x}\right)$$

### المساحة في الإحداثيات القطبية · Area in Polar

$$A = \frac{1}{2} \int_{\alpha}^{\beta} r^2 \, d\theta$$

### طول القوس · Arc Length

$$s = \int_{\alpha}^{\beta} \sqrt{r^2 + \left(\frac{dr}{d\theta}\right)^2} \, d\theta$$

### المنحنيات المهمة · Important Curves

| المنحنى | المعادلة القطبية |
|---|---|
| دائرة | $r = a$ |
| قلب | $r = a(1 - \cos\theta)$ |
| ليمون | $r = a \cos 3\theta$ |
| حلزون | $r = a\theta$ |

---

## 🔗 تكامل techniques · Integration Techniques Summary

```mermaid
graph TD
    A[التكامل المطلوب] --> B{شكل الدالة}
    B --> C[دالة أساسية]
    B --> D[دالة مركبة]
    B --> E[دالة مثلثية]
    B --> F[كسر نسبي]
    C --> G[قاعدة القوة]
    D --> H[التعويض u]
    E --> I{قوة الدوال}
    I --> J[زوجية] --> K[هوية مثلثية]
    I --> L[فردية] --> M[تعويض sin أو cos]
    F --> N{شكل المقام}
    N --> O[خطي بسيط] --> P[ln|ax+b|]
    N --> Q[خطي متكرر] --> R[قوة المقام]
    N --> S[مربع] --> T[تكامل جزئي]
```

---

## 📝 أمثلة محلولة · Worked Examples

### المثال 1: التكامل بالتجزيء

**المطلوب**: $\int x e^x dx$

$$u = x \quad dv = e^x dx$$
$$du = dx \quad v = e^x$$

$$\int x e^x dx = xe^x - \int e^x dx = xe^x - e^x + C = e^x(x-1) + C$$

### المثال 2: الكسور الجزئية

**المطلوب**: $\int \frac{2x+3}{x^2-x-2} dx$

التحليل: $x^2-x-2 = (x-2)(x+1)$

$$\frac{2x+3}{(x-2)(x+1)} = \frac{A}{x-2} + \frac{B}{x+1}$$

$$2x+3 = A(x+1) + B(x-2)$$

$$A = \frac{7}{3}, \quad B = -\frac{1}{3}$$

$$\int = \frac{7}{3} \ln|x-2| - \frac{1}{3} \ln|x+1| + C$$

### المثال 3: تكامل مثلثي

**المطلوب**: $\int \sin^3 x \, dx$

$$\int \sin^3 x \, dx = \int \sin x (1-\cos^2 x) \, dx$$

$$u = \cos x, \quad du = -\sin x \, dx$$

$$= -\int (1-u^2) du = -u + \frac{u^3}{3} + C = -\cos x + \frac{\cos^3 x}{3} + C$$

### المثال 4: اختبار النسبة

**المطلوب**: هل $\sum_{n=1}^{\infty} \frac{n!}{n^n}$ تتقارب؟

$$a_n = \frac{n!}{n^n}$$

$$\frac{a_{n+1}}{a_n} = \frac{(n+1)!}{(n+1)^{n+1}} \cdot \frac{n^n}{n!} = \frac{n^n}{(n+1)^n} = \left(\frac{n}{n+1}\right)^n \to \frac{1}{e} < 1$$

**تتقارب** (نصف قطر التقارب < 1)

### المثال 5: متسلسلة تايلور

**المطلوب**: اكتب متسلسلة تايلور لـ $e^x$ حول $x=0$

$$e^x = \sum_{n=0}^{\infty} \frac{x^n}{n!} = 1 + x + \frac{x^2}{2} + \frac{x^3}{6} + ...$$

نصف التقارب: $R = \infty$ (تتقارب لكل $x$)

---

## 📊 جدول التكاملات · Integration Formulas Table

| الدالة | التكامل | الملاحظات |
|---|---|---|
| $x^n$ | $\frac{x^{n+1}}{n+1} + C$ | $n \neq -1$ |
| $\frac{1}{x}$ | $\ln|x| + C$ | |
| $e^x$ | $e^x + C$ | |
| $a^x$ | $\frac{a^x}{\ln a} + C$ | $a > 0$ |
| $\sin x$ | $-\cos x + C$ | |
| $\cos x$ | $\sin x + C$ | |
| $\tan x$ | $-\ln|\cos x| + C$ | |
| $\cot x$ | $\ln|\sin x| + C$ | |
| $\sec x$ | $\ln|\sec x + \tan x| + C$ | |
| $\csc x$ | $-\ln|\csc x + \cot x| + C$ | |
| $\frac{1}{x^2+a^2}$ | $\frac{1}{a}\arctan(\frac{x}{a}) + C$ | |
| $\frac{1}{\sqrt{a^2-x^2}}$ | $\arcsin(\frac{x}{a}) + C$ | $\|x\| < a$ |
| $\frac{1}{\sqrt{x^2+a^2}}$ | $\ln|x + \sqrt{x^2+a^2}| + C$ | |

---

## ⚠️ أخطاء شائعة وملاحظات · Common Pitfalls & Notes

### التكامل بالتجزيء
- **اختيار خاطئ لـ u**: استخدم LIATE من اليسار إلى اليمين
- **نسيان (-)**: الصيغة النهائية فيها $uv - \int v \, du$ (علامة سالب!)
- **التكامل المتكرر**: لا تستسلم عند第一次 - كرر حتى تنتهي

### الكسور الجزئية
- **تحليل غير كامل**: تأكد من تحليل المقام لعوامل أولية
- **خطأ في المعاملات**: تحقق من الحل بالمساواة
- **حالة مربع**: تذكر استخدام $Ax+B$ في البسط

### التكامل المثلثي
- **القوة الزوجية**: لا تنسَ استخدام $\sin^2 x = \frac{1-\cos 2x}{2}$
- **الإشارة**: انتبه للعلاقة $\cos^2 x = \frac{1+\cos 2x}{2}$
- **التعويض**: تأكد من تحديث حدود التكامل عند التعويض

### المتسلسلات
- **اختبار النسبة**: تذكر $L < 1$ تتقارب، $L > 1$ تتباعد
- **شرط التقارب الضروري**: $a_n \to 0$ شرطnecessary وليس كافي
- **المتسلسلة المتناوبة**: تتقارب حتى لو $a_n \to 0$ لكن ليس شرط كافٍ!

### متسلسلة تايلور
- **نصف القطر**: احسبه من اختبار النسبة على حدود المتسلسلة
- **التقارب على الأطراف**: تحقق كل حالة على حدة
- **خطأ التقريب**: استخدم $_n(x)$ لتقدير الخطأ

### الإحداثيات القطبية
- **المساحة**: الصيغة $_2 \int r^2 d\theta$ وليس $_r \, dr$
- **نقاط التقاطع**: تأكد من حل $r = 0$ والمعادلات الأخرى
- **ترتيب الزاوية**: انتبه أن $\theta$ يقيس من المحور الموجب

💡 **تلميح**: لتسريع التكامل بالتجزيء، تذكر:
- $\int x^n e^x dx$: $u = x^n$, $dv = e^x dx$
- $\int x^n \ln x dx$: $u = \ln x$, $dv = x^n dx$
- $\int e^x \sin x dx$: تكون متسلسلتان!

💡 **تلميح2**: الكسور الجزئية - إذا كان المقام قابل للتحليل:
1. $(x-a)(x-b)$ → $\frac{A}{x-a} + \frac{B}{x-b}$
2. $(x-a)^2$ → $\frac{A}{x-a} + \frac{B}{(x-a)^2}$
3. $x^2+a^2$ → $\frac{Ax+B}{x^2+a^2}$

💡 **تلميح3**: متسلسلة تايلور - نصف القطر من حيث $x$:
- $e^x$, $\sin x$, $\cos x$: $R = \infty$
- $\ln(1+x)$: $R = 1$
- $\frac{1}{1-x}$: $R = 1$
- $\arctan x$: $R = 1$