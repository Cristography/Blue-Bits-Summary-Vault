# نظم الزمن الحقيقي Real-Time Systems

## مقدمة Introduction

نظم الزمن الحقيقي هي أنظمة يجب أن تستجيب لمدخلات معينة خلال فترة زمنية محددة وضيقة (deadline). الفشل فيMeeting the deadline قد يؤدي إلى عواقب كارثية.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Real-Time vs. Non-Real-Time                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Real-Time System                               │  │
│  │  Input → Processing → Output (within deadline)         │  │
│  │  ⚡ Response Time < Deadline = Success               │  │
│  │  ⚠️ Response Time > Deadline = Failure            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            Non-Real-Time System                           │  │
│  │  Input → Processing → Output                            │  │
│  │  ✓ Response time is important (best effort)            │  │
│  │  ❌ No strict deadline guarantee                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 1. أنظمة الزمن الحقيقيTypes of Real-Time Systems

### 1.1 التصنيف حسب stiffness الجدوى

| النوع | الوصف | أمثلة |
|--------|--------|----------|
| Hard Real-Time | Failure > deadline = system failure | أجهزة القلب, flight control |
| Firm Real-Time | Late result = useless | audio/video streaming |
| Soft Real-Time | Late result = degraded quality | web requests, games |

### 1.2 التصنيف حسب البنية

```
┌─────────────────────────────────────────────────────────────────┐
│            Real-Time System Architectures                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐                │
│  │ Event-Driven   │    │  Clock-Driven   │                │
│  │              │    │                │                │
│  │ Interrupt     │    │ Periodic Task  │                │
│  │ Based        │    │ (Rate Monotonic)│                │
│  └──────────────────┘    └──────────────────┘                │
│                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐                │
│  │  Hybrid        │    │   Multi-Rate     │                │
│  │              │    │                │                │
│  │ Mixed Events  │    │ Multiple Periods │                │
│  │ + Periodic    │    │ Clock Divergence │                │
│  └──────────────────┘    └──────────────────┘                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 2. جدولة الزمن الحقيقي Real-Time Scheduling

### 2.1 Fixed Priority Scheduling

```python
# ============================================
# Rate Monotonic Scheduling (RMS)
# ============================================

import math
from collections import defaultdict

class Task:
    def __init__(self, name, period, execution_time, deadline=None):
        self.name = name
        self.period = period
        self.execution_time = execution_time
        self.deadline = deadline if deadline else period
        self.priority = 0  # سيحدد لاحقاً
    
    @property
    def utilization(self):
        return self.execution_time / self.period

def rate_monotonic_schedule(tasks):
    """
    جدولة Rate Monotonic
    
    نظرية:
    - المهمة الأقصر period تحصل على أعلى priority
    - قابلة للجدولة إذا U ≤ n(2^(1/n) - 1)
    """
    # ترتيب حسب period (الأقصر = highest priority)
    sorted_tasks = sorted(tasks, key=lambda t: t.period)
    
    for i, task in enumerate(sorted_tasks):
        task.priority = len(tasks) - i  #_period الأقصر = priority الأعلى
    
    return sorted_tasks

def check_schedulability_rms(tasks):
    """فحص القابلية للجدولة بـ RMS"""
    n = len(tasks)
    
    # total utilization
    total_utilization = sum(t.execution_time / t.period for t in tasks)
    
    # bound نظري
    theoretical_bound = n * (2 ** (1/n) - 1)
    
    is_schedulable = total_utilization <= theoretical_bound
    
    # اختبار أيضاً بـ time demand analysis
    for t in tasks:
        worst_case_response = t.execution_time  # مبسط
        for other in tasks:
            if other.period < t.period:
                worst_case_response += other.execution_time
        
        if worst_case_response > t.deadline:
            is_schedulable = False
            break
    
    return {
        'total_utilization': total_utilization,
        'theoretical_bound': theoretical_bound,
        'is_schedulable': is_schedulable
    }
```

### 2.2 Dynamic Priority Scheduling (EDF)

```python
# ============================================
# Earliest Deadline First (EDF)
# ============================================

