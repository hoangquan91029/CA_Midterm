export type QuizTopic =
  | 'performance'
  | 'mips'
  | 'arithmetic'
  | 'datapath'
  | 'cache'
  | 'assembler';

export interface QuizQuestion {
  id: string;
  sourceExam:
    | 'IT089IU Midterm 2022'
    | 'COMP 212 Midterm'
    | 'Fall 2011 Midterm'
    | 'CO2007 Exam'
    | 'HW3 Arithmetic'
    | 'NotebookLM Mind Map'
    | 'Đề Tự Sinh (Auto-Gen)';
  topic: QuizTopic;
  topicLabel: string;
  enTopicLabel?: string;
  mindMapNodeId: string; // Maps to cat-1, cat-1-1, cat-2-1, etc.
  difficulty: 'Cơ bản' | 'Vận dụng' | 'Nâng cao';
  question: string;
  enQuestion?: string;
  codeSnippet?: string;
  options: string[];
  enOptions?: string[];
  correctIndex: number;
  explanation: string;
  enExplanation?: string;
  formulaUsed?: string;
  isGenerated?: boolean;
}

export const QUIZ_TOPIC_META: Record<
  QuizTopic,
  {
    label: string;
    enLabel: string;
    shortLabel: string;
    enShortLabel: string;
    chapterNum: number;
    description: string;
    enDescription: string;
  }
> = {
  performance: {
    label: 'Chương 1: Hiệu năng CPU & CPI',
    enLabel: 'Chapter 1: CPU Performance & CPI',
    shortLabel: '1. Hiệu năng CPU',
    enShortLabel: '1. CPU Performance',
    chapterNum: 1,
    description: 'Định luật Moore, Response Time vs Throughput, Clock Cycles, Average CPI, CPU Time & Speedup',
    enDescription: "Moore's Law, Response Time vs Throughput, Clock Cycles, Average CPI, CPU Time & Speedup",
  },
  mips: {
    label: 'Chương 2: Tập lệnh MIPS & Dịch C',
    enLabel: 'Chapter 2: MIPS ISA & C Translation',
    shortLabel: '2. Tập lệnh MIPS',
    enShortLabel: '2. MIPS Assembly',
    chapterNum: 2,
    description: 'Khuôn dạng R/I/J, dịch C sang MIPS (if-else, while, mảng), dịch bit & Big-Endian',
    enDescription: 'R/I/J Instruction Formats, C-to-MIPS compilation (if-else, loops, arrays), Bitwise & Endianness',
  },
  arithmetic: {
    label: 'Chương 3: Số học Bù 2 & IEEE 754',
    enLabel: "Chapter 3: Two's Complement & IEEE 754",
    shortLabel: '3. Bù 2 & IEEE 754',
    enShortLabel: '3. Computer Arithmetic',
    chapterNum: 3,
    description: 'Biểu diễn không dấu, bù 2, cờ tràn Overflow, chuẩn dấu phẩy động IEEE 754 Single/Double',
    enDescription: "Unsigned & Two's Complement integers, Overflow detection, IEEE 754 Floating-Point standard",
  },
  datapath: {
    label: 'Chương 4: Datapath & Pipeline',
    enLabel: 'Chapter 4: Processor Datapath & Pipeline',
    shortLabel: '4. Datapath & Pipeline',
    enShortLabel: '4. Datapath & Pipeline',
    chapterNum: 4,
    description: 'Tín hiệu điều khiển Single-Cycle, 5 tầng Pipeline (IF, ID, EX, MEM, WB), Hazards & Forwarding',
    enDescription: 'Single-Cycle Control Signals, 5-Stage Pipeline (IF, ID, EX, MEM, WB), Data Hazards & Forwarding',
  },
  cache: {
    label: 'Chương 5: Cache & Bộ nhớ Ảo',
    enLabel: 'Chapter 5: Cache & Virtual Memory',
    shortLabel: '5. Cache & Virtual Mem',
    enShortLabel: '5. Cache & Virtual Mem',
    chapterNum: 5,
    description: 'Nguyên lý cục bộ, Direct/Set-Associative Cache, 3C Misses, Write Policy, TLB & Page Table',
    enDescription: 'Principle of Locality, Direct/Set-Associative Cache, 3C Misses, Write Policies, TLB & Page Table',
  },
  assembler: {
    label: 'Chương 6: Thủ tục Stack, Assembler & SPIM',
    enLabel: 'Chapter 6: Procedures, Stack, Linker & SPIM',
    shortLabel: '6. Stack & SPIM',
    enShortLabel: '6. Stack & SPIM',
    chapterNum: 6,
    description: 'Thủ tục lá/đệ quy, con trỏ $sp, lệnh giả ($at), chuỗi biên dịch Linker & SPIM Syscall',
    enDescription: 'Leaf/Non-Leaf Procedures, Stack Pointer ($sp), Pseudo-instructions ($at), Linker & SPIM Syscalls',
  },
};

