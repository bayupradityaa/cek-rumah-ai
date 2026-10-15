import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import PredictionForm from './components/PredictionForm.jsx';
import ResultCard, { ResultEmpty, ResultError, ResultSkeleton } from './components/ResultCard.jsx';
import HowItWorks, { Faq } from './components/HowItWorks.jsx';
import Disclaimer from './components/Disclaimer.jsx';
import Footer from './components/Footer.jsx';
import { CITY_DISTRICTS } from './data/districts.js';
import { predictPrice } from './utils/api.js';

const STORAGE_KEY = 'rumahkita:lastSearch';
const STORAGE_VERSION = 1;

const FIELD_ORDER = [
  'city',
  'district',
  'bed_rooms',
  'bath_rooms',
  'carport',
  'land_area',
  'building_area',
];

const EMPTY_FORM = {
  city: '',
  district: '',
  bed_rooms: '3',
  bath_rooms: '2',
  carport: '1',
  land_area: '',
  building_area: '',
};

const AREA_MIN = 10;
const AREA_MAX = 5000;

/* --------------------------------------------------------------------------
   Bantuan murni
   -------------------------------------------------------------------------- */

function parseNumber(value) {
  if (value === '' || value === null || value === undefined) return Number.NaN;
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function validateForm(values) {
  const errors = {};

  if (!values.city) {
    errors.city = 'Silakan pilih kota terlebih dahulu';
  }

  if (!values.district) {
    errors.district = 'Silakan pilih kecamatan terlebih dahulu';
  } else if (values.city && !(CITY_DISTRICTS[values.city] ?? []).includes(values.district)) {
    errors.district = 'Kecamatan tidak sesuai dengan kota yang dipilih';
  }

  const bedRooms = parseNumber(values.bed_rooms);
  if (Number.isNaN(bedRooms)) {
    errors.bed_rooms = 'Silakan isi jumlah kamar tidur';
  } else if (!Number.isInteger(bedRooms)) {
    errors.bed_rooms = 'Jumlah kamar tidur harus bilangan bulat';
  } else if (bedRooms < 1) {
    errors.bed_rooms = 'Kamar tidur minimal 1';
  } else if (bedRooms > 10) {
    errors.bed_rooms = 'Kamar tidur maksimal 10';
  }

  const bathRooms = parseNumber(values.bath_rooms);
  if (Number.isNaN(bathRooms)) {
    errors.bath_rooms = 'Silakan isi jumlah kamar mandi';
  } else if (!Number.isInteger(bathRooms)) {
    errors.bath_rooms = 'Jumlah kamar mandi harus bilangan bulat';
  } else if (bathRooms < 1) {
    errors.bath_rooms = 'Kamar mandi minimal 1';
  } else if (bathRooms > 10) {
    errors.bath_rooms = 'Kamar mandi maksimal 10';
  }

  const carport = parseNumber(values.carport);
  if (Number.isNaN(carport)) {
    errors.carport = 'Silakan isi jumlah carport';
  } else if (!Number.isInteger(carport)) {
    errors.carport = 'Jumlah carport harus bilangan bulat';
  } else if (carport < 0) {
    errors.carport = 'Carport minimal 0';
  } else if (carport > 5) {
    errors.carport = 'Carport maksimal 5';
  }

  const landArea = parseNumber(values.land_area);
  if (Number.isNaN(landArea)) {
    errors.land_area = 'Silakan isi luas tanah';
  } else if (landArea < AREA_MIN) {
    errors.land_area = 'Luas tanah minimal 10 m²';
  } else if (landArea > AREA_MAX) {
    errors.land_area = 'Luas tanah maksimal 5.000 m²';
  }

  const buildingArea = parseNumber(values.building_area);
  if (Number.isNaN(buildingArea)) {
    errors.building_area = 'Silakan isi luas bangunan';
  } else if (buildingArea < AREA_MIN) {
    errors.building_area = 'Luas bangunan minimal 10 m²';
  } else if (buildingArea > AREA_MAX) {
    errors.building_area = 'Luas bangunan maksimal 5.000 m²';
  }

  return errors;
}

function buildWarning(values) {
  const landArea = parseNumber(values.land_area);
  const buildingArea = parseNumber(values.building_area);
  if (Number.isFinite(landArea) && Number.isFinite(buildingArea) && buildingArea > landArea) {
    return 'Luas bangunan biasanya tidak melebihi luas tanah, yakin sudah benar?';
  }
  return '';
}

function buildPayload(values) {
  return {
    bed_rooms: parseNumber(values.bed_rooms),
    bath_rooms: parseNumber(values.bath_rooms),
    carport: parseNumber(values.carport),
    land_area: parseNumber(values.land_area),
    building_area: parseNumber(values.building_area),
    city: values.city,
    district: values.district,
  };
}

function formFromPayload(payload) {
  return {
    city: typeof payload.city === 'string' ? payload.city : '',
    district: typeof payload.district === 'string' ? payload.district : '',
    bed_rooms: payload.bed_rooms !== undefined ? String(payload.bed_rooms) : EMPTY_FORM.bed_rooms,
    bath_rooms: payload.bath_rooms !== undefined ? String(payload.bath_rooms) : EMPTY_FORM.bath_rooms,
    carport: payload.carport !== undefined ? String(payload.carport) : EMPTY_FORM.carport,
    land_area: payload.land_area !== undefined ? String(payload.land_area) : '',
    building_area: payload.building_area !== undefined ? String(payload.building_area) : '',
  };
}

/* --------------------------------------------------------------------------
   Penyimpanan lokal (selalu dibungkus try/catch — mode privat bisa melempar)
   -------------------------------------------------------------------------- */

function loadStoredSearch() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if (parsed.v !== STORAGE_VERSION) return null;
    if (!parsed.payload || typeof parsed.payload !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveStoredSearch(payload, result) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ v: STORAGE_VERSION, ts: Date.now(), payload, result })
    );
  } catch {
    /* Penyimpanan tidak tersedia — estimasi tetap berjalan tanpa pemulihan. */
  }
}

