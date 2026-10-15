import { TOTAL_DISTRICTS } from '../data/districts.js';

/* Angka pada panel laporan di bawah adalah CONTOH FORMAT — bentuk informasi
   yang akan diterima pengguna (harga utama, rentang, harga per m²), bukan
   hasil perhitungan siapa pun. Status "contoh" dinyatakan eksplisit lewat
   tag, catatan di dalam kartu, dan aria-label panel. Nilainya konsisten
   dengan kartu hasil: 2.553.386.853 / 120 m² = 21.278.224 per m², dan
   rentang ±25% = 1,9 M – 3,2 M. */
const SAMPLE = {
  city: 'Jakarta Selatan',
  district: 'Tebet',
  price: 'Rp 2.553.386.853',
  range: 'Rentang ≈ Rp 1,9 M – Rp 3,2 M',
  perM2: 'Rp 21.278.224 / m²',
  meter: 'Luas tanah 120 m²',
};

/* Denah berskala: bidang tanah 12 × 10 m (= 120 m²) dengan tapak bangunan di
   dalamnya, memakai garis dimensi seperti gambar arsitektur. Ini menggantikan
   elemen dekoratif dengan diagram yang menjelaskan hubungan luas tanah dan
   luas bangunan — dua input yang memang dipakai model, bukan sekadar penghias
   ruang kosong. */
function PlanDiagram() {
  return (
    <svg
      className="hero__plan"
      viewBox="0 0 260 160"
      role="img"
      aria-label="Denah ilustrasi: bidang tanah 12 kali 10 meter dengan tapak bangunan di dalamnya"
      focusable="false"
    >
      <rect
        x="40"
        y="16"
        width="196"
        height="104"
        fill="var(--canvas)"
        stroke="var(--border-strong)"
        strokeWidth="1"
        strokeDasharray="5 4"
      />

      <rect x="74" y="40" width="120" height="62" fill="var(--primary-soft)" />
      <rect
        x="74"
        y="40"
        width="120"
        height="62"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.5"
      />
      {/* Arsir silang: konvensi gambar arsitektur untuk menandai bidang
          terbangun, menggantikan satu garis diagonal yang terbaca seperti
          goresan tak sengaja. */}
      <line x1="74" y1="40" x2="194" y2="102" stroke="var(--primary)" strokeWidth="0.7" opacity="0.28" />
      <line x1="74" y1="102" x2="194" y2="40" stroke="var(--primary)" strokeWidth="0.7" opacity="0.28" />

      <text className="hero__plan-label" x="134" y="75" textAnchor="middle">
        BANGUNAN
      </text>

      <line x1="40" y1="138" x2="236" y2="138" stroke="var(--ink-faint)" strokeWidth="1" />
      <line x1="40" y1="132" x2="40" y2="144" stroke="var(--ink-faint)" strokeWidth="1" />
      <line x1="236" y1="132" x2="236" y2="144" stroke="var(--ink-faint)" strokeWidth="1" />
      <text className="hero__plan-dim" x="138" y="154" textAnchor="middle">
        12 m
      </text>

      <line x1="22" y1="16" x2="22" y2="120" stroke="var(--ink-faint)" strokeWidth="1" />
      <line x1="16" y1="16" x2="28" y2="16" stroke="var(--ink-faint)" strokeWidth="1" />
      <line x1="16" y1="120" x2="28" y2="120" stroke="var(--ink-faint)" strokeWidth="1" />
      <text className="hero__plan-dim" x="22" y="68" textAnchor="middle" transform="rotate(-90 22 68)">
        10 m
      </text>

      {/* Penunjuk utara: konvensi gambar denah, bukan hiasan. */}
      <text className="hero__plan-north" x="247" y="21" textAnchor="middle">
        U
      </text>
      <line
        x1="247"
        y1="25"
        x2="247"
        y2="35"
        stroke="var(--primary-hover)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d="M247 24.5l-2.4 3.6h4.8z" fill="var(--primary-hover)" />
    </svg>
  );
}

function LandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Hero({ onPrimaryAction }) {
  return (
    <section className="hero" id="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="hero__eyebrow fade-seq fade-seq--1">Property Insights · DKI Jakarta</p>

          <h1 className="hero__title fade-seq fade-seq--2">
            Kenali nilai rumah Anda, <em>dengan perspektif yang lebih jelas.</em>
          </h1>

          <p className="hero__subtitle fade-seq fade-seq--3">
            Perkirakan harga rumah berdasarkan spesifikasi properti dan pola harga penawaran
            historis di {TOTAL_DISTRICTS} kecamatan DKI Jakarta.
          </p>

          <div className="hero__actions fade-seq fade-seq--4">
            <button type="button" className="btn btn--primary btn--lg" onClick={onPrimaryAction}>
              Estimasi Harga Rumah
            </button>
            <a className="btn btn--ghost btn--lg" href="#cara-kerja">
              Pelajari Metodenya
            </a>
          </div>

          <p className="hero__note fade-seq fade-seq--4">
            <LandIcon />
            <span>
              Gratis dan tanpa pendaftaran. Estimasi bersifat indikatif, bukan penawaran resmi.
            </span>
          </p>
        </div>

        <aside
          className="hero__panel fade-seq fade-seq--3"
          aria-label="Contoh tampilan: ilustrasi format hasil estimasi, bukan hasil perhitungan Anda"
        >
          <p className="hero__panel-tag">Contoh Tampilan</p>

          <div className="hero__panel-head">
            <strong>Laporan Estimasi</strong>
            <span>
              {SAMPLE.city} · {SAMPLE.district}
            </span>
          </div>

          <p className="hero__panel-disclaimer">
            Angka di bawah adalah contoh format, bukan hasil perhitungan Anda.
          </p>

          <div className="hero__figure" aria-hidden="true">
            <p className="hero__figure-label">Estimasi harga</p>
            <p className="hero__figure-value">{SAMPLE.price}</p>
            <p className="hero__figure-sub">{SAMPLE.range}</p>
          </div>

          <div className="hero__panel-divider" />

          <div className="hero__meter">
            <div>
              <p className="hero__meter-label">{SAMPLE.meter}</p>
              <p className="hero__meter-value">{SAMPLE.perM2}</p>
            </div>
            <p className="hero__meter-side">berdasarkan luas tanah</p>
          </div>

          <PlanDiagram />

          <p className="hero__panel-foot">
            Estimasi dihitung dari pola harga penawaran historis; hasil aktual dapat berbeda
            karena kondisi bangunan, lokasi, dan negosiasi.
          </p>
        </aside>
      </div>
    </section>
  );
}
