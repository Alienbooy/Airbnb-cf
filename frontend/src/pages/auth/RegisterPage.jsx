import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';

const ROLES = [
  { value: 'guest', label: 'Soy viajero', icon: '🧳', desc: 'Busca y reserva alojamientos' },
  { value: 'host', label: 'Soy anfitrión', icon: '🏠', desc: 'Publica y gestiona propiedades' },
];

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', confirmPassword: '', role: 'guest',
  });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  function handle(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: '' }));
  }

  function validateStep1() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Requerido';
    if (!form.lastName.trim()) e.lastName = 'Requerido';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Correo inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e = {};
    if (form.password.length < 8) e.password = 'Mínimo 8 caracteres';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function nextStep() {
    if (step === 1 && !validateStep1()) return;
    setStep((s) => s + 1);
  }

  async function submit(e) {
    e.preventDefault();
    if (!validateStep2()) return;
    try {
      await register(form);
      if (form.role === 'host') navigate('/host');
      else navigate('/');
    } catch {
      setErrors({ general: 'El correo ya está registrado.' });
    }
  }

  const progress = (step / 3) * 100;

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <span className={styles.logo}>⬡</span>
          <span className={styles.logoName}>StayBnb</span>
        </div>
        <div className={styles.heroText}>
          <h1>Únete a nuestra comunidad de viajeros.</h1>
          <p>Registrarte es gratis y solo toma un minuto.</p>
        </div>
        <div className={styles.benefitsList}>
          <div className={styles.benefit}><span className={styles.checkMark}>✓</span> Acceso a miles de alojamientos</div>
          <div className={styles.benefit}><span className={styles.checkMark}>✓</span> Reservas seguras y confirmadas</div>
          <div className={styles.benefit}><span className={styles.checkMark}>✓</span> Soporte 24/7 para viajeros</div>
          <div className={styles.benefit}><span className={styles.checkMark}>✓</span> Sin costos de registro</div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.stepIndicator}>Paso {step} de 3</div>

          <div className={styles.cardHeader}>
            <h2>
              {step === 1 && 'Tus datos personales'}
              {step === 2 && 'Elige tu contraseña'}
              {step === 3 && '¿Cómo usarás StayBnb?'}
            </h2>
          </div>

          {errors.general && <div className={styles.error}>{errors.general}</div>}

          <form onSubmit={step === 3 ? submit : (e) => { e.preventDefault(); nextStep(); }} className={styles.form} noValidate>

            {step === 1 && (
              <>
                <div className={styles.row2}>
                  <div className={styles.field}>
                    <label htmlFor="firstName">Nombre</label>
                    <input id="firstName" name="firstName" value={form.firstName} onChange={handle} placeholder="Juan" className={errors.firstName ? styles.inputError : ''} />
                    {errors.firstName && <span className={styles.fieldError}>{errors.firstName}</span>}
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="lastName">Apellido</label>
                    <input id="lastName" name="lastName" value={form.lastName} onChange={handle} placeholder="Pérez" className={errors.lastName ? styles.inputError : ''} />
                    {errors.lastName && <span className={styles.fieldError}>{errors.lastName}</span>}
                  </div>
                </div>
                <div className={styles.field}>
                  <label htmlFor="email">Correo electrónico</label>
                  <div className={styles.inputWrap}>
                    <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 6.5L22 7"/></svg>
                    <input id="email" name="email" type="email" value={form.email} onChange={handle} placeholder="tu@correo.com" className={errors.email ? styles.inputError : ''} />
                  </div>
                  {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                </div>
                <button type="submit" className={styles.btnPrimary}>Continuar →</button>
              </>
            )}

            {step === 2 && (
              <>
                <div className={styles.field}>
                  <label htmlFor="password">Contraseña</label>
                  <div className={styles.inputWrap}>
                    <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <input id="password" name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handle} placeholder="Mínimo 8 caracteres" className={errors.password ? styles.inputError : ''} />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(p => !p)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </div>
                  {form.password && (
                    <div className={styles.strengthBar}>
                      <div className={`${styles.strengthFill} ${
                        form.password.length < 6 ? styles.weak :
                        form.password.length < 10 ? styles.medium : styles.strong
                      }`} style={{ width: `${Math.min((form.password.length / 12) * 100, 100)}%` }} />
                    </div>
                  )}
                  {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
                </div>
                <div className={styles.field}>
                  <label htmlFor="confirmPassword">Confirmar contraseña</label>
                  <div className={styles.inputWrap}>
                    <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 6L9 17l-5-5"/></svg>
                    <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handle} placeholder="Repite la contraseña" className={errors.confirmPassword ? styles.inputError : ''} />
                  </div>
                  {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword}</span>}
                </div>
                <div className={styles.btnRow}>
                  <button type="button" className={styles.btnSecondary} onClick={() => setStep(1)}>← Atrás</button>
                  <button type="submit" className={styles.btnPrimary}>Continuar →</button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className={styles.roleGrid}>
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      className={`${styles.roleCard} ${form.role === r.value ? styles.roleActive : ''}`}
                      onClick={() => setForm((p) => ({ ...p, role: r.value }))}
                    >
                      <span className={styles.roleIcon}>{r.icon}</span>
                      <strong>{r.label}</strong>
                      <span>{r.desc}</span>
                    </button>
                  ))}
                </div>
                <div className={styles.termsText}>
                  Al registrarte aceptas nuestros <Link to="/terms">Términos de servicio</Link> y <Link to="/privacy">Política de privacidad</Link>.
                </div>
                <div className={styles.btnRow}>
                  <button type="button" className={styles.btnSecondary} onClick={() => setStep(2)}>← Atrás</button>
                  <button type="submit" className={styles.btnPrimary} disabled={loading}>
                    {loading ? <span className={styles.spinner} /> : 'Crear cuenta'}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className={styles.switchLink}>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
