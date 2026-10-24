# CA Midterm Hub

> Nền tảng ôn thi giữa kỳ **Computer Architecture** với bài học song ngữ Việt–Anh, mô phỏng tương tác và ngân hàng quiz.

CA Midterm Hub được xây dựng để hỗ trợ ôn tập các chủ đề quan trọng của môn **Computer Architecture** (`IT089IU · CO2007 · COMP 212`) theo hướng trực quan và thực hành: đọc lý thuyết, quan sát mô phỏng, luyện câu hỏi và kiểm tra lại lời giải ngay trên cùng một giao diện.

## Tính năng chính

- **Bài học song ngữ VI / EN**: chuyển nhanh giữa tiếng Việt, tiếng Anh và chế độ song ngữ.
- **Mind Map Explorer**: hệ thống hóa kiến thức theo từng chương và liên kết trực tiếp tới quiz / visualizer tương ứng.
- **Interactive Visualizers**: mô phỏng trực quan các khái niệm Computer Architecture thay vì chỉ học công thức.
- **MIPS practice**: hỗ trợ ôn C → MIPS, thanh ghi, memory access, instruction format và các dạng bài liên quan.
- **Computer Arithmetic**: Two's Complement, overflow, IEEE 754 và biểu diễn số.
- **Datapath & Pipeline**: control signals, pipeline stages, hazards, stalls và forwarding.
- **Cache & Virtual Memory**: tag / index / offset, cache mapping, TLB và các khái niệm bộ nhớ.
- **Quiz Arena**: ngân hàng câu hỏi có sẵn kết hợp với bộ sinh câu hỏi theo chủ đề.
- **Cheat Sheet & Glossary**: tra nhanh thuật ngữ Anh–Việt và công thức quan trọng trước khi thi.

## Nội dung ôn tập

Project tập trung vào các nhóm kiến thức sau:

1. **CPU Performance** — CPU Time, Clock Cycle, CPI, Average CPI, Speedup.
2. **MIPS Assembly** — instruction formats, C → MIPS, arrays, loops, bitwise operations, memory.
3. **Computer Arithmetic** — binary representation, signed numbers, Two's Complement, overflow, IEEE 754.
4. **Datapath** — instruction execution path và control signals.
5. **Pipeline** — 5-stage pipeline, data hazards, stalls, forwarding.
6. **Memory System** — cache mapping, tag/index/offset, virtual memory và TLB.

---

## Công nghệ sử dụng

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS 4**
- **Lucide React**
- **Motion**
- **KaTeX**
- **Google GenAI SDK**
- **Bun / npm**

---

## Cài đặt và chạy project

### 1. Clone repository

```bash
git clone https://github.com/hoangquan91029/CA_Midterm.git
cd CA_Midterm
```

### 2. Cài dependencies

Repo có `bun.lock`, vì vậy **Bun** là lựa chọn được khuyến nghị.

```bash
bun install
```

Hoặc dùng npm:

```bash
npm install
```

### 3. Cấu hình environment variables

Repo có sẵn file `.env.example`.

```bash
cp .env.example .env
```

Sau đó chỉnh `.env` nếu bạn sử dụng các tính năng / môi trường cần Google Gemini hoặc deployment URL:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
APP_URL="http://localhost:3000"
```

> Không commit API key thật lên GitHub. File secret/local environment nên luôn được giữ ngoài source control.

### 4. Chạy development server

Với Bun:

```bash
bun run dev
```

Hoặc npm:

```bash
npm run dev
```

Ứng dụng được cấu hình chạy ở:

```text
http://localhost:3000
```

---

## Các lệnh thường dùng

| Lệnh | Chức năng |
|---|---|
| `bun run dev` | Chạy Vite development server tại port 3000 |
| `bun run build` | Build production version vào `dist/` |
| `bun run preview` | Preview production build |
| `bun run lint` | Kiểm tra TypeScript bằng `tsc --noEmit` |
| `bun run clean` | Xóa `dist` và `server.js` |

Nếu dùng npm, thay `bun run` bằng `npm run`.

---

## Cách sử dụng CA Midterm Hub

### Học lý thuyết

Mở phần **Lý thuyết & Quiz Song ngữ** để học từng chủ đề. Bạn có thể chuyển giữa:

- `Song ngữ VI · EN`
- `VI`
- `EN`

Chế độ tiếng Anh đặc biệt hữu ích khi đề thi sử dụng thuật ngữ Computer Architecture bằng tiếng Anh.

### Dùng mô phỏng trực quan

Vào **Mô phỏng Trực quan** và chọn chủ đề cần luyện. Visualizer được thiết kế để cho phép thay đổi dữ liệu đầu vào và quan sát kết quả thay vì chỉ đọc lời giải tĩnh.

### Luyện quiz

Vào **Ngân hàng & Tự sinh Quiz** để:

- chọn chủ đề;
- trả lời câu hỏi;
- kiểm tra đáp án;
- xem giải thích;
- sinh thêm bộ câu hỏi mới.

Project khởi tạo cả câu hỏi được biên soạn sẵn và câu hỏi procedural được tạo từ logic trong source code.

### Ôn nhanh trước khi thi

Phần **Từ điển Song ngữ & Cheat Sheet** phù hợp để tra nhanh:

- thuật ngữ Anh–Việt;
- công thức;
- quy tắc tính;
- các pattern thường gặp trong đề thi.

---

## Cấu trúc project

```text
CA_Midterm/
├── public/
├── src/
│   ├── components/
│   │   ├── DriveMaterialsAndCheatSheet.tsx
│   │   ├── InteractiveVisualizers.tsx
│   │   ├── MarkdownBlock.tsx
│   │   ├── MindMapExplorer.tsx
│   │   └── QuizArena.tsx
│   ├── data/
│   │   ├── bilingualContent.ts
│   │   ├── midtermContent.ts
│   │   └── quizBank.ts
│   ├── utils/
│   │   ├── archLogic.ts
│   │   ├── archLogic.test.ts
│   │   └── quizGenerator.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### File quan trọng

