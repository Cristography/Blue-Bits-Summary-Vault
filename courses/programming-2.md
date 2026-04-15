# برمجة 2 · Programming 2

## 📐 التعاريف الأساسية · Core Definitions

- **الصنف (Class)**: قالب يحدد خصائص وسلوكيات الكائنات
- **الكائن (Object)**: مثيل (Instance) للصنف يشغل مساحة في الذاكرة
- **التغليف (Encapsulation)**: دمج البيانات والدوال في وحدة واحدة
- **الوراثة (Inheritance)**: آلية يرث فيها الصنف المشتق خصائص الصنف الأب
- **تعدد الأشكال (Polymorphism)**: قدرة الدالة على سلوك مختلف حسب نوع الكائن
- **المؤشر (Pointer)**: متغير يخزن عنوان موقع في الذاكرة
- **الملف (File)**: وسيلة لتخزين البيانات بشكل دائم

## 🏗️ البرمجة كائنية التوجه · Object-Oriented Programming (OOP)

### 1. الصنف والكائن · Class & Object

$$Class = Data + Methods$$

```cpp
class Student {
private:
    string name;
    int age;
    float gpa;

public:
    // constructor
    Student(string n, int a, float g) {
        name = n;
        age = a;
        gpa = g;
    }
    
    // دالة عضوية
    void display() {
        cout << "Name: " << name << endl;
        cout << "Age: " << age << endl;
        cout << "GPA: " << gpa << endl;
    }
};

// إنشاء كائن
Student s("Ahmed", 20, 3.5);
s.display();
```

### 2. مستويات الوصول · Access Specifiers

| المستوى | الوصف | الوصول |
|---|---|---|
| `private` | الافتراضي، الوصول داخل الصنف فقط | class only |
| `public` | الوصول من أي مكان | anywhere |
| `protected` | الوصول للصنف وأولاده | class + derived |

### 3..constructor & destructor

```cpp
class Student {
private:
    string name;
    int* grades; // مؤشر لمصفوفة

public:
    // constructor
    Student(string n) {
        name = n;
        grades = new int[5]; // تخصيص ذاكرة
        cout << "Constructor called" << endl;
    }
    
    // destructor
    ~Student() {
        delete[] grades; // تحرير الذاكرة
        cout << "Destructor called" << endl;
    }
};
```

### 4. الوراثة · Inheritance

$$DerivedClass(BaseClass_1, BaseClass_2, ...)$$

```cpp
// الصنف الأب
class Person {
protected:
    string name;
    int age;
public:
    void setInfo(string n, int a) {
        name = n;
        age = a;
    }
};

// الصنف الولد
class Student : public Person {
private:
    float gpa;
public:
    void setGPA(float g) {
        gpa = g;
    }
    void display() {
        cout << "Name: " << name << endl;
        cout << "Age: " << age << endl;
        cout << "GPA: " << gpa << endl;
    }
};
```

### 5. تعدد الأشكال · Polymorphism

```cpp
// دالة افتراضية
class Shape {
public:
    virtual void draw() {
        cout << "Drawing Shape" << endl;
    }
};

class Circle : public Shape {
public:
    void draw() override {
        cout << "Drawing Circle" << endl;
    }
};

class Rectangle : public Shape {
public:
    void draw() override {
        cout << "Drawing Rectangle" << endl;
    }
};
```

```mermaid
graph TD
    A[Person] -->|inherits| B[Student]
    A -->|inherits| C[Teacher]
    B -->|has| D[+ gpa]
    C -->|has| E[+ salary]
    B -->|override| F[display()]
    C -->|override| F
```

## 🔗 المؤشرات · Pointers

### 1. أساسيات المؤشرات · Pointer Basics

$$pointer = \&variable$$

```cpp
int x = 10;
int* ptr = &x;  // تخزين عنوان x

cout << ptr;     // عنوان الذاكرة
cout << *ptr;    // القيمة = 10
```

### 2. مؤشرات وصناف · Class Pointers

```cpp
Student* ptr = new Student("Ali", 20, 3.5);
ptr->display();  // بدلاً من (*ptr).display()
delete ptr;     // تحرير الذاكرة
```

### 3. مؤشرات ومصفوفات · Array Pointers

```cpp
int arr[5] = {1, 2, 3, 4, 5};
int* p = arr;  // same as &arr[0]

for (int i = 0; i < 5; i++) {
    cout << *(p + i) << " ";  // arr[i]
}
```

### 4. المؤشر NULL والـ Void Pointer

```cpp
int* ptr = NULL;    // مؤشر آمن
void* vptr;         // مؤشر عام (任意)
```

### 5. مؤشرات لدوال · Function Pointers

```cpp
int (*funcPtr)(int, int);  // مؤشر لدالة
funcPtr = add;            // اسم الدالة
result = funcPtr(3, 4);  // استدعاء
```

## 📁 معالجة الملفات · File Handling

### 1. قراءة وكتابة · Read & Write

