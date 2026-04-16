# تحليل عددي 2 · Numerical Analysis 2

## 📐 التعاريف الأساسية · Core Definitions

- **التفاضل العددي (Numerical Differentiation)**: حساب المشتقة تقريبياً
- **المعادلات التفاضلية (Differential Equations)**: معادلات تحتوي على مشتقات
- **القيم الذاتية (Eigenvalues)**: قيم خاصة تحدد خصائص المصفوفة
- **المربعات الصغرى (Least Squares)**: طريقة لتقريب البيانات
- **تfitting المنحنيات (Curve Fitting)**: إيجاد منحنى يمر بالنقاط

---

## 🌿 التفاضل العددي · Numerical Differentiation

### صيغ الفروق المحدودة · Finite Difference Formulas

#### التقدمية · Forward Difference

$$f'(x) \approx \frac{f(x+h) - f(x)}{h}$$

#### التراجعية · Backward Difference

$$f'(x) \approx \frac{f(x) - f(x-h)}{h}$$

#### المركزية · Central Difference

$$f'(x) \approx \frac{f(x+h) - f(x-h)}{2h}$$

### المشتقة الثانية · Second Derivative

$$f''(x) \approx \frac{f(x+h) - 2f(x) + f(x-h)}{h^2}$$

### جدول الفروق المحدودة · Finite Difference Table

| الطريقة | الصيغة | الخطأ |
|---|---|---|
| التقدمية الأولى | $(f_{i+1} - f_i)/h$ | $O(h)$ |
| التراجعية الأولى | $(f_i - f_{i-1})/h$ | $O(h)$ |
| المركزية الأولى | $(f_{i+1} - f_{i-1})/2h$ | $O(h^2)$ |
| المركزية الثانية | $(f_{i+1} - 2f_i + f_{i-1})/h^2$ | $O(h^2)$ |

### الخطأ في التفاضل العددي · Error Analysis

الخطأ:

$$f'(x) = \frac{f(x+h) - f(x-h)}{2h} - \frac{h^2}{6}f'''(\xi)$$

💡 **تلميح**: كلما كان $h$ أصغر، كان التقريب أفضل، لكن مع h صغير جداً تتزايد أخطاء التقريب → الدقة تقل

---

## 🌊 حل المعادلات التفاضلية · Solving ODEs

### تصنيف المعادلات · Classification

