import React, { useState, useMemo } from 'react';
import { QuizQuestion, QuizTopic, QUIZ_TOPIC_META } from '../data/quizBank';
import { LanguageMode, resolveBilingualQuestion } from '../data/bilingualContent';
import { MarkdownBlock, renderInlineMarkdown } from './MarkdownBlock';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Filter,
  BookOpenCheck,
  Sparkles,
  PlusCircle,
  Layers,
} from 'lucide-react';

interface QuizArenaProps {
  allQuestions: QuizQuestion[];
  userAnswers: Record<string, number>;
  onSelectAnswer: (questionId: string, optionIdx: number) => void;
  onResetQuiz: () => void;
  selectedTopic: QuizTopic | 'all';
  onTopicChange: (topic: QuizTopic | 'all') => void;
  onGenerateQuestions: (topic: QuizTopic | 'all', count: number) => void;
  langMode: LanguageMode;
  onLangModeChange: (mode: LanguageMode) => void;
}

const TOPIC_KEYS: QuizTopic[] = [
  'performance',
  'mips',
  'arithmetic',
  'datapath',
  'cache',
  'assembler',
];

export const QuizArena: React.FC<QuizArenaProps> = ({
  allQuestions,
  userAnswers,
  onSelectAnswer,
  onResetQuiz,
  selectedTopic,
  onTopicChange,
  onGenerateQuestions,
  langMode,
  onLangModeChange,
}) => {
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [showAllSolutions, setShowAllSolutions] = useState<boolean>(false);
  const [lastGeneratedNotice, setLastGeneratedNotice] = useState<string | null>(null);

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      const matchSource = selectedSource === 'all' || q.sourceExam === selectedSource;
      const matchTopic = selectedTopic === 'all' || q.topic === selectedTopic;
      return matchSource && matchTopic;
    });
  }, [allQuestions, selectedSource, selectedTopic]);

  const stats = useMemo(() => {
    let answered = 0;
    let correct = 0;
    for (const q of filteredQuestions) {
      if (userAnswers[q.id] !== undefined) {
        answered += 1;
        if (userAnswers[q.id] === q.correctIndex) {
          correct += 1;
        }
      }
    }
    return {
      total: filteredQuestions.length,
      answered,
      correct,
      scorePercent: answered > 0 ? Math.round((correct / answered) * 100) : 0,
    };
  }, [filteredQuestions, userAnswers]);

  const topicBreakdown = useMemo(() => {
    return TOPIC_KEYS.map((topicKey) => {
      const topicQs = allQuestions.filter((q) => q.topic === topicKey);
      const generatedCount = topicQs.filter((q) => q.isGenerated).length;
      let answered = 0;
      let correct = 0;
      for (const q of topicQs) {
        if (userAnswers[q.id] !== undefined) {
          answered += 1;
          if (userAnswers[q.id] === q.correctIndex) {
            correct += 1;
          }
        }
      }
      return {
        topic: topicKey,
        meta: QUIZ_TOPIC_META[topicKey],
        total: topicQs.length,
        generatedCount,
        answered,
        correct,
        accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0,
      };
    });
  }, [allQuestions, userAnswers]);

  const totalGeneratedCount = useMemo(
    () => allQuestions.filter((q) => q.isGenerated).length,
    [allQuestions]
  );

  const handleTriggerGenerate = (topic: QuizTopic | 'all', count: number, label: string) => {
    onGenerateQuestions(topic, count);
    if (topic !== 'all') {
      onTopicChange(topic);
    }
    setSelectedSource('all');
    setLastGeneratedNotice(
      `Đã tự sinh thêm ${count} câu hỏi song ngữ (VI + EN) mới cho ${label}! (Nằm ở đầu danh sách bên dưới)`
    );
  };

  return (
    <section id="quiz-section" className="py-10 scroll-mt-16 border-b border-slate-200 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header & Scoreboard */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold tracking-wider text-sky-700 uppercase mb-1">
              Bilingual Interactive Exam Practice & Procedural Quiz Generator (Song Ngữ Việt – Anh)
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              03. Ngân hàng Quiz Song ngữ Theo Từng Chương & Máy Tự Sinh Đề Thi (Auto-Generator)
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Tổng cộng <strong className="text-slate-900">{allQuestions.length} câu hỏi song ngữ (Việt – Anh)</strong> (gồm đề thi gốc IT089IU, COMP 212, Fall 2011, CO2007, HW3 +{' '}
              <strong className="text-indigo-700">{totalGeneratedCount} câu tự sinh</strong>). Chuyển đổi linh hoạt giữa chế độ{' '}
              <strong className="text-slate-900">Song ngữ (VI + EN)</strong>, <strong className="text-slate-900">English</strong> (như trong phòng thi thực tế) hoặc <strong className="text-slate-900">Tiếng Việt</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            {/* Language Switcher inside Quiz Arena */}
            <div
              role="group"
              aria-label="Ngôn ngữ đề thi Quiz"
              className="inline-flex items-center bg-slate-200/80 p-0.5 rounded-lg"
            >
              {(
                [
                  { id: 'bilingual', label: 'Song ngữ' },
                  { id: 'vi', label: 'VI' },
                  { id: 'en', label: 'EN' },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onLangModeChange(m.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    langMode === m.id
                      ? 'bg-white text-sky-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-600 font-mono tabular-nums">
              Đang lọc: <strong className="text-slate-900">{stats.answered}/{stats.total}</strong>
              <span className="mx-1.5">·</span>
              Đúng: <strong className="text-emerald-700">{stats.correct}</strong> ({stats.scorePercent}%)
            </div>
            <button
              type="button"
              onClick={() => setShowAllSolutions((prev) => !prev)}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {showAllSolutions ? 'Ẩn lời giải mẫu' : 'Hiện toàn bộ lời giải'}
            </button>
            <button
              type="button"
              onClick={() => {
                onResetQuiz();
                setShowAllSolutions(false);
              }}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm lại</span>
            </button>
          </div>
        </div>

        {/* 6-Topic Mastery & Per-Topic Quiz Generator Cards */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-sky-600" />
              <span>
                Bản đồ Quiz Song ngữ 6 Chương Kiến thức (Chọn chương để lọc hoặc Tự sinh thêm câu hỏi)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleTriggerGenerate('all', 6, 'Đề thi thử tổng hợp 6 chương')
                }
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ Tự sinh Đề thi thử 6 câu mới (Đủ 6 Chương)</span>
              </button>
              {selectedTopic !== 'all' && (
                <button
                  type="button"
                  onClick={() => onTopicChange('all')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
                >
                  Xem tất cả {allQuestions.length} câu
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {topicBreakdown.map((item) => {
              const isSelected = selectedTopic === item.topic;
              const progressPct =
                item.total > 0 ? Math.round((item.answered / item.total) * 100) : 0;

              return (
                <div
                  key={item.topic}
                  className={`rounded-xl border p-4 transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-sky-50/70 border-sky-500 ring-2 ring-sky-500/20'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <button
                        type="button"
                        onClick={() =>
                          onTopicChange(isSelected ? 'all' : item.topic)
                        }
                        className="text-left font-bold text-sm text-slate-900 hover:text-sky-700 transition-colors cursor-pointer"
                      >
                        {langMode === 'en' ? item.meta.enLabel : item.meta.label}
                      </button>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 shrink-0">
                        {item.total} câu
                      </span>
                    </div>

                    {langMode === 'bilingual' && (
                      <div className="text-[11px] font-mono text-sky-700 mb-1">
                        {item.meta.enLabel}
                      </div>
                    )}

                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {langMode === 'en' ? item.meta.enDescription : item.meta.description}
                    </p>
                  </div>

                  <div>
                    {/* Progress & Score Row */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 mb-1.5">
                      <span>
                        Đã làm: <strong className="text-slate-900">{item.answered}/{item.total}</strong> ({item.generatedCount} câu tự sinh)
                      </span>
                      <span className="text-emerald-700 font-bold">
                        Đúng: {item.correct} ({item.accuracy}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-sky-600 transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    {/* Action Buttons per Topic */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/80">
                      <button
                        type="button"
                        onClick={() =>
                          onTopicChange(isSelected ? 'all' : item.topic)
                        }
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-sky-600 text-white'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ Đang lọc chương này' : `Lọc ${item.total} câu`}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleTriggerGenerate(
                            item.topic,
                            2,
                            item.meta.shortLabel
                          )
                        }
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />
                        <span>+ Sinh 2 câu mới</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notification Banner when new questions are generated */}
        {lastGeneratedNotice && (
          <div className="mb-5 p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-wrap items-center justify-between gap-2 text-xs text-indigo-950">
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{lastGeneratedNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setLastGeneratedNotice(null)}
              className="text-indigo-700 hover:underline font-medium cursor-pointer"
            >
              Đóng thông báo
            </button>
          </div>
        )}

        {/* Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-6 mb-6 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Nguồn đề:
            </span>
            {[
              { id: 'all', label: `Tất cả nguồn (${allQuestions.length})` },
              {
                id: 'Đề Tự Sinh (Auto-Gen)',
                label: `⚡ Đề Tự Sinh (${totalGeneratedCount})`,
              },
              { id: 'IT089IU Midterm 2022', label: 'IT089IU 2022' },
              { id: 'COMP 212 Midterm', label: 'COMP 212' },
              { id: 'Fall 2011 Midterm', label: 'Fall 2011' },
              { id: 'CO2007 Exam', label: 'CO2007' },
              { id: 'HW3 Arithmetic', label: 'HW3 Arithmetic' },
              { id: 'NotebookLM Mind Map', label: 'NotebookLM Mind Map' },
            ].map((src) => (
              <button
                key={src.id}
                type="button"
                onClick={() => setSelectedSource(src.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedSource === src.id
                    ? 'bg-sky-600 text-white font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {src.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor="quiz-topic-filter"
              className="text-xs font-semibold text-slate-600 whitespace-nowrap"
            >
              Chủ đề:
            </label>
            <select
              id="quiz-topic-filter"
              value={selectedTopic}
              onChange={(e) =>
                onTopicChange(e.target.value as QuizTopic | 'all')
              }
              className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
            >
              <option value="all">Mọi chủ đề ({allQuestions.length} câu)</option>
              <option value="performance">1. Hiệu năng CPU & CPI</option>
              <option value="mips">2. Tập lệnh MIPS & Dịch C</option>
              <option value="arithmetic">3. Số học Bù 2 & IEEE 754</option>
              <option value="datapath">4. Datapath & Pipeline</option>
              <option value="cache">5. Cache & Bộ nhớ Ảo</option>
              <option value="assembler">6. Biên dịch, Linker & Loader</option>
            </select>

            <button
              type="button"
              onClick={() =>
                handleTriggerGenerate(
                  selectedTopic,
                  3,
                  selectedTopic === 'all'
                    ? 'Tất cả chủ đề'
                    : QUIZ_TOPIC_META[selectedTopic].shortLabel
                )
              }
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                + Tự sinh 3 câu{' '}
                {selectedTopic === 'all'
                  ? 'ngẫu nhiên'
                  : QUIZ_TOPIC_META[selectedTopic].shortLabel}
              </span>
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {filteredQuestions.map((q, index) => {
            const bq = resolveBilingualQuestion(q);
            const chosenIdx = userAnswers[q.id];
            const isAnswered = chosenIdx !== undefined;
            const isCorrect = chosenIdx === q.correctIndex;
            const revealExplanation = isAnswered || showAllSolutions;

            return (
              <article
                key={q.id}
                className={`border rounded-xl p-6 transition-colors ${
                  q.isGenerated
                    ? 'bg-indigo-50/25 border-indigo-200/90'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                {/* Clean metadata with typographic separators */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono font-bold text-slate-900">
                      {langMode === 'en' ? `Question ${index + 1}` : `Câu ${index + 1}`}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`font-semibold ${
                        q.isGenerated ? 'text-indigo-700' : 'text-sky-700'
                      }`}
                    >
                      {q.isGenerated ? '⚡ Đề Tự Sinh (Auto-Gen)' : q.sourceExam}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-700">
                      {langMode === 'en'
                        ? bq.enTopicLabel
                        : langMode === 'vi'
                        ? bq.viTopicLabel
                        : `${bq.viTopicLabel} / ${bq.enTopicLabel}`}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Mức độ: {q.difficulty}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleTriggerGenerate(
                        q.topic,
                        1,
                        QUIZ_TOPIC_META[q.topic].shortLabel
                      )
                    }
                    className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {langMode === 'en' ? 'Generate 1 similar question' : 'Sinh thêm 1 câu tương tự'}
                    </span>
                  </button>
                </div>

                {/* Question Stem (Bilingual, VI, or EN) */}
                <div className="space-y-2.5 mb-3.5">
                  {(langMode === 'bilingual' || langMode === 'vi') && (
                    <div className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                      {langMode === 'bilingual' && (
                        <span className="font-mono text-xs font-extrabold text-sky-700 mr-1.5">
                          [VI]
                        </span>
                      )}
                      {renderInlineMarkdown(bq.viQuestion)}
                    </div>
                  )}

                  {(langMode === 'bilingual' || langMode === 'en') && (
                    <div
                      className={`text-sm leading-relaxed ${
                        langMode === 'en'
                          ? 'sm:text-base font-bold text-slate-900'
                          : 'font-medium text-indigo-950 bg-white/90 border border-indigo-200/80 rounded-lg p-3'
                      }`}
                    >
                      {langMode === 'bilingual' && (
                        <span className="font-mono text-xs font-extrabold text-indigo-700 mr-1.5">
                          [EN]
                        </span>
                      )}
                      {renderInlineMarkdown(bq.enQuestion)}
                    </div>
                  )}
                </div>

                {q.codeSnippet && (
                  <pre className="bg-slate-900 text-emerald-300 font-mono text-xs p-4 rounded-xl mb-4 overflow-x-auto leading-relaxed">
                    <code>{q.codeSnippet}</code>
                  </pre>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {bq.viOptions.map((viOpt, optIdx) => {
                    const enOpt = bq.enOptions[optIdx] || viOpt;
                    const isSelected = chosenIdx === optIdx;
                    const isRightOption = optIdx === q.correctIndex;

                    let buttonStyle =
                      'bg-white border-slate-200 text-slate-800 hover:border-sky-400 hover:bg-sky-50/30';

                    if (revealExplanation) {
                      if (isRightOption) {
                        buttonStyle =
                          'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold';
                      } else if (isSelected && !isRightOption) {
                        buttonStyle = 'bg-rose-50 border-rose-400 text-rose-950';
                      } else {
                        buttonStyle = 'bg-white/60 border-slate-200 text-slate-500';
                      }
                    }

                    const showDualOpt =
                      langMode === 'bilingual' && enOpt.trim() !== viOpt.trim();

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => onSelectAnswer(q.id, optIdx)}
                        className={`text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-3 cursor-pointer ${buttonStyle}`}
                      >
                        <span className="font-mono font-bold text-slate-500 shrink-0 mt-0.5">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <div className="flex-1 space-y-1">
                          <div>{renderInlineMarkdown(langMode === 'en' ? enOpt : viOpt)}</div>
                          {showDualOpt && (
                            <div className="text-[11px] text-indigo-900/85 pt-1 border-t border-slate-200/70">
                              <span className="font-mono text-[10px] font-bold text-indigo-700 mr-1">
                                [EN]
                              </span>
                              {renderInlineMarkdown(enOpt)}
                            </div>
                          )}
                        </div>
                        {revealExplanation && isRightOption && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                        {revealExplanation && isSelected && !isRightOption && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {revealExplanation && (
                  <div className="mt-4 p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 text-xs font-bold">
                      <div className="flex items-center gap-1.5">
                        <BookOpenCheck className="w-4 h-4 text-sky-600 shrink-0" />
                        {isAnswered ? (
                          isCorrect ? (
                            <span className="text-emerald-700">
                              ● CHÍNH XÁC (CORRECT)! Đáp án chuẩn là{' '}
                              {String.fromCharCode(65 + q.correctIndex)}
                            </span>
                          ) : (
                            <span className="text-rose-700">
                              ▲ CHƯA ĐÚNG (INCORRECT) — Đáp án chuẩn là{' '}
                              {String.fromCharCode(65 + q.correctIndex)}
                            </span>
                          )
                        ) : (
                          <span className="text-sky-700">
                            ● LỜI GIẢI CHI TIẾT (STEP-BY-STEP SOLUTION) — Đáp án{' '}
                            {String.fromCharCode(65 + q.correctIndex)}
                          </span>
                        )}
                      </div>
                      {q.formulaUsed && (
                        <div className="text-xs text-sky-950 bg-sky-50 border border-sky-200 px-3 py-1 rounded-lg font-medium">
                          {renderInlineMarkdown(q.formulaUsed)}
                        </div>
                      )}
                    </div>

                    {(langMode === 'bilingual' || langMode === 'vi') && (
                      <div>
                        {langMode === 'bilingual' && (
                          <div className="text-[11px] font-bold text-slate-700 uppercase mb-1">
                            [VI] Lời giải chi tiết Tiếng Việt:
                          </div>
                        )}
                        <MarkdownBlock content={bq.viExplanation} />
                      </div>
                    )}

                    {(langMode === 'bilingual' || langMode === 'en') && (
                      <div
                        className={
                          langMode === 'bilingual'
                            ? 'pt-3 border-t border-slate-200/80 bg-indigo-50/30 p-3.5 rounded-lg'
                            : ''
                        }
                      >
                        {langMode === 'bilingual' && (
                          <div className="text-[11px] font-bold text-indigo-900 uppercase mb-1">
                            [EN] English Step-by-Step Solution:
                          </div>
                        )}
                        <MarkdownBlock content={bq.enExplanation} />
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
