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
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
    setError('');
  }

  async function submit(e) {
    e.preventDefault();
    try {
      const data = await login(form);
      if (data.user.role === 'admin') navigate('/admin');
      else if (data.user.role === 'host') navigate('/host');
      else navigate('/dashboard');
    } catch {
      setError('Username o password incorrectos.');
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <span className={styles.logo}>⌂</span>
          <span className={styles.logoName}>StayBnb</span>
        </div>
        <div className={styles.heroText}>
          <h1>Descubre espacios unicos en cada destino.</h1>
          <p>Inicia sesion con tu cuenta real del microservicio auth.</p>
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
            <p>Usa tu email y password para continuar.</p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={submit} className={styles.form} noValidate>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
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
              <label htmlFor="password">Password</label>
              <div className={styles.inputWrap}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="********"
                  value={form.password}
                  onChange={handle}
                  required
                  autoComplete="current-password"
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPass((current) => !current)} aria-label="Mostrar password">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Iniciar sesion'}
            </button>
          </form>

          <p className={styles.switchLink}>
            No tienes cuenta? <Link to="/register">Registrate gratis</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
