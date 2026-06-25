import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, CheckCircle2, PlusCircle, XCircle } from 'lucide-react';
import DashboardShell from '../../components/layout/DashboardShell';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import { money, shortDate, statusLabel } from '../../utils/formatters';
import { listingService } from '../../services/listings/listingService';
import { reservationService } from '../../services/reservations/reservationService';
import styles from './HostPages.module.css';

function calendarTone(status) {
  if (['booked', 'confirmed', 'completed'].includes(status)) return 'success';
  if (status === 'pending') return 'warning';
  if (['cancelled', 'rejected'].includes(status)) return 'error';
  return 'neutral';
}

function monthKey(value) {
  const date = value ? new Date(value) : new Date();
  return `${date.getFullYear()}-${date.getMonth()}`;
}

export default function HostDashboard() {
  const [listings, setListings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionId, setActionId] = useState('');

  async function loadDashboard() {
    setLoading(true);
    setLoadError('');

    try {
      const hostListings = await listingService.getHostListings();
      const hostReservations = await reservationService.getHostReservations(hostListings);
      setListings(hostListings);
      setReservations(hostReservations);
    } catch (error) {
      setLoadError(error.response?.data?.message || 'No se pudo cargar el panel de anfitrion.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const kpis = useMemo(() => {
    const currentMonth = monthKey(new Date());
    const monthlyReservations = reservations.filter((reservation) => monthKey(reservation.checkIn) === currentMonth);
    const monthlyNights = monthlyReservations.reduce((sum, reservation) => sum + reservation.nights, 0);
    const confirmedRevenue = monthlyReservations
      .filter((reservation) => ['confirmed', 'completed'].includes(reservation.status))
      .reduce((sum, reservation) => sum + reservation.total, 0);
    const occupancyBase = Math.max(1, listings.length * 30);
    const averageRating = listings.length
      ? (listings.reduce((sum, listing) => sum + Number(listing.rating || 0), 0) / listings.length).toFixed(1)
      : '0.0';

    return {
      activeListings: listings.filter((listing) => listing.status === 'active').length,
      monthlyBookings: monthlyReservations.length,
      occupancyRate: Math.min(100, Math.round((monthlyNights / occupancyBase) * 100)),
      monthlyRevenue: confirmedRevenue,
      averageRating,
    };
  }, [listings, reservations]);

  const calendar = useMemo(() => (
    [...reservations]
      .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn))
      .slice(0, 6)
  ), [reservations]);

  async function updateReservation(id, action) {
    setActionId(id);
    setActionError('');

    try {
      const updated = action === 'confirm'
        ? await reservationService.confirmReservation(id)
        : await reservationService.rejectReservation(id);

      setReservations((current) => current.map((reservation) => (
        reservation.id === id
          ? { ...reservation, status: updated.status, paymentStatus: updated.paymentStatus }
          : reservation
      )));
    } catch (error) {
      setActionError(error.response?.data?.message || 'No se pudo actualizar la reserva.');
    } finally {
      setActionId('');
    }
  }

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

      {loadError && <p className={styles.error}>{loadError}</p>}
      {actionError && <p className={styles.error}>{actionError}</p>}

      <section className={styles.layout}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Tus alojamientos</h2>
            <Button as={Link} to="/host/listings" variant="secondary" size="small">Gestionar</Button>
          </div>

          <div className={styles.propertyGrid}>
            {loading && <p className={styles.muted}>Cargando alojamientos...</p>}
            {!loading && listings.length === 0 && <p className={styles.muted}>Todavia no tienes publicaciones.</p>}
            {!loading && listings.slice(0, 4).map((listing) => (
              <Link key={listing.id} to={`/listings/${listing.id}`} className={styles.propertyItem}>
                <img src={listing.coverImage} alt={listing.title} />
                <div>
                  <h3>{listing.title}</h3>
                  <p className={styles.muted}>{listing.city} - {money(listing.pricePerNight, listing.currency)} noche</p>
                  <Badge tone={listing.status === 'active' ? 'success' : calendarTone(listing.status)}>{statusLabel(listing.status)}</Badge>
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
            {loading && <p className={styles.muted}>Cargando reservas...</p>}
            {!loading && calendar.length === 0 && <p className={styles.muted}>No hay reservas para mostrar.</p>}
            {!loading && calendar.map((item) => (
              <article key={item.id} className={styles.calendarItem}>
                <h3>{shortDate(item.checkIn)} a {shortDate(item.checkOut)}</h3>
                <p className={styles.muted}>{item.listingTitle}</p>
                <Badge tone={calendarTone(item.status)}>{statusLabel(item.status)}</Badge>
                {item.status === 'pending' && (
                  <div className={styles.actions}>
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      disabled={actionId === item.id}
                      onClick={() => updateReservation(item.id, 'confirm')}
                    >
                      <CheckCircle2 size={15} /> Confirmar
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      size="small"
                      disabled={actionId === item.id}
                      onClick={() => updateReservation(item.id, 'reject')}
                    >
                      <XCircle size={15} /> Rechazar
                    </Button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </aside>
      </section>
    </DashboardShell>
  );
}
