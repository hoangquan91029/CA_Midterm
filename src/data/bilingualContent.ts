import { MindMapNode } from './midtermContent';
import { QuizQuestion, QuizTopic } from './quizBank';

export type LanguageMode = 'bilingual' | 'vi' | 'en';

export interface BilingualGlossaryTerm {
  id: string;
  topic: QuizTopic;
  enTerm: string;
  viTerm: string;
  enDef: string;
  viDef: string;
  formulaOrCode?: string;
}

export const BILINGUAL_GLOSSARY: BilingualGlossaryTerm[] = [
  // Chapter 1: Performance
  {
    id: 'term-throughput',
    topic: 'performance',
    enTerm: 'Throughput (Bandwidth)',
    viTerm: 'Thông lượng hệ thống',
    enDef: 'Total amount of work (tasks/jobs) completed per unit of time. Directly improved by adding more processors/cores.',
    viDef: 'Tổng khối lượng công việc hoàn thành trong một đơn vị thời gian. Tăng trực tiếp khi gắn thêm nhiều bộ xử lý (cores).',
    formulaOrCode: '$\\text{Throughput} = \\text{Jobs} / \\text{Time}$',
  },
  {
    id: 'term-responsetime',
    topic: 'performance',
    enTerm: 'Response Time (Execution Time)',
    viTerm: 'Thời gian phản hồi / Thời gian thực thi',
    enDef: 'Total time required for the computer to complete a single task from start to finish.',
    viDef: 'Tổng thời gian cần thiết để hoàn thành một tác vụ đơn lẻ từ lúc bắt đầu đến lúc kết thúc.',
    formulaOrCode: '$\\text{Performance} = \\dfrac{1}{\\text{Execution Time}}$',
  },
  {
    id: 'term-cpi',
    topic: 'performance',
    enTerm: 'CPI (Clock Cycles Per Instruction)',
    viTerm: 'Số chu kỳ xung nhịp trung bình mỗi lệnh',
    enDef: 'Weighted average number of clock cycles each instruction takes to execute for a given program.',
    viDef: 'Trung bình cộng có trọng số của số chu kỳ xung nhịp mà mỗi lệnh tiêu tốn khi chạy chương trình.',
    formulaOrCode: '$\\text{CPI}_{\\text{avg}} = \\sum (\\text{CPI}_i \\times F_i)$',
  },
  {
    id: 'term-cputime',
    topic: 'performance',
    enTerm: 'CPU Execution Time',
    viTerm: 'Thời gian thực thi của CPU',
    enDef: 'Actual time the CPU spends computing a specific program (excluding I/O waiting time).',
    viDef: 'Thời gian thực tế CPU dành để thực thi chương trình (không tính thời gian chờ I/O).',
    formulaOrCode: '$\\text{CPU Time} = \\dfrac{\\text{IC} \\times \\text{CPI}}{\\text{Clock Rate}}$',
  },
  {
    id: 'term-powerwall',
    topic: 'performance',
    enTerm: 'Power Wall',
    viTerm: 'Bức tường Công suất & Nhiệt lượng',
    enDef: 'Physical thermal limit preventing further clock frequency scaling, driving the shift to Multicore.',
    viDef: 'Giới hạn vật lý về tản nhiệt ngăn cản việc tăng mãi tần số xung nhịp đơn nhân, thúc đẩy kiến trúc đa nhân.',
    formulaOrCode: '$P_{\\text{dynamic}} \\propto C \\times V^2 \\times f$',
  },

  // Chapter 2: MIPS
  {
    id: 'term-isa',
    topic: 'mips',
    enTerm: 'Instruction Set Architecture (ISA)',
    viTerm: 'Kiến trúc Tập lệnh',
    enDef: 'Abstract interface between hardware and the lowest-level software (registers, instructions, addressing modes).',
    viDef: 'Giao diện trừu tượng giữa phần cứng và phần mềm cấp thấp nhất (thanh ghi, tập lệnh, chế độ địa chỉ).',
    formulaOrCode: '`MIPS32 (32 registers, 32-bit words)`',
  },
  {
    id: 'term-signext',
    topic: 'mips',
    enTerm: 'Sign-Extension vs Zero-Extension',
    viTerm: 'Mở rộng dấu vs Mở rộng số 0',
    enDef: 'Sign-extension replicates bit 15 into upper 16 bits (`addi, lw, sw, lb, beq`). Zero-extension fills upper 16 bits with 0 (`andi, ori`).',
    viDef: 'Mở rộng dấu nhân bản bit 15 ra 16 bit cao (`addi, lw, sw, lb`). Mở rộng số 0 điền `0x0000` vào 16 bit cao (`andi, ori`).',
    formulaOrCode: '`andi $s0, $s0, 0xFFFF`',
  },
  {
    id: 'term-endian',
    topic: 'mips',
    enTerm: 'Big-Endian vs Little-Endian',
    viTerm: 'Thứ tự lưu Byte Lớn trước vs Nhỏ trước',
    enDef: 'Big-Endian stores the Most Significant Byte (MSB) at the lowest byte address (`0x00000000`).',
    viDef: 'Big-Endian lưu byte có trọng số lớn nhất (MSB) tại địa chỉ ô nhớ nhỏ nhất (`0x00000000`).',
    formulaOrCode: '`0xDEADBEEF -> [0]:DE, [1]:AD, [2]:BE, [3]:EF`',
  },
  {
    id: 'term-pcbranch',
    topic: 'mips',
    enTerm: 'PC-Relative Addressing',
    viTerm: 'Địa chỉ tương đối theo Bộ đếm chương trình PC',
    enDef: 'Branch target address computed by adding 4-byte shifted signed offset to (PC + 4).',
    viDef: 'Địa chỉ đích của lệnh rẽ nhánh (`beq, bne`) tính bằng cách lấy `PC + 4` cộng với độ lệch 16-bit đã nhân 4.',
    formulaOrCode: '$\\text{PC}_{\\text{branch}} = (\\text{PC}+4) + (\\text{SignExtImm} \\times 4)$',
  },

  // Chapter 3: Arithmetic
  {
    id: 'term-twoscomp',
    topic: 'arithmetic',
    enTerm: "Two's Complement Representation",
    viTerm: 'Biểu diễn Số nguyên Bù 2',
    enDef: 'Signed binary encoding where MSB has negative weight $-2^{n-1}$. Negation is computed by inverting bits and adding 1.',
    viDef: 'Biểu diễn số có dấu với bit cao nhất mang trọng số âm $-2^{n-1}$. Lấy số đối bằng cách đảo mọi bit rồi cộng $1$.',
    formulaOrCode: '$-X = \\overline{X} + 1,\\ \\text{Range} = [-2^{n-1}, 2^{n-1}-1]$',
  },
  {
    id: 'term-overflow',
    topic: 'arithmetic',
    enTerm: 'Arithmetic Overflow',
    viTerm: 'Hiện tượng Tràn số Số học',
    enDef: 'Occurs when adding two same-sign numbers yields a result with the opposite sign bit (exceeds representable range).',
    viDef: 'Xảy ra khi cộng hai số cùng dấu nhưng kết quả thu được lại có bit dấu ngược lại (vượt quá dải biểu diễn $n$-bit).',
    formulaOrCode: '$(\\text{MSB}_A = \\text{MSB}_B) \\land (\\text{MSB}_{\\text{Sum}} \\ne \\text{MSB}_A)$',
  },
  {
    id: 'term-ieee754',
    topic: 'arithmetic',
    enTerm: 'IEEE 754 Floating-Point Standard',
    viTerm: 'Chuẩn Số thực Dấu phẩy động IEEE 754',
    enDef: 'Normalized binary scientific notation using 1 Sign bit, 8 Biased Exponent bits (Bias = 127), and 23 Fraction bits (hidden 1).',
    viDef: 'Ký pháp khoa học nhị phân chuẩn hóa gồm 1 bit Dấu, 8 bit Số mũ lệch (Bias = 127) và 23 bit Phần định trị (ẩn bit 1 đầu).',
    formulaOrCode: '$(-1)^S \\times (1.\\text{Fraction})_2 \\times 2^{E_{\\text{biased}} - 127}$',
  },

  // Chapter 4: Datapath & Pipeline
  {
    id: 'term-criticalpath',
    topic: 'datapath',
    enTerm: 'Critical Path (Single-Cycle)',
    viTerm: 'Đường đi tới hạn (Đơn chu kỳ)',
    enDef: 'Longest delay path through hardware components, dictated by the `lw` instruction (IF -> ID -> EX -> MEM -> WB).',
    viDef: 'Đường truyền tín hiệu có độ trễ lớn nhất quyết định chu kỳ xung nhịp, thuộc về lệnh `lw` (qua đủ 5 công đoạn).',
    formulaOrCode: '$T_{\\text{cycle}} = T_{\\text{IF}} + T_{\\text{ID}} + T_{\\text{EX}} + T_{\\text{MEM}} + T_{\\text{WB}}$',
  },
  {
    id: 'term-forwarding',
    topic: 'datapath',
    enTerm: 'Forwarding (Bypassing)',
    viTerm: 'Kỹ thuật Nhìn trước / Chuyển tiếp dữ liệu',
    enDef: 'Resolves RAW data hazards by routing ALU/Memory results directly from `EX/MEM` or `MEM/WB` pipeline registers back to ALU inputs.',
    viDef: 'Khắc phục xung đột dữ liệu RAW bằng cách nối tắt kết quả từ thanh ghi tầng `EX/MEM` hoặc `MEM/WB` quay về ngõ vào ALU.',
    formulaOrCode: '`ForwardA = 10 (EX/MEM), 01 (MEM/WB)`',
  },
  {
    id: 'term-loaduse',
    topic: 'datapath',
    enTerm: 'Load-Use Data Hazard & Pipeline Stall',
    viTerm: 'Xung đột Tải-Dùng & Chèn chu kỳ trễ (Bubble)',
    enDef: 'When an instruction immediately uses data loaded by a preceding `lw`, 1 stall cycle (NOP bubble) is mandatory even with forwarding.',
    viDef: 'Khi lệnh ngay sau dùng thanh ghi vừa được tải bởi lệnh `lw` liền trước, bắt buộc phải chèn 1 chu kỳ trễ (Stall) kể cả khi có Forwarding.',
    formulaOrCode: '$\\text{Total Cycles} = N + 4 + \\text{Stalls}$',
  },

  // Chapter 5: Cache & Virtual Memory
  {
    id: 'term-locality',
    topic: 'cache',
    enTerm: 'Temporal vs Spatial Locality',
    viTerm: 'Tính Cục bộ về Thời gian vs Không gian',
    enDef: 'Temporal: recently accessed items are likely accessed again soon. Spatial: items near recently accessed addresses are likely accessed soon.',
    viDef: 'Thời gian: mục dữ liệu vừa dùng sẽ sớm được dùng lại. Không gian: các ô nhớ lân cận địa chỉ vừa truy cập sẽ sớm được đọc.',
    formulaOrCode: '`Loop counter -> Temporal | Array scan -> Spatial`',
  },
  {
    id: 'term-3cmisses',
    topic: 'cache',
    enTerm: 'The 3Cs of Cache Misses',
    viTerm: '3 Nguyên nhân Trượt Cache (3Cs)',
    enDef: 'Compulsory (cold start first access), Capacity (cache too small for working set), Conflict (multiple blocks map to same set/line).',
    viDef: 'Compulsory (truy cập lần đầu), Capacity (Cache quá nhỏ), Conflict (nhiều khối nhớ đụng độ tại cùng 1 Line/Set).',
    formulaOrCode: '`Fully Associative eliminates Conflict Misses`',
  },
  {
    id: 'term-writepolicy',
    topic: 'cache',
    enTerm: 'Write-Through vs Write-Back',
    viTerm: 'Chính sách Ghi xuyên vs Ghi trả sau',
    enDef: 'Write-Through updates both Cache and RAM immediately. Write-Back updates only Cache (sets Dirty bit = 1) and writes to RAM on eviction.',
    viDef: 'Write-Through ghi đồng thời vào Cache và RAM. Write-Back chỉ ghi vào Cache (bật Dirty bit = 1) và chỉ ghi về RAM khi khối bị đẩy ra.',
    formulaOrCode: '`Write-Back uses Dirty Bit`',
  },
  {
    id: 'term-tlb',
    topic: 'cache',
    enTerm: 'TLB & Page Fault (Virtual Memory)',
    viTerm: 'Bộ đệm Dịch địa chỉ TLB & Lỗi trang',
    enDef: 'TLB caches recent VPN-to-PPN translations. A Page Fault occurs when Valid=0 in Page Table (page resides on disk, not in RAM).',
    viDef: 'TLB lưu đệm các cặp dịch trang ảo sang trang vật lý. Page Fault xảy ra khi trang chưa có trong RAM vật lý (phải đọc từ đĩa từ).',
    formulaOrCode: '`Page Table Miss => Cache Hit is IMPOSSIBLE`',
  },

  // Chapter 6: Procedures, Assembler & SPIM
  {
    id: 'term-leaf',
    topic: 'assembler',
    enTerm: 'Leaf vs Non-Leaf Procedure',
    viTerm: 'Thủ tục Lá vs Thủ tục Không lá (Đệ quy)',
    enDef: 'A Leaf procedure calls no other procedures. A Non-Leaf procedure calls other procedures and must save `$ra` onto the Stack (`$sp`).',
    viDef: 'Thủ tục lá không gọi hàm nào khác. Thủ tục không lá có gọi hàm khác (hoặc đệ quy) nên bắt buộc phải lưu `$ra` vào ngăn xếp Stack.',
    formulaOrCode: '`addi $sp, $sp, -4` / `sw $ra, 0($sp)`',
  },
  {
    id: 'term-calleesaved',
    topic: 'assembler',
    enTerm: 'Caller-Saved vs Callee-Saved Registers',
    viTerm: 'Thanh ghi bảo toàn bởi Hàm gọi vs Hàm được gọi',
    enDef: 'Caller-saved (`$t0-$t9, $a0-$a3, $v0-$v1`) are not preserved across calls. Callee-saved (`$s0-$s7, $sp, $ra`) must be restored before `jr $ra`.',
    viDef: 'Caller-saved (`$t0-$t9, $a0-$a3`) được dùng tự do. Callee-saved (`$s0-$s7, $sp, $ra`) bắt buộc hàm con phải khôi phục trước khi `jr $ra`.',
    formulaOrCode: '`Saved: $s0-$s7, $sp, $fp, $ra`',
  },
  {
    id: 'term-pseudo',
    topic: 'assembler',
    enTerm: 'Pseudo-instructions & Assembler Temporary ($at)',
    viTerm: 'Lệnh giả Hợp ngữ & Thanh ghi tạm $at',
    enDef: 'Assembly macros (`li, la, move, blt`) expanded by the Assembler into real hardware MIPS instructions using register `$at` ($1).',
    viDef: 'Các lệnh viết tắt (`li, la, move, blt`) được Assembler dịch sang lệnh phần cứng thực thụ nhờ thanh ghi tạm `$at` (thanh ghi số 1).',
    formulaOrCode: '`blt $s0,$s1,L -> slt $at,$s0,$s1 + bne $at,$0,L`',
  },
];

