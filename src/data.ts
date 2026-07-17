/**
 * IWKBU Mock Data Generator
 *
 * Based on REAL production data from Terminal Merak, Banten.
 * Extracted from DATA PRODUKSI APRIL 2026.xlsx + MEI.xlsx.
 * 20 PO, 695 unique plates.
 *
 * Compliance status is deterministic per plate (hash-based mock).
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

// ── Real PO Data (from Excel) ──────────────────────────

const TERMINAL = "Terminal Merak, Banten";

const REAL_PO_DATA: Record<string, string[]> = {
  "ARIMBI": ["A7507CS", "A7509CS", "A7511CS", "A7516CS", "A7520CS", "A7539CS", "A7540CS", "A7541CS", "A7545CS", "A7546CS", "A7548CS", "A7551CS", "A7559F", "A7583CS", "A7584CS", "A7593CS", "A7990A", "A7991A", "A7992A", "A7994A", "A7995A", "A7996A", "A7997A", "A7998A", "B7012BW", "B7013BW", "B7014BGA", "B7015IL", "B7016IL", "B7017BGA", "B7023IL", "B7026IL", "B7027IL", "B7032", "B7032IL", "B7033IL", "B70344", "B7034IL", "B7035BGA", "B7035IL", "B7035WB", "B7036IL", "B7038IL", "B7039IL", "B7043IL", "B7044IL", "B7046IL", "B7049IL", "B70514", "B7051BGA", "B7051IL", "B7053", "B7053BGA", "B7055BGA", "B7056IL", "B7059BGA", "B7060IL", "B7061BGA", "B7061IL", "B7064BGA", "B7066BGA", "B7068BGA", "B7069BGA", "B7073BGA", "B7082BGA", "B7083BGA", "B7100BGA", "B7101BGA", "B7102BGA", "B7103BGA", "B7107BGA", "B7116BGA", "B7141BGA", "B7144BGA", "B7144FGA", "B7147BGA", "B7148BGA", "B7175BGA", "B7176BGA", "B7180BGA", "B7182BGA", "B7184BGA", "B7185BGA", "B7186BGA", "B7187BGA", "B7187BGAH", "B7189BGA", "B7190BGA", "B7191BGA", "B7192BGA", "B7192WB", "B7197CGA", "B7210CGA", "B7222BGA", "B7223WB", "B7225BGA", "B7225WB", "B7226WB", "B7230WB", "B7232BGA", "B7232WB", "B7242CGA", "B7261CGA", "B7263CGA", "B7266CGA", "B7266IG", "B7269CGA", "B7279ZX", "B7301BGA", "B7303BGA", "B7304BGA", "B7305BGA", "B7308BGA", "B7308BGA-", "B7309BGA", "B7311BGA", "B7314BGA", "B7402BGA", "B7470FGA", "B7509CS", "B7545CS", "B7630IW", "B7630WB", "B7631IW", "B7669BW", "B7689FGA", "B7693TK", "B7694FGA", "B7696FGA", "B7714FGA", "B7714WB", "B7753TGD", "B7770IW", "B7770TGD", "B7772IW", "B7855FGA", "B7873FGA", "B7939TGC", "B7949TGC", "B7993DB"],
  "ARMADA JAYA": ["A7507A", "A7507BM", "A7509CS", "A7540CS", "A7554BL", "A7580CS", "A7709A", "A7752A", "A7935A", "A7980A", "B7580FGA"],
  "ASLI PRIMA": ["A7506KC", "A7546CS", "A7548CS", "A7548KC", "A7550KC", "A7550KL", "A7551KL", "A7552KC", "A7553KC", "A7556KC", "A7565KC", "A7567KC", "A7568KC", "A7569KC", "A7628KC", "A7629KC", "A7630KC", "A7703KC", "A7803KC", "A7803KL", "A7833KC", "A7848KC", "A7920K", "A7922K", "A7924K", "B7376TGD"],
  "BHINNEKA": ["E7511AD", "E7512AD", "E7513AD", "E7568AA", "E7611KC", "E7655AA", "E7684", "E7684AA", "E7685A", "E7685AA", "E7687AA", "E7706AA", "E7709AA", "E7712AA", "E7740B", "E7780B", "E7797AA", "E7797B", "E7805B", "E7806B", "E7834B", "E7835B"],
  "BIMA SUCI": ["A7507CS", "A7509CS", "A7511CS", "A7516CS", "A7520CS", "A7539CS", "A7540CS", "A7541CS", "A7545CS", "A7546CS", "A7548CS", "A7551CS", "A7559F", "A7584CS", "A7593CS", "A7779A", "A7990A", "A7991A", "A7992A", "A7993A", "A7994A", "A7995A", "A7996A", "A7997A", "A7998A", "A7999A", "B7027IL", "B7032IL", "B7034IL", "B7035WB", "B7043IL", "B7053BGA", "B7053TGA", "B7055BGA", "B7061IL", "B7100BGA", "B7101BGA", "B7102BGA", "B7103BGA", "B7141BGA", "B7144BGA", "B7147BGA", "B7180BGA", "B7190BGA", "B7191BGA", "B7192BGA", "B7192WB", "B7223WB", "B7232BGA", "B7303BGA", "B7509CS", "B7545CS", "B7546CS", "B7551CS", "B7559F", "B7630IW", "B7631IW"],
  "DAMRI": ["B7379TGD", "B7381TGC", "B7390TGC"],
  "GARUDA MAS": ["B7128UGA", "B7238UGA", "B7260UGA", "B7285UGA", "E7611KC", "E7661KC"],
  "GUNUNG HARTA": ["B7486KGA", "B7500KGA", "B7846KGA", "N7627UA"],
  "HARYANTO": ["B7960FGA", "K7477OB"],
  "HIBA PUTRA": ["D7532AD", "D7532AL", "D7650AC"],
  "KARUNIA BAKTI": ["B7842DB", "B7993DB", "Z7636EZ", "Z7727DB", "Z7838DB", "Z7841DB", "Z7842DB", "Z7859DA", "Z7993DB", "Z7994DB"],
  "LAJU PRIMA": ["A7998A", "B7030TGC", "B7030TGD", "B7050TGC", "B7147BGA", "B7173TGC", "B7174TGC", "B7176TGC", "B7181TGC", "B7186TGC", "B7343TGD", "B7425TGD", "B7434TGD", "B7708FGA", "B7708IW", "B7712FGA", "B7712IW", "B7757TGD", "B7857XA", "B7869IS"],
  "MARITA": ["F7622WA"],
  "MEDALI MAS": ["N7028UB", "N7029UB", "N7399UA", "N7432UA", "N7485UA", "N7823UA", "N7824UA", "N7847UA"],
  "MERDEKA PRIMA": ["A7507BM", "Z7618TA", "Z7721TG", "Z7752TA", "Z7754TA", "Z7760TE", "Z7768TA", "Z7850TA", "Z7922TB"],
  "MURNI JAYA": ["A7550KL", "A7729K", "A7738KL", "A7740KL", "A7750KL", "A7767KL", "A7783KL", "A7833KC", "A7848KC", "B7376TGD", "B7379TGD", "B7380TGD", "B7587IW", "B7783TGD"],
  "PRIMAJASA": ["A79964", "A7996A", "B7001TGD", "B7002TGD", "B7007TGD", "B7008TGD", "B7013BW", "B7027IL", "B7033IL", "B7044IL", "B7055BGA", "B7056IL", "B7062FGA", "B7072PW", "B7073BGA", "B7073PW", "B7076PW", "B7078PW", "B7112BGA", "B7115TGD", "B7140TGE", "B7142FGA", "B7144FGA", "B71454", "B7145FGA", "B7145TGE", "B7152FGA", "B7157FGB", "B7159FGA", "B7159FGB", "B7160FGB", "B7161FGA", "B7161TGE", "B7163", "B7163FGB", "B7164FGA", "B7165FGB", "B7166FGA", "B7168FGA", "B7172FGA", "B7172FGB", "B7172FGBYG", "B7173FGA", "B7174FGA", "B7175BGA", "B7180TGD", "B7182BGA", "B7186BGA", "B7186TGA", "B7187BGA", "B7189BGA", "B7189TGA", "B7192BGA", "B7192WB", "B7196YV", "B7197YV", "B7198YV", "B7199YV", "B7199ZX", "B7201TGA", "B7202TGD", "B7202YV", "B7204YV", "B7208TGA", "B7209YV", "B7223WB", "B7232YV", "B7261CGA", "B7263CGA", "B7279ZX", "B7281TGA", "B7284TGD", "B7367IW", "B7402BGA", "B7493TGC", "B7500FGA", "B7554TGC", "B7576FGA", "B7580FGA", "B7630WB", "B76734", "B7673FGA", "B7675FGA", "B7677FGA", "B7679FGA", "B7681FGA", "B7683FGA", "B7685FGA", "B7687FGA", "B7688FGA", "B7689FGA", "B7690FGA", "B7691FGA", "B7692FGA", "B7693FGA", "B7694FGA", "B7695FGA", "B7696FGA", "B7697FGA", "B7698FGA", "B7699FGA", "B7700FGA", "B7701TGD", "B7702FGA", "B7702TGD", "B7704FGA", "B7706FGA", "B7707TGD", "B7708FGA", "B7708TGD", "B77104", "B7710FGA", "B7712", "B7712FGA", "B7714", "B7714FGA", "B7714WB", "B7716FGA", "B7718FGA", "B7741FGA", "B7742TGD", "B77497", "B7749TGD", "B7751TGC", "B7751TGD", "B7753", "B7753TGD", "B7754TGD", "B7757TGD", "B7758TGD", "B77604", "B7760TGD", "B7761TGD", "B7762FGA", "B7762TGD", "B7763TGD", "B7764FGA", "B7764TGD", "B7765TGD", "B7767TGD", "B7768FGA", "B7768TGD", "B7769TGC", "B7769TGD", "B7770TGD", "B7773TGD", "B7775TGD", "B7776TGD", "B7778TGD", "B7779TGD", "B7780TGD", "B7781TGD", "B7782TGD", "B7783TGD", "B7784FGA", "B7785FGA", "B7785TGD", "B7786TGD", "B7787TGD", "B7789TGD", "B7790TGD", "B7792TGD", "B7794TGD", "B7796TGD", "B7797FGA", "B7798TGD", "B7800TGD", "B7801TGD", "B78024", "B7802FGA", "B7802TGD", "B7804FGA", "B7804TGD", "B7805TGD", "B7806FGA", "B7806TGD", "B7807FGA", "B7807TGD", "B7808IS", "B7808TGD", "B7810FGA", "B7810GA", "B7810TGD", "B7811FGA", "B7811IS", "B7813FGA", "B7815FGA", "B7815TGD", "B7817FGA", "B7828FGA", "B7828TGD", "B7831FGA", "B7833FGA", "B7841FGA", "B7844FGA", "B7845FGA", "B7847FGA", "B7850FGA", "B7855FGA", "B7859FGA", "B7859TGD", "B7860FGA", "B7861FGA", "B7861TGD", "B7867FGA", "B7869IS", "B7873FGA", "B7877FGA", "B7879FGA", "B7890TGD", "B7924TGC", "B7925TGC", "B7926TGC", "B7928TGC", "B7928TGCYANG", "B7930TGC", "B7931TGC", "B7932TGC", "B7938TGC", "B7939TGC", "B7949TGC", "B7949TGD", "B7950", "B7950TGC", "B7950TGD", "B7951TGC", "B7951TGD", "B7954TGC", "B7957TGC", "B7957TGD", "B7958FGA", "B7958TGC", "B7959TGC", "B7960FGA", "B7983TGA", "B7989TGC", "B7989TGD", "E7647KC", "E7706AA", "E7712AA", "E7892KA"],
  "SAHABAT": ["B7181TGC", "B7266CGA", "B7631KC", "B7643KC", "E7565KC", "E7581KC", "E7584KC", "E7585KC", "E7599KC", "E7611KC", "E7617KC", "E7622KC", "E7631", "E7631KC", "E7632KC", "E7640KC", "E7642KC", "E7643KC", "E7646KC", "E7647KC", "E7650KC", "E7655H", "E7691KC", "E7780", "E7849H", "E7892KA", "E7892KC", "E7937KA", "E7967KA", "E7986KA", "E7988KA", "E7988KA(", "E7989KA"],
  "SHANTIKA": ["K7017OB", "K7019OB", "K7090OB", "K7145OB", "K7147OB", "K7289OB", "K7291OB", "K7294OB", "K7342OB", "K7343OB"],
  "SINAR JAYA": ["B7032IZ", "B7035IZ", "B7061BGA", "B7074TGD", "B7075TGD", "B7076TGD", "B7173FGA", "B7173TGA", "B7178TGA", "B7187BW", "B7218TGB", "B7218TGE", "B7266CGA", "B7282TGD", "B7284TGD", "B7285YV", "B7290TGD", "B7324TGD", "B7330TGD", "B7343TGD", "B7354IW", "B7367IW", "B7403ZX", "B7404ZX", "B7434TGD", "B7437TGD", "B7447TGD", "B7458TGD", "B7460FGA", "B7470FGA", "B7501TGC", "B7503TGC", "B7517AV", "B7519VB", "B7548CS", "B7550TGC", "B7554TGC", "B7620TGC", "B7620WB", "B7630WB", "B7693FGA", "B7740TGD", "B7742TGD", "B7754TGA", "B7754TGD", "B7762TGD", "B7773TGA", "B7783TGD", "B7783YZ", "B7802TGD", "B7807TGD", "B7865VB", "B7920FGA", "B7928ZX", "B7930TGC", "B7938TGC", "B7938ZX", "B7939TGC", "B7939ZX", "B7940ZX", "B7944TGD", "B7949TGD", "B7950TGC", "B7951TGD", "B7952TGD", "B7958FGA", "B7958TGC", "B7960FGA", "B7960TGD", "B7962FGA", "B7962TGD", "B7983ZX", "D7517AV", "E7631KC", "E7982KA"],
};

const PO_NAMES = Object.keys(REAL_PO_DATA);

const MERK_MIX = ["Scania", "Hino", "Mitsubishi", "Mercedes-Benz", "Toyota"];
const JENIS_KENDARAAN = ["Bus Besar", "Bus Sedang", "Bus Mini"] as const;
const KAPASITAS_MAP: Record<string, number> = {
  "Bus Besar": 55,
  "Bus Sedang": 35,
  "Bus Mini": 19,
};
const COMMON_ROUTES = ["MERAK - BANDUNG", "MERAK - KP. RAMBUTAN", "MERAK - TJ. PRIOK", "MERAK - BEKASI", "MERAK - KALIDERES", "MERAK - BOGOR", "MERAK - CIREBON", "MERAK - SLAWI", "MERAK - GARUT"];

// ── Helpers ────────────────────────────────────────────

function seededHash(s: string): number {
  return s
    .toUpperCase()
    .replace(/\s/g, "")
    .split("")
    .reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 0);
}

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[seed % arr.length]!;
}

function generateMasaBerlaku(seed: number): string {
  const base = new Date("2026-01-01");
  const offsetDays = (seed % 730) - 180;
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

  for (const [poName, plates] of Object.entries(REAL_PO_DATA)) {
    const poKode = `PO-${PO_NAMES.indexOf(poName) + 1}`.padStart(6, "0");

    for (const plate of plates) {
      const h = seededHash(plate + poName);
      const merk = pick(MERK_MIX, h);
      const route = pick(COMMON_ROUTES, h >> 3);
      const jenis = pick(JENIS_KENDARAAN, h >> 6);
      const tahun = 2016 + (h % 9);
      const { status, issues, catatan } = determineStatus(plate);

      const record: ComplianceRecord = {
        nomor_polisi: plate,
        compliance_status: status,
        issue_count: issues,
        source_updated_at: now,
        payload: {
          po_nama: poName,
          po_kode: poKode,
          merk,
          tahun,
          route,
          kapasitas: KAPASITAS_MAP[jenis] ?? 40,
          masa_berlaku_iwkbu: generateMasaBerlaku(h),
          jenis_kendaraan: jenis,
          terminal_asal: TERMINAL,
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
      // Unknown plate: fabricate deterministic record
      const h = seededHash(plate);
      const { status, issues, catatan } = determineStatus(plate);
      const poName = pick(PO_NAMES, h);
      const poKode = `PO-${PO_NAMES.indexOf(poName) + 1}`.padStart(6, "0");

      results.push({
        nomor_polisi: plate,
        compliance_status: status,
        issue_count: issues,
        source_updated_at: new Date().toISOString(),
        payload: {
          po_nama: poName,
          po_kode: poKode,
          merk: pick(MERK_MIX, h),
          tahun: 2014 + (h % 11),
          route: pick(COMMON_ROUTES, h),
          kapasitas: pick([55, 35, 19], h),
          masa_berlaku_iwkbu: generateMasaBerlaku(h),
          jenis_kendaraan: pick(JENIS_KENDARAAN, h),
          terminal_asal: TERMINAL,
          ...(catatan ? { catatan } : {}),
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
    po_count: PO_NAMES.length,
  };
}

export function regenerateData(): void {
  _store = generateAllRecords();
}
