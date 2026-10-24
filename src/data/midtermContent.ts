export interface MindMapNode {
  id: string;
  name: string;
  viTitle: string;
  summary: string;
  formula?: string;
  examTip?: string;
  relatedVisualizerTab?: 'performance' | 'mips' | 'arithmetic' | 'datapath' | 'cache';
  children?: MindMapNode[];
}

export const NOTEBOOKLM_MINDMAP: MindMapNode = {
  id: 'root',
  name: 'Midterm Exam Scope Computer Architecture',
  viTitle: 'Phạm vi Ôn thi Giữa kỳ Kiến trúc Máy tính (155 nguồn NotebookLM)',
  summary: `### Tổng quan Cấu trúc Kiến thức Giữa kỳ
Hệ thống hóa **6 trụ cột kiến thức trọng tâm** trích xuất trực tiếp từ **Mind Map NotebookLM** và thư mục **Google Drive** (*IT089IU VNUHCM*, *CO2007 Bách Khoa*, *COMP 212*):
- **Chương 1 — Hiệu năng CPU**: Định luật Moore, công thức tính $\\text{Clock Cycles}$, $\\text{CPI}_{\\text{avg}}$ và $\\text{CPU Time} = \\dfrac{\\text{Cycles}}{\\text{Clock Rate}}$.
- **Chương 2 — Tập lệnh MIPS**: Khuôn dạng lệnh 32-bit (\`R, I, J\`), dịch C sang hợp ngữ MIPS và quản lý ngăn xếp $sp.
- **Chương 3 — Số học Máy tính**: Số nguyên bù 2 (*Two's Complement*), cờ tràn *Overflow* và chuẩn số thực $\\text{IEEE 754}$.
- **Chương 4 — Bộ xử lý & Pipeline**: Đường dữ liệu đơn chu kỳ (*Single-Cycle*), *5-Stage Pipeline* và xử lý xung đột *Hazards*.
- **Chương 5 — Phân cấp Bộ nhớ**: Nguyên lý cục bộ, ánh xạ *Cache* ($\\text{Tag} / \\text{Index} / \\text{Offset}$) và Bộ nhớ ảo (*Page Table, TLB*).
- **Chương 6 — Trình hợp dịch & SPIM**: Quy trình \`C -> Assembly -> Object -> Executable\` và lời gọi hệ thống \`syscall\`.`,
  children: [
    {
      id: 'cat-1',
      name: 'Computer Abstractions and Technology',
      viTitle: '1. Trừu tượng hóa Máy tính & Đánh giá Hiệu năng',
      summary: `### Nền tảng Kiến trúc & Phương trình Hiệu năng CPU
Mọi bài toán đánh giá hiệu năng trong đề thi đều xoay quanh mối quan hệ giữa **Số lệnh thực thi ($\\text{IC}$)**, **Số chu kỳ trung bình mỗi lệnh ($\\text{CPI}$)** và **Tần số xung nhịp ($\\text{Clock Rate}$)**:

| Đại lượng | Ký hiệu | Công thức Toán học Chuẩn | Đơn vị |
| :--- | :--- | :--- | :--- |
| **Tổng chu kỳ xung nhịp** | $\\text{Cycles}$ | $\\displaystyle \\sum_{i=1}^{n} (\\text{IC}_i \\times \\text{CPI}_i)$ | Chu kỳ ($\\text{cycles}$) |
| **CPI trung bình** | $\\text{CPI}_{\\text{avg}}$ | $\\dfrac{\\text{Total Cycles}}{\\text{Total IC}} = \\displaystyle \\sum_{i=1}^{n} (\\text{CPI}_i \\times F_i)$ | $\\text{cycles / instruction}$ |
| **Thời gian thực thi CPU** | $\\text{CPU Time}$ | $\\dfrac{\\text{Cycles}}{\\text{Clock Rate}} = \\text{Cycles} \\times T_{\\text{cycle}}$ | Giây ($\\text{s}$) hoặc $\\text{ms}$ |
| **Hệ số tăng tốc** | $\\text{Speedup}$ | $\\dfrac{\\text{Time}_{\\text{cũ}}}{\\text{Time}_{\\text{mới}}} = \\dfrac{\\text{Performance}_{\\text{mới}}}{\\text{Performance}_{\\text{cũ}}}$ | Lần ($\\times$) |

> **Quy đổi đơn vị chuẩn trong phòng thi**: $1\\text{ GHz} = 10^9\\text{ Hz (cycles/s)}$, $1\\text{ MHz} = 10^6\\text{ Hz}$, $1\\text{ ms} = 10^{-3}\\text{ s}$, $1\\text{ }\\mu\\text{s} = 10^{-6}\\text{ s}$, $1\\text{ ns} = 10^{-9}\\text{ s}$.`,
      formula: '$$\\text{CPU Time} = \\frac{\\text{Instruction Count} \\times \\text{CPI}_{\\text{avg}}}{\\text{Clock Rate}} = \\text{Instruction Count} \\times \\text{CPI}_{\\text{avg}} \\times T_{\\text{cycle}}$$',
      examTip: `### Mẹo giải Câu 1 Đề IT089IU (30 điểm) & Fall 2011:
- **Bước 1**: Tính số lệnh của từng nhóm: $I_k = F_k \\times \\text{IC}_{\\text{total}}$ (với $F_k$ là tỷ lệ phần trăm lớp $k$).
- **Bước 2**: Tính tổng chu kỳ: $\\text{Clock Cycles} = \\sum (I_k \\times \\text{CPI}_k)$.
- **Bước 3**: Tính thời gian thực thi $\\text{CPU Time} = \\dfrac{\\text{Clock Cycles}}{\\text{Clock Rate}}$. Máy nào có **CPU Time nhỏ hơn** thì máy đó **nhanh hơn** (đừng kết luận vội chỉ dựa vào CPI hay GHz!).`,
      relatedVisualizerTab: 'performance',
      children: [
        {
          id: 'cat-1-1',
          name: "Moore's Law",
          viTitle: 'Định luật Moore (Moore’s Law)',
          summary: `### Định luật Moore & Thông lượng hệ thống
- **Nội dung**: Số lượng bóng bán dẫn (*transistor*) trên một vi mạch tích hợp (IC) **tăng gấp đôi sau mỗi 18–24 tháng** (khoảng 2 năm).
- **Phân biệt 2 thước đo hiệu năng (Đề CO2007 Câu 1)**:
  - **Response Time (Thời gian phản hồi / Execution Time)**: Thời gian hoàn thành 1 công việc từ lúc bắt đầu đến lúc kết thúc.
  - **Throughput (Thông lượng / Bandwidth)**: Tổng số công việc hoàn thành trong một đơn vị thời gian. Khi **thêm nhiều bộ xử lý (cores)** vào hệ thống, **Throughput** tăng lên trực tiếp.`,
          examTip: 'Câu 1 đề CO2007: "Khi gắn thêm nhiều bộ xử lý hiện tại vào hệ thống, Throughput hay Response Time bị ảnh hưởng trực tiếp?" → Đáp án: **Throughput**.',
          children: [
            {
              id: 'cat-1-1-1',
              name: 'Transistor count doubles every two years',
              viTitle: 'Mật độ Transistor tăng gấp đôi mỗi 2 năm',
              summary: `- Giúp thu nhỏ kích thước cổng logic, giảm chiều dài đường truyền tín hiệu và tăng tần số xung nhịp.
- Tuy nhiên, hiện nay vướng **Bức tường Công suất (Power Wall)** do công suất tiêu thụ động tỷ lệ thuận với bình phương điện áp và tần số:
$$P_{\\text{dynamic}} \\propto C_{\\text{load}} \\times V^2 \\times f$$
Điều này buộc ngành vi xử lý chuyển từ tăng xung nhịp đơn nhân sang kiến trúc đa nhân (*Multicore*).`,
            },
          ],
        },
        {
          id: 'cat-1-2',
          name: 'Performance Evaluation',
          viTitle: 'Đánh giá Hiệu năng (Performance Evaluation)',
          summary: `### Quy trình 3 bước giải bài toán So sánh 2 Bộ xử lý P1 vs P2
Khi hai vi xử lý **P1** và **P2** cùng thực thi một tập lệnh (ISA) trên cùng một chương trình thì **Instruction Count ($\\text{IC}$)** là như nhau:
1. Tính tổng chu kỳ: $\\text{Cycles} = \\text{IC} \\times \\sum (F_i \\times \\text{CPI}_i)$.
2. Chia cho tần số xung nhịp tương ứng để tìm $\\text{CPU Time} = \\dfrac{\\text{Cycles}}{f}$.
3. Tỷ số tốc độ: **P2 nhanh hơn P1 gấp $n$ lần** nếu $\\dfrac{\\text{Time}_{\\text{P1}}}{\\text{Time}_{\\text{P2}}} = n > 1$.`,
          formula: '$$\\frac{\\text{Performance}_X}{\\text{Performance}_Y} = \\frac{\\text{Execution Time}_Y}{\\text{Execution Time}_X} = n$$',
          examTip: 'Nếu đề bài yêu cầu giảm CPI của nhóm lệnh FP để chương trình chạy nhanh gấp $1.5$ lần (Đề CO2007 Câu 4), hãy lập phương trình: $\\text{Cycles}_{\\text{mới}} = \\dfrac{\\text{Cycles}_{\\text{cũ}}}{1.5}$, giữ nguyên số chu kỳ các nhóm lệnh khác để tìm $\\text{CPI}_{\\text{FP mới}}$.',
          relatedVisualizerTab: 'performance',
          children: [
            {
              id: 'cat-1-2-1',
              name: 'Execution Time Formula: Instruction Count x CPI / Clock Rate',
              viTitle: 'Công thức Thời gian thực thi (Execution Time)',
              summary: `- **Công thức thuận theo chu kỳ xung nhịp**: $T_{\\text{CPU}} = \\text{IC} \\times \\text{CPI} \\times T_{\\text{cycle}}$
- **Công thức theo tần số xung nhịp**: $T_{\\text{CPU}} = \\dfrac{\\text{IC} \\times \\text{CPI}}{f_{\\text{clock}}}$
- Ba nhân tố phụ thuộc lẫn nhau: Công nghệ phần cứng ($f_{\\text{clock}}$), Tổ chức vi kiến trúc ($\\text{CPI}$), và Tập lệnh + Trình biên dịch ($\\text{IC}$).`,
              formula: '$$T_{\\text{CPU}} = \\frac{\\text{IC} \\times \\text{CPI}}{f_{\\text{clock}}}$$',
            },
            {
              id: 'cat-1-2-2',
              name: 'CPU Clock Cycles: Instruction Count x CPI',
              viTitle: 'Tổng số Chu kỳ xung nhịp (CPU Clock Cycles)',
              summary: `- Mỗi lớp lệnh (Số học, Load/Store, Branch, Floating-Point) tiêu tốn số chu kỳ xung nhịp $\\text{CPI}_i$ khác nhau.
- Tổng số chu kỳ máy: $\\text{Clock Cycles} = \\sum_{i=1}^{n} (\\text{IC}_i \\times \\text{CPI}_i)$.`,
              formula: '$$\\text{Clock Cycles} = \\sum_{k=1}^{n} (\\text{IC}_k \\times \\text{CPI}_k)$$',
            },
            {
              id: 'cat-1-2-3',
              name: 'Average CPI: Sum of (CPI_i x fraction_i)',
              viTitle: 'Số chu kỳ trung bình mỗi lệnh (Average CPI)',
              summary: `- Là trung bình cộng có trọng số của $\\text{CPI}_i$ theo tỷ lệ xuất hiện $F_i$ của từng nhóm lệnh.
- Ví dụ đề IT089IU: $\\text{CPI}_{\\text{P1}} = 0.2 \\times 3 + 0.1 \\times 3 + 0.4 \\times 1 + 0.3 \\times 2 = 1.9$.`,
              formula: '$$\\text{CPI}_{\\text{avg}} = \\sum_{i=1}^{n} (\\text{CPI}_i \\times F_i) = \\frac{\\text{Total Cycles}}{\\text{Total Instructions}}$$',
            },
          ],
        },
      ],
    },
    {
      id: 'cat-2',
      name: 'Instructions: Language of the Computer',
      viTitle: '2. Tập lệnh MIPS: Ngôn ngữ của Máy tính',
      summary: `### Kiến trúc Tập lệnh MIPS32 (32 Thanh ghi & Khuôn dạng 32-bit)
- **Nguyên tắc thiết kế**: *Kích thước cố định 32-bit (4 bytes/lệnh)*, *Số lượng định dạng lệnh tối giản (R, I, J)*, và *Chỉ truy xuất bộ nhớ qua lệnh Load/Store (\`lw, sw, lb, sb\`)*.

| Định dạng | Cấu trúc 32-bit (Từ trái sang phải: Bit 31 $\\rightarrow$ Bit 0) | Nhóm lệnh tiêu biểu |
| :--- | :--- | :--- |
| **R-Format** | \`[ op (6b) | rs (5b) | rt (5b) | rd (5b) | shamt (5b) | funct (6b) ]\` | \`add, sub, and, or, slt, sll, srl, jr\` ($\\text{op} = 0$) |
| **I-Format** | \`[ op (6b) | rs (5b) | rt (5b) | immediate / offset (16b) ]\` | \`lw, sw, lb, addi, andi, ori, slti, beq, bne\` |
| **J-Format** | \`[ op (6b) | target address (26b) ]\` | \`j\` ($\\text{op} = 2$), \`jal\` ($\\text{op} = 3$) |`,
      formula: '$$\\text{Address}(A[i]) = \\text{Base Address } (\\$s3) + (i \\times 4) = \\$s3 + (i \\ll 2)$$',
      examTip: `### Quy tắc sống còn khi dịch C sang MIPS (Chiếm 60% điểm đề IT089IU):
1. **Truy xuất mảng nguyên 32-bit (\`int A[]\`)**: Bắt buộc nhân chỉ số với $4$ bằng lệnh dịch trái 2 bit: \`sll $t0, $s0, 2\` rồi mới cộng địa chỉ nền \`add $t0, $s3, $t0\`.
2. **Câu lệnh \`if (i == j)\`**: Trong MIPS phải kiểm tra điều kiện **ngược lại** để nhảy sang nhãn \`ELSE\` (\`bne $s0, $s1, ELSE\`), và cuối khối \`if\` bắt buộc phải có \`j EXIT\`!`,
      relatedVisualizerTab: 'mips',
      children: [
        {
          id: 'cat-2-1',
          name: 'MIPS Instruction Formats',
          viTitle: 'Các định dạng lệnh MIPS (R, I, J Format)',
          summary: `### Giải mã 3 Định dạng lệnh 32-bit của MIPS
- Mỗi thanh ghi được đánh số từ $0$ đến $31$, nên cần đúng **5 bits** ($2^5 = 32$) để mã hóa một trường thanh ghi (\`rs, rt, rd\`).
- Đây chính là đáp án của **Câu 18 đề CO2007**: *"Kích thước của 2 ngõ vào Read Register 1 và Read Register 2 là bao nhiêu bit?"* $\\rightarrow$ **$5\\text{ bits}$**.`,
          children: [
            {
              id: 'cat-2-1-1',
              name: 'R-format: Used for arithmetic and logic operations',
              viTitle: 'R-Format (Register): Phép toán số học, logic & dịch bit',
              summary: `- **Trường \`op\` (6b)**: Luôn bằng \`000000\` ($0$) cho mọi lệnh R-format.
- **Trường \`rs\` (5b) & \`rt\` (5b)**: Hai thanh ghi nguồn.
- **Trường \`rd\` (5b)**: Thanh ghi đích nhận kết quả ($\\text{RegDst} = 1$).
- **Trường \`shamt\` (5b)**: Số bit cần dịch trong lệnh \`sll, srl, sra\` (từ $0$ đến $31$).
- **Trường \`funct\` (6b)**: Xác định phép toán cụ thể cho ALU (\`add = 0x20, sub = 0x22, and = 0x24, or = 0x25, slt = 0x2A\`).`,
              formula: '`[ op: 6b (0) | rs: 5b | rt: 5b | rd: 5b | shamt: 5b | funct: 6b ]`',
            },
            {
              id: 'cat-2-1-2',
              name: 'I-format: Used for load, store, and conditional branch',
              viTitle: 'I-Format (Immediate): Tải/Lưu bộ nhớ, Hằng số & Rẽ nhánh',
              summary: `- **Thanh ghi đích**: Lưu vào \`rt\` (bits 20:16, tín hiệu $\\text{RegDst} = 0$) thay vì \`rd\`.
- **Mở rộng dấu (*Sign-Extension*)**: Áp dụng cho \`addi, lw, sw, lb, slti, beq, bne\` — nhân bản bit dấu (bit 15) ra 16 bit cao.
- **Mở rộng số 0 (*Zero-Extension*)**: Áp dụng cho phép logic \`andi, ori, xori\` — điền \`0x0000\` vào 16 bit cao.`,
              formula: '$$\\text{PC}_{\\text{branch}} = (\\text{PC} + 4) + (\\text{SignExt}(\\text{offset}) \\times 4)$$',
              examTip: 'Câu 7 đề CO2007: Để xóa 16 bit cao của `$s0 = 0xFFFFCA16` thành `0x0000CA16`, dùng ngay `andi $s0, $s0, 0xFFFF` vì `andi` tự động Zero-Extend 16 bit cao thành 0!',
            },
            {
              id: 'cat-2-1-3',
              name: 'J-format: Used for unconditional branch',
              viTitle: 'J-Format (Jump): Nhảy không điều kiện (j, jal)',
              summary: `- Gồm **6 bit Opcode** (\`j\` $= 2$, \`jal\` $= 3$) và **26 bit địa chỉ word**.
- Khi thực thi, địa chỉ 32-bit mới của $\\text{PC}$ được ghép từ: **4 bit cao nhất của $(\\text{PC} + 4)$** + **26 bit trường \`address\`** + **\`00\` (dịch trái 2 bit)**. `,
              formula: '$$\\text{PC}_{\\text{jump}} = \\{\\ (\\text{PC}+4)[31:28],\\ \\text{address}[25:0],\\ 00_2\\ \\}$$',
              examTip: 'Bài tập HW3 Câu 3: Mã máy `0x0C000000` có 6 bit đầu là `000011` ($\\text{op} = 3$) và 26 bit sau bằng $0$ $\\rightarrow$ Chính là lệnh `jal 0`!',
            },
          ],
        },
        {
          id: 'cat-2-2',
          name: 'MIPS Assembly and Directives',
          viTitle: 'Chỉ thị Hợp ngữ MIPS (Assembler Directives)',
          summary: [
            '### Cấu trúc Khung Chương trình Hợp ngữ MIPS',
            '- **`.data`**: Nơi khai báo biến và mảng trong RAM (ví dụ `MemArray: .word 1, 2, 3, 4`).',
            '- **`.text`**: Nơi chứa mã lệnh thực thi của chương trình.',
            '- **`.globl main`**: Khai báo nhãn toàn cục để trình mô phỏng SPIM/MARS bắt đầu chạy từ `main`.',
          ].join('\n'),
          children: [
            {
              id: 'cat-2-2-1',
              name: '.text segment: Instructions',
              viTitle: '.text: Phân vùng chứa mã lệnh thực thi',
              summary: 'Bắt đầu vùng chứa các câu lệnh assembly được nạp vào bộ nhớ lệnh (*Instruction Memory*, thường bắt đầu từ địa chỉ `0x00400000`).',
            },
            {
              id: 'cat-2-2-2',
              name: '.data segment: Data definitions',
              viTitle: '.data: Phân vùng khai báo dữ liệu tĩnh',
              summary: 'Khai báo mảng và biến toàn cục: `.word` (số nguyên 32-bit $= 4\\text{ bytes}$), `.half` (16-bit $= 2\\text{ bytes}$), `.byte` (8-bit $= 1\\text{ byte}$), `.asciiz` (chuỗi ký tự kết thúc bằng null).',
            },
            {
              id: 'cat-2-2-3',
              name: '.globl sym: Global symbol declaration',
              viTitle: '.globl main: Khai báo nhãn toàn cục',
              summary: 'Cho phép trình liên kết (*Linker*) và hệ điều hành nhận diện điểm nhập (*entry point*) của chương trình.',
            },
          ],
        },
        {
          id: 'cat-2-3',
          name: 'Procedures and Stack',
          viTitle: 'Thủ tục (Procedures) & Ngăn xếp (Stack)',
          summary: `### Quy trình 6 bước Gọi hàm (Procedure Call) trong MIPS
1. **Caller** đặt các đối số vào $a0 – $a3.
2. **Caller** thực thi \`jal Label\` (tự động lưu địa chỉ trả về $\\text{PC} + 4$ vào thanh ghi $ra).
3. **Callee** cấp phát bộ nhớ trên **Stack** (giảm $sp) và lưu các thanh ghi cần bảo toàn ($ra, $s0–$s7).
4. **Callee** thực thi thân hàm.
5. **Callee** đặt kết quả trả về vào $v0 – $v1, khôi phục các thanh ghi từ Stack và tăng lại $sp.
6. **Callee** quay về bằng lệnh \`jr $ra\`.`,
          children: [
            {
              id: 'cat-2-3-1',
              name: 'Leaf Procedure: Does not call other procedures',
              viTitle: 'Thủ tục Lá (Leaf Procedure)',
              summary: 'Hàm **không gọi** bất kỳ hàm nào khác. Nếu chỉ dùng các thanh ghi tạm $t0–$t9, hàm lá không cần dùng tới Stack cho $ra.',
            },
            {
              id: 'cat-2-3-2',
              name: 'Non-Leaf Procedure: Calls other procedures and saves return address',
              viTitle: 'Thủ tục Không lá (Non-Leaf / Đệ quy)',
              summary: 'Hàm **có gọi hàm khác** (hoặc tự gọi đệ quy). Bắt buộc phải đẩy (**push**) $ra và các thanh ghi $s0–$s7 hoặc $a0–$a3 vào Stack trước khi gọi `jal`.',
            },
            {
              id: 'cat-2-3-3',
              name: 'Stack Pointer ($sp): Adjusted for saved registers',
              viTitle: 'Con trỏ Ngăn xếp ($sp - Thanh ghi số 29)',
              summary: `### Cú pháp Push & Pop Ngăn xếp chuẩn (Đề CO2007 Câu 8)
Stack phát triển từ **địa chỉ cao xuống địa chỉ thấp**:
\`\`\`mips
# PUSH $ra vào đỉnh Stack:
addi $sp, $sp, -4
sw   $ra, 0($sp)

# POP $ra khỏi đỉnh Stack:
lw   $ra, 0($sp)
addi $sp, $sp, 4
\`\`\``,
            },
          ],
        },
      ],
    },
    {
      id: 'cat-3',
      name: 'Arithmetic for Computers',
      viTitle: '3. Số học Máy tính & Biểu diễn Số',
      summary: `### Biểu diễn Số nguyên & Số thực Dấu phẩy động IEEE 754
| Phương pháp biểu diễn | Dải giá trị ($n$-bit) | Công thức Toán học & Quy tắc |
| :--- | :--- | :--- |
| **Không dấu (Unsigned)** | $0 \\rightarrow 2^n - 1$ | Mọi bit đều mang trọng số dương. Phân bố đều trên trục số. |
| **Bù 2 (Two’s Complement)** | $-2^{n-1} \\rightarrow +2^{n-1} - 1$ | Bit đầu (MSB) là bit dấu ($0$: dương, $1$: âm). Tìm số đối: $\\overline{X} + 1$. |
| **IEEE 754 Single (32-bit)** | \`1b Sign | 8b Exp | 23b Frac\` | $(-1)^S \\times (1.\\text{Fraction})_2 \\times 2^{\\,\\text{Exp} - 127}$ ($\\text{Bias} = 127$). |
| **IEEE 754 Double (64-bit)** | \`1b Sign | 11b Exp | 52b Frac\` | $(-1)^S \\times (1.\\text{Fraction})_2 \\times 2^{\\,\\text{Exp} - 1023}$ ($\\text{Bias} = 1023$). |`,
      formula: '$$\\text{Value}_{\\text{IEEE 754}} = (-1)^S \\times (1 + \\text{Fraction})_2 \\times 2^{\\,E_{\\text{biased}} - 127}$$',
      examTip: `### Quy tắc kiểm tra Tràn số (Overflow) trong Bù 2:
- Cộng 2 số **trái dấu**: **KHÔNG BAO GIỜ** tràn số.
- Cộng 2 số **cùng dấu** (cùng dương $0 + 0$ hoặc cùng âm $1 + 1$): Bị **Overflow** nếu và chỉ nếu **bit dấu của kết quả ngược với bit dấu của 2 toán hạng**!`,
      relatedVisualizerTab: 'arithmetic',
      children: [
        {
          id: 'cat-3-1',
          name: 'Number Representation',
          viTitle: 'Biểu diễn Số trong Máy tính',
          summary: 'Cách mã hóa số nguyên không dấu, số nguyên có dấu bù 2 và số thực dấu phẩy động IEEE 754.',
          children: [
            {
              id: 'cat-3-1-1',
              name: 'Unsigned Integers',
              viTitle: 'Số nguyên Không dấu (Unsigned Integers)',
              summary: 'Dải giá trị $n$-bit: từ $0$ đến $2^n - 1$. Với 8-bit là $[0, 255]$, với 16-bit là $[0, 65535]$. Các điểm dữ liệu phân bố cách đều nhau trên trục số thực.',
            },
            {
              id: 'cat-3-1-2',
              name: "Signed Integers: Two's complement representation",
              viTitle: 'Số nguyên Có dấu: Biểu diễn Bù 2 (Two’s Complement)',
              summary: `- Với 8-bit bù 2: dải giá trị từ **$-128$ đến $+127$** (với 5-bit bù 2 trong đề Fall 2011 là **$-16$ đến $+15$**).
- Ví dụ đề COMP 212: $A = 54 = 0011\\,0110_2$, $B = -77 = 1011\\,0011_2$. Khi tính $A - B = 54 - (-77) = 131 > 127$ $\\rightarrow$ Kết quả nhị phân $1000\\,0011_2$ có $\\text{MSB} = 1$ nên **bị tràn số (Overflow)**!`,
            },
            {
              id: 'cat-3-1-3',
              name: 'Floating Point: IEEE 754 standard',
              viTitle: 'Số thực Dấu phẩy động: Chuẩn IEEE 754',
              summary: `### 4 Bước đổi số thập phân sang IEEE 754 32-bit (Ví dụ: $118.75$)
1. **Xác định bit dấu $S$**: Số dương $\\rightarrow S = 0$, số âm $\\rightarrow S = 1$.
2. **Đổi sang nhị phân & Chuẩn hóa**: $118.75 = 1110110.11_2 = 1.11011011_2 \\times 2^6$.
3. **Tính Biased Exponent (8-bit)**: $E_{\\text{biased}} = E_{\\text{thực}} + 127 = 6 + 127 = 133 = 1000\\,0101_2$.
4. **Lấy 23-bit Fraction (bỏ số $1.$ ẩn đầu tiên)**: \`11011011 000000000000000\`.`,
            },
          ],
        },
      ],
    },
    {
      id: 'cat-4',
      name: 'The Processor: Datapath and Control',
      viTitle: '4. Bộ xử lý: Đường dữ liệu (Datapath) & Pipeline',
      summary: `### Bảng Chân trị Tín hiệu Điều khiển Single-Cycle Datapath (Đề CO2007 Câu 18–24)

| Lệnh | RegDst | ALUSrc | MemtoReg | RegWrite | MemRead | MemWrite | Branch | ALUOp |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **R-format (\`add\`)** | \`1\` | \`0\` | \`0\` | \`1\` | \`0\` | \`0\` | \`0\` | \`10\` |
| **Load (\`lw\`)** | \`0\` | \`1\` | \`1\` | \`1\` | \`1\` | \`0\` | \`0\` | \`00\` |
| **Store (\`sw\`)** | \`X\` | \`1\` | \`X\` | \`0\` | \`0\` | \`1\` | \`0\` | \`00\` |
| **Branch (\`beq\`)** | \`X\` | \`0\` | \`X\` | \`0\` | \`0\` | \`0\` | \`1\` | \`01\` |`,
      formula: '$$T_{\\text{cycle (Single-Cycle)}} = T_{\\text{IF}} + T_{\\text{ID}} + T_{\\text{EX}} + T_{\\text{MEM}} + T_{\\text{WB}} \\quad (\\text{đường đi lệnh } \\texttt{lw})$$',
      examTip: `### Mẹo giải nhanh bài toán Pipeline (Đề CO2007 Câu 25–29):
- **Tổng số chu kỳ thực thi $N$ lệnh**: $\\text{Total Cycles} = N + 4 + \\text{Stalls}$.
- **Không có Forwarding**: Nếu lệnh sau dùng kết quả thanh ghi của lệnh ngay sát trước đó, phải chèn **2 chu kỳ trễ (Stalls)**.
- **Có Forwarding**: Phép toán ALU-to-ALU không bị trễ ($0\\text{ stall}$). Riêng xung đột **Load-Use** (\`lw $t0\` rồi lệnh ngay sau dùng $t0) vẫn bắt buộc phải chèn **1 chu kỳ Stall**!`,
      relatedVisualizerTab: 'datapath',
      children: [
        {
          id: 'cat-4-1',
          name: 'Single-Cycle Implementation',
          viTitle: 'Hiện thực Đơn chu kỳ (Single-Cycle Datapath)',
          summary: `- Mỗi lệnh thực thi trọn vẹn trong **1 chu kỳ xung nhịp**.
- Chu kỳ xung nhịp bị quyết định bởi lệnh có đường đi dài nhất là lệnh **\`lw\`** (đi qua cả 5 khối: *Instruction Memory $\\rightarrow$ Register File $\\rightarrow$ ALU $\\rightarrow$ Data Memory $\\rightarrow$ Register File*).`,
        },
        {
          id: 'cat-4-2',
          name: 'Pipelining',
          viTitle: 'Kỹ thuật Đường ống (Pipelining)',
          summary: 'Chia quá trình thực thi lệnh thành 5 công đoạn gối đầu nhau để tăng thông lượng (*Throughput*). Chu kỳ xung nhịp Pipeline bằng thời gian của **tầng chậm nhất**: $T_{\\text{cycle (Pipeline)}} = \\max(T_{\\text{IF}}, T_{\\text{ID}}, T_{\\text{EX}}, T_{\\text{MEM}}, T_{\\text{WB}})$.',
          children: [
            {
              id: 'cat-4-2-1',
              name: 'Pipeline Stages: IF, ID, EX, MEM, WB',
              viTitle: '5 Tầng Pipeline: IF → ID → EX → MEM → WB',
              summary: `1. **IF (Instruction Fetch)**: Đọc lệnh từ Instruction Memory theo địa chỉ PC, tính $\\text{PC} + 4$.
2. **ID (Instruction Decode)**: Giải mã lệnh và đọc 2 thanh ghi từ Register File.
3. **EX (Execute)**: Thực hiện phép tính trong ALU hoặc tính địa chỉ bộ nhớ / nhánh.
4. **MEM (Memory Access)**: Đọc hoặc ghi Data Memory (\`lw / sw\`).
5. **WB (Write Back)**: Ghi kết quả ngược về Register File.`,
            },
            {
              id: 'cat-4-2-2',
              name: 'Hazards: Structural, Data, and Control hazards',
              viTitle: '3 Loại Xung đột (Hazards): Cấu trúc, Dữ liệu & Điều khiển',
              summary: `- **Structural Hazard**: Tranh chấp tài nguyên phần cứng (khắc phục bằng cách tách riêng *Instruction Memory* và *Data Memory*).
- **Data Hazard (RAW)**: Lệnh sau cần dữ liệu chưa kịp ghi về của lệnh trước (khắc phục bằng **Forwarding** từ thanh ghi tầng \`EX/MEM\` hoặc \`MEM/WB\`).
- **Control Hazard**: Do các lệnh rẽ nhánh \`beq, bne, j\` (khắc phục bằng dự đoán nhánh *Branch Prediction* hoặc dời bộ so sánh lên tầng ID).`,
            },
          ],
        },
      ],
    },
    {
      id: 'cat-5',
      name: 'Memory Hierarchy',
      viTitle: '5. Phân cấp Bộ nhớ: Cache & Bộ nhớ Ảo',
      summary: `### Phân hoạch Địa chỉ Vật lý & Công thức Tính Bit Cache
Khi CPU truy xuất địa chỉ vật lý **$N$-bit**, địa chỉ được chia thành 3 trường:

| Trường địa chỉ | Công thức Số lượng bit | Ý nghĩa Vật lý |
| :--- | :--- | :--- |
| **Byte Offset (Word)** | $b = \\log_2(\\text{Block Size in Bytes})$ | Chọn byte/từ bên trong 1 Block dữ liệu. |
| **Index (Line / Set)** | $s = \\log_2(\\text{Num Sets}) = \\log_2\\!\\left(\\dfrac{\\text{Cache Size}}{\\text{Block Size} \\times k}\\right)$ | Chọn dòng Cache (*Direct-Mapped*, $k=1$) hoặc tập Set ($k$-Way). Với *Fully Associative*, $s = 0$. |
| **Tag Field** | $t = N - s - b$ | Định danh khối nhớ để so sánh Hit / Miss. |`,
      formula: '$$\\text{Total Cache Bits} = \\text{Num Blocks} \\times (1_{\\text{valid}} + t_{\\text{tag}} + 8 \\times \\text{Block Size}_{\\text{bytes}})$$',
      examTip: `### Công thức CPI khi có Cache nhiều cấp (Đề CO2007 Câu 38–40):
- **Chỉ có L1 Cache**: $\\text{CPI}_{\\text{total}} = \\text{CPI}_{\\text{base}} + (\\text{Miss Rate}_{\\text{L1}} \\times \\text{Penalty}_{\\text{RAM}})$.
- **Có cả L1 & L2 Cache**: $\\text{CPI}_{\\text{total}} = \\text{CPI}_{\\text{base}} + (\\text{Miss Rate}_{\\text{L1}} \\times \\text{Penalty}_{\\text{L2}}) + (\\text{Miss Rate}_{\\text{L2}} \\times \\text{Penalty}_{\\text{RAM}})$.
- Trong đó: $\\text{Penalty (cycles)} = \\text{Access Time (ns)} \\times f_{\\text{CPU}}\\text{ (GHz)}$.`,
      relatedVisualizerTab: 'cache',
      children: [
        {
          id: 'cat-5-1',
          name: 'Principle of Locality: Temporal and Spatial',
          viTitle: 'Nguyên lý Cục bộ: Thời gian (Temporal) & Không gian (Spatial)',
          summary: `- **Cục bộ về Thời gian (Temporal Locality)**: Một mục dữ liệu vừa được truy cập thì có xác suất rất cao sẽ được truy cập lại trong tương lai gần (ví dụ: các lệnh trong thân vòng lặp, biến đếm \`i\`, biến tổng \`sum\`).
- **Cục bộ về Không gian (Spatial Locality)**: Khi một địa chỉ được truy cập, các địa chỉ nằm lân cận nó có xác suất cao sẽ được truy cập tiếp theo (ví dụ: duyệt các phần tử liên tiếp của mảng \`A[0], A[1], A[2]\`).`,
        },
        {
          id: 'cat-5-2',
          name: 'Caches',
          viTitle: 'Bộ nhớ đệm Cache (SRAM)',
          summary: 'Cơ chế ánh xạ khối nhớ từ RAM lên Cache (SRAM) và các chính sách xử lý Miss / Write.',
          children: [
            {
              id: 'cat-5-2-1',
              name: 'Cache Misses: Compulsory, Capacity, and Conflict misses',
              viTitle: 'Phân loại 3C Misses: Compulsory, Capacity, Conflict',
              summary: `- **Compulsory Miss (Cold Miss)**: Xảy ra ở lần đầu tiên khối dữ liệu được truy cập (bắt buộc phải nạp vào Cache).
- **Capacity Miss**: Xảy ra khi dung lượng Cache quá nhỏ, không thể chứa hết toàn bộ các khối dữ liệu đang hoạt động của chương trình.
- **Conflict Miss (Collision Miss)**: Xảy ra trong *Direct-Mapped* hoặc *Set-Associative* khi nhiều khối nhớ khác nhau cùng ánh xạ vào chung một Line/Set và đẩy nhau ra ngoài.`,
            },
            {
              id: 'cat-5-2-2',
              name: 'Write Policies: Write-through and Write-back',
              viTitle: 'Chính sách Ghi: Write-Through vs Write-Back',
              summary: `| Tiêu chí | Write-Through (Ghi xuyên) | Write-Back (Ghi trả sau) |
| :--- | :--- | :--- |
| **Cơ chế** | Ghi đồng thời vào cả Cache và Main Memory. | Chỉ ghi vào Cache và bật bit **Dirty = 1**; chỉ ghi về RAM khi block bị thay thế. |
| **Ưu điểm** | Đơn giản, dữ liệu giữa Cache và RAM luôn nhất quán. | Tốc độ ghi rất nhanh, tiết kiệm băng thông bộ nhớ khi ghi lặp lại nhiều lần. |
| **Nhược điểm** | Tốn băng thông bus bộ nhớ, cần dùng thêm *Write Buffer*. | Mạch điều khiển phức tạp hơn để quản lý Dirty bit khi thay thế block. |`,
            },
          ],
        },
        {
          id: 'cat-5-3',
          name: 'Virtual Memory and TLB',
          viTitle: 'Bộ nhớ Ảo (Virtual Memory), Bảng trang (Page Table) & TLB',
          summary: `- **Virtual Memory**: Cho phép chương trình dùng không gian địa chỉ ảo lớn hơn RAM vật lý; chia bộ nhớ thành các trang (**Pages**, thường từ $4\\text{ KB} - 16\\text{ KB}$).
- **TLB (Translation Lookaside Buffer)**: Bộ nhớ đệm tốc độ cao nằm trong CPU chuyên lưu các cặp ánh xạ $\\text{VPN} \\rightarrow \\text{PPN}$ vừa dùng, giúp CPU không phải đọc *Page Table* trong RAM ở mỗi lệnh.
- **Page Fault (Lỗi trang)**: Xảy ra khi bit $\\text{Valid} = 0$ trong bảng trang. Hệ điều hành sẽ giành quyền điều khiển (exception), tìm trang dữ liệu trên ổ cứng (Disk) nạp vào RAM (mất hàng triệu chu kỳ), cập nhật lại Page Table rồi thực thi lại lệnh.`,
          examTip: 'Câu hỏi kinh điển Fall 2011 Q7f: Tổ hợp "TLB: Miss | Page Table: Miss | Cache: Hit" có thể xảy ra không? → **KHÔNG THỂ!** Vì Page Table Miss đồng nghĩa với Page Fault (trang chưa có trong RAM vật lý), nên dữ liệu của trang đó tuyệt đối không thể nằm trong Cache.',
        },
      ],
    },
    {
      id: 'cat-6',
      name: 'Assemblers, Linkers, and SPIM',
      viTitle: '6. Trình hợp dịch (Assembler), Liên kết (Linker) & SPIM',
      summary: `### Chuỗi công cụ Dịch & Chạy Chương trình MIPS
\`C Source (.c)\` $\\rightarrow$ **[Compiler]** $\\rightarrow$ \`Assembly (.s/.asm)\` $\\rightarrow$ **[Assembler]** $\\rightarrow$ \`Object File (.o)\` $\\rightarrow$ **[Linker]** $\\rightarrow$ \`Executable (a.out)\` $\\rightarrow$ **[Loader / SPIM]** $\\rightarrow$ \`Memory\`.`,
      children: [
        {
          id: 'cat-6-1',
          name: 'Assembler: Translates assembly to object file',
          viTitle: 'Assembler (Trình hợp dịch)',
          summary: `- Dịch mã hợp ngữ sang mã máy nhị phân trong tệp đối tượng (*Object file*).
- Biến đổi các **lệnh giả (Pseudo-instructions)** thành lệnh phần cứng MIPS thực thụ (sử dụng thanh ghi tạm $at - thanh ghi số 1):
  - \`li $v0, 10\` $\\rightarrow$ \`addi $v0, $zero, 10\` hoặc \`ori $v0, $zero, 10\` (Đề CO2007 Câu 6).
  - \`move $a0, $s2\` $\\rightarrow$ \`add $a0, $s2, $zero\`.
  - \`blt $s0, $s1, L1\` $\\rightarrow$ \`slt $at, $s0, $s1\` kết hợp \`bne $at, $zero, L1\`.`,
        },
        {
          id: 'cat-6-2',
          name: 'Linker: Combines object files into executable',
          viTitle: 'Linker (Trình liên kết)',
          summary: 'Ghép nối các file object riêng lẻ và thư viện chuẩn, phân giải các nhãn toàn cục (`.globl`) và định vị lại địa chỉ tuyệt đối (*relocation*) để tạo file thực thi hoàn chỉnh.',
        },
        {
          id: 'cat-6-3',
          name: 'SPIM Simulator: MIPS32 simulator',
          viTitle: 'Trình mô phỏng SPIM / MARS (MIPS32 Simulator)',
          summary: `### Bảng Mã Lời gọi Hệ thống (Syscall) trong SPIM / MARS
| Giá trị thanh ghi \`$v0\` | Chức năng của lệnh \`syscall\` | Thanh ghi tham số / Kết quả |
| :--- | :--- | :--- |
| **\`$v0 = 1\`** | **In số nguyên (Print Integer)** | In giá trị nguyên đang chứa trong **\`$a0\`** ra màn hình. |
| **\`$v0 = 4\`** | **In chuỗi ký tự (Print String)** | \`$a0\` chứa địa chỉ chuỗi kết thúc bằng null (\`.asciiz\`). |
| **\`$v0 = 5\`** | **Đọc số nguyên (Read Integer)** | Số nguyên nhập từ bàn phím được trả về trong \`$v0\`. |
| **\`$v0 = 10\`** | **Kết thúc chương trình (Exit)** | Dừng thực thi chương trình an toàn. |`,
        },
      ],
    },
  ],
};

