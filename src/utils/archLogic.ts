export interface ProcessorClassSpec {
  className: string;
  fractionPercent: number;
  cpiP1: number;
  cpiP2: number;
}

export interface PerformanceComparisonResult {
  cyclesP1: number;
  cyclesP2: number;
  avgCpiP1: number;
  avgCpiP2: number;
  cpuTimeP1Ms: number;
  cpuTimeP2Ms: number;
  fasterProcessor: 'P1' | 'P2' | 'Equal';
  speedupRatio: number;
}

/**
 * Pure calculation for CPU Performance comparison (Exam IT089IU Q1 & Fall 2011 Q3)
 */
export function calculatePerformanceComparison(
  instructionCount: number,
  clockRateP1GHz: number,
  clockRateP2GHz: number,
  classes: ProcessorClassSpec[]
): PerformanceComparisonResult {
  let cyclesP1 = 0;
  let cyclesP2 = 0;
  let avgCpiP1 = 0;
  let avgCpiP2 = 0;

  for (const c of classes) {
    const frac = c.fractionPercent / 100;
    const classInstructions = instructionCount * frac;
    cyclesP1 += classInstructions * c.cpiP1;
    cyclesP2 += classInstructions * c.cpiP2;
    avgCpiP1 += frac * c.cpiP1;
    avgCpiP2 += frac * c.cpiP2;
  }

  cyclesP1 = Math.round(cyclesP1);
  cyclesP2 = Math.round(cyclesP2);
  avgCpiP1 = Number(avgCpiP1.toFixed(4));
  avgCpiP2 = Number(avgCpiP2.toFixed(4));

  // Clock rate in GHz = 10^9 cycles/sec -> CPU time in seconds = cycles / (GHz * 10^9)
  // In milliseconds (10^-3 s): cycles / (GHz * 10^6)
  const cpuTimeP1Ms = Number((cyclesP1 / (clockRateP1GHz * 1e6)).toFixed(4));
  const cpuTimeP2Ms = Number((cyclesP2 / (clockRateP2GHz * 1e6)).toFixed(4));

  let fasterProcessor: 'P1' | 'P2' | 'Equal' = 'Equal';
  let speedupRatio = 1;

  if (cpuTimeP1Ms < cpuTimeP2Ms) {
    fasterProcessor = 'P1';
    speedupRatio = Number((cpuTimeP2Ms / cpuTimeP1Ms).toFixed(3));
  } else if (cpuTimeP2Ms < cpuTimeP1Ms) {
    fasterProcessor = 'P2';
    speedupRatio = Number((cpuTimeP1Ms / cpuTimeP2Ms).toFixed(3));
  }

  return {
    cyclesP1,
    cyclesP2,
    avgCpiP1,
    avgCpiP2,
    cpuTimeP1Ms,
    cpuTimeP2Ms,
    fasterProcessor,
    speedupRatio,
  };
}

export interface MipsLoopTraceStep {
  round: number;
  line: number;
  instruction: string;
  s0OffsetBytes: number;
  s1LoadedVal: number;
  t1Val: number;
  s2Result: number;
  t2BranchFlag: number;
  explanation: string;
}

/**
 * Simulates the IT089IU Set 01 Question 3 MIPS Loop Trace
 */
export function simulateMipsArrayLoop(
  memArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  initialI: number = 1,
  stepIncrementI: number = 2,
  limitI: number = 9
): {
  steps: MipsLoopTraceStep[];
  totalRounds: number;
  finalI: number;
  finalResult: number;
} {
  const steps: MipsLoopTraceStep[] = [];
  let s0Index = 0;
  let t1 = initialI;
  let s2 = 0;
  let s1 = 0;
  let t2 = 1;
  let round = 0;

  while (round < 20) {
    round += 1;
    s1 = memArray[s0Index] ?? 0;
    const currentOffset = s0Index * 4;
    s0Index += 1;
    const nextOffset = s0Index * 4;
    t1 = t1 + stepIncrementI;
    s2 = s2 + s1;
    t2 = t1 < limitI ? 1 : 0;

    steps.push({
      round,
      line: 13,
      instruction: `Vòng ${round}: lw $s1, 0($s0) -> addi $s0, 4 -> addi $t1, ${stepIncrementI} -> add $s2, $s1 -> slti $t2, $t1, ${limitI}`,
      s0OffsetBytes: nextOffset,
      s1LoadedVal: s1,
      t1Val: t1,
      s2Result: s2,
      t2BranchFlag: t2,
      explanation: `Đọc MemArray[${s0Index - 1}] = ${s1} (tại base+${currentOffset}). Tăng con trỏ $s0 lên base+${nextOffset}, tăng biến đếm i ($t1) lên ${t1}, cộng dồn result ($s2) = ${s2}. Kiểm tra i < ${limitI} -> $t2 = ${t2} (${t2 === 1 ? 'Lặp tiếp' : 'Thoát vòng lặp'}).`,
    });

    if (t2 === 0) {
      break;
    }
  }

  return {
    steps,
    totalRounds: round,
    finalI: t1,
    finalResult: s2,
  };
}

