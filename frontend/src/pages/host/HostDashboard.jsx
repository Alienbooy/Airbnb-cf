import { Link } from 'react-router-dom';
import { CalendarDays, PlusCircle } from 'lucide-react';
import DashboardShell from '../../components/layout/DashboardShell';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import { money, shortDate, statusLabel } from '../../utils/formatters';
import mockData from '../../mocks/api-mocks.json';
import styles from './HostPages.module.css';

function calendarTone(status) {
  if (status === 'booked') return 'success';
  if (status === 'pending') return 'warning';
  return 'neutral';
}

export default function HostDashboard() {
  const kpis = mockData.host.dashboardResponse.kpis;
  const listings = mockData.listings.summaryResponse;
  const calendar = mockData.host.dashboardResponse.calendar;

  return (
    <DashboardShell
      role="host"
      eyebrow="Panel de anfitrion"
      title="Gestiona tus publicaciones"
      subtitle="Monitorea ocupacion, ingresos, reservas proximas y rendimiento de tus alojamientos."
      actions={(
        <Button as={Link} to="/host/listings/new">
          <PlusCircle size={18} /> Nueva publicacion
        </Button>
      )}
    >
      <section className={styles.statsGrid}>
        <StatCard label="Publicaciones activas" value={kpis.activeListings} />
        <StatCard label="Reservas del mes" value={kpis.monthlyBookings} />
        <StatCard label="Ocupacion" value={`${kpis.occupancyRate}%`} />
        <StatCard label="Ingresos" value={money(kpis.monthlyRevenue)} />
        <StatCard label="Rating promedio" value={kpis.averageRating} />
      </section>

      <section className={styles.layout}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Tus alojamientos</h2>
            <Button as={Link} to="/host/listings" variant="secondary" size="small">Gestionar</Button>
          </div>

          <div className={styles.propertyGrid}>
            {listings.slice(0, 4).map((listing) => (
              <Link key={listing.id} to={`/listings/${listing.id}`} className={styles.propertyItem}>
                <img src={listing.coverImage} alt={listing.title} />
                <div>
                  <h3>{listing.title}</h3>
                  <p className={styles.muted}>{listing.city} - {money(listing.pricePerNight, listing.currency)} noche</p>
                  <Badge tone={listing.status === 'active' ? 'success' : 'warning'}>{statusLabel(listing.status)}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </article>

        <aside className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Calendario</h2>
            <CalendarDays size={20} />
          </div>
          <div className={styles.calendarList}>
            {calendar.map((item) => (
              <article key={`${item.date}-${item.listing}`} className={styles.calendarItem}>
                <h3>{shortDate(item.date)}</h3>
                <p className={styles.muted}>{item.listing}</p>
                <Badge tone={calendarTone(item.status)}>{statusLabel(item.status)}</Badge>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </DashboardShell>
  );
}