export interface DriveStudyDoc {
  id: string;
  title: string;
  folder: string;
  year: string;
  size: string;
  category: 'exam' | 'slides' | 'homework' | 'reference';
  driveUrl: string;
  summary: string;
  keyHighlights: string[];
}

export const DRIVE_STUDY_DOCS: DriveStudyDoc[] = [
  {
    id: '1sMuV4dq0sSlHZOzg-_-1_rv6I6QPKRhM',
    title: 'Midterm - Semester 02 (2021 - 2022) - Solutions.pdf',
    folder: 'Mr. Cuong / Midterm',
    year: '2022',
    size: '53 KB',
    category: 'exam',
    driveUrl: 'https://drive.google.com/file/d/1sMuV4dq0sSlHZOzg-_-1_rv6I6QPKRhM/view',
    summary: 'Đề thi chính thức & Đáp án chi tiết Giữa kỳ môn **Computer Architecture (IT089IU - ĐHQG TP.HCM, 90 phút)**.',
    keyHighlights: [
      '**Câu 1 (30đ)**: Tính $\\text{Clock Cycles}$, $\\text{CPI}_{\\text{avg}}$ và $\\text{CPU Time}$ của P1 ($2.5\\text{ GHz}$) và P2 ($3.0\\text{ GHz}$) với $10^7$ lệnh.',
      '**Câu 2 (20đ)**: Dịch 2 đoạn code C (`if-else` và `while` truy xuất mảng `A[k - i]`) sang hợp ngữ MIPS.',
      '**Câu 3 (40đ)**: Đọc hiểu đoạn hợp ngữ MIPS duyệt mảng `MemArray` 12 phần tử, trả lời 8 câu hỏi a–h và viết lại code C.',
      '**Câu 4 & 5 (10đ)**: Phép dịch bit `sll / or / andi` và thứ tự lưu byte **Big-Endian** tại địa chỉ `0x00000002` của `0xDEADBEEF` (`0xBE`).',
    ],
  },
  {
    id: '1xK50a7a7LNO1DsHi56EDeAtjn2XyWwBw',
    title: 'midterm-solution.pdf (COMP 212 Fall 2008)',
    folder: 'Midterm',
    year: '2008 / 2021',
    size: '36 KB',
    category: 'exam',
    driveUrl: 'https://drive.google.com/file/d/1xK50a7a7LNO1DsHi56EDeAtjn2XyWwBw/view',
    summary: 'Đề thi & Lời giải Giữa kỳ **COMP 212** tập trung vào biểu diễn số, số học bù 2, $\\text{IEEE 754}$, thời gian truy cập đĩa từ và ánh xạ Cache.',
    keyHighlights: [
      '**Câu 1 (10đ)**: 10 câu Đúng/Sai (*True/False*) kinh điển về `SRAM / DRAM`, Von Neumann, EPROM, phân bố số thực.',
      '**Câu 2 & 3 (20đ)**: Biểu diễn nhị phân 16-bit không dấu và 8-bit bù 2 ($A = 54, B = -77$), kiểm tra tràn số (*Overflow*).',
      '**Câu 4 (15đ)**: Đổi $118.75$, $-(\\frac{1}{32} + \\frac{1}{128})$ và $0.15$ sang chuẩn $\\text{IEEE 754 Single Precision}$ ($\\text{Bias} = 127$).',
      '**Câu 6 (20đ)**: Hệ thống bộ nhớ $16\\text{ MB}$, Cache $512\\text{ KB}$, Block $8\\text{ B}$ — Giải mã địa chỉ `DB86E2h` và `8B86E1h` trong *Direct-Mapped* & *4-Way Set Associative*.',
    ],
  },
  {
    id: '1hyHBI_SUV5C6ZcDPhPst2rUmzyQ82-pD',
    title: 'midterm-sample.pdf (Fall 2011 Midterm Exam)',
    folder: 'Midterm',
    year: '2011 / 2021',
    size: '34 KB',
    category: 'exam',
    driveUrl: 'https://drive.google.com/file/d/1hyHBI_SUV5C6ZcDPhPst2rUmzyQ82-pD/view',
    summary: 'Đề mẫu 8 bài toán toàn diện: Chuyển đổi cơ số, **Big-Endian Motorola 68000**, Hiệu năng M1/M2, Thiết kế RAM $8\\text{ MB}$ từ chip $512\\text{K} \\times 8$, Cache & Page Table.',
    keyHighlights: [
      '**Bài 1 & 2**: Chuyển hệ cơ số $10/16/8$, trừ bù 2 5-bit và trạng thái ô nhớ Big-Endian tại `0x8200`.',
      '**Bài 3**: So sánh hiệu năng $\\text{M1 } (3.5\\text{ GHz})$ và $\\text{M2 } (4.5\\text{ GHz})$ trên 4 lớp lệnh A, B, C, D.',
      '**Bài 5 & 6**: Cache $32\\text{ KB}$ 8-way set associative ($22\\text{-bit}$ physical address) và tính kích thước Page Table ($40\\text{-bit}$ virtual address, trang $16\\text{ KB}$).',
      '**Bài 7 & 8**: 7 câu hỏi lý thuyết ngắn (`3C misses`, `Write-back vs Write-through`, `Page fault`, `TLB`) + Code MIPS tính tổng 100 words.',
    ],
  },
  {
    id: '10lnGfeznDm7xNXgPxpCyfwrQFTRP2i5m',
    title: 'F001_English_CLC_f1 (1).pdf (CO2007 Answer Key)',
    folder: 'Mr. Cuong',
    year: '2021',
    size: '355 KB',
    category: 'exam',
    driveUrl: 'https://drive.google.com/file/d/10lnGfeznDm7xNXgPxpCyfwrQFTRP2i5m/view',
    summary: 'Bộ **40 câu hỏi & đáp án chuẩn** môn Computer Architecture (**CO2007 - ĐH Bách Khoa TP.HCM**) kèm tờ **MIPS Reference Data Card**.',
    keyHighlights: [
      '**Câu 1–5 (L.O.1)**: Hiệu năng, `Throughput`, $\\text{CPI}_{\\text{avg}}$ và giảm CPI theo tỷ lệ phần trăm.',
      '**Câu 6–15 (L.O.2)**: Lệnh giả `li`, xóa 16 bit cao bằng `andi`, Stack push $ra, `lb` mở rộng dấu (`0xFFFFFFDE`), `div/mfhi/mflo` và $\\text{IEEE 754}$.',
      '**Câu 16–29 (L.O.3)**: Sơ đồ *Single-Cycle Datapath*, tín hiệu điều khiển và *Pipeline 5 tầng* (đếm `Data Hazards`, số chu kỳ có/không `Forwarding`).',
      '**Câu 30–40 (L.O.4)**: Tính tổng số bit thực tế của Cache $64\\text{ KB}$ ($593{,}920\\text{ bits}$) và CPI nhiều cấp Cache $\\text{L1 / L2}$.',
    ],
  },
  {
    id: '15-1diO5pJnq9W6rQIiBS1W9kemyxbFyB',
    title: 'C to MIPS.pdf & C to MIPS - 2.pdf',
    folder: 'Midterm',
    year: '2021',
    size: '309 KB',
    category: 'slides',
    driveUrl: 'https://drive.google.com/file/d/15-1diO5pJnq9W6rQIiBS1W9kemyxbFyB/view',
    summary: 'Slide hướng dẫn từng bước cách **biên dịch cấu trúc điều khiển ngôn ngữ C sang hợp ngữ MIPS**.',
    keyHighlights: [
      'Bảng quy ước 32 thanh ghi MIPS ($zero, $at, $v0–$v1, $a0–$a3, $t0–$t9, $s0–$s7, $gp, $sp, $fp, $ra).',
      'Mẫu dịch câu lệnh `if`, `if-else` (nhớ lệnh `j NEXT` để nhảy qua khối `else`), điều kiện kép `&&` và `||` (*short-circuiting*).',
      'Mẫu dịch `switch-case`, vòng lặp `while`, `for` và bài toán duyệt mảng tính tổng các phần tử dương/âm.',
    ],
  },
  {
    id: '1EgIbyaD-R93MbUZMO-Khw4gmkaPb_Uhh',
    title: 'HW3.pdf (Computer Arithmetic & IEEE 754)',
    folder: 'Root / Computer Architecture',
    year: '2021',
    size: '178 KB',
    category: 'homework',
    driveUrl: 'https://drive.google.com/file/d/1EgIbyaD-R93MbUZMO-Khw4gmkaPb_Uhh/view',
    summary: 'Bài tập lớn số 3 chuyên sâu về **phép trừ Hexa, sơ đồ phần cứng Nhân/Chia 6-bit** và **giải mã bit pattern đa nghĩa**.',
    keyHighlights: [
      '**Bài 1**: Tính `5ED4 - 07A4` ở dạng 16-bit không dấu và dạng dấu-độ lớn (*Sign-Magnitude*).',
      '**Bài 2**: Bảng từng bước thanh ghi `Multiplicand, Multiplier, Product` (nhân phần cứng) và `Divisor, Remainder, Quotient` (chia phần cứng).',
      '**Bài 3**: Giải mã mẫu bit `0x0C000000` dưới 4 góc độ: Số nguyên bù 2 ($201{,}326{,}592 = 3 \\times 2^{26}$), Số không dấu, Lệnh MIPS (`jal 0`) và Số thực $\\text{IEEE 754}$.',
    ],
  },
];