function clearStoredSearch() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* Tidak ada yang bisa dilakukan bila penyimpanan diblokir. */
  }
}

/* Gulir halus dimatikan bila pengguna menyalakan "kurangi gerak" — perilaku
   ini sejalan dengan aturan `scroll-behavior` di CSS. */
function preferredScrollBehavior() {
  const reduceMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return reduceMotion ? 'auto' : 'smooth';
}

/* --------------------------------------------------------------------------
   Reveal saat masuk viewport
   --------------------------------------------------------------------------
   Elemen bertanda `data-reveal` memulai dalam keadaan tergeser (lihat CSS).
   Tanpa JavaScript — atau bila pengguna mematikan motion — elemen langsung
   ditandai `in` agar tidak ada konten yang tersembunyi.
   -------------------------------------------------------------------------- */

export default function App() {
  const [restored] = useState(loadStoredSearch);
  const [form, setForm] = useState(() =>
    restored?.payload ? formFromPayload(restored.payload) : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(() => (restored?.result ? 'success' : 'idle'));
  const [result, setResult] = useState(() => restored?.result ?? null);
  const [lastPayload, setLastPayload] = useState(() => restored?.payload ?? null);
  const [errorMessage, setErrorMessage] = useState('');
  const [resultNonce, setResultNonce] = useState(0);

  const abortRef = useRef(null);
  const fieldRefs = useRef({});
  const formSectionRef = useRef(null);
  const resultRegionRef = useRef(null);
  const hasSubmittedRef = useRef(false);

  const warning = useMemo(() => buildWarning(form), [form]);

  /* Reveal: satu observer untuk seluruh halaman. Node ditandai `in` sekali
     saat masuk viewport, lalu tidak diamati lagi. */
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-reveal]'));
    if (nodes.length === 0) return undefined;

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      nodes.forEach((node) => node.setAttribute('data-reveal', 'in'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-reveal', 'in');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    []
  );

  useEffect(() => {
    if (status !== 'success' || !hasSubmittedRef.current) return;
    const region = resultRegionRef.current;
    if (!region || typeof window === 'undefined' || !window.matchMedia) return;

    const behavior = preferredScrollBehavior();

    /* Ponsel & tablet: kartu hasil berada di bawah formulir, jadi dibawa ke
       atas layar. Desktop: kartu hasil ada di kolom kanan — cukup digulir
       seperlunya agar angkanya masuk viewport tanpa kehilangan konteks. */
    if (window.matchMedia('(max-width: 1023px)').matches) {
      region.scrollIntoView({ behavior, block: 'start' });
    } else {
      region.scrollIntoView({ behavior, block: 'nearest' });
    }
  }, [status, resultNonce]);

  const runPrediction = useCallback(async (payload) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('loading');
    setErrorMessage('');
    setLastPayload(payload);

    try {
      const data = await predictPrice(payload, { signal: controller.signal });
      if (controller.signal.aborted) return;
      setResult(data);
      setStatus('success');
      setResultNonce((nonce) => nonce + 1);
      saveStoredSearch(payload, data);
    } catch (error) {
      // Permintaan yang dibatalkan (komponen dilepas / digantikan) tidak boleh
      // memicu perubahan state sama sekali.
      if (controller.signal.aborted || error?.code === 'aborted') return;
      setErrorMessage(error?.message || 'Terjadi kesalahan tak terduga. Silakan coba lagi.');
      setStatus('error');
    }
  }, []);

  const handleChange = useCallback((name, value) => {
    setForm((previous) => {
      const next = { ...previous, [name]: value };
      if (name === 'city') next.district = '';
      return next;
    });

    setErrors((previous) => {
      const affected = name === 'city' ? ['city', 'district'] : [name];
      if (!affected.some((field) => previous[field])) return previous;
      const next = { ...previous };
      affected.forEach((field) => delete next[field]);
      return next;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) {
      const element = fieldRefs.current[firstInvalid];
      if (element) {
        element.focus({ preventScroll: true });
        element.scrollIntoView({ behavior: preferredScrollBehavior(), block: 'center' });
      }
      return;
    }

    hasSubmittedRef.current = true;
    runPrediction(buildPayload(form));
  }, [form, runPrediction]);

  const handleRetry = useCallback(() => {
    if (!lastPayload) return;
    hasSubmittedRef.current = true;
    runPrediction(lastPayload);
  }, [lastPayload, runPrediction]);

  const handleReset = useCallback(() => {
    abortRef.current?.abort();
    setForm(EMPTY_FORM);
    setErrors({});
    setResult(null);
    setErrorMessage('');
    setStatus('idle');
    setLastPayload(null);
    clearStoredSearch();
    formSectionRef.current?.scrollIntoView({ behavior: preferredScrollBehavior(), block: 'start' });
  }, []);

  const scrollToForm = useCallback(() => {
    formSectionRef.current?.scrollIntoView({ behavior: preferredScrollBehavior(), block: 'start' });
    const firstField = fieldRefs.current.city;
    if (firstField) {
      window.setTimeout(() => firstField.focus({ preventScroll: true }), 420);
    }
  }, []);

  return (
    <div className="app">
      <a className="skip-link" href="#form-estimasi">
        Lewati ke formulir estimasi
      </a>

      <Navbar />

      <main>
        <Hero onPrimaryAction={scrollToForm} />

        <section className="section estimate" id="estimasi" ref={formSectionRef}>
          <div className="container">
            <div className="section__head" data-reveal>
              <p className="section__eyebrow">Estimasi</p>
              <h2 className="section__title">Hitung estimasi harga rumah Anda</h2>
              <p className="section__lead">
                Isi spesifikasi rumah di formulir, lalu tekan tombol hitung. Hasil tampil di
                sampingnya setelah perhitungan selesai.
              </p>
            </div>

            <div className="estimate__grid">
              <PredictionForm
                values={form}
                errors={errors}
                warning={warning}
                onChange={handleChange}
                onSubmit={handleSubmit}
                isSubmitting={status === 'loading'}
                fieldRefs={fieldRefs}
              />

              <div
                className="estimate__result"
                ref={resultRegionRef}
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                {status === 'loading' ? <ResultSkeleton /> : null}

                {status === 'error' ? (
                  <ResultError message={errorMessage} onRetry={handleRetry} />
                ) : null}

                {status === 'success' && result ? (
                  <ResultCard
                    key={resultNonce}
                    result={result}
                    payload={lastPayload}
                    onReset={handleReset}
                  />
                ) : null}

                {status === 'idle' ? <ResultEmpty /> : null}
              </div>
            </div>
          </div>
        </section>

        <HowItWorks />
        <Faq />
        <Disclaimer />
      </main>

      <Footer />
    </div>
  );
}