class EDFScheduler:
    def __init__(self):
        self.tasks = []
        self.current_time = 0
    
    def add_task(self, task):
        """��ضافة مهمة"""
        self.tasks.append(task)
    
    def next_task(self):
        """اختيار المهمة التالية (أقرب deadline)"""
        if not self.tasks:
            return None
        
        # ترتيب حسب deadline
        sorted_tasks = sorted(self.tasks, key=lambda t: t.deadline)
        return sorted_tasks[0]
    
    def execute_one_step(self, time_slice):
        """تنفيذ خطوة واحدة"""
        task = self.next_task()
        
        if task:
            task.execution_time = max(0, task.execution_time - time_slice)
            self.current_time += time_slice
            
            # إزالة if complete
            if task.execution_time == 0:
                self.tasks.remove(task)
                return task.name, True
        
        return None, False
    
    def check_schedulability_edf(tasks):
        """فحص القابلية للجدولة EDF"""
        # EDF قابلة للجدولة إذا كان مجموع utilization ≤ 1
        total_utilization = sum(t.execution_time / t.deadline for t in tasks)
        
        return total_utilization <= 1.0 + 1e-9  # small epsilon

def least_laxity_first(tasks):
    """
    Least Laxity First (LLF)
    
    Laxity = Deadline - (Execution_Time + Current_Time)
    """
    current_time = 0
    
    while tasks:
        # حساب laxity لكل مهمة
        for task in tasks:
            task.laxity = task.deadline - task.execution_time - current_time
        
        # اختيار المهمة ذات lowest laxity
        task = min(tasks, key=lambda t: t.laxity)
        
        current_time += task.execution_time
        
        if current_time > task.deadline:
            return False  # deadline missed
        
        tasks.remove(task)
    
    return True
```

### 2.3_priority Inversion مشكلة انقلاب الأولوية

```
┌─────────────────────────────────────────────────────────────────┐
│            Priority Inversion Problem                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Example:                                                       │
│  - Task L (low priority) holds resource                      │
│  - Task M (medium priority) becomes ready                       │
│  - Task H (high priority) is blocked by L                     │
│                                                                 │
│  Priority Inversion:                                           │
│  ─────────────────────────────────────────────────────          │
│  Time:  0    5   10   15   20   25   30   35                 │
│  ─────────────────────────────────────────────────────          │
│  L:    █████████████                                        │
│  M:              █████████████                               │
│  H:    █████████████                                        │
│                 ↑ blocked by L                                │
│                                                                 │
│  Solution: Priority Inheritance Protocol                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

```python
# ============================================
# Priority Inheritance Protocol
# ============================================

class PriorityInheritance:
    def __init__(self):
        self.tasks = {}  # task_id -> priority
        self.resources = {}  # resource_id -> holder
    
    def request_resource(self, task_id, resource_id):
        """طلب مورد"""
        if resource_id in self.resources:
            holder = self.resources[resource_id]
            
            # إذا كان holder lower priority، elevation
            if self.tasks[holder] < self.tasks[task_id]:
                inherited_priority = self.tasks[task_id]
                print(f"Task {holder} inherits priority {inherited_priority}")
        else:
            self.resources[resource_id] = task_id
    
    def release_resource(self, task_id, resource_id):
        """تحرير مورد"""
        if task_id == self.resources.get(resource_id):
            del self.resources[resource_id]
            # استعادة الـ original priority
            print(f"Task {task_id} releases resource {resource_id}")
```

## 3. نظام التشغيل الزمني Real-Time Operating System (RTOS)

### 3.1 مكونات RTOS

```
┌─────────────────────────────────────────────────────────────────┐
│                    RTOS Components                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  Kernel                                 │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐       │   │
│  │  │ Scheduler │  │  IPC/RPC  │  │ Memory    │       │   │
│  │  │           │  │           │  │ Manager   │       │   │
│  │  └────────────┘  └────────────┘  └────────────┘       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐              │
│  │   Timer    │  │  Drivers   │  │   File    │              │
│  │  Manager  │  │           │  │  System   │              │
│  └────────────┘  └────────────┘  └────────────┘              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 FreeRTOS Example

```c
// ============================================
// FreeRTOS Task Example
// ============================================

#include "FreeRTOS.h"
#include "task.h"

