import { Link } from 'react-router-dom';
import { CreditCard, MessageCircle, Plane, Search, XCircle } from 'lucide-react';
import DashboardShell from '../../components/layout/DashboardShell';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import ListingCard from '../../components/listings/ListingCard';
import { money, shortDate, statusLabel } from '../../utils/formatters';
import mockData from '../../mocks/api-mocks.json';
import styles from './GuestPages.module.css';

function toneForStatus(status) {
  if (['confirmed', 'paid', 'completed', 'active'].includes(status)) return 'success';
  if (['pending'].includes(status)) return 'warning';
  if (['cancelled', 'failed', 'rejected'].includes(status)) return 'error';
  return 'neutral';
}

export default function GuestDashboard() {
  const reservations = mockData.reservations.summaryResponse;
  const payments = mockData.payments.summaryResponse;
  const saved = mockData.listings.summaryResponse.filter((listing) => mockData.savedListings.includes(listing.id));
  const pendingPayments = payments.filter((payment) => payment.status === 'pending');

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
        <StatCard label="Mensajes" value={mockData.messages.length} />
      </section>

      <section className={styles.dashboardGrid}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Proximos viajes</h2>
            <Badge tone="accent"><Plane size={14} /> Activos</Badge>
          </div>

          <div className={styles.reservationList}>
            {reservations.map((reservation) => {
              const payment = payments.find((item) => item.reservationId === reservation.id);
              return (
                <article key={reservation.id} className={styles.reservation}>
                  <img src={reservation.coverImage} alt={reservation.listingTitle} />
                  <div>
                    <h3>{reservation.listingTitle}</h3>
                    <p className={styles.muted}>
                      {reservation.city} - {shortDate(reservation.checkIn)} a {shortDate(reservation.checkOut)}
                    </p>
                    <p className={styles.muted}>
                      {reservation.guests} huespedes - {reservation.nights} noches
                    </p>
                    <div className={styles.rowActions}>
                      <Badge tone={toneForStatus(reservation.status)}>{statusLabel(reservation.status)}</Badge>
                      <Badge tone={toneForStatus(payment?.status)}><CreditCard size={13} /> {statusLabel(payment?.status || 'pending')}</Badge>
                    </div>
                    <div className={styles.rowActions}>
                      <Button as={Link} to={`/listings/${reservation.listingId}`} variant="secondary" size="small">Ver alojamiento</Button>
                      {payment?.status === 'pending' && <Button type="button" size="small">Pagar pendiente</Button>}
                      <Button type="button" variant="ghost" size="small"><MessageCircle size={15} /> Contactar</Button>
                      <Button type="button" variant="danger" size="small"><XCircle size={15} /> Cancelar</Button>
                    </div>
                  </div>
                  <strong>{money(reservation.total, reservation.currency)}</strong>
                </article>
              );
            })}
          </div>
        </article>

        <aside className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Mensajes</h2>
            <Badge tone="neutral">{mockData.messages.filter((message) => message.unread).length} nuevos</Badge>
          </div>

          <div className={styles.messageList}>
            {mockData.messages.map((message) => (
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
        <div className={styles.savedGrid}>
          {saved.map((listing) => (
            <ListingCard key={listing.id} listing={listing} compact saved />
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
