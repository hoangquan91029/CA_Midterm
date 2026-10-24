import React, { useState, useMemo } from 'react';
import { NOTEBOOKLM_MINDMAP, MindMapNode } from '../data/midtermContent';
import { QuizQuestion, QuizTopic, QUIZ_TOPIC_META } from '../data/quizBank';
import {
  LanguageMode,
  getNodeEnContent,
  BILINGUAL_GLOSSARY,
  resolveBilingualQuestion,
} from '../data/bilingualContent';
import { MarkdownBlock, renderInlineMarkdown } from './MarkdownBlock';
import {
  ChevronRight,
  ChevronDown,
  BookOpen,
  Sliders,
  Search,
  FileCode2,
  Lightbulb,
  Sparkles,
  CheckCircle2,
  XCircle,
  BookOpenCheck,
  ArrowRight,
  Languages,
} from 'lucide-react';

interface MindMapExplorerProps {
  onOpenVisualizer: (tab: 'performance' | 'mips' | 'arithmetic' | 'datapath' | 'cache') => void;
  allQuestions: QuizQuestion[];
  userAnswers: Record<string, number>;
  onSelectAnswer: (questionId: string, optionIdx: number) => void;
  onGenerateForTopic: (topic: QuizTopic, count: number) => void;
  onJumpToQuizTopic: (topic: QuizTopic) => void;
  langMode: LanguageMode;
  onLangModeChange: (mode: LanguageMode) => void;
}

export function mapNodeIdToQuizTopic(nodeId: string): QuizTopic {
  if (nodeId.startsWith('cat-1')) return 'performance';
  if (nodeId.startsWith('cat-2-3') || nodeId.startsWith('cat-6')) return 'assembler';
  if (nodeId.startsWith('cat-2')) return 'mips';
  if (nodeId.startsWith('cat-3')) return 'arithmetic';
  if (nodeId.startsWith('cat-4')) return 'datapath';
  if (nodeId.startsWith('cat-5')) return 'cache';
  return 'performance';
}

