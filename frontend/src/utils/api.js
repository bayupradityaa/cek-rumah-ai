/**
 * Klien HTTP untuk endpoint estimasi harga.
 *
 * Kontrak backend (tidak diubah dari sisi frontend):
 *   POST {VITE_API_BASE_URL}/predict
 *   Body    : { bed_rooms, bath_rooms, carport, land_area, building_area, city, district }
 *   Sukses  : 200 { predicted_price_rupiah, predicted_price_billion, note }
 *   Gagal   : status non-200 dengan body JSON { detail: "..." }
 */

const FALLBACK_BASE_URL = 'http://localhost:8000';
const REQUEST_TIMEOUT_MS = 30000;

function resolveBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL;
  if (typeof configured === 'string' && configured.trim() !== '') {
    return configured.trim().replace(/\/+$/, '');
  }
  return FALLBACK_BASE_URL;
}

export const API_BASE_URL = resolveBaseUrl();

/**
 * Error bertanda supaya antarmuka bisa membedakan penyebab kegagalan.
 * `code` bernilai salah satu dari: timeout | aborted | http | network | parse | shape.
 */
export class PredictError extends Error {
  constructor(message, code, status = null) {
    super(message);
    this.name = 'PredictError';
    this.code = code;
    this.status = status;
  }
}

/**
 * Menggabungkan sinyal pembatalan dari pemanggil dengan batas waktu 30 detik.
 * Jalur utama memakai AbortSignal.timeout + AbortSignal.any; bila browser belum
 * mendukungnya, dipakai AbortController manual dengan DOMException bernama sama
 * sehingga klasifikasi error tetap konsisten.
 */
function createRequestSignal(externalSignal) {
  const supportsModernSignals =
    typeof AbortSignal !== 'undefined' &&
    typeof AbortSignal.timeout === 'function' &&
    typeof AbortSignal.any === 'function';

  if (supportsModernSignals) {
    const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
    const signal = externalSignal ? AbortSignal.any([externalSignal, timeoutSignal]) : timeoutSignal;
    return { signal, cleanup: () => {} };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort(new DOMException('Waktu permintaan habis', 'TimeoutError'));
  }, REQUEST_TIMEOUT_MS);

  const onExternalAbort = () => {
    controller.abort(new DOMException('Permintaan dibatalkan', 'AbortError'));
  };

  if (externalSignal) {
    if (externalSignal.aborted) onExternalAbort();
    else externalSignal.addEventListener('abort', onExternalAbort, { once: true });
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer);
      if (externalSignal) externalSignal.removeEventListener('abort', onExternalAbort);
    },
  };
}

const INTERNAL_ERROR_PATTERN =
  /traceback|valueerror|typeerror|keyerror|attributeerror|indexerror|runtimeerror|self\.|line \d+/i;

async function readDetail(response) {
  // Pesan `detail` hanya dipercaya pada error 4xx. Backend memakai status 5xx
  // untuk kegagalan internal, dan pesannya bisa membocorkan detail implementasi
  // (mis. "y contains previously unseen labels"), jadi selalu diganti pesan
  // generik berbahasa Indonesia.
  if (response.status >= 500) return null;
  try {
    const body = await response.json();
    if (!body || typeof body.detail !== 'string') return null;
    const detail = body.detail.trim();
    if (detail === '' || detail.length > 200) return null;
    if (detail.includes('\n')) return null;
    if (INTERNAL_ERROR_PATTERN.test(detail)) return null;
    return detail;
  } catch {
    return null;
  }
}

/**
 * Mengirim spesifikasi rumah dan mengembalikan objek hasil estimasi.
 *
 * @param {object} payload
 * @param {{ signal?: AbortSignal }} options
 * @returns {Promise<{ predicted_price_rupiah: number, predicted_price_billion?: number, note?: string }>}
 */
export async function predictPrice(payload, { signal: externalSignal } = {}) {
  const { signal, cleanup } = createRequestSignal(externalSignal);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (error) {
    // Urutan klasifikasi wajib: timeout dulu, baru pembatalan oleh pemanggil.
    // Jika dibalik, pengguna yang berpindah halaman akan melihat pesan "timeout"
    // padahal permintaan hanya dibatalkan saat komponen dilepas.
    if (error && error.name === 'TimeoutError') {
      throw new PredictError(
        'Waktu permintaan habis. Server tidak merespons dalam 30 detik. Silakan coba lagi.',
        'timeout'
      );
    }
    if (externalSignal && externalSignal.aborted) {
      throw new PredictError('Permintaan dibatalkan.', 'aborted');
    }
    throw new PredictError(
      'Tidak dapat terhubung ke server. Periksa koneksi internet Anda lalu coba lagi.',
      'network'
    );
  } finally {
    cleanup();
  }

  if (!response.ok) {
    const detail = await readDetail(response);
    throw new PredictError(
      detail || `Server mengembalikan kesalahan (${response.status}). Silakan coba lagi.`,
      'http',
      response.status
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new PredictError('Format respons dari server tidak dapat dibaca. Silakan coba lagi.', 'parse');
  }

  if (!data || typeof data.predicted_price_rupiah !== 'number' || !Number.isFinite(data.predicted_price_rupiah)) {
    throw new PredictError('Data estimasi dari server tidak lengkap. Silakan coba lagi.', 'shape');
  }

  return data;
}
