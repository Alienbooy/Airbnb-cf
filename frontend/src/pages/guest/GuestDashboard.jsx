import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, MessageCircle, Plane, Search, XCircle } from 'lucide-react';
import DashboardShell from '../../components/layout/DashboardShell';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import ListingCard from '../../components/listings/ListingCard';
import { money, shortDate, statusLabel } from '../../utils/formatters';
import { listingService } from '../../services/listings/listingService';
import { reservationService } from '../../services/reservations/reservationService';
import mockData from '../../mocks/api-mocks.json';
import styles from './GuestPages.module.css';

function toneForStatus(status) {
  if (['confirmed', 'paid', 'completed', 'active'].includes(status)) return 'success';
  if (['pending'].includes(status)) return 'warning';
  if (['cancelled', 'failed', 'rejected', 'refunded'].includes(status)) return 'error';
  return 'neutral';
}

export default function GuestDashboard() {
  const [reservations, setReservations] = useState([]);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [cancellingId, setCancellingId] = useState('');
  const messages = mockData.messages;
  const pendingPayments = reservations.filter((reservation) => reservation.paymentStatus === 'pending');

  async function loadDashboard() {
    setLoading(true);
    setLoadError('');

    try {
      const listings = await listingService.listListings();
      const myReservations = await reservationService.getMyReservations(listings);
      setReservations(myReservations);
      setSaved([]);
    } catch (error) {
      setLoadError(error.response?.data?.message || 'No se pudo cargar tu panel de reservas.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function cancelReservation(id) {
    setCancellingId(id);
    setActionError('');

    try {
      const cancelled = await reservationService.cancelReservation(id);
      setReservations((current) => current.map((reservation) => (
        reservation.id === id
          ? { ...reservation, status: cancelled.status, paymentStatus: cancelled.paymentStatus }
          : reservation
      )));
    } catch (error) {
      setActionError(error.response?.data?.message || 'No se pudo cancelar la reserva.');
    } finally {
      setCancellingId('');
    }
  }

  return (
    <DashboardShell
      role="guest"
      eyebrow="Panel de huesped"
      title="Tus viajes y reservas"
      subtitle="Revisa proximas estadias, pagos pendientes, favoritos y mensajes de anfitriones."
      actions={(
        <Button as={Link} to="/listings">
          <Search size={18} /> Buscar alojamiento
        </Button>
      )}
    >
      <section className={styles.statsGrid}>
        <StatCard label="Reservas" value={reservations.length} />
        <StatCard label="Favoritos" value={saved.length} />
        <StatCard label="Pagos pendientes" value={pendingPayments.length} />
        <StatCard label="Mensajes" value={messages.length} />
      </section>

      {loadError && <p className={styles.error}>{loadError}</p>}
      {actionError && <p className={styles.error}>{actionError}</p>}

      <section className={styles.dashboardGrid}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Proximos viajes</h2>
            <Badge tone="accent"><Plane size={14} /> Activos</Badge>
          </div>

          <div className={styles.reservationList}>
            {loading && <p className={styles.muted}>Cargando reservas...</p>}

            {!loading && reservations.length === 0 && (
              <p className={styles.muted}>Todavia no tienes reservas registradas.</p>
            )}

            {!loading && reservations.map((reservation) => (
              <article key={reservation.id} className={styles.reservation}>
                <img src={reservation.coverImage} alt={reservation.listingTitle} />
                <div>
                  <h3>{reservation.listingTitle}</h3>
                  <p className={styles.muted}>
                    {reservation.city || 'Destino'} - {shortDate(reservation.checkIn)} a {shortDate(reservation.checkOut)}
                  </p>
                  <p className={styles.muted}>
                    {reservation.guests} huespedes - {reservation.nights} noches
                  </p>
                  <div className={styles.rowActions}>
                    <Badge tone={toneForStatus(reservation.status)}>{statusLabel(reservation.status)}</Badge>
                    <Badge tone={toneForStatus(reservation.paymentStatus)}>
                      <CreditCard size={13} /> {statusLabel(reservation.paymentStatus)}
                    </Badge>
                  </div>
                  <div className={styles.rowActions}>
                    <Button as={Link} to={`/listings/${reservation.listingId}`} variant="secondary" size="small">Ver alojamiento</Button>
                    <Button type="button" variant="ghost" size="small"><MessageCircle size={15} /> Contactar</Button>
                    {!['cancelled', 'completed', 'rejected'].includes(reservation.status) && (
                      <Button
                        type="button"
                        variant="danger"
                        size="small"
                        disabled={cancellingId === reservation.id}
                        onClick={() => cancelReservation(reservation.id)}
                      >
                        <XCircle size={15} /> {cancellingId === reservation.id ? 'Cancelando...' : 'Cancelar'}
                      </Button>
                    )}
                  </div>
                </div>
                <strong>{money(reservation.total, reservation.currency)}</strong>
              </article>
            ))}
          </div>
        </article>

        <aside className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Mensajes</h2>
            <Badge tone="neutral">{messages.filter((message) => message.unread).length} nuevos</Badge>
          </div>

          <div className={styles.messageList}>
            {messages.map((message) => (
              <article key={message.id} className={styles.message}>
                <img className={styles.messageAvatar} src={message.avatar} alt={message.from} />
                <div>
                  <h3>{message.subject}</h3>
                  <p className={styles.muted}>{message.preview}</p>
                  <p className={styles.muted}>{shortDate(message.createdAt)}</p>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className={`${styles.panel} ${styles.spacedPanel}`}>
        <div className={styles.panelHeader}>
          <h2>Favoritos guardados</h2>
          <Button as={Link} to="/listings" variant="secondary" size="small">Explorar mas</Button>
        </div>
        {saved.length ? (
          <div className={styles.savedGrid}>
            {saved.map((listing) => (
              <ListingCard key={listing.id} listing={listing} compact saved />
            ))}
          </div>
        ) : (
          <p className={styles.muted}>Aun no hay favoritos guardados en este navegador.</p>
        )}
      </section>
    </DashboardShell>
  );
}
