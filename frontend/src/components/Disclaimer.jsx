export default function Disclaimer() {
  return (
    <section className="disclaimer" id="disclaimer" aria-label="Disclaimer estimasi">
      <div className="container disclaimer__inner">
        <h2 className="disclaimer__title">Estimasi, bukan penawaran resmi</h2>
        <div>
          <p className="disclaimer__text">
            Angka yang ditampilkan dihasilkan oleh model AI berdasarkan data harga penawaran
            historis, sehingga bersifat indikatif dan bukan merupakan penawaran resmi, bukan hasil
            appraisal bank, serta tidak dapat dijadikan dasar hukum.
          </p>
          <p className="disclaimer__text">
            Harga transaksi sebenarnya dapat berbeda karena kondisi bangunan, posisi lahan,
            kelengkapan dokumen, dan proses negosiasi.
          </p>
        </div>
      </div>
    </section>
  );
}
