import React, { useState, useMemo } from 'react';
import { DRIVE_STUDY_DOCS } from '../data/midtermContent';
import { QUIZ_TOPIC_META, QuizTopic } from '../data/quizBank';
import { BILINGUAL_GLOSSARY, LanguageMode } from '../data/bilingualContent';
import { MarkdownBlock, renderInlineMarkdown } from './MarkdownBlock';
import {
  FolderOpen,
  ExternalLink,
  Table,
  BookMarked,
  Languages,
  Search,
} from 'lucide-react';

interface DriveMaterialsAndCheatSheetProps {
  langMode?: LanguageMode;
}

export const DriveMaterialsAndCheatSheet: React.FC<DriveMaterialsAndCheatSheetProps> = ({
  langMode = 'bilingual',
}) => {
  const [selectedDocCategory, setSelectedDocCategory] = useState<'all' | 'exam' | 'slides' | 'homework'>('all');
  const [glossaryTopic, setGlossaryTopic] = useState<QuizTopic | 'all'>('all');
  const [glossarySearch, setGlossarySearch] = useState<string>('');

  const docs = DRIVE_STUDY_DOCS.filter(
    (d) => selectedDocCategory === 'all' || d.category === selectedDocCategory
  );

  const filteredGlossary = useMemo(() => {
    const q = glossarySearch.trim().toLowerCase();
    return BILINGUAL_GLOSSARY.filter((item) => {
      const matchTopic = glossaryTopic === 'all' || item.topic === glossaryTopic;
      if (!matchTopic) return false;
      if (!q) return true;
      return (
        item.enTerm.toLowerCase().includes(q) ||
        item.viTerm.toLowerCase().includes(q) ||
        item.enDef.toLowerCase().includes(q) ||
        item.viDef.toLowerCase().includes(q)
      );
    });
  }, [glossaryTopic, glossarySearch]);

  const mipsRegisters = [
    {
      num: '0',
      name: '$zero',
      useVi: 'Hằng số `0` cố định (*Hardwired 0*)',
      useEn: 'Constant value `0` (*Hardwired zero*)',
      preserved: 'N/A',
    },
    {
      num: '1',
      name: '$at',
      useVi: 'Thanh ghi tạm dành riêng cho Assembler (*Pseudo-instructions*)',
      useEn: 'Assembler Temporary (reserved for expanding *pseudo-instructions*)',
      preserved: 'No / Không',
    },
    {
      num: '2–3',
      name: '$v0–$v1',
      useVi: 'Giá trị trả về của hàm & mã lệnh `syscall` (`$v0=1` in int, `$v0=10` exit)',
      useEn: 'Function return values & `syscall` service code (`$v0=1` print int, `$v0=10` exit)',
      preserved: 'No / Không',
    },
    {
      num: '4–7',
      name: '$a0–$a3',
      useVi: '4 đối số (*Arguments*) truyền vào thủ tục/hàm',
      useEn: '4 procedure arguments passed to callee',
      preserved: 'No / Không',
    },
    {
      num: '8–15',
      name: '$t0–$t7',
      useVi: 'Thanh ghi tạm (*Temporaries*) — hàm con dùng tự do không cần lưu',
      useEn: 'Caller-saved Temporaries — not preserved across procedure calls',
      preserved: 'No / Không',
    },
    {
      num: '16–23',
      name: '$s0–$s7',
      useVi: 'Thanh ghi lưu (*Saved*) — **bắt buộc bảo toàn** qua lời gọi hàm (push Stack)',
      useEn: 'Callee-saved registers — **must be preserved** across calls (push onto Stack)',
      preserved: 'Yes / Có',
    },
    {
      num: '24–25',
      name: '$t8–$t9',
      useVi: 'Thanh ghi tạm bổ sung (*More Temporaries*)',
      useEn: 'Additional Caller-saved Temporaries',
      preserved: 'No / Không',
    },
    {
      num: '28',
      name: '$gp',
      useVi: 'Con trỏ toàn cục (*Global Pointer* — dữ liệu tĩnh)',
      useEn: 'Global Pointer (points to static data segment)',
      preserved: 'Yes / Có',
    },
    {
      num: '29',
      name: '$sp',
      useVi: 'Con trỏ ngăn xếp (**Stack Pointer** — phát triển từ cao xuống thấp)',
      useEn: 'Stack Pointer (**grows downward** from high to low addresses)',
      preserved: 'Yes / Có',
    },
    {
      num: '30',
      name: '$fp',
      useVi: 'Con trỏ khung ngăn xếp (*Frame Pointer*)',
      useEn: 'Frame Pointer (procedure activation record base)',
      preserved: 'Yes / Có',
    },
    {
      num: '31',
      name: '$ra',
      useVi: 'Địa chỉ trả về (**Return Address** — được ghi bởi lệnh `jal`)',
      useEn: 'Return Address (**written by `jal`**, used by `jr $ra`)',
      preserved: 'Yes / Có',
    },
  ];

  const markdownCheatSheetVi = `### 1. Hiệu năng CPU & Phương trình Thời gian Thực thi (CPU Performance)
- **Tổng số chu kỳ máy (Clock Cycles)**: $\\text{Clock Cycles} = \\sum_{i=1}^{n} (\\text{IC}_i \\times \\text{CPI}_i) = \\text{IC} \\times \\text{CPI}_{\\text{avg}}$
- **Thời gian thực thi (CPU Time)**: $\\text{CPU Time} = \\dfrac{\\text{Clock Cycles}}{\\text{Clock Rate}} = \\text{Clock Cycles} \\times T_{\\text{cycle}}$
- **CPI thực tế có Cache (Effective CPI)**: $\\text{CPI}_{\\text{real}} = \\text{CPI}_{\\text{base}} + \\sum (\\text{Miss Rate}_k \\times \\text{Penalty}_k)$

### 2. Dịch C sang Hợp ngữ MIPS & Truy xuất Mảng (C-to-MIPS & Arrays)
- **Địa chỉ phần tử mảng 32-bit (Word Array)**: $\\text{Address}(A[i]) = \\text{Base } (\\$s3) + (i \\times 4)$ $\\rightarrow$ Dùng \`sll $t0, $s0, 2\` rồi \`add $t0, $s3, $t0\`.
- **Địa chỉ nhảy Branch (PC-Relative)**: $\\text{PC}_{\\text{branch}} = (\\text{PC} + 4) + (\\text{SignExtImm} \\times 4)$
- **Địa chỉ nhảy Jump (Pseudo-Direct)**: $\\text{PC}_{\\text{jump}} = \\{\\ (\\text{PC} + 4)[31:28],\\ \\text{address}[25:0],\\ 00_2\\ \\}$

### 3. Thời gian Truy cập Đĩa từ (Magnetic Disk Access - COMP 212 Q5)
- **Công thức tổng**: $T(X) = T_{\\text{seek}} + T_{\\text{rotation avg}} + T_{\\text{transfer}}(X)$
- **Độ trễ quay trung bình**: $T_{\\text{rotation avg}} = \\dfrac{0.5}{\\text{RPM} / 60}\\text{ (seconds)}$

### 4. Phân hoạch Địa chỉ Cache & Bảng Trang (Cache & Virtual Memory)
- **Số bit Byte Offset**: $b = \\log_2(\\text{Block Size in Bytes})$
- **Số bit Index (Line / Set)**: $s = \\log_2\\!\\left(\\dfrac{\\text{Cache Data Bytes}}{\\text{Block Size} \\times k}\\right)$
- **Tổng số bit phần cứng Cache**: $\\text{Total Bits} = \\text{Num Blocks} \\times (1_{\\text{valid}} + t_{\\text{tag}} + \\text{Data Bits/Block})$`;

  return (
    <section id="materials-section" className="py-10 scroll-mt-16 bg-slate-50">
      <div className="max-w-[1280px] mx-auto px-6 space-y-12">
        {/* Part 1: Searchable Bilingual Computer Architecture Terminology Dictionary */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 mb-5 border-b border-slate-200">
            <div>
              <p className="text-xs font-semibold tracking-wider text-indigo-700 uppercase mb-1">
                Bilingual Computer Architecture Dictionary · Từ điển Thuật ngữ Phòng thi (EN ↔ VI)
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                04. Từ điển Thuật ngữ Song ngữ Anh – Việt (6 Chương Trọng tâm)
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-3xl">
                Tra cứu nhanh các thuật ngữ tiếng Anh xuất hiện trong đề thi <strong className="text-slate-900">IT089IU, COMP 212, Fall 2011, CO2007</strong> cùng giải nghĩa tiếng Việt và công thức đi kèm.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  aria-label="Tìm kiếm thuật ngữ song ngữ"
                  placeholder="Tìm Throughput, Stall, TLB..."
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 w-56"
                />
              </div>

              <select
                aria-label="Lọc từ điển theo chương"
                value={glossaryTopic}
                onChange={(e) => setGlossaryTopic(e.target.value as QuizTopic | 'all')}
                className="px-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="all">Tất cả 6 chương ({BILINGUAL_GLOSSARY.length} thuật ngữ)</option>
                <option value="performance">Chương 1: Hiệu năng CPU</option>
                <option value="mips">Chương 2: Tập lệnh MIPS</option>
                <option value="arithmetic">Chương 3: Số học & IEEE 754</option>
                <option value="datapath">Chương 4: Datapath & Pipeline</option>
                <option value="cache">Chương 5: Cache & Bộ nhớ Ảo</option>
                <option value="assembler">Chương 6: Stack, Assembler & SPIM</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGlossary.map((term) => (
              <div
                key={term.id}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 mb-1.5">
                    <span className="font-semibold text-indigo-700">
                      {QUIZ_TOPIC_META[term.topic].shortLabel}
                    </span>
                    <Languages className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>

                  <div className="text-sm font-bold text-slate-900 leading-snug">
                    {term.enTerm}
                  </div>
                  <div className="text-xs font-semibold text-sky-700 mt-0.5 mb-2.5">
                    🇻🇳 {term.viTerm}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700 leading-relaxed mb-3">
                    {(langMode === 'bilingual' || langMode === 'vi') && (
                      <div>
                        <span className="font-mono text-[10px] font-bold text-slate-500 mr-1">
                          [VI]
                        </span>
                        {renderInlineMarkdown(term.viDef)}
                      </div>
                    )}
                    {(langMode === 'bilingual' || langMode === 'en') && (
                      <div className="text-slate-600">
                        <span className="font-mono text-[10px] font-bold text-indigo-700 mr-1">
                          [EN]
                        </span>
                        {renderInlineMarkdown(term.enDef)}
                      </div>
                    )}
                  </div>
                </div>

                {term.formulaOrCode && (
                  <div className="pt-2 border-t border-slate-200/80 text-xs text-sky-950 font-medium overflow-x-auto">
                    {renderInlineMarkdown(term.formulaOrCode)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Part 2: MIPS Green Card & Formula Cheat Sheet */}
        <div>
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-wider text-sky-700 uppercase mb-1">
              MIPS Reference Card & Bilingual Markdown Formula Sheet
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              05. Bảng Tra cứu Nhanh MIPS Green Card & Sổ tay Công thức Song ngữ
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Tổng hợp quy ước 32 thanh ghi MIPS (song ngữ Việt – Anh), khuôn dạng lệnh R/I/J và sổ tay công thức định dạng KaTeX dành cho bài thi cho phép mang tài liệu viết tay (*Handwritten notes allowed*).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Register Convention Table (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
                <Table className="w-4 h-4 text-sky-600" />
                <span>
                  Bảng Quy ước 32 Thanh ghi MIPS Song ngữ (MIPS Register Conventions)
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="py-2 px-3">Số / No.</th>
                      <th className="py-2 px-3">Tên / Name</th>
                      <th className="py-2 px-3">Công dụng (VI / EN Role)</th>
                      <th className="py-2 px-3">Bảo toàn?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {mipsRegisters.map((r) => (
                      <tr key={r.name} className="hover:bg-slate-50/80 align-top">
                        <td className="py-2 px-3 font-mono text-slate-500 tabular-nums">{r.num}</td>
                        <td className="py-2 px-3 font-mono font-bold text-sky-700">{r.name}</td>
                        <td className="py-2 px-3 text-slate-700 space-y-0.5">
                          {(langMode === 'bilingual' || langMode === 'vi') && (
                            <div>{renderInlineMarkdown(r.useVi)}</div>
                          )}
                          {(langMode === 'bilingual' || langMode === 'en') && (
                            <div className="text-[11px] text-indigo-900/80">
                              {renderInlineMarkdown(r.useEn)}
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-800 whitespace-nowrap">
                          {r.preserved}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Golden Exam Formulas Card in Markdown (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                <BookMarked className="w-4 h-4 text-sky-600" />
                <span>Sổ tay Công thức Trọng tâm (Bilingual Cheat Sheet)</span>
              </div>
              <MarkdownBlock content={markdownCheatSheetVi} />
            </div>
          </div>
        </div>

        {/* Part 3: Google Drive Folder Repository */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold tracking-wider text-sky-700 uppercase mb-1">
                Google Drive Archive · Computer Architecture
              </p>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                06. Kho Tài liệu & Đề thi Gốc từ Google Drive (Tóm tắt Markdown)
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Tóm tắt nội dung cốt lõi của các tệp PDF trong thư mục Google Drive được chia sẻ cùng liên kết mở trực tiếp.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-lg">
              {[
                { id: 'all', label: 'Tất cả (6)' },
                { id: 'exam', label: 'Đề thi & Đáp án (4)' },
                { id: 'slides', label: 'Slide bài giảng (1)' },
                { id: 'homework', label: 'Bài tập lớn (1)' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedDocCategory(cat.id as 'all' | 'exam' | 'slides' | 'homework')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedDocCategory === cat.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <FolderOpen className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>{doc.folder}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{doc.year}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{doc.size}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {renderInlineMarkdown(doc.summary)}
                  </p>

                  <ul className="space-y-1.5 mb-5 text-xs text-slate-700">
                    {doc.keyHighlights.map((hl, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-sky-600 font-bold shrink-0">•</span>
                        <span>{renderInlineMarkdown(hl)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">PDF Document</span>
                  <a
                    href={doc.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-800"
                  >
                    <span>Mở file trên Google Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
