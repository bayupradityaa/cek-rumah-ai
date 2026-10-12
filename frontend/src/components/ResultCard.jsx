import { formatBillion, formatNumber, formatPerM2, formatRupiah, formatRupiahShort } from '../utils/format.js';

const RANGE_FACTOR = 0.25;

function ResultRow({ label, value }) {
  return (
    <div className="result__row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export default function ResultCard({ result, payload, onReset }) {
  const price = result.predicted_price_rupiah;
  const low = price * (1 - RANGE_FACTOR);
  const high = price * (1 + RANGE_FACTOR);

  return (
    <section className="card result result--enter">
      <p className="result__label">Estimasi harga rumah</p>
      <p className="result__price">{formatRupiah(price)}</p>
      <p className="result__billion">{formatBillion(price)}</p>

      <p className="result__range">
        Perkiraan rentang: {formatRupiahShort(low)} – {formatRupiahShort(high)}
      </p>
      <p className="result__note">
        Rentang indikatif (±25%) — bukan interval keyakinan statistik.
      </p>

      <dl className="result__facts">
        <div>
          <dt>Harga per m² tanah</dt>
          <dd>{formatPerM2(price, payload?.land_area)}</dd>
        </div>
      </dl>

      <div className="result__summary">
        <h3>Ringkasan spesifikasi Anda</h3>
        <dl>
          <ResultRow label="Kecamatan" value={payload?.district ?? '—'} />
          <ResultRow label="Kota" value={payload?.city ?? '—'} />
          <ResultRow label="Kamar tidur" value={formatNumber(payload?.bed_rooms)} />
          <ResultRow label="Kamar mandi" value={formatNumber(payload?.bath_rooms)} />
          <ResultRow label="Carport" value={formatNumber(payload?.carport)} />
          <ResultRow label="Luas tanah" value={`${formatNumber(payload?.land_area)} m²`} />
          <ResultRow label="Luas bangunan" value={`${formatNumber(payload?.building_area)} m²`} />
        </dl>
      </div>

      <div className="result__actions">
        <button type="button" className="btn btn--ghost btn--block" onClick={onReset}>
          Hitung Ulang
        </button>
      </div>
    </section>
  );
}

export function ResultSkeleton() {
  return (
    <section className="card skeleton" aria-label="Sedang menghitung estimasi">
      <div className="skeleton__bar skeleton__bar--sm" />
      <div className="skeleton__bar skeleton__bar--lg" />
      <div className="skeleton__bar skeleton__bar--md" />
      <div className="skeleton__bar skeleton__bar--block" />
    </section>
  );
}

function AlertIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M12 4.6 3.2 19.4h17.6z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M12 10v4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="16.9" r="1" fill="currentColor" />
    </svg>
  );
}

export function ResultError({ message, onRetry }) {
  return (
    <section className="card status-card status-card--error">
      <span className="status-card__icon">
        <AlertIcon />
      </span>
      <h2 className="status-card__title">Estimasi gagal dihitung</h2>
      <p className="status-card__text">{message}</p>
      <div className="status-card__actions">
        <button type="button" className="btn btn--primary btn--block" onClick={onRetry}>
          Coba Lagi
        </button>
      </div>
    </section>
  );
}

function SparkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.4 10.1 12.8 4.5 10.9 10.1 9z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ResultEmpty() {
  return (
    <section className="card status-card">
      <span className="status-card__icon">
        <SparkIcon />
      </span>
      <h2 className="status-card__title">Hasil estimasi muncul di sini</h2>
      <p className="status-card__text">
        Lengkapi spesifikasi rumah pada formulir, lalu tekan tombol Hitung Estimasi Harga. Hasil
        perhitungan akan tampil di area ini beserta rentang indikatif dan harga per meter persegi.
      </p>
    </section>
  );
}
