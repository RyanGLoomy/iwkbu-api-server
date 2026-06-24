/**
 * IWKBU Mock Data Generator
 *
 * Generates realistic Indonesian bus/terminal compliance data.
 * Data is deterministic per plate (same plate always gets same result)
 * so the sync flow remains consistent across restarts.
 */

// ── Types ──────────────────────────────────────────────

export const COMPLIANCE_STATUS = {
  COMPLIANT: "compliant",
  NON_COMPLIANT: "non_compliant",
  PENDING: "pending",
  UNKNOWN: "unknown",
} as const;

export type ComplianceStatus =
  (typeof COMPLIANCE_STATUS)[keyof typeof COMPLIANCE_STATUS];

export interface ComplianceRecord {
  nomor_polisi: string;
  compliance_status: ComplianceStatus;
  issue_count: number;
  source_updated_at: string;
  payload: {
    po_nama: string;
    po_kode: string;
    merk: string;
    tahun: number;
    route: string;
    kapasitas: number;
    masa_berlaku_iwkbu: string;
    jenis_kendaraan: string;
    terminal_asal: string;
    catatan?: string;
  };
}

// ── Master Data ────────────────────────────────────────

interface PoSeed {
  kode: string;
  nama: string;
  terminal: string;
  prefixes: string[];
  merkMix: string[];
  routes: string[];
}

const PO_SEEDS: PoSeed[] = [
  {
    kode: "PO-DAMRI",
    nama: "Perum DAMRI",
    terminal: "Terminal Pakupatan Serang",
    prefixes: ["BZ"],
    merkMix: ["Mitsubishi", "Hino", "Scania"],
    routes: ["Serang - Merak", "Serang - Jakarta (Kampung Rambutan)", "Serang - Tangerang"],
  },
  {
    kode: "PO-MAYASARI",
    nama: "PT Mayasari Bakti",
    terminal: "Terminal Kalideres",
    prefixes: ["B"],
    merkMix: ["Mercedes-Benz", "Scania", "Hino"],
    routes: ["Kalideres - Bogor", "Kalideres - Tangerang", "Kalideres - Bekasi"],
  },
  {
    kode: "PO-BHINNEKA",
    nama: "PT Bhinneka Sangkuriang",
    terminal: "Terminal Cilegon",
    prefixes: ["BZ"],
    merkMix: ["Hino", "Mitsubishi"],
    routes: ["Cilegon - Serang", "Cilegon - Jakarta (Grogol)", "Cilegon - Merak"],
  },
  {
    kode: "PO-SUMBER-JAYA",
    nama: "PO Sumber Jaya",
    terminal: "Terminal Poris Tangerang",
    prefixes: ["B"],
    merkMix: ["Mitsubishi", "Hino"],
    routes: ["Poris - Serang", "Poris - Rangkasbitung", "Poris - Maja"],
  },
  {
    kode: "PO-AGRA-MAS",
    nama: "PO Agra Mas",
    terminal: "Terminal Poris Tangerang",
    prefixes: ["BZ"],
    merkMix: ["Scania", "Mercedes-Benz"],
    routes: ["Poris - Cilegon", "Poris - Serang"],
  },
  {
    kode: "PO-LORENA",
    nama: "PO Lorena/Karina",
    terminal: "Terminal Kalideres",
    prefixes: ["B"],
    merkMix: ["Scania", "Mercedes-Benz", "Mitsubishi"],
    routes: ["Kalideres - Bandung", "Kalideres - Cirebon", "Kalideres - Tasikmalaya"],
  },
  {
    kode: "PO-HIBA-PUTRA",
    nama: "PO Hiba Putra",
    terminal: "Terminal Pulo Gebang",
    prefixes: ["B"],
    merkMix: ["Hino", "Mitsubishi"],
    routes: ["Pulo Gebang - Sukabumi", "Pulo Gebang - Cianjur"],
  },
  {
    kode: "PO-PRIMAJASA",
    nama: "PT Primajasa",
    terminal: "Terminal Poris Tangerang",
    prefixes: ["B"],
    merkMix: ["Scania", "Hino"],
    routes: ["Poris - Bandung (via Tol)", "Poris - Cikarang"],
  },
];

const JENIS_KENDARAAN = [
  "Bus Besar",
  "Bus Sedang",
  "Bus Mini",
] as const;

const KAPASITAS_MAP: Record<string, number> = {
  "Bus Besar": 55,
  "Bus Sedang": 35,
  "Bus Mini": 19,
};

const SUFFIXES = ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST", "UV", "WX", "YZ"];

// ── Helpers ────────────────────────────────────────────

function seededHash(s: string): number {
  return s
    .toUpperCase()
    .replace(/\s/g, "")
    .split("")
    .reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 0);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]!;
}

function generatePlate(prefix: string, idx: number): string {
  const num = 1000 + ((idx * 137) % 9000);
  const suffix = SUFFIXES[idx % SUFFIXES.length]!;
  return `${prefix} ${num} ${suffix}`;
}

