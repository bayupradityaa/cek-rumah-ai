const STEPS = [
  {
    title: 'Isi spesifikasi',
    text: 'Lengkapi kota, kecamatan, jumlah kamar tidur dan kamar mandi, carport, serta luas tanah dan bangunan rumah Anda.',
  },
  {
    title: 'Model menghitung',
    text: 'Model pembelajaran mesin membandingkan spesifikasi Anda dengan pola harga penawaran historis di kecamatan yang dipilih.',
  },
  {
    title: 'Dapat estimasi',
    text: 'Lihat perkiraan harga dalam Rupiah, rentang indikatif, dan harga per meter persegi luas tanah.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Apakah estimasi ini sama dengan hasil appraisal bank?',
    answer:
      'Tidak. Estimasi RumahKita AI dihitung dari data harga penawaran historis dan bersifat indikatif. Appraisal bank dilakukan oleh penilai bersertifikat melalui survei fisik, pemeriksaan dokumen, dan pertimbangan nilai jaminan.',
  },
  {
    question: 'Mengapa luas bangunan sebaiknya tidak melebihi luas tanah?',
    answer:
      'Pada rumah tinggal standar, bangunan berdiri di atas lahan sehingga luas bangunan umumnya tidak melebihi luas tanah. Jika rumah Anda memang dibangun bertingkat atau diperluas, pastikan angka yang Anda masukkan sudah sesuai kondisi sebenarnya.',
  },
  {
    question: 'Data yang dipakai harga transaksi atau harga penawaran?',
    answer:
      'Model dilatih menggunakan data harga penawaran (asking price) yang dipublikasikan pada iklan properti. Harga transaksi final biasanya lebih rendah karena masih melalui proses negosiasi antara penjual dan pembeli.',
  },
  {
    question: 'Apakah layanan ini berbayar?',
    answer:
      'Tidak. Anda dapat menghitung estimasi sebanyak yang diperlukan tanpa biaya dan tanpa membuat akun.',
  },
  {
    question: 'Bisakah hasil estimasi ini dipakai untuk transaksi atau pengajuan kredit?',
    answer:
      'Hasil ini hanya alat bantu awal untuk memperkirakan kisaran harga. Untuk keperluan jual beli resmi, pengajuan KPR, atau pelaporan pajak, gunakan jasa penilai independen atau appraisal bank.',
  },
];

export default function HowItWorks() {
  return (
    <section className="section" id="cara-kerja">
      <div className="container">
        <div className="section__head">
          <p className="section__eyebrow">Cara Kerja</p>
          <h2 className="section__title">Tiga langkah, tanpa ribet</h2>
          <p className="section__lead">
            Tidak perlu memahami istilah properti. Isi data rumah Anda, sisanya kami hitung.
          </p>
        </div>

        {/* Konten memang berurutan (alur pengisian → perhitungan → hasil),
            sehingga penomoran menyampaikan informasi, bukan dekorasi. */}
        <ol className="steps">
          {STEPS.map((step, index) => (
            <li className="step" key={step.title}>
              <span className="step__index">{index + 1}</span>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__text">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="faq">
          <div className="faq__intro">
            <div className="section__head">
              <p className="section__eyebrow">FAQ</p>
              <h2 className="section__title">Pertanyaan yang sering diajukan</h2>
              <p className="section__lead">
                Hal-hal yang perlu Anda ketahui sebelum memakai hasil estimasi.
              </p>
            </div>
          </div>

          <div className="faq__list">
            {FAQ_ITEMS.map((item) => (
              <details className="faq__item" key={item.question}>
                <summary className="faq__question">{item.question}</summary>
                <div className="faq__answer">
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