```cpp
#include <fstream>

// كتابة في ملف
ofstream outFile("data.txt");
outFile << "Hello World" << endl;
outFile.close();

// قراءة من ملف
ifstream inFile("data.txt");
string line;
while (getline(inFile, line)) {
    cout << line << endl;
}
inFile.close();
```

### 2. وضعيات الملف · File Modes

| الوضع | الوصف |
|---|---|
| `ios::in` | قراءة |
| `ios::out` | كتابة |
| `ios::app` | إضافة للنهاية |
| `ios::binary` | وضع ثنائي |

### 3. قراءة/كتابة كائنات · Object File I/O

```cpp
// كتابة كائن
ofstream outFile("student.dat", ios::binary);
outFile.write((char*)&student, sizeof(Student));
outFile.close();

// قراءة كائن
ifstream inFile("student.dat", ios::binary);
inFile.read((char*)&student, sizeof(Student));
inFile.close();
```

## 📊 جدول المفاهيم البرمجية · Programming Concepts Table

| المفهوم | الوصف | مثال |
|---|---|---|
| Constructor | دالة تُecuted عند إنشاء الكائن | `Student()` |
| Destructor | دالة تُecuted عند تدمير الكائن | `~Student()` |
| Access Specifier | يتحكم بإمكانية الوصول | `private/public` |
| Virtual Function | دالة يمكن تجاوزها | `virtual void f()` |
| Pure Virtual | دالة مجردة (Abstract) | `virtual void f() = 0` |
| Static Member | مشترك بين جميع الكائنات | `static int count` |
| This Pointer | مؤشر للكائن الحالي | `this->name` |
| New/Delete | تخصيص/تحرير الذاكرة | `new int` |

## 🧮 الخوارزميات المتقدمة · Advanced Algorithms

### 1. الترتيب السريع · Quick Sort

$$O(n \log n)$$

```cpp
int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}
```

### 2. البحث الثنائي · Binary Search

$$O(\log n)$$

```cpp
int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}
```

## 📝 أمثلة محلولة · Worked Examples

### المثال 1: صنف Circle

```cpp
class Circle {
private:
    double radius;
public:
    Circle(double r = 1.0) {
        radius = r;
    }
    
    double area() {
        return M_PI * radius * radius;
    }
    
    double circumference() {
        return 2 * M_PI * radius;
    }
};

Circle c(5);
cout << "Area: " << c.area() << endl;
cout << "Circumference: " << c.circumference() << endl;
```

### المثال 2: التعامل مع الملفات

```cpp
void saveGrades(string filename, int grades[], int n) {
    ofstream file(filename);
    for (int i = 0; i < n; i++) {
        file << grades[i] << endl;
    }
    file.close();
}

void loadGrades(string filename, int grades[], int& n) {
    ifstream file(filename);
    n = 0;
    while (file >> grades[n]) {
        n++;
    }
    file.close();
}
```

## 📊 جدول مرجعي شامل · Master Reference Table

| المفهوم | الصيغة | التعقيد |
|---|---|---|
| Constructor/Destructor | `Class()`, `~Class()` | $O(1)$ |
| الوراثة | `class B : public A` | $O(1)$ |
| Virtual Function | `virtual void f()` | $O(1)$ |
| New/Delete | `new Type`, `delete ptr` | $O(1)$ |
| Pointer Arithmetic | `ptr + n` | $O(1)$ |
| File Read/Write | `ofstream/ifstream` | $O(n)$ |
| Quick Sort | `partition + recurse` | $O(n \log n)$ |
| Binary Search | `log2(n)` comparisons | $O(\log n)$ |

## ⚠️ أخطاء شائعة وملاحظات · Common Pitfalls & Notes

- **نسيان `=` فيconstructor**: استخدام `name = n` بدلاً من `name(n)` في initializer list
- **忘记 `virtual`**: الدوال المخصصة تحتاج `virtual` للـ polymorphism
- **مؤشر NULL**: تحقق دائماً من المؤشر قبل الاستخدام
- **تسريبات الذاكرة**: استخدام `delete` عند استخدام `new`
- **نسيان `.h` Includes**: إضافة `#include <fstream>` للملفات
- **الوصول للخواص private**: لا يمكن الوصول المباشر من خارج الصنف
- **constructor الاستدعاء المزدوج**: لا تستدعي constructor مباشرة
- **صياغة الوراثة الخاطئة**: تأكد من صحة مستوى الوصول `public`

## 📌 تلميحات · Tips

💡 **تلميح 1**: استخدام `const` مع المؤشرات:
- `const int* p`: قيمة الثابتة
- `int* const p`: المؤشر ثابت
- `const int* const p`: كلاهما ثابت

💡 **تلميح 2**: للـ polymorphism، استخدم مؤشر أو مرجع للصنف الأب:
```cpp
Shape* shapes[3];
shapes[0] = new Circle();
shapes[1] = new Rectangle();
shapes[i]->draw();  // يستدعي الدالة الصحيحة
```

💡 **تلميح 3**: للـ file handling، استخدم دائماً `close()` أو `ifstream`会自动 إغلاق

(End of file - total 270 lines)