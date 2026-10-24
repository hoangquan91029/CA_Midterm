/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MindMapExplorer } from './components/MindMapExplorer';
import { InteractiveVisualizers, VisualizerTab } from './components/InteractiveVisualizers';
import { QuizArena } from './components/QuizArena';
import { DriveMaterialsAndCheatSheet } from './components/DriveMaterialsAndCheatSheet';
import { MIDTERM_QUIZ_BANK, QuizQuestion, QuizTopic } from './data/quizBank';
import { LanguageMode } from './data/bilingualContent';
import { generateQuizBatch } from './utils/quizGenerator';
import { ExternalLink, Sparkles, Languages } from 'lucide-react';

export default function App() {
  const [activeVisualizerTab, setActiveVisualizerTab] = useState<VisualizerTab>('performance');
  const [selectedQuizTopic, setSelectedQuizTopic] = useState<QuizTopic | 'all'>('all');
  const [langMode, setLangMode] = useState<LanguageMode>('bilingual');

  // Pre-seed 12 procedural questions (2 per chapter across 6 chapters) alongside the 28 curated exam questions = 40 questions initial bank
  const [generatedQuestions, setGeneratedQuestions] = useState<QuizQuestion[]>(() =>
    generateQuizBatch('all', 12, 101)
  );
  const [genSeedCounter, setGenSeedCounter] = useState<number>(200);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  const allQuestions = useMemo(() => {
    return [...generatedQuestions, ...MIDTERM_QUIZ_BANK];
  }, [generatedQuestions]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenVisualizerFromMindMap = (tab: VisualizerTab) => {
    setActiveVisualizerTab(tab);
    scrollToSection('visualizers-section');
  };

  const handleSelectAnswer = (questionId: string, optionIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
  };

  const handleGenerateQuestions = (topic: QuizTopic | 'all', count: number) => {
    const newBatch = generateQuizBatch(topic, count, genSeedCounter);
    setGenSeedCounter((prev) => prev + count * 17 + 7);
    setGeneratedQuestions((prev) => [...newBatch, ...prev]);
  };

  const handleJumpToQuizTopic = (topic: QuizTopic) => {
    setSelectedQuizTopic(topic);
    scrollToSection('quiz-section');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-6 px-6 py-3.5">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            CA Midterm Hub
          </a>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav
            aria-label="Điều hướng chính"
            className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a
              href="#mindmap-section"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Lý thuyết & Quiz Song ngữ
            </a>
            <a
              href="#visualizers-section"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Mô phỏng Trực quan
            </a>
            <a
              href="#quiz-section"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Ngân hàng & Tự sinh Quiz ({allQuestions.length})
            </a>
            <a
              href="#materials-section"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Từ điển Song ngữ & Cheat Sheet
            </a>
          </nav>

          {/* Zone 3: Language Switcher + Primary Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              role="group"
              aria-label="Chọn chế độ ngôn ngữ"
              className="inline-flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200"
            >
              <Languages className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1 hidden sm:inline" />
              {(
                [
                  { id: 'bilingual', label: 'Song ngữ VI·EN' },
                  { id: 'vi', label: 'VI' },
                  { id: 'en', label: 'EN' },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setLangMode(m.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    langMode === m.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollToSection('quiz-section')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Luyện Quiz ({allQuestions.length} câu)
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="top" className="flex-1">
        {/* Hero Overview Strip */}
        <section className="bg-white border-b border-slate-200 py-10">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
                  <span className="font-semibold text-sky-700">
                    Computer Architecture (IT089IU · CO2007 · COMP 212)
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-indigo-700">
                    Chế độ Song ngữ Việt – Anh (Bilingual VI + EN)
                  </span>
                </div>

                <h1
                  className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4"
                  style={{ textWrap: 'balance' }}
                >
                  {langMode === 'en'
                    ? 'Computer Architecture Midterm Hub: Bilingual Lectures, Interactive Visualizers & Auto-Generated Quizzes'
                    : 'Hệ thống Ôn thi Giữa kỳ Kiến trúc Máy tính Song ngữ (Việt – Anh): Lý thuyết, Mô phỏng & Tự sinh Đề Quiz'}
                </h1>

                <p className="text-base text-slate-600 leading-relaxed mb-6 max-w-2xl">
                  {langMode === 'en' ? (
                    <>
                      Master all 6 core chapters from the NotebookLM Mind Map and official Google Drive exams in{' '}
                      <strong>Bilingual (VI + EN)</strong> or <strong>100% English Exam Mode</strong>: CPU Performance & CPI, C-to-MIPS Assembly, Two's Complement & IEEE 754, 5-Stage Pipeline Hazards, and Cache/Virtual Memory.
                    </>
                  ) : (
                    <>
                      Tích hợp hoàn chỉnh <strong>Song ngữ Việt – Anh (VI + EN)</strong> cho cả bài giảng lý thuyết, từ điển thuật ngữ chuyên ngành và ngân hàng đề thi: giúp bạn vừa nắm chắc bản chất bằng tiếng Việt, vừa đọc hiểu chính xác 100% câu hỏi tiếng Anh trong phòng thi <strong>IT089IU, COMP 212, CO2007</strong>.
                    </>
                  )}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => scrollToSection('quiz-section')}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {langMode === 'en'
                        ? `Practice & Generate Bilingual Quizzes (${allQuestions.length} Qs)`
                        : `Luyện Đề & Tự sinh Quiz Song ngữ (${allQuestions.length} câu)`}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('mindmap-section')}
                    className="px-5 py-2.5 text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {langMode === 'en'
                      ? 'Explore Bilingual Mind Map & Notes'
                      : 'Học Bài giảng & Quiz Song ngữ'}
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('materials-section')}
                    className="px-4 py-2.5 text-sm font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {langMode === 'en' ? 'Bilingual Glossary (EN-VI)' : 'Từ điển Thuật ngữ Anh–Việt'}
                  </button>
                </div>
              </div>

              {/* Quick Jump Exam Blueprint Card */}
              <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Luyện Nhanh Quiz Song ngữ 6 Chủ Đề (VI · EN)
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleGenerateQuestions('all', 6);
                      scrollToSection('quiz-section');
                    }}
                    className="text-xs font-bold text-indigo-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+ Sinh đề 6 câu mới</span>
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleJumpToQuizTopic('performance')}
                    className="w-full text-left p-2.5 rounded-lg bg-white border border-slate-200 hover:border-sky-400 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        1. CPU Performance, CPI & Speedup (Hiệu năng CPU)
                      </div>
                      <div className="text-slate-600 mt-0.5">
                        P1 vs P2, Clock Cycles, Average CPI, CPU Time, Moore's Law
                      </div>
                    </div>
                    <span className="font-mono font-bold text-sky-700 shrink-0 ml-2">Quiz →</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleJumpToQuizTopic('mips')}
                    className="w-full text-left p-2.5 rounded-lg bg-white border border-slate-200 hover:border-sky-400 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        2. MIPS Assembly, C Translation & Arrays (Tập lệnh MIPS)
                      </div>
                      <div className="text-slate-600 mt-0.5">
                        R/I/J-Format, MemArray Loop Trace, Bitwise sll/or/andi, Big-Endian
                      </div>
                    </div>
                    <span className="font-mono font-bold text-sky-700 shrink-0 ml-2">Quiz →</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleJumpToQuizTopic('arithmetic')}
                    className="w-full text-left p-2.5 rounded-lg bg-white border border-slate-200 hover:border-sky-400 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        3. Two's Complement, Overflow & IEEE 754 (Số học Máy tính)
                      </div>
                      <div className="text-slate-600 mt-0.5">
                        8-bit / 5-bit Signed Addition, Overflow Flag, 32-bit Floating Point
                      </div>
                    </div>
                    <span className="font-mono font-bold text-sky-700 shrink-0 ml-2">Quiz →</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleJumpToQuizTopic('datapath')}
                    className="w-full text-left p-2.5 rounded-lg bg-white border border-slate-200 hover:border-sky-400 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        4 & 5. Datapath, Pipeline, Cache & Virtual Memory
                      </div>
                      <div className="text-slate-600 mt-0.5">
                        Control Signals, Load-Use Stalls, Forwarding, Tag/Index/Offset, TLB
                      </div>
                    </div>
                    <span className="font-mono font-bold text-sky-700 shrink-0 ml-2">Quiz →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: NotebookLM Mind Map Explorer with Embedded Bilingual Topic Quiz */}
        <MindMapExplorer
          onOpenVisualizer={handleOpenVisualizerFromMindMap}
          allQuestions={allQuestions}
          userAnswers={userAnswers}
          onSelectAnswer={handleSelectAnswer}
          onGenerateForTopic={handleGenerateQuestions}
          onJumpToQuizTopic={handleJumpToQuizTopic}
          langMode={langMode}
          onLangModeChange={setLangMode}
        />

        {/* Section 2: 5 Interactive Visualizers */}
        <InteractiveVisualizers
          activeTab={activeVisualizerTab}
          onTabChange={setActiveVisualizerTab}
        />

        {/* Section 3: Interactive Bilingual Quiz Arena & Auto-Generator */}
        <QuizArena
          allQuestions={allQuestions}
          userAnswers={userAnswers}
          onSelectAnswer={handleSelectAnswer}
          onResetQuiz={handleResetQuiz}
          selectedTopic={selectedQuizTopic}
          onTopicChange={setSelectedQuizTopic}
          onGenerateQuestions={handleGenerateQuestions}
          langMode={langMode}
          onLangModeChange={setLangMode}
        />

        {/* Section 4, 5 & 6: Bilingual Dictionary, MIPS Cheat Sheet & Google Drive Source Archive */}
        <DriveMaterialsAndCheatSheet langMode={langMode} />
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            CA Midterm Hub (Song ngữ Việt – Anh) — Biên soạn trực tiếp từ NotebookLM Mind Map (155 sources) & Thư mục Google Drive Computer Architecture.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://notebook.google.com/notebook/5bf8413d-a3e2-4d67-a8f3-193e50489b25/artifact/b11ab1c5-83eb-40cd-8e8e-99c9ddfe7bbd"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 inline-flex items-center gap-1"
            >
              <span>NotebookLM Mind Map</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://drive.google.com/drive/folders/1jyYJ3JfHAFOGn83PZeZOPuGCvjjGgWHy?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 inline-flex items-center gap-1"
            >
              <span>Thư mục Google Drive</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
