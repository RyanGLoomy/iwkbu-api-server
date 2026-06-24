# IWKBU API Server

Mock server untuk simulasi API kepatuhan IWKBU (Iuran Wajib Kecelakaan Bukan Untuk) Jasa Raharja.

Server ini menyediakan data compliance kendaraan yang akan disinkronisasi oleh sistem Terminal IWKBU melalui cron endpoint.

## Quick Start

```bash
# Install dependencies
npm install

# Copy env
cp .env.example .env

# Run dev server
npm run dev

# Atau build & start
npm run build && npm start
```

Server berjalan di `http://localhost:8787`.

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Health check + ringkasan data |
| POST | `/compliance/check` | Bearer | Cek compliance bulk (utama) |
| GET | `/compliance/all` | Bearer | List semua record (paginated) |
| GET | `/compliance/:plate` | Bearer | Lookup per plat |
| POST | `/compliance/refresh` | Bearer | Regenerate demo data |

### POST /compliance/check

Endpoint utama yang dipanggil oleh cron `/api/cron/iwkbu-fetch`.

**Request:**
```json
{
  "plates": ["BZ 1234 AB", "B 5678 CD"]
}
```

**Response (200):**
```json
{
  "records": [
    {
      "nomor_polisi": "BZ 1234 AB",
      "compliance_status": "compliant",
      "issue_count": 0,
      "source_updated_at": "2026-06-24T...",
      "payload": {
        "po_nama": "Perum DAMRI",
        "po_kode": "PO-DAMRI",
        "merk": "Scania",
        "tahun": 2020,
        "route": "Serang - Merak",
        "kapasitas": 55,
        "masa_berlaku_iwkbu": "2026-08-15",
        "jenis_kendaraan": "Bus Besar",
        "terminal_asal": "Terminal Pakupatan Serang"
      }
    }
  ],
  "source": "iwkbu-mock-api",
  "fetched_at": "2026-06-24T...",
  "count": 2
}
```

## Data Demo

Data di-generate deterministik per plat nomor:
- **~100 armada** tersebar di **8 PO**
- **5 terminal**: Pakupatan Serang, Cilegon, Poris Tangerang, Kalideres, Pulo Gebang
- Distribusi compliance: ~60% compliant, ~20% pending, ~15% non_compliant, ~5% unknown
- Plat: BZ (Banten), B (Jakarta)
- Merk: Mitsubishi, Hino, Scania, Mercedes-Benz

## Deployment

### Docker

```bash
docker build -t iwkbu-api-server .
docker run -p 8787:8787 -e IWKBU_API_KEY=your-secret iwkbu-api-server
```

### Vercel

```bash
npx vercel
```

Set environment variables di Vercel dashboard:
- `IWKBU_API_KEY` — secret key untuk autentikasi

## Konfigurasi Terminal IWKBU App

Set di `.env.local` aplikasi Terminal IWKBU:

```env
IWKBU_API_URL=http://localhost:8787
IWKBU_API_KEY=demo-iwkbu-api-key-2026
IWKBU_SYNC_CRON_SECRET=your-cron-secret
```

Lalu trigger sync:
```bash
curl -X POST http://localhost:3000/api/cron/iwkbu-fetch \
  -H "Authorization: Bearer your-cron-secret"
```