// تعريف المهام
void vTask1(void *pvParameters) {
    const char *pcTaskName = "Task 1";
    TickType_t xLastWakeTime;
    
    // تهيئة xLastWakeTime
    xLastWakeTime = xTaskGetTickCount();
    
    for (;;) {
        // المهمة
        printf("%s is running\n", pcTaskName);
        
        // تأخير 100ms
        vTaskDelayUntil(&xLastWakeTime, pdMS_TO_TICKS(100));
    }
}

void vTask2(void *pvParameters) {
    const char *pcTaskName = "Task 2";
    
    for (;;) {
        printf("%s is running\n", pcTaskName);
        vTaskDelay(pdMS_TO_TICKS(200));
    }
}

int main(void) {
    // إنشاء المهام
    xTaskCreate(vTask1, "Task 1", 1000, NULL, 1, NULL);
    xTaskCreate(vTask2, "Task 2", 1000, NULL, 2, NULL);
    
    // بدء الـ scheduler
    vTaskStartScheduler();
    
    for (;;);
    return 0;
}
```

### 3.3 Task States حالات المهام

```
┌─────────────────────────────────────────────────────────────────┐
│                    Task State Diagram                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│       ┌──────────┐                                           │
│       │ Created  │                                           │
│       └────┬────┘                                           │
│            │ create                                         │
│            ▼                                                 │
│    ┌───────████████┐                                          │
│    ╱    Ready     ╲                                          │
│    ╲   (Waiting) ╱                                           │
│    ╱    for CPU    ╲                                          │
│    └───────┬───────┘                                          │
│            │ schedule                                         │
│            ▼                                                 │
│      ┌─────┴─────┐                                            │
│      │ Running   │═════╗                                     │
│      └─────┬─────┘    ║ preempt                              │
│            │          ║                                      │
│            ▼          ║                                      │
│      ┌─────┴─────┐    ║                                      │
│      │ Blocked  │    ║                                      │
│      │ (waiting │    ║ wait                                 │
│      │  event)  │    ║                                      │
│      └──────┬────┘    ║                                      │
│             │         ║                                      │
│             └────█┴────╝                                      │
│                 │                                              │
│            tick expires                                       │
│                 ▼                                             │
│          Terminated                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.4 Semaphore and Mutex

```c
// ============================================
// Semaphore Example
// ============================================

#include "semphr.h"

SemaphoreHandle_t xSemaphore;

// Producer
void vProducer(void *pvParameters) {
    for (;;) {
        // إنتاج بيانات
        produce_data();
        
        // Give semaphore
        xSemaphoreGive(xSemaphore);
        
        vTaskDelay(pdMS_TO_TICKS(100));
    }
}

// Consumer
void vConsumer(void *pvParameters) {
    for (;;) {
        // Take semaphore
        if (xSemaphoreTake(xSemaphore, portMAX_DELAY) == pdTRUE) {
            // استهلاك بيانات
            consume_data();
        }
    }
}
```

```c
// Mutex for mutual exclusion
SemaphoreHandle_t xMutex;

void vPrinter(void *pvParameters) {
    for (;;) {
        xSemaphoreTake(xMutex, portMAX_DELAY);
        
        // طباعة (مورد مشترك)
        printf("Printing...\n");
        
        xSemaphoreGive(xMutex);
        
        vTaskDelay(pdMS_TO_TICKS(50));
    }
}
```

## 4. المقاطعات Interrupts

### 4.1 مقدمة Introduction

المقاطعات هي آليات تسمح للمكونات الخارجية بإيقاف المعالج مؤقتاً للتنبيه لحدث معين.

