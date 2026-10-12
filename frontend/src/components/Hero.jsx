import { TOTAL_DISTRICTS } from '../data/districts.js';

/* Angka pada panel di bawah adalah ILUSTRASI FORMAT — menunjukkan bentuk
   informasi yang akan diterima pengguna (harga utama, rentang, harga per m²,
   rentang pada meter), bukan hasil perhitungan nyata. Panel tidak diberi
   label "contoh/hasil" palsu; tag di atasnya menyatakan tampilan format. */
const SAMPLE = {
  city: 'Jakarta Selatan',
  district: 'Tebet',
  price: 'Rp 2.553.386.853',
  perM2: 'Rp 21.278.224 / m²',
  lowLabel: '≈ Rp 1,9 M',
  highLabel: '≈ Rp 3,2 M',
  meter: 'LUAS TANAH 120 M²',
};

function MeterTrack() {
  return (
    <div className="hero__meter-track" aria-hidden="true">
      {Array.from({ length: 24 }, (_, index) => (
        <span key={index} />
      ))}
    </div>
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

        <aside className="hero__panel fade-seq fade-seq--3" aria-label="Ilustrasi format hasil estimasi">
          <p className="hero__panel-tag">Tampilan Format</p>

          <div className="hero__panel-head">
            <strong>Laporan Estimasi</strong>
            <span>
              {SAMPLE.city} · {SAMPLE.district}
            </span>
          </div>

          <div className="hero__figure">
            <p className="hero__figure-label">Estimasi harga</p>
            <p className="hero__figure-value">{SAMPLE.price}</p>
            <p className="hero__figure-sub">diantara {SAMPLE.lowLabel} – {SAMPLE.highLabel}</p>
          </div>

          <div className="hero__panel-divider" />

          <div className="hero__meter">
            <div>
              <p className="hero__meter-label">{SAMPLE.meter}</p>
              <p className="hero__meter-value">{SAMPLE.perM2}</p>
            </div>
            <p className="hero__meter-side">berdasarkan luas tanah</p>
          </div>

          <MeterTrack />

          <p className="hero__panel-foot">
            Estimasi dihitung dari pola harga penawaran historis; hasil aktual dapat berbeda
            karena kondisi bangunan, lokasi, dan negosiasi.
          </p>
        </aside>
      </div>
    </section>
  );
}
