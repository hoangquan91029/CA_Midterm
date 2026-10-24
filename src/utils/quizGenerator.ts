import {
  calculatePerformanceComparison,
  simulateMipsArrayLoop,
  evaluateTwosComplementOp,
  encodeIeee754Single,
  calculateCacheMapping,
  ProcessorClassSpec,
} from './archLogic';
import { QuizQuestion, QuizTopic } from '../data/quizBank';

/**
 * Deterministic shuffle of 4 options based on a numeric seed so that
 * the correct option is evenly distributed across A, B, C, D in both VI and EN.
 */
function placeBilingualOptionsWithSeed(
  correctOptionVi: string,
  distractorsVi: [string, string, string],
  correctOptionEn: string,
  distractorsEn: [string, string, string],
  seed: number
): { options: string[]; enOptions: string[]; correctIndex: number } {
  const targetIdx = Math.abs(seed) % 4;
  const options: string[] = [];
  const enOptions: string[] = [];
  let dIdx = 0;
  for (let i = 0; i < 4; i++) {
    if (i === targetIdx) {
      options.push(correctOptionVi);
      enOptions.push(correctOptionEn);
    } else {
      options.push(distractorsVi[dIdx]);
      enOptions.push(distractorsEn[dIdx]);
      dIdx++;
    }
  }
  return { options, enOptions, correctIndex: targetIdx };
}

/**
 * Generates a brand-new, mathematically verified bilingual Computer Architecture quiz question
 * for the requested topic and seed number.
 */