export const MindMapExplorer: React.FC<MindMapExplorerProps> = ({
  onOpenVisualizer,
  allQuestions,
  userAnswers,
  onSelectAnswer,
  onGenerateForTopic,
  onJumpToQuizTopic,
  langMode,
  onLangModeChange,
}) => {
  const [selectedNode, setSelectedNode] = useState<MindMapNode>(
    NOTEBOOKLM_MINDMAP.children ? NOTEBOOKLM_MINDMAP.children[0] : NOTEBOOKLM_MINDMAP
  );
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    root: true,
    'cat-1': true,
    'cat-2': true,
    'cat-3': true,
    'cat-4': true,
    'cat-5': true,
    'cat-6': true,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMiniQuizIdx, setActiveMiniQuizIdx] = useState<number>(0);

  const activeTopic: QuizTopic = useMemo(
    () => mapNodeIdToQuizTopic(selectedNode.id),
    [selectedNode.id]
  );

  const enNodeContent = useMemo(() => getNodeEnContent(selectedNode), [selectedNode]);

  const chapterGlossary = useMemo(
    () => BILINGUAL_GLOSSARY.filter((item) => item.topic === activeTopic),
    [activeTopic]
  );

  // Filter questions relevant to the currently selected Mind Map node (or its chapter topic)
  const nodeQuestions = useMemo(() => {
    const exactOrChildMatches = allQuestions.filter(
      (q) =>
        q.mindMapNodeId.startsWith(selectedNode.id) ||
        selectedNode.id.startsWith(q.mindMapNodeId)
    );
    const topicMatches = allQuestions.filter((q) => q.topic === activeTopic);
    const combined = [...exactOrChildMatches];
    for (const tq of topicMatches) {
      if (!combined.some((c) => c.id === tq.id)) {
        combined.push(tq);
      }
    }
    return combined;
  }, [allQuestions, selectedNode.id, activeTopic]);

  const clampedQuizIdx =
    nodeQuestions.length > 0 ? Math.min(activeMiniQuizIdx, nodeQuestions.length - 1) : 0;
  const currentMiniQuestion = nodeQuestions[clampedQuizIdx];
  const bilingualMiniQ = useMemo(
    () => (currentMiniQuestion ? resolveBilingualQuestion(currentMiniQuestion) : null),
    [currentMiniQuestion]
  );

  const handleSelectNode = (node: MindMapNode) => {
    setSelectedNode(node);
    setActiveMiniQuizIdx(0);
  };

  const handleGenerateInline = () => {
    onGenerateForTopic(activeTopic, 1);
    setActiveMiniQuizIdx(0);
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    const traverse = (n: MindMapNode) => {
      all[n.id] = true;
      n.children?.forEach(traverse);
    };
    traverse(NOTEBOOKLM_MINDMAP);
    setExpandedIds(all);
  };

  const collapseSubtrees = () => {
    setExpandedIds({ root: true });
  };

  const matchesSearch = (node: MindMapNode, q: string): boolean => {
    if (!q.trim()) return true;
    const lower = q.toLowerCase();
    const selfMatch =
      node.name.toLowerCase().includes(lower) ||
      node.viTitle.toLowerCase().includes(lower) ||
      node.summary.toLowerCase().includes(lower);
    if (selfMatch) return true;
    return Boolean(node.children?.some((child) => matchesSearch(child, q)));
  };

  const renderTreeNode = (node: MindMapNode, depth: number = 0) => {
    if (!matchesSearch(node, searchQuery)) return null;
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isExpanded = Boolean(expandedIds[node.id]) || Boolean(searchQuery.trim());
    const isSelected = selectedNode.id === node.id;

    const primaryTitle = langMode === 'en' ? node.name : node.viTitle;
    const secondaryTitle = langMode === 'en' ? node.viTitle : node.name;

    return (
      <div key={node.id} className="select-none">
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleSelectNode(node)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSelectNode(node);
            }
          }}
          className={`group flex items-start gap-2.5 py-2.5 px-3 rounded-lg cursor-pointer transition-colors text-left ${
            isSelected
              ? 'bg-sky-600 text-white shadow-xs'
              : 'hover:bg-slate-100 text-slate-800'
          }`}
          style={{ marginLeft: `${depth * 16}px` }}
        >
          {hasChildren ? (
            <button
              type="button"
              aria-label={isExpanded ? `Thu gọn ${node.viTitle}` : `Mở rộng ${node.viTitle}`}
              onClick={(e) => toggleExpand(node.id, e)}
              className={`mt-0.5 p-0.5 rounded transition-colors shrink-0 ${
                isSelected ? 'hover:bg-sky-500 text-white' : 'hover:bg-slate-200 text-slate-500'
              }`}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          ) : (
            <span className="w-5 shrink-0 flex justify-center mt-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSelected ? 'bg-white' : 'bg-slate-400'
                }`}
              />
            </span>
          )}

          <div className="min-w-0 flex-1">
            <div
              className={`text-sm font-semibold leading-snug ${
                isSelected ? 'text-white' : depth === 0 ? 'text-slate-900' : 'text-slate-800'
              }`}
            >
              {primaryTitle}
            </div>
            {langMode !== 'vi' && (
              <div
                className={`text-xs mt-0.5 truncate font-mono ${
                  isSelected ? 'text-sky-100' : 'text-slate-500'
                }`}
              >
                {secondaryTitle}
              </div>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1 border-l border-slate-200 ml-4 pl-1">
            {node.children!.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="mindmap-section" className="py-10 scroll-mt-16 border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold tracking-wider text-sky-700 uppercase mb-1">
              NotebookLM Artifact · 155 Sources · Bilingual Lecture & Topic Quiz (Song ngữ Việt – Anh)
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              01. Sơ đồ Tư duy Song ngữ, Bài giảng Công thức & Quiz Từng Kiến thức
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Hiển thị song song <strong className="text-slate-900">Tiếng Việt & Tiếng Anh chuyên ngành (Original English Exam Terms)</strong> kèm <strong className="text-slate-900">Trạm Luyện Quiz Trực tiếp</strong> và nút <strong className="text-indigo-700">Tự sinh câu hỏi song ngữ</strong> ở từng mục kiến thức.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                aria-label="Tìm kiếm chủ đề trong sơ đồ tư duy"
                placeholder="Tìm CPI, MIPS, IEEE 754, Cache..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 w-56"
              />
            </div>
            <button
              type="button"
              onClick={expandAll}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Mở rộng tất cả
            </button>
            <button
              type="button"
              onClick={collapseSubtrees}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Thu gọn
            </button>
          </div>
        </div>

        {/* Quick Chapter Pills for 1-Click Jump */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5">
          <span className="text-xs font-semibold text-slate-500 mr-1">Chọn nhanh chương:</span>
          {NOTEBOOKLM_MINDMAP.children?.map((ch, idx) => {
            const active = selectedNode.id.startsWith(ch.id);
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => handleSelectNode(ch)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {langMode === 'en'
                  ? `Ch.${idx + 1}: ${ch.name}`
                  : `Chương ${idx + 1}: ${ch.viTitle.replace(/^\d+\.\s*/, '').split('&')[0].trim()}`}
              </button>
            );
          })}
        </div>

        {/* Two-Zone Sandbox Layout: 5 cols Tree + 7 cols Rich Markdown Reader + Inline Topic Quiz */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Zone: Interactive Mind Map Tree (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 max-h-[960px] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs text-slate-500">
              <span>Cây phân cấp 6 chương · Song ngữ VI / EN</span>
              <span className="font-mono">155 sources</span>
            </div>
            <div className="space-y-1">
              {NOTEBOOKLM_MINDMAP.children?.map((branch) => renderTreeNode(branch, 0))}
            </div>
          </div>

          {/* Right Zone: Rich Markdown Document Viewer + Inline Topic Quiz (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="font-mono text-slate-700">{selectedNode.id.toUpperCase()}</span>
                </div>

                {/* Inline Language Switcher inside Reader */}
                <div
                  role="group"
                  aria-label="Chế độ ngôn ngữ bài giảng"
                  className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200"
                >
                  {(
                    [
                      { id: 'bilingual', label: 'Song ngữ VI + EN' },
                      { id: 'vi', label: 'Tiếng Việt' },
                      { id: 'en', label: 'English' },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => onLangModeChange(m.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                        langMode === m.id
                          ? 'bg-white text-sky-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {selectedNode.relatedVisualizerTab && (
                  <button
                    type="button"
                    onClick={() => onOpenVisualizer(selectedNode.relatedVisualizerTab!)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Sliders className="w-3.5 h-3.5 text-sky-600" />
                    <span>{langMode === 'en' ? 'Open Visualizer' : 'Mô phỏng Trực quan'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onJumpToQuizTopic(activeTopic)}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>
                    {langMode === 'en'
                      ? `Practice all ${nodeQuestions.length} Qs`
                      : `Luyện toàn bộ ${nodeQuestions.length} câu phần này`}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bilingual Node Heading */}
            {langMode === 'en' ? (
              <>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {selectedNode.name}
                </h3>
                <p className="text-xs font-medium text-slate-500 mt-1 mb-4">
                  Vietnamese Title: {selectedNode.viTitle}
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {selectedNode.viTitle}
                </h3>
                <p className="text-xs font-mono font-semibold text-sky-700 mt-1 mb-4">
                  English Term / NotebookLM Node: {selectedNode.name}
                </p>
              </>
            )}

            {/* Lecture Body: Vietnamese, English, or Both (Bilingual) */}
            <div className="space-y-4 mb-5">
              {(langMode === 'bilingual' || langMode === 'vi') && (
                <div className="bg-slate-50/70 border border-slate-200/90 rounded-xl p-5">
                  {langMode === 'bilingual' && (
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 text-xs font-bold text-slate-700">
                      <span>[VI] BÀI GIẢNG TIẾNG VIỆT & CÔNG THỨC TRỌNG TÂM</span>
                      <span className="font-mono text-slate-500">Vietnamese Explanation</span>
                    </div>
                  )}
                  <MarkdownBlock content={selectedNode.summary} />
                </div>
              )}

              {(langMode === 'bilingual' || langMode === 'en') && (
                <div className="bg-indigo-50/35 border border-indigo-200/80 rounded-xl p-5">
                  {langMode === 'bilingual' && (
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-indigo-200/70 text-xs font-bold text-indigo-900">
                      <span>[EN] ENGLISH ACADEMIC LECTURE NOTES (ORIGINAL EXAM TERMINOLOGY)</span>
                      <span className="font-mono text-indigo-700">English Reference</span>
                    </div>
                  )}
                  <MarkdownBlock content={enNodeContent.enSummary} />
                </div>
              )}
            </div>

            {selectedNode.formula && (
              <div className="bg-sky-950 text-white rounded-xl p-4 mb-5 border border-sky-800 shadow-xs">
                <div className="text-xs text-sky-300 mb-2 font-semibold flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>
                    {langMode === 'en'
                      ? 'Core Mathematical Formula / Encoding Structure:'
                      : 'Công thức / Cấu trúc chuẩn trong phòng thi (Core Exam Formula):'}
                  </span>
                </div>
                <div className="bg-white text-slate-900 rounded-lg px-4 py-3 text-sm font-medium overflow-x-auto">
                  {renderInlineMarkdown(selectedNode.formula)}
                </div>
              </div>
            )}

            {(selectedNode.examTip || enNodeContent.enExamTip) && (
              <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 mb-5 space-y-3">
                <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    {langMode === 'en'
                      ? 'Midterm Exam Strategy & Problem-Solving Tips:'
                      : 'Bí quyết Giải nhanh Đề thi Giữa kỳ (Song ngữ VI / EN):'}
                  </span>
                </div>
                {(langMode === 'bilingual' || langMode === 'vi') && selectedNode.examTip && (
                  <div>
                    {langMode === 'bilingual' && (
                      <div className="text-[11px] font-bold text-amber-800 uppercase mb-1">
                        [VI] Mẹo giải nhanh Tiếng Việt:
                      </div>
                    )}
                    <MarkdownBlock content={selectedNode.examTip} />
                  </div>
                )}
                {(langMode === 'bilingual' || langMode === 'en') && enNodeContent.enExamTip && (
                  <div className={langMode === 'bilingual' && selectedNode.examTip ? 'pt-2.5 border-t border-amber-200/80' : ''}>
                    {langMode === 'bilingual' && (
                      <div className="text-[11px] font-bold text-amber-900 uppercase mb-1">
                        [EN] English Exam Strategy:
                      </div>
                    )}
                    <MarkdownBlock content={enNodeContent.enExamTip} />
                  </div>
                )}
              </div>
            )}

            {/* ==================== CHAPTER BILINGUAL KEY TERMS TABLE ==================== */}
            {chapterGlossary.length > 0 && (
              <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                    <Languages className="w-4 h-4 text-indigo-600" />
                    <span>
                      Từ điển Thuật ngữ Phòng thi Song ngữ ({QUIZ_TOPIC_META[activeTopic].shortLabel} · EN ↔ VI)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {chapterGlossary.length} thuật ngữ cốt lõi
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <th className="py-2 px-2.5 font-semibold">English Term (Đề thi Tiếng Anh)</th>
                        <th className="py-2 px-2.5 font-semibold">Thuật ngữ Tiếng Việt</th>
                        <th className="py-2 px-2.5 font-semibold">Giải nghĩa Song ngữ & Công thức</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {chapterGlossary.map((g) => (
                        <tr key={g.id} className="hover:bg-slate-50/80 align-top">
                          <td className="py-2 px-2.5 font-bold text-indigo-900 whitespace-nowrap">
                            {g.enTerm}
                          </td>
                          <td className="py-2 px-2.5 font-semibold text-slate-900">
                            {g.viTerm}
                          </td>
                          <td className="py-2 px-2.5 text-slate-700 space-y-1">
                            {(langMode === 'bilingual' || langMode === 'vi') && (
                              <div>
                                <span className="font-mono text-[10px] font-bold text-slate-500 mr-1">
                                  [VI]
                                </span>
                                {renderInlineMarkdown(g.viDef)}
                              </div>
                            )}
                            {(langMode === 'bilingual' || langMode === 'en') && (
                              <div className="text-slate-600">
                                <span className="font-mono text-[10px] font-bold text-indigo-700 mr-1">
                                  [EN]
                                </span>
                                {renderInlineMarkdown(g.enDef)}
                              </div>
                            )}
                            {g.formulaOrCode && (
                              <div className="text-[11px] text-sky-900 bg-sky-50 border border-sky-200/80 px-2 py-0.5 rounded inline-block mt-0.5">
                                {renderInlineMarkdown(g.formulaOrCode)}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==================== INLINE BILINGUAL TOPIC QUIZ CARD ==================== */}
            {currentMiniQuestion && bilingualMiniQ && (
              <div className="mt-5 mb-5 rounded-xl border-2 border-sky-200 bg-sky-50/40 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-sky-200/80">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                      <BookOpenCheck className="w-4 h-4 text-sky-600" />
                      <span>
                        Quiz Thực hành Song ngữ Tại chỗ · {QUIZ_TOPIC_META[activeTopic].shortLabel} (Câu{' '}
                        {clampedQuizIdx + 1}/{nodeQuestions.length})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Đề bài hiển thị song ngữ Việt – Anh chuẩn đề thi IT089IU / COMP 212 · Bấm nút bên phải để tự sinh thêm câu mới
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateInline}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {langMode === 'en' ? '+ Auto-Generate 1 New Q' : '+ Tự sinh thêm 1 câu mới'}
                    </span>
                  </button>
                </div>

                {/* Question Selector Pills */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  {nodeQuestions.map((nq, idx) => {
                    const answered = userAnswers[nq.id] !== undefined;
                    const right = userAnswers[nq.id] === nq.correctIndex;
                    const isCurrent = idx === clampedQuizIdx;
                    return (
                      <button
                        key={nq.id}
                        type="button"
                        onClick={() => setActiveMiniQuizIdx(idx)}
                        className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-sky-600 text-white'
                            : answered
                            ? right
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-rose-100 text-rose-900 border border-rose-300'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {langMode === 'en' ? `Q${idx + 1}` : `Câu ${idx + 1}`}
                        {nq.isGenerated ? ' ⚡' : ''}
                      </button>
                    );
                  })}
                </div>

                {/* Current Question Content */}
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mb-2">
                    <span className="font-semibold text-sky-700">{currentMiniQuestion.sourceExam}</span>
                    <span>·</span>
                    <span>
                      {langMode === 'en'
                        ? bilingualMiniQ.enTopicLabel
                        : langMode === 'vi'
                        ? bilingualMiniQ.viTopicLabel
                        : `${bilingualMiniQ.viTopicLabel} / ${bilingualMiniQ.enTopicLabel}`}
                    </span>
                    <span>·</span>
                    <span>Mức độ: {currentMiniQuestion.difficulty}</span>
                  </div>

                  {/* Question Stem (VI, EN, or Bilingual) */}
                  <div className="space-y-2 mb-3">
                    {(langMode === 'bilingual' || langMode === 'vi') && (
                      <div className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                        {langMode === 'bilingual' && (
                          <span className="font-mono text-[11px] font-extrabold text-sky-700 mr-1.5">
                            [VI]
                          </span>
                        )}
                        {renderInlineMarkdown(bilingualMiniQ.viQuestion)}
                      </div>
                    )}
                    {(langMode === 'bilingual' || langMode === 'en') && (
                      <div
                        className={`text-xs sm:text-sm leading-relaxed ${
                          langMode === 'en'
                            ? 'font-bold text-slate-900'
                            : 'font-medium text-indigo-950 bg-indigo-50/50 border border-indigo-100 rounded-lg p-2.5'
                        }`}
                      >
                        {langMode === 'bilingual' && (
                          <span className="font-mono text-[11px] font-extrabold text-indigo-700 mr-1.5">
                            [EN]
                          </span>
                        )}
                        {renderInlineMarkdown(bilingualMiniQ.enQuestion)}
                      </div>
                    )}
                  </div>

                  {currentMiniQuestion.codeSnippet && (
                    <pre className="bg-slate-900 text-emerald-300 font-mono text-xs p-3 rounded-lg mb-3 overflow-x-auto leading-relaxed">
                      <code>{currentMiniQuestion.codeSnippet}</code>
                    </pre>
                  )}

                  <div className="grid grid-cols-1 gap-2">
                    {bilingualMiniQ.viOptions.map((viOpt, optIdx) => {
                      const enOpt = bilingualMiniQ.enOptions[optIdx] || viOpt;
                      const chosen = userAnswers[currentMiniQuestion.id];
                      const isAnswered = chosen !== undefined;
                      const isSelected = chosen === optIdx;
                      const isRight = optIdx === currentMiniQuestion.correctIndex;

                      let btnClass =
                        'bg-slate-50/70 border-slate-200 text-slate-800 hover:border-sky-400 hover:bg-sky-50/40';
                      if (isAnswered) {
                        if (isRight) {
                          btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold';
                        } else if (isSelected) {
                          btnClass = 'bg-rose-50 border-rose-400 text-rose-950';
                        } else {
                          btnClass = 'bg-white/60 border-slate-200 text-slate-500';
                        }
                      }

                      const showDualOption =
                        langMode === 'bilingual' && enOpt.trim() !== viOpt.trim();

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => onSelectAnswer(currentMiniQuestion.id, optIdx)}
                          className={`text-left p-3 rounded-lg border text-xs leading-relaxed transition-all flex items-start gap-2.5 cursor-pointer ${btnClass}`}
                        >
                          <span className="font-mono font-bold text-slate-500 shrink-0 mt-0.5">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <div className="flex-1 space-y-1">
                            <div>
                              {renderInlineMarkdown(langMode === 'en' ? enOpt : viOpt)}
                            </div>
                            {showDualOption && (
                              <div className="text-[11px] text-indigo-900/85 pt-1 border-t border-slate-200/60">
                                <span className="font-mono text-[10px] font-bold text-indigo-700 mr-1">
                                  [EN]
                                </span>
                                {renderInlineMarkdown(enOpt)}
                              </div>
                            )}
                          </div>
                          {isAnswered && isRight && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          )}
                          {isAnswered && isSelected && !isRight && (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {userAnswers[currentMiniQuestion.id] !== undefined && (
                    <div className="mt-3 pt-3 border-t border-slate-200 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                        {userAnswers[currentMiniQuestion.id] === currentMiniQuestion.correctIndex ? (
                          <span className="text-emerald-700">
                            ● CHÍNH XÁC (CORRECT)! Đáp án đúng là{' '}
                            {String.fromCharCode(65 + currentMiniQuestion.correctIndex)}
                          </span>
                        ) : (
                          <span className="text-rose-700">
                            ▲ CHƯA ĐÚNG (INCORRECT) — Đáp án đúng là{' '}
                            {String.fromCharCode(65 + currentMiniQuestion.correctIndex)}
                          </span>
                        )}
                        {currentMiniQuestion.formulaUsed && (
                          <div className="text-xs text-sky-950 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded font-medium">
                            {renderInlineMarkdown(currentMiniQuestion.formulaUsed)}
                          </div>
                        )}
                      </div>

                      {(langMode === 'bilingual' || langMode === 'vi') && (
                        <div>
                          {langMode === 'bilingual' && (
                            <div className="text-[11px] font-bold text-slate-700 uppercase mb-1">
                              [VI] Giải thích chi tiết Tiếng Việt:
                            </div>
                          )}
                          <MarkdownBlock content={bilingualMiniQ.viExplanation} />
                        </div>
                      )}

                      {(langMode === 'bilingual' || langMode === 'en') && (
                        <div
                          className={
                            langMode === 'bilingual'
                              ? 'pt-2.5 border-t border-slate-200/80 bg-indigo-50/30 p-3 rounded-lg'
                              : ''
                          }
                        >
                          {langMode === 'bilingual' && (
                            <div className="text-[11px] font-bold text-indigo-900 uppercase mb-1">
                              [EN] Step-by-Step English Solution:
                            </div>
                          )}
                          <MarkdownBlock content={bilingualMiniQ.enExplanation} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedNode.children && selectedNode.children.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                  Khám phá các mục con thuộc nhánh này ({selectedNode.children.length}):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedNode.children.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectNode(c)}
                      className="text-left p-3.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{c.viTitle}</div>
                        <div className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                          {c.name}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-sky-600 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
