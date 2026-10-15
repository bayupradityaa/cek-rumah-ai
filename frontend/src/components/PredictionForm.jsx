import { CITY_DISTRICTS, CITIES } from '../data/districts.js';

const CARPORT_OPTIONS = Array.from({ length: 6 }, (_, index) => index);

const AREA_MIN = 10;
const AREA_MAX = 5000;

function MinusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function WarnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M12 4.6 3.2 19.4h17.6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 10v4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.9" r="1" fill="currentColor" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8.6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8.2v4.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="15.9" r="1" fill="currentColor" />
    </svg>
  );
}

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p className="field__error" id={id}>
      <ErrorIcon />
      {message}
    </p>
  );
}

function Stepper({ id, name, label, value, min, max, error, onChange, registerRef }) {
  const numeric = value === '' ? Number.NaN : Number(value);
  const canDecrease = Number.isFinite(numeric) && numeric > min;
  const canIncrease = !Number.isFinite(numeric) || numeric < max;
  const errorId = `${id}-error`;

  const step = (delta) => {
    if (!Number.isFinite(numeric)) {
      onChange(name, String(min));
      return;
    }
    onChange(name, String(Math.min(max, Math.max(min, numeric + delta))));
  };

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="stepper">
        <button
          type="button"
          className="stepper__btn"
          onClick={() => step(-1)}
          disabled={!canDecrease}
          aria-label={`Kurangi ${label}`}
        >
          <MinusIcon />
        </button>
        <input
          id={id}
          name={name}
          ref={registerRef(name)}
          className="stepper__value"
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(event) => onChange(name, event.target.value)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        <button
          type="button"
          className="stepper__btn"
          onClick={() => step(1)}
          disabled={!canIncrease}
          aria-label={`Tambah ${label}`}
        >
          <PlusIcon />
        </button>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function AreaField({ id, name, label, value, error, hint, extraDescribedBy, onChange, registerRef }) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, extraDescribedBy, !error ? hintId : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        ref={registerRef(name)}
        type="number"
        inputMode="numeric"
        min={AREA_MIN}
        max={AREA_MAX}
        step={1}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy || undefined}
      />
      {error ? (
        <FieldError id={errorId} message={error} />
      ) : (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      )}
    </div>
  );
}

export default function PredictionForm({
  values,
  errors,
  warning,
  onChange,
  onSubmit,
  isSubmitting,
  fieldRefs,
}) {
  const districts = values.city ? CITY_DISTRICTS[values.city] ?? [] : [];
  const registerRef = (name) => (element) => {
    fieldRefs.current[name] = element;
  };

  const showAreaWarning = Boolean(warning) && !errors.land_area && !errors.building_area;

  return (
    <form
      className="card form"
      id="form-estimasi"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="form__head">
        <h2 className="form__title">Spesifikasi rumah</h2>
        <p className="form__subtitle">Semua kolom wajib diisi untuk menghitung estimasi.</p>
      </div>

      {/* Lokasi: menentukan pilihan kecamatan pada grup berikutnya. */}
      <fieldset className="form__group">
        <legend className="form__grouplabel">Lokasi</legend>
        <div className="form__grid">
          <div className="field form__full">
            <label htmlFor="city">Kota / Wilayah</label>
            <select
              id="city"
              name="city"
              ref={registerRef('city')}
              value={values.city}
              onChange={(event) => onChange('city', event.target.value)}
              aria-invalid={errors.city ? 'true' : undefined}
              aria-describedby={errors.city ? 'city-error' : undefined}
            >
              <option value="">— Pilih Kota —</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <FieldError id="city-error" message={errors.city} />
          </div>

          <div className="field form__full">
            <label htmlFor="district">Kecamatan</label>
            <select
              id="district"
              name="district"
              ref={registerRef('district')}
              value={values.district}
              onChange={(event) => onChange('district', event.target.value)}
              disabled={!values.city}
              aria-invalid={errors.district ? 'true' : undefined}
              aria-describedby={errors.district ? 'district-error' : 'district-hint'}
            >
              <option value="">— Pilih Kecamatan —</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            {errors.district ? (
              <FieldError id="district-error" message={errors.district} />
            ) : (
              <p className="field__hint" id="district-hint">
                {values.city
                  ? 'Pilih kecamatan sesuai lokasi rumah Anda.'
                  : 'Pilih kota terlebih dahulu untuk melihat daftar kecamatan.'}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Dimensi: komposisi dan ukuran rumah yang diestimasi. */}
      <fieldset className="form__group">
        <legend className="form__grouplabel">Dimensi rumah</legend>
        <div className="form__grid">
          <Stepper
            id="bed_rooms"
            name="bed_rooms"
            label="Kamar Tidur"
            value={values.bed_rooms}
            min={1}
            max={10}
            error={errors.bed_rooms}
            onChange={onChange}
            registerRef={registerRef}
          />

          <Stepper
            id="bath_rooms"
            name="bath_rooms"
            label="Kamar Mandi"
            value={values.bath_rooms}
            min={1}
            max={10}
            error={errors.bath_rooms}
            onChange={onChange}
            registerRef={registerRef}
          />

          <div className="field form__full">
            <label htmlFor="carport">Carport</label>
            <select
              id="carport"
              name="carport"
              ref={registerRef('carport')}
              value={values.carport}
              onChange={(event) => onChange('carport', event.target.value)}
              aria-invalid={errors.carport ? 'true' : undefined}
              aria-describedby={errors.carport ? 'carport-error' : 'carport-hint'}
            >
              {CARPORT_OPTIONS.map((option) => (
                <option key={option} value={String(option)}>
                  {option}
                </option>
              ))}
            </select>
            {errors.carport ? (
              <FieldError id="carport-error" message={errors.carport} />
            ) : (
              <p className="field__hint" id="carport-hint">
                Isi 0 jika rumah tidak memiliki carport.
              </p>
            )}
          </div>

          <AreaField
            id="land_area"
            name="land_area"
            label="Luas Tanah (m²)"
            value={values.land_area}
            error={errors.land_area}
            hint="Antara 10 dan 5.000 m²."
            onChange={onChange}
            registerRef={registerRef}
          />

          <AreaField
            id="building_area"
            name="building_area"
            label="Luas Bangunan (m²)"
            value={values.building_area}
            error={errors.building_area}
            hint="Antara 10 dan 5.000 m²."
            extraDescribedBy={showAreaWarning ? 'area-warning' : null}
            onChange={onChange}
            registerRef={registerRef}
          />

          {showAreaWarning ? (
            <p className="field__warning form__full" id="area-warning">
              <WarnIcon />
              <span>{warning}</span>
            </p>
          ) : null}
        </div>
      </fieldset>

      <div className="form__actions">
        <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="spinner" aria-hidden="true" />
              <span>Menghitung estimasi…</span>
            </>
          ) : (
            <span>Hitung Estimasi Harga</span>
          )}
        </button>
        <p className="form__footnote">
          Estimasi bersifat indikatif dan tidak memerlukan data pribadi Anda.
        </p>
      </div>
    </form>
  );
}
