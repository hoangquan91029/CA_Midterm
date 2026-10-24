import React, { useState } from 'react';
import {
  calculatePerformanceComparison,
  simulateMipsArrayLoop,
  evaluateTwosComplementOp,
  encodeIeee754Single,
  calculateCacheMapping,
  evaluateMipsBitwiseAndEndian,
  ProcessorClassSpec,
} from '../utils/archLogic';
import { MathFormula } from './MarkdownBlock';
import { RotateCcw, StepForward, Cpu, Binary, Layers, HardDrive, Code2 } from 'lucide-react';

export type VisualizerTab = 'performance' | 'mips' | 'arithmetic' | 'datapath' | 'cache';

interface InteractiveVisualizersProps {
  activeTab: VisualizerTab;
  onTabChange: (tab: VisualizerTab) => void;
}

export const InteractiveVisualizers: React.FC<InteractiveVisualizersProps> = ({
  activeTab,
  onTabChange,
}) => {
  // --- TAB 1: CPU PERFORMANCE STATE (Default: IT089IU Set 01 Q1) ---
  const [instructionCountMillions, setInstructionCountMillions] = useState<number>(10);
  const [clockP1, setClockP1] = useState<number>(2.5);
  const [clockP2, setClockP2] = useState<number>(3.0);
  const [classes, setClasses] = useState<ProcessorClassSpec[]>([
    { className: 'A', fractionPercent: 20, cpiP1: 3, cpiP2: 2 },
    { className: 'B', fractionPercent: 10, cpiP1: 3, cpiP2: 1 },
    { className: 'C', fractionPercent: 40, cpiP1: 1, cpiP2: 2 },
    { className: 'D', fractionPercent: 30, cpiP1: 2, cpiP2: 3 },
  ]);

  const loadPerfPreset = (preset: 'it089' | 'fall2011') => {
    if (preset === 'it089') {
      setInstructionCountMillions(10);
      setClockP1(2.5);
      setClockP2(3.0);
      setClasses([
        { className: 'A', fractionPercent: 20, cpiP1: 3, cpiP2: 2 },
        { className: 'B', fractionPercent: 10, cpiP1: 3, cpiP2: 1 },
        { className: 'C', fractionPercent: 40, cpiP1: 1, cpiP2: 2 },
        { className: 'D', fractionPercent: 30, cpiP1: 2, cpiP2: 3 },
      ]);
    } else {
      // Fall 2011 Q3: M1 (3.5 GHz) vs M2 (4.5 GHz)
      setInstructionCountMillions(10);
      setClockP1(3.5);
      setClockP2(4.5);
      setClasses([
        { className: 'A', fractionPercent: 10, cpiP1: 1, cpiP2: 2 },
        { className: 'B', fractionPercent: 35, cpiP1: 2, cpiP2: 2 },
        { className: 'C', fractionPercent: 25, cpiP1: 3, cpiP2: 4 },
        { className: 'D', fractionPercent: 30, cpiP1: 4, cpiP2: 4 },
      ]);
    }
  };

  const perfResult = calculatePerformanceComparison(
    instructionCountMillions * 1_000_000,
    clockP1,
    clockP2,
    classes
  );

  // --- TAB 2: MIPS LOOP & BITWISE STATE (IT089IU Set 01 Q3, Q4, Q5) ---
  const [stepIncrementI, setStepIncrementI] = useState<number>(2);
  const [limitI, setLimitI] = useState<number>(9);
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [cToMipsPattern, setCToMipsPattern] = useState<'if_else' | 'while_loop' | 'array_sum'>('if_else');

  const mipsSim = simulateMipsArrayLoop(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    1,
    stepIncrementI,
    limitI
  );
  const clampedRoundIdx = Math.min(currentRoundIdx, mipsSim.steps.length - 1);
  const activeStep = mipsSim.steps[clampedRoundIdx] || mipsSim.steps[0];
  const bitwiseEndian = evaluateMipsBitwiseAndEndian('0xAAAAAAAA', '0x01020304', 28, '0xDEADBEEF');

  // --- TAB 3: ARITHMETIC & IEEE 754 STATE (COMP 212 Q3 & Q4) ---
  const [twosA, setTwosA] = useState<number>(54);
  const [twosB, setTwosB] = useState<number>(-77);
  const [twosOp, setTwosOp] = useState<'+' | '-'>('-');
  const [twosBitWidth, setTwosBitWidth] = useState<8 | 5 | 16>(8);
  const [ieeeInput, setIeeeInput] = useState<string>('118.75');

  const twosResult = evaluateTwosComplementOp(twosA, twosB, twosOp, twosBitWidth);
  const parsedFloat = parseFloat(ieeeInput);
  const ieeeResult = encodeIeee754Single(Number.isNaN(parsedFloat) ? 0 : parsedFloat);

  // --- TAB 4: DATAPATH & PIPELINE STATE (CO2007 Q18-29) ---
  const [selectedInstr, setSelectedInstr] = useState<'add' | 'lw' | 'sw' | 'beq'>('lw');
  const [forwardingEnabled, setForwardingEnabled] = useState<boolean>(true);

  const datapathSpecs: Record<
    'add' | 'lw' | 'sw' | 'beq',
    {
      syntax: string;
      format: string;
      signals: {
        RegDst: string;
        ALUSrc: string;
        MemtoReg: string;
        RegWrite: string;
        MemRead: string;
        MemWrite: string;
        Branch: string;
        ALUOp: string;
      };
      activeBlocks: string[];
      note: string;
    }
  > = {
    add: {
      syntax: 'add $t0, $t1, $zero',
      format: 'R-Format (opcode = 0, funct = 0x20)',
      signals: {
        RegDst: '1 (rd [15:11])',
        ALUSrc: '0 (Read data 2)',
        MemtoReg: '0 (ALU result)',
        RegWrite: '1 (Ghi thanh ghi)',
        MemRead: '0',
        MemWrite: '0',
        Branch: '0',
        ALUOp: '10 (Tra funct)',
      },
      activeBlocks: ['PC', 'Instruction Memory', 'Registers (Read)', 'ALU', 'Registers (Write)'],
      note: 'Câu 22 đề CO2007: Khi thực thi add $t0, $t1, $zero -> RegDst = 1, ALUOp = 10, ALUSrc = 0. Qua 4 khối MUX.',
    },
    lw: {
      syntax: 'lw $t0, 0($t1)',
      format: 'I-Format (opcode = 0x23)',
      signals: {
        RegDst: '0 (rt [20:16])',
        ALUSrc: '1 (Sign-Ext Imm)',
        MemtoReg: '1 (Data Memory)',
        RegWrite: '1 (Ghi thanh ghi)',
        MemRead: '1 (Đọc RAM)',
        MemWrite: '0',
        Branch: '0',
        ALUOp: '00 (Cộng địa chỉ)',
      },
      activeBlocks: [
        'PC',
        'Instruction Memory',
        'Registers (Read)',
        'Sign-Extend',
        'ALU',
        'Data Memory',
        'Registers (Write)',
      ],
      note: 'Câu 20 & 23 đề CO2007: lw là lệnh dài nhất (đi qua đủ 5 giai đoạn). Các tín hiệu bằng 0 là: RegDst, Branch, ALUOp (00), MemWrite.',
    },
    sw: {
      syntax: 'sw $t1, 100($t0)',
      format: 'I-Format (opcode = 0x2B)',
      signals: {
        RegDst: 'X (Don’t care)',
        ALUSrc: '1 (Sign-Ext Imm)',
        MemtoReg: 'X (Don’t care)',
        RegWrite: '0 (Không ghi Reg)',
        MemRead: '0',
        MemWrite: '1 (Ghi RAM)',
        Branch: '0',
        ALUOp: '00 (Cộng địa chỉ)',
      },
      activeBlocks: ['PC', 'Instruction Memory', 'Registers (Read)', 'Sign-Extend', 'ALU', 'Data Memory'],
      note: 'Lệnh sw không ghi ngược về Register File nên RegWrite = 0, dẫn tới RegDst và MemtoReg là X (Don’t care).',
    },
    beq: {
      syntax: 'beq $s0, $s1, EXIT',
      format: 'I-Format (opcode = 0x04)',
      signals: {
        RegDst: 'X (Don’t care)',
        ALUSrc: '0 (Read data 2)',
        MemtoReg: 'X (Don’t care)',
        RegWrite: '0',
        MemRead: '0',
        MemWrite: '0',
        Branch: '1 (So sánh Zero)',
        ALUOp: '01 (Trừ so sánh)',
      },
      activeBlocks: ['PC', 'Instruction Memory', 'Registers (Read)', 'ALU (Zero Flag)', 'Branch Adder (Shift Left 2)'],
      note: 'Câu 21 đề CO2007: Lệnh beq và bne sử dụng ngõ ra Zero của ALU kết hợp cổng AND với tín hiệu Branch để chọn PC mới.',
    },
  };

  // --- TAB 5: CACHE MAPPING STATE (COMP 212 Q6 & CO2007 Q30-37) ---
  const [cachePreset, setCachePreset] = useState<'comp212_direct' | 'comp212_4way' | 'co2007_direct' | 'fall2011_8way'>('comp212_direct');
  const [addrBits, setAddrBits] = useState<number>(24);
  const [cacheKB, setCacheKB] = useState<number>(512);
  const [blockBytes, setBlockBytes] = useState<number>(8);
  const [ways, setWays] = useState<number>(1);
  const [sampleHexAddr, setSampleHexAddr] = useState<string>('DB86E2');

  const applyCachePreset = (preset: 'comp212_direct' | 'comp212_4way' | 'co2007_direct' | 'fall2011_8way') => {
    setCachePreset(preset);
    if (preset === 'comp212_direct') {
      setAddrBits(24);
      setCacheKB(512);
      setBlockBytes(8);
      setWays(1);
      setSampleHexAddr('DB86E2');
    } else if (preset === 'comp212_4way') {
      setAddrBits(24);
      setCacheKB(512);
      setBlockBytes(8);
      setWays(4);
      setSampleHexAddr('DB86E2');
    } else if (preset === 'co2007_direct') {
      setAddrBits(32);
      setCacheKB(64);
      setBlockBytes(16);
      setWays(1);
      setSampleHexAddr('0040102C');
    } else if (preset === 'fall2011_8way') {
      setAddrBits(22);
      setCacheKB(32);
      setBlockBytes(8);
      setWays(8);
      setSampleHexAddr('1A3F04');
    }
  };

  const cacheResult = calculateCacheMapping(
    addrBits,
    cacheKB * 1024,
    blockBytes,
    ways,
    sampleHexAddr
  );

  const tabs: { id: VisualizerTab; label: string; sub: string; icon: React.ReactNode }[] = [
    {
      id: 'performance',
      label: '1. Hiệu năng CPU & CPI',
      sub: 'IT089IU Q1 · Fall 2011 Q3',
      icon: <Cpu className="w-4 h-4" />,
    },
    {
      id: 'mips',
      label: '2. Mô phỏng MIPS & C',
      sub: 'IT089IU Q2–Q5 · C to MIPS',
      icon: <Code2 className="w-4 h-4" />,
    },
    {
      id: 'arithmetic',
      label: '3. Số học Bù 2 & IEEE 754',
      sub: 'COMP 212 Q3–Q4 · HW3',
      icon: <Binary className="w-4 h-4" />,
    },
    {
      id: 'datapath',
      label: '4. Datapath & Pipeline',
      sub: 'CO2007 Q16–Q29',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'cache',
      label: '5. Giải mã Địa chỉ Cache',
      sub: 'COMP 212 Q6 · CO2007 Q30–37',
      icon: <HardDrive className="w-4 h-4" />,
    },
  ];

  // Build LaTeX strings for Tab 1 derivation
  const p1SumTex = classes
    .map(
      (c) =>
        `${c.cpiP1} \\times (${((c.fractionPercent / 100) * instructionCountMillions).toFixed(1)} \\times 10^6)`
    )
    .join(' + ');
  const p2SumTex = classes
    .map(
      (c) =>
        `${c.cpiP2} \\times (${((c.fractionPercent / 100) * instructionCountMillions).toFixed(1)} \\times 10^6)`
    )
    .join(' + ');

  return (
    <section id="visualizers-section" className="py-10 scroll-mt-16 border-b border-slate-200 bg-slate-50/60">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-wider text-sky-700 uppercase mb-1">
            Interactive Simulators · Thực hành Trực quan
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            02. Phòng Thí nghiệm Trực quan hóa Kiến trúc Máy tính
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Tất cả thông số mặc định được nạp sẵn từ đề thi thật trong Google Drive (IT089IU 2022, COMP 212, Fall 2011, CO2007). Thay đổi thanh trượt hoặc số liệu để quan sát công thức toán học và lời giải cập nhật theo thời gian thực.
          </p>
        </div>

        {/* Interactive Segmented Tab Bar - 5 equal columns on lg */}
        <div
          role="tablist"
          aria-label="Các phòng mô phỏng trực quan"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-1.5 p-1.5 bg-slate-200/80 rounded-xl mb-6"
        >
          {tabs.map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => onTabChange(t.id)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span className={active ? 'text-sky-600' : 'text-slate-500'}>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* ==================== TAB 1: CPU PERFORMANCE ==================== */}
        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Stage: Visual Comparison (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    So sánh Hiệu năng 2 Vi xử lý P1 vs P2
                  </h3>
                  <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2">
                    <span>Phương trình chuẩn:</span>
                    <MathFormula tex="\text{Cycles} = \sum (\text{IC}_i \times \text{CPI}_i)" />
                    <span>·</span>
                    <MathFormula tex="\text{CPU Time} = \dfrac{\text{Cycles}}{\text{Clock Rate}}" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => loadPerfPreset('it089')}
                    className="px-3 py-1.5 text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Nạp Đề IT089IU Câu 1
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPerfPreset('fall2011')}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Nạp Đề Fall 2011 Câu 3
                  </button>
                </div>
              </div>

              {/* KPI Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-slate-800">Bộ xử lý P1 ({clockP1} GHz)</span>
                    <span className="font-mono font-bold text-slate-700">
                      {perfResult.fasterProcessor === 'P1' ? '● NHANH HƠN' : '○ CHẬM HƠN'}
                    </span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                    {perfResult.cpuTimeP1Ms.toFixed(2)} ms
                  </div>
                  <div className="text-xs text-slate-700 mt-2 space-y-1">
                    <div>
                      Tổng chu kỳ:{' '}
                      <MathFormula
                        tex={`\\mathbf{${(perfResult.cyclesP1 / 1e6).toFixed(2)} \\times 10^6}\\text{ cycles}`}
                      />
                    </div>
                    <div>
                      <MathFormula tex={`\\text{CPI}_{\\text{avg (P1)}} = \\mathbf{${perfResult.avgCpiP1}}`} />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200">
                  <div className="flex items-center justify-between text-xs text-sky-800 mb-1">
                    <span className="font-semibold">Bộ xử lý P2 ({clockP2} GHz)</span>
                    <span className="font-mono font-bold text-sky-700">
                      {perfResult.fasterProcessor === 'P2' ? '● NHANH HƠN' : '○ CHẬM HƠN'}
                    </span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-sky-950 tabular-nums">
                    {perfResult.cpuTimeP2Ms.toFixed(2)} ms
                  </div>
                  <div className="text-xs text-sky-950 mt-2 space-y-1">
                    <div>
                      Tổng chu kỳ:{' '}
                      <MathFormula
                        tex={`\\mathbf{${(perfResult.cyclesP2 / 1e6).toFixed(2)} \\times 10^6}\\text{ cycles}`}
                      />
                    </div>
                    <div>
                      <MathFormula tex={`\\text{CPI}_{\\text{avg (P2)}} = \\mathbf{${perfResult.avgCpiP2}}`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bar Chart Visualization */}
              <div className="space-y-3.5 mb-6">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Thời gian thực thi P1 (CPU Time P1)</span>
                    <span className="font-mono tabular-nums">{perfResult.cpuTimeP1Ms.toFixed(2)} ms</span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-700 rounded-full transition-all duration-200"
                      style={{
                        width: `${Math.min(
                          100,
                          (perfResult.cpuTimeP1Ms /
                            Math.max(perfResult.cpuTimeP1Ms, perfResult.cpuTimeP2Ms, 0.1)) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Thời gian thực thi P2 (CPU Time P2)</span>
                    <span className="font-mono tabular-nums">{perfResult.cpuTimeP2Ms.toFixed(2)} ms</span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-600 rounded-full transition-all duration-200"
                      style={{
                        width: `${Math.min(
                          100,
                          (perfResult.cpuTimeP2Ms /
                            Math.max(perfResult.cpuTimeP1Ms, perfResult.cpuTimeP2Ms, 0.1)) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Clean Mathematical Step-by-Step Derivation Cards */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-800">
                  Lời giải Toán học Từng bước (Chuẩn Barem Chấm thi Tự luận):
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1.5 overflow-x-auto">
                  <div className="text-xs font-bold text-slate-800">
                    a) Tổng số chu kỳ xung nhịp (<MathFormula tex="\text{Clock Cycles} = \sum \text{CPI}_i \times I_i" />):
                  </div>
                  <div className="text-xs text-slate-800">
                    <MathFormula
                      tex={`\\text{Cycles}_{\\text{P1}} = ${p1SumTex} = \\mathbf{${(perfResult.cyclesP1 / 1e6).toFixed(2)} \\times 10^6\\text{ cycles}}`}
                    />
                  </div>
                  <div className="text-xs text-slate-800">
                    <MathFormula
                      tex={`\\text{Cycles}_{\\text{P2}} = ${p2SumTex} = \\mathbf{${(perfResult.cyclesP2 / 1e6).toFixed(2)} \\times 10^6\\text{ cycles}}`}
                    />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1 overflow-x-auto">
                  <div className="text-xs font-bold text-slate-800">
                    b) Số chu kỳ trung bình mỗi lệnh (<MathFormula tex="\text{CPI}_{\text{avg}} = \dfrac{\text{Total Cycles}}{\text{Total IC}}" />):
                  </div>
                  <div className="text-xs text-slate-800 flex flex-wrap items-center gap-6">
                    <MathFormula
                      tex={`\\text{CPI}_{\\text{P1}} = \\frac{${(perfResult.cyclesP1 / 1e6).toFixed(2)} \\times 10^6}{${instructionCountMillions} \\times 10^6} = \\mathbf{${perfResult.avgCpiP1}}`}
                    />
                    <MathFormula
                      tex={`\\text{CPI}_{\\text{P2}} = \\frac{${(perfResult.cyclesP2 / 1e6).toFixed(2)} \\times 10^6}{${instructionCountMillions} \\times 10^6} = \\mathbf{${perfResult.avgCpiP2}}`}
                    />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1.5 overflow-x-auto">
                  <div className="text-xs font-bold text-slate-800">
                    c) Thời gian thực thi CPU (<MathFormula tex="\text{CPU Time} = \dfrac{\text{Clock Cycles}}{\text{Clock Rate}}" />):
                  </div>
                  <div className="text-xs text-slate-800 flex flex-wrap items-center gap-6">
                    <MathFormula
                      tex={`\\text{Time}_{\\text{P1}} = \\frac{${(perfResult.cyclesP1 / 1e6).toFixed(2)} \\times 10^6}{${clockP1} \\times 10^9\\text{ Hz}} = ${perfResult.cpuTimeP1Ms.toFixed(2)} \\times 10^{-3}\\text{ s} = \\mathbf{${perfResult.cpuTimeP1Ms.toFixed(2)}\\text{ ms}}`}
                    />
                    <MathFormula
                      tex={`\\text{Time}_{\\text{P2}} = \\frac{${(perfResult.cyclesP2 / 1e6).toFixed(2)} \\times 10^6}{${clockP2} \\times 10^9\\text{ Hz}} = ${perfResult.cpuTimeP2Ms.toFixed(2)} \\times 10^{-3}\\text{ s} = \\mathbf{${perfResult.cpuTimeP2Ms.toFixed(2)}\\text{ ms}}`}
                    />
                  </div>
                </div>

                <div className="px-3.5 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-950 flex flex-wrap items-center gap-2">
                  <span>⇒ Kết luận:</span>
                  <span>
                    Bộ xử lý <strong>{perfResult.fasterProcessor}</strong> nhanh hơn gấp{' '}
                    <MathFormula tex={`\\mathbf{${perfResult.speedupRatio}\\times}`} /> lần!
                  </span>
                </div>
              </div>
            </div>

            {/* Right Control Deck (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <h4 className="text-base font-bold text-slate-900">
                Bảng Điều khiển Tham số Vi xử lý
              </h4>

              <div>
                <label
                  htmlFor="ic-slider"
                  className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5"
                >
                  <span>Tổng số lệnh động (Instruction Count):</span>
                  <span className="text-sky-700">
                    <MathFormula tex={`\\mathbf{${instructionCountMillions} \\times 10^6}\\text{ lệnh}`} />
                  </span>
                </label>
                <input
                  id="ic-slider"
                  type="range"
                  min={1}
                  max={50}
                  step={1}
                  value={instructionCountMillions}
                  onChange={(e) => setInstructionCountMillions(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="clock-p1"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Xung nhịp P1: <span className="font-mono text-sky-700">{clockP1} GHz</span>
                  </label>
                  <input
                    id="clock-p1"
                    type="range"
                    min={1.0}
                    max={5.0}
                    step={0.1}
                    value={clockP1}
                    onChange={(e) => setClockP1(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
                <div>
                  <label
                    htmlFor="clock-p2"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Xung nhịp P2: <span className="font-mono text-sky-700">{clockP2} GHz</span>
                  </label>
                  <input
                    id="clock-p2"
                    type="range"
                    min={1.0}
                    max={5.0}
                    step={0.1}
                    value={clockP2}
                    onChange={(e) => setClockP2(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-700 mb-2">
                  Bảng phân bố Lớp lệnh (A, B, C, D) & CPI:
                </div>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs font-mono tabular-nums">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Lớp</th>
                        <th className="py-2 px-3">Tỷ lệ (%)</th>
                        <th className="py-2 px-3">CPI P1</th>
                        <th className="py-2 px-3">CPI P2</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {classes.map((c, idx) => (
                        <tr key={c.className}>
                          <td className="py-2 px-3 font-bold text-slate-900">Class {c.className}</td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              aria-label={`Tỷ lệ phần trăm Class ${c.className}`}
                              min={0}
                              max={100}
                              value={c.fractionPercent}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setClasses((prev) =>
                                  prev.map((item, i) =>
                                    i === idx ? { ...item, fractionPercent: val } : item
                                  )
                                );
                              }}
                              className="w-14 px-1.5 py-1 border border-slate-300 rounded text-center"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              aria-label={`CPI P1 Class ${c.className}`}
                              min={1}
                              max={20}
                              value={c.cpiP1}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setClasses((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, cpiP1: val } : item))
                                );
                              }}
                              className="w-12 px-1.5 py-1 border border-slate-300 rounded text-center"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              aria-label={`CPI P2 Class ${c.className}`}
                              min={1}
                              max={20}
                              value={c.cpiP2}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setClasses((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, cpiP2: val } : item))
                                );
                              }}
                              className="w-12 px-1.5 py-1 border border-slate-300 rounded text-center"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: MIPS LOOP & BITWISE SIMULATOR ==================== */}
        {activeTab === 'mips' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Stage: Step-by-Step Loop Execution (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Mô phỏng Từng Vòng lặp Hợp ngữ MIPS (Câu 3 Đề IT089IU - 40 điểm)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Theo dõi thanh ghi $s0 (con trỏ mảng), $s1 (giá trị phần tử), $t1 (biến i), $s2 (result)
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCurrentRoundIdx(0)}
                      className="px-2.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Vòng 1</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentRoundIdx((prev) => (prev + 1) % mipsSim.steps.length)
                      }
                      className="px-3 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <StepForward className="w-3.5 h-3.5" />
                      <span>Bước kế tiếp ({clampedRoundIdx + 1}/{mipsSim.steps.length})</span>
                    </button>
                  </div>
                </div>

                {/* MemArray Visual Tape */}
                <div className="mb-5">
                  <div className="text-xs font-semibold text-slate-600 mb-2">
                    Bộ nhớ dữ liệu <code className="font-mono">MemArray: .word 1..12</code> (Mỗi phần tử 4 bytes):
                  </div>
                  <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 font-mono text-center">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((val, idx) => {
                      const isLoadedThisRound = idx === clampedRoundIdx;
                      const isNextPointer = idx * 4 === activeStep.s0OffsetBytes;
                      return (
                        <div
                          key={val}
                          className={`p-2 rounded-lg border text-xs transition-all ${
                            isLoadedThisRound
                              ? 'bg-sky-600 text-white border-sky-700 font-bold'
                              : isNextPointer
                              ? 'bg-amber-50 border-amber-400 text-amber-900 font-semibold'
                              : idx < clampedRoundIdx
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          <div className="text-[10px] opacity-75">+{idx * 4}</div>
                          <div className="text-sm">{val}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Register File Readout */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5 font-mono tabular-nums">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500">$s0 (Pointer)</div>
                    <div className="text-sm font-bold text-slate-900">
                      Base + {activeStep.s0OffsetBytes}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500">$s1 (Mem[j])</div>
                    <div className="text-sm font-bold text-sky-700">{activeStep.s1LoadedVal}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500">$t1 (Biến i)</div>
                    <div className="text-sm font-bold text-amber-700">{activeStep.t1Val}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="text-[11px] text-emerald-800">$s2 (result)</div>
                    <div className="text-sm font-bold text-emerald-950">{activeStep.s2Result}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500">$t2 (i &lt; {limitI})</div>
                    <div className="text-sm font-bold text-slate-900">
                      {activeStep.t2BranchFlag} ({activeStep.t2BranchFlag === 1 ? 'Loop' : 'Exit'})
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono space-y-2">
                  <div className="text-sky-400 font-semibold">{activeStep.instruction}</div>
                  <div className="text-slate-300 font-sans">{activeStep.explanation}</div>
                  <div className="pt-2 border-t border-slate-800 text-emerald-400">
                    Tổng kết sau khi thoát LOOP: Chạy {mipsSim.totalRounds} vòng · Giá trị i cuối ($t1) ={' '}
                    {mipsSim.finalI} · Giá trị result cuối ($s2) = {mipsSim.finalResult} (In ra màn hình:{' '}
                    {mipsSim.finalResult})
                  </div>
                </div>
              </div>

              {/* Right Deck: Loop Parameters & C-to-MIPS Explorer (5 cols) */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">
                    Tuỳ chỉnh tham số Vòng lặp & Đối chiếu Code C
                  </h4>
                  <p className="text-xs text-slate-500">
                    Thử thay đổi bước nhảy của i (`addi $t1, $t1, step`) hoặc giới hạn `slti $t2, $t1, limit`
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="mips-step-slider"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Bước tăng i (addi $t1): <span className="font-mono text-sky-700">+{stepIncrementI}</span>
                    </label>
                    <input
                      id="mips-step-slider"
                      type="range"
                      min={1}
                      max={4}
                      step={1}
                      value={stepIncrementI}
                      onChange={(e) => {
                        setStepIncrementI(Number(e.target.value));
                        setCurrentRoundIdx(0);
                      }}
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="mips-limit-slider"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Điều kiện dừng (slti &lt; N): <span className="font-mono text-sky-700">{limitI}</span>
                    </label>
                    <input
                      id="mips-limit-slider"
                      type="range"
                      min={5}
                      max={15}
                      step={2}
                      value={limitI}
                      onChange={(e) => {
                        setLimitI(Number(e.target.value));
                        setCurrentRoundIdx(0);
                      }}
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Round selector buttons */}
                <div>
                  <div className="text-xs font-semibold text-slate-700 mb-2">
                    Chọn nhanh từng vòng lặp (Rounds):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {mipsSim.steps.map((s, idx) => (
                      <button
                        key={s.round}
                        type="button"
                        onClick={() => setCurrentRoundIdx(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold cursor-pointer transition-colors ${
                          clampedRoundIdx === idx
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Vòng {s.round} (i={s.t1Val}, res={s.s2Result})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Equivalent C Code (Question 3h Answer Key) */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                  <div className="text-xs font-semibold text-slate-800 mb-1.5">
                    Đáp án Câu 3h: Chuyển thủ tục main sang ngôn ngữ C:
                  </div>
                  <pre className="text-xs font-mono text-slate-800 overflow-x-auto leading-relaxed">
{`int MemArray[] = {1,2,3,4,5,6,7,8,9,10,11,12};
int i = 1, j = 0, result = 0;
do {
    result += MemArray[j++];
    i += ${stepIncrementI};
} while (i < ${limitI}); // Kết quả: result = ${mipsSim.finalResult}, i = ${mipsSim.finalI}`}
                  </pre>
                </div>

                {/* Bitwise & Big-Endian Inspector (Q4 & Q5) */}
                <div className="border-t border-slate-200 pt-4">
                  <div className="text-xs font-bold text-slate-900 mb-2">
                    Trực quan hóa Câu 4 (Bitwise) & Câu 5 (Big-Endian `0xDEADBEEF`):
                  </div>
                  <div className="text-xs font-mono bg-slate-100 p-3 rounded-lg space-y-1 text-slate-800">
                    <div>$t0 = 0xAAAAAAAA → sll 28 = {bitwiseEndian.shiftedT2Hex}</div>
                    <div>or với $t1 (0x01020304) → $t2 = {bitwiseEndian.finalT2Hex}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-2.5 text-center font-mono text-xs">
                    {bitwiseEndian.bigEndianBytes.map((byteHex, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg border ${
                          idx === 2
                            ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="text-[10px] text-slate-500">0x0000000{idx}</div>
                        <div>{byteHex}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* C to MIPS Translation Interactive Side-by-Side (IT089IU Q2a, Q2b & C to MIPS.pdf) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Bàn dịch Tương tác C sang Hợp ngữ MIPS (Câu 2a, 2b IT089IU & Slide C-to-MIPS)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Quy ước thanh ghi: i → $s0, j → $s1, k → $s2, Base Address A → $s3
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCToMipsPattern('if_else')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      cToMipsPattern === 'if_else'
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Câu 2a: if (i == j) A[i] = A[k] + 1
                  </button>
                  <button
                    type="button"
                    onClick={() => setCToMipsPattern('while_loop')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      cToMipsPattern === 'while_loop'
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Câu 2b: while (i != j) A[k - i] = 0
                  </button>
                  <button
                    type="button"
                    onClick={() => setCToMipsPattern('array_sum')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      cToMipsPattern === 'array_sum'
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Fall 2011 Câu 8: Tổng mảng 100 words
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-500 font-sans font-semibold mb-2">Mã nguồn C (C Code):</div>
                  {cToMipsPattern === 'if_else' && (
                    <pre className="text-slate-900 leading-relaxed">
{`// i: $s0, j: $s1, k: $s2, base(A): $s3
if (i == j)
    A[i] = A[k] + 1;
else
    A[i] = A[j] - 1;`}
                    </pre>
                  )}
                  {cToMipsPattern === 'while_loop' && (
                    <pre className="text-slate-900 leading-relaxed">
{`// i: $s0, j: $s1, k: $s2, base(A): $s3
while (i != j) {
    i += 1;
    A[k - i] = 0;
}`}
                    </pre>
                  )}
                  {cToMipsPattern === 'array_sum' && (
                    <pre className="text-slate-900 leading-relaxed">
{`// Tính tổng 100 words vào $1, base(A) trong $3
int sum = 0;
for (int i = 0; i < 100; i++) {
    sum += A[i];
}`}
                    </pre>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-slate-100">
                  <div className="text-sky-400 font-sans font-semibold mb-2">
                    Mã Hợp ngữ MIPS Chuẩn Đáp án (Official MIPS Assembly):
                  </div>
                  {cToMipsPattern === 'if_else' && (
                    <pre className="leading-relaxed text-emerald-300 overflow-x-auto">
{`      bne  $s0, $s1, ELSE   # nếu i != j nhảy tới ELSE
      sll  $t0, $s2, 2      # $t0 = k * 4 (byte offset)
      add  $t0, $s3, $t0    # $t0 = &A[k]
      lw   $t0, 0($t0)      # $t0 = A[k]
      addi $t0, $t0, 1      # $t0 = A[k] + 1
      sll  $t1, $s0, 2      # $t1 = i * 4
      add  $t1, $s3, $t1    # $t1 = &A[i]
      sw   $t0, 0($t1)      # A[i] = A[k] + 1
      j    EXIT             # Nhảy qua khối ELSE
ELSE: sll  $t0, $s1, 2      # $t0 = j * 4
      add  $t0, $s3, $t0    # $t0 = &A[j]
      lw   $t0, 0($t0)      # $t0 = A[j]
      addi $t0, $t0, -1     # $t0 = A[j] - 1
      sll  $t1, $s0, 2      # $t1 = i * 4
      add  $t1, $s3, $t1    # $t1 = &A[i]
      sw   $t0, 0($t1)      # A[i] = A[j] - 1
EXIT:`}
                    </pre>
                  )}
                  {cToMipsPattern === 'while_loop' && (
                    <pre className="leading-relaxed text-emerald-300 overflow-x-auto">
{`LOOP: beq  $s0, $s1, EXIT   # nếu i == j thì thoát vòng lặp
      addi $s0, $s0, 1      # i += 1
      sub  $t0, $s2, $s0    # $t0 = k - i
      sll  $t0, $t0, 2      # $t0 = (k - i) * 4
      add  $t0, $s3, $t0    # $t0 = &A[k - i]
      sw   $zero, 0($t0)    # A[k - i] = 0
      j    LOOP             # Quay lại kiểm tra điều kiện
EXIT:`}
                    </pre>
                  )}
                  {cToMipsPattern === 'array_sum' && (
                    <pre className="leading-relaxed text-emerald-300 overflow-x-auto">
{`      add  $1, $0, $0       # $1 (sum) = 0
      add  $2, $3, $0       # $2 = con trỏ chạy p = &A[0]
      addi $4, $3, 400      # $4 = &A[100] (100 words * 4 bytes)
LOOP: lw   $5, 0($2)        # $5 = *p
      add  $1, $1, $5       # sum += *p
      addi $2, $2, 4        # p++ (tăng 4 bytes)
      bne  $2, $4, LOOP     # Lặp nếu chưa hết 100 phần tử`}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: ARITHMETIC & IEEE 754 ==================== */}
        {activeTab === 'arithmetic' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: IEEE 754 Floating Point Visualizer (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Bộ Giải mã Số thực IEEE 754 Single Precision (32-bit)
                  </h3>
                  <p className="text-xs text-slate-500">
                    1 bit Sign · 8 bits Biased Exponent (Bias = 127) · 23 bits Significand/Fraction
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: '118.75 (COMP212 Q4.1)', val: '118.75' },
                    { label: '-0.0390625 (Q4.2: -5/128)', val: '-0.0390625' },
                    { label: '0.15 (COMP212 Q4.3)', val: '0.15' },
                    { label: '6.25 (CO2007 Q13)', val: '6.25' },
                    { label: '12.625 (CO2007 Q14)', val: '12.625' },
                  ].map((p) => (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => setIeeeInput(p.val)}
                      className="px-2.5 py-1 text-xs font-mono font-medium bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 rounded-md transition-colors cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="ieee-input"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Nhập số thực thập phân bất kỳ:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="ieee-input"
                    type="number"
                    step="any"
                    value={ieeeInput}
                    onChange={(e) => setIeeeInput(e.target.value)}
                    className="px-3.5 py-2 border border-slate-300 rounded-lg font-mono text-sm w-48 focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                  <div className="text-sm font-mono font-bold text-sky-800 bg-sky-50 px-3.5 py-2 rounded-lg border border-sky-200">
                    Mã Hex: {ieeeResult.hexString}
                  </div>
                </div>
              </div>

              {/* 32-bit Visual Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 mb-5 font-mono">
                <div className="md:col-span-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
                  <div className="text-[11px] font-sans font-semibold text-rose-800">
                    Sign (1b)
                  </div>
                  <div className="text-lg font-bold text-rose-950 my-1">{ieeeResult.signBit}</div>
                  <div className="text-[11px] text-rose-700">
                    {ieeeResult.signBit === '0' ? 'Dương (+)' : 'Âm (-)'}
                  </div>
                </div>

                <div className="md:col-span-4 p-3 rounded-xl bg-sky-50 border border-sky-200 text-center">
                  <div className="text-[11px] font-sans font-semibold text-sky-800">
                    Biased Exponent (8b)
                  </div>
                  <div className="text-base font-bold text-sky-950 my-1 tracking-wider">
                    {ieeeResult.exponentBits.slice(0, 4)} {ieeeResult.exponentBits.slice(4)}
                  </div>
                  <div className="text-[11px] text-sky-800">
                    {ieeeResult.trueExponent} + 127 = {ieeeResult.biasedExponentDec}
                  </div>
                </div>

                <div className="md:col-span-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <div className="text-[11px] font-sans font-semibold text-emerald-800">
                    Significand / Fraction (23b)
                  </div>
                  <div className="text-xs font-bold text-emerald-950 my-1.5 break-all">
                    {ieeeResult.mantissaBits.slice(0, 8)} {ieeeResult.mantissaBits.slice(8, 16)}{' '}
                    {ieeeResult.mantissaBits.slice(16)}
                  </div>
                  <div className="text-[11px] font-sans text-emerald-900">
                    Chuẩn hóa:{' '}
                    <MathFormula
                      tex={`(-1)^{${ieeeResult.signBit}} \\times 1.${ieeeResult.mantissaBits.replace(/0+$/, '') || '0'}_2 \\times 2^{${ieeeResult.trueExponent}}`}
                    />
                  </div>
                </div>
              </div>

              {/* 32-Bit Individual Bit Strip Visualizer */}
              <div className="mb-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-slate-600 mb-2">
                  <span>Thanh Ghi 32-Bit IEEE 754 Trực Quan (Từ Bit 31 → Bit 0):</span>
                  <div className="flex items-center gap-3">
                    <span className="text-rose-700">■ Bit 31: Sign (1b)</span>
                    <span className="text-sky-700">■ Bits 30..23: Exponent (8b)</span>
                    <span className="text-emerald-700">■ Bits 22..0: Fraction (23b)</span>
                  </div>
                </div>
                <div className="grid grid-cols-16 sm:grid-cols-32 gap-0.5 font-mono text-[10px] text-center">
                  {/* Sign bit */}
                  <div
                    title="Bit 31 (Sign)"
                    className="py-1.5 rounded-xs bg-rose-600 text-white font-bold"
                  >
                    {ieeeResult.signBit}
                  </div>
                  {/* 8 Exponent bits */}
                  {ieeeResult.exponentBits.split('').map((b, idx) => (
                    <div
                      key={`exp-${idx}`}
                      title={`Bit ${30 - idx} (Exponent)`}
                      className="py-1.5 rounded-xs bg-sky-600 text-white font-bold"
                    >
                      {b}
                    </div>
                  ))}
                  {/* 23 Mantissa bits */}
                  {ieeeResult.mantissaBits.split('').map((b, idx) => (
                    <div
                      key={`man-${idx}`}
                      title={`Bit ${22 - idx} (Fraction)`}
                      className={`py-1.5 rounded-xs font-bold ${
                        b === '1'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {b}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                <div className="text-sky-800 font-bold uppercase tracking-wider">
                  Các bước trình bày tự luận chuẩn (COMP 212 Câu 4):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="bg-white border border-slate-200 rounded-lg p-2.5">
                    <span className="font-semibold text-slate-700">1. Bit dấu (Sign): </span>
                    <MathFormula tex={`S = \\mathbf{${ieeeResult.signBit}}`} />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-2.5">
                    <span className="font-semibold text-slate-700">2. Số mũ thực: </span>
                    <MathFormula tex={`E_{\\text{true}} = \\mathbf{${ieeeResult.trueExponent}}`} />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-2.5 sm:col-span-2">
                    <span className="font-semibold text-slate-700">3. Số mũ lệch (Biased Exponent): </span>
                    <MathFormula
                      tex={`E_{\\text{biased}} = ${ieeeResult.trueExponent} + 127 = \\mathbf{${ieeeResult.biasedExponentDec}_{10}} = \\mathbf{${ieeeResult.exponentBits}_2}`}
                    />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-2.5 sm:col-span-2">
                    <span className="font-semibold text-slate-700">4. Giá trị công thức chuẩn hóa: </span>
                    <MathFormula
                      tex={`(-1)^{${ieeeResult.signBit}} \\times (1.${ieeeResult.mantissaBits.slice(0, 8)}\\dots)_2 \\times 2^{${ieeeResult.biasedExponentDec} - 127} \\Rightarrow \\mathbf{${ieeeResult.hexString}}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Two's Complement Arithmetic & Overflow Detector (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Số học Bù 2 & Kiểm tra Tràn số (Overflow)
                  </h4>
                  <p className="text-xs text-slate-500">
                    COMP 212 Câu 3 (8-bit: A=54, B=-77) & Fall 2011 Câu 1 (5-bit)
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {([5, 8, 16] as const).map((bw) => (
                    <button
                      key={bw}
                      type="button"
                      onClick={() => setTwosBitWidth(bw)}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
                        twosBitWidth === bw
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {bw}-bit
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setTwosBitWidth(8);
                    setTwosA(54);
                    setTwosB(-77);
                    setTwosOp('+');
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-md font-medium cursor-pointer"
                >
                  Đề COMP212: 54 + (-77) [8-bit]
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTwosBitWidth(8);
                    setTwosA(54);
                    setTwosB(-77);
                    setTwosOp('-');
                  }}
                  className="px-2.5 py-1 text-xs bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 rounded-md font-medium cursor-pointer"
                >
                  Đề COMP212: 54 - (-77) [Overflow!]
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTwosBitWidth(5);
                    setTwosA(-12);
                    setTwosB(5);
                    setTwosOp('-');
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-md font-medium cursor-pointer"
                >
                  Fall 2011: -12 - 5 [5-bit]
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 items-end">
                <div>
                  <label htmlFor="twos-a" className="block text-xs font-semibold text-slate-700 mb-1">
                    Số A (Thập phân)
                  </label>
                  <input
                    id="twos-a"
                    type="number"
                    value={twosA}
                    onChange={(e) => setTwosA(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="twos-op" className="block text-xs font-semibold text-slate-700 mb-1">
                    Phép toán
                  </label>
                  <select
                    id="twos-op"
                    value={twosOp}
                    onChange={(e) => setTwosOp(e.target.value as '+' | '-')}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-sm bg-white"
                  >
                    <option value="+">A + B</option>
                    <option value="-">A - B</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="twos-b" className="block text-xs font-semibold text-slate-700 mb-1">
                    Số B (Thập phân)
                  </label>
                  <input
                    id="twos-b"
                    type="number"
                    value={twosB}
                    onChange={(e) => setTwosB(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-sm"
                  />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                <div className="text-slate-600 font-medium">
                  Dải biểu diễn {twosResult.bitWidth}-bit bù 2:{' '}
                  <MathFormula
                    tex={`[-2^{${twosResult.bitWidth - 1}},\\ +2^{${twosResult.bitWidth - 1}} - 1] = [${twosResult.minVal},\\ +${twosResult.maxVal}]`}
                  />
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-700">Toán hạng A ({twosA}):</span>
                    <MathFormula tex={`\\mathbf{${twosResult.aBin}_2}`} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-700">
                      Toán hạng {twosOp === '+' ? 'B' : '-B'} ({twosOp === '+' ? twosB : -twosB}):
                    </span>
                    <MathFormula tex={`\\mathbf{${twosResult.bBin}_2}`} />
                  </div>
                  <div className="border-t border-slate-200 pt-1.5 flex justify-between items-center font-bold">
                    <span className="text-slate-900">Kết quả ({twosResult.sumDec}):</span>
                    <span className={twosResult.overflow ? 'text-rose-700' : 'text-emerald-700'}>
                      <MathFormula tex={`\\mathbf{${twosResult.sumBin}_2}`} />
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`p-3.5 rounded-xl border text-xs font-medium ${
                  twosResult.overflow
                    ? 'bg-rose-50 border-rose-300 text-rose-950'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                }`}
              >
                <div className="font-bold mb-0.5">
                  {twosResult.overflow ? '▲ CẢNH BÁO TRÀN SỐ (OVERFLOW DETECTED)' : '● HỢP LỆ (NO OVERFLOW)'}
                </div>
                <div>{twosResult.overflowReason}</div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: DATAPATH & PIPELINE ==================== */}
        {activeTab === 'datapath' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Single-Cycle Control Signals Inspector (6 cols) */}
              <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Tín hiệu Điều khiển Single-Cycle Datapath
                    </h3>
                    <p className="text-xs text-slate-500">
                      Đề CO2007 Câu 18–24 · Chọn lệnh để xem đường đi dữ liệu và bảng Control Signals
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {(['lw', 'add', 'sw', 'beq'] as const).map((inst) => (
                    <button
                      key={inst}
                      type="button"
                      onClick={() => setSelectedInstr(inst)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors ${
                        selectedInstr === inst
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {datapathSpecs[inst].syntax}
                    </button>
                  ))}
                </div>

                {/* Active Datapath Stages Flow */}
                <div className="mb-5">
                  <div className="text-xs font-semibold text-slate-600 mb-2">
                    Các khối phần cứng tham gia thực thi ({datapathSpecs[selectedInstr].format}):
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {datapathSpecs[selectedInstr].activeBlocks.map((blk, i, arr) => (
                      <React.Fragment key={blk}>
                        <span className="px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-900 text-xs font-semibold">
                          {blk}
                        </span>
                        {i < arr.length - 1 && <span className="text-slate-400 font-bold">→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Control Signals Table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4 font-mono text-xs">
                  {Object.entries(datapathSpecs[selectedInstr].signals).map(([sig, val]) => {
                    const isZero = val.startsWith('0');
                    const isOne = val.startsWith('1');
                    return (
                      <div
                        key={sig}
                        className={`p-2.5 rounded-lg border ${
                          isOne
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                            : isZero
                            ? 'bg-slate-50 border-slate-200 text-slate-700'
                            : 'bg-amber-50 border-amber-200 text-amber-900'
                        }`}
                      >
                        <div className="text-[11px] font-sans text-slate-500 font-semibold">{sig}</div>
                        <div className="font-bold mt-0.5">{val}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 text-xs leading-relaxed">
                  <span className="text-sky-400 font-semibold">Ghi chú Đề thi CO2007: </span>
                  {datapathSpecs[selectedInstr].note}
                </div>
              </div>

              {/* Right: 5-Stage Pipeline Hazard & Forwarding Analyzer (6 cols) */}
              <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Phân tích Pipeline 5 Tầng & Data Hazards (CO2007 Câu 25–29)
                    </h3>
                    <p className="text-xs text-slate-500">
                      So sánh số chu kỳ thực thi chuỗi 6 lệnh khi Tắt / Bật kỹ thuật Forwarding
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForwardingEnabled((prev) => !prev)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      forwardingEnabled
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {forwardingEnabled ? 'Đang BẬT Forwarding (12 chu kỳ)' : 'Đang TẮT Forwarding (18 chu kỳ)'}
                  </button>
                </div>

                <div className="space-y-2.5 font-mono text-xs mb-5">
                  {[
                    {
                      id: 1,
                      code: '1. lw  $t0, 100($s0)',
                      hazard: 'Tạo giá trị $t0 ở cuối tầng MEM (Cycle 4)',
                      cyclesNoFwd: 'C1–C5',
                      cyclesFwd: 'C1–C5',
                    },
                    {
                      id: 2,
                      code: '2. add $t0, $t0, $t1',
                      hazard: 'RAW Hazard trên $t0 từ lệnh 1 (Load-Use!)',
                      cyclesNoFwd: '+2 Stalls (xong C8)',
                      cyclesFwd: '+1 Stall (Forward MEM/WB → EX tại C5, ForwardA=01)',
                    },
                    {
                      id: 3,
                      code: '3. sw  $t1, 100($t0)',
                      hazard: 'RAW Hazard trên $t0 từ lệnh 2',
                      cyclesNoFwd: '+2 Stalls (xong C11)',
                      cyclesFwd: '0 Stall (Forward EX/MEM → EX)',
                    },
                    {
                      id: 4,
                      code: '4. add $t0, $t1, $t0',
                      hazard: 'RAW Hazard trên $t0 từ lệnh 2',
                      cyclesNoFwd: '0 Stall thêm (xong C12)',
                      cyclesFwd: '0 Stall (Forward MEM/WB → EX)',
                    },
                    {
                      id: 5,
                      code: '5. lw  $t1, 100($t0)',
                      hazard: 'RAW Hazard trên $t0 từ lệnh 4',
                      cyclesNoFwd: '+2 Stalls (xong C15)',
                      cyclesFwd: '0 Stall (Forward EX/MEM → EX)',
                    },
                    {
                      id: 6,
                      code: '6. add $t0, $t0, $t1',
                      hazard: 'RAW Hazard trên $t1 từ lệnh 5 (Load-Use!)',
                      cyclesNoFwd: '+2 Stalls (Hoàn tất ở C18)',
                      cyclesFwd: '+1 Stall (Hoàn tất ở C12)',
                    },
                  ].map((row) => (
                    <div
                      key={row.id}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{row.code}</div>
                        <div className="text-[11px] font-sans text-slate-600">{row.hazard}</div>
                      </div>
                      <div
                        className={`text-right font-semibold shrink-0 ${
                          forwardingEnabled ? 'text-emerald-700' : 'text-amber-800'
                        }`}
                      >
                        {forwardingEnabled ? row.cyclesFwd : row.cyclesNoFwd}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 text-center font-mono text-xs">
                  <div className="p-3 rounded-lg bg-slate-100">
                    <div className="text-slate-500 font-sans">Tổng Data Hazards</div>
                    <div className="text-lg font-bold text-slate-900">5 xung đột</div>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="text-amber-800 font-sans">Không Forwarding</div>
                    <div className="text-lg font-bold text-amber-950">18 chu kỳ</div>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="text-emerald-800 font-sans">Có Forwarding</div>
                    <div className="text-lg font-bold text-emerald-950">12 chu kỳ</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Cycle-by-Cycle Pipeline Gantt Diagram (12 Cycles with Forwarding) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Biểu đồ Thời gian Chu kỳ Pipeline 5 Tầng (Pipeline Execution Diagram - Đề CO2007 Câu 27–29)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Minh họa trực quan 12 chu kỳ khi BẬT Forwarding: Tại Chu kỳ 5 (C5), lệnh 2 đang ở tầng EX nhận dữ liệu từ tầng WB của lệnh 1 (`ForwardA = 01`, `ForwardB = 00`).
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-900 font-bold">IF / ID / EX / MEM / WB</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">STALL (Bubble)</span>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-center text-xs font-mono tabular-nums">
                  <thead className="bg-slate-900 text-slate-100">
                    <tr>
                      <th className="py-2.5 px-3 text-left">Lệnh MIPS</th>
                      {Array.from({ length: 12 }, (_, i) => (
                        <th
                          key={i}
                          className={`py-2.5 px-2 ${
                            i + 1 === 5 ? 'bg-sky-600 text-white font-bold' : ''
                          }`}
                        >
                          C{i + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {[
                      {
                        inst: '1. lw $t0, 100($s0)',
                        stages: ['IF', 'ID', 'EX', 'MEM', 'WB', '', '', '', '', '', '', ''],
                      },
                      {
                        inst: '2. add $t0, $t0, $t1',
                        stages: ['', 'IF', 'ID', 'STALL', 'EX*', 'MEM', 'WB', '', '', '', '', ''],
                      },
                      {
                        inst: '3. sw $t1, 100($t0)',
                        stages: ['', '', 'IF', 'STALL', 'ID', 'EX', 'MEM', 'WB', '', '', '', ''],
                      },
                      {
                        inst: '4. add $t0, $t1, $t0',
                        stages: ['', '', '', '', 'IF', 'ID', 'EX', 'MEM', 'WB', '', '', ''],
                      },
                      {
                        inst: '5. lw $t1, 100($t0)',
                        stages: ['', '', '', '', '', 'IF', 'ID', 'EX', 'MEM', 'WB', '', ''],
                      },
                      {
                        inst: '6. add $t0, $t0, $t1',
                        stages: ['', '', '', '', '', '', 'IF', 'ID', 'STALL', 'EX*', 'MEM', 'WB'],
                      },
                    ].map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-left font-bold text-slate-900 whitespace-nowrap">
                          {row.inst}
                        </td>
                        {row.stages.map((st, cIdx) => {
                          const isCycle5 = cIdx + 1 === 5;
                          let cellClass = 'text-slate-300';
                          if (st === 'STALL') {
                            cellClass = 'bg-amber-100 text-amber-900 font-bold';
                          } else if (st.startsWith('EX')) {
                            cellClass = isCycle5
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'bg-sky-100 text-sky-900 font-bold';
                          } else if (st) {
                            cellClass = isCycle5
                              ? 'bg-sky-50 text-sky-900 font-bold border-x border-sky-300'
                              : 'bg-slate-100 text-slate-800 font-semibold';
                          }
                          return (
                            <td key={cIdx} className={`py-2 px-1.5 border-l border-slate-100 ${cellClass}`}>
                              {st || '·'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: CACHE MAPPING VISUALIZER ==================== */}
        {activeTab === 'cache' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Stage: Address Bit Partition & Hex Decoder (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Phân hoạch Địa chỉ Vật lý & Giải mã Cache (Tag / Index / Offset)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tự động tách trường bit, đổi sang Hexa và tính tổng số bit phần cứng Cache
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyCachePreset('comp212_direct')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      cachePreset === 'comp212_direct'
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    COMP212 Q6.4 (Direct)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyCachePreset('comp212_4way')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      cachePreset === 'comp212_4way'
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    COMP212 Q6.5 (4-Way)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyCachePreset('co2007_direct')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      cachePreset === 'co2007_direct'
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    CO2007 Q31–32 (64KB)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyCachePreset('fall2011_8way')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      cachePreset === 'fall2011_8way'
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Fall 2011 Q5 (8-Way)
                  </button>
                </div>
              </div>

              {/* Proportional Address Bit Bar */}
              <div className="mb-6">
                <div className="text-xs font-semibold text-slate-700 mb-2">
                  Cấu trúc khung địa chỉ {cacheResult.addressBits}-bit:
                </div>
                <div className="grid grid-cols-12 gap-2 font-mono text-center">
                  <div className="col-span-5 p-3.5 rounded-xl bg-sky-50 border border-sky-200">
                    <div className="text-xs font-sans font-semibold text-sky-800">Tag Field</div>
                    <div className="text-2xl font-bold text-sky-950 my-0.5">
                      {cacheResult.tagBits} bits
                    </div>
                    {cacheResult.addressDecode && (
                      <div className="text-xs text-sky-700 truncate">
                        Hex: {cacheResult.addressDecode.tagHex}
                      </div>
                    )}
                  </div>

                  <div className="col-span-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="text-xs font-sans font-semibold text-amber-900">
                      {ways === 1 ? 'Line Index' : ways === 0 ? 'Fully Assoc' : 'Set Index'}
                    </div>
                    <div className="text-2xl font-bold text-amber-950 my-0.5">
                      {cacheResult.indexBits} bits
                    </div>
                    {cacheResult.addressDecode && (
                      <div className="text-xs text-amber-800 truncate">
                        Hex: {cacheResult.addressDecode.indexHex}
                      </div>
                    )}
                  </div>

                  <div className="col-span-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="text-xs font-sans font-semibold text-emerald-900">
                      Byte Offset
                    </div>
                    <div className="text-2xl font-bold text-emerald-950 my-0.5">
                      {cacheResult.offsetBits} bits
                    </div>
                    {cacheResult.addressDecode && (
                      <div className="text-xs text-emerald-800 truncate">
                        Hex: {cacheResult.addressDecode.offsetHex}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Specific Hex Address Breakdown (e.g., DB86E2h or 8B86E1h) */}
              {cacheResult.addressDecode && (
                <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs space-y-2 mb-5">
                  <div className="flex items-center justify-between text-sky-400 font-semibold">
                    <span>Giải mã chi tiết địa chỉ {cacheResult.addressDecode.hexAddress}:</span>
                    <span>Block Addr = {cacheResult.addressDecode.blockAddressHex}</span>
                  </div>
                  <div className="break-all text-slate-300">
                    Nhị phân ({cacheResult.addressBits}b):{' '}
                    <span className="text-sky-300 font-bold">{cacheResult.addressDecode.tagBin}</span>
                    {cacheResult.addressDecode.indexBin && (
                      <>
                        {' | '}
                        <span className="text-amber-300 font-bold">
                          {cacheResult.addressDecode.indexBin}
                        </span>
                      </>
                    )}
                    {' | '}
                    <span className="text-emerald-300 font-bold">
                      {cacheResult.addressDecode.offsetBin}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-slate-200">
                    <div>Tag = {cacheResult.addressDecode.tagHex}</div>
                    <div>Line/Set = {cacheResult.addressDecode.indexHex}</div>
                    <div>Word/Offset = {cacheResult.addressDecode.offsetHex}</div>
                  </div>
                </div>
              )}

              {/* Total Hardware Bits Summary & Formula Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-800">
                  Công thức Giải mã Bit Địa chỉ & Dung lượng Phần cứng Cache:
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs space-y-1.5 overflow-x-auto">
                  <div>
                    1. Số bit Offset:{' '}
                    <MathFormula
                      tex={`b = \\log_2(${blockBytes}\\text{ B}) = \\mathbf{${cacheResult.offsetBits}\\text{ bits}}`}
                    />
                  </div>
                  <div>
                    2. Số bit Index:{' '}
                    <MathFormula
                      tex={`s = \\log_2(${cacheResult.totalSets}\\text{ sets}) = \\mathbf{${cacheResult.indexBits}\\text{ bits}}`}
                    />
                  </div>
                  <div>
                    3. Số bit Tag:{' '}
                    <MathFormula
                      tex={`t = ${cacheResult.addressBits} - ${cacheResult.indexBits} - ${cacheResult.offsetBits} = \\mathbf{${cacheResult.tagBits}\\text{ bits}}`}
                    />
                  </div>
                  <div>
                    4. Tổng số bit phần cứng Cache:{' '}
                    <MathFormula
                      tex={`\\text{Total Bits} = ${cacheResult.totalBlocksInCache.toLocaleString('en-US')} \\times (1_{\\text{valid}} + ${cacheResult.tagBits}_{\\text{tag}} + ${blockBytes * 8}_{\\text{data}}) = \\mathbf{${cacheResult.totalStorageBits.toLocaleString('en-US')}\\text{ bits}}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Control Panel (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h4 className="text-base font-bold text-slate-900">
                Thiết lập Tham số Hệ thống Cache
              </h4>

              <div>
                <label htmlFor="cache-addr-bits" className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Số bit Địa chỉ Vật lý (Address Bits):</span>
                  <span className="font-mono text-sky-700">{addrBits} bits</span>
                </label>
                <input
                  id="cache-addr-bits"
                  type="range"
                  min={16}
                  max={36}
                  step={2}
                  value={addrBits}
                  onChange={(e) => setAddrBits(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="cache-size-select" className="block text-xs font-semibold text-slate-700 mb-1">
                    Dung lượng Cache (KB)
                  </label>
                  <select
                    id="cache-size-select"
                    value={cacheKB}
                    onChange={(e) => setCacheKB(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs bg-white"
                  >
                    {[16, 32, 64, 128, 256, 512, 1024].map((kb) => (
                      <option key={kb} value={kb}>
                        {kb} KB
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="block-size-select" className="block text-xs font-semibold text-slate-700 mb-1">
                    Kích thước Block (Bytes)
                  </label>
                  <select
                    id="block-size-select"
                    value={blockBytes}
                    onChange={(e) => setBlockBytes(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs bg-white"
                  >
                    {[4, 8, 16, 32, 64].map((b) => (
                      <option key={b} value={b}>
                        {b} Bytes ({b / 4} words)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="assoc-ways-select" className="block text-xs font-semibold text-slate-700 mb-1">
                  Kiểu Ánh xạ (Associativity)
                </label>
                <select
                  id="assoc-ways-select"
                  value={ways}
                  onChange={(e) => setWays(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs bg-white"
                >
                  <option value={1}>Direct-Mapped (1-Way)</option>
                  <option value={2}>2-Way Set Associative</option>
                  <option value={4}>4-Way Set Associative</option>
                  <option value={8}>8-Way Set Associative</option>
                  <option value={0}>Fully Associative (Toàn phần)</option>
                </select>
              </div>

              <div>
                <label htmlFor="sample-hex-input" className="block text-xs font-semibold text-slate-700 mb-1">
                  Địa chỉ Byte cần giải mã (Hexa):
                </label>
                <div className="flex gap-2">
                  <input
                    id="sample-hex-input"
                    type="text"
                    value={sampleHexAddr}
                    onChange={(e) => setSampleHexAddr(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setSampleHexAddr('DB86E2')}
                    className="px-2.5 py-1.5 text-xs font-mono bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    A1: DB86E2h
                  </button>
                  <button
                    type="button"
                    onClick={() => setSampleHexAddr('8B86E1')}
                    className="px-2.5 py-1.5 text-xs font-mono bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    A2: 8B86E1h
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