export const MINDMAP_EN_CONTENT: Record<
  string,
  { enSummary: string; enExamTip?: string }
> = {
  root: {
    enSummary: `### Midterm Exam Scope Overview (English & Vietnamese Bilingual Edition)
Comprehensive synthesis of the **6 core Computer Architecture pillars** extracted from the **NotebookLM Mind Map (155 sources)** and the **Google Drive Exam Repository** (*IT089IU VNUHCM*, *CO2007 HCMUT*, *COMP 212*):
- **Chapter 1 — Computer Abstractions & Performance**: Moore's Law, Response Time vs. Throughput, $\\text{Clock Cycles}$, $\\text{CPI}_{\\text{avg}}$, and $\\text{CPU Time} = \\dfrac{\\text{Cycles}}{\\text{Clock Rate}}$.
- **Chapter 2 — MIPS Instruction Set Architecture**: 32-bit instruction formats (\`R, I, J\`), translating C constructs (\`if-else, while\`, arrays) to MIPS assembly, and Stack management (\`$sp\`).
- **Chapter 3 — Computer Arithmetic**: Unsigned integers, Two's Complement signed numbers, Overflow detection, and $\\text{IEEE 754}$ floating-point representation.
- **Chapter 4 — Processor Datapath & Pipelining**: Single-Cycle control unit truth table, 5-Stage Pipeline (\`IF, ID, EX, MEM, WB\`), Data/Control Hazards, and Forwarding.
- **Chapter 5 — Memory Hierarchy**: Principle of Locality, Cache mapping ($\\text{Tag} / \\text{Index} / \\text{Offset}$), 3C Misses, Write policies, and Virtual Memory (*Page Table, TLB*).
- **Chapter 6 — Assemblers, Linkers & SPIM**: Translation hierarchy (\`C -> Assembly -> Object -> Executable\`), pseudo-instructions (\`$at\`), and SPIM \`syscall\` services.`,
  },
  'cat-1': {
    enSummary: `### CPU Performance Equations & Quantitative Evaluation
Every performance problem on the midterm revolves around the fundamental relationship between **Instruction Count ($\\text{IC}$)**, **Clock Cycles Per Instruction ($\\text{CPI}$)**, and **Clock Rate ($f$)**:

| Metric | Symbol | Standard Mathematical Formula | Unit |
| :--- | :--- | :--- | :--- |
| **Total Clock Cycles** | $\\text{Cycles}$ | $\\displaystyle \\sum_{i=1}^{n} (\\text{IC}_i \\times \\text{CPI}_i)$ | $\\text{cycles}$ |
| **Average CPI** | $\\text{CPI}_{\\text{avg}}$ | $\\dfrac{\\text{Total Cycles}}{\\text{Total IC}} = \\displaystyle \\sum_{i=1}^{n} (\\text{CPI}_i \\times F_i)$ | $\\text{cycles / instruction}$ |
| **CPU Execution Time** | $\\text{CPU Time}$ | $\\dfrac{\\text{Cycles}}{\\text{Clock Rate}} = \\text{Cycles} \\times T_{\\text{cycle}}$ | Seconds ($\\text{s}$) or $\\text{ms}$ |
| **Relative Speedup** | $\\text{Speedup}$ | $\\dfrac{\\text{Time}_{\\text{old}}}{\\text{Time}_{\\text{new}}} = \\dfrac{\\text{Performance}_{\\text{new}}}{\\text{Performance}_{\\text{old}}}$ | Ratio ($\\times$) |

> **Standard Exam Unit Conversions**: $1\\text{ GHz} = 10^9\\text{ Hz (cycles/s)}$, $1\\text{ MHz} = 10^6\\text{ Hz}$, $1\\text{ ms} = 10^{-3}\\text{ s}$, $1\\text{ }\\mu\\text{s} = 10^{-6}\\text{ s}$, $1\\text{ ns} = 10^{-9}\\text{ s}$.`,
    enExamTip: `### Exam Strategy for IT089IU Q1 (30 pts) & Fall 2011 Q3:
- **Step 1**: Find the instruction count for each class: $I_k = F_k \\times \\text{IC}_{\\text{total}}$.
- **Step 2**: Sum the total clock cycles: $\\text{Clock Cycles} = \\sum (I_k \\times \\text{CPI}_k)$.
- **Step 3**: Compute $\\text{CPU Time} = \\dfrac{\\text{Clock Cycles}}{\\text{Clock Rate}}$. The processor with the **smaller CPU Time** has higher performance (never judge by CPI or GHz alone!).`,
  },
  'cat-1-1': {
    enSummary: `### Moore's Law & Response Time vs. Throughput
- **Moore's Law**: Integrated circuit resources (transistor count on a chip) **double every 18–24 months** (approximately every two years).
- **Two Core Performance Metrics (CO2007 Q1)**:
  - **Response Time (Execution Time)**: How long it takes to complete a single task.
  - **Throughput (Bandwidth)**: Total work completed per unit time. Adding more processors/cores to a system directly increases **Throughput**.`,
    enExamTip: 'CO2007 Exam Q1: "If we add more current processors into the system, is Throughput or Response Time affected directly?" → Answer: **Throughput**.',
  },
  'cat-1-1-1': {
    enSummary: `- Smaller transistors shorten signal propagation paths and historically enabled higher clock rates.
- However, modern processors hit the **Power Wall** because dynamic CMOS power scales with voltage squared and frequency:
$$P_{\\text{dynamic}} \\propto C_{\\text{load}} \\times V^2 \\times f$$
This forced the industry to transition from aggressive single-core frequency scaling to **Multicore** architectures.`,
  },
  'cat-1-2': {
    enSummary: `### 3-Step Workflow for Comparing Two Implementations (P1 vs. P2)
When two processors **P1** and **P2** implement the same ISA and run the same compiled binary, their **Instruction Count ($\\text{IC}$)** is identical:
1. Compute total cycles: $\\text{Cycles} = \\text{IC} \\times \\sum (F_i \\times \\text{CPI}_i)$.
2. Divide by each processor's clock rate to find $\\text{CPU Time} = \\dfrac{\\text{Cycles}}{f}$.
3. Performance ratio: **P2 is $n$ times faster than P1** if $\\dfrac{\\text{Time}_{\\text{P1}}}{\\text{Time}_{\\text{P2}}} = n > 1$.`,
    enExamTip: 'If an exam problem asks to reduce the CPI of Floating-Point (FP) instructions to achieve a $1.5\\times$ overall speedup (CO2007 Q4), set $\\text{Cycles}_{\\text{new}} = \\dfrac{\\text{Cycles}_{\\text{old}}}{1.5}$ while keeping other instruction classes unchanged. If the required reduction exceeds all FP cycles combined, it is **impossible** (Amdahl’s Law).',
  },
  'cat-1-2-1': {
    enSummary: `- **Cycle-time form**: $T_{\\text{CPU}} = \\text{IC} \\times \\text{CPI} \\times T_{\\text{cycle}}$
- **Clock-rate form**: $T_{\\text{CPU}} = \\dfrac{\\text{IC} \\times \\text{CPI}}{f_{\\text{clock}}}$
- The three factors depend on: Hardware technology & organization ($f_{\\text{clock}}$), Microarchitecture & datapath ($\text{CPI}$), and ISA + Compiler optimization ($\\text{IC}$).`,
  },
  'cat-1-2-2': {
    enSummary: `- Different instruction classes (Arithmetic, Load/Store, Branch, Floating-Point) require different numbers of clock cycles $\\text{CPI}_i$.
- Total processor clock cycles: $\\text{Clock Cycles} = \\sum_{i=1}^{n} (\\text{IC}_i \\times \\text{CPI}_i)$.`,
  },
  'cat-1-2-3': {
    enSummary: `- The effective (average) CPI is the weighted sum of each class's $\\text{CPI}_i$ multiplied by its dynamic instruction frequency $F_i$.
- IT089IU Set 01 Example: $\\text{CPI}_{\\text{P1}} = 0.2 \\times 3 + 0.1 \\times 3 + 0.4 \\times 1 + 0.3 \\times 2 = 1.9$.`,
  },
  'cat-2': {
    enSummary: `### MIPS32 Instruction Set Architecture (32 Registers & Fixed 32-Bit Encoding)
- **Design Principles**: *Simplicity favors regularity (fixed 32-bit instruction width)*, *Smaller is faster (32 registers)*, and *Load-Store architecture (only \`lw, sw, lb, sb\` access memory)*.

| Format | 32-Bit Field Layout (Bit 31 $\\rightarrow$ Bit 0) | Representative Instructions |
| :--- | :--- | :--- |
| **R-Format** | \`[ op (6b) | rs (5b) | rt (5b) | rd (5b) | shamt (5b) | funct (6b) ]\` | \`add, sub, and, or, slt, sll, srl, jr\` ($\\text{op} = 0$) |
| **I-Format** | \`[ op (6b) | rs (5b) | rt (5b) | immediate / offset (16b) ]\` | \`lw, sw, lb, addi, andi, ori, slti, beq, bne\` |
| **J-Format** | \`[ op (6b) | target address (26b) ]\` | \`j\` ($\\text{op} = 2$), \`jal\` ($\\text{op} = 3$) |`,
    enExamTip: `### Golden Rules for C-to-MIPS Translation (Worth 60% of IT089IU Midterm):
1. **32-bit Integer Array Indexing (\`int A[]\`)**: Always multiply the index by $4$ using a 2-bit left shift (\`sll $t0, $s0, 2\`) before adding the base address (\`add $t0, $s3, $t0\`).
2. **Translating \`if (i == j)\`**: Branch on the **opposite** condition to jump to \`ELSE\` (\`bne $s0, $s1, ELSE\`), and always place \`j EXIT\` at the end of the \`then\` block!`,
  },
  'cat-2-1': {
    enSummary: `### Decoding the Three 32-Bit MIPS Instruction Formats
- Because MIPS has $32$ general-purpose registers ($0$ to $31$), every register specifier field (\`rs, rt, rd\`) requires exactly **$5\\text{ bits}$** ($2^5 = 32$).
- This directly answers **CO2007 Q18**: *"What is the bit width of the Read Register 1 and Read Register 2 inputs?"* $\\rightarrow$ **$5\\text{ bits}$**.`,
  },
  'cat-2-1-1': {
    enSummary: `- **\`op\` (6b)**: Always \`000000\` ($0$) for all R-format instructions.
- **\`rs\` (5b) & \`rt\` (5b)**: First and second source register operands.
- **\`rd\` (5b)**: Destination register receiving the ALU result ($\\text{RegDst} = 1$).
- **\`shamt\` (5b)**: Shift amount ($0..31$) used in \`sll, srl, sra\`.
- **\`funct\` (6b)**: Selects the exact ALU operation (\`add = 0x20, sub = 0x22, and = 0x24, or = 0x25, slt = 0x2A\`).`,
  },
  'cat-2-1-2': {
    enSummary: `- **Destination Register**: Writes to \`rt\` (bits 20:16, control signal $\\text{RegDst} = 0$) instead of \`rd\`.
- **Sign-Extension**: Used by arithmetic, memory, and branch instructions (\`addi, lw, sw, lb, slti, beq, bne\`) — copies bit 15 into bits 31..16.
- **Zero-Extension**: Used by bitwise logical immediate instructions (\`andi, ori, xori\`) — pads bits 31..16 with \`0x0000\`.`,
    enExamTip: 'CO2007 Q7: To clear the upper 16 bits of `$s0 = 0xFFFFCA16` into `0x0000CA16` in a single instruction, use `andi $s0, $s0, 0xFFFF` because `andi` automatically zero-extends its 16-bit immediate!',
  },
  'cat-2-1-3': {
    enSummary: `- Consists of a **6-bit Opcode** (\`j\` $= 2$, \`jal\` $= 3$) and a **26-bit word target address**.
- At execution, the full 32-bit Jump target $\\text{PC}$ is formed by concatenating: **upper 4 bits of $(\\text{PC} + 4)$** + **26-bit \`address\` field** + **\`00\` (shifted left by 2 bits)**.`,
    enExamTip: 'HW3 Problem 3: Machine code `0x0C000000` has upper 6 bits `000011` ($\\text{op} = 3$) and a 26-bit address of $0$ $\\rightarrow$ Disassembles to `jal 0`!',
  },
  'cat-2-2': {
    enSummary: `### MIPS Assembly Program Structure & Directives
- **\`.data\`**: Declares static variables and arrays in memory (e.g., \`MemArray: .word 1, 2, 3, 4\`).
- **\`.text\`**: Contains executable machine instructions starting at \`0x00400000\`.
- **\`.globl main\`**: Exports the \`main\` label globally so the linker and SPIM/MARS simulator can locate the entry point.`,
  },
  'cat-2-3': {
    enSummary: `### 6 Steps of Procedure Call Execution in MIPS
1. **Caller** places arguments in \`$a0 – $a3\`.
2. **Caller** executes \`jal Label\` (hardware saves return address $\\text{PC} + 4$ into \`$ra\`).
3. **Callee** allocates a Stack frame (decrements \`$sp\`) and saves preserved registers (\`$ra, $s0–$s7\`).
4. **Callee** executes the procedure body.
5. **Callee** places return values in \`$v0 – $v1\`, restores saved registers from Stack, and increments \`$sp\`.
6. **Callee** returns to the caller via \`jr $ra\`.`,
  },
  'cat-3': {
    enSummary: `### Integer & IEEE 754 Floating-Point Representations
| Representation | Value Range ($n$-bit) | Mathematical Rule & Properties |
| :--- | :--- | :--- |
| **Unsigned Integer** | $0 \\rightarrow 2^n - 1$ | All bits carry positive weight. Uniformly spaced on the number line. |
| **Two's Complement** | $-2^{n-1} \\rightarrow +2^{n-1} - 1$ | MSB is sign bit ($0$: non-negative, $1$: negative). Negation: $\\overline{X} + 1$. |
| **IEEE 754 Single (32-bit)** | \`1b Sign | 8b Exp | 23b Frac\` | $(-1)^S \\times (1.\\text{Fraction})_2 \\times 2^{\\,\\text{Exp} - 127}$ ($\\text{Bias} = 127$). |
| **IEEE 754 Double (64-bit)** | \`1b Sign | 11b Exp | 52b Frac\` | $(-1)^S \\times (1.\\text{Fraction})_2 \\times 2^{\\,\\text{Exp} - 1023}$ ($\\text{Bias} = 1023$). |`,
    enExamTip: `### Two's Complement Overflow Detection Rule:
- Adding two numbers with **different signs**: Overflow can **NEVER** occur.
- Adding two numbers with the **same sign** ($0 + 0$ or $1 + 1$): **Overflow** occurs if and only if the **result's sign bit (MSB) differs from the operands' sign bit**!`,
  },
  'cat-4': {
    enSummary: `### Single-Cycle Datapath Control Truth Table & 5-Stage Pipeline (CO2007 Q18–29)

| Instruction | RegDst | ALUSrc | MemtoReg | RegWrite | MemRead | MemWrite | Branch | ALUOp |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **R-format (\`add\`)** | \`1\` | \`0\` | \`0\` | \`1\` | \`0\` | \`0\` | \`0\` | \`10\` |
| **Load (\`lw\`)** | \`0\` | \`1\` | \`1\` | \`1\` | \`1\` | \`0\` | \`0\` | \`00\` |
| **Store (\`sw\`)** | \`X\` | \`1\` | \`X\` | \`0\` | \`0\` | \`1\` | \`0\` | \`00\` |
| **Branch (\`beq\`)** | \`X\` | \`0\` | \`X\` | \`0\` | \`0\` | \`0\` | \`1\` | \`01\` |`,
    enExamTip: `### Fast Pipeline Cycle Counting Rule (CO2007 Q25–29):
- **Total cycles for $N$ instructions**: $\\text{Total Cycles} = N + 4 + \\text{Stalls}$.
- **Without Forwarding**: Any adjacent RAW dependency requires **2 stall cycles**.
- **With Forwarding**: ALU-to-ALU dependencies require **0 stalls**. Only a **Load-Use Hazard** (\`lw $t0\` immediately followed by an instruction reading \`$t0\`) requires **1 mandatory stall cycle**!`,
  },
  'cat-5': {
    enSummary: `### Physical Address Partitioning & Total Cache Hardware Bits
When the CPU accesses an **$N$-bit** byte address, the address is partitioned into 3 fields:

| Address Field | Bit Width Formula | Hardware Meaning |
| :--- | :--- | :--- |
| **Byte Offset (Word)** | $b = \\log_2(\\text{Block Size in Bytes})$ | Selects the specific byte/word within a Cache Block. |
| **Index (Line / Set)** | $s = \\log_2(\\text{Num Sets}) = \\log_2\\!\\left(\\dfrac{\\text{Cache Size}}{\\text{Block Size} \\times k}\\right)$ | Selects the Cache Line (*Direct-Mapped*, $k=1$) or Set ($k$-Way). For *Fully Associative*, $s = 0$. |
| **Tag Field** | $t = N - s - b$ | Identifies the memory block to verify Hit vs. Miss. |`,
    enExamTip: `### Multi-Level Cache Effective CPI Formula (CO2007 Q38–40):
- **Single-Level L1 Cache**: $\\text{CPI}_{\\text{total}} = \\text{CPI}_{\\text{base}} + (\\text{Miss Rate}_{\\text{L1}} \\times \\text{Penalty}_{\\text{RAM}})$.
- **Two-Level L1 + L2 Cache**: $\\text{CPI}_{\\text{total}} = \\text{CPI}_{\\text{base}} + (\\text{Miss Rate}_{\\text{L1}} \\times \\text{Penalty}_{\\text{L2}}) + (\\text{Miss Rate}_{\\text{L2}} \\times \\text{Penalty}_{\\text{RAM}})$.
- Convert access latency to clock cycles via: $\\text{Penalty (cycles)} = \\text{Access Time (ns)} \\times f_{\\text{CPU}}\\text{ (GHz)}$.`,
  },
  'cat-6': {
    enSummary: `### MIPS Translation Hierarchy & SPIM System Calls
\`C Source (.c)\` $\\rightarrow$ **[Compiler]** $\\rightarrow$ \`Assembly (.s/.asm)\` $\\rightarrow$ **[Assembler]** $\\rightarrow$ \`Object File (.o)\` $\\rightarrow$ **[Linker]** $\\rightarrow$ \`Executable (a.out)\` $\\rightarrow$ **[Loader / SPIM]** $\\rightarrow$ \`Memory\`.

| Register \`$v0\` Code | SPIM / MARS \`syscall\` Service | Argument / Result Register |
| :--- | :--- | :--- |
| **\`$v0 = 1\`** | **Print Integer** | Prints integer value stored in **\`$a0\`**. |
| **\`$v0 = 4\`** | **Print String** | Prints null-terminated string (\`.asciiz\`) at address **\`$a0\`**. |
| **\`$v0 = 5\`** | **Read Integer** | Returns user input integer in **\`$v0\`**. |
| **\`$v0 = 10\`** | **Exit Program** | Terminates execution cleanly. |`,
  },
};

