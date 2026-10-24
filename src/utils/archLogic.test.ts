import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePerformanceComparison,
  simulateMipsArrayLoop,
  evaluateTwosComplementOp,
  encodeIeee754Single,
  calculateCacheMapping,
  evaluateMipsBitwiseAndEndian,
} from './archLogic';
import { generateDynamicQuizQuestion, generateQuizBatch } from './quizGenerator';
import { QuizTopic } from '../data/quizBank';

test('IT089IU Set 01 Q1: CPU Performance P1 vs P2 calculation matches official answer key', () => {
  const result = calculatePerformanceComparison(10_000_000, 2.5, 3.0, [
    { className: 'A', fractionPercent: 20, cpiP1: 3, cpiP2: 2 },
    { className: 'B', fractionPercent: 10, cpiP1: 3, cpiP2: 1 },
    { className: 'C', fractionPercent: 40, cpiP1: 1, cpiP2: 2 },
    { className: 'D', fractionPercent: 30, cpiP1: 2, cpiP2: 3 },
  ]);

  assert.equal(result.cyclesP1, 19_000_000);
  assert.equal(result.cyclesP2, 22_000_000);
  assert.equal(result.avgCpiP1, 1.9);
  assert.equal(result.avgCpiP2, 2.2);
  assert.equal(result.cpuTimeP1Ms, 7.6);
  assert.equal(Number(result.cpuTimeP2Ms.toFixed(2)), 7.33);
  assert.equal(result.fasterProcessor, 'P2');
});

test('IT089IU Set 01 Q3: MIPS Array Loop simulation matches official answer key', () => {
  const sim = simulateMipsArrayLoop([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 1, 2, 9);
  assert.equal(sim.steps[0].t1Val, 3); // b. $t1 at Line 10 after first round = 3
  assert.equal(sim.steps[0].s2Result, 1); // c. result after first round = 1
  assert.equal(sim.totalRounds, 4); // d. Loop runs 4 times
  assert.equal(sim.finalI, 9); // e. i after LOOP finished = 9
  assert.equal(sim.finalResult, 10); // f. result after LOOP finished = 10
});

test('COMP 212 Fall 2008 Q3: 8-bit 2s complement A=54, B=-77 addition and subtraction overflow', () => {
  const addRes = evaluateTwosComplementOp(54, -77, '+', 8);
  assert.equal(addRes.aBin, '00110110');
  assert.equal(addRes.bBin, '10110011');
  assert.equal(addRes.sumBin, '11101001');
  assert.equal(addRes.sumDec, -23);
  assert.equal(addRes.overflow, false);

  const subRes = evaluateTwosComplementOp(54, -77, '-', 8);
  assert.equal(subRes.sumBin, '10000011');
  assert.equal(subRes.overflow, true);
});

test('COMP 212 Q4 & CO2007 Q13-14: IEEE 754 Single Precision encoding matches exam keys', () => {
  const fp118 = encodeIeee754Single(118.75);
  assert.equal(fp118.signBit, '0');
  assert.equal(fp118.biasedExponentDec, 133);
  assert.equal(fp118.exponentBits, '10000101');
  assert.equal(fp118.mantissaBits.startsWith('11011011'), true);

  const fp625 = encodeIeee754Single(6.25);
  assert.equal(fp625.hexString, '0x40C80000');

  const fp12625 = encodeIeee754Single(12.625);
  assert.equal(fp12625.hexString, '0x414A0000');
});

test('COMP 212 Q6 & CO2007 Q30-37: Cache mapping and total bits match exam keys', () => {
  // COMP 212 Q6: 24-bit address (16MB), 512KB cache, 8B block, Direct Mapped, A1 = DB86E2h
  const direct = calculateCacheMapping(24, 512 * 1024, 8, 1, 'DB86E2');
  assert.equal(direct.offsetBits, 3);
  assert.equal(direct.indexBits, 16);
  assert.equal(direct.tagBits, 5);
  assert.equal(direct.addressDecode?.tagHex, '0x1B');
  assert.equal(direct.addressDecode?.indexHex, '0x70DC');
  assert.equal(direct.addressDecode?.offsetHex, '0x2');

  // CO2007 Q30-32: 32-bit address, 64KB cache, 4-word (16B) block, Direct Mapped
  const co2007Direct = calculateCacheMapping(32, 64 * 1024, 16, 1);
  assert.equal(co2007Direct.tagBits, 16);
  assert.equal(co2007Direct.totalStorageBits, 593_920);
});

test('IT089IU Set 01 Q4 & Q5: Bitwise shift/or and Big-Endian byte address 0x00000002', () => {
  const res = evaluateMipsBitwiseAndEndian('0xAAAAAAAA', '0x01020304', 28, '0xDEADBEEF');
  assert.equal(res.finalT2Hex, '0xA1020304');
  assert.equal(res.bigEndianBytes[2], '0xBE'); // Address 0x00000002 holds 0xBE in Big-Endian
});

test('Procedural Quiz Generator & Curated Bank provide complete Bilingual (VI + EN) content', () => {
  const topics: QuizTopic[] = ['performance', 'mips', 'arithmetic', 'datapath', 'cache', 'assembler'];
  for (const t of topics) {
    const q1 = generateDynamicQuizQuestion(t, 10);
    const q2 = generateDynamicQuizQuestion(t, 11);
    assert.equal(q1.topic, t);
    assert.equal(q1.options.length, 4);
    assert.equal(q1.enOptions?.length, 4);
    assert.equal(new Set(q1.options).size, 4);
    assert.equal(new Set(q1.enOptions).size, 4);
    assert.ok(q1.correctIndex >= 0 && q1.correctIndex < 4);
    assert.ok(q1.explanation.length > 20);
    assert.ok((q1.enExplanation || '').length > 20);
    assert.ok((q1.enQuestion || '').length > 20);
    assert.notEqual(q1.id, q2.id);
  }

  const batch = generateQuizBatch('all', 6, 100);
  assert.equal(batch.length, 6);
});


