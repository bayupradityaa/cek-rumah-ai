/**
 * Pemformatan angka untuk seluruh antarmuka. Semua mata uang diserahkan ke
 * Intl.NumberFormat locale `id-ID` (pemisah ribuan titik, spasi non-breaking
 * setelah "Rp"). Satu pengecualian: `formatRupiahWrap` mengganti spasi itu
 * menjadi spasi biasa agar angka utama kartu hasil boleh turun baris utuh.
 */

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const billionFormatter = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const millionFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 1,
});

const plainNumberFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 0,
});

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

/** Contoh keluaran: `Rp 4.200.000.000`. Mengembalikan `—` untuk nilai tak valid. */
export function formatRupiah(value) {
  if (!isFiniteNumber(value)) return '—';
  return rupiahFormatter.format(value);
}

/**
 * Varian untuk angka utama kartu hasil: spasi setelah "Rp" dijadikan spasi
 * biasa sehingga pada layar sempit angka panjang turun baris utuh setelah
 * "Rp", bukan terbelah di tengah digit.
 */
export function formatRupiahWrap(value) {
  if (!isFiniteNumber(value)) return '—';
  return rupiahFormatter.format(value).replaceAll('\u00A0', ' ');
}

/**
 * Nilai pembulatan nominal besar:
 * - `>= 1 Miliar`: `≈ Rp 4,2 Miliar`
 * - `< 1 Miliar` : `≈ Rp 900 Juta`
 */
export function formatBillion(value) {
  if (!isFiniteNumber(value)) return '—';
  if (value < 1_000_000_000) {
    const millions = value / 1_000_000;
    return `≈ Rp ${millionFormatter.format(millions)} Juta`;
  }
  return `≈ Rp ${billionFormatter.format(value / 1_000_000_000)} Miliar`;
}

/** Harga per meter persegi luas tanah, dalam format Rupiah penuh. */
export function formatPerM2(price, landArea) {
  if (!isFiniteNumber(price) || !isFiniteNumber(landArea) || landArea <= 0) return '—';
  return formatRupiah(price / landArea);
}

/** Angka biasa dengan pemisah ribuan Indonesia, untuk ringkasan luas (m²). */
export function formatNumber(value) {
  if (!isFiniteNumber(value)) return '—';
  return plainNumberFormatter.format(value);
}

/**
 * Bentuk ringkas untuk rentang harga:
 * - `>= 1 Miliar`: `Rp 1,4 M`
 * - `< 1 Miliar` : `Rp 900 Jt`
 */
export function formatRupiahShort(value) {
  if (!isFiniteNumber(value)) return '—';
  if (value < 1_000_000_000) {
    const millions = value / 1_000_000;
    return `Rp ${millionFormatter.format(millions)} Jt`;
  }
  return `Rp ${billionFormatter.format(value / 1_000_000_000)} M`;
}