export function getNodeEnContent(node: MindMapNode): {
  enSummary: string;
  enExamTip?: string;
} {
  if (MINDMAP_EN_CONTENT[node.id]) {
    return MINDMAP_EN_CONTENT[node.id];
  }
  const topPrefix = node.id.split('-').slice(0, 2).join('-'); // e.g. cat-1
  const fallbackParent = MINDMAP_EN_CONTENT[topPrefix];
  return {
    enSummary: `### ${node.name}\n- **Vietnamese Topic**: ${node.viTitle}\n- **Core Concept**: This sub-topic belongs to **${node.name}** in the NotebookLM Computer Architecture curriculum. Refer to the mathematical equations below and use the interactive quiz station to practice both English and Vietnamese exam questions.${
      fallbackParent ? `\n\n---\n${fallbackParent.enSummary}` : ''
    }`,
    enExamTip: fallbackParent?.enExamTip,
  };
}

export const CURATED_QUIZ_EN_MAP: Record<
  string,
  {
    enTopicLabel: string;
    enQuestion: string;
    enOptions: string[];
    enExplanation: string;
  }
> = {
  'it089-q1a': {
    enTopicLabel: 'Total Clock Cycles',
    enQuestion:
      'Consider two different implementations P1 ($2.5\\text{ GHz}$) and P2 ($3.0\\text{ GHz}$) of the same ISA running a program with $10{,}000{,}000$ ($10^7$) instructions divided into 4 classes: $20\\%$ class A, $10\\%$ class B, $40\\%$ class C, and $30\\%$ class D. The CPIs for (A, B, C, D) on P1 are $(3, 3, 1, 2)$ and on P2 are $(2, 1, 2, 3)$. How many total clock cycles does the program take on P1 and P2?',
    enOptions: [
      'P1: $19 \\times 10^6$ cycles; P2: $22 \\times 10^6$ cycles',
      'P1: $22 \\times 10^6$ cycles; P2: $19 \\times 10^6$ cycles',
      'P1: $18 \\times 10^6$ cycles; P2: $20 \\times 10^6$ cycles',
      'P1: $25 \\times 10^6$ cycles; P2: $30 \\times 10^6$ cycles',
    ],
    enExplanation:
      'Instruction counts per class: $I_A = 2 \\times 10^6$, $I_B = 1 \\times 10^6$, $I_C = 4 \\times 10^6$, $I_D = 3 \\times 10^6$.\n• $\\text{Clock Cycles}_{\\text{P1}} = 3(2 \\times 10^6) + 3(1 \\times 10^6) + 1(4 \\times 10^6) + 2(3 \\times 10^6) = \\mathbf{19 \\times 10^6\\text{ cycles}}$.\n• $\\text{Clock Cycles}_{\\text{P2}} = 2(2 \\times 10^6) + 1(1 \\times 10^6) + 2(4 \\times 10^6) + 3(3 \\times 10^6) = \\mathbf{22 \\times 10^6\\text{ cycles}}$.',
  },
  'it089-q1bc': {
    enTopicLabel: 'Average CPI & CPU Time',
    enQuestion:
      'Continuing Question 1 from IT089IU Midterm (P1: $2.5\\text{ GHz}$, $19 \\times 10^6\\text{ cycles}$; P2: $3.0\\text{ GHz}$, $22 \\times 10^6\\text{ cycles}$, total $10^7$ instructions). What is the average $\\text{CPI}$ for each implementation, and which implementation is faster?',
    enOptions: [
      '$\\text{CPI}_{\\text{P1}} = 1.9$, $\\text{CPI}_{\\text{P2}} = 2.2$; P2 is faster than P1 ($7.33\\text{ ms}$ vs. $7.60\\text{ ms}$)',
      '$\\text{CPI}_{\\text{P1}} = 1.9$, $\\text{CPI}_{\\text{P2}} = 2.2$; P1 is faster than P2 because P1 has a lower CPI',
      '$\\text{CPI}_{\\text{P1}} = 2.2$, $\\text{CPI}_{\\text{P2}} = 1.9$; P2 is faster than P1',
      'Both processors have identical execution time ($7.50\\text{ ms}$)',
    ],
    enExplanation:
      '• $\\text{CPI}_{\\text{P1}} = \\dfrac{19 \\times 10^6}{10 \\times 10^6} = \\mathbf{1.9}$ and $\\text{CPI}_{\\text{P2}} = \\dfrac{22 \\times 10^6}{10 \\times 10^6} = \\mathbf{2.2}$.\n• $\\text{CPU Time}_{\\text{P1}} = \\dfrac{19 \\times 10^6}{2.5 \\times 10^9} = \\mathbf{7.60\\text{ ms}}$.\n• $\\text{CPU Time}_{\\text{P2}} = \\dfrac{22 \\times 10^6}{3.0 \\times 10^9} = \\mathbf{7.33\\text{ ms}}$.\nEven though P2 has a higher CPI ($2.2 > 1.9$), its higher $3.0\\text{ GHz}$ clock rate enables P2 to finish in less time ($7.33\\text{ ms} < 7.60\\text{ ms}$).',
  },
  'co2007-q1-moore': {
    enTopicLabel: "Moore's Law & Throughput",
    enQuestion:
      "According to Moore's Law and CPU performance evaluation principles (CO2007 Q1), which statement is TRUE when we add more identical processors/cores to a computer system?",
    enOptions: [
      "System Throughput (Bandwidth) increases directly; meanwhile, Moore's Law states transistor density doubles every 18–24 months.",
      'Single-threaded Response Time (Execution Time) is immediately cut in half.',
      'Clock Cycle Time automatically decreases in proportion to the number of CPU cores.',
      'The Instruction Count (IC) of a sequential program is reduced by half.',
    ],
    enExplanation:
      "• **Moore's Law**: Transistor count on an integrated circuit doubles every 18–24 months.\n• **Throughput vs. Response Time** (CO2007 Q1): Adding more processors increases the total number of tasks completed in parallel per unit time (**Throughput**), without speeding up a single sequential task's response time.",
  },
  'co2007-q3-4-fp': {
    enTopicLabel: 'CPI Optimization & Amdahl’s Law',
    enQuestion:
      'A program running on a $2\\text{ GHz}$ processor consists of 4 instruction classes: FP ($20 \\times 10^6$ instr, $\\text{CPI} = 2$), INT ($120 \\times 10^6$ instr, $\\text{CPI} = 1$), Load/Store ($50 \\times 10^6$ instr, $\\text{CPI} = 3$), and Branch ($25 \\times 10^6$ instr, $\\text{CPI} = 4$) (CO2007 Q3–4). What is the initial total cycle count, and can we achieve a $1.5\\times$ overall speedup solely by reducing the CPI of FP instructions?',
    enOptions: [
      'Initial cycles $= 410 \\times 10^6$; IMPOSSIBLE to achieve a $1.5\\times$ speedup by only reducing FP CPI (since FP instructions only account for $40 \\times 10^6$ cycles total).',
      'Initial cycles $= 410 \\times 10^6$; achieved by reducing FP CPI from $2$ to $1$.',
      'Initial cycles $= 380 \\times 10^6$; achieved by reducing FP CPI to $0.5$.',
      'Initial cycles $= 215 \\times 10^6$; achieved if $\\text{CPI}_{\\text{FP}} = 1$.',
    ],
    enExplanation:
      '• Initial cycles: $\\text{Cycles}_{\\text{old}} = (20\\times 2 + 120\\times 1 + 50\\times 3 + 25\\times 4) \\times 10^6 = (40 + 120 + 150 + 100) \\times 10^6 = \\mathbf{410 \\times 10^6\\text{ cycles}}$.\n• A $1.5\\times$ speedup requires reducing total cycles to $\\dfrac{410}{1.5} \\approx 273.3 \\times 10^6$ cycles (a reduction of $136.7 \\times 10^6$ cycles).\n• Because all FP instructions together only consume $40 \\times 10^6$ cycles, even $\\text{CPI}_{\\text{FP}} = 0$ leaves $370 \\times 10^6$ cycles (**Amdahl’s Law**).',
  },
  'fall2011-q3-m1m2': {
    enTopicLabel: 'Comparing M1 (3.5 GHz) vs M2 (4.5 GHz)',
    enQuestion:
      'Two machines M1 ($3.5\\text{ GHz}$) and M2 ($4.5\\text{ GHz}$) implement the same ISA (Fall 2011 Q3). For a benchmark with $10\\%$ class A, $35\\%$ class B, $25\\%$ class C, and $30\\%$ class D, the CPIs on M1 are $(1, 2, 3, 4)$ and on M2 are $(2, 2, 4, 4)$. What are the average CPIs and relative performance on this benchmark?',
    enOptions: [
      '$\\text{CPI}_{\\text{M1}} = 2.75$, $\\text{CPI}_{\\text{M2}} = 3.10$; M2 is still faster than M1 by $\\approx 1.14\\times$',
      '$\\text{CPI}_{\\text{M1}} = 2.50$, $\\text{CPI}_{\\text{M2}} = 3.00$; M1 is faster than M2 by $1.20\\times$',
      '$\\text{CPI}_{\\text{M1}} = 2.75$, $\\text{CPI}_{\\text{M2}} = 3.10$; M1 is faster than M2 due to lower CPI',
      '$\\text{CPI}_{\\text{M1}} = 3.10$, $\\text{CPI}_{\\text{M2}} = 2.75$; M2 is faster than M1 by $1.45\\times$',
    ],
    enExplanation:
      '• $\\text{CPI}_{\\text{M1}} = 0.1(1) + 0.35(2) + 0.25(3) + 0.30(4) = \\mathbf{2.75}$.\n• $\\text{CPI}_{\\text{M2}} = 0.1(2) + 0.35(2) + 0.25(4) + 0.30(4) = \\mathbf{3.10}$.\n• Execution time ratio: $\\dfrac{T_{\\text{M1}}}{T_{\\text{M2}}} = \\dfrac{2.75 / 3.5}{3.10 / 4.5} \\approx \\mathbf{1.14}$. Thus M2 is $1.14\\times$ faster than M1.',
  },
  'nb-powerwall': {
    enTopicLabel: 'The Power Wall & Multicore Shift',
    enQuestion:
      'Why did the microprocessor industry shift from continuously increasing single-core clock frequency to designing Multicore processors?',
    enOptions: [
      'Dynamic power $P \\propto C \\times V^2 \\times f$ caused heat dissipation to hit the cooling limit (Power Wall) as frequency $f$ scaled up.',
      'The number of transistors per chip started decreasing every two years.',
      'SRAM cache memory cannot operate above $1\\text{ GHz}$.',
      'The MIPS instruction set architecture restricts clock rates to at most $3.0\\text{ GHz}$.',
    ],
    enExplanation:
      'CMOS dynamic power follows $P_{\\text{dynamic}} \\propto C_{\\text{load}} \\times V^2 \\times f$. Because supply voltage $V$ could no longer be lowered without excessive leakage current, raising $f$ further hit the **Power Wall**, forcing designers to place multiple cores on a chip to scale **Throughput**.',
  },
  'it089-q2a': {
    enTopicLabel: 'C-to-MIPS Translation (if-else)',
    enQuestion:
      'Assume integer variables `i, j, k` are assigned to registers `$s0, $s1, $s2` and the base address of integer array `A` is in `$s3`. Which MIPS sequence accurately translates the C `if-else` statement below (IT089IU Q2a)?',
    enOptions: [
      '`bne $s0, $s1, ELSE` -> `sll $t0, $s2, 2` -> `add $t0, $s3, $t0` -> `lw $t0, 0($t0)` -> `addi $t0, $t0, 1` -> store into `A[i]` then `j EXIT`',
      '`beq $s0, $s1, ELSE` -> `lw $t0, $s2($s3)` -> `addi $t0, $t0, 1` -> `sw $t0, $s0($s3)`',
      '`bne $s0, $s1, ELSE` -> `add $t0, $s3, $s2` -> `lw $t0, 0($t0)` -> `addi $t0, $t0, 1` (without shifting left by 2)',
      '`slt $t0, $s0, $s1` -> `bne $t0, $zero, ELSE` -> `lw $t1, 4($s3)`',
    ],
    enExplanation:
      '1) Test the opposite condition to branch to `ELSE`: `bne $s0, $s1, ELSE`.\n2) Since each 32-bit `int` occupies $4\\text{ bytes}$, multiply index `k` (`$s2`) by 4 via `sll $t0, $s2, 2`, add base address `$s3` (`add $t0, $s3, $t0`), load `lw $t0, 0($t0)`, and add 1 (`addi $t0, $t0, 1`).\n3) Compute `&A[i]` similarly, store via `sw`, and jump over `ELSE` using `j EXIT`.',
  },
  'it089-q2b': {
    enTopicLabel: 'C-to-MIPS Translation (while loop)',
    enQuestion:
      'Given `i` in `$s0`, `j` in `$s1`, `k` in `$s2`, and `base(A)` in `$s3`, which MIPS assembly code properly implements the C `while` loop below (IT089IU Q2b)?',
    enOptions: [
      '`LOOP: beq $s0, $s1, EXIT` / `addi $s0, $s0, 1` / `sub $t0, $s2, $s0` / `sll $t0, $t0, 2` / `add $t0, $s3, $t0` / `sw $zero, 0($t0)` / `j LOOP` / `EXIT:`',
      '`LOOP: bne $s0, $s1, EXIT` / `addi $s0, $s0, 1` / `sub $t0, $s2, $s0` / `sw $zero, 0($t0)` / `j LOOP` / `EXIT:`',
      '`LOOP: beq $s0, $s1, EXIT` / `sub $t0, $s2, $s0` / `addi $s0, $s0, 1` / `sll $t0, $t0, 2` / `sw $zero, 0($s3)`',
      '`LOOP: beq $s0, $s1, EXIT` / `addi $s0, $s0, 4` / `sub $t0, $s2, $s0` / `add $t0, $s3, $t0` / `sw $zero, 0($t0)` / `j LOOP`',
    ],
    enExplanation:
      '• Exit the loop when $i == j$: `beq $s0, $s1, EXIT`.\n• Increment $i$: `addi $s0, $s0, 1`.\n• Compute index $k - i$: `sub $t0, $s2, $s0`.\n• Multiply index by 4 for byte offset: `sll $t0, $t0, 2`, add base `$s3`: `add $t0, $s3, $t0`, store 0 via `sw $zero, 0($t0)`, and repeat with `j LOOP`.',
  },
  'it089-q3-trace': {
    enTopicLabel: 'Tracing MIPS Array Loop',
    enQuestion:
      'Consider the MIPS assembly program from IT089IU Question 3 (40 points), where `$t1` represents `i`, `$s2` represents `result`, and `$s0` points to `MemArray`. How many iterations does `LOOP` execute, and what are the final values of `i` (`$t1`) and `result` (`$s2`)?',
    enOptions: [
      'Executes 4 iterations; final values: $i = 9$, $\\text{result} = 10$ (prints 10)',
      'Executes 4 iterations; final values: $i = 8$, $\\text{result} = 10$',
      'Executes 5 iterations; final values: $i = 11$, $\\text{result} = 15$',
      'Executes 8 iterations; final values: $i = 9$, $\\text{result} = 36$',
    ],
    enExplanation:
      'Tracing each iteration (Initially $i = 1, \\text{result} = 0$, `$s0 = &MemArray[0]`):\n• Iter 1: loads $1$, $i = 3$, $\\text{result} = 1$ ($3 < 9 \\rightarrow$ continue).\n• Iter 2: loads $2$, $i = 5$, $\\text{result} = 3$ ($5 < 9 \\rightarrow$ continue).\n• Iter 3: loads $3$, $i = 7$, $\\text{result} = 6$ ($7 < 9 \\rightarrow$ continue).\n• Iter 4: loads $4$, $i = 9$, $\\text{result} = 10$ ($9 < 9$ is false $\\rightarrow$ exit loop!).\nTotal: **4 iterations**, final $i = 9$, final $\\text{result} = 10$.',
  },
  'it089-q4': {
    enTopicLabel: 'MIPS Bitwise Operations',
    enQuestion:
      'Suppose `$t0 = 0xAAAAAAAA` and `$t1 = 0x01020304`. According to the official IT089IU Midterm Answer Key (Question 4), what is the value of `$t2` after executing the three instructions below?',
    enOptions: [
      '`0xA1020304`',
      '`0x00000304`',
      '`0xAA020304`',
      '`0x0102030A`',
    ],
    enExplanation:
      '1) `sll $t2, $t0, 28`: Shifts `0xAAAAAAAA` left by 28 bits (7 hex digits), moving the lowest hex digit `A` to bits 31..28 $\\rightarrow$ `$t2 = 0xA0000000`.\n2) `or $t2, $t2, $t1`: `0xA0000000 | 0x01020304 = 0xA1020304`.\n3) `andi $t2, $t2, -1`: Treating $-1$ as all ones (`0xFFFFFFFF`) preserves all 32 bits $\\rightarrow$ `0xA1020304`.',
  },
  'it089-q5': {
    enTopicLabel: 'Big-Endian Byte Ordering',
    enQuestion:
      'Assume `$t1 = 0xDEADBEEF` and `$t2 = 0x00000000`. After executing `sw $t1, 0($t2)` on a Big-Endian MIPS processor (IT089IU Q5), what byte value is stored at memory address `0x00000002`?',
    enOptions: [
      '`0xBE` ($1011\\,1110_2$)',
      '`0xAD` ($1010\\,1101_2$)',
      '`0xEF` ($1110\\,1111_2$)',
      '`0xDE` ($1101\\,1110_2$)',
    ],
    enExplanation:
      'In **Big-Endian** byte ordering, the Most Significant Byte (MSB) is placed at the lowest byte address:\n• `0x00000000`: `0xDE`\n• `0x00000001`: `0xAD`\n• `0x00000002`: `0xBE`\n• `0x00000003`: `0xEF`\nThus address `0x00000002` holds `0xBE`.',
  },
  'co2007-q7-andi': {
    enTopicLabel: 'I-Format & Zero-Extension',
    enQuestion:
      'Register `$s0` currently holds `0xFFFFCA16`. Which **single MIPS instruction** clears the upper 16 bits of `$s0` to 0 while keeping the lower 16 bits intact (`0x0000CA16`) (CO2007 Q7)?',
    enOptions: [
      '`andi $s0, $s0, 0xFFFF` (because logical immediate `andi` zero-extends the 16-bit immediate to `0x0000FFFF`)',
      '`addi $s0, $s0, 0x0000`',
      '`ori $s0, $zero, 0xFFFF`',
      '`sll $s0, $s0, 16`',
    ],
    enExplanation:
      'Logical immediate instructions (`andi, ori, xori`) perform **Zero-Extension** on the 16-bit immediate field, producing `0x0000FFFF`. Bitwise AND with `0x0000FFFF` clears bits 31..16 to 0 and preserves `0xCA16`.',
  },
  'co2007-q9-lb': {
    enTopicLabel: 'Load Byte (lb) & Sign-Extension',
    enQuestion:
      'Given the MIPS byte memory map below and `$s0 = 8`, what is the 32-bit hex value in `$t0` after executing `lb $t0, 6($s0)` (CO2007 Q9)?',
    enOptions: [
      '`0xFFFFFFDE` (because `lb` sign-extends the negative MSB of byte `0xDE`)',
      '`0x000000DE` (zero-extended)',
      '`0xDE000000`',
      '`0xFFFFFFBC`',
    ],
    enExplanation:
      '• Effective byte address $= \\$s0 + 6 = 8 + 6 = 14$, which contains `0xDE` ($1101\\,1110_2$).\n• `lb` (Load Byte) sign-extends bit 7 ($1$) into the upper 24 bits (`0xFFFFFF`), yielding `0xFFFFFFDE`.',
  },
  'co2007-q11-div': {
    enTopicLabel: 'MIPS Integer Division (HI / LO)',
    enQuestion:
      'After executing the MIPS assembly sequence below (CO2007 Q11–12), what are the decimal values in registers `$s0` and `$s1`?',
    enOptions: [
      '`$s0 = 1` (remainder in HI), `$s1 = 3` (quotient in LO)',
      '`$s0 = 3` (quotient), `$s1 = 1` (remainder)',
      '`$s0 = 3.5`, `$s1 = 0`',
      '`$s0 = 14`, `$s1 = 0`',
    ],
    enExplanation:
      '• `$t0 = 7` and `$t1 = 2`.\n• `div $t0, $t1` computes $7 \\div 2$: Quotient ($3$) is stored in **LO** and Remainder ($1$) is stored in **HI**.\n• `mfhi $s0` moves the remainder into `$s0 = 1`; `mflo $s1` moves the quotient into `$s1 = 3`.',
  },
  'hw3-q3-multimeaning': {
    enTopicLabel: 'Decoding J-Format Bit Pattern (0x0C000000)',
    enQuestion:
      'Given the 32-bit binary pattern `0x0C000000` (HW3 Problem 3), what MIPS instruction does it represent if loaded into the Instruction Register (IR), and what is its decimal value as a 32-bit two’s complement integer?',
    enOptions: [
      'MIPS Instruction: `jal 0` (Jump and Link to target 0); Two’s complement integer: $201{,}326{,}592$ ($3 \\times 2^{26}$)',
      'MIPS Instruction: `j 0`; Two’s complement integer: $-201{,}326{,}592$',
      'MIPS Instruction: `addi $zero, $zero, 0`; Two’s complement integer: $12{,}000{,}000$',
      'MIPS Instruction: `beq $zero, $zero, 0`; Two’s complement integer: $67{,}108{,}864$',
    ],
    enExplanation:
      '• In binary, `0x0C000000` is $0000\\,1100\\,0000\\dots_2$.\n• Bits 31..26 (Opcode) are $000011_2 = 3_{10}$, which is **`jal`** (Jump and Link), and the 26-bit target is $0 \\rightarrow$ `jal 0`.\n• As an integer ($\text{MSB}=0$): $2^{27} + 2^{26} = 3 \\times 2^{26} = \\mathbf{201{,}326{,}592}$.',
  },
  'comp212-q3-twos': {
    enTopicLabel: "8-Bit Two's Complement & Overflow",
    enQuestion:
      "Given two decimal integers $A = 54$ and $B = -77$ in 8-bit Two's Complement representation (COMP 212 Q3). When computing $A + B$ and $A - B$ in 8-bit arithmetic, which result is correct?",
    enOptions: [
      '$A = 0011\\,0110_2$, $B = 1011\\,0011_2$; $A + B = 1110\\,1001_2$ ($-23$, no overflow); $A - B = 1000\\,0011_2$ (Overflow occurs!)',
      '$A = 0011\\,0110_2$, $B = 1100\\,1101_2$; neither $A + B$ nor $A - B$ overflows',
      '$A = 0011\\,0110_2$, $B = 1011\\,0011_2$; $A + B$ overflows while $A - B = 131$ does not overflow',
      '$A = 0101\\,0100_2$, $B = 1011\\,0011_2$; $A - B = 0100\\,1101_2$',
    ],
    enExplanation:
      '• In 8-bit Two’s Complement (range $[-128, +127]$): $A = +54 = 0011\\,0110_2$, $B = -77 = 1011\\,0011_2$.\n• $A + B = -23 = 1110\\,1001_2$ (no overflow).\n• $A - B = 54 - (-77) = +131 > +127$. Binary sum $0011\\,0110_2 + 0100\\,1101_2 = 1000\\,0011_2$ has $\\text{MSB} = 1$ (negative sign from two positive operands) $\\rightarrow$ **Overflow**!',
  },
  'comp212-q4-ieee': {
    enTopicLabel: 'IEEE 754 Single Precision (118.75)',
    enQuestion:
      'Find the IEEE 754 Single Precision (32-bit, $\\text{Bias} = 127$) representation of the decimal number $118.75$ (COMP 212 Q4.1):',
    enOptions: [
      '$\\text{Sign} = 0$, $\\text{Biased Exponent} = 1000\\,0101_2$ ($133$), $\\text{Significand} = 11011011\\,000000000000000_2$',
      '$\\text{Sign} = 0$, $\\text{Biased Exponent} = 0000\\,0110_2$ ($6$), $\\text{Significand} = 11101101\\,100000000000000_2$',
      '$\\text{Sign} = 1$, $\\text{Biased Exponent} = 1000\\,0101_2$ ($133$), $\\text{Significand} = 11011011\\,000000000000000_2$',
      '$\\text{Sign} = 0$, $\\text{Biased Exponent} = 0111\\,1111_2$ ($127$), $\\text{Significand} = 11011011\\,000000000000000_2$',
    ],
    enExplanation:
      '1) $118.75 > 0 \\Rightarrow \\text{Sign} = 0$.\n2) In binary: $118.75 = 1110110.11_2 = 1.11011011_2 \\times 2^6$.\n3) $\\text{Biased Exponent} = 6 + 127 = 133 = 1000\\,0101_2$.\n4) Dropping the hidden leading `1.`, the 23-bit Fraction is `11011011000000000000000`.',
  },
  'comp212-q4-2-frac': {
    enTopicLabel: 'IEEE 754 Negative Fraction (-5/128)',
    enQuestion:
      'Convert the negative fraction $X = -\\left(\\dfrac{1}{32} + \\dfrac{1}{128}\\right) = -0.0390625$ into IEEE 754 Single Precision format (COMP 212 Q4.2):',
    enOptions: [
      '$\\text{Sign} = 1$, $\\text{Biased Exponent} = 0111\\,1010_2$ ($122$), $\\text{Fraction} = 01000000\\,000000000000000_2$',
      '$\\text{Sign} = 1$, $\\text{Biased Exponent} = 1000\\,0101_2$ ($133$), $\\text{Fraction} = 01000000\\,000000000000000_2$',
      '$\\text{Sign} = 0$, $\\text{Biased Exponent} = 0111\\,1010_2$ ($122$), $\\text{Fraction} = 10100000\\,000000000000000_2$',
      '$\\text{Sign} = 1$, $\\text{Biased Exponent} = 0111\\,1000_2$ ($120$), $\\text{Fraction} = 10000000\\,000000000000000_2$',
    ],
    enExplanation:
      '1) $X < 0 \\Rightarrow \\text{Sign} = 1$.\n2) $2^{-5} + 2^{-7} = 1.01_2 \\times 2^{-5} \\Rightarrow E_{\\text{true}} = -5$.\n3) $E_{\\text{biased}} = -5 + 127 = 122 = 0111\\,1010_2$, and the 23-bit Fraction is `01000000000000000000000`.',
  },
  'co2007-q13-14-ieee': {
    enTopicLabel: 'IEEE 754 Hex Encoding (6.25 & 12.625)',
    enQuestion:
      'What are the 32-bit hexadecimal IEEE 754 Single Precision encodings for $6.25$ and $12.625$ (CO2007 Q13–14)?',
    enOptions: [
      '$6.25 = \\texttt{0x40C80000}$ ($E_{\\text{biased}} = 129$, $\\text{Frac} = .1001_2$); $12.625 = \\texttt{0x414A0000}$ ($E_{\\text{biased}} = 130$, $\\text{Frac} = .100101_2$)',
      '$6.25 = \\texttt{0x40880000}$; $12.625 = \\texttt{0x412A0000}$',
      '$6.25 = \\texttt{0xC0C80000}$; $12.625 = \\texttt{0xC14A0000}$',
      '$6.25 = \\texttt{0x3FC80000}$; $12.625 = \\texttt{0x404A0000}$',
    ],
    enExplanation:
      '• $6.25 = 110.01_2 = 1.1001_2 \\times 2^2 \\Rightarrow S=0, E=129 (1000\\,0001_2), \\text{Frac}=1001000\\dots_2 = \\mathbf{\\texttt{0x40C80000}}$.\n• $12.625 = 1100.101_2 = 1.100101_2 \\times 2^3 \\Rightarrow S=0, E=130 (1000\\,0010_2), \\text{Frac}=1001010\\dots_2 = \\mathbf{\\texttt{0x414A0000}}$.',
  },
  'fall2011-q1-5bit': {
    enTopicLabel: "5-Bit Two's Complement Subtraction (-12 - 5)",
    enQuestion:
      "In a **5-bit Two's Complement** system (Fall 2011 Q1b), what is the representable integer range, and what happens when computing $(-12) - 5$?",
    enOptions: [
      'Range is $[-16, +15]$; $(-12) + (-5) = -17 < -16$ causes **Negative Overflow** because adding two negative 5-bit numbers ($10100_2 + 11011_2 = 01111_2$) produces a positive MSB!',
      'Range is $[-15, +16]$; the result $-17$ is valid without overflow.',
      'Range is $[-32, +31]$; the result is $10001_2$ without overflow.',
      'Range is $[0, 31]$; negative numbers cannot be represented.',
    ],
    enExplanation:
      '• For $n = 5$ bits, the Two’s Complement range is $[-2^4, +2^4 - 1] = [-16, +15]$.\n• $-12 = 10100_2$ and $-5 = 11011_2$. Their 5-bit sum is $01111_2$ ($+15$), flipping the sign bit from $1$ to $0 \\Rightarrow$ **Overflow**!',
  },
  'comp212-q2-unsigned': {
    enTopicLabel: '16-Bit Unsigned Integers',
    enQuestion:
      'For a 16-bit Unsigned Integer representation (COMP 212 Q1.4 & Q2), what is the representable range and how are the representable numbers distributed along the real number line?',
    enOptions: [
      'Range is $0$ to $65{,}535$ ($2^{16} - 1$), and data points are distributed **uniformly** across the range.',
      'Range is $-32{,}768$ to $+32{,}767$, clustered densely near $0$.',
      'Range is $0$ to $65{,}536$ ($2^{16}$), distributed exponentially.',
      'Range is $-65{,}535$ to $+65{,}535$.',
    ],
    enExplanation:
      'An $n$-bit unsigned integer covers $[0, 2^n - 1] = [0, 65{,}535]$ with a constant step size of $1$ (**uniform distribution**), unlike floating-point numbers which are denser near zero.',
  },
  'co2007-q18-regbits': {
    enTopicLabel: 'Register File Read Port Width (5 bits)',
    enQuestion:
      'In the single-cycle MIPS datapath (CO2007 Q18), how many bits wide are the `Read register 1` and `Read register 2` input buses to the Register File?',
    enOptions: [
      '$5\\text{ bits}$ (corresponding to `rs = Instruction[25:21]` and `rt = Instruction[20:16]` to index $2^5 = 32$ registers)',
      '$32\\text{ bits}$ (matching the register data width)',
      '$6\\text{ bits}$ (matching the Opcode field)',
      '$16\\text{ bits}$ (matching the Immediate field)',
    ],
    enExplanation:
      'Because MIPS has $32$ general-purpose registers, addressing any register requires $\\log_2(32) = \\mathbf{5\\text{ bits}}$. The data output buses (`Read data 1, 2`) are $32\\text{ bits}$ wide.',
  },
  'co2007-q22-control': {
    enTopicLabel: 'Single-Cycle Control Signals',
    enQuestion:
      'In the Single-Cycle MIPS Datapath (CO2007 Q22–23), what are `(RegDst, ALUOp, ALUSrc)` during `add $t0, $t1, $zero`, and which control signals are `0` during `lw $t0, 0($t1)`?',
    enOptions: [
      'For `add`: $\\text{RegDst} = 1, \\text{ALUOp} = 10, \\text{ALUSrc} = 0$. For `lw`: signals equal to $0$ are $\\text{RegDst, Branch, ALUOp (00), MemWrite}$.',
      'For `add`: $\\text{RegDst} = 0, \\text{ALUOp} = 00, \\text{ALUSrc} = 1$. For `lw`: $\\text{MemRead} = 0, \\text{RegWrite} = 0$.',
      'For `add`: $\\text{RegDst} = 1, \\text{ALUOp} = 01, \\text{ALUSrc} = 0$. For `lw`: $\\text{ALUSrc} = 0, \\text{MemtoReg} = 0$.',
      'For `add`: $\\text{RegDst} = 0, \\text{ALUOp} = 10, \\text{ALUSrc} = 0$. For `lw`: $\\text{RegDst} = 1, \\text{MemWrite} = 1$.',
    ],
    enExplanation:
      '• `add` (R-format): destination is `rd` ($\\text{RegDst}=1$), second ALU operand comes from register file ($\\text{ALUSrc}=0$), and $\\text{ALUOp}=10$.\n• `lw`: destination is `rt` ($\\text{RegDst}=0$), $\\text{Branch}=0$, $\\text{ALUOp}=00$ (addition), and $\\text{MemWrite}=0$.',
  },
  'co2007-q20-21-mux': {
    enTopicLabel: 'Critical Path (lw), Zero Flag & MUX Count',
    enQuestion:
      'According to CO2007 Q20, Q21, and Q24: Which instruction passes through the most hardware units (determining the Single-Cycle clock period), which instructions use the ALU `Zero` output, and how many MUXes does `add` traverse?',
    enOptions: [
      'Longest path is `lw` (uses all 5 stages); `beq` and `bne` use the ALU `Zero` flag; `add` passes through $4$ MUXes (RegDst, ALUSrc, MemtoReg, Branch/PC).',
      'Longest path is `sw`; only `j` uses `Zero`; `add` passes through $2$ MUXes.',
      'Longest path is `add`; `lw` and `sw` use `Zero`; `add` passes through $5$ MUXes.',
      'Longest path is `beq`; all R-format instructions use `Zero`.',
    ],
    enExplanation:
      '• `lw` uses Instruction Memory $\\rightarrow$ Register File $\\rightarrow$ ALU $\\rightarrow$ Data Memory $\\rightarrow$ Register File (critical path).\n• Conditional branches (`beq, bne`) subtract two registers and check the ALU `Zero` output.',
  },
  'co2007-q25-pipeline': {
    enTopicLabel: 'Pipeline Data Hazards & Total Cycles',
    enQuestion:
      'Consider the 6-instruction MIPS sequence below entering a 5-stage pipeline at Cycle 1 (CO2007 Q25–27). How many RAW Data Hazards exist, and how many total clock cycles are required WITHOUT Forwarding vs. WITH Forwarding?',
    enOptions: [
      '5 Data Hazards; Without Forwarding takes $18$ cycles; With Forwarding takes $12$ cycles',
      '3 Data Hazards; Without Forwarding takes $14$ cycles; With Forwarding takes $10$ cycles',
      '5 Data Hazards; Without Forwarding takes $16$ cycles; With Forwarding takes $10$ cycles',
      '4 Data Hazards; Without Forwarding takes $15$ cycles; With Forwarding takes $12$ cycles',
    ],
    enExplanation:
      '• There are 5 RAW dependencies: (1$\\rightarrow$2 Load-Use on `$t0`), (2$\\rightarrow$3 on `$t0`), (2$\\rightarrow$4 on `$t0`), (4$\\rightarrow$5 on `$t0`), and (5$\\rightarrow$6 Load-Use on `$t1`).\n• **Without Forwarding**: 4 adjacent hazards each cause 2 stalls ($8\\text{ stalls} \\Rightarrow 6 + 4 + 8 = \\mathbf{18\\text{ cycles}}$).\n• **With Forwarding**: Only the 2 Load-Use hazards (1$\\rightarrow$2 and 5$\\rightarrow$6) cause 1 stall each ($2\\text{ stalls} \\Rightarrow 6 + 4 + 2 = \\mathbf{12\\text{ cycles}}$).',
  },
  'co2007-q28-29-fwdunit': {
    enTopicLabel: 'Forwarding Unit Signals at Cycle 5',
    enQuestion:
      'Continuing the 6-instruction sequence from CO2007 Q25 (WITH Forwarding): At **Clock Cycle 5**, which instructions are active in the pipeline, and what `(ForwardA, ForwardB)` values are output for the instruction in the EX stage?',
    enOptions: [
      '4 active instructions (Instr 1 in WB, Instr 2 in EX after 1 stall, Instr 3 in ID, Instr 4 in IF); `ForwardA = 01` (forwards `$t0` from MEM/WB) and `ForwardB = 00`.',
      '5 active instructions; `ForwardA = 10` and `ForwardB = 01`.',
      '3 active instructions; `ForwardA = 00` and `ForwardB = 00`.',
      '4 active instructions; `ForwardA = 10` (from EX/MEM) and `ForwardB = 10`.',
    ],
    enExplanation:
      'Because Instruction 1 (`lw $t0`) and Instruction 2 (`add $t0, $t0, $t1`) have a Load-Use hazard, a bubble occupies EX in Cycle 4. In **Cycle 5**, Instruction 2 is in **EX** and receives `$t0` from Instruction 1 in **MEM/WB** (`ForwardA = 01`), while `$t1` comes normally from the Register File (`ForwardB = 00`).',
  },
  'comp212-q1-tf': {
    enTopicLabel: 'SRAM vs. DRAM & Von Neumann Architecture',
    enQuestion:
      'Which of the following statements from COMP 212 Midterm Question 1 is TRUE?',
    enOptions: [
      'Von Neumann architecture stores both data and instructions in the same memory space, and SRAM is typically used to build Cache.',
      'CPU Registers are physically located inside Main Memory on the motherboard.',
      'Dynamic RAM (DRAM) has a faster access time than Static RAM (SRAM).',
      'Floating-point numbers are distributed uniformly along the real number line.',
    ],
    enExplanation:
      '• Von Neumann architecture unifies instruction and data memory.\n• SRAM is faster and used for Cache; DRAM is denser/cheaper and used for Main Memory.\n• Registers reside inside the CPU core.',
  },
  'comp212-q6-cache': {
    enTopicLabel: 'Cache Address Mapping (Direct vs. 4-Way)',
    enQuestion:
      'A byte-addressable main memory has size $16\\text{ MB}$, Block size is $8\\text{ bytes}$, and Cache data size is $512\\text{ KB}$ (COMP 212 Q6). How many bits are allocated to (Tag, Line/Set, Word/Offset) for Direct-Mapped and 4-Way Set Associative caches?',
    enOptions: [
      '24-bit address. Direct-Mapped: $(5\\text{b Tag}, 16\\text{b Line}, 3\\text{b Word})$; 4-Way Set Associative: $(7\\text{b Tag}, 14\\text{b Set}, 3\\text{b Word})$',
      '24-bit address. Direct-Mapped: $(8\\text{b Tag}, 13\\text{b Line}, 3\\text{b Word})$; 4-Way Set Associative: $(10\\text{b Tag}, 11\\text{b Set}, 3\\text{b Word})$',
      '32-bit address. Direct-Mapped: $(13\\text{b Tag}, 16\\text{b Line}, 3\\text{b Word})$; 4-Way Set Associative: $(15\\text{b Tag}, 14\\text{b Set}, 3\\text{b Word})$',
      '24-bit address. Direct-Mapped: $(7\\text{b Tag}, 14\\text{b Line}, 3\\text{b Word})$; 4-Way Set Associative: $(5\\text{b Tag}, 16\\text{b Set}, 3\\text{b Word})$',
    ],
    enExplanation:
      '• $16\\text{ MB} = 2^{24}\\text{ B} \\Rightarrow 24\\text{-bit}$ address. Block $= 8\\text{ B} = 2^3 \\Rightarrow 3\\text{-bit}$ Offset.\n• Number of cache lines $= 512\\text{ KB} / 8\\text{ B} = 2^{16}$ lines $\\Rightarrow$ Direct-Mapped uses $16\\text{b}$ Line and $24 - 16 - 3 = 5\\text{b}$ Tag.\n• 4-Way has $2^{16}/4 = 2^{14}$ sets $\\Rightarrow 14\\text{b}$ Set and $24 - 14 - 3 = 7\\text{b}$ Tag.',
  },
  'co2007-q30-cachebits': {
    enTopicLabel: 'Total Hardware Bits in a Cache',
    enQuestion:
      'Given a 32-bit byte address and a Direct-Mapped Cache holding $64\\text{ KB}$ of data with $4\\text{-word}$ blocks ($16\\text{ bytes/block}$) (CO2007 Q30–32). How many bits are in the Tag field, and what is the total number of storage bits required to implement the cache (Data + Tag + Valid bit)?',
    enOptions: [
      '$\\text{Tag} = 16\\text{ bits}$; Total storage $= 593{,}920\\text{ bits}$ ($580\\text{ Kbits}$)',
      '$\\text{Tag} = 16\\text{ bits}$; Total storage $= 524{,}288\\text{ bits}$ ($512\\text{ Kbits}$)',
      '$\\text{Tag} = 18\\text{ bits}$; Total storage $= 602{,}112\\text{ bits}$ ($588\\text{ Kbits}$)',
      '$\\text{Tag} = 14\\text{ bits}$; Total storage $= 643{,}072\\text{ bits}$ ($628\\text{ Kbits}$)',
    ],
    enExplanation:
      '• Block size $= 16\\text{ B} = 2^4\\text{ B} \\Rightarrow \\text{Offset} = 4\\text{ bits}$ ($128\\text{ data bits}$).\n• Number of blocks $= 64\\text{ KB} / 16\\text{ B} = 4{,}096 = 2^{12} \\Rightarrow \\text{Index} = 12\\text{ bits}$.\n• $\\text{Tag} = 32 - 12 - 4 = \\mathbf{16\\text{ bits}}$.\n• Total bits $= 4{,}096 \\times (1_{\\text{valid}} + 16_{\\text{tag}} + 128_{\\text{data}}) = 4{,}096 \\times 145 = \\mathbf{593{,}920\\text{ bits}}$.',
  },
  'co2007-q38-40-multilevel': {
    enTopicLabel: 'Effective CPI with L1 & L2 Caches',
    enQuestion:
      'A $4\\text{ GHz}$ CPU has $\\text{CPI}_{\\text{base}} = 1.0$ when all accesses hit in L1 Cache (CO2007 Q38–40). The L1 miss rate is $2\\%$, and Main Memory access time is $100\\text{ ns}$. If we add an L2 Cache with $5\\text{ ns}$ access time and a $0.5\\%$ global miss rate to RAM, how does $\\text{CPI}_{\\text{total}}$ change?',
    enOptions: [
      'L1 only: $\\text{CPI} = 9.0$; with L1 + L2: $\\text{CPI} = 3.4$ (speedup of $9.0 / 3.4 \\approx 2.65\\times$)',
      'L1 only: $\\text{CPI} = 3.0$; with L1 + L2: $\\text{CPI} = 1.5$',
      'L1 only: $\\text{CPI} = 9.0$; with L1 + L2: $\\text{CPI} = 5.0$',
      'L1 only: $\\text{CPI} = 5.0$; with L1 + L2: $\\text{CPI} = 2.4$',
    ],
    enExplanation:
      '• At $4\\text{ GHz}$ ($4\\text{ cycles/ns}$): $\\text{Penalty}_{\\text{RAM}} = 100 \\times 4 = 400\\text{ cycles}$, and $\\text{Penalty}_{\\text{L2}} = 5 \\times 4 = 20\\text{ cycles}$.\n• **L1 only**: $\\text{CPI} = 1.0 + 0.02 \\times 400 = \\mathbf{9.0}$.\n• **With L1 + L2**: $\\text{CPI} = 1.0 + 0.02 \\times 20 + 0.005 \\times 400 = 1.0 + 0.4 + 2.0 = \\mathbf{3.4}$.',
  },
  'fall2011-q7abc-locality': {
    enTopicLabel: 'Locality, 3C Misses & Write Policies',
    enQuestion:
      'According to Fall 2011 Question 7a–c, which statement accurately distinguishes **Temporal vs. Spatial Locality**, the **3C Cache Misses**, and **Write-Through vs. Write-Back**?',
    enOptions: [
      'Temporal reuses the same address soon; Spatial accesses neighboring addresses in the same block; 3Cs are Compulsory (cold), Capacity (full), and Conflict (set collision); Write-Back writes to RAM only when a dirty block is evicted.',
      'Temporal accesses consecutive array elements; Write-Through only updates the Cache without writing to RAM.',
      'Conflict Misses still occur in a Fully Associative Cache.',
      'Compulsory Misses can be completely eliminated by increasing associativity.',
    ],
    enExplanation:
      '• **Temporal Locality**: reusing recently accessed data (e.g., loop variables).\n• **Spatial Locality**: accessing nearby memory locations (e.g., sequential array elements).\n• **3Cs**: Compulsory (first reference), Capacity (cache smaller than working set), Conflict (multiple blocks mapping to the same set).\n• **Write-Back**: tracks modified blocks via a `Dirty bit` and writes back to RAM only on replacement.',
  },
  'fall2011-q6-vm': {
    enTopicLabel: 'Virtual Memory & Page Table Sizing',
    enQuestion:
      'Consider a Virtual Memory system with a $40\\text{-bit}$ virtual byte address, $16\\text{ KB}$ page size, and $36\\text{-bit}$ physical address (Fall 2011 Q6). Each Page Table Entry (PTE) includes 4 status bits (valid, protection, dirty, use). How many PTEs exist and how wide is each PTE?',
    enOptions: [
      '$2^{26}$ ($64\\text{M}$) entries; each PTE is $26\\text{ bits}$ wide ($22\\text{b PPN} + 4\\text{b}$ status) $\\rightarrow$ Total size $= 2^{26} \\times 26\\text{ bits}$',
      '$2^{24}$ ($16\\text{M}$) entries; each PTE is $24\\text{ bits}$ wide $\\rightarrow$ Total size $= 2^{24} \\times 24\\text{ bits}$',
      '$2^{26}$ entries; each PTE is $40\\text{ bits}$ wide',
      '$2^{22}$ entries; each PTE is $36\\text{ bits}$ wide',
    ],
    enExplanation:
      '• Page size $= 16\\text{ KB} = 2^{14}\\text{ B} \\Rightarrow \\text{Page Offset} = 14\\text{ bits}$.\n• $\\text{VPN} = 40 - 14 = 26\\text{ bits} \\Rightarrow 2^{26}$ Page Table entries.\n• $\\text{PPN} = 36 - 14 = 22\\text{ bits} \\Rightarrow$ Each PTE is $22 + 4 = \\mathbf{26\\text{ bits}}$.',
  },
  'fall2011-q7f-tlb': {
    enTopicLabel: 'TLB, Page Table & Cache Interaction',
    enQuestion:
      'Can the following combination of events occur simultaneously during a single CPU memory reference (Fall 2011 Q7f)? Why?\n`TLB: Miss  |  Page Table: Miss  |  Cache: Hit`',
    enOptions: [
      'IMPOSSIBLE! A Page Table Miss means a Page Fault (the page is on disk and not in physical RAM), so its data cannot possibly be present in the Cache.',
      'POSSIBLE if the Cache is physically indexed and physically tagged.',
      'POSSIBLE right after a TLB flush before the Cache is flushed.',
      'IMPOSSIBLE because a TLB Miss guarantees a Page Table Hit.',
    ],
    enExplanation:
      'A **Page Table Miss (Page Fault)** indicates that the requested virtual page is not resident in physical Main Memory (RAM). Since the Cache only holds copies of blocks currently in physical RAM, a **Cache Hit is impossible**.',
  },
  'co2007-q8-stack': {
    enTopicLabel: 'Pushing $ra onto the Stack ($sp)',
    enQuestion:
      'In a non-leaf MIPS procedure, which pair of instructions properly pushes the return address register `$ra` onto the top of the Stack before calling a nested subroutine (CO2007 Q8)?',
    enOptions: [
      '`addi $sp, $sp, -4` followed by `sw $ra, 0($sp)`',
      '`addi $sp, $sp, 4` followed by `sw $ra, 0($sp)`',
      '`lw $ra, 0($sp)` followed by `addi $sp, $sp, -4`',
      '`sw $ra, 4($sp)` followed by `addi $sp, $sp, 4`',
    ],
    enExplanation:
      'Because the MIPS Stack grows downward from **higher to lower memory addresses**, pushing a 4-byte word requires decrementing `$sp` by 4 first (`addi $sp, $sp, -4`) and then storing the register (`sw $ra, 0($sp)`).',
  },
  'nb-leaf-nonleaf': {
    enTopicLabel: 'Caller-Saved vs. Callee-Saved Registers',
    enQuestion:
      'According to the MIPS Procedure Call Convention, which registers must a called procedure (**Callee**) preserve (save on the Stack if modified and restore before `jr $ra`)?',
    enOptions: [
      'Saved registers `$s0 – $s7`, stack pointer `$sp`, frame pointer `$fp`, and return address `$ra` (if it calls another procedure).',
      'Temporary registers `$t0 – $t9` and return value registers `$v0 – $v1`.',
      'Argument registers `$a0 – $a3` and assembler temporary `$at`.',
      'Only `$zero` and `$v0`.',
    ],
    enExplanation:
      '• **Caller-saved**: `$t0–$t9, $a0–$a3, $v0–$v1`.\n• **Callee-saved**: `$s0–$s7, $sp, $fp, $gp`, and `$ra`.',
  },
  'co2007-q6-pseudo': {
    enTopicLabel: 'Pseudo-instructions & $at Register',
    enQuestion:
      'How does the MIPS Assembler translate the pseudo-instructions `li $v0, 10` (Load Immediate) and `blt $s0, $s1, LABEL` (Branch if Less Than) into real hardware instructions (CO2007 Q6)?',
    enOptions: [
      '`li $v0, 10` $\\rightarrow$ `addi $v0, $zero, 10` (or `ori $v0, $zero, 10`); `blt $s0, $s1, LABEL` $\\rightarrow$ `slt $at, $s0, $s1` followed by `bne $at, $zero, LABEL`.',
      '`li $v0, 10` $\\rightarrow$ `lw $v0, 10($zero)`; `blt` is a native hardware instruction.',
      '`li $v0, 10` $\\rightarrow$ `sll $v0, $zero, 10`; `blt` translates to `beq $s0, $s1, LABEL`.',
      '`li $v0, 10` $\\rightarrow$ `lui $v0, 10`; `blt` uses `$v0` as its temporary register.',
    ],
    enExplanation:
      '• Small 16-bit immediates like `li $v0, 10` translate to `addi $v0, $zero, 10` (or `ori`).\n• `blt` uses the reserved Assembler Temporary register **`$at` ($1)**: `slt $at, $s0, $s1` followed by `bne $at, $zero, LABEL`.',
  },
  'nb-linker-spim': {
    enTopicLabel: 'Linker Role & SPIM Syscall Services',
    enQuestion:
      'In the MIPS compilation toolchain and SPIM/MARS simulator (IT089IU Q3g & Chapter 6), what is the role of the **Linker** and what does `li $v0, 1` / `add $a0, $s2, $zero` / `syscall` do?',
    enOptions: [
      'The Linker merges object files (`.o`) and resolves global symbols (`.globl`) into an executable; `syscall` with `$v0 = 1` prints the integer in `$a0` (`$s2`) to the console.',
      'The Linker compiles C source directly to `.asm`; `$v0 = 1` terminates the program.',
      'The Linker is an on-chip CPU cache; `$v0 = 1` reads a string from the keyboard.',
      'The Linker only checks syntax; `$v0 = 10` prints the integer in `$a0`.',
    ],
    enExplanation:
      '• **Toolchain**: `C` $\\rightarrow$ Compiler $\\rightarrow$ `Assembly` $\\rightarrow$ Assembler $\\rightarrow$ `Object (.o)` $\\rightarrow$ **Linker** $\\rightarrow$ `Executable`.\n• **SPIM Syscalls**: `$v0 = 1` prints integer in `$a0`; `$v0 = 4` prints string; `$v0 = 5` reads integer; `$v0 = 10` exits.',
  },
};

export function resolveBilingualQuestion(q: QuizQuestion): {
  viTopicLabel: string;
  enTopicLabel: string;
  viQuestion: string;
  enQuestion: string;
  viOptions: string[];
  enOptions: string[];
  viExplanation: string;
  enExplanation: string;
} {
  const mapped = CURATED_QUIZ_EN_MAP[q.id];
  return {
    viTopicLabel: q.topicLabel,
    enTopicLabel: q.enTopicLabel || mapped?.enTopicLabel || q.topicLabel,
    viQuestion: q.question,
    enQuestion: q.enQuestion || mapped?.enQuestion || q.question,
    viOptions: q.options,
    enOptions:
      q.enOptions && q.enOptions.length === q.options.length
        ? q.enOptions
        : mapped?.enOptions || q.options,
    viExplanation: q.explanation,
    enExplanation: q.enExplanation || mapped?.enExplanation || q.explanation,
  };
}