function generateMasaBerlaku(seed: number): string {
  const base = new Date("2026-01-01");
  const offsetDays = (seed % 730) - 180; // -180 to +550 days from base
  const d = new Date(base);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0]!;
}

function determineStatus(plate: string): {
  status: ComplianceStatus;
  issues: number;
  catatan?: string;
} {
  const h = seededHash(plate);
  const bucket = h % 100;

  if (bucket < 60) {
    return { status: COMPLIANCE_STATUS.COMPLIANT, issues: 0 };
  }

  if (bucket < 80) {
    const reasons = [
      "IWKBU menunggu pembayaran",
      "Dokumen KIR dalam proses perpanjangan",
      "Verifikasi kelengkapan dokumen",
    ];
    return {
      status: COMPLIANCE_STATUS.PENDING,
      issues: 1,
      catatan: pick(reasons, h),
    };
  }

  if (bucket < 95) {
    const reasons = [
      "IWKBU sudah kadaluarsa lebih dari 30 hari",
      "Tidak memiliki STCK yang valid",
      "KIR tidak diperpanjang",
      "Asuransi penumpang tidak aktif",
    ];
    return {
      status: COMPLIANCE_STATUS.NON_COMPLIANT,
      issues: 2 + (h % 3),
      catatan: pick(reasons, h),
    };
  }

  return { status: COMPLIANCE_STATUS.UNKNOWN, issues: 0 };
}

// ── Generator ──────────────────────────────────────────

function generateAllRecords(): Map<string, ComplianceRecord> {
  const map = new Map<string, ComplianceRecord>();
  const now = new Date().toISOString();
  let armadaCounter = 0;

  for (const po of PO_SEEDS) {
    const armadaCount = 10 + (seededHash(po.kode) % 5); // 10-14 per PO
    const prefix = po.prefixes[0]!;

    for (let i = 0; i < armadaCount; i++) {
      armadaCounter++;
      const plate = generatePlate(prefix, armadaCounter);
      const h = seededHash(plate + po.kode);
      const merk = pick(po.merkMix, h);
      const route = pick(po.routes, h >> 3);
      const jenis = pick([...JENIS_KENDARAAN], h >> 6);
      const tahun = 2016 + (h % 9); // 2016-2024
      const { status, issues, catatan } = determineStatus(plate);

      const record: ComplianceRecord = {
        nomor_polisi: plate,
        compliance_status: status,
        issue_count: issues,
        source_updated_at: now,
        payload: {
          po_nama: po.nama,
          po_kode: po.kode,
          merk,
          tahun,
          route,
          kapasitas: KAPASITAS_MAP[jenis] ?? 40,
          masa_berlaku_iwkbu: generateMasaBerlaku(h),
          jenis_kendaraan: jenis,
          terminal_asal: po.terminal,
          ...(catatan ? { catatan } : {}),
        },
      };

      map.set(plate.toUpperCase().replace(/\s/g, ""), record);
    }
  }

  return map;
}

// ── Singleton store ────────────────────────────────────

let _store: Map<string, ComplianceRecord> | null = null;

function getStore(): Map<string, ComplianceRecord> {
  if (!_store) {
    _store = generateAllRecords();
  }
  return _store;
}

export function getAllRecords(): ComplianceRecord[] {
  return Array.from(getStore().values());
}

export function getRecordsByPlates(plates: string[]): ComplianceRecord[] {
  const store = getStore();
  const results: ComplianceRecord[] = [];

  for (const plate of plates) {
    const key = plate.toUpperCase().replace(/\s/g, "");
    const record = store.get(key);

    if (record) {
      results.push(record);
    } else {
      // Unknown plates get "unknown" status
      results.push({
        nomor_polisi: plate,
        compliance_status: COMPLIANCE_STATUS.UNKNOWN,
        issue_count: 0,
        source_updated_at: new Date().toISOString(),
        payload: {
          po_nama: "Tidak Diketahui",
          po_kode: "UNKNOWN",
          merk: "—",
          tahun: 0,
          route: "—",
          kapasitas: 0,
          masa_berlaku_iwkbu: "—",
          jenis_kendaraan: "—",
          terminal_asal: "—",
        },
      });
    }
  }

  return results;
}

export function getSummary() {
  const records = getAllRecords();
  return {
    total_armada: records.length,
    compliant: records.filter((r) => r.compliance_status === COMPLIANCE_STATUS.COMPLIANT).length,
    non_compliant: records.filter((r) => r.compliance_status === COMPLIANCE_STATUS.NON_COMPLIANT).length,
    pending: records.filter((r) => r.compliance_status === COMPLIANCE_STATUS.PENDING).length,
    unknown: records.filter((r) => r.compliance_status === COMPLIANCE_STATUS.UNKNOWN).length,
    po_count: PO_SEEDS.length,
  };
}

export function regenerateData(): void {
  _store = generateAllRecords();
}