- **درجة أولى**: $y' = f(x, y)$
- **درجة ثانية**: $y'' = f(x, y, y')$
- **Initial Value Problem (IVP)**: given $y(x_0) = y_0$
- **Boundary Value Problem (BVP)**: given $y(a) = \alpha$, $y(b) = \beta$

### طريقة أويلر · Euler's Method

#### الخوارزمية · Algorithm

$$y_{n+1} = y_n + h \cdot f(x_n, y_n)$$

حيث $h$ هو step size

#### مثال · Example

للمعادلة: $y' = y$, $y(0) = 1$, $h = 0.1$

$$y_1 = 1 + 0.1 \cdot 1 = 1.1$$
$$y_2 = 1.1 + 0.1 \cdot 1.1 = 1.21$$

#### الخطأ · Error

$$E = \frac{h^2}{2}y''(\xi)$$ → خطأ $O(h)$

### طريقة أويلر المحسنة · Improved Euler Method

#### الصيغة · Formula

$$y^* = y_n + h \cdot f(x_n, y_n)$$
$$y_{n+1} = y_n + \frac{h}{2}[f(x_n, y_n) + f(x_{n+1}, y^*)]$$

#### الخصائص · Properties

- خطأ $O(h^2)$
- أكثر استقراراً من Euler الأساسي

### طريقة هين · Heun's Method

$$k_1 = h f(x_n, y_n)$$
$$k_2 = h f(x_n + h, y_n + k_1)$$
$$y_{n+1} = y_n + \frac{1}{2}(k_1 + k_2)$$

### طريقة رونج-كوتا 2 · RK2 (Midpoint Method)

$$k_1 = h f(x_n, y_n)$$
$$k_2 = h f(x_n + \frac{h}{2}, y_n + \frac{k_1}{2})$$
$$y_{n+1} = y_n + k_2$$

### طريقة رونج-كوتا 4 · RK4 (Classic)

#### الصيغة · Formula

$$k_1 = h f(x_n, y_n)$$
$$k_2 = h f(x_n + \frac{h}{2}, y_n + \frac{k_1}{2})$$
$$k_3 = h f(x_n + \frac{h}{2}, y_n + \frac{k_2}{2})$$
$$k_4 = h f(x_n + h, y_n + k_3)$$
$$y_{n+1} = y_n + \frac{1}{6}(k_1 + 2k_2 + 2k_3 + k_4)$$

#### الخطأ · Error

$$E = O(h^5)$$ ← أكثر دقة!

### جدول مقارنة طرق ODE · ODE Methods Comparison

| الطريقة | الترتيب | الخطأ | الاستقرار |
|---|---|---|---|
| Euler | 1 | $O(h)$ | ضعيف |
| Improved Euler | 2 | $O(h^2)$ | متوسط |
| Heun | 2 | $O(h^2)$ | متوسط |
| RK2 | 2 | $O(h^2)$ | جيد |
| RK4 | 4 | $O(h^5)$ | ممتاز |

```mermaid
graph TD
    A[ابدأ: x, y, h, f(x,y)] --> B[احسب k1 = h·f(x,y)]
    B --> C[احسب k2 = h·f(x+h/2, y+k1/2)]
    C --> D[احسب k3 = h·f(x+h/2, y+k2/2)]
    D --> E[احسب k4 = h·f(x+h, y+k3)]
    E --> F[y_new = y + 1/6(k1+2k2+2k3+k4)]
    F --> G[x_new = x + h]
    G --> H{هل انتهيت؟}
    H -->|لا| B
    H -->|نعم| I[نهاية]
```

### طريقة稳定性 · ????????? (A-?????????)

- **A-stable**: لا ينمو الخطأ لأي قيمة من $h$ عند حل $y' = \lambda y$
- Euler: غير مستقر
- Euler الضمني: مستقر
- شبه المنحرف: مستقر

---

## 🎯 القيم الذاتية والمتجهات الذاتية · Eigenvalues & Eigenvectors

### التعريف · Definition

$$A\mathbf{v} = \lambda \mathbf{v}$$

- $\lambda$: eigenvalue
- $\mathbf{v}$: eigenvector

### طريقة القوة · Power Method

#### الخوارزمية · Algorithm

1. ابدأ بـ $\mathbf{v}^{(0)}$ عشوائي
2. كرر:
   - $\mathbf{y}^{(k+1)} = A\mathbf{v}^{(k)}$
   - $\mathbf{v}^{(k+1)} = \mathbf{y}^{(k+1)} / \|\mathbf{y}^{(k+1)}\|$

#### الصيغة · Formula

$$\lambda_{max} \approx \frac{v_i^{(k+1)}}{v_i^{(k)}}$$

#### الشرط · Condition

يتقارب لأكبر قيمة ذاتية (absolute value largest)

### طريقة القوة المعكوسة · Inverse Power Method

لـ smallest eigenvalue:

$$\mathbf{v}^{(k+1)} = A^{-1}\mathbf{v}^{(k)}$$

أو باستخدام الإزاحة:

$$\lambda_{closest \ to \ \sigma} \approx \sigma + \frac{1}{\lambda_{max}(A-\sigma I)^{-1}}$$

### طريقة QR · QR Method

$$A_k = Q_k R_k$$
$$A_{k+1} = R_k Q_k$$

تقرب eigenvalues على diagonal

### خصائص eigenvalues · Properties

- $\sum \lambda_i = \text{trace}(A)$
- $\prod \lambda_i = \det(A)$
- eigenvalues of symmetric matrix are real

### جدول الطرق · Methods Table

| الطريقة | الاستخدام | التعقيد |
|---|---|---|
| Power | largest λ | $O(n^2)$ |
| Inverse Power | smallest λ | $O(n^2)$ |
| QR | all λ | $O(n^3)$ |
| Characteristic | n small | $O(n^3)$ |

---

## 📈 التربيع الأصغر · Least Squares

### المشكلة · Problem

لبيانات $(x_i, y_i)$، أوجد $y = f(x)$ minimize:

$$S = \sum_{i=1}^{n} (y_i - f(x_i))^2$$

### الانحدار الخطي · Linear Regression

#### الصيغة · Formula

$$y = mx + b$$

$$m = \frac{n\sum xy - \sum x \sum y}{n\sum x^2 - (\sum x)^2}$$

$$b = \frac{\sum y - m\sum x}{n}$$

### التربيع الأصغر الخطي · Linear Least Squares

#### الحالة العامة · General Case

لـ $Ax \approx b$:

$$x = (A^T A)^{-1} A^T b$$

#### إثبات · Derivation

نريد minimize $\|Ax - b\|^2$:

$$\nabla_x (Ax - b)^T(Ax-b) = 2A^T(Ax-b) = 0$$

$$A^T A x = A^T b$$

### كثير الحدود · Polynomial Fitting

#### كثيرة حدود من الدرجة m

$$P_m(x) = a_0 + a_1 x + ... + a_m x^m$$

#### النظام الخطي · Linear System

$$\begin{bmatrix} n & \sum x & \sum x^2 & ... \\ \sum x & \sum x^2 & \sum x^3 & ... \\ ... & ... & ... & ... \end{bmatrix} \begin{bmatrix} a_0 \\ a_1 \\ ... \end{bmatrix} = \begin{bmatrix} \sum y \\ \sum xy \\ ... \end{bmatrix}$$

### المعامل R² · R² Coefficient

$$R^2 = 1 - \frac{\sum(y_i - \hat{y}_i)^2}{\sum(y_i - \bar{y})^2}$$

- $R^2 = 1$: perfect fit
- $R^2 = 0$: no fit

### جدول أنواع الانحدار · Regression Types

| النوع | الصيغة | when to use |
|---|---|---|
| خطي | $y = mx + b$ | linear relationship |
| لوغاريتمي | $y = a \ln x + b$ | logarithmic |
| أسي | $y = ae^{bx}$ | exponential |
| قوة | $y = ax^b$ | power law |
| متعدد | $y = a + bx + cx^2$ | polynomial |

---

## 📊 تحويل فورييه السريع · Fast Fourier Transform (FFT)

### التعريف · Definition

تحويل discrete:

$$X_k = \sum_{n=0}^{N-1} x_n e^{-i 2\pi kn/N}$$

### التعقيد · Complexity

- DFT: $O(N^2)$
- FFT: $O(N \log N)$

### التطبيق · Application

- تحليل signals
- معالجة الصور
- حل PDEs

---

## 💡 أمثلة محلولة · Worked Examples

### المثال 1: التفاضل العددي

**المطلوب**: جد $f'(2)$ لـ $f(x) = x^2$ using $h = 0.01$

**الحل**:

$$f'(2) \approx \frac{f(2.01) - f(1.99)}{0.02}$$

$$= \frac{(2.01)^2 - (1.99)^2}{0.02} = \frac{4.0401 - 3.9601}{0.02} = \frac{0.08}{0.02} = 4$$

**القيمة الحقيقية**: $f'(2) = 2(2) = 4$ ✓

### المثال 2: طريقة أويلر

**المطلوب**: حل $y' = y$, $y(0) = 1$ for $x \in [0, 1]$ with $h = 0.1$

**الحل**:

| n | x_n | y_n |
|---|---|---|
| 0 | 0 | 1.0000 |
| 1 | 0.1 | 1.1 |
| 2 | 0.2 | 1.21 |
| 3 | 0.3 | 1.331 |
| 4 | 0.4 | 1.4641 |
| 5 | 0.5 | 1.6105 |

**الت الحل الحقيقي**: $y = e^x$, $y(0.5) ≈ 1.6487$

### المثال 3: RK4

**المطلوب**: نفس المعادلة بـ RK4, $h = 0.1$

**الحل**:

لـ $x_0 = 0, y_0 = 1$:
- $k_1 = 0.1 \cdot 1 = 0.1$
- $k_2 = 0.1 \cdot (1 + 0.05) = 0.105$
- $k_3 = 0.1 \cdot (1 + 0.105) = 0.1105$
- $k_4 = 0.1 \cdot (1 + 0.1105) = 0.11105$

$y_1 = 1 + \frac{1}{6}(0.1 + 0.21 + 0.221 + 0.11105) = 1.1052$

### المثال 4: eigenvalue

**المطلوب**: جد eigenvalues للمصفوفة:

$$A = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$$

**الحل**:

$$\det(A - \lambda I) = \begin{vmatrix} 2-\lambda & 1 \\ 1 & 2-\lambda \end{vmatrix} = (2-\lambda)^2 - 1 = 0$$

$$\lambda^2 - 4\lambda + 3 = 0$$
$$\lambda = 1, 3$$

### المثال 5: Least Squares

**المطلوب**: جد أفضل خط يمر بالنقاط (1,2), (2,3), (3,5)

**الحل**:

$$\sum x = 6, \sum y = 10, \sum xy = 22, \sum x^2 = 14, n = 3$$

$$m = \frac{3(22) - 6(10)}{3(14) - 36} = \frac{66 - 60}{42 - 36} = \frac{6}{6} = 1$$

$$b = \frac{10 - 1(6)}{3} = \frac{4}{3} = 1.33$$

**المعادلة**: $y = x + 1.33$

### المثال 6: Polynomial Fitting

**المطلوب**: جد كثيرة حدود من الدرجة 2 fitting data:

| x | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| y | 1 | 2 | 4 | 7 |

**الحل**:

نظام المعادلات:
$$\begin{bmatrix} 4 & 6 & 14 \\ 6 & 14 & 36 \\ 14 & 36 & 98 \end{bmatrix} \begin{bmatrix} a_0 \\ a_1 \\ a_2 \end{bmatrix} = \begin{bmatrix} 14 \\ 24 \\ 54 \end{bmatrix}$$

الحل: $a_0 = 1, a_1 = 0, a_2 = 1$

$$P(x) = 1 + x^2$$

---

## 📊 جدول مرجعي شامل · Master Reference Table

| المفهوم | الصيغة | الملاحظات |
|---|---|---|
| Central Diff | $(f_{i+1} - f_{i-1})/2h$ | $O(h^2)$ |
| Euler | $y_{n+1} = y_n + hf$ | $O(h)$ |
| Improved Euler | $y_{n+1} = y_n + h/2(f_n + f_{n+1}^*)$ | $O(h^2)$ |
| RK4 | $k_1,...,k_4$ weighted | $O(h^5)$ |
| Power Method | $v_{k+1} = Av_k/\|Av_k\|$ | largest λ |
| Inverse Power | $v_{k+1} = A^{-1}v_k$ | smallest λ |
| Least Squares | $x = (A^T A)^{-1}A^T b$ | minimize error |
| Linear Reg | $m = \frac{n\sum xy - \sum x \sum y}{n\sum x^2 - (\sum x)^2}$ | best line |
| FFT | $X_k = \sum x_n e^{-i2\pi kn/N}$ | $O(N \log N)$ |

---

## ⚠️ أخطاء شائعة وملاحظات · Common Pitfalls & Notes

### التفاضل العددي
- **اختيار h**: h صغير جداً → errors due to subtraction; h كبير → poor approximation
- **h = 0.001 or smaller**: rounding errors dominate
- **استخدم central difference**: أكثر دقة من forward/backward

### حل ODEs
- **Euler unstable**: for stiff equations, use implicit methods
- **Step size**: too large → divergence; too small → slow + accumulation errors
- **RK4 recommended**: good balance of accuracy and ?????????
- **Stiff equations**: use implicit methods (BDF, implicit Runge-Kutta)
- **Adaptive step size**: important for efficiency

### القيم الذاتية
- **Power method fails**: when eigenvalues are close in magnitude
- **Shift required**: for finding specific eigenvalues
- **QR sensitive**: to round-off errors for large matrices

### Least Squares
- **Overfitting**: high degree polynomial may fit noise
- **Check R²**: but also examine residuals
- **Multicollinearity**: in multiple regression, variables may be correlated
- **Normalization**: standardize data for comparison of coefficients

### الأخطاء العامة
- **Floating point**: use double precision
- **Conditioning**: ill-conditioned matrices need special care
- **Catastrophic cancellation**: avoid subtracting similar numbers

💡 **تلميح**: always check ????????? and convergence
- Use multiple methods to compare results
- Plot solutions to verify behavior

💡 **تلميح2**: for ODEs
1. Non-stiff → RK4
2. Stiff → implicit methods
3. High accuracy → adaptive methods

💡 **تلميح3**: for Least Squares
1. Check correlation before regression
2. Visualize data first
3. Validate with test set

💡 **تلميح4**: for Eigenvalues
1. Use Power method for largest only
2. Use QR for all eigenvalues
3. Shifting helps find specific values

---

# 📚 المراجع · References

- **Book**: Numerical Analysis, Burden & Faires
- **Book**: Numerical Methods for Engineers, Chapra & Canale
- **Book**: Matrix Computations, Golub & Van Loan
- **Online**: Wikipedia - Numerical analysis
- **Online**: Wikipedia - Runge-Kutta methods

---

## 🎯 ملخص semester · Semester Summary

### ما تم تغطيته · Topics Covered

1. ✅ التفاضل العددي · Numerical Differentiation
2. ✅ حل المعادلات التفاضلية · ODE Solutions
3. ✅ القيم الذاتية · Eigenvalue Problems
4. ✅ التربيع الأصغر · Least Squares
5. ✅ FFT (مقدمة) · FFT Introduction

### المهارات · Skills Developed

- تطبيق الفروق المحدودة
- استخدام طرق Euler و Runge-Kutta
- حل أنظمة خطية بـ Power/QR methods
- fitting البيانات بـ regression
- فهم ????????? و convergence

---

💡 **نهاية material · End of Material**

#️⃣ **تحليل عددي 2 - Year 2, Semester 2**