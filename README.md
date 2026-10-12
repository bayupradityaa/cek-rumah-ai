#  Prediksi Harga Rumah DKI Jakarta (RumahKita AI)

Sistem full-stack terintegrasi untuk estimasi harga penawaran properti/rumah di 5 wilayah administrasi (251 kecamatan) DKI Jakarta berbasis PyTorch Deep Learning dan scikit-learn, dilengkapi antarmuka web modern satu halaman (SPA) berbasis React.

---

## 📁 Struktur Direktori

```text
prediksi-rumah-dki/
├── backend/                  # REST API Backend (FastAPI + PyTorch)
│   ├── .venv/                # Virtual environment terisolasi (Python 3.12)
│   ├── best_model.pth        # Checkpoint bobot PyTorch (bit-identical dengan v2)
│   ├── house_price_model_v2.pth # Checkpoint bobot PyTorch aktif
│   ├── le_city.pkl           # Joblib encoder untuk 5 kota DKI Jakarta
│   ├── le_district.pkl       # Joblib encoder untuk 251 kecamatan DKI Jakarta
│   ├── scaler.pkl            # StandardScaler untuk 5 fitur numerik
│   ├── main.py               # Aplikasi FastAPI, arsitektur model, dan endpoint
│   ├── requirements.txt      # Daftar dependensi Python
│   └── test_api.py           # Script pengujian otomatis end-to-end
│
├── frontend/                 # Web Application (React 18 + Vite 5)
│   ├── public/               # Asset statis (favicon, dll)
│   ├── src/                  # Kode sumber komponen UI React & stylesheet
│   │   ├── components/       # Komponen modular (Hero, PredictionForm, ResultCard, dll)
│   │   ├── data/             # Dataset daftar kecamatan DKI Jakarta
│   │   ├── styles/           # Desain CSS (Dark/Light mode native)
│   │   └── utils/            # Klien HTTP (api.js) & format mata uang Rupiah
│   ├── .env                  # Environment lokal (VITE_API_BASE_URL)
│   ├── .env.example          # Template konfigurasi environment
│   └── package.json          # Dependensi frontend
│
├── .gitignore                # Aturan ignore Git untuk Python & Node.js
└── README.md                 # Dokumentasi utama proyek
```

---

## 🛠️ Teknologi yang Digunakan

### Backend
- **FastAPI**: Web framework asinkron berkinerja tinggi dengan auto-dokumentasi Swagger OpenAPI.
- **PyTorch**: Deep Neural Network (`HousePriceNet`) dengan categorical embedding layers + MLP.
- **scikit-learn (~1.6.1)**: Standarisasi fitur (`StandardScaler`) dan encoding wilayah (`LabelEncoder`).
- **Pydantic v2**: Validasi skema input ketat (mencegah input negatif/nol).
- **Uvicorn**: Server ASGI production-ready.

### Frontend
- **React 18**: UI reaktif satu halaman (SPA) tanpa ketergantungan library pihak ketiga yang berlebihan.
- **Vite 5**: Bundler modern super cepat.
- **Vanilla CSS**: Desain responsif, mobile-first, dengan dukungan otomatis tema terang/gelap (`prefers-color-scheme`).

---

## 🚀 Panduan Menjalankan Proyek

### 1. Menjalankan Backend (Port 8000)

Buka terminal pertama:
```powershell
# Masuk ke direktori backend
cd backend

# Aktifkan virtual environment
.\.venv\Scripts\Activate.ps1
# (Atau untuk CMD: .\.venv\Scripts\activate.bat)

# Jalankan server FastAPI
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
Backend akan aktif di: **`http://127.0.0.1:8000`**  
Dokumentasi interaktif Swagger UI: **`http://127.0.0.1:8000/docs`**

### 2. Menjalankan Frontend (Port 5173)

Buka terminal kedua (terpisah):
```powershell
# Masuk ke direktori frontend
cd frontend

# Pasang dependensi (jika belum)
npm install

# Jalankan development server
npm run dev
```
Aplikasi web dapat diakses di browser: **`http://localhost:5173`**

---

## 🧪 Pengujian Otomatis

Untuk memastikan seluruh pipeline machine learning dan validasi berfungsi dengan benar, jalankan script pengujian:

```powershell
cd backend
.\.venv\Scripts\python.exe test_api.py
```

Skrip ini otomatis memverifikasi:
1. Pemuatan seluruh artefak (5 kota dan 251 kecamatan).
2. Prediksi valid untuk berbagai wilayah Jakarta.
3. Penolakan input negatif atau nol melalui Pydantic (HTTP 422).
4. Penolakan kecamatan fiktif / tidak terdaftar (HTTP 400).

---

## 📡 Dokumentasi Endpoint API

### `POST /predict`
Menghitung estimasi harga properti berdasarkan spesifikasi fisik dan wilayah.

**Request Body (JSON):**
```json
{
  "bed_rooms": 3,
  "bath_rooms": 2,
  "carport": 1,
  "land_area": 120.0,
  "building_area": 100.0,
  "city": "Jakarta Selatan",
  "district": "Tebet"
}
```

**Response (200 OK):**
```json
{
  "predicted_price_rupiah": 2553386853,
  "predicted_price_billion": 2.553,
  "note": "AI estimation based on Jakarta historical data"
}
```

### `GET /health`
Mengecek status kesehatan server dan arsitektur model yang aktif.

### `GET /metadata`
Mengambil daftar kota resmi yang didukung model.
