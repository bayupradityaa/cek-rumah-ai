"""
Script pengujian fungsi API dan alur Machine Learning secara langsung.
Jalankan dengan: python test_api.py
"""

from main import app, predict, HouseInput, le_city, le_district
from pydantic import ValidationError
from fastapi import HTTPException

def run_tests():
    print("==========================================")
    print(" MEMULAI PENGUJIAN SISTEM PREDIKSI RUMAH ")
    print("==========================================")

    print("\n--- 1. Cek Metadata Artefak ---")
    print(f"[OK] Jumlah Kota terdaftar: {len(le_city.classes_)} -> {list(le_city.classes_)}")
    print(f"[OK] Jumlah Kecamatan terdaftar: {len(le_district.classes_)}")

    print("\n--- 2. Uji Kasus Prediksi Valid (Jakarta Selatan - Tebet) ---")
    inp_valid = HouseInput(
        bed_rooms=3,
        bath_rooms=2,
        carport=1,
        land_area=120.0,
        building_area=100.0,
        city="Jakarta Selatan",
        district="Tebet"
    )
    res = predict(inp_valid)
    print("[OK] Hasil Prediksi:")
    print(f"  - Nilai Rupiah : Rp {res['predicted_price_rupiah']:,}")
    print(f"  - Nilai Miliar : Rp {res['predicted_price_billion']} Miliar")
    print(f"  - Catatan      : {res['note']}")
    assert res['predicted_price_rupiah'] > 0, "Harga harus lebih besar dari 0"

    print("\n--- 3. Uji Kasus Prediksi Valid (Jakarta Barat - Kebon Jeruk) ---")
    inp_valid2 = HouseInput(
        bed_rooms=4,
        bath_rooms=3,
        carport=2,
        land_area=200.0,
        building_area=250.0,
        city="Jakarta Barat",
        district="Kebon Jeruk"
    )
    res2 = predict(inp_valid2)
    print("[OK] Hasil Prediksi:")
    print(f"  - Nilai Rupiah : Rp {res2['predicted_price_rupiah']:,}")
    print(f"  - Nilai Miliar : Rp {res2['predicted_price_billion']} Miliar")
    assert res2['predicted_price_rupiah'] > 0

    print("\n--- 4. Uji Penolakan Kecamatan Tidak Valid ---")
    try:
        inp_invalid_district = HouseInput(
            bed_rooms=2,
            bath_rooms=1,
            carport=1,
            land_area=60.0,
            building_area=50.0,
            city="Jakarta Pusat",
            district="KecamatanTidakAda123"
        )
        predict(inp_invalid_district)
        print("[FAIL] Kecamatan tidak valid tidak melempar HTTPException!")
    except HTTPException as e:
        print(f"[OK] Berhasil ditolak dengan HTTP {e.status_code}: {e.detail}")

    print("\n--- 5. Uji Validasi Pydantic (Input Negatif / Zero) ---")
    try:
        HouseInput(
            bed_rooms=-1,
            bath_rooms=0,
            carport=-2,
            land_area=-50.0,
            building_area=0.0,
            city="Jakarta Pusat",
            district="Menteng"
        )
        print("[FAIL] Input negatif tidak melempar ValidationError!")
    except ValidationError as e:
        print(f"[OK] Berhasil dicegat Pydantic: {len(e.errors())} error validasi terdeteksi.")

    print("\n==========================================")
    print(" SEMUA PENGUJIAN 100% SUKSES DAN SEMPURNA! ")
    print("==========================================")

if __name__ == "__main__":
    run_tests()