export const MIDTERM_QUIZ_BANK: QuizQuestion[] = [
  // ==================== CHƯƠNG 1: HIỆU NĂNG CPU (cat-1) ====================
  {
    id: 'it089-q1a',
    sourceExam: 'IT089IU Midterm 2022',
    topic: 'performance',
    topicLabel: 'Tổng chu kỳ xung nhịp',
    mindMapNodeId: 'cat-1-2-2',
    difficulty: 'Vận dụng',
    question:
      'Cho 2 bộ xử lý P1 ($2.5\\text{ GHz}$) và P2 ($3.0\\text{ GHz}$) cùng thực thi một chương trình gồm $10{,}000{,}000$ ($10^7$) lệnh được chia thành 4 lớp: $20\\%$ lớp A, $10\\%$ lớp B, $40\\%$ lớp C, $30\\%$ lớp D. CPI của P1 cho (A, B, C, D) lần lượt là $(3, 3, 1, 2)$; của P2 là $(2, 1, 2, 3)$. Tổng số chu kỳ xung nhịp ($\\text{Clock Cycles}$) của P1 và P2 lần lượt là bao nhiêu?',
    options: [
      'P1: $19 \\times 10^6$ chu kỳ; P2: $22 \\times 10^6$ chu kỳ',
      'P1: $22 \\times 10^6$ chu kỳ; P2: $19 \\times 10^6$ chu kỳ',
      'P1: $18 \\times 10^6$ chu kỳ; P2: $20 \\times 10^6$ chu kỳ',
      'P1: $25 \\times 10^6$ chu kỳ; P2: $30 \\times 10^6$ chu kỳ',
    ],
    correctIndex: 0,
    explanation:
      'Số lệnh mỗi lớp: $I_A = 2 \\times 10^6$, $I_B = 1 \\times 10^6$, $I_C = 4 \\times 10^6$, $I_D = 3 \\times 10^6$.\n• $\\text{Clock Cycles}_{\\text{P1}} = 3 \\times (2 \\times 10^6) + 3 \\times (1 \\times 10^6) + 1 \\times (4 \\times 10^6) + 2 \\times (3 \\times 10^6) = (6 + 3 + 4 + 6) \\times 10^6 = \\mathbf{19 \\times 10^6\\text{ cycles}}$.\n• $\\text{Clock Cycles}_{\\text{P2}} = 2 \\times (2 \\times 10^6) + 1 \\times (1 \\times 10^6) + 2 \\times (4 \\times 10^6) + 3 \\times (3 \\times 10^6) = (4 + 1 + 8 + 9) \\times 10^6 = \\mathbf{22 \\times 10^6\\text{ cycles}}$.',
    formulaUsed: '$\\text{Clock Cycles} = \\sum (\\text{CPI}_i \\times I_i)$',
  },
  {
    id: 'it089-q1bc',
    sourceExam: 'IT089IU Midterm 2022',
    topic: 'performance',
    topicLabel: 'Average CPI & CPU Time',
    mindMapNodeId: 'cat-1-2-1',
    difficulty: 'Vận dụng',
    question:
      'Tiếp tục dữ kiện Câu 1 đề IT089IU (P1: $2.5\\text{ GHz}$, $19 \\times 10^6\\text{ cycles}$; P2: $3.0\\text{ GHz}$, $22 \\times 10^6\\text{ cycles}$, tổng $10^7$ lệnh). Giá trị $\\text{CPI}_{\\text{avg}}$ và kết luận nào sau đây là ĐÚNG?',
    options: [
      '$\\text{CPI}_{\\text{P1}} = 1.9$, $\\text{CPI}_{\\text{P2}} = 2.2$; P2 nhanh hơn P1 ($7.33\\text{ ms}$ so với $7.60\\text{ ms}$)',
      '$\\text{CPI}_{\\text{P1}} = 1.9$, $\\text{CPI}_{\\text{P2}} = 2.2$; P1 nhanh hơn P2 vì P1 có CPI nhỏ hơn',
      '$\\text{CPI}_{\\text{P1}} = 2.2$, $\\text{CPI}_{\\text{P2}} = 1.9$; P2 nhanh hơn P1',
      'Hai bộ xử lý có thời gian thực thi bằng nhau ($7.50\\text{ ms}$)',
    ],
    correctIndex: 0,
    explanation:
      '• $\\text{CPI}_{\\text{P1}} = \\dfrac{19 \\times 10^6}{10 \\times 10^6} = \\mathbf{1.9}$ và $\\text{CPI}_{\\text{P2}} = \\dfrac{22 \\times 10^6}{10 \\times 10^6} = \\mathbf{2.2}$.\n• $\\text{CPU Time}_{\\text{P1}} = \\dfrac{\\text{Cycles}}{\\text{Clock Rate}} = \\dfrac{19 \\times 10^6}{2.5 \\times 10^9} = 7.6 \\times 10^{-3}\\text{ s} = \\mathbf{7.60\\text{ ms}}$.\n• $\\text{CPU Time}_{\\text{P2}} = \\dfrac{22 \\times 10^6}{3.0 \\times 10^9} = 7.33 \\times 10^{-3}\\text{ s} = \\mathbf{7.33\\text{ ms}}$.\nDù P2 có CPI cao hơn ($2.2 > 1.9$), nhờ tần số xung nhịp $3.0\\text{ GHz}$ cao hơn nên P2 vẫn hoàn thành chương trình nhanh hơn P1.',
    formulaUsed: '$\\text{CPU Time} = \\dfrac{\\text{Clock Cycles}}{\\text{Clock Rate}}$',
  },
  {
    id: 'co2007-q1-moore',
    sourceExam: 'CO2007 Exam',
    topic: 'performance',
    topicLabel: 'Định luật Moore & Throughput',
    mindMapNodeId: 'cat-1-1',
    difficulty: 'Cơ bản',
    question:
      'Theo Định luật Moore (Moore’s Law) và lý thuyết đánh giá hiệu năng (Câu 1 đề CO2007), phát biểu nào dưới đây là ĐÚNG khi ta gắn thêm nhiều bộ xử lý (processors/cores) giống hệt hiện tại vào hệ thống máy tính?',
    options: [
      'Thông lượng hệ thống (Throughput) tăng lên trực tiếp; đồng thời theo Định luật Moore mật độ transistor tăng gấp đôi sau mỗi 18–24 tháng.',
      'Thời gian phản hồi của một tác vụ đơn luồng (Response Time) giảm đi một nửa ngay lập tức.',
      'Chu kỳ xung nhịp (Clock Cycle Time) tự động giảm đi theo số nhân CPU.',
      'Số lệnh thực thi (Instruction Count) của chương trình giảm đi một nửa.',
    ],
    correctIndex: 0,
    explanation:
      '• **Định luật Moore**: Số lượng bóng bán dẫn (transistors) trên một vi mạch tích hợp tăng gấp đôi sau mỗi 18–24 tháng.\n• **Throughput vs Response Time** (Câu 1 đề CO2007): Khi thêm nhiều bộ xử lý vào hệ thống, tổng khối lượng công việc xử lý song song trong một đơn vị thời gian (**Throughput / Bandwidth**) tăng lên trực tiếp, chứ không làm giảm thời gian chạy của một chương trình tuần tự đơn lẻ.',
    formulaUsed: '$\\text{Performance} = \\dfrac{1}{\\text{Execution Time}}$',
  },
  {
    id: 'co2007-q3-4-fp',
    sourceExam: 'CO2007 Exam',
    topic: 'performance',
    topicLabel: 'Tối ưu CPI theo mục tiêu tăng tốc',
    mindMapNodeId: 'cat-1-2',
    difficulty: 'Nâng cao',
    question:
      'Một chương trình chạy trên máy tính có xung nhịp $2\\text{ GHz}$ gồm 4 nhóm lệnh: lệnh dấu phẩy động FP ($20 \\times 10^6$ lệnh, $\\text{CPI} = 2$), lệnh số nguyên INT ($120 \\times 10^6$ lệnh, $\\text{CPI} = 1$), lệnh Load/Store ($50 \\times 10^6$ lệnh, $\\text{CPI} = 3$) và lệnh Branch ($25 \\times 10^6$ lệnh, $\\text{CPI} = 4$) (Câu 3–4 đề CO2007). Tổng số chu kỳ máy ban đầu là bao nhiêu, và có thể chỉ giảm riêng CPI của nhóm lệnh FP để chương trình chạy nhanh gấp $1.5$ lần không?',
    options: [
      'Tổng chu kỳ ban đầu là $410 \\times 10^6$; KHÔNG THỂ đạt tăng tốc $1.5\\times$ chỉ bằng cách giảm CPI của lệnh FP (vì nhóm FP chỉ chiếm $40 \\times 10^6$ chu kỳ).',
      'Tổng chu kỳ ban đầu là $410 \\times 10^6$; cần giảm CPI của lệnh FP từ $2$ xuống $1$.',
      'Tổng chu kỳ ban đầu là $380 \\times 10^6$; cần giảm CPI của lệnh FP xuống $0.5$.',
      'Tổng chu kỳ ban đầu là $215 \\times 10^6$; hoàn toàn đạt được nếu $\\text{CPI}_{\\text{FP}} = 1$.',
    ],
    correctIndex: 0,
    explanation:
      '• Tính tổng chu kỳ ban đầu:\n  $\\text{Cycles}_{\\text{cũ}} = (20 \\times 2 + 120 \\times 1 + 50 \\times 3 + 25 \\times 4) \\times 10^6 = (40 + 120 + 150 + 100) \\times 10^6 = \\mathbf{410 \\times 10^6\\text{ cycles}}$.\n• Thời gian ban đầu: $T_{\\text{cũ}} = \\dfrac{410 \\times 10^6}{2 \\times 10^9} = 0.205\\text{ s} = 205\\text{ ms}$.\n• Để chương trình chạy nhanh gấp $1.5$ lần, tổng số chu kỳ mới phải giảm còn $\\dfrac{410}{1.5} \\approx 273.3 \\times 10^6\\text{ cycles}$ (tức cần cắt giảm $136.7 \\times 10^6\\text{ cycles}$).\n• Tuy nhiên toàn bộ nhóm lệnh FP chỉ tốn $40 \\times 10^6\\text{ cycles}$ (kể cả $\\text{CPI}_{\\text{FP}} = 0$ thì vẫn còn $370 \\times 10^6\\text{ cycles}$). Đây chính là hệ quả của **Định luật Amdahl**!',
    formulaUsed: '$\\text{Cycles}_{\\text{mới}} = \\dfrac{\\text{Cycles}_{\\text{cũ}}}{\\text{Speedup}}$',
  },
  {
    id: 'fall2011-q3-m1m2',
    sourceExam: 'Fall 2011 Midterm',
    topic: 'performance',
    topicLabel: 'So sánh M1 (3.5 GHz) vs M2 (4.5 GHz)',
    mindMapNodeId: 'cat-1-2-3',
    difficulty: 'Vận dụng',
    question:
      'Hai máy tính M1 ($3.5\\text{ GHz}$) và M2 ($4.5\\text{ GHz}$) có cùng tập lệnh ISA (Bài 3 đề Fall 2011). Trên một chương trình chuẩn gồm: $10\\%$ lớp A, $35\\%$ lớp B, $25\\%$ lớp C, $30\\%$ lớp D. Biết CPI trên M1 là $(1, 2, 3, 4)$ và trên M2 là $(2, 2, 4, 4)$. Giá trị $\\text{CPI}_{\\text{avg}}$ và tỷ số tốc độ đỉnh (Peak Performance Ratio) của hai máy là bao nhiêu?',
    options: [
      '$\\text{CPI}_{\\text{M1}} = 2.75$, $\\text{CPI}_{\\text{M2}} = 3.10$; trên chương trình này M2 vẫn nhanh hơn M1 gấp $\\approx 1.14$ lần',
      '$\\text{CPI}_{\\text{M1}} = 2.50$, $\\text{CPI}_{\\text{M2}} = 3.00$; M1 nhanh hơn M2 gấp $1.20$ lần',
      '$\\text{CPI}_{\\text{M1}} = 2.75$, $\\text{CPI}_{\\text{M2}} = 3.10$; M1 nhanh hơn M2 vì CPI thấp hơn',
      '$\\text{CPI}_{\\text{M1}} = 3.10$, $\\text{CPI}_{\\text{M2}} = 2.75$; M2 nhanh hơn M1 gấp $1.45$ lần',
    ],
    correctIndex: 0,
    explanation:
      '• $\\text{CPI}_{\\text{M1}} = 0.10 \\times 1 + 0.35 \\times 2 + 0.25 \\times 3 + 0.30 \\times 4 = 0.10 + 0.70 + 0.75 + 1.20 = \\mathbf{2.75}$.\n• $\\text{CPI}_{\\text{M2}} = 0.10 \\times 2 + 0.35 \\times 2 + 0.25 \\times 4 + 0.30 \\times 4 = 0.20 + 0.70 + 1.00 + 1.20 = \\mathbf{3.10}$.\n• Tỷ số thời gian thực thi: $\\dfrac{T_{\\text{M1}}}{T_{\\text{M2}}} = \\dfrac{2.75 / 3.5}{3.10 / 4.5} = \\dfrac{0.7857}{0.6889} \\approx \\mathbf{1.14}$. Vậy M2 nhanh hơn M1 khoảng $1.14$ lần!',
    formulaUsed: '$\\text{CPI}_{\\text{avg}} = \\sum_{i=1}^{4} (F_i \\times \\text{CPI}_i)$',
  },
  {
    id: 'nb-powerwall',
    sourceExam: 'NotebookLM Mind Map',
    topic: 'performance',
    topicLabel: 'Bức tường Công suất (Power Wall)',
    mindMapNodeId: 'cat-1-1-1',
    difficulty: 'Cơ bản',
    question:
      'Vì sao ngành công nghiệp vi xử lý buộc phải chuyển dịch từ việc liên tục tăng tần số xung nhịp đơn nhân (Single-core Clock Rate) sang kiến trúc đa nhân (Multicore Processors)?',
    options: [
      'Do công suất tiêu thụ động $P \\propto C \\times V^2 \\times f$ làm nhiệt lượng tỏa ra vượt ngưỡng tản nhiệt (Power Wall) khi tiếp tục tăng tần số $f$.',
      'Do số lượng bóng bán dẫn trên chip bắt đầu giảm đi sau mỗi 2 năm.',
      'Do bộ nhớ SRAM không thể hoạt động ở tần số trên $1\\text{ GHz}$.',
      'Do tập lệnh MIPS chỉ cho phép tối đa tần số $3.0\\text{ GHz}$.',
    ],
    correctIndex: 0,
    explanation:
      'Theo công thức công suất động CMOS: $P_{\\text{dynamic}} \\propto C_{\\text{load}} \\times V^2 \\times f$. Khi tần số $f$ tăng cao và điện áp $V$ không thể giảm thêm vì dòng rò (leakage current), chip chạm tới **Bức tường Công suất (Power Wall)**, buộc các hãng thiết kế chuyển sang tăng số nhân (Multicore) để nâng cao Throughput.',
    formulaUsed: '$P_{\\text{dynamic}} \\propto C_{\\text{load}} \\times V^2 \\times f$',
  },

  // ==================== CHƯƠNG 2: TẬP LỆNH MIPS (cat-2) ====================
  {
    id: 'it089-q2a',
    sourceExam: 'IT089IU Midterm 2022',
    topic: 'mips',
    topicLabel: 'Biên dịch C sang MIPS (if-else)',
    mindMapNodeId: 'cat-2',
    difficulty: 'Vận dụng',
    question:
      'Giả sử các biến nguyên `i, j, k` được gán trong $s0, $s1, $s2 và địa chỉ cơ sở (base address) của mảng nguyên `A` nằm trong $s3. Đoạn mã MIPS nào dịch chính xác câu lệnh C bên dưới?',
    codeSnippet: `if (i == j)
    A[i] = A[k] + 1;
else
    A[i] = A[j] - 1;`,
    options: [
      '`bne $s0, $s1, ELSE` -> `sll $t0, $s2, 2` -> `add $t0, $s3, $t0` -> `lw $t0, 0($t0)` -> `addi $t0, $t0, 1` -> lưu vào `A[i]` rồi `j EXIT`',
      '`beq $s0, $s1, ELSE` -> `lw $t0, $s2($s3)` -> `addi $t0, $t0, 1` -> `sw $t0, $s0($s3)`',
      '`bne $s0, $s1, ELSE` -> `add $t0, $s3, $s2` -> `lw $t0, 0($t0)` -> `addi $t0, $t0, 1` (không dịch trái 2 bit)',
      '`slt $t0, $s0, $s1` -> `bne $t0, $zero, ELSE` -> `lw $t1, 4($s3)`',
    ],
    correctIndex: 0,
    explanation:
      '1) Trong hợp ngữ, ta kiểm tra điều kiện ngược để nhảy sang nhánh `ELSE`: `bne $s0, $s1, ELSE` (nếu $i \\ne j$ thì nhảy tới `ELSE`).\n2) Vì mỗi phần tử mảng `int` chiếm $4\\text{ bytes}$, để truy xuất `A[k]` ta phải nhân chỉ số `k` ($s2) với $4$ bằng lệnh `sll $t0, $s2, 2`, sau đó cộng địa chỉ nền $s3: `add $t0, $s3, $t0`, đọc giá trị `lw $t0, 0($t0)` và cộng 1 `addi $t0, $t0, 1`.\n3) Tương tự, tính địa chỉ `&A[i]` bằng `sll $t1, $s0, 2` + `add $t1, $s3, $t1`, lưu `sw $t0, 0($t1)` và bắt buộc có `j EXIT` để không bị trôi xuống nhánh `ELSE`.',
    formulaUsed: '$\\text{Byte Offset} = \\text{Index} \\times 4 = (\\text{Index} \\ll 2)$',
  },
  {
    id: 'it089-q2b',
    sourceExam: 'IT089IU Midterm 2022',
    topic: 'mips',
    topicLabel: 'Biên dịch C sang MIPS (while)',
    mindMapNodeId: 'cat-2',
    difficulty: 'Vận dụng',
    question:
      'Với `i` $\\rightarrow$ $s0, `j` $\\rightarrow$ $s1, `k` $\\rightarrow$ $s2, `base(A)` $\\rightarrow$ $s3, đoạn mã MIPS nào thực hiện đúng vòng lặp `while` sau (Câu 2b đề IT089IU)?',
    codeSnippet: `while (i != j) {
    i += 1;
    A[k - i] = 0;
}`,
    options: [
      '`LOOP: beq $s0, $s1, EXIT` / `addi $s0, $s0, 1` / `sub $t0, $s2, $s0` / `sll $t0, $t0, 2` / `add $t0, $s3, $t0` / `sw $zero, 0($t0)` / `j LOOP` / `EXIT:`',
      '`LOOP: bne $s0, $s1, EXIT` / `addi $s0, $s0, 1` / `sub $t0, $s2, $s0` / `sw $zero, 0($t0)` / `j LOOP` / `EXIT:`',
      '`LOOP: beq $s0, $s1, EXIT` / `sub $t0, $s2, $s0` / `addi $s0, $s0, 1` / `sll $t0, $t0, 2` / `sw $zero, 0($s3)`',
      '`LOOP: beq $s0, $s1, EXIT` / `addi $s0, $s0, 4` / `sub $t0, $s2, $s0` / `add $t0, $s3, $t0` / `sw $zero, 0($t0)` / `j LOOP`',
    ],
    correctIndex: 0,
    explanation:
      '• Điều kiện lặp là $i \\ne j$, nên điều kiện thoát vòng lặp ở đầu nhãn `LOOP` là `beq $s0, $s1, EXIT`.\n• Tăng $i = i + 1$: `addi $s0, $s0, 1`.\n• Tính chỉ số $k - i$: `sub $t0, $s2, $s0`.\n• Đổi chỉ số sang độ lệch byte (nhân $4$): `sll $t0, $t0, 2`.\n• Cộng địa chỉ nền mảng A: `add $t0, $s3, $t0`.\n• Ghi giá trị $0$ vào `A[k - i]`: `sw $zero, 0($t0)` rồi nhảy `j LOOP`.',
  },
  {
    id: 'it089-q3-trace',
    sourceExam: 'IT089IU Midterm 2022',
    topic: 'mips',
    topicLabel: 'Đọc hiểu vòng lặp MIPS',
    mindMapNodeId: 'cat-2-2',
    difficulty: 'Nâng cao',
    question:
      'Cho đoạn hợp ngữ MIPS trong Câu 3 đề IT089IU (40 điểm) với $t1 là biến `i`, $s2 là biến `result`, và $s0 trỏ tới `MemArray`. Sau khi vòng lặp `LOOP` kết thúc hoàn toàn, chương trình chạy bao nhiêu vòng, giá trị cuối của `i` ($t1) và `result` ($s2) là bao nhiêu?',
    codeSnippet: `.data
MemArray: .word 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
.text
main: addi $t1, $0, 1       # i = 1
      add  $s2, $0, $0      # result = 0
      la   $s0, MemArray
LOOP: lw   $s1, 0($s0)
      addi $s0, $s0, 4
      addi $t1, $t1, 2
      add  $s2, $s2, $s1
      slti $t2, $t1, 9
      bne  $t2, $0, LOOP`,
    options: [
      'Chạy 4 vòng; kết thúc: $i = 9$, $\\text{result} = 10$ (in ra số 10)',
      'Chạy 4 vòng; kết thúc: $i = 8$, $\\text{result} = 10$',
      'Chạy 5 vòng; kết thúc: $i = 11$, $\\text{result} = 15$',
      'Chạy 8 vòng; kết thúc: $i = 9$, $\\text{result} = 36$',
    ],
    correctIndex: 0,
    explanation:
      'Theo dõi từng vòng lặp (Ban đầu: $i = 1, \\text{result} = 0$, `$s0` trỏ tới `MemArray[0]`):\n• Vòng 1: `$s1 = 1`, `$s0` $\\rightarrow$ `&MemArray[1]`, $i = 1+2 = 3$, $\\text{result} = 0+1 = 1$. Kiểm tra $3 < 9$ (đúng) $\\rightarrow$ lặp tiếp.\n• Vòng 2: `$s1 = 2`, `$s0` $\\rightarrow$ `&MemArray[2]`, $i = 3+2 = 5$, $\\text{result} = 1+2 = 3$. Kiểm tra $5 < 9$ (đúng) $\\rightarrow$ lặp tiếp.\n• Vòng 3: `$s1 = 3`, `$s0` $\\rightarrow$ `&MemArray[3]`, $i = 5+2 = 7$, $\\text{result} = 3+3 = 6$. Kiểm tra $7 < 9$ (đúng) $\\rightarrow$ lặp tiếp.\n• Vòng 4: `$s1 = 4`, `$s0` $\\rightarrow$ `&MemArray[4]`, $i = 7+2 = 9$, $\\text{result} = 6+4 = 10$. Kiểm tra $9 < 9$ (sai, `$t2 = 0`) $\\rightarrow$ Thoát `LOOP`!\nVậy `LOOP` chạy **4 lần**, $i_{\\text{cuối}} = 9$, $\\text{result}_{\\text{cuối}} = 10$, và `syscall` 1 in ra số nguyên $10$.',
  },
  {
    id: 'it089-q4',
    sourceExam: 'IT089IU Midterm 2022',
    topic: 'mips',
    topicLabel: 'Phép toán Bitwise MIPS',
    mindMapNodeId: 'cat-2-1-1',
    difficulty: 'Vận dụng',
    question:
      'Giả sử thanh ghi $t0 = `0xAAAAAAAA` và $t1 = `0x01020304`. Theo đáp án chuẩn đề thi IT089IU (Câu 4), giá trị của thanh ghi $t2 sau chuỗi 3 lệnh dưới đây là bao nhiêu?',
    codeSnippet: `sll  $t2, $t0, 28
or   $t2, $t2, $t1
andi $t2, $t2, -1`,
    options: [
      '`0xA1020304`',
      '`0x00000304`',
      '`0xAA020304`',
      '`0x0102030A`',
    ],
    correctIndex: 0,
    explanation:
      '1) `sll $t2, $t0, 28`: Dịch trái `0xAAAAAAAA` đi 28 bit (tức 7 chữ số Hexa). Chữ số Hexa cuối cùng `A` được đẩy lên 4 bit cao nhất (bits 31..28), 28 bit thấp điền 0 $\\rightarrow$ $t2 = `0xA0000000`.\n2) `or $t2, $t2, $t1`: `0xA0000000 | 0x01020304 = 0xA1020304`.\n3) `andi $t2, $t2, -1`: Trong đáp án đề thi IT089IU, hằng số $-1$ được hiểu là chuỗi bit toàn 1 (`0xFFFFFFFF`), nên phép AND với $-1$ giữ nguyên toàn bộ giá trị $\\rightarrow$ Kết quả chuẩn trong Answer Key là `0xA1020304` (Lưu ý thêm: nếu trình hợp dịch chuẩn MIPS zero-extend hằng số 16-bit thì kết quả sẽ giữ 16 bit thấp `0x00000304`).',
  },
  {
    id: 'it089-q5',
    sourceExam: 'IT089IU Midterm 2022',
    topic: 'mips',
    topicLabel: 'Thứ tự Byte (Big-Endian)',
    mindMapNodeId: 'cat-2-1-2',
    difficulty: 'Vận dụng',
    question:
      'Giả sử thanh ghi $t1 = `0xDEADBEEF` và $t2 = `0x00000000`. Sau khi thực thi lệnh `sw $t1, 0($t2)` trên kiến trúc MIPS chuẩn (Big-Endian), mẫu bit (giá trị byte) nằm tại địa chỉ ô nhớ `0x00000002` là gì?',
    codeSnippet: `sw $t1, 0($t2)   # $t1 = 0xDEADBEEF, $t2 = 0x00000000`,
    options: [
      '`0xBE` ($1011\\,1110_2$)',
      '`0xAD` ($1010\\,1101_2$)',
      '`0xEF` ($1110\\,1111_2$)',
      '`0xDE` ($1101\\,1110_2$)',
    ],
    correctIndex: 0,
    explanation:
      'Kiến trúc MIPS mặc định trong giáo trình và đề thi sử dụng **Big-Endian** (Byte có trọng số lớn nhất - MSB nằm ở địa chỉ thấp nhất):\n• Địa chỉ `0x00000000`: `0xDE`\n• Địa chỉ `0x00000001`: `0xAD`\n• Địa chỉ `0x00000002`: `0xBE`\n• Địa chỉ `0x00000003`: `0xEF`\nDo đó tại ô nhớ `0x00000002`, giá trị lưu trữ là `0xBE`.',
  },
  {
    id: 'co2007-q7-andi',
    sourceExam: 'CO2007 Exam',
    topic: 'mips',
    topicLabel: 'I-Format & Zero-Extension',
    mindMapNodeId: 'cat-2-1-2',
    difficulty: 'Cơ bản',
    question:
      'Thanh ghi $s0 đang chứa giá trị `0xFFFFCA16`. Để xóa 16 bit cao của $s0 về 0 và giữ nguyên 16 bit thấp (tạo thành `0x0000CA16`) chỉ bằng **1 lệnh MIPS duy nhất** (Câu 7 đề CO2007), ta dùng lệnh nào?',
    options: [
      '`andi $s0, $s0, 0xFFFF` (vì lệnh logic `andi` tự động Zero-Extend hằng số 16-bit thành `0x0000FFFF`)',
      '`addi $s0, $s0, 0x0000`',
      '`ori $s0, $zero, 0xFFFF`',
      '`sll $s0, $s0, 16`',
    ],
    correctIndex: 0,
    explanation:
      'Các lệnh logic tức thời trong MIPS (`andi, ori, xori`) sử dụng **Zero-Extension** (điền 16 bit `0` vào nửa cao của hằng số 16-bit), khác với `addi, lw, sw, beq` dùng Sign-Extension. Do đó `andi $s0, $s0, 0xFFFF` thực hiện phép AND giữa $s0 và `0x0000FFFF`, xóa sạch 16 bit cao về 0 và giữ nguyên `0xCA16`!',
    formulaUsed: '$\\text{ZeroExt}(\\texttt{0xFFFF}) = \\texttt{0x0000FFFF}$',
  },
  {
    id: 'co2007-q9-lb',
    sourceExam: 'CO2007 Exam',
    topic: 'mips',
    topicLabel: 'Truy xuất Byte & Mở rộng dấu',
    mindMapNodeId: 'cat-2-1-2',
    difficulty: 'Vận dụng',
    question:
      'Cho bản đồ ô nhớ MIPS: các địa chỉ $8, 9, 10, 11$ chứa (`0x12, 0x34, 0x56, 0x78`) và các địa chỉ $12, 13, 14, 15$ chứa (`0x9A, 0xBC, 0xDE, 0xF0`). Giả sử thanh ghi `$s0 = 8`. Giá trị của thanh ghi $t0 sau khi thực thi lệnh `lb $t0, 6($s0)` là bao nhiêu?',
    codeSnippet: `Address:   8     9    10    11    12    13    14    15
Value:   0x12  0x34  0x56  0x78  0x9A  0xBC  0xDE  0xF0

# Cho $s0 = 8. Thực thi:
lb $t0, 6($s0)`,
    options: [
      '`0xFFFFFFDE` (do `lb` mở rộng dấu Sign-Extend bit âm của `0xDE`)',
      '`0x000000DE` (mở rộng số 0)',
      '`0xDE000000`',
      '`0xFFFFFFBC`',
    ],
    correctIndex: 0,
    explanation:
      '• Địa chỉ truy xuất $= \\$s0 + 6 = 8 + 6 = 14$.\n• Ô nhớ tại địa chỉ $14$ chứa byte `0xDE` $= 1101\\,1110_2$.\n• Lệnh `lb` (Load Byte) tải 1 byte và **mở rộng dấu (Sign-Extension)** từ 8-bit lên 32-bit. Vì bit dấu (bit 7) của `0xDE` bằng $1$ (số âm), 24 bit cao của $t0 được điền toàn bộ bằng $1$ (`0xFFFFFF`).\n• Kết quả: $t0 = `0xFFFFFFDE`. (Nếu dùng lệnh `lbu` - Load Byte Unsigned thì kết quả mới là `0x000000DE`).',
  },
  {
    id: 'co2007-q11-div',
    sourceExam: 'CO2007 Exam',
    topic: 'mips',
    topicLabel: 'Phép Chia MIPS (HI / LO)',
    mindMapNodeId: 'cat-2-1-1',
    difficulty: 'Cơ bản',
    question:
      'Thực thi đoạn mã MIPS dưới đây (Câu 11–12 đề CO2007). Sau khi chạy xong, giá trị của $s0 và $s1 lần lượt là bao nhiêu?',
    codeSnippet: `lui  $t0, 0
ori  $t0, $t0, 7
lui  $t1, 0
ori  $t1, $t1, 2
div  $t0, $t1
mfhi $s0
mflo $s1`,
    options: [
      '`$s0 = 1` (số dư), `$s1 = 3` (thương số)',
      '`$s0 = 3` (thương số), `$s1 = 1` (số dư)',
      '`$s0 = 3.5`, `$s1 = 0`',
      '`$s0 = 14`, `$s1 = 0`',
    ],
    correctIndex: 0,
    explanation:
      '• Hai lệnh đầu gán `$t0 = 7`, hai lệnh tiếp theo gán `$t1 = 2`.\n• Lệnh `div $t0, $t1` lấy $7 \\div 2$: Thương nguyên ($\\text{Quotient} = 3$) được lưu vào thanh ghi **LO**, và Số dư ($\\text{Remainder} = 1$) được lưu vào thanh ghi **HI**.\n• `mfhi $s0` (Move From HI) đưa số dư vào `$s0` $\\rightarrow$ `$s0 = 1`.\n• `mflo $s1` (Move From LO) đưa thương số vào `$s1` $\\rightarrow$ `$s1 = 3`.',
  },
  {
    id: 'hw3-q3-multimeaning',
    sourceExam: 'HW3 Arithmetic',
    topic: 'mips',
    topicLabel: 'Giải mã J-Format (0x0C000000)',
    mindMapNodeId: 'cat-2-1-3',
    difficulty: 'Vận dụng',
    question:
      'Cho mẫu bit 32-bit `0x0C000000` (Bài 3 trong HW3.pdf). Nếu mẫu bit này được nạp vào Thanh ghi Lệnh (Instruction Register - IR) của bộ xử lý MIPS thì lệnh nào sẽ được thực thi, và nếu nó là số nguyên bù 2 thì giá trị thập phân là bao nhiêu?',
    options: [
      'Lệnh MIPS: `jal 0` (Jump and Link tới địa chỉ 0); Số nguyên bù 2 (và không dấu): $201{,}326{,}592$ (tức $3 \\times 2^{26}$)',
      'Lệnh MIPS: `j 0`; Số nguyên bù 2: $-201{,}326{,}592$',
      'Lệnh MIPS: `addi $zero, $zero, 0`; Số nguyên bù 2: $12{,}000{,}000$',
      'Lệnh MIPS: `beq $zero, $zero, 0`; Số nguyên bù 2: $67{,}108{,}864$',
    ],
    correctIndex: 0,
    explanation:
      '• Đổi `0x0C000000` sang nhị phân: $0000\\,1100\\,0000\\,0000\\,0000\\,0000\\,0000\\,0000_2$.\n• 6 bit đầu (Opcode, bits 31..26) là $000011_2 = 3_{10}$. Tra bảng MIPS Reference Card, $\\text{Opcode} = 3$ là lệnh **`jal`** (Jump and Link, định dạng J-format), và 26 bit địa chỉ bằng $0 \\rightarrow$ Lệnh `jal 0`.\n• Vì bit dấu $\\text{MSB} = 0$, cả dạng không dấu và bù 2 đều có giá trị dương: $2^{27} + 2^{26} = 3 \\times 2^{26} = \\mathbf{201{,}326{,}592}$.',
    formulaUsed: '$\\text{J-Format} = [\\text{op (6b)} \\mid \\text{address (26b)}]$',
  },

  // ==================== CHƯƠNG 3: SỐ HỌC MÁY TÍNH & IEEE 754 (cat-3) ====================
  {
    id: 'comp212-q3-twos',
    sourceExam: 'COMP 212 Midterm',
    topic: 'arithmetic',
    topicLabel: 'Số học Bù 2 & Overflow',
    mindMapNodeId: 'cat-3-1-2',
    difficulty: 'Vận dụng',
    question:
      'Cho hai số thập phân $A = 54$ và $B = -77$ trong biểu diễn bù 2 8-bit (8-bit Two’s Complement). Khi tính $A + B$ và $A - B$ trong hệ 8-bit, kết quả nào sau đây là chính xác?',
    options: [
      '$A = 0011\\,0110_2$, $B = 1011\\,0011_2$; $A + B = 1110\\,1001_2$ ($-23$, không tràn); $A - B = 1000\\,0011_2$ (bị tràn số - Overflow!)',
      '$A = 0011\\,0110_2$, $B = 1100\\,1101_2$; cả $A + B$ và $A - B$ đều không bị tràn số',
      '$A = 0011\\,0110_2$, $B = 1011\\,0011_2$; $A + B$ bị tràn số, còn $A - B = 131$ không bị tràn',
      '$A = 0101\\,0100_2$, $B = 1011\\,0011_2$; $A - B = 0100\\,1101_2$',
    ],
    correctIndex: 0,
    explanation:
      '• Đổi sang nhị phân 8-bit bù 2:\n  $A = +54 = 0011\\,0110_2$.\n  $+77 = 0100\\,1101_2 \\rightarrow$ Đảo bit: $1011\\,0010_2 \\rightarrow$ Cộng 1: $B = -77 = 1011\\,0011_2$.\n• Tính $A + B$: $0011\\,0110_2 + 1011\\,0011_2 = 1110\\,1001_2$ ($-23$). Hai toán hạng trái dấu nên tuyệt đối không tràn.\n• Tính $A - B = A + (-B) = 54 + 77 = 131$. Trong nhị phân: $0011\\,0110_2 + 0100\\,1101_2 = 1000\\,0011_2$. Vì cộng hai số dương ($\\text{MSB} = 0$) mà kết quả có bit dấu $\\text{MSB} = 1$ ($131 > 127$), phép tính **bị tràn số (Overflow)**!',
    formulaUsed: '$\\text{Range}_{8\\text{-bit}} = [-2^7, +2^7 - 1] = [-128, +127]$',
  },
  {
    id: 'comp212-q4-ieee',
    sourceExam: 'COMP 212 Midterm',
    topic: 'arithmetic',
    topicLabel: 'Số thực IEEE 754 (118.75)',
    mindMapNodeId: 'cat-3-1-3',
    difficulty: 'Vận dụng',
    question:
      'Tìm biểu diễn chuẩn $\\text{IEEE 754 Single Precision}$ (32-bit, $\\text{Bias} = 127$) của số thập phân $118.75$ (Câu 4.1 đề COMP 212):',
    options: [
      '$\\text{Sign} = 0$, $\\text{Biased Exponent} = 1000\\,0101_2$ ($133$), $\\text{Significand} = 11011011\\,000000000000000_2$',
      '$\\text{Sign} = 0$, $\\text{Biased Exponent} = 0000\\,0110_2$ ($6$), $\\text{Significand} = 11101101\\,100000000000000_2$',
      '$\\text{Sign} = 1$, $\\text{Biased Exponent} = 1000\\,0101_2$ ($133$), $\\text{Significand} = 11011011\\,000000000000000_2$',
      '$\\text{Sign} = 0$, $\\text{Biased Exponent} = 0111\\,1111_2$ ($127$), $\\text{Significand} = 11011011\\,000000000000000_2$',
    ],
    correctIndex: 0,
    explanation:
      '1) Số $118.75 > 0$ nên bit dấu $\\text{Sign} = 0$.\n2) Phần nguyên: $118 = 64 + 32 + 16 + 4 + 2 = 1110110_2$. Phần lẻ: $0.75 = 0.5 + 0.25 = 0.11_2$. Ghép lại: $118.75 = 1110110.11_2$.\n3) Chuẩn hóa (Normalize): Dịch dấu phẩy sang trái 6 vị trí $\\rightarrow 1.11011011_2 \\times 2^6$.\n4) Số mũ lệch ($\\text{Biased Exponent}$) $= 6 + 127 = 133 = 1000\\,0101_2$.\n5) Phần định trị (Significand / Fraction 23-bit, bỏ số $1.$ ẩn phía trước dấu phẩy): `11011011000000000000000`.',
    formulaUsed: '$E_{\\text{biased}} = E_{\\text{true}} + 127$',
  },
  {
    id: 'comp212-q4-2-frac',
    sourceExam: 'COMP 212 Midterm',
    topic: 'arithmetic',
    topicLabel: 'IEEE 754 Phân số âm (-5/128)',
    mindMapNodeId: 'cat-3-1-3',
    difficulty: 'Nâng cao',
    question:
      'Biểu diễn số thực âm $X = -\\left(\\dfrac{1}{32} + \\dfrac{1}{128}\\right) = -0.0390625$ sang chuẩn $\\text{IEEE 754 Single Precision}$ (Câu 4.2 đề COMP 212):',
    options: [
      '$\\text{Sign} = 1$, $\\text{Biased Exponent} = 0111\\,1010_2$ ($122$), $\\text{Fraction} = 01000000\\,000000000000000_2$',
      '$\\text{Sign} = 1$, $\\text{Biased Exponent} = 1000\\,0101_2$ ($133$), $\\text{Fraction} = 01000000\\,000000000000000_2$',
      '$\\text{Sign} = 0$, $\\text{Biased Exponent} = 0111\\,1010_2$ ($122$), $\\text{Fraction} = 10100000\\,000000000000000_2$',
      '$\\text{Sign} = 1$, $\\text{Biased Exponent} = 0111\\,1000_2$ ($120$), $\\text{Fraction} = 10000000\\,000000000000000_2$',
    ],
    correctIndex: 0,
    explanation:
      '1) Vì $X < 0$ nên $\\text{Sign} = 1$.\n2) Ta có $\\dfrac{1}{32} + \\dfrac{1}{128} = 2^{-5} + 2^{-7} = 2^{-5} \\times (1 + 2^{-2}) = 1.01_2 \\times 2^{-5}$.\n3) Số mũ thực $E_{\\text{true}} = -5 \\rightarrow E_{\\text{biased}} = -5 + 127 = 122 = 0111\\,1010_2$.\n4) Phần định trị 23-bit (bỏ $1.$ ẩn ở đầu $1.01_2$): `01000000000000000000000`.',
    formulaUsed: '$-(2^{-5} + 2^{-7}) = (-1)^1 \\times 1.01_2 \\times 2^{-5}$',
  },
  {
    id: 'co2007-q13-14-ieee',
    sourceExam: 'CO2007 Exam',
    topic: 'arithmetic',
    topicLabel: 'IEEE 754 Mã Hexa (6.25 & 12.625)',
    mindMapNodeId: 'cat-3-1-3',
    difficulty: 'Vận dụng',
    question:
      'Theo Câu 13 và Câu 14 đề CO2007, biểu diễn $\\text{IEEE 754 Single Precision}$ của hai số thực $6.25$ và $12.625$ lần lượt có dạng nhị phân / Hexa nào?',
    options: [
      '$6.25 = \\texttt{0x40C80000}$ ($E_{\\text{biased}} = 129$, $\\text{Frac} = .1001_2$); $12.625 = \\texttt{0x414A0000}$ ($E_{\\text{biased}} = 130$, $\\text{Frac} = .100101_2$)',
      '$6.25 = \\texttt{0x40880000}$; $12.625 = \\texttt{0x412A0000}$',
      '$6.25 = \\texttt{0xC0C80000}$; $12.625 = \\texttt{0xC14A0000}$',
      '$6.25 = \\texttt{0x3FC80000}$; $12.625 = \\texttt{0x404A0000}$',
    ],
    correctIndex: 0,
    explanation:
      '• Với $6.25 = 110.01_2 = 1.1001_2 \\times 2^2$: $S = 0$, $E_{\\text{biased}} = 2 + 127 = 129 = 1000\\,0001_2$, $\\text{Fraction} = 1001000\\dots_2 \\rightarrow 0100\\,0000\\,1100\\,1000\\,0000\\dots_2 = \\mathbf{\\texttt{0x40C80000}}$.\n• Với $12.625 = 1100.101_2 = 1.100101_2 \\times 2^3$: $S = 0$, $E_{\\text{biased}} = 3 + 127 = 130 = 1000\\,0010_2$, $\\text{Fraction} = 1001010\\dots_2 \\rightarrow 0100\\,0001\\,0100\\,1010\\,0000\\dots_2 = \\mathbf{\\texttt{0x414A0000}}$.',
    formulaUsed: '$\\text{IEEE 754 (32b)} = [S (1\\text{b}) \\mid E_{\\text{biased}} (8\\text{b}) \\mid \\text{Fraction} (23\\text{b})]$',
  },
  {
    id: 'fall2011-q1-5bit',
    sourceExam: 'Fall 2011 Midterm',
    topic: 'arithmetic',
    topicLabel: 'Trừ Bù 2 5-bit (-12 - 5)',
    mindMapNodeId: 'cat-3-1-2',
    difficulty: 'Vận dụng',
    question:
      'Trong hệ thống biểu diễn số nguyên bù 2 **5-bit** (5-bit Two’s Complement, Bài 1b đề Fall 2011), dải giá trị hợp lệ là bao nhiêu và kết quả phép tính $(-12) - 5$ như thế nào?',
    options: [
      'Dải giá trị $[-16, +15]$; phép tính $(-12) + (-5) = -17 < -16$ bị **Tràn số âm (Overflow)** vì hai toán hạng cùng âm ($10100_2 + 11011_2 = 01111_2$) nhưng kết quả mang dấu dương!',
      'Dải giá trị $[-15, +16]$; phép tính ra $-17$ hợp lệ không tràn số.',
      'Dải giá trị $[-32, +31]$; kết quả là $10001_2$ không tràn số.',
      'Dải giá trị $[0, 31]$; không biểu diễn được số âm.',
    ],
    correctIndex: 0,
    explanation:
      '• Với $n = 5$ bits bù 2, dải biểu diễn là $[-2^{4}, +2^{4}-1] = [-16, +15]$.\n• Đổi sang 5-bit bù 2: $-12 = 10100_2$ và $-5 = 11011_2$.\n• Cộng hai số âm: $10100_2 + 11011_2 = (1)01111_2$ ($+15$). Vì hai toán hạng cùng có bit dấu $\\text{MSB} = 1$ nhưng kết quả có $\\text{MSB} = 0$ (và $-17 \\notin [-16, +15]$), phép tính **bị tràn số (Overflow)**!',
    formulaUsed: '$\\text{Range}_{5\\text{-bit}} = [-2^4, +2^4 - 1] = [-16, +15]$',
  },
  {
    id: 'comp212-q2-unsigned',
    sourceExam: 'COMP 212 Midterm',
    topic: 'arithmetic',
    topicLabel: 'Số nguyên Không dấu (Unsigned)',
    mindMapNodeId: 'cat-3-1-1',
    difficulty: 'Cơ bản',
    question:
      'Với biểu diễn số nguyên không dấu 16-bit (16-bit Unsigned Integer, Câu 1.4 & Câu 2 đề COMP 212), dải giá trị biểu diễn và tính chất phân bố của các điểm dữ liệu trên trục số là gì?',
    options: [
      'Dải giá trị từ $0$ đến $65{,}535$ ($2^{16} - 1$), và các điểm dữ liệu phân bố **cách đều nhau (uniformly)** trên trục số thực.',
      'Dải giá trị từ $-32{,}768$ đến $+32{,}767$, phân bố dày đặc quanh số $0$.',
      'Dải giá trị từ $0$ đến $65{,}536$ ($2^{16}$), phân bố theo hàm mũ.',
      'Dải giá trị từ $-65{,}535$ đến $+65{,}535$.',
    ],
    correctIndex: 0,
    explanation:
      '• Với $n = 16$ bit không dấu, giá trị nhỏ nhất là $0$ và lớn nhất là $2^{16} - 1 = 65{,}535$.\n• Khoảng cách giữa hai số nguyên liên tiếp luôn bằng $1$, nên các số nguyên không dấu phân bố hoàn toàn **đều nhau (uniformly)** trên trục số (ngược lại với số thực dấu phẩy động IEEE 754 vốn phân bố dày gần $0$ và thưa dần ở số lớn).',
    formulaUsed: '$\\text{Range}_{\\text{Unsigned}} = [0,\\ 2^n - 1]$',
  },

  // ==================== CHƯƠNG 4: BỘ XỬ LÝ DATAPATH & PIPELINE (cat-4) ====================
  {
    id: 'co2007-q18-regbits',
    sourceExam: 'CO2007 Exam',
    topic: 'datapath',
    topicLabel: 'Cổng đọc Register File (5 bits)',
    mindMapNodeId: 'cat-4-1',
    difficulty: 'Cơ bản',
    question:
      'Trong sơ đồ đường dữ liệu MIPS đơn chu kỳ (Câu 18 đề CO2007), kích thước đường tín hiệu đi vào 2 cổng `Read register 1` và `Read register 2` của khối Thanh ghi (Registers) là bao nhiêu bit?',
    options: [
      '$5\\text{ bits}$ (tương ứng các trường `rs = Instruction[25:21]` và `rt = Instruction[20:16]` để định danh $2^5 = 32$ thanh ghi)',
      '$32\\text{ bits}$ (bằng chiều rộng dữ liệu của thanh ghi)',
      '$6\\text{ bits}$ (bằng kích thước trường Opcode)',
      '$16\\text{ bits}$ (bằng kích thước trường Immediate)',
    ],
    correctIndex: 0,
    explanation:
      'Kiến trúc MIPS32 có tổng cộng $32$ thanh ghi đa dụng (đánh số từ $0$ đến $31$). Để chọn 1 trong 32 thanh ghi cần đúng $\\log_2(32) = \\mathbf{5\\text{ bits}}$ địa chỉ thanh ghi (`Read register 1` nối với `Instruction[25:21]`, `Read register 2` nối với `Instruction[20:16]`). Ngõ ra dữ liệu `Read data 1, 2` mới rộng $32\\text{ bits}$.',
    formulaUsed: '$\\text{Register Address Bits} = \\log_2(32) = 5\\text{ bits}$',
  },
  {
    id: 'co2007-q22-control',
    sourceExam: 'CO2007 Exam',
    topic: 'datapath',
    topicLabel: 'Single-Cycle Datapath & Control',
    mindMapNodeId: 'cat-4-1',
    difficulty: 'Vận dụng',
    question:
      'Trên bộ xử lý MIPS đơn chu kỳ (Single-Cycle Datapath), khi lệnh `add $t0, $t1, $zero` đang thực thi thì bộ tín hiệu `(RegDst, ALUOp, ALUSrc)` có giá trị là gì? Và khi lệnh `lw $t0, 0($t1)` đang thực thi thì những tín hiệu nào bằng 0?',
    options: [
      'Với `add`: $\\text{RegDst} = 1, \\text{ALUOp} = 10, \\text{ALUSrc} = 0$. Với `lw`: các tín hiệu bằng $0$ là $\\text{RegDst, Branch, ALUOp (00), MemWrite}$.',
      'Với `add`: $\\text{RegDst} = 0, \\text{ALUOp} = 00, \\text{ALUSrc} = 1$. Với `lw`: $\\text{MemRead} = 0, \\text{RegWrite} = 0$.',
      'Với `add`: $\\text{RegDst} = 1, \\text{ALUOp} = 01, \\text{ALUSrc} = 0$. Với `lw`: $\\text{ALUSrc} = 0, \\text{MemtoReg} = 0$.',
      'Với `add`: $\\text{RegDst} = 0, \\text{ALUOp} = 10, \\text{ALUSrc} = 0$. Với `lw`: $\\text{RegDst} = 1, \\text{MemWrite} = 1$.',
    ],
    correctIndex: 0,
    explanation:
      '• Lệnh `add` thuộc định dạng **R-format**: Thanh ghi đích là `rd` (bits 15:11) nên $\\text{RegDst} = 1$; toán hạng thứ 2 của ALU lấy từ Read data 2 của Register File nên $\\text{ALUSrc} = 0$; ALU giải mã theo trường funct nên $\\text{ALUOp} = 10$.\n• Lệnh `lw` (Load Word): Ghi vào thanh ghi `rt` (bits 20:16) nên $\\text{RegDst} = 0$; không phải rẽ nhánh nên $\\text{Branch} = 0$; ALU thực hiện phép cộng tính địa chỉ nên $\\text{ALUOp} = 00$; chỉ đọc bộ nhớ chứ không ghi nên $\\text{MemWrite} = 0$.',
  },
  {
    id: 'co2007-q20-21-mux',
    sourceExam: 'CO2007 Exam',
    topic: 'datapath',
    topicLabel: 'Đường đi lệnh lw, beq & Khối MUX',
    mindMapNodeId: 'cat-4-1',
    difficulty: 'Vận dụng',
    question:
      'Theo Câu 20, 21 và 24 đề CO2007: Lệnh nào đi qua nhiều thành phần phần cứng nhất (quyết định chu kỳ xung nhịp Single-Cycle), những lệnh nào sử dụng tín hiệu `Zero` của ALU, và lệnh `add` đi qua bao nhiêu bộ dồn kênh (MUX)?',
    options: [
      'Lệnh dài nhất là `lw` (qua đủ 5 công đoạn); `beq` và `bne` dùng cờ `Zero` của ALU; lệnh `add` đi qua $4$ khối MUX (RegDst, ALUSrc, MemtoReg, Branch/PC).',
      'Lệnh dài nhất là `sw`; chỉ có `j` dùng cờ `Zero`; lệnh `add` đi qua $2$ khối MUX.',
      'Lệnh dài nhất là `add`; `lw` và `sw` dùng cờ `Zero`; lệnh `add` đi qua $5$ khối MUX.',
      'Lệnh dài nhất là `beq`; mọi lệnh R-format đều dùng cờ `Zero`.',
    ],
    correctIndex: 0,
    explanation:
      '• **Câu 20**: Lệnh `lw` kích hoạt cả 5 khối chính (Instruction Memory $\\rightarrow$ Registers $\\rightarrow$ ALU $\\rightarrow$ Data Memory $\\rightarrow$ Registers), nên đường đi của `lw` là đường tới hạn (critical path).\n• **Câu 21**: Các lệnh rẽ nhánh có điều kiện (`beq, bne`) trừ hai thanh ghi trong ALU và kiểm tra cờ `Zero` để quyết định nhảy.\n• **Câu 24**: Trong sơ đồ chuẩn có 5 khối MUX, khi thực thi `add` dữ liệu và địa chỉ PC đi qua 4 khối MUX (trừ trường hợp chỉ tính 3 MUX trên đường dữ liệu hoặc 4 MUX tính cả PC Branch MUX).',
  },
  {
    id: 'co2007-q25-pipeline',
    sourceExam: 'CO2007 Exam',
    topic: 'datapath',
    topicLabel: 'Pipeline Hazards & Forwarding',
    mindMapNodeId: 'cat-4-2-2',
    difficulty: 'Nâng cao',
    question:
      'Xét chuỗi 6 lệnh MIPS dưới đây bắt đầu nạp vào Pipeline 5 tầng ở chu kỳ 1 (Câu 25–27 đề CO2007). Hỏi có bao nhiêu xung đột dữ liệu (Data Hazards), và chuỗi lệnh cần bao nhiêu chu kỳ để hoàn tất khi KHÔNG có Forwarding so với khi CÓ Forwarding?',
    codeSnippet: `1. lw  $t0, 100($s0)
2. add $t0, $t0, $t1
3. sw  $t1, 100($t0)
4. add $t0, $t1, $t0
5. lw  $t1, 100($t0)
6. add $t0, $t0, $t1`,
    options: [
      'Có 5 Data Hazards; Không có Forwarding mất $18$ chu kỳ; Có Forwarding mất $12$ chu kỳ',
      'Có 3 Data Hazards; Không có Forwarding mất $14$ chu kỳ; Có Forwarding mất $10$ chu kỳ',
      'Có 5 Data Hazards; Không có Forwarding mất $16$ chu kỳ; Có Forwarding mất $10$ chu kỳ',
      'Có 4 Data Hazards; Không có Forwarding mất $15$ chu kỳ; Có Forwarding mất $12$ chu kỳ',
    ],
    correctIndex: 0,
    explanation:
      '• Phân tích 5 xung đột dữ liệu (RAW):\n  1) Lệnh 1 (`lw` $t0) $\\rightarrow$ Lệnh 2 (`add` dùng $t0): Load-Use hazard.\n  2) Lệnh 2 (`add` $t0) $\\rightarrow$ Lệnh 3 (`sw` dùng $t0 làm base).\n  3) Lệnh 2 (`add` $t0) $\\rightarrow$ Lệnh 4 (`add` dùng $t0).\n  4) Lệnh 4 (`add` $t0) $\\rightarrow$ Lệnh 5 (`lw` dùng $t0 làm base).\n  5) Lệnh 5 (`lw` $t1) $\\rightarrow$ Lệnh 6 (`add` dùng $t1): Load-Use hazard.\n• **Không có Forwarding**: Mỗi phụ thuộc giữa hai lệnh kế tiếp phải chèn 2 chu kỳ trễ ($4 \\times 2 = 8\\text{ stalls} \\rightarrow 6 + 4 + 8 = \\mathbf{18\\text{ chu kỳ}}$).\n• **Có Forwarding**: Chỉ còn 2 xung đột Load-Use (Lệnh $1 \\rightarrow 2$ và Lệnh $5 \\rightarrow 6$) mỗi chỗ bắt buộc phải stall 1 chu kỳ $\\rightarrow$ Tổng số chu kỳ $= 6 + 4 + 2 = \\mathbf{12\\text{ chu kỳ}}$!',
    formulaUsed: '$\\text{Total Cycles} = N + 4 + \\text{Stalls}$',
  },
  {
    id: 'co2007-q28-29-fwdunit',
    sourceExam: 'CO2007 Exam',
    topic: 'datapath',
    topicLabel: 'Tín hiệu Forwarding tại Chu kỳ 5',
    mindMapNodeId: 'cat-4-2-1',
    difficulty: 'Nâng cao',
    question:
      'Tiếp tục chuỗi 6 lệnh ở Câu 25 đề CO2007 (khi CÓ Forwarding): Tại **Chu kỳ 5 (Cycle 5)**, những lệnh nào đang hoạt động trong 5 tầng của Pipeline, và bộ điều khiển chuyển tiếp (Forwarding Unit) xuất giá trị `(ForwardA, ForwardB)` bằng bao nhiêu cho lệnh đang ở tầng EX?',
    options: [
      'Có 4 lệnh đang thực thi (Lệnh 1 ở WB, Lệnh 2 ở EX sau 1 stall, Lệnh 3 ở ID, Lệnh 4 ở IF); `ForwardA = 01` (nhận $t0 từ tầng MEM/WB của Lệnh 1) và `ForwardB = 00`.',
      'Có 5 lệnh đang thực thi; `ForwardA = 10` và `ForwardB = 01`.',
      'Có 3 lệnh đang thực thi; `ForwardA = 00` và `ForwardB = 00`.',
      'Có 4 lệnh đang thực thi; `ForwardA = 10` (từ EX/MEM) và `ForwardB = 10`.',
    ],
    correctIndex: 0,
    explanation:
      '• Vì Lệnh 1 (`lw $t0`) và Lệnh 2 (`add $t0, $t0, $t1`) gặp xung đột **Load-Use**, tại Chu kỳ 4 tầng EX bị chèn 1 bong bóng (Bubble/Stall).\n• Do đó tại **Chu kỳ 5**:\n  - Lệnh 1 đang ở tầng **WB** (`MEM/WB`).\n  - Lệnh 2 đang ở tầng **EX** (cần toán hạng thứ nhất `rs = $t0` vừa đọc xong từ RAM của Lệnh 1 ở `MEM/WB` $\\rightarrow$ **`ForwardA = 01`**, còn toán hạng thứ hai `rt = $t1` đọc bình thường từ Register File $\\rightarrow$ **`ForwardB = 00`**).\n  - Lệnh 3 đang ở tầng **ID** và Lệnh 4 mới vào tầng **IF** (tổng cộng 4 lệnh đang hoạt động).',
    formulaUsed: '$\\text{ForwardA} = 01\\text{ (từ MEM/WB)},\\ \\text{ForwardA} = 10\\text{ (từ EX/MEM)}$',
  },

  // ==================== CHƯƠNG 5: CACHE & BỘ NHỚ ẢO (cat-5) ====================
  {
    id: 'comp212-q1-tf',
    sourceExam: 'COMP 212 Midterm',
    topic: 'cache',
    topicLabel: 'SRAM vs DRAM & Von Neumann',
    mindMapNodeId: 'cat-5-2',
    difficulty: 'Cơ bản',
    question:
      'Trong các phát biểu sau từ Câu 1 đề Midterm COMP 212, phát biểu nào là ĐÚNG?',
    options: [
      'Kiến trúc Von Neumann lưu trữ cả dữ liệu (data) và lệnh (instructions) trong cùng một không gian bộ nhớ, và SRAM thường được dùng để chế tạo Cache.',
      'Thanh ghi (Register) được chế tạo bên trong bộ nhớ chính (Main Memory) trên bo mạch chủ.',
      'Dynamic RAM (DRAM) có thời gian truy cập nhanh hơn Static RAM (SRAM).',
      'Các điểm dữ liệu số thực dấu phẩy động (Floating-point) được phân bố cách đều nhau (uniformly) trên trục số thực.',
    ],
    correctIndex: 0,
    explanation:
      'Theo đáp án chuẩn COMP 212 Q1:\n• Thanh ghi nằm bên trong CPU, KHÔNG nằm trong Main Memory (Sai).\n• Kiến trúc Von Neumann dùng chung không gian bộ nhớ cho lệnh và dữ liệu (Đúng).\n• SRAM nhanh hơn nhưng đắt và tốn diện tích hơn DRAM nên dùng làm Cache; DRAM chậm hơn nhưng mật độ cao dùng làm Main Memory.\n• Số nguyên không dấu (unsigned integers) phân bố đều trên trục số, còn số thực dấu phẩy động (floating-point) tập trung dày đặc quanh $0$ và thưa dần khi số mũ lớn (không đều).',
  },
  {
    id: 'comp212-q6-cache',
    sourceExam: 'COMP 212 Midterm',
    topic: 'cache',
    topicLabel: 'Ánh xạ Cache (Direct vs 4-Way)',
    mindMapNodeId: 'cat-5',
    difficulty: 'Nâng cao',
    question:
      'Một hệ thống bộ nhớ chính có dung lượng $16\\text{ MB}$, địa chỉ hóa theo từng byte. Kích thước mỗi Block là $8\\text{ bytes}$. Bộ nhớ Cache có tổng dung lượng $512\\text{ KB}$. Hỏi nếu dùng Direct Mapping và 4-Way Set Associative thì số bit dành cho (Tag, Line/Set, Word/Offset) lần lượt là bao nhiêu?',
    options: [
      'Địa chỉ 24-bit. Direct-Mapped: $(5\\text{b Tag}, 16\\text{b Line}, 3\\text{b Word})$; 4-Way Set Associative: $(7\\text{b Tag}, 14\\text{b Set}, 3\\text{b Word})$',
      'Địa chỉ 24-bit. Direct-Mapped: $(8\\text{b Tag}, 13\\text{b Line}, 3\\text{b Word})$; 4-Way Set Associative: $(10\\text{b Tag}, 11\\text{b Set}, 3\\text{b Word})$',
      'Địa chỉ 32-bit. Direct-Mapped: $(13\\text{b Tag}, 16\\text{b Line}, 3\\text{b Word})$; 4-Way Set Associative: $(15\\text{b Tag}, 14\\text{b Set}, 3\\text{b Word})$',
      'Địa chỉ 24-bit. Direct-Mapped: $(7\\text{b Tag}, 14\\text{b Line}, 3\\text{b Word})$; 4-Way Set Associative: $(5\\text{b Tag}, 16\\text{b Set}, 3\\text{b Word})$',
    ],
    correctIndex: 0,
    explanation:
      '• Bộ nhớ chính $16\\text{ MB} = 2^{24}\\text{ bytes} \\rightarrow$ Địa chỉ gồm **$24\\text{ bits}$**.\n• Mỗi Block $= 8\\text{ bytes} = 2^3\\text{ bytes} \\rightarrow$ Trường chọn byte/word trong block cần **$3\\text{ bits}$**.\n• Tổng số dòng Cache (Cache Lines) $= \\dfrac{512\\text{ KB}}{8\\text{ B}} = \\dfrac{2^{19}}{2^3} = 2^{16} = 64\\text{K lines}$.\n  - **Direct Mapping**: Cần **$16\\text{ bits}$** cho Line, còn lại $24 - (16 + 3) = \\mathbf{5\\text{ bits}}$ cho Tag. Với địa chỉ `A1 = DB86E2h`, ta có $\\text{Tag} = \\texttt{1Bh}, \\text{Line} = \\texttt{70DCh}, \\text{Word} = \\texttt{2h}$.\n  - **4-Way Set Associative**: Số Set $= \\dfrac{64\\text{K}}{4} = 16\\text{K} = 2^{14}\\text{ sets} \\rightarrow$ Cần **$14\\text{ bits}$** cho Set, còn lại $24 - (14 + 3) = \\mathbf{7\\text{ bits}}$ cho Tag.',
    formulaUsed: '$N_{\\text{addr}} (24\\text{b}) = t_{\\text{Tag}} + s_{\\text{Index}} + b_{\\text{Offset}} (3\\text{b})$',
  },
  {
    id: 'co2007-q30-cachebits',
    sourceExam: 'CO2007 Exam',
    topic: 'cache',
    topicLabel: 'Dung lượng Bit thực tế của Cache',
    mindMapNodeId: 'cat-5',
    difficulty: 'Nâng cao',
    question:
      'Bộ nhớ chính có địa chỉ byte 32-bit. Một bộ nhớ đệm Cache có dung lượng dữ liệu $64\\text{ KB}$, mỗi block chứa $4\\text{ words}$ ($1\\text{ word} = 4\\text{ bytes}$). Nếu sử dụng Direct-Mapped Cache, trường Tag có bao nhiêu bit và tổng số bit bộ nhớ thực tế cần để xây dựng Cache này (gồm Data + Tag + Valid bit) là bao nhiêu?',
    options: [
      '$\\text{Tag} = 16\\text{ bits}$; Tổng số bit $= 593{,}920\\text{ bits}$ (tương đương $580\\text{ Kbits}$)',
      '$\\text{Tag} = 16\\text{ bits}$; Tổng số bit $= 524{,}288\\text{ bits}$ ($512\\text{ Kbits}$)',
      '$\\text{Tag} = 18\\text{ bits}$; Tổng số bit $= 602{,}112\\text{ bits}$ ($588\\text{ Kbits}$)',
      '$\\text{Tag} = 14\\text{ bits}$; Tổng số bit $= 643{,}072\\text{ bits}$ ($628\\text{ Kbits}$)',
    ],
    correctIndex: 0,
    explanation:
      '• Kích thước 1 Block $= 4\\text{ words} \\times 4\\text{ bytes/word} = 16\\text{ bytes} = 2^4\\text{ bytes} \\rightarrow \\text{Byte Offset} = \\mathbf{4\\text{ bits}}$ ($128\\text{ bits}$ dữ liệu/block).\n• Số lượng Block trong Cache $64\\text{ KB} = \\dfrac{2^{16}}{2^4} = 2^{12} = 4{,}096\\text{ blocks} \\rightarrow \\text{Index} = \\mathbf{12\\text{ bits}}$.\n• Số bit Tag $= 32 - 12 - 4 = \\mathbf{16\\text{ bits}}$.\n• Mỗi dòng Cache cần lưu: $1\\text{ bit Valid} + 16\\text{ bits Tag} + 128\\text{ bits Data} = 145\\text{ bits}$.\n• Tổng số bit phần cứng của Cache $= 4{,}096 \\times 145 = \\mathbf{593{,}920\\text{ bits}}$ ($= 580\\text{ Kbits}$).',
    formulaUsed: '$\\text{Total Bits} = \\text{Num Blocks} \\times (1_{\\text{Valid}} + t_{\\text{Tag}} + \\text{Data Bits})$',
  },
  {
    id: 'co2007-q38-40-multilevel',
    sourceExam: 'CO2007 Exam',
    topic: 'cache',
    topicLabel: 'CPI với Cache L1 & L2 (CO2007 Q38–40)',
    mindMapNodeId: 'cat-5-2',
    difficulty: 'Nâng cao',
    question:
      'Một bộ xử lý chạy ở xung nhịp $4\\text{ GHz}$ có $\\text{CPI}_{\\text{base}} = 1.0$ khi mọi truy cập đều Hit ở L1 Cache (Câu 38–40 đề CO2007). Tỷ lệ trượt L1 (L1 Miss Rate) là $2\\%$, thời gian truy cập RAM chính là $100\\text{ ns}$. Nếu bổ sung thêm L2 Cache có thời gian truy cập $5\\text{ ns}$ và tỷ lệ trượt toàn cục xuống RAM còn $0.5\\%$, thì $\\text{CPI}_{\\text{total}}$ giảm từ bao nhiêu xuống bao nhiêu?',
    options: [
      'Khi chỉ có L1: $\\text{CPI} = 9.0$; khi thêm L2: $\\text{CPI} = 3.4$ (tăng tốc gấp $9.0 / 3.4 \\approx 2.65$ lần)',
      'Khi chỉ có L1: $\\text{CPI} = 3.0$; khi thêm L2: $\\text{CPI} = 1.5$',
      'Khi chỉ có L1: $\\text{CPI} = 9.0$; khi thêm L2: $\\text{CPI} = 5.0$',
      'Khi chỉ có L1: $\\text{CPI} = 5.0$; khi thêm L2: $\\text{CPI} = 2.4$',
    ],
    correctIndex: 0,
    explanation:
      '• Đổi thời gian phạt (Miss Penalty) ra số chu kỳ xung nhịp ($4\\text{ GHz} = 4\\text{ cycles/ns}$):\n  - Phạt truy cập RAM: $\\text{Penalty}_{\\text{RAM}} = 100\\text{ ns} \\times 4\\text{ GHz} = \\mathbf{400\\text{ cycles}}$.\n  - Phạt truy cập L2: $\\text{Penalty}_{\\text{L2}} = 5\\text{ ns} \\times 4\\text{ GHz} = \\mathbf{20\\text{ cycles}}$.\n• **Chỉ có L1 Cache**: $\\text{CPI}_{\\text{1 cấp}} = 1.0 + 2\\% \\times 400 = 1.0 + 8.0 = \\mathbf{9.0}$.\n• **Có cả L1 và L2 Cache**: $\\text{CPI}_{\\text{2 cấp}} = 1.0 + (2\\% \\times 20) + (0.5\\% \\times 400) = 1.0 + 0.4 + 2.0 = \\mathbf{3.4}$.\n• Tỷ số tăng tốc: $\\dfrac{9.0}{3.4} \\approx \\mathbf{2.65}$ lần!',
    formulaUsed: '$\\text{CPI}_{\\text{total}} = \\text{CPI}_{\\text{base}} + \\text{MR}_{\\text{L1}} \\times P_{\\text{L2}} + \\text{MR}_{\\text{L2}} \\times P_{\\text{RAM}}$',
  },
  {
    id: 'fall2011-q7abc-locality',
    sourceExam: 'Fall 2011 Midterm',
    topic: 'cache',
    topicLabel: 'Nguyên lý Cục bộ, 3C Misses & Write Policy',
    mindMapNodeId: 'cat-5-1',
    difficulty: 'Cơ bản',
    question:
      'Theo Bài 7a, 7b, 7c đề Fall 2011, phát biểu nào phân biệt chính xác **Temporal vs Spatial Locality**, **3 loại Cache Miss (3Cs)** và **Write-Through vs Write-Back**?',
    options: [
      'Temporal là tái sử dụng cùng 1 địa chỉ vừa truy cập; Spatial là truy cập các địa chỉ lân cận trong cùng block; 3C gồm Compulsory (lần đầu), Capacity (Cache đầy), Conflict (trùng Set/Line); Write-Back chỉ ghi về RAM khi block bẩn (Dirty) bị thay thế.',
      'Temporal là truy cập các phần tử mảng liên tiếp; Write-Through chỉ ghi vào Cache mà không ghi vào RAM.',
      'Conflict Miss vẫn xảy ra ngay cả trong Fully Associative Cache.',
      'Compulsory Miss có thể loại bỏ hoàn toàn bằng cách tăng số Way của Cache.',
    ],
    correctIndex: 0,
    explanation:
      '• **Temporal Locality (Cục bộ thời gian)**: Dữ liệu vừa truy cập sẽ sớm được truy cập lại (ví dụ biến tổng, mã lệnh trong vòng lặp).\n• **Spatial Locality (Cục bộ không gian)**: Các ô nhớ có địa chỉ kế cận nhau sẽ sớm được truy cập (ví dụ duyệt mảng).\n• **3Cs**: *Compulsory* (cold miss khi mới nạp), *Capacity* (do dung lượng Cache nhỏ hơn working set), *Conflict* (do nhiều block ánh xạ trùng vào 1 Line/Set — không xảy ra ở Fully Associative).\n• **Write-Back**: Ghi vào Cache và bật `Dirty bit = 1`, tiết kiệm băng thông bộ nhớ hơn hẳn *Write-Through*.',
  },
  {
    id: 'fall2011-q6-vm',
    sourceExam: 'Fall 2011 Midterm',
    topic: 'cache',
    topicLabel: 'Bộ nhớ Ảo & Page Table',
    mindMapNodeId: 'cat-5-3',
    difficulty: 'Nâng cao',
    question:
      'Xét hệ thống bộ nhớ ảo (Virtual Memory) có địa chỉ ảo $40\\text{-bit}$ (byte addressable), kích thước trang (page size) là $16\\text{ KB}$, và địa chỉ vật lý $36\\text{-bit}$. Mỗi mục trong bảng trang (Page Table Entry - PTE) có thêm 4 bit điều khiển (valid, protection, dirty, use). Tổng số mục (entries) và chiều rộng mỗi PTE là bao nhiêu?',
    options: [
      'Số trang ảo $= 2^{26}$ ($64\\text{M}$ entries); mỗi PTE rộng $26\\text{ bits}$ ($22\\text{b PPN} + 4\\text{b}$ điều khiển) $\\rightarrow$ Tổng kích thước $= 2^{26} \\times 26\\text{ bits}$',
      'Số trang ảo $= 2^{24}$ ($16\\text{M}$ entries); mỗi PTE rộng $24\\text{ bits} \\rightarrow$ Tổng kích thước $= 2^{24} \\times 24\\text{ bits}$',
      'Số trang ảo $= 2^{26}$; mỗi PTE rộng $40\\text{ bits}$',
      'Số trang ảo $= 2^{22}$; mỗi PTE rộng $36\\text{ bits}$',
    ],
    correctIndex: 0,
    explanation:
      '• Kích thước trang $= 16\\text{ KB} = 2^{14}\\text{ bytes} \\rightarrow \\text{Page Offset} = \\mathbf{14\\text{ bits}}$.\n• Số bit Virtual Page Number ($\\text{VPN}$) $= 40 - 14 = \\mathbf{26\\text{ bits}} \\rightarrow$ Bảng trang có $2^{26}$ ($64\\text{ triệu}$) dòng (entries).\n• Số bit Physical Page Number ($\\text{PPN}$) $= 36 - 14 = \\mathbf{22\\text{ bits}}$.\n• Mỗi PTE chứa: $22\\text{ bits PPN} + 4\\text{ bits control} = \\mathbf{26\\text{ bits}}$ (tổng dung lượng bảng trang $= 2^{26} \\times 26\\text{ bits} = 208\\text{ MB}$).',
    formulaUsed: '$\\text{Page Table Entries} = 2^{\\text{Virtual Bits} - \\log_2(\\text{Page Size})}$',
  },
  {
    id: 'fall2011-q7f-tlb',
    sourceExam: 'Fall 2011 Midterm',
    topic: 'cache',
    topicLabel: 'Tương tác TLB - Page Table - Cache',
    mindMapNodeId: 'cat-5-3',
    difficulty: 'Vận dụng',
    question:
      'Tổ hợp sự kiện sau đây có thể xảy ra đồng thời trong một lần truy xuất bộ nhớ của CPU hay không? Vì sao?\n`TLB: Miss  |  Page Table: Miss  |  Cache: Hit`',
    options: [
      'KHÔNG THỂ xảy ra! Vì Page Table Miss có nghĩa là Page Fault (trang dữ liệu đang nằm ở đĩa cứng, chưa có trong RAM vật lý), nên dữ liệu đó không thể có mặt trong Cache.',
      'CÓ THỂ xảy ra nếu Cache sử dụng địa chỉ vật lý (Physically Indexed, Physically Tagged).',
      'CÓ THỂ xảy ra khi CPU vừa xóa TLB nhưng chưa xóa Cache.',
      'KHÔNG THỂ xảy ra vì hễ TLB Miss thì bắt buộc Page Table phải Hit.',
    ],
    correctIndex: 0,
    explanation:
      'Đây là câu hỏi bẫy kinh điển trong đề Fall 2011 (Câu 7f):\n• Khi **Page Table Miss** (tức là xảy ra **Page Fault**), trang bộ nhớ ảo được yêu cầu hoàn toàn chưa được nạp vào bộ nhớ vật lý (Main Memory / RAM).\n• Vì Cache chỉ lưu trữ bản sao của các khối dữ liệu đang nằm trong RAM vật lý, một trang không có trong RAM thì **tuyệt đối không thể có dữ liệu trong Cache** (Cache Hit là vô lý).',
  },

  // ==================== CHƯƠNG 6: THỦ TỤC STACK, ASSEMBLER & SPIM (cat-6 & cat-2-3) ====================
  {
    id: 'co2007-q8-stack',
    sourceExam: 'CO2007 Exam',
    topic: 'assembler',
    topicLabel: 'Thủ tục & Đẩy $ra vào Stack ($sp)',
    mindMapNodeId: 'cat-2-3-3',
    difficulty: 'Cơ bản',
    question:
      'Trong một thủ tục không lá (Non-leaf procedure) của MIPS, để lưu địa chỉ trả về $ra vào đỉnh ngăn xếp (Stack) trước khi gọi hàm con (Câu 8 đề CO2007), cặp lệnh nào sau đây là ĐÚNG?',
    codeSnippet: `# Cần PUSH $ra vào Stack (Stack phát triển từ địa chỉ cao xuống thấp):`,
    options: [
      '`addi $sp, $sp, -4` theo sau bởi `sw $ra, 0($sp)`',
      '`addi $sp, $sp, 4` theo sau bởi `sw $ra, 0($sp)`',
      '`lw $ra, 0($sp)` theo sau bởi `addi $sp, $sp, -4`',
      '`sw $ra, 4($sp)` theo sau bởi `addi $sp, $sp, 4`',
    ],
    correctIndex: 0,
    explanation:
      'Trong kiến trúc MIPS, ngăn xếp (**Stack**) phát triển từ **địa chỉ cao xuống địa chỉ thấp**.\n• Khi **PUSH** 1 thanh ghi (4 bytes) vào Stack: phải giảm con trỏ ngăn xếp `$sp` đi 4 trước (`addi $sp, $sp, -4`), rồi ghi giá trị vào đỉnh mới (`sw $ra, 0($sp)`).\n• Khi **POP** khỏi Stack: đọc dữ liệu ra trước (`lw $ra, 0($sp)`), rồi cộng trả lại 4 cho `$sp` (`addi $sp, $sp, 4`).',
    formulaUsed: '$\\text{Push Word}: \\$sp \\leftarrow \\$sp - 4;\\ \\text{Mem}[\\$sp] \\leftarrow \\text{Reg}$',
  },
  {
    id: 'nb-leaf-nonleaf',
    sourceExam: 'NotebookLM Mind Map',
    topic: 'assembler',
    topicLabel: 'Leaf vs Non-Leaf & Quy ước Thanh ghi',
    mindMapNodeId: 'cat-2-3-1',
    difficulty: 'Vận dụng',
    question:
      'Theo quy ước gọi thủ tục trong MIPS (Procedure Call Convention), những thanh ghi nào hàm được gọi (**Callee**) bắt buộc phải bảo toàn giá trị (lưu vào Stack nếu có sử dụng và khôi phục trước khi `jr $ra`)?',
    options: [
      'Các thanh ghi lưu `$s0 – $s7`, con trỏ ngăn xếp `$sp`, con trỏ khung `$fp`, và địa chỉ trả về `$ra` (nếu hàm đó gọi tiếp hàm khác).',
      'Các thanh ghi tạm `$t0 – $t9` và thanh ghi kết quả `$v0 – $v1`.',
      'Các thanh ghi đối số `$a0 – $a3` và thanh ghi `$at`.',
      'Chỉ duy nhất thanh ghi `$zero` và `$v0`.',
    ],
    correctIndex: 0,
    explanation:
      '• **Caller-saved (Không cần Callee bảo toàn)**: `$t0–$t9`, `$a0–$a3`, `$v0–$v1`.\n• **Callee-saved (Bắt buộc Callee bảo toàn)**: `$s0–$s7`, `$sp`, `$fp`, `$gp`, và `$ra` (đặc biệt trong *Non-leaf procedure* khi gọi `jal` lồng nhau sẽ ghi đè `$ra`).',
  },
  {
    id: 'co2007-q6-pseudo',
    sourceExam: 'CO2007 Exam',
    topic: 'assembler',
    topicLabel: 'Lệnh giả (Pseudo-instructions) & $at',
    mindMapNodeId: 'cat-6-1',
    difficulty: 'Cơ bản',
    question:
      'Trình hợp dịch (Assembler) dịch lệnh giả `li $v0, 10` (Load Immediate) và lệnh giả `blt $s0, $s1, LABEL` (Branch if Less Than) thành các lệnh phần cứng MIPS thực thụ nào (Câu 6 đề CO2007)?',
    options: [
      '`li $v0, 10` $\\rightarrow$ `addi $v0, $zero, 10` (hoặc `ori $v0, $zero, 10`); `blt $s0, $s1, LABEL` $\\rightarrow$ `slt $at, $s0, $s1` kết hợp `bne $at, $zero, LABEL`.',
      '`li $v0, 10` $\\rightarrow$ `lw $v0, 10($zero)`; `blt` là lệnh phần cứng có sẵn trong MIPS.',
      '`li $v0, 10` $\\rightarrow$ `sll $v0, $zero, 10`; `blt` dịch thành `beq $s0, $s1, LABEL`.',
      '`li $v0, 10` $\\rightarrow$ `lui $v0, 10`; `blt` dùng thanh ghi `$v0` làm trung gian.',
    ],
    correctIndex: 0,
    explanation:
      '• Phần cứng MIPS không có lệnh `li` hay `blt` trực tiếp.\n• Với hằng số 16-bit nhỏ như `10`, Assembler dịch `li $v0, 10` thành `addi $v0, $zero, 10` (hoặc `ori $v0, $zero, 10`).\n• Với `blt $s0, $s1, LABEL`, Assembler dùng thanh ghi dành riêng cho trình hợp dịch **`$at` (register 1)**: đặt `$at = 1` nếu `$s0 < $s1` bằng `slt $at, $s0, $s1`, sau đó nhảy bằng `bne $at, $zero, LABEL`.',
  },
  {
    id: 'nb-linker-spim',
    sourceExam: 'NotebookLM Mind Map',
    topic: 'assembler',
    topicLabel: 'Assembler, Linker & SPIM Syscall',
    mindMapNodeId: 'cat-6-3',
    difficulty: 'Cơ bản',
    question:
      'Trong trình mô phỏng SPIM/MARS và chuỗi công cụ biên dịch MIPS (Câu 3g đề IT089IU & Chương 6 Mind Map), vai trò của **Linker (Trình liên kết)** và đoạn lệnh `li $v0, 1` / `add $a0, $s2, $zero` / `syscall` là gì?',
    options: [
      'Linker ghép nối các tệp đối tượng (`.o`) và phân giải nhãn toàn cục (`.globl`) thành file thực thi; còn `syscall` với `$v0 = 1` sẽ in giá trị số nguyên trong `$a0` (tức `$s2`) ra màn hình.',
      'Linker dịch trực tiếp mã C sang hợp ngữ `.asm`; còn `$v0 = 1` dùng để thoát chương trình.',
      'Linker là bộ nhớ đệm trong CPU; còn `$v0 = 1` dùng để đọc một chuỗi ký tự từ bàn phím.',
      'Linker chỉ kiểm tra lỗi cú pháp; còn `$v0 = 10` dùng để in số nguyên trong `$a0`.',
    ],
    correctIndex: 0,
    explanation:
      '• **Chuỗi dịch**: `C Source` $\\rightarrow$ **Compiler** $\\rightarrow$ `Assembly (.s)` $\\rightarrow$ **Assembler** $\\rightarrow$ `Object File (.o)` $\\rightarrow$ **Linker** $\\rightarrow$ `Executable`.\n• **Bảng mã `syscall` SPIM/MARS**:\n  - `$v0 = 1`: Print Integer (in số nguyên trong `$a0`).\n  - `$v0 = 4`: Print String (in chuỗi tại địa chỉ `$a0`).\n  - `$v0 = 5`: Read Integer (trả về trong `$v0`).\n  - `$v0 = 10`: Exit (kết thúc chương trình).',
  },
];