export function generateDynamicQuizQuestion(
  topic: QuizTopic,
  seed: number
): QuizQuestion {
  const s = Math.abs(seed);

  switch (topic) {
    case 'performance': {
      const variant = s % 2;
      if (variant === 0) {
        // Variant A: P1 vs P2 Performance Comparison (IT089IU Q1 / Fall 2011 Q3 style)
        const icMillionsList = [10, 20, 40, 50, 80];
        const icM = icMillionsList[s % icMillionsList.length];
        const clockPairs: [number, number][] = [
          [2.0, 2.5],
          [2.5, 3.2],
          [3.0, 4.0],
          [2.4, 3.0],
          [3.5, 4.2],
        ];
        const [f1, f2] = clockPairs[(s >> 1) % clockPairs.length];
        const mixTemplates: [number, number, number, number][] = [
          [25, 15, 40, 20],
          [30, 20, 30, 20],
          [10, 30, 40, 20],
          [20, 25, 35, 20],
          [15, 25, 45, 15],
        ];
        const [pA, pB, pC, pD] = mixTemplates[(s >> 2) % mixTemplates.length];
        const cpi1: [number, number, number, number] = [
          1 + (s % 3),
          2 + ((s + 1) % 3),
          1 + ((s + 2) % 2),
          2 + (s % 2),
        ];
        const cpi2: [number, number, number, number] = [
          2 + (s % 2),
          1 + ((s + 1) % 2),
          2 + ((s + 2) % 3),
          1 + (s % 3),
        ];

        const specs: ProcessorClassSpec[] = [
          { className: 'A', fractionPercent: pA, cpiP1: cpi1[0], cpiP2: cpi2[0] },
          { className: 'B', fractionPercent: pB, cpiP1: cpi1[1], cpiP2: cpi2[1] },
          { className: 'C', fractionPercent: pC, cpiP1: cpi1[2], cpiP2: cpi2[2] },
          { className: 'D', fractionPercent: pD, cpiP1: cpi1[3], cpiP2: cpi2[3] },
        ];

        const res = calculatePerformanceComparison(icM * 1_000_000, f1, f2, specs);
        const cyc1M = (res.cyclesP1 / 1e6).toFixed(1);
        const cyc2M = (res.cyclesP2 / 1e6).toFixed(1);
        const t1 = res.cpuTimeP1Ms.toFixed(2);
        const t2 = res.cpuTimeP2Ms.toFixed(2);
        const fasterLabelVi =
          res.fasterProcessor === 'Equal'
            ? 'Hai bộ xử lý nhanh ngang nhau'
            : `${res.fasterProcessor} nhanh hơn (${res.speedupRatio}\\times)`;
        const fasterLabelEn =
          res.fasterProcessor === 'Equal'
            ? 'Both processors have equal speed'
            : `${res.fasterProcessor} is faster (${res.speedupRatio}\\times)`;

        const correctOptVi = `$\\text{CPI}_{\\text{P1}} = ${res.avgCpiP1}$, $\\text{CPI}_{\\text{P2}} = ${res.avgCpiP2}$; $T_{\\text{P1}} = ${t1}\\text{ ms}$, $T_{\\text{P2}} = ${t2}\\text{ ms}$ $\\rightarrow$ ${fasterLabelVi}`;
        const d1Vi = `$\\text{CPI}_{\\text{P1}} = ${res.avgCpiP2}$, $\\text{CPI}_{\\text{P2}} = ${res.avgCpiP1}$; $T_{\\text{P1}} = ${t2}\\text{ ms}$, $T_{\\text{P2}} = ${t1}\\text{ ms}$`;
        const d2Vi = `$\\text{CPI}_{\\text{P1}} = ${(res.avgCpiP1 + 0.4).toFixed(2)}$, $\\text{CPI}_{\\text{P2}} = ${(res.avgCpiP2 + 0.3).toFixed(2)}$; $T_{\\text{P1}} = ${(res.cpuTimeP1Ms * 1.2).toFixed(2)}\\text{ ms}$, $T_{\\text{P2}} = ${(res.cpuTimeP2Ms * 1.2).toFixed(2)}\\text{ ms}$`;
        const d3Vi = `$\\text{CPI}_{\\text{P1}} = ${res.avgCpiP1}$, $\\text{CPI}_{\\text{P2}} = ${res.avgCpiP2}$; $T_{\\text{P1}} = ${(res.cyclesP1 / 1e6 / f2).toFixed(2)}\\text{ ms}$, $T_{\\text{P2}} = ${(res.cyclesP2 / 1e6 / f1).toFixed(2)}\\text{ ms}$ (chia nhầm tần số)`;

        const correctOptEn = `$\\text{CPI}_{\\text{P1}} = ${res.avgCpiP1}$, $\\text{CPI}_{\\text{P2}} = ${res.avgCpiP2}$; $T_{\\text{P1}} = ${t1}\\text{ ms}$, $T_{\\text{P2}} = ${t2}\\text{ ms}$ $\\rightarrow$ ${fasterLabelEn}`;
        const d1En = `$\\text{CPI}_{\\text{P1}} = ${res.avgCpiP2}$, $\\text{CPI}_{\\text{P2}} = ${res.avgCpiP1}$; $T_{\\text{P1}} = ${t2}\\text{ ms}$, $T_{\\text{P2}} = ${t1}\\text{ ms}$`;
        const d2En = `$\\text{CPI}_{\\text{P1}} = ${(res.avgCpiP1 + 0.4).toFixed(2)}$, $\\text{CPI}_{\\text{P2}} = ${(res.avgCpiP2 + 0.3).toFixed(2)}$; $T_{\\text{P1}} = ${(res.cpuTimeP1Ms * 1.2).toFixed(2)}\\text{ ms}$, $T_{\\text{P2}} = ${(res.cpuTimeP2Ms * 1.2).toFixed(2)}\\text{ ms}$`;
        const d3En = `$\\text{CPI}_{\\text{P1}} = ${res.avgCpiP1}$, $\\text{CPI}_{\\text{P2}} = ${res.avgCpiP2}$; $T_{\\text{P1}} = ${(res.cyclesP1 / 1e6 / f2).toFixed(2)}\\text{ ms}$, $T_{\\text{P2}} = ${(res.cyclesP2 / 1e6 / f1).toFixed(2)}\\text{ ms}$ (swapped clock rates)`;

        const { options, enOptions, correctIndex } = placeBilingualOptionsWithSeed(
          correctOptVi,
          [d1Vi, d2Vi, d3Vi],
          correctOptEn,
          [d1En, d2En, d3En],
          s
        );

        return {
          id: `gen-perf-${s}`,
          sourceExam: 'Đề Tự Sinh (Auto-Gen)',
          topic: 'performance',
          topicLabel: 'So sánh Hiệu năng P1 vs P2 (Tự sinh)',
          enTopicLabel: 'Comparing P1 vs. P2 Performance (Auto-Gen)',
          mindMapNodeId: 'cat-1-2',
          difficulty: 'Vận dụng',
          isGenerated: true,
          question: `[Bài tập Tự sinh #${s}] Hai bộ xử lý P1 ($${f1}\\text{ GHz}$) và P2 ($${f2}\\text{ GHz}$) thực thi một chương trình gồm $${icM} \\times 10^6$ lệnh với tỷ lệ 4 lớp (A, B, C, D) là $(${pA}\\%, ${pB}\\%, ${pC}\\%, ${pD}\\%)$. Biết CPI trên P1 là $(${cpi1.join(', ')}) $ và trên P2 là $(${cpi2.join(', ')}) $. Hãy tính $\\text{CPI}_{\\text{avg}}$ và $\\text{CPU Time}$ của mỗi máy:`,
          enQuestion: `[Auto-Generated #${s}] Two processors P1 ($${f1}\\text{ GHz}$) and P2 ($${f2}\\text{ GHz}$) execute a program of $${icM} \\times 10^6$ instructions split into 4 classes (A, B, C, D) with frequencies $(${pA}\\%, ${pB}\\%, ${pC}\\%, ${pD}\\%)$. Given CPIs on P1 of $(${cpi1.join(', ')}) $ and on P2 of $(${cpi2.join(', ')}) $, calculate $\\text{CPI}_{\\text{avg}}$ and $\\text{CPU Time}$ for each processor:`,
          options,
          enOptions,
          correctIndex,
          explanation: `• **Bước 1 (Tính $\\text{CPI}_{\\text{avg}}$)**:\n  $\\text{CPI}_{\\text{P1}} = ${(pA / 100).toFixed(2)}\\times${cpi1[0]} + ${(pB / 100).toFixed(2)}\\times${cpi1[1]} + ${(pC / 100).toFixed(2)}\\times${cpi1[2]} + ${(pD / 100).toFixed(2)}\\times${cpi1[3]} = \\mathbf{${res.avgCpiP1}}$.\n  $\\text{CPI}_{\\text{P2}} = ${(pA / 100).toFixed(2)}\\times${cpi2[0]} + ${(pB / 100).toFixed(2)}\\times${cpi2[1]} + ${(pC / 100).toFixed(2)}\\times${cpi2[2]} + ${(pD / 100).toFixed(2)}\\times${cpi2[3]} = \\mathbf{${res.avgCpiP2}}$.\n• **Bước 2 (Tổng số chu kỳ)**:\n  $\\text{Cycles}_{\\text{P1}} = ${icM}\\times 10^6 \\times ${res.avgCpiP1} = \\mathbf{${cyc1M} \\times 10^6\\text{ cycles}}$.\n  $\\text{Cycles}_{\\text{P2}} = ${icM}\\times 10^6 \\times ${res.avgCpiP2} = \\mathbf{${cyc2M} \\times 10^6\\text{ cycles}}$.\n• **Bước 3 (Thời gian thực thi $\\text{CPU Time}$)**:\n  $T_{\\text{P1}} = \\dfrac{${cyc1M} \\times 10^6}{${f1} \\times 10^9} = \\mathbf{${t1}\\text{ ms}}$; $T_{\\text{P2}} = \\dfrac{${cyc2M} \\times 10^6}{${f2} \\times 10^9} = \\mathbf{${t2}\\text{ ms}}$.`,
          enExplanation: `• **Step 1 (Compute $\\text{CPI}_{\\text{avg}}$)**:\n  $\\text{CPI}_{\\text{P1}} = ${(pA / 100).toFixed(2)}\\times${cpi1[0]} + ${(pB / 100).toFixed(2)}\\times${cpi1[1]} + ${(pC / 100).toFixed(2)}\\times${cpi1[2]} + ${(pD / 100).toFixed(2)}\\times${cpi1[3]} = \\mathbf{${res.avgCpiP1}}$.\n  $\\text{CPI}_{\\text{P2}} = ${(pA / 100).toFixed(2)}\\times${cpi2[0]} + ${(pB / 100).toFixed(2)}\\times${cpi2[1]} + ${(pC / 100).toFixed(2)}\\times${cpi2[2]} + ${(pD / 100).toFixed(2)}\\times${cpi2[3]} = \\mathbf{${res.avgCpiP2}}$.\n• **Step 2 (Total Clock Cycles)**:\n  $\\text{Cycles}_{\\text{P1}} = ${icM}\\times 10^6 \\times ${res.avgCpiP1} = \\mathbf{${cyc1M} \\times 10^6\\text{ cycles}}$; $\\text{Cycles}_{\\text{P2}} = \\mathbf{${cyc2M} \\times 10^6\\text{ cycles}}$.\n• **Step 3 ($\text{CPU Time}$)**:\n  $T_{\\text{P1}} = \\dfrac{${cyc1M} \\times 10^6}{${f1} \\times 10^9} = \\mathbf{${t1}\\text{ ms}}$; $T_{\\text{P2}} = \\dfrac{${cyc2M} \\times 10^6}{${f2} \\times 10^9} = \\mathbf{${t2}\\text{ ms}}$.`,
          formulaUsed: '$\\text{CPU Time} = \\dfrac{\\text{IC} \\times \\text{CPI}_{\\text{avg}}}{\\text{Clock Rate}}$',
        };
      } else {
        // Variant B: Clock Cycles & Speedup target (CO2007 Q3-4 style)
        const icTotalM = 50 + (s % 5) * 10;
        const cpiOld = 2.4;
        const fGhz = 2.0 + (s % 3) * 0.5;
        const speedup = 1.2;
        const cyclesOldM = icTotalM * cpiOld;
        const cyclesNewM = cyclesOldM / speedup;
        const cpiNew = Number((cpiOld / speedup).toFixed(2));
        const timeNewMs = Number((cyclesNewM / fGhz).toFixed(2));

        const correctOptVi = `Tổng chu kỳ mới $= ${cyclesNewM.toFixed(0)} \\times 10^6\\text{ cycles}$; $\\text{CPI}_{\\text{mới}} = ${cpiNew}$; $T_{\\text{mới}} = ${timeNewMs}\\text{ ms}$`;
        const d1Vi = `Tổng chu kỳ mới $= ${cyclesOldM.toFixed(0)} \\times 10^6\\text{ cycles}$; $\\text{CPI}_{\\text{mới}} = ${cpiOld}$; $T_{\\text{mới}} = ${(cyclesOldM / fGhz).toFixed(2)}\\text{ ms}$`;
        const d2Vi = `Tổng chu kỳ mới $= ${(cyclesOldM * speedup).toFixed(0)} \\times 10^6\\text{ cycles}$; $\\text{CPI}_{\\text{mới}} = ${(cpiOld * speedup).toFixed(2)}$`;
        const d3Vi = `Tổng chu kỳ mới $= ${(cyclesNewM - 15).toFixed(0)} \\times 10^6\\text{ cycles}$; $\\text{CPI}_{\\text{mới}} = ${(cpiNew - 0.3).toFixed(2)}$`;

        const correctOptEn = `New total cycles $= ${cyclesNewM.toFixed(0)} \\times 10^6\\text{ cycles}$; $\\text{CPI}_{\\text{new}} = ${cpiNew}$; $T_{\\text{new}} = ${timeNewMs}\\text{ ms}$`;
        const d1En = `New total cycles $= ${cyclesOldM.toFixed(0)} \\times 10^6\\text{ cycles}$; $\\text{CPI}_{\\text{new}} = ${cpiOld}$; $T_{\\text{new}} = ${(cyclesOldM / fGhz).toFixed(2)}\\text{ ms}$`;
        const d2En = `New total cycles $= ${(cyclesOldM * speedup).toFixed(0)} \\times 10^6\\text{ cycles}$; $\\text{CPI}_{\\text{new}} = ${(cpiOld * speedup).toFixed(2)}$`;
        const d3En = `New total cycles $= ${(cyclesNewM - 15).toFixed(0)} \\times 10^6\\text{ cycles}$; $\\text{CPI}_{\\text{new}} = ${(cpiNew - 0.3).toFixed(2)}$`;

        const { options, enOptions, correctIndex } = placeBilingualOptionsWithSeed(
          correctOptVi,
          [d1Vi, d2Vi, d3Vi],
          correctOptEn,
          [d1En, d2En, d3En],
          s
        );

        return {
          id: `gen-perf-speedup-${s}`,
          sourceExam: 'Đề Tự Sinh (Auto-Gen)',
          topic: 'performance',
          topicLabel: 'Tối ưu CPI & Hệ số Tăng tốc Speedup',
          enTopicLabel: 'CPI Optimization & Target Speedup (Auto-Gen)',
          mindMapNodeId: 'cat-1-2-1',
          difficulty: 'Vận dụng',
          isGenerated: true,
          question: `[Bài tập Tự sinh #${s}] Một chương trình có $\\text{IC} = ${icTotalM} \\times 10^6$ lệnh chạy trên CPU xung nhịp $${fGhz}\\text{ GHz}$ với $\\text{CPI}_{\\text{cũ}} = ${cpiOld}$. Để chương trình chạy nhanh gấp $${speedup}\\times$ (giữ nguyên số lệnh IC và tần số xung nhịp), tổng số chu kỳ mới và $\\text{CPI}_{\\text{mới}}$ phải bằng bao nhiêu?`,
          enQuestion: `[Auto-Generated #${s}] A program with $\\text{IC} = ${icTotalM} \\times 10^6$ instructions runs on a $${fGhz}\\text{ GHz}$ CPU with $\\text{CPI}_{\\text{old}} = ${cpiOld}$. To achieve a $${speedup}\\times$ speedup (keeping IC and Clock Rate unchanged), what must the new total clock cycles and $\\text{CPI}_{\\text{new}}$ be?`,
          options,
          enOptions,
          correctIndex,
          explanation: `• Tổng chu kỳ ban đầu: $\\text{Cycles}_{\\text{cũ}} = ${icTotalM} \\times 10^6 \\times ${cpiOld} = ${cyclesOldM.toFixed(0)} \\times 10^6\\text{ cycles}$.\n• Để đạt $\\text{Speedup} = ${speedup}\\times$ khi giữ nguyên tần số $${fGhz}\\text{ GHz}$, tổng số chu kỳ mới phải giảm còn:\n  $\\text{Cycles}_{\\text{mới}} = \\dfrac{${cyclesOldM.toFixed(0)} \\times 10^6}{${speedup}} = \\mathbf{${cyclesNewM.toFixed(0)} \\times 10^6\\text{ cycles}}$.\n• $\\text{CPI}_{\\text{mới}} = \\dfrac{${cpiOld}}{${speedup}} = \\mathbf{${cpiNew}}$ và thời gian mới $T_{\\text{mới}} = \\dfrac{${cyclesNewM.toFixed(0)} \\times 10^6}{${fGhz} \\times 10^9} = \\mathbf{${timeNewMs}\\text{ ms}}$.`,
          enExplanation: `• Initial cycles: $\\text{Cycles}_{\\text{old}} = ${icTotalM} \\times 10^6 \\times ${cpiOld} = ${cyclesOldM.toFixed(0)} \\times 10^6\\text{ cycles}$.\n• For a $${speedup}\\times$ speedup at constant $${fGhz}\\text{ GHz}$ clock rate, new total cycles must be:\n  $\\text{Cycles}_{\\text{new}} = \\dfrac{${cyclesOldM.toFixed(0)} \\times 10^6}{${speedup}} = \\mathbf{${cyclesNewM.toFixed(0)} \\times 10^6\\text{ cycles}}$.\n• $\\text{CPI}_{\\text{new}} = \\dfrac{${cpiOld}}{${speedup}} = \\mathbf{${cpiNew}}$ and $T_{\\text{new}} = \\mathbf{${timeNewMs}\\text{ ms}}$.`,
          formulaUsed: '$\\text{Speedup} = \\dfrac{T_{\\text{old}}}{T_{\\text{new}}} = \\dfrac{\\text{CPI}_{\\text{old}}}{\\text{CPI}_{\\text{new}}}$',
        };
      }
    }

    case 'mips': {
      const variant = s % 2;
      if (variant === 0) {
        // Variant A: MIPS Array Loop Trace (IT089IU Q3 style)
        const stepsList = [1, 2, 3];
        const stepInc = stepsList[s % stepsList.length];
        const limitsList = [7, 9, 11, 13];
        const limitVal = limitsList[(s >> 1) % limitsList.length];
        const baseArr = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
        const sim = simulateMipsArrayLoop(baseArr, 1, stepInc, limitVal);

        const correctOptVi = `Chạy ${sim.totalRounds} vòng; kết thúc: $i = ${sim.finalI}$ (\`$t1\`), $\\text{result} = ${sim.finalResult}$ (\`$s2\`)`;
        const d1Vi = `Chạy ${sim.totalRounds + 1} vòng; kết thúc: $i = ${sim.finalI + stepInc}$, $\\text{result} = ${sim.finalResult + (baseArr[sim.totalRounds] || 10)}$`;
        const d2Vi = `Chạy ${Math.max(1, sim.totalRounds - 1)} vòng; kết thúc: $i = ${sim.finalI - stepInc}$, $\\text{result} = ${sim.finalResult - baseArr[sim.totalRounds - 1]}`;
        const d3Vi = `Chạy ${sim.totalRounds} vòng; kết thúc: $i = ${limitVal - 1}$, $\\text{result} = ${sim.finalResult + 4}$`;

        const correctOptEn = `Executes ${sim.totalRounds} iterations; final: $i = ${sim.finalI}$ (\`$t1\`), $\\text{result} = ${sim.finalResult}$ (\`$s2\`)`;
        const d1En = `Executes ${sim.totalRounds + 1} iterations; final: $i = ${sim.finalI + stepInc}$, $\\text{result} = ${sim.finalResult + (baseArr[sim.totalRounds] || 10)}$`;
        const d2En = `Executes ${Math.max(1, sim.totalRounds - 1)} iterations; final: $i = ${sim.finalI - stepInc}$, $\\text{result} = ${sim.finalResult - baseArr[sim.totalRounds - 1]}`;
        const d3En = `Executes ${sim.totalRounds} iterations; final: $i = ${limitVal - 1}$, $\\text{result} = ${sim.finalResult + 4}$`;

        const { options, enOptions, correctIndex } = placeBilingualOptionsWithSeed(
          correctOptVi,
          [d1Vi, d2Vi, d3Vi],
          correctOptEn,
          [d1En, d2En, d3En],
          s
        );

        return {
          id: `gen-mips-loop-${s}`,
          sourceExam: 'Đề Tự Sinh (Auto-Gen)',
          topic: 'mips',
          topicLabel: 'Đọc hiểu Vòng lặp Mảng MIPS (Tự sinh)',
          enTopicLabel: 'Tracing MIPS Array Loop (Auto-Gen)',
          mindMapNodeId: 'cat-2-2',
          difficulty: 'Nâng cao',
          isGenerated: true,
          question: `[Bài tập Tự sinh #${s}] Cho mảng \`MemArray\` chứa các số chẵn liên tiếp và đoạn hợp ngữ MIPS bên dưới. Hỏi vòng lặp \`LOOP\` thực thi tổng cộng bao nhiêu lần, và giá trị cuối cùng của \`$t1\` ($i$) cùng \`$s2\` ($\\text{result}$) là bao nhiêu?`,
          enQuestion: `[Auto-Generated #${s}] Given \`MemArray\` of consecutive even integers and the MIPS code below, how many times does \`LOOP\` execute, and what are the final values of \`$t1\` ($i$) and \`$s2\` ($\\text{result}$)?`,
          codeSnippet: `.data
MemArray: .word 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24
.text
main: addi $t1, $0, 1         # i = 1
      add  $s2, $0, $0        # result = 0
      la   $s0, MemArray
LOOP: lw   $s1, 0($s0)
      addi $s0, $s0, 4
      addi $t1, $t1, ${stepInc}
      add  $s2, $s2, $s1
      slti $t2, $t1, ${limitVal}
      bne  $t2, $0, LOOP`,
          options,
          enOptions,
          correctIndex,
          explanation:
            `Theo dõi từng vòng lặp (Ban đầu $i = 1, \\text{result} = 0$):\n` +
            sim.steps
              .map(
                (st) =>
                  `• **Vòng ${st.round}**: Đọc \`$s1 = ${st.s1LoadedVal}\`, tăng $i = ${st.t1Val}$, cộng dồn $\\text{result} = ${st.s2Result}$. Kiểm tra $${st.t1Val} < ${limitVal}$ $\\rightarrow$ \`$t2 = ${st.t2BranchFlag}\`.`
              )
              .join('\n') +
            `\n⇒ Kết luận: Chạy **${sim.totalRounds} vòng**, khi thoát $i = \\mathbf{${sim.finalI}}$ và $\\text{result} = \\mathbf{${sim.finalResult}}$.`,
          enExplanation:
            `Step-by-step loop trace (Initial $i = 1, \\text{result} = 0$):\n` +
            sim.steps
              .map(
                (st) =>
                  `• **Iter ${st.round}**: Loads \`$s1 = ${st.s1LoadedVal}\`, updates $i = ${st.t1Val}$, accumulates $\\text{result} = ${st.s2Result}$. Checks $${st.t1Val} < ${limitVal}$ $\\rightarrow$ \`$t2 = ${st.t2BranchFlag}\`.`
              )
              .join('\n') +
            `\n⇒ Conclusion: Executes **${sim.totalRounds} iterations**, final $i = \\mathbf{${sim.finalI}}$ and $\\text{result} = \\mathbf{${sim.finalResult}}$.`,
          formulaUsed: '$\\text{do-while}: i_{\\text{end}} = 1 + k \\times \\text{step} \\ge \\text{limit}$',
        };
      } else {
        // Variant B: Big-Endian Byte Address & Array Offset
        const words = ['0xCAFEBABE', '0x12345678', '0xFEEDFACE', '0x89ABCDEF', '0xC001D00D'];
        const wordHex = words[s % words.length];
        const byteOffset = s % 4;
        const cleanHex = wordHex.slice(2);
        const targetByte = `0x${cleanHex.slice(byteOffset * 2, byteOffset * 2 + 2)}`;
        const otherBytes = [0, 1, 2, 3]
          .filter((idx) => idx !== byteOffset)
          .map((idx) => `0x${cleanHex.slice(idx * 2, idx * 2 + 2)}`) as [string, string, string];

        const arrayIdx = 3 + (s % 6);
        const arrayByteOffset = arrayIdx * 4;

        const correctOptVi = `Byte tại địa chỉ \`0x0000000${byteOffset}\` là \`${targetByte}\`; độ lệch byte của \`A[${arrayIdx}]\` là $${arrayByteOffset}\\text{ bytes}$ (\`lw $t0, ${arrayByteOffset}($s3)\`)`;
        const d1Vi = `Byte tại địa chỉ \`0x0000000${byteOffset}\` là \`${otherBytes[0]}\`; độ lệch byte của \`A[${arrayIdx}]\` là $${arrayIdx}\\text{ bytes}$ (quên nhân 4)`;
        const d2Vi = `Byte tại địa chỉ \`0x0000000${byteOffset}\` là \`${otherBytes[1]}\`; độ lệch byte của \`A[${arrayIdx}]\` là $${arrayByteOffset}\\text{ bytes}$`;
        const d3Vi = `Byte tại địa chỉ \`0x0000000${byteOffset}\` là \`${otherBytes[2]}\`; độ lệch byte của \`A[${arrayIdx}]\` là $${arrayIdx * 2}\\text{ bytes}$`;

        const correctOptEn = `Byte at \`0x0000000${byteOffset}\` is \`${targetByte}\`; byte offset of \`A[${arrayIdx}]\` is $${arrayByteOffset}\\text{ bytes}$ (\`lw $t0, ${arrayByteOffset}($s3)\`)`;
        const d1En = `Byte at \`0x0000000${byteOffset}\` is \`${otherBytes[0]}\`; byte offset of \`A[${arrayIdx}]\` is $${arrayIdx}\\text{ bytes}$ (forgot $\\times 4$)`;
        const d2En = `Byte at \`0x0000000${byteOffset}\` is \`${otherBytes[1]}\`; byte offset of \`A[${arrayIdx}]\` is $${arrayByteOffset}\\text{ bytes}$`;
        const d3En = `Byte at \`0x0000000${byteOffset}\` is \`${otherBytes[2]}\`; byte offset of \`A[${arrayIdx}]\` is $${arrayIdx * 2}\\text{ bytes}$`;

        const { options, enOptions, correctIndex } = placeBilingualOptionsWithSeed(
          correctOptVi,
          [d1Vi, d2Vi, d3Vi],
          correctOptEn,
          [d1En, d2En, d3En],
          s
        );

        return {
          id: `gen-mips-endian-${s}`,
          sourceExam: 'Đề Tự Sinh (Auto-Gen)',
          topic: 'mips',
          topicLabel: 'Big-Endian & Độ lệch Mảng 32-bit (Tự sinh)',
          enTopicLabel: 'Big-Endian & 32-Bit Array Offset (Auto-Gen)',
          mindMapNodeId: 'cat-2-1-2',
          difficulty: 'Vận dụng',
          isGenerated: true,
          question: `[Bài tập Tự sinh #${s}] Giả sử \`$t1 = ${wordHex}\` được lưu vào bộ nhớ bắt đầu từ địa chỉ \`0x00000000\` bằng lệnh \`sw $t1, 0($zero)\` trên máy MIPS **Big-Endian**. Hỏi byte nằm tại địa chỉ \`0x0000000${byteOffset}\` là bao nhiêu, và để truy xuất phần tử mảng nguyên 32-bit \`A[${arrayIdx}]\` (với base address trong \`$s3\`) ta cần offset bao nhiêu byte?`,
          enQuestion: `[Auto-Generated #${s}] Suppose \`$t1 = ${wordHex}\` is stored at address \`0x00000000\` via \`sw $t1, 0($zero)\` on a **Big-Endian** MIPS machine. What byte is stored at address \`0x0000000${byteOffset}\`, and what byte offset is required to access 32-bit integer array element \`A[${arrayIdx}]\` (base in \`$s3\`)?`,
          options,
          enOptions,
          correctIndex,
          explanation: `• **Thứ tự Big-Endian** lưu byte trọng số lớn nhất (MSB) ở địa chỉ nhỏ nhất:\n  - \`0x00000000\`: \`0x${cleanHex.slice(0, 2)}\`\n  - \`0x00000001\`: \`0x${cleanHex.slice(2, 4)}\`\n  - \`0x00000002\`: \`0x${cleanHex.slice(4, 6)}\`\n  - \`0x00000003\`: \`0x${cleanHex.slice(6, 8)}\`\n  $\\rightarrow$ Tại \`0x0000000${byteOffset}\` là **\`${targetByte}\`**.\n• **Truy xuất mảng nguyên 32-bit**: Mỗi phần tử \`int\` chiếm $4\\text{ bytes}$, nên \`&A[${arrayIdx}]\` $= \\$s3 + ${arrayIdx} \\times 4 = \\$s3 + \\mathbf{${arrayByteOffset}}$.`,
          enExplanation: `• **Big-Endian** stores the Most Significant Byte (MSB) at the lowest byte address:\n  - \`0x00000000\`: \`0x${cleanHex.slice(0, 2)}\`, \`0x00000001\`: \`0x${cleanHex.slice(2, 4)}\`, \`0x00000002\`: \`0x${cleanHex.slice(4, 6)}\`, \`0x00000003\`: \`0x${cleanHex.slice(6, 8)}\` $\\rightarrow$ Address \`0x0000000${byteOffset}\` holds **\`${targetByte}\`**.\n• **32-bit integer array**: Each \`int\` is $4\\text{ bytes}$, so \`&A[${arrayIdx}]\` $= \\$s3 + ${arrayIdx} \\times 4 = \\$s3 + \\mathbf{${arrayByteOffset}}$.`,
          formulaUsed: '$\\text{Address}(A[k]) = \\text{Base} + 4k$',
        };
      }
    }

    case 'arithmetic': {
      const variant = s % 2;
      if (variant === 0) {
        // Variant A: IEEE 754 Single Precision Encoding
        const floatPool = [45.625, -26.375, 84.75, 19.125, -13.5, 156.25, 37.25, -52.5];
        const val = floatPool[s % floatPool.length];
        const ieee = encodeIeee754Single(val);
        const fracShort = ieee.mantissaBits.replace(/0+$/, '') || '0';

        const correctOptVi = `Mã Hex: \`${ieee.hexString}\` ($S = ${ieee.signBit}$, $E_{\\text{biased}} = ${ieee.biasedExponentDec} = ${ieee.exponentBits}_2$, $\\text{Frac} = .${fracShort}\\dots_2$)`;
        const wrongSignBit = ieee.signBit === '0' ? '1' : '0';
        const d1Vi = `Mã Hex: \`${ieee.hexString}\` nhưng $E_{\\text{biased}} = ${ieee.trueExponent}$ (quên cộng Bias 127)`;
        const d2Vi = `$S = ${wrongSignBit}$, $E_{\\text{biased}} = ${ieee.biasedExponentDec - 1} = ${(ieee.biasedExponentDec - 1).toString(2).padStart(8, '0')}_2$, $\\text{Frac} = .${fracShort}\\dots_2$`;
        const d3Vi = `$S = ${ieee.signBit}$, $E_{\\text{biased}} = ${127 - ieee.trueExponent}$, $\\text{Frac} = .1${fracShort}\\dots_2$ (quên bỏ bit 1 ẩn)`;

        const correctOptEn = `Hex: \`${ieee.hexString}\` ($S = ${ieee.signBit}$, $E_{\\text{biased}} = ${ieee.biasedExponentDec} = ${ieee.exponentBits}_2$, $\\text{Frac} = .${fracShort}\\dots_2$)`;
        const d1En = `Hex: \`${ieee.hexString}\` with $E_{\\text{biased}} = ${ieee.trueExponent}$ (forgot to add Bias 127)`;
        const d2En = `$S = ${wrongSignBit}$, $E_{\\text{biased}} = ${ieee.biasedExponentDec - 1} = ${(ieee.biasedExponentDec - 1).toString(2).padStart(8, '0')}_2$, $\\text{Frac} = .${fracShort}\\dots_2$`;
        const d3En = `$S = ${ieee.signBit}$, $E_{\\text{biased}} = ${127 - ieee.trueExponent}$, $\\text{Frac} = .1${fracShort}\\dots_2$ (kept hidden leading 1)`;

        const { options, enOptions, correctIndex } = placeBilingualOptionsWithSeed(
          correctOptVi,
          [d1Vi, d2Vi, d3Vi],
          correctOptEn,
          [d1En, d2En, d3En],
          s
        );

        return {
          id: `gen-arith-ieee-${s}`,
          sourceExam: 'Đề Tự Sinh (Auto-Gen)',
          topic: 'arithmetic',
          topicLabel: 'Mã hóa IEEE 754 32-bit (Tự sinh)',
          enTopicLabel: 'IEEE 754 32-Bit Encoding (Auto-Gen)',
          mindMapNodeId: 'cat-3-1-3',
          difficulty: 'Vận dụng',
          isGenerated: true,
          question: `[Bài tập Tự sinh #${s}] Hãy đổi số thực thập phân $${val}$ sang biểu diễn dấu phẩy động chuẩn $\\text{IEEE 754 Single Precision}$ (32-bit, $\\text{Bias} = 127$):`,
          enQuestion: `[Auto-Generated #${s}] Convert the decimal floating-point number $${val}$ into $\\text{IEEE 754 Single Precision}$ (32-bit, $\\text{Bias} = 127$) representation:`,
          options,
          enOptions,
          correctIndex,
          explanation: `1) **Bit dấu ($S$)**: Vì $${val} ${val >= 0 ? '> 0' : '< 0'}$ nên $S = \\mathbf{${ieee.signBit}}$.\n2) **Chuẩn hóa nhị phân**: $|${val}| = 1.${fracShort}_2 \\times 2^{${ieee.trueExponent}} \\rightarrow$ Số mũ thực $E_{\\text{true}} = \\mathbf{${ieee.trueExponent}}$.\n3) **Số mũ lệch 8-bit ($E_{\\text{biased}}$)**: $E_{\\text{biased}} = ${ieee.trueExponent} + 127 = \\mathbf{${ieee.biasedExponentDec}} = \\mathbf{${ieee.exponentBits}_2}$.\n4) **Phần định trị 23-bit (Fraction)**: Bỏ số $1.$ ẩn ở đầu, điền thêm các bit $0$ vào đuôi $\\rightarrow$ Ghép 32-bit thu được mã Hexa **\`${ieee.hexString}\`**.`,
          enExplanation: `1) **Sign bit ($S$)**: Since $${val} ${val >= 0 ? '> 0' : '< 0'}$, $S = \\mathbf{${ieee.signBit}}$.\n2) **Normalized binary**: $|${val}| = 1.${fracShort}_2 \\times 2^{${ieee.trueExponent}} \\rightarrow$ True exponent $E_{\\text{true}} = \\mathbf{${ieee.trueExponent}}$.\n3) **8-bit Biased Exponent ($E_{\\text{biased}}$)**: $E_{\\text{biased}} = ${ieee.trueExponent} + 127 = \\mathbf{${ieee.biasedExponentDec}} = \\mathbf{${ieee.exponentBits}_2}$.\n4) **23-bit Fraction**: Drop the hidden leading $1.$ and pad with zeros $\\rightarrow$ 32-bit Hex is **\`${ieee.hexString}\`**.`,
          formulaUsed: '$\\text{Value} = (-1)^S \\times (1.\\text{Fraction})_2 \\times 2^{E_{\\text{biased}} - 127}$',
        };
      } else {
        // Variant B: 8-bit Two's Complement Addition/Subtraction & Overflow
        const pairs: [number, number, '+' | '-'][] = [
          [72, -65, '-'],
          [-80, 60, '-'],
          [48, 65, '+'],
          [90, 50, '+'],
          [-70, -68, '+'],
        ];
        const [a, b, op] = pairs[s % pairs.length];
        const tc = evaluateTwosComplementOp(a, b, op, 8);
        const bEff = op === '+' ? b : -b;

        const correctOptVi = `$A = ${tc.aBin}_2$, $${op === '+' ? 'B' : '-B'} = ${tc.bBin}_2$; Kết quả $= ${tc.sumBin}_2$ (${tc.overflow ? `BỊ TRÀN SỐ - Overflow vì ${tc.sumDec} ngoài [-128, +127]` : `Hợp lệ = ${tc.sumDec}, không tràn số`})`;
        const d1Vi = `$A = ${tc.aBin}_2$, $${op === '+' ? 'B' : '-B'} = ${tc.bBin}_2$; Kết quả $= ${tc.sumBin}_2$ (${!tc.overflow ? 'BỊ TRÀN SỐ - Overflow' : 'Hợp lệ, không bị tràn số'})`;
        const d2Vi = `$A = ${tc.bBin}_2$, $${op === '+' ? 'B' : '-B'} = ${tc.aBin}_2$; Kết quả $= 0111\\,1111_2$`;
        const d3Vi = `Không thể thực hiện phép tính ${a} ${op} (${b}) trong hệ bù 2 8-bit`;

        const correctOptEn = `$A = ${tc.aBin}_2$, $${op === '+' ? 'B' : '-B'} = ${tc.bBin}_2$; Result $= ${tc.sumBin}_2$ (${tc.overflow ? `OVERFLOW occurs because ${tc.sumDec} is outside [-128, +127]` : `Valid = ${tc.sumDec}, no overflow`})`;
        const d1En = `$A = ${tc.aBin}_2$, $${op === '+' ? 'B' : '-B'} = ${tc.bBin}_2$; Result $= ${tc.sumBin}_2$ (${!tc.overflow ? 'OVERFLOW occurs' : 'Valid, no overflow'})`;
        const d2En = `$A = ${tc.bBin}_2$, $${op === '+' ? 'B' : '-B'} = ${tc.aBin}_2$; Result $= 0111\\,1111_2$`;
        const d3En = `Cannot compute ${a} ${op} (${b}) in 8-bit two's complement`;

        const { options, enOptions, correctIndex } = placeBilingualOptionsWithSeed(
          correctOptVi,
          [d1Vi, d2Vi, d3Vi],
          correctOptEn,
          [d1En, d2En, d3En],
          s
        );

        return {
          id: `gen-arith-twos-${s}`,
          sourceExam: 'Đề Tự Sinh (Auto-Gen)',
          topic: 'arithmetic',
          topicLabel: 'Số học Bù 2 8-bit & Cờ Overflow (Tự sinh)',
          enTopicLabel: "8-Bit Two's Complement & Overflow (Auto-Gen)",
          mindMapNodeId: 'cat-3-1-2',
          difficulty: 'Vận dụng',
          isGenerated: true,
          question: `[Bài tập Tự sinh #${s}] Trong hệ biểu diễn bù 2 **8-bit** (dải $[-128, +127]$), thực hiện phép tính $A ${op} B$ với $A = ${a}$ và $B = ${b}$. Kết quả nhị phân và trạng thái tràn số (Overflow) nào sau đây là ĐÚNG?`,
          enQuestion: `[Auto-Generated #${s}] In **8-bit Two's Complement** representation (range $[-128, +127]$), perform $A ${op} B$ with $A = ${a}$ and $B = ${b}$. Which binary result and overflow status is TRUE?`,
          options,
          enOptions,
          correctIndex,
          explanation: `• Biểu diễn 8-bit bù 2 của toán hạng thứ nhất: $A = ${a} = \\mathbf{${tc.aBin}_2}$.\n• Toán hạng thứ hai sau khi đổi dấu theo phép toán ($${bEff}$): $\\mathbf{${tc.bBin}_2}$.\n• Tổng nhị phân 8-bit: $${tc.aBin}_2 + ${tc.bBin}_2 = \\mathbf{${tc.sumBin}_2}$ (giá trị thực: $${tc.sumDec}$).\n• **Kiểm tra tràn số**: ${tc.overflowReason}`,
          enExplanation: `• 8-bit Two's Complement of first operand: $A = ${a} = \\mathbf{${tc.aBin}_2}$.\n• Second operand adjusted for operation ($${bEff}$): $\\mathbf{${tc.bBin}_2}$.\n• 8-bit binary sum: $${tc.aBin}_2 + ${tc.bBin}_2 = \\mathbf{${tc.sumBin}_2}$ (true decimal sum: $${tc.sumDec}$).\n• **Overflow check**: ${tc.overflow ? 'Same-sign operands yielded an opposite result sign bit (Overflow!)' : 'Result is within [-128, +127] (No overflow).'}`,
          formulaUsed: '$\\text{Overflow} \\iff (\\text{MSB}_A = \\text{MSB}_B) \\land (\\text{MSB}_{\\text{Sum}} \\ne \\text{MSB}_A)$',
        };
      }
    }

    case 'datapath': {
      // Pipeline Execution Cycles with/without Forwarding
      const numInstr = 5 + (s % 4); // 5 to 8 instructions
      const rawDeps = 2 + (s % 3); // 2 to 4 RAW dependencies between adjacent instructions
      const loadUseCount = 1 + (s % 2); // 1 or 2 of those are Load-Use
      const cyclesNoFwd = numInstr + 4 + rawDeps * 2;
      const cyclesWithFwd = numInstr + 4 + loadUseCount * 1;

      const correctOptVi = `Không có Forwarding: $${cyclesNoFwd}$ chu kỳ ($${rawDeps} \\times 2 = ${rawDeps * 2}$ stalls); Có Forwarding: $${cyclesWithFwd}$ chu kỳ (chỉ trễ $${loadUseCount}$ chu kỳ tại Load-Use)`;
      const d1Vi = `Không có Forwarding: $${numInstr + 4 + rawDeps}$ chu kỳ; Có Forwarding: $${numInstr + 4}$ chu kỳ (0 stall kể cả Load-Use)`;
      const d2Vi = `Không có Forwarding: $${cyclesNoFwd + 2}$ chu kỳ; Có Forwarding: $${cyclesWithFwd + 2}$ chu kỳ`;
      const d3Vi = `Không có Forwarding: $${numInstr * 5}$ chu kỳ; Có Forwarding: $${cyclesNoFwd}$ chu kỳ`;

      const correctOptEn = `Without Forwarding: $${cyclesNoFwd}$ cycles ($${rawDeps} \\times 2 = ${rawDeps * 2}$ stalls); With Forwarding: $${cyclesWithFwd}$ cycles (only $${loadUseCount}$ stall(s) for Load-Use)`;
      const d1En = `Without Forwarding: $${numInstr + 4 + rawDeps}$ cycles; With Forwarding: $${numInstr + 4}$ cycles (0 stalls even for Load-Use)`;
      const d2En = `Without Forwarding: $${cyclesNoFwd + 2}$ cycles; With Forwarding: $${cyclesWithFwd + 2}$ cycles`;
      const d3En = `Without Forwarding: $${numInstr * 5}$ cycles; With Forwarding: $${cyclesNoFwd}$ cycles`;

      const { options, enOptions, correctIndex } = placeBilingualOptionsWithSeed(
        correctOptVi,
        [d1Vi, d2Vi, d3Vi],
        correctOptEn,
        [d1En, d2En, d3En],
        s
      );

      return {
        id: `gen-datapath-pipe-${s}`,
        sourceExam: 'Đề Tự Sinh (Auto-Gen)',
        topic: 'datapath',
        topicLabel: 'Tính Số Chu kỳ Pipeline 5 Tầng (Tự sinh)',
        enTopicLabel: '5-Stage Pipeline Cycle Count (Auto-Gen)',
        mindMapNodeId: 'cat-4-2-2',
        difficulty: 'Nâng cao',
        isGenerated: true,
        question: `[Bài tập Tự sinh #${s}] Một đoạn chương trình gồm $N = ${numInstr}$ lệnh được nạp vào đường ống **Pipeline 5 tầng** (IF, ID, EX, MEM, WB). Giữa các cặp lệnh kế tiếp nhau có tất cả **${rawDeps} xung đột dữ liệu RAW** (trong đó có **${loadUseCount} xung đột dạng Load-Use** sau lệnh \`lw\`, còn lại là xung đột ALU-ALU). Hỏi tổng số chu kỳ cần thiết để hoàn thành đoạn lệnh khi **KHÔNG có Forwarding** và khi **CÓ Forwarding** là bao nhiêu?`,
        enQuestion: `[Auto-Generated #${s}] A sequence of $N = ${numInstr}$ instructions enters a **5-stage Pipeline** (IF, ID, EX, MEM, WB). Among adjacent instruction pairs, there are **${rawDeps} RAW Data Hazards** (of which **${loadUseCount} are Load-Use hazards** immediately following \`lw\`, and the rest are ALU-ALU). How many total clock cycles are required **WITHOUT Forwarding** vs. **WITH Forwarding**?`,
        options,
        enOptions,
        correctIndex,
        explanation: `• **Chu kỳ cơ sở không xung đột** cho $N = ${numInstr}$ lệnh trên Pipeline 5 tầng: $N + (5 - 1) = ${numInstr} + 4 = \\mathbf{${numInstr + 4}\\text{ chu kỳ}}$.\n• **Khi KHÔNG có Forwarding**: Mỗi xung đột RAW giữa hai lệnh liền kề làm lệnh sau phải đợi 2 chu kỳ (để lệnh trước ghi xong ở tầng WB) $\\rightarrow \\text{Stalls} = ${rawDeps} \\times 2 = ${rawDeps * 2}$ chu kỳ.\n  $\\Rightarrow \\text{Total Cycles}_{\\text{No Fwd}} = ${numInstr + 4} + ${rawDeps * 2} = \\mathbf{${cyclesNoFwd}\\text{ chu kỳ}}$.\n• **Khi CÓ Forwarding**: Các xung đột ALU-ALU được chuyển tiếp trực tiếp từ \`EX/MEM\` sang \`EX\` với $0\\text{ stall}$. Riêng **${loadUseCount} xung đột Load-Use** vẫn bắt buộc chèn $1\\text{ stall}$ mỗi chỗ.\n  $\\Rightarrow \\text{Total Cycles}_{\\text{With Fwd}} = ${numInstr + 4} + ${loadUseCount} = \\mathbf{${cyclesWithFwd}\\text{ chu kỳ}}$.`,
        enExplanation: `• **Base ideal cycles** for $N = ${numInstr}$ instructions in a 5-stage pipeline: $N + 4 = \\mathbf{${numInstr + 4}\\text{ cycles}}$.\n• **Without Forwarding**: Each adjacent RAW dependency stalls 2 cycles $\\rightarrow \\text{Stalls} = ${rawDeps} \\times 2 = ${rawDeps * 2} \\Rightarrow \\text{Total} = \\mathbf{${cyclesNoFwd}\\text{ cycles}}$.\n• **With Forwarding**: ALU-ALU dependencies require $0\\text{ stalls}$, while **${loadUseCount} Load-Use hazard(s)** require $1\\text{ stall}$ each $\\Rightarrow \\text{Total} = ${numInstr + 4} + ${loadUseCount} = \\mathbf{${cyclesWithFwd}\\text{ cycles}}$.`,
        formulaUsed: '$\\text{Total Cycles} = N + 4 + \\text{Stall Cycles}$',
      };
    }

    case 'cache': {
      // Cache Mapping & Total Hardware Bits Generator
      const configs = [
        { addrBits: 32, cacheKB: 32, blockB: 16, ways: 1, hex: '00402B1C' },
        { addrBits: 32, cacheKB: 128, blockB: 32, ways: 2, hex: '1001A4E0' },
        { addrBits: 24, cacheKB: 256, blockB: 16, ways: 4, hex: 'AF349C' },
        { addrBits: 32, cacheKB: 64, blockB: 8, ways: 2, hex: '7FFF1024' },
        { addrBits: 28, cacheKB: 64, blockB: 32, ways: 4, hex: '0B4C820' },
      ];
      const cfg = configs[s % configs.length];
      const cRes = calculateCacheMapping(
        cfg.addrBits,
        cfg.cacheKB * 1024,
        cfg.blockB,
        cfg.ways,
        cfg.hex
      );
      const assocName =
        cfg.ways === 1 ? 'Direct-Mapped (1-Way)' : `${cfg.ways}-Way Set Associative`;

      const correctOptVi = `$(\\text{Tag} = ${cRes.tagBits}\\text{b},\\ \\text{Index} = ${cRes.indexBits}\\text{b},\\ \\text{Offset} = ${cRes.offsetBits}\\text{b})$; Tổng bit phần cứng $= ${cRes.totalStorageBits.toLocaleString('en-US')}\\text{ bits}$`;
      const d1Vi = `$(\\text{Tag} = ${cRes.tagBits - 2}\\text{b},\\ \\text{Index} = ${cRes.indexBits + 2}\\text{b},\\ \\text{Offset} = ${cRes.offsetBits}\\text{b})$; Tổng bit phần cứng $= ${(cfg.cacheKB * 1024 * 8).toLocaleString('en-US')}\\text{ bits}$ (quên cộng Tag & Valid)`;
      const d2Vi = `$(\\text{Tag} = ${cRes.tagBits}\\text{b},\\ \\text{Index} = ${cRes.indexBits}\\text{b},\\ \\text{Offset} = ${cRes.offsetBits}\\text{b})$; Tổng bit phần cứng $= ${(cRes.totalStorageBits - cRes.totalBlocksInCache).toLocaleString('en-US')}\\text{ bits}$ (quên 1 bit Valid mỗi block)`;
      const d3Vi = `$(\\text{Tag} = ${cRes.indexBits}\\text{b},\\ \\text{Index} = ${cRes.tagBits}\\text{b},\\ \\text{Offset} = ${cRes.offsetBits}\\text{b})$; Tổng bit phần cứng $= ${cRes.totalStorageBits.toLocaleString('en-US')}\\text{ bits}$`;

      const correctOptEn = `$(\\text{Tag} = ${cRes.tagBits}\\text{b},\\ \\text{Index} = ${cRes.indexBits}\\text{b},\\ \\text{Offset} = ${cRes.offsetBits}\\text{b})$; Total hardware bits $= ${cRes.totalStorageBits.toLocaleString('en-US')}\\text{ bits}$`;
      const d1En = `$(\\text{Tag} = ${cRes.tagBits - 2}\\text{b},\\ \\text{Index} = ${cRes.indexBits + 2}\\text{b},\\ \\text{Offset} = ${cRes.offsetBits}\\text{b})$; Total hardware bits $= ${(cfg.cacheKB * 1024 * 8).toLocaleString('en-US')}\\text{ bits}$ (data only)`;
      const d2En = `$(\\text{Tag} = ${cRes.tagBits}\\text{b},\\ \\text{Index} = ${cRes.indexBits}\\text{b},\\ \\text{Offset} = ${cRes.offsetBits}\\text{b})$; Total hardware bits $= ${(cRes.totalStorageBits - cRes.totalBlocksInCache).toLocaleString('en-US')}\\text{ bits}$ (omitted Valid bit)`;
      const d3En = `$(\\text{Tag} = ${cRes.indexBits}\\text{b},\\ \\text{Index} = ${cRes.tagBits}\\text{b},\\ \\text{Offset} = ${cRes.offsetBits}\\text{b})$; Total hardware bits $= ${cRes.totalStorageBits.toLocaleString('en-US')}\\text{ bits}$`;

      const { options, enOptions, correctIndex } = placeBilingualOptionsWithSeed(
        correctOptVi,
        [d1Vi, d2Vi, d3Vi],
        correctOptEn,
        [d1En, d2En, d3En],
        s
      );

      return {
        id: `gen-cache-map-${s}`,
        sourceExam: 'Đề Tự Sinh (Auto-Gen)',
        topic: 'cache',
        topicLabel: 'Phân hoạch Địa chỉ & Tổng Bit Cache (Tự sinh)',
        enTopicLabel: 'Cache Address Breakdown & Total Bits (Auto-Gen)',
        mindMapNodeId: 'cat-5',
        difficulty: 'Nâng cao',
        isGenerated: true,
        question: `[Bài tập Tự sinh #${s}] Hệ thống có địa chỉ vật lý **${cfg.addrBits}-bit**, bộ nhớ Cache dung lượng dữ liệu **${cfg.cacheKB} KB**, kích thước mỗi Block là **${cfg.blockB} bytes**, tổ chức theo kiểu **${assocName}**. Hãy xác định số bit của 3 trường $(\\text{Tag}, \\text{Index}, \\text{Offset})$ và tổng số bit phần cứng thực tế để chế tạo Cache (bao gồm cả Valid bit và Tag):`,
        enQuestion: `[Auto-Generated #${s}] A system has a **${cfg.addrBits}-bit** physical byte address, a **${cfg.cacheKB} KB** data Cache with **${cfg.blockB}-byte** blocks, organized as **${assocName}**. Find the bit widths of $(\\text{Tag}, \\text{Index}, \\text{Offset})$ and the total hardware storage bits (including Valid and Tag bits):`,
        options,
        enOptions,
        correctIndex,
        explanation: `1) **Số bit Byte Offset ($b$)**: $b = \\log_2(${cfg.blockB}) = \\mathbf{${cRes.offsetBits}\\text{ bits}}$.\n2) **Tổng số Blocks trong Cache**: $\\dfrac{${cfg.cacheKB}\\text{ KB}}{${cfg.blockB}\\text{ B}} = \\mathbf{${cRes.totalBlocksInCache.toLocaleString('en-US')}\\text{ blocks}}$.\n3) **Số tập Sets & Số bit Index ($s$)**: $\\text{Num Sets} = \\dfrac{${cRes.totalBlocksInCache}}{${cfg.ways}} = ${cRes.totalSets} \\Rightarrow s = \\log_2(${cRes.totalSets}) = \\mathbf{${cRes.indexBits}\\text{ bits}}$.\n4) **Số bit Tag ($t$)**: $t = ${cfg.addrBits} - ${cRes.indexBits} - ${cRes.offsetBits} = \\mathbf{${cRes.tagBits}\\text{ bits}}$.\n5) **Tổng số bit phần cứng Cache**:\n   $\\text{Total Bits} = ${cRes.totalBlocksInCache.toLocaleString('en-US')} \\times (1_{\\text{valid}} + ${cRes.tagBits}_{\\text{tag}} + ${cfg.blockB * 8}_{\\text{data}}) = \\mathbf{${cRes.totalStorageBits.toLocaleString('en-US')}\\text{ bits}}$.`,
        enExplanation: `1) **Byte Offset ($b$)**: $b = \\log_2(${cfg.blockB}) = \\mathbf{${cRes.offsetBits}\\text{ bits}}$.\n2) **Total Blocks**: $\\dfrac{${cfg.cacheKB}\\text{ KB}}{${cfg.blockB}\\text{ B}} = \\mathbf{${cRes.totalBlocksInCache.toLocaleString('en-US')}\\text{ blocks}}$.\n3) **Sets & Index ($s$)**: $\\text{Sets} = \\dfrac{${cRes.totalBlocksInCache}}{${cfg.ways}} = ${cRes.totalSets} \\Rightarrow s = \\log_2(${cRes.totalSets}) = \\mathbf{${cRes.indexBits}\\text{ bits}}$.\n4) **Tag ($t$)**: $t = ${cfg.addrBits} - ${cRes.indexBits} - ${cRes.offsetBits} = \\mathbf{${cRes.tagBits}\\text{ bits}}$.\n5) **Total Hardware Bits**: ${cRes.totalBlocksInCache.toLocaleString('en-US')} \\times (1 + ${cRes.tagBits} + ${cfg.blockB * 8}) = \\mathbf{${cRes.totalStorageBits.toLocaleString('en-US')}\\text{ bits}}$.`,
        formulaUsed: '$\\text{Total Bits} = \\text{Num Blocks} \\times (1 + t_{\\text{Tag}} + 8 \\times \\text{BlockBytes})$',
      };
    }

    case 'assembler':
    default: {
      // Stack Frame & Procedure Call / Syscall Generator
      const numSavedRegs = 2 + (s % 4); // 2 to 5 registers ($ra + $s0..)
      const stackBytes = numSavedRegs * 4;
      const syscallCodes: { code: number; descVi: string; descEn: string; regNoteVi: string; regNoteEn: string }[] = [
        { code: 1, descVi: 'In số nguyên (Print Integer)', descEn: 'Print Integer', regNoteVi: 'giá trị cần in đặt trong `$a0`', regNoteEn: 'prints integer in `$a0`' },
        { code: 4, descVi: 'In chuỗi ký tự (Print String)', descEn: 'Print String', regNoteVi: 'địa chỉ chuỗi `.asciiz` đặt trong `$a0`', regNoteEn: 'prints `.asciiz` string at `$a0`' },
        { code: 5, descVi: 'Đọc số nguyên từ bàn phím (Read Integer)', descEn: 'Read Integer', regNoteVi: 'kết quả trả về nằm trong `$v0`', regNoteEn: 'returns input integer in `$v0`' },
        { code: 10, descVi: 'Kết thúc chương trình (Exit)', descEn: 'Exit Program', regNoteVi: 'dừng thực thi an toàn', regNoteEn: 'terminates execution cleanly' },
      ];
      const sc = syscallCodes[s % syscallCodes.length];

      const correctOptVi = `Cấp phát Stack: \`addi $sp, $sp, -${stackBytes}\` (mỗi thanh ghi 4 bytes); còn \`li $v0, ${sc.code}\` + \`syscall\` dùng để **${sc.descVi}** (${sc.regNoteVi})`;
      const d1Vi = `Cấp phát Stack: \`addi $sp, $sp, +${stackBytes}\`; còn \`$v0 = ${sc.code}\` dùng để cấp phát bộ nhớ Heap`;
      const d2Vi = `Cấp phát Stack: \`addi $sp, $sp, -${numSavedRegs}\` (chỉ giảm ${numSavedRegs} byte); còn \`$v0 = ${sc.code}\` dùng để nhảy về hàm \`main\``;
      const d3Vi = `Không cần thay đổi \`$sp\` trong thủ tục đệ quy; \`$v0 = ${sc.code}\` tự động lưu \`$ra\``;

      const correctOptEn = `Allocate Stack: \`addi $sp, $sp, -${stackBytes}\` (4 bytes/register); and \`li $v0, ${sc.code}\` + \`syscall\` performs **${sc.descEn}** (${sc.regNoteEn})`;
      const d1En = `Allocate Stack: \`addi $sp, $sp, +${stackBytes}\`; and \`$v0 = ${sc.code}\` allocates Heap memory`;
      const d2En = `Allocate Stack: \`addi $sp, $sp, -${numSavedRegs}\` (only ${numSavedRegs} bytes); and \`$v0 = ${sc.code}\` jumps to \`main\``;
      const d3En = `No need to adjust \`$sp\` in recursive procedures; \`$v0 = ${sc.code}\` automatically saves \`$ra\``;

      const { options, enOptions, correctIndex } = placeBilingualOptionsWithSeed(
        correctOptVi,
        [d1Vi, d2Vi, d3Vi],
        correctOptEn,
        [d1En, d2En, d3En],
        s
      );

      return {
        id: `gen-asm-stack-${s}`,
        sourceExam: 'Đề Tự Sinh (Auto-Gen)',
        topic: 'assembler',
        topicLabel: 'Quản lý Stack $sp & Lời gọi Syscall (Tự sinh)',
        enTopicLabel: 'Stack Pointer ($sp) & Syscall Services (Auto-Gen)',
        mindMapNodeId: 'cat-2-3-3',
        difficulty: 'Cơ bản',
        isGenerated: true,
        question: `[Bài tập Tự sinh #${s}] Một thủ tục đệ quy trong MIPS cần bảo toàn địa chỉ trả về \`$ra\` cùng **${numSavedRegs - 1} thanh ghi lưu** (\`$s0..$s${numSavedRegs - 2}\`) trên ngăn xếp (tổng cộng **${numSavedRegs} thanh ghi**). Hỏi đầu hàm phải điều chỉnh con trỏ ngăn xếp \`$sp\` như thế nào, và nếu cuối chương trình gọi \`li $v0, ${sc.code}\` / \`syscall\` thì SPIM sẽ làm gì?`,
        enQuestion: `[Auto-Generated #${s}] A recursive MIPS procedure must preserve return address \`$ra\` and **${numSavedRegs - 1} saved registers** (\`$s0..$s${numSavedRegs - 2}\`) on the Stack (**${numSavedRegs} registers** total). How must \`$sp\` be adjusted at procedure entry, and what does \`li $v0, ${sc.code}\` / \`syscall\` do in SPIM?`,
        options,
        enOptions,
        correctIndex,
        explanation: `• **Cấp phát khung ngăn xếp (Stack Frame)**: Mỗi thanh ghi 32-bit chiếm $4\\text{ bytes}$. Để lưu ${numSavedRegs} thanh ghi trên Stack (vốn phát triển từ địa chỉ cao xuống thấp), ta phải trừ \`$sp\` đi $${numSavedRegs} \\times 4 = \\mathbf{${stackBytes}\\text{ bytes}}$ bằng lệnh \`addi $sp, $sp, -${stackBytes}\`.\n• **Mã lệnh \`syscall\` với \`$v0 = ${sc.code}\`**: Thực hiện chức năng **${sc.descVi}** (${sc.regNoteVi}).`,
        enExplanation: `• **Stack Frame Allocation**: Each 32-bit register takes $4\\text{ bytes}$. To push ${numSavedRegs} registers onto the downward-growing Stack, decrement \`$sp\` by $${numSavedRegs} \\times 4 = \\mathbf{${stackBytes}\\text{ bytes}}$ via \`addi $sp, $sp, -${stackBytes}\`.\n• **SPIM \`syscall\` with \`$v0 = ${sc.code}\`**: Executes **${sc.descEn}** (${sc.regNoteEn}).`,
        formulaUsed: '$\\Delta \\$sp = -4 \\times (\\text{Number of Saved Registers})$',
      };
    }
  }
}

/**
 * Generates a batch of N questions either for a specific topic or balanced across all 6 topics.
 */
export function generateQuizBatch(
  topicOrAll: QuizTopic | 'all',
  count: number,
  baseSeed: number
): QuizQuestion[] {
  const allTopics: QuizTopic[] = [
    'performance',
    'mips',
    'arithmetic',
    'datapath',
    'cache',
    'assembler',
  ];
  const list: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const t =
      topicOrAll === 'all' ? allTopics[(baseSeed + i) % allTopics.length] : topicOrAll;
    list.push(generateDynamicQuizQuestion(t, baseSeed + i * 7 + 1));
  }
  return list;
}
