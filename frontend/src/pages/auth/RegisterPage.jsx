import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'guest' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  function handle(e) {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '', general: '' }));
  }

  function validate() {
    const nextErrors = {};
    if (form.username.trim().length < 3) nextErrors.username = 'Minimo 3 caracteres';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) nextErrors.email = 'Correo invalido';
    if (form.password.length < 8) nextErrors.password = 'Minimo 8 caracteres';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submit(e) {
    e.preventDefault();
    if (!validate()) return;

    try {
      await register(form);
      alert('Cuenta creada exitosamente. Por favor, inicia sesion para continuar.');
      navigate('/login');
    } catch {
      setErrors({ general: 'No se pudo crear la cuenta.' });
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <span className={styles.logo}>S</span>
          <span className={styles.logoName}>StayBnb</span>
        </div>
        <div className={styles.heroText}>
          <h1>Crea tu cuenta para reservar alojamientos.</h1>
          <p>Solo necesitas username, email y password para empezar.</p>
        </div>
        <div className={styles.benefitsList}>
          <div className={styles.benefit}><span className={styles.checkMark}>OK</span> Explora alojamientos destacados</div>
          <div className={styles.benefit}><span className={styles.checkMark}>OK</span> Guarda favoritos y reservas</div>
          <div className={styles.benefit}><span className={styles.checkMark}>OK</span> Acceso inmediato al dashboard</div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Registrarse</h2>
            <p>Completa los datos basicos de tu cuenta.</p>
          </div>

          {errors.general && <div className={styles.error}>{errors.general}</div>}

          <form onSubmit={submit} className={styles.form} noValidate>
            <div className={styles.field}>
              <label htmlFor="username">Username</label>
              <div className={styles.inputWrap}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>
                <input
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={handle}
                  placeholder="ana_garcia"
                  className={errors.username ? styles.inputError : ''}
                  autoComplete="username"
                />
              </div>
              {errors.username && <span className={styles.fieldError}>{errors.username}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputWrap}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 6.5L22 7"/></svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handle}
                  placeholder="tu@correo.com"
                  className={errors.email ? styles.inputError : ''}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWrap}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handle}
                  placeholder="Minimo 8 caracteres"
                  className={errors.password ? styles.inputError : ''}
                  autoComplete="new-password"
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPass((current) => !current)} aria-label="Mostrar password">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
              {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="role">Tipo de cuenta</label>
              <div className={styles.inputWrap}>
                <select id="role" name="role" value={form.role} onChange={handle}>
                  <option value="guest">Huesped</option>
                  <option value="host">Anfitrion</option>
                </select>
              </div>
            </div>

            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Crear cuenta'}
            </button>
          </form>

          <p className={styles.switchLink}>
            Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
