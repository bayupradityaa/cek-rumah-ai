/**
 * Data wilayah DKI Jakarta untuk dropdown Kota & Kecamatan.
 *
 * PENTING: daftar ini HARUS konsisten dengan LabelEncoder di sisi backend
 * (`le_district.pkl`), karena backend memanggil `.transform()` pada nilai
 * district yang dikirim. Jika frontend mengirim nama kecamatan yang tidak
 * dikenal encoder, backend akan melempar ValueError dan request gagal.
 *
 * Daftar di bawah berisi tepat 251 kecamatan yang dapat di-encode model,
 * tersebar di 5 wilayah administrasi DKI Jakarta.
 */

export const CITY_DISTRICTS = {
  "Jakarta Barat": [
    "Alfa Indah", "Angke", "Bandara", "Bojong Indah",
    "Cengkareng", "Cengkareng Barat", "Central Park", "Citra Garden",
    "Daan Mogot", "Duri Kepa", "Duri Kosambi", "Duri Pulo",
    "Duta Garden", "Gelong Baru", "Green Lake City", "Green Mansion",
    "Green Ville", "Green garden", "Grogol", "Grogol Petamburan",
    "Intercon", "Jalan Panjang", "Jelambar", "Jembatan Besi",
    "Jembatan Dua", "Jembatan Lima", "Joglo", "Kalideres",
    "Kav DKI", "Kebon Jeruk", "Kedoya", "Kedoya Baru",
    "Kedoya Selatan", "Kelapa Dua", "Kemanggisan", "Kembangan",
    "Kembangan Selatan", "Kepa Duri", "Kota", "Kota Bambu Selatan",
    "Mangga Besar", "Mangga Dua", "Meruya", "Metland Puri",
    "Metro permata", "Palmerah", "Pegadungan", "Permata Buana",
    "Puri Indah", "Puri Mansion", "Puri Media", "Rawa Belong",
    "Rawa Buaya", "Semanan", "Slipi", "Srengseng",
    "Sunrise Garden", "Taman Cosmos", "Taman Kencana", "Taman Kota",
    "Taman Meruya", "Taman Palem", "Taman Ratu", "Taman Surya",
    "Tamansari", "Tambora", "Tanjung Duren", "Tanjung Duren Selatan",
    "Tanjung Duren Utara", "Tawakal", "Tomang", "Tubagus Angke",
    "Villa Meruya"
  ],
  "Jakarta Pusat": [
    "Bendungan Hilir", "Bungur", "Cempaka Putih", "Cideng",
    "Cikini", "Gajah Mada", "Gambir", "Gondangdia",
    "Gunung Sahari", "Johar Baru", "Karang Anyar", "Karet Tengsin",
    "Kartini", "Kebon Kacang", "Kebon Sirih", "Kemayoran",
    "Kramat", "Menteng", "Menteng Atas", "Pangeran Jayakarta",
    "Pasar Baru", "Pegangsaan", "Pejompongan", "Percetakan Negara",
    "Petojo", "Roxy", "Salemba", "Sawah Besar",
    "Senen", "Sumur Batu", "Tanah Abang", "Thamrin"
  ],
  "Jakarta Selatan": [
    "Ampera", "Antasari", "Bangka", "Bintaro",
    "Blok M", "Casablanca", "Ciganjur", "Cilandak",
    "Cinere", "Cipedak", "Cipete", "Cipulir",
    "Cirendeu", "Duren Tiga", "Fatmawati", "Gandaria",
    "Gatot Subroto", "Graha Bintaro", "Gudang Peluru", "Guntur",
    "Jagakarsa", "Jati Padang", "Jeruk Purut", "Kalibata",
    "Karet", "Kebagusan", "Kebayoran Baru", "Kebayoran Lama",
    "Kemang", "Kuningan", "Lebak Bulus", "Lenteng Agung",
    "Mampang", "Mampang Prapatan", "Manggarai", "Mega Kuningan",
    "Menteng Dalam", "Pakubuwono", "Pancoran", "Panglima Polim",
    "Pasar Minggu", "Patal Senayan", "Pejaten", "Pejaten Timur",
    "Pengadegan", "Permata Hijau", "Pesanggrahan", "Petukangan",
    "Pondok Indah", "Pondok Labu", "Pondok Pinang", "Prapanca",
    "Radio Dalam", "Ragunan", "Rempoa Ciputat Timur", "SCBD",
    "Sektor 1 - Bintaro", "Sektor 2 - Bintaro", "Sektor 3 - Bintaro", "Senayan",
    "Senopati", "Setiabudi", "Simprug", "Simprug Garden",
    "TB Simatupang", "Tanah Kusir", "Tanjung Barat", "Tebet",
    "Terogong", "Ulujami", "Veteran", "Warung Buncit",
    "Wijaya", "patra kuningan"
  ],
  "Jakarta Timur": [
    "Bambu Apus", "Buaran", "Cakung", "Cawang",
    "Cibubur", "Cijantung", "Cilangkap", "Cipayung",
    "Cipinang", "Cipinang Melayu", "Ciracas", "Citra Grand",
    "Condet", "Duren Sawit", "Jakarta Garden City", "Jatinegara",
    "Jatiwaringin", "Kalimalang", "Kalisari", "Kampung Ambon",
    "Kampung Rambutan", "Kayu Jati", "Kayu Putih", "Klender",
    "Kota Wisata", "Kramat Jati", "Legenda Wisata", "Lubang Buaya",
    "Makasar", "Matraman", "Metland Menteng", "Otista",
    "Pasar Rebo", "Penggilingan", "Pondok Bambu", "Pondok Gede",
    "Pondok Kelapa", "Pondok Kopi", "Pondok Ranggon", "Pulo Asem",
    "Pulo Gadung", "Pulogebang", "Pulomas", "Raffles Hills",
    "Rawamangun", "Ruko Rawa Lumbu", "Setu", "Utan Kayu"
  ],
  "Jakarta Utara": [
    "Ancol", "Bandengan", "Cilincing", "Golf Island",
    "Kamal", "Kapuk", "Kapuk Muara", "Kelapa Gading",
    "Koja", "Marunda", "Muara Karang", "Pademangan",
    "Pantai Indah Kapuk", "Pantai Indah Kapuk 2", "Pantai Mutiara", "Pegangsaan",
    "Penjaringan", "Pluit", "Rawa Badak", "Rorotan",
    "Semper", "Sunter", "Taman Grisenda", "Tanjung Priok",
    "Teluk Gong"
  ],
};

export const CITIES = Object.keys(CITY_DISTRICTS);

/** Jumlah total kecamatan yang didukung model (untuk teks trust badge). */
export const TOTAL_DISTRICTS = 251;
