import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  function handle(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  }

  async function submit(e) {
    e.preventDefault();
    try {
      const data = await login(form);
      if (data.user.role === 'admin') navigate('/admin');
      else if (data.user.role === 'host') navigate('/host');
      else navigate('/');
    } catch {
      setError('Correo o contraseña incorrectos.');
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <span className={styles.logo}>⬡</span>
          <span className={styles.logoName}>StayBnb</span>
        </div>
        <div className={styles.heroText}>
          <h1>Descubre espacios únicos en cada rincón.</h1>
          <p>Miles de anfitriones esperan compartir su hogar contigo.</p>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.stat}><strong>10K+</strong><span>Alojamientos</span></div>
          <div className={styles.stat}><strong>50K+</strong><span>Viajeros</span></div>
          <div className={styles.stat}><strong>120</strong><span>Ciudades</span></div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Bienvenido de vuelta</h2>
            <p>Inicia sesión para continuar</p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={submit} className={styles.form} noValidate>
            <div className={styles.field}>
              <label htmlFor="email">Correo electrónico</label>
              <div className={styles.inputWrap}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 6.5L22 7"/></svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={handle}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Contraseña</label>
              <div className={styles.inputWrap}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handle}
                  required
                  autoComplete="current-password"
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPass((p) => !p)} aria-label="Mostrar contraseña">
                  {showPass
                    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              <Link to="/forgot-password" className={styles.forgot}>¿Olvidaste tu contraseña?</Link>
            </div>

            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? <span className={styles.spinner}/> : 'Iniciar sesión'}
            </button>
          </form>

          <div className={styles.divider}><span>o continúa con</span></div>

          <div className={styles.socialRow}>
            <button className={styles.socialBtn}>
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button className={styles.socialBtn}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>

          <p className={styles.switchLink}>
            ¿No tienes cuenta? <Link to="/register">Regístrate gratis</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