```
┌─────────────────────────────────────────────────────────────────┐
│              Interrupt Handling Flow                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐                                                 │
│  │ Normal   │                                                 │
│  │Execution │                                                 │
│  └────┬─────┘                                                 │
│       │ Interrupt Occurs                                       │
│       ▼                                                        │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ 1. Complete Current Instruction                      │      │
│  │ 2. Save Context (registers, PC, flags)            │      │
│  │ 3. Disable Interrupts                            │      │
│  │ 4. Load Interrupt Vector                         │      │
│  │ 5. Jump to ISR                                   │      │
│  └──────────────────────────────────────────────────────┘      │
│       │                                                        │
│       ▼                                                        │
│  ┌──────────────────────────────────────────────────────┐      │
│  │         Interrupt Service Routine (ISR)              │      │
│  │ - Identify source                                   │      │
│  │ - Handle interrupt                                 │      │
│  │ - Clear interrupt flag                              │      │
│  └──────────────────────────────────────────────────────┘      │
│       │                                                        │
│       ▼                                                        │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ 6. Restore Context                                │      │
│  │ 7. Return from Interrupt                          │      │
│  └──────────────────────────────────────────────────────┘      │
│       │                                                        │
│       ▼                                                        │
│  ┌──────────┐                                                 │
│  │ Resume   │                                                 │
│  │Normal    │                                                 │
│  └──────────┘                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Interrupt Latency زمنية المقاطعة

```c
// ============================================
// Interrupt Latency Measurement
// ============================================

volatile TickType_t interrupt_time;
volatile TickType_t isr_entry_time;

void __attribute__((interrupt)) Timer_IRQ(void) {
    isr_entry_time = xTaskGetTickCountFromISR();
    
    // معالجة المقاطعة
    handle_timer_interrupt();
    
    // حساب latency
    TickType_t latency = isr_entry_time - interrupt_time;
    
    printf("Interrupt Latency: %d ticks\n", (int)latency);
    
    // مسح flag
    TIMER_IFG &= ~TIMER_IFG_BIT;
}

void trigger_interrupt(void) {
    interrupt_time = xTaskGetTickCountFromISR();
    
    // إطلاق المقاطعة
    TIMER_CTRL |= TIMER_START_BIT;
}
```

### 4.3 Interrupt Priorities

```c
// ============================================
// Configuring Interrupt Priorities
// ============================================

// Priorities (lower number = higher priority in NVIC)
// Valid priorities vary by MCU architecture

void config_interrupts(void) {
    // Timer interrupt - high priority
    NVIC_EnableIRQ(Timer0_IRQn);
    NVIC_SetPriority(Timer0_IRQn, 1);
    
    // UART interrupt - medium priority
    NVIC_EnableIRQ(UART0_IRQn);
    NVIC_SetPriority(UART0_IRQn, 3);
    
    // GPIO interrupt - low priority
    NVIC_EnableIRQ(GPIO_IRQn);
    NVIC_SetPriority(GPIO_IRQn, 5);
}
```

### 4.4 Shared Resources in ISRs

```c
// ============================================
// ISR and Task Communication
// ============================================

// Queue for ISR to Task communication
QueueHandle_t xDataQueue;

// ISR - producer
void __attribute__((interrupt)) DataReady_IRQ(void) {
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;
    
    //读取 البيانات
    uint32_t data = read_data_register();
    
    // إرسال إلى queue
    xQueueSendFromISR(xDataQueue, &data, &xHigherPriorityTaskWoken);
    
    // طلب context switch إذا لزم
    if (xHigherPriorityTaskWoken == pdTRUE) {
        portYIELD_FROM_ISR();
    }
}

// Task - consumer
void vDataHandler(void *pvParameters) {
    uint32_t data;
    
    for (;;) {
        if (xQueueReceive(xDataQueue, &data, portMAX_DELAY) == pdTRUE) {
            // معالجة البيانات
            process_data(data);
        }
    }
}
```

## 5. مزامنة المهام Task Synchronization

### 5.1 Producer-Consumer Problem

```c
// ============================================
// Producer-Consumer Solution
// ============================================

#define BUFFER_SIZE 10

typedef struct {
    char buffer[BUFFER_SIZE];
    int in;
    int out;
    SemaphoreHandle_t mutex;
    SemaphoreHandle_t slots;
    SemaphoreHandle_t items;
} SharedBuffer;

// Producer
void vProducer(void *pvParameters) {
    SharedBuffer *pxBuffer = (SharedBuffer *)pvParameters;
    char data;
    
    for (;;) {
        data = produce_data();
        
        // Wait for slot
        xSemaphoreTake(pxBuffer->slots, portMAX_DELAY);
        
        // Critical section
        xSemaphoreTake(pxBuffer->mutex, portMAX_DELAY);
        
        pxBuffer->buffer[pxBuffer->in] = data;
        pxBuffer->in = (pxBuffer->in + 1) % BUFFER_SIZE;
        
        xSemaphoreGive(pxBuffer->mutex);
        
        // Signal item available
        xSemaphoreGive(pxBuffer->items);
    }
}

