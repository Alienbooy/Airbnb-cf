import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import mockData from '../../mocks/api-mocks.json';

const demoLogin = mockData.auth.loginRequest;
const demoUser = mockData.auth.loginResponse.user;
const demoListings = mockData.listings.summaryResponse;

const heroStats = [
  { value: '1.2K', label: 'estancias activas' },
  { value: '98%', label: 'respuestas en menos de 1h' },
  { value: '4.9/5', label: 'satisfacción promedio' },
];

const navigationTabs = [
  'Alojamientos',
  'Experiencias',
  'Servicios',
];

const highlights = [
  'Check-in flexible',
  'AlojaYa Plus',
  'Anfitriones verificados',
  'Cancelación simple',
];

export default function HomePage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    email: demoLogin.email,
    password: demoLogin.password,
  });

  const featuredListings = useMemo(() => demoListings.slice(0, 6), []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setMessage('');
  }

  function useDemoData() {
    setForm({ ...demoLogin });
    setMessage('Datos demo cargados. Pulsa Entrar para continuar.');
  }

  function handleSubmit(event) {
    event.preventDefault();

    const emailMatches = form.email.trim().toLowerCase() === demoLogin.email.toLowerCase();
    const passwordMatches = form.password === demoLogin.password;

    if (!emailMatches || !passwordMatches) {
      setMessage('Usa la cuenta demo que aparece abajo o carga los datos de ejemplo.');
      return;
    }

    localStorage.setItem('token', mockData.auth.loginResponse.token);
    localStorage.setItem('user', JSON.stringify(demoUser));
    window.location.href = '/dashboard';
  }

  return (
    <main className="alojaya-home">
      <div className="alojaya-home__bg alojaya-home__bg--one" />
      <div className="alojaya-home__bg alojaya-home__bg--two" />

      <header className="alojaya-shell alojaya-topbar">
        <Link to="/" className="alojaya-brand" aria-label="AlojaYa home">
          <span className="alojaya-brand__mark">⌂</span>
          <span className="alojaya-brand__text">AlojaYa</span>
        </Link>

        <nav className="alojaya-tabs" aria-label="Secciones principales">
          {navigationTabs.map((tab, index) => (
            <button key={tab} type="button" className={`alojaya-tab ${index === 0 ? 'is-active' : ''}`}>
              {tab}
            </button>
          ))}
        </nav>

        <div className="alojaya-actions">
          <a className="alojaya-link" href="#login-panel">
            Ingresar
          </a>
          <button type="button" className="alojaya-iconBtn" aria-label="Cambiar idioma">
            🌐
          </button>
          <button type="button" className="alojaya-menuBtn" aria-label="Abrir menú">
            ☰
          </button>
        </div>
      </header>

      <section className="alojaya-shell alojaya-hero">
        <div className="alojaya-hero__copy">
          <span className="alojaya-pill">Tu forma de alojar, más simple</span>
          <h1>
            AlojaYa, una experiencia cálida y moderna para encontrar tu próximo refugio.
          </h1>
          <p>
            Inspirado en la claridad visual de Airbnb, pero con una identidad propia:
            más elegante, más luminosa y pensada para viajeros que quieren moverse sin fricción.
          </p>

          <div className="alojaya-search">
            <div className="alojaya-search__item">
              <span>¿Dónde?</span>
              <strong>Explora destinos</strong>
            </div>
            <div className="alojaya-search__divider" />
            <div className="alojaya-search__item">
              <span>Fechas</span>
              <strong>Agrega fechas</strong>
            </div>
            <div className="alojaya-search__divider" />
            <div className="alojaya-search__item">
              <span>Quién</span>
              <strong>¿Cuántos?</strong>
            </div>
            <button type="button" className="alojaya-search__btn" aria-label="Buscar">
              🔎
            </button>
          </div>

          <div className="alojaya-stats">
            {heroStats.map((stat) => (
              <div key={stat.label} className="alojaya-stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="alojaya-loginCard" id="login-panel">
          <div className="alojaya-loginCard__badge">Login demo</div>
          <h2>Entrá a tu cuenta</h2>
          <p>Probá el acceso con los datos mockeados del proyecto.</p>

          <form className="alojaya-form" onSubmit={handleSubmit}>
            <label className="alojaya-field">
              <span>Correo electrónico</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="ana.garcia@example.com"
                autoComplete="email"
              />
            </label>

            <label className="alojaya-field">
              <span>Contraseña</span>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password123!"
                autoComplete="current-password"
              />
            </label>

            {message && <div className="alojaya-note">{message}</div>}

            <button type="submit" className="alojaya-primaryBtn">
              Entrar
            </button>
            <button type="button" className="alojaya-secondaryBtn" onClick={useDemoData}>
              Cargar datos demo
            </button>

            <div className="alojaya-loginCard__hint">
              <span>Demo</span>
              <strong>{demoLogin.email}</strong>
              <span>{demoLogin.password}</span>
            </div>
          </form>
        </aside>
      </section>

      <section className="alojaya-shell alojaya-highlights">
        {highlights.map((item) => (
          <article key={item} className="alojaya-highlight">
            {item}
          </article>
        ))}
      </section>

      <section className="alojaya-shell alojaya-section">
        <div className="alojaya-section__head">
          <div>
            <p className="alojaya-section__eyebrow">Elegidos para vos</p>
            <h2>Alojamientos populares en Buenos Aires y alrededores</h2>
          </div>
          <Link to="/listings" className="alojaya-moreLink">
            Ver más →
          </Link>
        </div>

        <div className="alojaya-grid">
          {featuredListings.map((listing) => (
            <article key={listing.id} className="alojaya-card">
              <div className="alojaya-card__media">
                <img src={listing.coverImage} alt={listing.title} loading="lazy" />
                <span className="alojaya-card__tag">Favorito entre huéspedes</span>
                <button type="button" className="alojaya-card__heart" aria-label="Guardar">
                  ♡
                </button>
              </div>
              <div className="alojaya-card__body">
                <h3>{listing.title}</h3>
                <p>{listing.subtitle}</p>
                <div className="alojaya-card__meta">
                  <span>{listing.city}</span>
                  <span>★ {listing.rating}</span>
                </div>
                <div className="alojaya-card__price">
                  <strong>${listing.pricePerNight} USD</strong>
                  <span>por noche</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <style>{`
        :root {
          --alojaya-bg: #f6f2ea;
          --alojaya-surface: rgba(255, 255, 255, 0.72);
          --alojaya-surface-strong: #ffffff;
          --alojaya-border: rgba(15, 23, 42, 0.08);
          --alojaya-text: #0f172a;
          --alojaya-muted: rgba(15, 23, 42, 0.65);
          --alojaya-accent: #c94f7c;
          --alojaya-accent-2: #6c63ff;
          --alojaya-shadow: 0 24px 80px rgba(17, 24, 39, 0.12);
        }

        .alojaya-home {
          position: relative;
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(201, 79, 124, 0.16), transparent 32%),
            radial-gradient(circle at top right, rgba(108, 99, 255, 0.12), transparent 26%),
            linear-gradient(180deg, #fff 0%, var(--alojaya-bg) 100%);
          color: var(--alojaya-text);
          overflow: hidden;
        }

        .alojaya-home__bg {
          position: absolute;
          border-radius: 999px;
          filter: blur(20px);
          opacity: 0.45;
          pointer-events: none;
        }

        .alojaya-home__bg--one {
          width: 24rem;
          height: 24rem;
          top: -8rem;
          right: -5rem;
          background: rgba(201, 79, 124, 0.18);
        }

        .alojaya-home__bg--two {
          width: 20rem;
          height: 20rem;
          bottom: 10rem;
          left: -7rem;
          background: rgba(108, 99, 255, 0.1);
        }

        .alojaya-shell {
          position: relative;
          width: min(1180px, calc(100% - 2rem));
          margin: 0 auto;
        }

        .alojaya-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.2rem 0 0.8rem;
        }

        .alojaya-brand {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          text-decoration: none;
          color: inherit;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .alojaya-brand__mark {
          display: grid;
          place-items: center;
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 0.95rem;
          background: linear-gradient(135deg, var(--alojaya-accent), #ff805d);
          color: #fff;
          box-shadow: 0 10px 24px rgba(201, 79, 124, 0.28);
          font-size: 1.2rem;
        }

        .alojaya-brand__text {
          font-size: 1.2rem;
        }

        .alojaya-tabs {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid var(--alojaya-border);
          border-radius: 999px;
          padding: 0.3rem;
          box-shadow: 0 12px 40px rgba(15, 23, 42, 0.06);
          backdrop-filter: blur(14px);
        }

        .alojaya-tab {
          border: 0;
          background: transparent;
          color: var(--alojaya-muted);
          font: inherit;
          padding: 0.7rem 1rem;
          border-radius: 999px;
          cursor: pointer;
        }

        .alojaya-tab.is-active {
          background: #fff;
          color: var(--alojaya-text);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
        }

        .alojaya-actions {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }

        .alojaya-link {
          color: var(--alojaya-text);
          text-decoration: none;
          font-weight: 600;
          padding: 0.75rem 1rem;
          border-radius: 999px;
          transition: background 0.2s ease;
        }

        .alojaya-link:hover {
          background: rgba(15, 23, 42, 0.05);
        }

        .alojaya-iconBtn,
        .alojaya-menuBtn {
          width: 2.8rem;
          height: 2.8rem;
          border: 1px solid var(--alojaya-border);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.86);
          cursor: pointer;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
        }

        .alojaya-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.9fr);
          gap: 1.6rem;
          align-items: stretch;
          padding: 1.6rem 0 0.7rem;
        }

        .alojaya-hero__copy,
        .alojaya-loginCard,
        .alojaya-highlight,
        .alojaya-card,
        .alojaya-section,
        .alojaya-highlights {
          border: 1px solid rgba(255, 255, 255, 0.6);
          background: var(--alojaya-surface);
          box-shadow: var(--alojaya-shadow);
          backdrop-filter: blur(18px);
        }

        .alojaya-hero__copy {
          border-radius: 2rem;
          padding: 2.2rem;
        }

        .alojaya-pill,
        .alojaya-loginCard__badge,
        .alojaya-card__tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          width: fit-content;
          border-radius: 999px;
          background: rgba(201, 79, 124, 0.12);
          color: #7f2748;
          padding: 0.45rem 0.8rem;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.01em;
        }

        .alojaya-hero__copy h1 {
          margin: 1rem 0 1rem;
          font-size: clamp(2.4rem, 5vw, 4.9rem);
          line-height: 0.98;
          letter-spacing: -0.05em;
          max-width: 10ch;
        }

        .alojaya-hero__copy p {
          margin: 0;
          max-width: 62ch;
          font-size: 1.05rem;
          line-height: 1.75;
          color: var(--alojaya-muted);
        }

        .alojaya-search {
          margin-top: 1.6rem;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
          align-items: center;
          gap: 0.2rem;
          background: var(--alojaya-surface-strong);
          border: 1px solid var(--alojaya-border);
          border-radius: 999px;
          padding: 0.45rem;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
        }

        .alojaya-search__item {
          padding: 0.9rem 1rem 0.9rem 1.1rem;
        }

        .alojaya-search__item span {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(15, 23, 42, 0.52);
        }

        .alojaya-search__item strong {
          display: block;
          margin-top: 0.25rem;
          font-size: 1rem;
          font-weight: 700;
        }

        .alojaya-search__divider {
          width: 1px;
          height: 2.3rem;
          background: rgba(15, 23, 42, 0.1);
        }

        .alojaya-search__btn {
          width: 3.6rem;
          height: 3.6rem;
          border: 0;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--alojaya-accent), #ef6461);
          color: #fff;
          font-size: 1.2rem;
          cursor: pointer;
          margin-left: 0.4rem;
          box-shadow: 0 16px 30px rgba(201, 79, 124, 0.28);
        }

        .alojaya-stats {
          margin-top: 1.4rem;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
        }

        .alojaya-stat {
          padding: 1rem 1.1rem;
          border-radius: 1.3rem;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid var(--alojaya-border);
        }

        .alojaya-stat strong {
          display: block;
          font-size: 1.55rem;
          letter-spacing: -0.04em;
        }

        .alojaya-stat span {
          display: block;
          margin-top: 0.25rem;
          color: var(--alojaya-muted);
        }

        .alojaya-loginCard {
          border-radius: 2rem;
          padding: 1.5rem;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 247, 243, 0.85));
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .alojaya-loginCard h2 {
          margin: 0;
          font-size: 1.6rem;
          letter-spacing: -0.04em;
        }

        .alojaya-loginCard p {
          margin: 0;
          color: var(--alojaya-muted);
          line-height: 1.65;
        }

        .alojaya-form {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          margin-top: 0.2rem;
        }

        .alojaya-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: 0.92rem;
          font-weight: 600;
        }

        .alojaya-field span {
          color: rgba(15, 23, 42, 0.78);
        }

        .alojaya-field input {
          border: 1px solid rgba(15, 23, 42, 0.1);
          border-radius: 1rem;
          padding: 0.9rem 1rem;
          font: inherit;
          background: rgba(255, 255, 255, 0.95);
          color: var(--alojaya-text);
          outline: none;
        }

        .alojaya-field input:focus {
          border-color: rgba(201, 79, 124, 0.45);
          box-shadow: 0 0 0 4px rgba(201, 79, 124, 0.12);
        }

        .alojaya-primaryBtn,
        .alojaya-secondaryBtn {
          border: 0;
          border-radius: 1rem;
          padding: 0.95rem 1rem;
          font: inherit;
          font-weight: 700;
          cursor: pointer;
        }

        .alojaya-primaryBtn {
          background: linear-gradient(135deg, var(--alojaya-accent), #ef6461);
          color: #fff;
          box-shadow: 0 16px 30px rgba(201, 79, 124, 0.22);
        }

        .alojaya-secondaryBtn {
          background: rgba(255, 255, 255, 0.8);
          color: var(--alojaya-text);
          border: 1px solid rgba(15, 23, 42, 0.1);
        }

        .alojaya-note {
          border-radius: 0.95rem;
          background: rgba(108, 99, 255, 0.08);
          color: #3f3bb1;
          padding: 0.8rem 0.9rem;
          font-size: 0.92rem;
          line-height: 1.5;
        }

        .alojaya-loginCard__hint {
          padding: 0.95rem 1rem;
          border-radius: 1rem;
          background: rgba(15, 23, 42, 0.04);
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          font-size: 0.9rem;
          color: var(--alojaya-muted);
        }

        .alojaya-loginCard__hint strong {
          color: var(--alojaya-text);
          font-size: 1rem;
        }

        .alojaya-highlights {
          margin-top: 1rem;
          border-radius: 1.75rem;
          padding: 0.9rem;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.75rem;
        }

        .alojaya-highlight {
          border-radius: 1.15rem;
          padding: 0.95rem 1rem;
          font-weight: 700;
          color: #4338ca;
          background: rgba(255, 255, 255, 0.88);
          text-align: center;
        }

        .alojaya-section {
          margin-top: 1rem;
          border-radius: 2rem;
          padding: 1.4rem;
        }

        .alojaya-section__head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .alojaya-section__eyebrow {
          margin: 0 0 0.35rem;
          color: var(--alojaya-accent);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.78rem;
        }

        .alojaya-section__head h2 {
          margin: 0;
          font-size: clamp(1.4rem, 2.5vw, 2.2rem);
          letter-spacing: -0.04em;
        }

        .alojaya-moreLink {
          white-space: nowrap;
          text-decoration: none;
          color: var(--alojaya-text);
          font-weight: 700;
          padding: 0.75rem 1rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(15, 23, 42, 0.08);
        }

        .alojaya-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
        }

        .alojaya-card {
          border-radius: 1.6rem;
          overflow: hidden;
          background: #fff;
        }

        .alojaya-card__media {
          position: relative;
          aspect-ratio: 1 / 1.05;
          overflow: hidden;
        }

        .alojaya-card__media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
        }

        .alojaya-card:hover .alojaya-card__media img {
          transform: scale(1.03);
        }

        .alojaya-card__tag {
          position: absolute;
          top: 0.8rem;
          left: 0.8rem;
          background: rgba(255, 255, 255, 0.84);
          color: #3f3f46;
        }

        .alojaya-card__heart {
          position: absolute;
          top: 0.6rem;
          right: 0.6rem;
          width: 2.4rem;
          height: 2.4rem;
          border: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.86);
          color: var(--alojaya-text);
          cursor: pointer;
        }

        .alojaya-card__body {
          padding: 1rem 1rem 1.1rem;
        }

        .alojaya-card__body h3 {
          margin: 0;
          font-size: 1.03rem;
          line-height: 1.35;
        }

        .alojaya-card__body p {
          margin: 0.4rem 0 0.75rem;
          color: var(--alojaya-muted);
          font-size: 0.92rem;
          line-height: 1.5;
          min-height: 2.9rem;
        }

        .alojaya-card__meta,
        .alojaya-card__price {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .alojaya-card__meta {
          padding-top: 0.15rem;
          color: var(--alojaya-muted);
          font-size: 0.88rem;
        }

        .alojaya-card__price {
          margin-top: 0.55rem;
          color: var(--alojaya-text);
        }

        .alojaya-card__price strong {
          font-size: 1rem;
        }

        .alojaya-card__price span {
          color: var(--alojaya-muted);
        }

        @media (max-width: 1080px) {
          .alojaya-hero {
            grid-template-columns: 1fr;
          }

          .alojaya-grid,
          .alojaya-highlights {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .alojaya-topbar {
            flex-wrap: wrap;
            justify-content: center;
          }

          .alojaya-tabs {
            order: 3;
            width: 100%;
            justify-content: center;
          }

          .alojaya-hero__copy,
          .alojaya-loginCard,
          .alojaya-section {
            border-radius: 1.4rem;
          }

          .alojaya-search {
            grid-template-columns: 1fr;
            border-radius: 1.5rem;
            padding: 0.75rem;
          }

          .alojaya-search__divider {
            display: none;
          }

          .alojaya-search__btn {
            width: 100%;
            border-radius: 1rem;
            height: 3.2rem;
          }

          .alojaya-stats,
          .alojaya-grid,
          .alojaya-highlights {
            grid-template-columns: 1fr;
          }

          .alojaya-section__head {
            align-items: start;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