export interface TwosComplementCalcResult {
  bitWidth: number;
  minVal: number;
  maxVal: number;
  aBin: string;
  bBin: string;
  sumDec: number;
  sumBin: string;
  overflow: boolean;
  overflowReason: string;
}

/**
 * Converts a signed integer to N-bit Two's Complement binary string
 */
export function toTwosComplementBinary(value: number, bits: number): string {
  const mask = (1 << bits) - 1;
  const unsigned = value & mask;
  return unsigned.toString(2).padStart(bits, '0').slice(-bits);
}

/**
 * Performs N-bit Two's Complement addition/subtraction with overflow detection (COMP 212 Q3 & Fall 2011 Q1)
 */
export function evaluateTwosComplementOp(
  a: number,
  b: number,
  op: '+' | '-',
  bitWidth: number = 8
): TwosComplementCalcResult {
  const minVal = -(1 << (bitWidth - 1));
  const maxVal = (1 << (bitWidth - 1)) - 1;
  const effectiveB = op === '+' ? b : -b;
  const rawSum = a + effectiveB;

  const aBin = toTwosComplementBinary(a, bitWidth);
  const bBin = toTwosComplementBinary(effectiveB, bitWidth);
  const sumBin = toTwosComplementBinary(rawSum, bitWidth);

  const signA = aBin[0];
  const signB = bBin[0];
  const signSum = sumBin[0];

  // Overflow in 2's complement addition occurs iff both operands have the same sign and the result has the opposite sign
  const overflow = (signA === signB && signSum !== signA) || rawSum < minVal || rawSum > maxVal;

  let overflowReason = 'Không tràn số (No Overflow): Kết quả nằm trong dải biểu diễn hợp lệ.';
  if (overflow) {
    if (signA === '0' && signB === '0' && signSum === '1') {
      overflowReason = `Tràn số dương (Positive Overflow): Cộng hai số dương (MSB = 0) nhưng kết quả có MSB = 1 (${rawSum} > ${maxVal}).`;
    } else if (signA === '1' && signB === '1' && signSum === '0') {
      overflowReason = `Tràn số âm (Negative Overflow): Cộng hai số âm (MSB = 1) nhưng kết quả có MSB = 0 (${rawSum} < ${minVal}).`;
    } else {
      overflowReason = `Tràn số (Overflow): Giá trị ${rawSum} vượt ngoài dải [${minVal}, ${maxVal}] của ${bitWidth}-bit bù 2.`;
    }
  }

  return {
    bitWidth,
    minVal,
    maxVal,
    aBin,
    bBin,
    sumDec: rawSum,
    sumBin,
    overflow,
    overflowReason,
  };
}

export interface Ieee754Breakdown {
  inputDecimal: number;
  signBit: string;
  trueExponent: number;
  biasedExponentDec: number;
  exponentBits: string;
  mantissaBits: string;
  hexString: string;
  formulaRepresentation: string;
}

/**
 * Encodes a decimal number into IEEE 754 Single Precision (32-bit) (COMP 212 Q4, CO2007 Q13-14, HW3 Q3-4)
 */
export function encodeIeee754Single(value: number): Ieee754Breakdown {
  if (value === 0 || Object.is(value, -0)) {
    const signBit = Object.is(value, -0) ? '1' : '0';
    return {
      inputDecimal: 0,
      signBit,
      trueExponent: -127,
      biasedExponentDec: 0,
      exponentBits: '00000000',
      mantissaBits: '0'.repeat(23),
      hexString: signBit === '1' ? '0x80000000' : '0x00000000',
      formulaRepresentation: '0.0',
    };
  }

  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setFloat32(0, value, false); // Big-endian for standard bit extraction
  const uint32 = view.getUint32(0, false);

  const bitStr = uint32.toString(2).padStart(32, '0');
  const signBit = bitStr[0];
  const exponentBits = bitStr.slice(1, 9);
  const mantissaBits = bitStr.slice(9, 32);

  const biasedExponentDec = parseInt(exponentBits, 2);
  const trueExponent = biasedExponentDec - 127;
  const hexString = '0x' + uint32.toString(16).toUpperCase().padStart(8, '0');

  const signSymbol = signBit === '1' ? '-' : '+';
  const trimmedMantissa = mantissaBits.replace(/0+$/, '') || '0';

  return {
    inputDecimal: value,
    signBit,
    trueExponent,
    biasedExponentDec,
    exponentBits,
    mantissaBits,
    hexString,
    formulaRepresentation: `${signSymbol}1.${trimmedMantissa}(2) × 2^(${trueExponent})`,
  };
}

