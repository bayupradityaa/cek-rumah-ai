function BrandMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill="#ffffff" opacity="0.14" />
      <path
        d="M10 7.2h8.2a1.2 1.2 0 0 1 1.2 1.2v16.4h-2.5v-5.1a1.9 1.9 0 0 0-3.8 0v5.1H10V7.2Z"
        fill="#ffffff"
        fillRule="evenodd"
      />
      <rect x="20.4" y="11.4" width="3.1" height="13.4" fill="#ffffff" opacity="0.55" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <p className="footer__brand">
            <BrandMark />
            <span>
              RumahKita <em className="footer__brand-ai">AI</em>
            </span>
          </p>
          <p className="footer__meta">
            © {year} RumahKita AI · Estimasi harga rumah DKI Jakarta
          </p>
        </div>
        <p className="footer__stack">
          Dibangun dengan <strong>PyTorch</strong>, <strong>FastAPI</strong> &amp;{' '}
          <strong>React</strong>
        </p>
      </div>
    </footer>
  );
}