// Consumer
void vConsumer(void *pvParameters) {
    SharedBuffer *pxBuffer = (SharedBuffer *)pvParameters;
    char data;
    
    for (;;) {
        // Wait for item
        xSemaphoreTake(pxBuffer->items, portMAX_DELAY);
        
        // Critical section
        xSemaphoreTake(pxBuffer->mutex, portMAX_DELAY);
        
        data = pxBuffer->buffer[pxBuffer->out];
        pxBuffer->out = (pxBuffer->out + 1) % BUFFER_SIZE;
        
        xSemaphoreGive(pxBuffer->mutex);
        
        // Signal empty slot
        xSemaphoreGive(pxBuffer->slots);
        
        consume_data(data);
    }
}
```

### 5.2 Readers-Writers Problem

```c
// ============================================
// Readers-Writers Solution
// ============================================

typedef struct {
    int shared_data;
    SemaphoreHandle_t mutex;
    SemaphoreHandle_t read_try;
    int read_count;
    SemaphoreHandle_t resource;
} SharedResource;

// Reader
void vReader(void *pvParameters) {
    SharedResource *pxResource = (SharedResource *)pvParameters;
    
    for (;;) {
        // Try to read
        xSemaphoreTake(pxResource->read_try, portMAX_DELAY);
        xSemaphoreTake(pxResource->mutex, portMAX_DELAY);
        
        pxResource->read_count++;
        
        if (pxResource->read_count == 1) {
            xSemaphoreTake(pxResource->resource, portMAX_DELAY);
        }
        
        xSemaphoreGive(pxResource->mutex);
        xSemaphoreGive(pxResource->read_try);
        
        // قراءة البيانات
        int data = pxResource->shared_data;
        
        xSemaphoreTake(pxResource->mutex, portMAX_DELAY);
        pxResource->read_count--;
        
        if (pxResource->read_count == 0) {
            xSemaphoreGive(pxResource->resource);
        }
        
        xSemaphoreGive(pxResource->mutex);
        
        process_data(data);
    }
}

// Writer
void vWriter(void *pvParameters) {
    SharedResource *pxResource = (SharedResource *)pvParameters;
    
    for (;;) {
        xSemaphoreTake(pxResource->resource, portMAX_DELAY);
        
        // كتابة البيانات
        pxResource->shared_data = produce_data();
        
        xSemaphoreGive(pxResource->resource);
    }
}
```

### 5.3 Message Passing

```c
// ============================================
// Message Queue Example
// ============================================

typedef struct {
    int cmd;
    void *data;
} Message;

QueueHandle_t xCommandQueue;

void vCommandHandler(void *pvParameters) {
    Message msg;
    
    for (;;) {
        if (xQueueReceive(xCommandQueue, &msg, portMAX_DELAY) == pdTRUE) {
            switch (msg.cmd) {
                case CMD_START:
                    start_operation(msg.data);
                    break;
                case CMD_STOP:
                    stop_operation();
                    break;
                case CMD_CONFIG:
                    configure(msg.data);
                    break;
            }
        }
    }
}

// From ISR
void vSendCommandISR(int cmd, void *data) {
    Message msg = { .cmd = cmd, .data = data };
    
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;
    xQueueSendFromISR(xCommandQueue, &msg, &xHigherPriorityTaskWoken);
    
    if (xHigherPriorityTaskWoken == pdTRUE) {
        portYIELD_FROM_ISR();
    }
}
```

## 6. النظم المدمجة Embedded Systems

### 6.1 مقدمة Introduction

النظم المدمجة هي أنظمة حوسبة مخصصة выполня وظيفة محددة ضمن نظام أكبر.

```
┌─────────────────────────────────────────────────────────────────┐
│              Embedded System Architecture                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  Application Software                   │   │
│  │                  (Tasks, ISR, Logic)                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                    │                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                     RTOS / Kernel                       │   │
│  │  (Scheduler, IPC, Memory, Drivers)                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                    │                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  Hardware Layer                        │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │   CPU    │  │  Memory  │  │Peripherals│          │   │
│  │  │  (MCU)  │  │    │    │  │    │    │            │   │
│  │  └──────────┘  └──────────┘  └──────────┘           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Microcontroller Example

