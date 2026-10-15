import { useEffect, useRef, useState } from 'react';

const NAV_LINKS = [
  { href: '#estimasi', label: 'Estimasi', desc: 'Kalkulator harga properti DKI Jakarta' },
  { href: '#cara-kerja', label: 'Cara Kerja', desc: 'Metodologi & alur prediksi model AI' },
  { href: '#faq', label: 'FAQ', desc: 'Pertanyaan seputar data & akurasi' },
];

/* Monogram arsitektural: bingkai wajah bangunan dengan pintu masuk di
   tengah — satuan bentuk tunggal tanpa makna tambahan. */
function BrandMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill="var(--primary)" />
      <path
        d="M10 7.2h8.2a1.2 1.2 0 0 1 1.2 1.2v16.4h-2.5v-5.1a1.9 1.9 0 0 0-3.8 0v5.1H10V7.2Z"
        fill="#ffffff"
        fillRule="evenodd"
      />
      <rect x="20.4" y="11.4" width="3.1" height="13.4" fill="#ffffff" opacity="0.55" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AnimatedBurger({ open }) {
  return (
    <span className={`navbar__burger-icon ${open ? 'navbar__burger-icon--open' : ''}`} aria-hidden="true">
      <span className="navbar__burger-bar navbar__burger-bar--top" />
      <span className="navbar__burger-bar navbar__burger-bar--mid" />
      <span className="navbar__burger-bar navbar__burger-bar--bot" />
    </span>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef(null);
  const panelRef = useRef(null);

  // Kunci scroll halaman saat drawer mobile terbuka, pindahkan fokus ke dalam
  // panel, kurung fokus di sana, dan tangani tombol Escape.
  useEffect(() => {
    if (!menuOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    const focusables = panel
      ? Array.from(panel.querySelectorAll('a[href], button:not([disabled])'))
      : [];
    focusables[0]?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        burgerRef.current?.focus();
        setMenuOpen(false);
        return;
      }

      if (event.key !== 'Tab' || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      const insidePanel = panel ? panel.contains(active) : false;

      if (event.shiftKey && (!insidePanel || active === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!insidePanel || active === last)) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  // Tutup menu otomatis bila pengguna mengubah ukuran layar ke desktop (>= 864px)
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 864 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [menuOpen]);

  const closeFromLink = () => {
    setMenuOpen(false);
    burgerRef.current?.focus();
  };

  const closeFromScrim = () => {
    setMenuOpen(false);
    burgerRef.current?.focus();
  };

  return (
    <header className={`navbar ${menuOpen ? 'navbar--open' : ''}`} id="beranda">
      {/* Backdrop scrim dengan transisi halus */}
      {menuOpen ? (
        <div
          className="navbar__scrim"
          aria-hidden="true"
          onClick={closeFromScrim}
        />
      ) : null}

      <div className="container navbar__inner">
        <a className="navbar__brand" href="#beranda" aria-label="RumahKita AI — ke beranda" onClick={() => setMenuOpen(false)}>
          <BrandMark />
          <span>
            RumahKita <em className="navbar__brand-ai">AI</em>
          </span>
        </a>

        {/* Menu Navigasi Desktop */}
        <div className="navbar__menu--desktop">
          <nav aria-label="Navigasi utama desktop">
            <ul className="navbar__links">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a className="navbar__link" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a className="btn btn--primary navbar__cta" href="#estimasi">
            Estimasi Sekarang
          </a>
        </div>

        {/* Tombol Hamburger Mobile dengan animasi bar halus */}
        <button
          type="button"
          ref={burgerRef}
          className={`navbar__burger ${menuOpen ? 'navbar__burger--active' : ''}`}
          aria-expanded={menuOpen}
          aria-controls="navbar-panel"
          aria-label={menuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <AnimatedBurger open={menuOpen} />
        </button>
      </div>

      {/* Drawer Panel Mobile (Floating Sheet Beranimasi) */}
      {menuOpen ? (
        <div
          className="navbar__panel"
          id="navbar-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi mobile"
        >
          <nav aria-label="Navigasi utama mobile">
            <ul className="navbar__panel-links">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a className="navbar__panel-link" href={link.href} onClick={closeFromLink}>
                    <div className="navbar__panel-link-text">
                      <span className="navbar__panel-link-title">{link.label}</span>
                      <span className="navbar__panel-link-desc">{link.desc}</span>
                    </div>
                    <span className="navbar__panel-link-icon" aria-hidden="true">
                      <ChevronRightIcon />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="navbar__panel-footer">
            <a
              className="btn btn--primary btn--block btn--lg navbar__panel-cta"
              href="#estimasi"
              onClick={closeFromLink}
            >
              <span>Estimasi Sekarang</span>
              <ArrowRightIcon />
            </a>

            <div className="navbar__panel-meta" aria-hidden="true">
              <span>5 Wilayah</span>
              <span className="navbar__panel-meta-dot" />
              <span>251 Kecamatan DKI</span>
              <span className="navbar__panel-meta-dot" />
              <span>Gratis & Instan</span>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
