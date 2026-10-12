import { useEffect, useRef, useState } from 'react';

const NAV_LINKS = [
  { href: '#estimasi', label: 'Estimasi' },
  { href: '#cara-kerja', label: 'Cara Kerja' },
  { href: '#faq', label: 'FAQ' },
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

function BurgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') burgerRef.current?.focus();
      setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const closeFromLink = () => {
    setMenuOpen(false);
    burgerRef.current?.focus();
  };

  return (
    <header className="navbar" id="beranda">
      {menuOpen ? <div className="navbar__scrim" onClick={() => setMenuOpen(false)} /> : null}

      <div className="container navbar__inner">
        <a className="navbar__brand" href="#beranda" aria-label="RumahKita AI — ke beranda">
          <BrandMark />
          <span>
            RumahKita <em className="navbar__brand-ai">AI</em>
          </span>
        </a>

        <div className="navbar__menu--desktop">
          <nav aria-label="Navigasi utama">
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

        <button
          type="button"
          ref={burgerRef}
          className="navbar__burger"
          aria-expanded={menuOpen}
          aria-controls="navbar-panel"
          aria-label={menuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <CloseIcon /> : <BurgerIcon />}
        </button>
      </div>

      {menuOpen ? (
        <div className="navbar__panel" id="navbar-panel">
          <nav aria-label="Navigasi utama">
            <ul className="navbar__links">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a className="navbar__link" href={link.href} onClick={closeFromLink}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a className="btn btn--primary btn--block btn--lg" href="#estimasi" onClick={closeFromLink}>
            Estimasi Sekarang
          </a>
        </div>
      ) : null}
    </header>
  );
}
