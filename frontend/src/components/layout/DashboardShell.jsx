import { NavLink } from 'react-router-dom';
import { BarChart3, BedDouble, CalendarDays, Home, PlusCircle } from 'lucide-react';
import AppShell from './AppShell';
import styles from './Layout.module.css';

const navByRole = {
  guest: [
    { to: '/dashboard', label: 'Mis viajes', icon: CalendarDays },
    { to: '/listings', label: 'Explorar', icon: Home },
  ],
  host: [
    { to: '/host', label: 'Resumen', icon: BarChart3 },
    { to: '/host/listings', label: 'Anuncios', icon: BedDouble },
    { to: '/host/listings/new', label: 'Crear anuncio', icon: PlusCircle },
  ],
  admin: [
    { to: '/admin', label: 'General', icon: BarChart3 },
    { to: '/listings', label: 'Catalogo', icon: CalendarDays },
  ],
};

export default function DashboardShell({ role = 'guest', eyebrow, title, subtitle, actions, children }) {
  const items = navByRole[role] || navByRole.guest;

  return (
    <AppShell showFooter={false}>
      <div className={styles.dashboard}>
        <aside className={styles.sidebar} aria-label="Navegacion del panel">
          <div className={styles.sidebarTitle}>{role === 'host' ? 'Anfitrion' : role === 'admin' ? 'Admin' : 'Huesped'}</div>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) => `${styles.sideLink} ${isActive ? styles.sideActive : ''}`}
              >
                <Icon size={17} />
                {item.label}
              </NavLink>
            );
          })}
        </aside>

        <main className={styles.mainPanel}>
          <header className={styles.dashboardHeader}>
            <div>
              {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
              <h1>{title}</h1>
              {subtitle && <p>{subtitle}</p>}
            </div>
            {actions}
          </header>
          {children}
        </main>
      </div>
    </AppShell>
  );
}