```c
// ============================================
// ARM Cortex-M Example
// ============================================

#include "stm32f4xx_hal.h"

// تهيئة النظام
void SystemClock_Config(void) {
    RCC_OscInitTypeDef RCC_OscInitStruct = {0};
    
    // HSE oscillator
    RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSE;
    RCC_OscInitStruct.HSEState = RCC_HSE_ON;
    HAL_RCC_OscConfig(&RCC_OscInitStruct);
}

// تهيئة GPIO
void MX_GPIO_Init(void) {
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    
    // Enable clock
    __HAL_RCC_GPIOA_CLK_ENABLE();
    
    // LED pin
    GPIO_InitStruct.Pin = GPIO_PIN_5;
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
}

// Button interrupt
void EXTI0_IRQHandler(void) {
    HAL_GPIO_EXTI_IRQHandler(GPIO_PIN_0);
}

void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin) {
    if (GPIO_Pin == GPIO_PIN_0) {
        // Toggle LED
        HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
    }
}

int main(void) {
    // تهيئة HAL
    HAL_Init();
    SystemClock_Config();
    MX_GPIO_Init();
    
    for (;;) {
        // Main loop
        HAL_Delay(1000);
    }
}
```

### 6.3 Watchdog Timer

```c
// ============================================
// Watchdog Timer Example
// ============================================

void config_watchdog(void) {
    // تهيئة watchdog (1 second timeout)
    IWDG->KR = 0x5555;  // Enable access
    IWDG->PR = IWDG_PR_PR_256;  // 256 divider
    IWDG->RLR = 0xfff;  // ~1 second
    
    // Start
    IWDG->KR = 0xcccc;
}

void kick_watchdog(void) {
    // Feed the dog
    IWDG->KR = 0xaaaa;
}

void vCriticalTask(void *pvParameters) {
    for (;;) {
        // تنفيذ المهمة
        perform_critical_operation();
        
        // Reset watchdog
        kick_watchdog();
        
        vTaskDelay(pdMS_TO_TICKS(500));
    }
}
```

## 7. تمارين Exercises

### Exercise 1: RMS Scheduling

```python
# Aufgabe 1: تحقق من قابلية الجدولة بـ RMS
# - 3 tasks: (T1, p=10, e=2), (T2, p=20, e=5), (T3, p=40, e=8)
def check_rms_schedulability(tasks):
    # Your code here
    pass
```

### Exercise 2: EDF Scheduling

```python
# Aufgabe 2: جدولة EDF لمهام مع deadlines مختلفة
def edf_schedule(tasks, current_time):
    # Your code here
    pass
```

### Exercise 3: Shared Resource

```c
// Aufgabe 3: حل producer-consumer بـ semaphores
void producer_consumer(void) {
    // Your code here
}
```

## 8. Bibliography المراجع

1. **Liu, J. W. S.** (2000). *Real-Time Systems*. Prentice Hall.
2. **Mall, R.** (2009). *Real-Time Systems*. Pearson.
3. **Labrosse, J. J.** (2005). *Embedded Systems Building Blocks*. CRC Press.
4. **FreeRTOS Documentation** (2024). *Real-Time Operating System for Microcontrollers*.

---

```
╔════════════════════════════════════════════════════════════════════════╗
║                      ملخص الفصل                                   ║
╠════════════════════════════════════════════════════════════════════════╣
║  ✅ التصنيف: Hard, Firm, Soft Real-Time                              ║
║  ✅ جدولة: RMS, EDF, LLF, Priority Inheritance                     ║
║  ✅ RTOS: Components, Task States, Semaphores, Mutex                 ║
║  ✅ المقاطعات: Handling, Latency, Priorities, ISR design               ║
║  ✅ المزامنة: Producer-Consumer, Readers-Writers                   ║
║  ✅ النظم المدمجة: architectures, Microcontrollers                 ║
╚════════════════════════════════════════════════════════════════════════╝
```