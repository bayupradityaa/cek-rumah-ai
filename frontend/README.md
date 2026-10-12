# RumahKita AI — Estimasi Harga Rumah Jakarta

Antarmuka web satu halaman untuk memperkirakan harga rumah di DKI Jakarta. Pengguna memasukkan
spesifikasi rumah (kota, kecamatan, kamar tidur, kamar mandi, carport, luas tanah, dan luas
bangunan), lalu mendapat estimasi harga dalam Rupiah beserta rentang indikatif dan harga per
meter persegi tanah.

Frontend ini mengonsumsi API backend FastAPI yang berada pada direktori `../backend`.

## Prasyarat

- Node.js 18 atau lebih baru (disarankan 20+)
- npm 9 atau lebih baru
- Backend FastAPI yang menyediakan endpoint `POST /predict`

## Menjalankan di lokal

1. Salin berkas contoh environment dan sesuaikan bila perlu.

   ```bash
   cp .env.example .env
   ```

   Isi `VITE_API_BASE_URL` dengan alamat backend Anda. Nilai bawaan bila variabel tidak diisi
   adalah `http://localhost:8000`.

2. Pasang dependensi.

   ```bash
   npm install
   ```

3. Jalankan server pengembangan.

   ```bash
   npm run dev
   ```

   Aplikasi tersedia di `http://localhost:5173`.

4. Build untuk produksi.

   ```bash
   npm run build
   ```

   Hasil build berada di direktori `dist/`.

5. Pratinjau hasil build.

   ```bash
   npm run preview
   ```

## Variabel environment

| Variabel              | Wajib | Contoh                  | Keterangan                                     |
| --------------------- | ----- | ----------------------- | ---------------------------------------------- |
| `VITE_API_BASE_URL`   | Tidak | `http://localhost:8000` | Base URL backend. Tanpa trailing slash.        |

Semua variabel yang dipakai Vite harus diawali `VITE_` agar tersedia di sisi klien.

## Deploy ke Vercel

1. Hubungkan repositori ini ke Vercel dan pilih preset **Vite**.
2. Tambahkan environment variable `VITE_API_BASE_URL` pada menu **Settings → Environment
   Variables**, isi dengan URL backend produksi Anda.
3. Deploy. Build command `npm run build` dan output directory `dist` sudah sesuai bawaan Vite.
4. Setiap kali nilai `VITE_API_BASE_URL` berubah, lakukan redeploy karena variabel environment
   Vite ditanam saat proses build.

## Catatan CORS

Frontend dan backend berjalan pada origin yang berbeda, sehingga browser akan memblokir permintaan
lintas origin bila backend tidak mengizinkannya. Backend FastAPI harus mengizinkan origin
frontend melalui `CORSMiddleware`:

- Saat pengembangan: `http://localhost:5173`
- Saat produksi: domain Vercel Anda, misalnya `https://rumahkita-ai.vercel.app`

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://rumahkita-ai.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Jika konsol browser menampilkan pesan CORS, penyebabnya adalah konfigurasi origin di backend, bukan
bug pada frontend. Perlu diperhatikan bahwa `allow_origins=["*"]` **tidak valid** bila dipasang
bersamaan dengan `allow_credentials=True` — daftarkan origin secara eksplisit.

## Struktur berkas

```
src/
├── main.jsx                 # Titik masuk React
├── App.jsx                  # Status aplikasi, validasi, pemanggilan API
├── styles/index.css         # Satu-satunya berkas CSS
├── data/districts.js        # 251 kecamatan pada 5 wilayah DKI Jakarta
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── PredictionForm.jsx
│   ├── ResultCard.jsx
│   ├── HowItWorks.jsx       # Bagian "Cara Kerja" dan "FAQ"
│   ├── Disclaimer.jsx
│   └── Footer.jsx
└── utils/
    ├── format.js            # Pemformatan Rupiah dan angka
    └── api.js               # Klien HTTP ke endpoint /predict
```

## Catatan teknis

- React 18 + Vite 5, JavaScript tanpa TypeScript.
- Tanpa React Router: navigasi memakai anchor dan `scrollIntoView`.
- Tanpa pustaka UI, tanpa Tailwind, tanpa CSS-in-JS. Ikon berupa SVG inline.
- Mode gelap mengikuti preferensi sistem melalui `prefers-color-scheme`.
- Pencarian terakhir disimpan di `localStorage` dengan skema berversi; pembacaan dan penulisan
  selalu dibungkus `try/catch` agar aman pada mode privat maupun data yang rusak.
