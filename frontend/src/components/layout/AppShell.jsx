import { Link, NavLink } from 'react-router-dom';
import { Home, LogOut, Menu, Shield, UserRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import styles from './Layout.module.css';

function dashboardPath(role) {
  if (role === 'admin') return '/admin';
  if (role === 'host') return '/host';
  return '/dashboard';
}

export default function AppShell({ children, showFooter = true }) {
  const { user, logout } = useAuth();

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link to="/" className={styles.brand} aria-label="StayBnb inicio">
            <span className={styles.brandMark}><Home size={19} /></span>
            <span>StayBnb</span>
          </Link>

          <nav className={styles.nav} aria-label="Navegacion principal">
            <NavLink to="/" end className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              Inicio
            </NavLink>
            <NavLink to="/listings" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              Alojamientos
            </NavLink>
            {user && (
              <NavLink to={dashboardPath(user.role)} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
                Mi panel
              </NavLink>
            )}
          </nav>

          <div className={styles.right}>
            {user ? (
              <>
                <Link to={dashboardPath(user.role)} className={styles.userPill}>
                  <img className={styles.avatar} src={user.avatar} alt={user.name || user.email} />
                  <span>{user.name || user.email}</span>
                </Link>
                <Button variant="ghost" size="small" onClick={logout} aria-label="Cerrar sesion">
                  <LogOut size={17} />
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="ghost" size="small">
                  <UserRound size={17} /> Ingresar
                </Button>
                <Button as={Link} to="/register" variant="secondary" size="small">
                  <Menu size={17} /> Registrarse
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className={styles.content}>{children}</div>
      {showFooter && <Footer />}
    </div>
  );
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <strong>StayBnb</strong>
        <div className={styles.footerLinks}>
          <a href="#legal">Terminos</a>
          <a href="#privacy">Privacidad</a>
          <a href="#support">Soporte</a>
          <a href="#trust">Confianza y seguridad</a>
        </div>
        <span>Plataforma de reservas premium</span>
      </div>
    </footer>
  );
}

export function roleIcon(role) {
  if (role === 'admin') return <Shield size={17} />;
  return <UserRound size={17} />;
}
