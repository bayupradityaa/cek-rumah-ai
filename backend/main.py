from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import torch
import torch.nn as nn
import joblib
import numpy as np

# Inisialisasi FastAPI aplikasi
app = FastAPI(
    title="Jakarta House Price API v2",
    description="API Estimasi Harga Rumah DKI Jakarta berbasis PyTorch Deep Learning & scikit-learn",
    version="2.0"
)

# Konfigurasi CORS agar frontend (RumahKita AI / Vite) dapat mengakses API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path direktori file ini agar loading artefak tahan banting (robust) di mana pun server dijalankan
BASE_DIR = Path(__file__).resolve().parent

# Load artefak preprocessing
scaler = joblib.load(BASE_DIR / "scaler.pkl")
le_city = joblib.load(BASE_DIR / "le_city.pkl")
le_district = joblib.load(BASE_DIR / "le_district.pkl")

# Definisi Arsitektur Model Deep Neural Network
class HousePriceNet(nn.Module):
    def __init__(self, n_num, cat_cards, emb_dims):
        super().__init__()
        self.embeddings = nn.ModuleList([nn.Embedding(c, d) for c, d in zip(cat_cards, emb_dims)])
        self.net = nn.Sequential(
            nn.Linear(n_num + sum(emb_dims), 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 128),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(64, 1)
        )

    def forward(self, x_num, x_cat):
        embs = torch.cat([e(x_cat[:, i]) for i, e in enumerate(self.embeddings)], dim=1)
        return self.net(torch.cat([x_num, embs], dim=1))

# Load checkpoint model PyTorch
ckpt = torch.load(BASE_DIR / "house_price_model_v2.pth", map_location="cpu")
model = HousePriceNet(ckpt['n_num_features'], ckpt['cat_cardinalities'], ckpt['emb_dims'])
model.load_state_dict(ckpt['model_state_dict'])
model.eval()  # Wajib mode eval untuk menonaktifkan Dropout dan membekukan BatchNorm stats

# Schema Input dengan validasi tipe dan batasan nilai
class HouseInput(BaseModel):
    bed_rooms: int = Field(..., ge=1, description="Jumlah kamar tidur (minimal 1)")
    bath_rooms: int = Field(..., ge=1, description="Jumlah kamar mandi (minimal 1)")
    carport: int = Field(..., ge=0, description="Kapasitas garasi/carport (minimal 0)")
    land_area: float = Field(..., gt=0, description="Luas tanah dalam m² (harus lebih besar dari 0)")
    building_area: float = Field(..., gt=0, description="Luas bangunan dalam m² (harus lebih besar dari 0)")
    city: str = Field(..., min_length=1, description="Kota administrasi di DKI Jakarta")
    district: str = Field(..., min_length=1, description="Kecamatan di DKI Jakarta")

@app.get("/")
def root():
    return {
        "message": "Jakarta House Price API v2 running!",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": "HousePriceNet v2",
        "device": "cpu",
        "supported_cities": len(le_city.classes_),
        "supported_districts": len(le_district.classes_)
    }

@app.get("/metadata")
def get_metadata():
    return {
        "cities": sorted(list(le_city.classes_)),
        "districts_count": len(le_district.classes_)
    }

@app.post("/predict")
def predict(inp: HouseInput):
    clean_city = inp.city.strip()
    clean_district = inp.district.strip()

    # Validasi City
    try:
        cid = int(le_city.transform([clean_city])[0])
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"Kota '{clean_city}' tidak valid. Pilihan yang tersedia: {list(le_city.classes_)}"
        )

    # Validasi District
    try:
        did = int(le_district.transform([clean_district])[0])
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"Kecamatan '{clean_district}' tidak ditemukan dalam daftar 251 kecamatan DKI Jakarta."
        )

    # Urutan fitur numerik harus sesuai dengan data training scaler:
    # [bed_rooms, bath_rooms, carport, land_area, building_area]
    raw_num = np.array(
        [[inp.bed_rooms, inp.bath_rooms, inp.carport, inp.land_area, inp.building_area]],
        dtype=np.float32
    )
    xn = scaler.transform(raw_num)
    xc = np.array([[cid, did]], dtype=np.int64)

    # Prediksi menggunakan PyTorch
    with torch.no_grad():
        t_num = torch.as_tensor(xn, dtype=torch.float32)
        t_cat = torch.as_tensor(xc, dtype=torch.int64)
        pred_log = model(t_num, t_cat).item()

    # Inverse log1p transform (target model adalah log(price + 1))
    pred_rupiah = float(np.expm1(pred_log))
    if pred_rupiah < 0:
        pred_rupiah = 0.0

    return {
        "predicted_price_rupiah": int(round(pred_rupiah)),
        "predicted_price_billion": round(pred_rupiah / 1e9, 3),
        "note": "AI estimation based on Jakarta historical data"
    }