| File | Vai trò |
|---|---|
| `src/App.tsx` | Layout chính, navigation, language mode và kết nối các module |
| `src/components/InteractiveVisualizers.tsx` | Các mô phỏng Computer Architecture tương tác |
| `src/components/MindMapExplorer.tsx` | Mind map / nội dung học theo chủ đề |
| `src/components/QuizArena.tsx` | Giao diện làm quiz và kiểm tra đáp án |
| `src/components/DriveMaterialsAndCheatSheet.tsx` | Tài liệu, glossary và cheat sheet |
| `src/data/bilingualContent.ts` | Nội dung song ngữ |
| `src/data/midtermContent.ts` | Nội dung kiến thức giữa kỳ |
| `src/data/quizBank.ts` | Ngân hàng câu hỏi được biên soạn sẵn |
| `src/utils/quizGenerator.ts` | Logic sinh quiz procedural |
| `src/utils/archLogic.ts` | Logic tính toán / mô phỏng kiến trúc máy tính |

---

## Thêm câu hỏi mới

Các câu hỏi được quản lý chủ yếu trong:

```text
src/data/quizBank.ts
```

Nếu muốn mở rộng hệ thống sinh câu hỏi tự động / procedural, chỉnh:

```text
src/utils/quizGenerator.ts
```

Khi thêm câu hỏi mới, nên đảm bảo:

- đáp án đúng rõ ràng;
- distractor hợp lý;
- lời giải giải thích được **vì sao**;
- thuật ngữ Việt–Anh nhất quán;
- phép tính có thể kiểm tra lại bằng logic trong `archLogic.ts` khi phù hợp.

---

## Thêm hoặc chỉnh nội dung bài học

Nội dung học tập nằm chủ yếu trong:

```text
src/data/midtermContent.ts
src/data/bilingualContent.ts
```

Nếu thêm một chủ đề mới, thường cần cập nhật đồng thời:

1. nội dung lý thuyết;
2. bản dịch / thuật ngữ song ngữ;
3. quiz tương ứng;
4. visualizer nếu chủ đề cần mô phỏng;
5. navigation trong `App.tsx` nếu tạo section mới.

---

## Kiểm tra trước khi commit

Chạy TypeScript check:

```bash
bun run lint
```

Sau đó build thử production:

```bash
bun run build
```

Nếu cả hai lệnh đều chạy thành công, project đã vượt qua các kiểm tra cơ bản trước khi push.

---

## Build production

```bash
bun run build
```

Output sẽ nằm trong:

```text
dist/
```

Có thể kiểm tra bản build bằng:

```bash
bun run preview
```

---

## Mục tiêu của project

CA Midterm Hub không chỉ là một bộ note. Mục tiêu của project là biến quá trình ôn **Computer Architecture** thành một vòng lặp học chủ động:

```text
Học khái niệm → Quan sát mô phỏng → Làm quiz → Đọc lời giải → Luyện lại
```

Thay vì ghi nhớ công thức riêng lẻ, người học có thể liên kết công thức với cách CPU, instruction, pipeline, cache và memory thực sự hoạt động.

---

## Repository

**Author:** [hoangquan91029](https://github.com/hoangquan91029)

**Repository:** [CA_Midterm](https://github.com/hoangquan91029/CA_Midterm)