export interface CacheMappingBreakdown {
  addressBits: number;
  tagBits: number;
  indexBits: number;
  offsetBits: number;
  totalBlocksInCache: number;
  totalSets: number;
  totalStorageBits: number;
  addressDecode?: {
    hexAddress: string;
    binaryAddress: string;
    blockAddressHex: string;
    tagHex: string;
    indexHex: string;
    offsetHex: string;
    tagBin: string;
    indexBin: string;
    offsetBin: string;
  };
}

/**
 * Computes Cache address partitioning and total implementation bits (COMP 212 Q6, Fall 2011 Q5, CO2007 Q30-37)
 */
export function calculateCacheMapping(
  addressBits: number,
  cacheSizeBytes: number,
  blockSizeBytes: number,
  associativityWays: number, // 0 means Fully Associative
  sampleAddressHex?: string
): CacheMappingBreakdown {
  const offsetBits = Math.round(Math.log2(blockSizeBytes));
  const totalBlocksInCache = Math.floor(cacheSizeBytes / blockSizeBytes);

  let totalSets = 1;
  let indexBits = 0;

  if (associativityWays === 0 || associativityWays >= totalBlocksInCache) {
    // Fully associative
    totalSets = 1;
    indexBits = 0;
  } else {
    totalSets = Math.floor(totalBlocksInCache / associativityWays);
    indexBits = Math.round(Math.log2(totalSets));
  }

  const tagBits = addressBits - indexBits - offsetBits;
  const dataBitsPerBlock = blockSizeBytes * 8;
  // Standard formula: Total bits = Total Blocks * (1 Valid bit + Tag bits + Data bits per block)
  const totalStorageBits = totalBlocksInCache * (1 + tagBits + dataBitsPerBlock);

  let addressDecode: CacheMappingBreakdown['addressDecode'] = undefined;

  if (sampleAddressHex) {
    const cleanHex = sampleAddressHex.replace(/^0x/i, '').replace(/h$/i, '').trim();
    const parsedAddr = parseInt(cleanHex, 16);
    if (!Number.isNaN(parsedAddr)) {
      const binaryAddress = parsedAddr.toString(2).padStart(addressBits, '0').slice(-addressBits);
      const tagBin = binaryAddress.slice(0, tagBits);
      const indexBin = indexBits > 0 ? binaryAddress.slice(tagBits, tagBits + indexBits) : '';
      const offsetBin = binaryAddress.slice(tagBits + indexBits);
      const blockBin = binaryAddress.slice(0, addressBits - offsetBits);

      addressDecode = {
        hexAddress: '0x' + cleanHex.toUpperCase(),
        binaryAddress,
        blockAddressHex: '0x' + parseInt(blockBin || '0', 2).toString(16).toUpperCase(),
        tagHex: '0x' + parseInt(tagBin || '0', 2).toString(16).toUpperCase(),
        indexHex: indexBin ? '0x' + parseInt(indexBin, 2).toString(16).toUpperCase() : 'N/A (Fully Assoc)',
        offsetHex: '0x' + parseInt(offsetBin || '0', 2).toString(16).toUpperCase(),
        tagBin,
        indexBin,
        offsetBin,
      };
    }
  }

  return {
    addressBits,
    tagBits,
    indexBits,
    offsetBits,
    totalBlocksInCache,
    totalSets,
    totalStorageBits,
    addressDecode,
  };
}

/**
 * Evaluates MIPS Bitwise & Endianness operations (IT089IU Set 01 Q4 & Q5)
 */
export function evaluateMipsBitwiseAndEndian(
  t0Hex: string,
  t1Hex: string,
  shamt: number,
  wordToStoreHex: string
): {
  shiftedT2Hex: string;
  oredT2Hex: string;
  finalT2Hex: string;
  bigEndianBytes: [string, string, string, string];
  littleEndianBytes: [string, string, string, string];
} {
  const t0 = parseInt(t0Hex.replace(/^0x/i, ''), 16) >>> 0;
  const t1 = parseInt(t1Hex.replace(/^0x/i, ''), 16) >>> 0;

  const shifted = (t0 << shamt) >>> 0;
  const ored = (shifted | t1) >>> 0;
  const finalVal = (ored & 0xffffffff) >>> 0; // andi with -1 (0xFFFF) or 32-bit all 1s

  const cleanWord = wordToStoreHex.replace(/^0x/i, '').padStart(8, '0').toUpperCase();
  const b0 = '0x' + cleanWord.slice(0, 2);
  const b1 = '0x' + cleanWord.slice(2, 4);
  const b2 = '0x' + cleanWord.slice(4, 6);
  const b3 = '0x' + cleanWord.slice(6, 8);

  return {
    shiftedT2Hex: '0x' + shifted.toString(16).toUpperCase().padStart(8, '0'),
    oredT2Hex: '0x' + ored.toString(16).toUpperCase().padStart(8, '0'),
    finalT2Hex: '0x' + finalVal.toString(16).toUpperCase().padStart(8, '0'),
    bigEndianBytes: [b0, b1, b2, b3],
    littleEndianBytes: [b3, b2, b1, b0],
  };
}
