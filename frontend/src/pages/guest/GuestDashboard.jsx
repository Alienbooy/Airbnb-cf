import { Link } from 'react-router-dom';
import mockData from '../../mocks/api-mocks.json';

export default function GuestDashboard() {
  const reservations = mockData.reservations.summaryResponse;
  const saved = mockData.listings.summaryResponse.filter((listing) => mockData.savedListings.includes(listing.id));

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <div>
          <span style={styles.eyebrow}>Dashboard huesped</span>
          <h1 style={styles.title}>Tus viajes, pagos y favoritos desde JSON.</h1>
        </div>
        <Link to="/listings" style={styles.button}>Buscar alojamiento</Link>
      </section>

      <section style={styles.stats}>
        <Stat label="Reservas" value={reservations.length} />
        <Stat label="Favoritos" value={saved.length} />
        <Stat label="Pagos" value={mockData.payments.summaryResponse.length} />
        <Stat label="Mensajes" value={mockData.messages.length} />
      </section>

      <section style={styles.layout}>
        <div style={styles.panel}>
          <h2 style={styles.sectionTitle}>Proximas reservas</h2>
          <div style={styles.list}>
            {reservations.map((reservation) => (
              <article key={reservation.id} style={styles.trip}>
                <img src={reservation.coverImage} alt={reservation.listingTitle} style={styles.tripImage} />
                <div>
                  <strong>{reservation.listingTitle}</strong>
                  <p style={styles.muted}>{reservation.city} · {reservation.checkIn} a {reservation.checkOut}</p>
                  <p style={styles.muted}>{reservation.guests} huespedes · {reservation.status} · pago {reservation.paymentStatus}</p>
                </div>
                <strong>${reservation.total}</strong>
              </article>
            ))}
          </div>
        </div>

        <aside style={styles.panel}>
          <h2 style={styles.sectionTitle}>Mensajes</h2>
          {mockData.messages.map((message) => (
            <div key={message.id} style={styles.message}>
              <img src={message.avatar} alt={message.from} style={styles.avatar} />
              <div>
                <strong>{message.subject}</strong>
                <p style={styles.muted}>{message.preview}</p>
              </div>
            </div>
          ))}
        </aside>
      </section>

      <section style={styles.panel}>
        <h2 style={styles.sectionTitle}>Favoritos guardados</h2>
        <div style={styles.savedGrid}>
          {saved.map((listing) => (
            <Link key={listing.id} to={`/listings/${listing.id}`} style={styles.savedCard}>
              <img src={listing.coverImage} alt={listing.title} style={styles.savedImage} />
              <strong>{listing.title}</strong>
              <span style={styles.muted}>{listing.city} · ${listing.pricePerNight}/noche</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.stat}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f7f7f2', color: '#172026', padding: 28 },
  header: { maxWidth: 1180, margin: '0 auto 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 18 },
  eyebrow: { color: '#d64b6a', fontWeight: 800, textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 },
  title: { margin: '8px 0 0', fontSize: 42, lineHeight: 1.05 },
  button: { textDecoration: 'none', background: '#172026', color: '#fff', padding: '12px 16px', borderRadius: 8, fontWeight: 800 },
  stats: { maxWidth: 1180, margin: '0 auto 18px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 },
  stat: { background: '#fff', border: '1px solid #e8e3dc', borderRadius: 8, padding: 18, display: 'grid', gap: 4 },
  layout: { maxWidth: 1180, margin: '0 auto 18px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 18 },
  panel: { maxWidth: 1180, margin: '0 auto 18px', background: '#fff', border: '1px solid #e8e3dc', borderRadius: 8, padding: 20 },
  sectionTitle: { margin: '0 0 14px', fontSize: 22 },
  list: { display: 'grid', gap: 12 },
  trip: { display: 'grid', gridTemplateColumns: '96px 1fr auto', gap: 14, alignItems: 'center', border: '1px solid #ece7df', borderRadius: 8, padding: 12 },
  tripImage: { width: 96, height: 76, objectFit: 'cover', borderRadius: 6 },
  muted: { margin: 0, color: '#64727d' },
  message: { display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid #ece7df' },
  avatar: { width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' },
  savedGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 },
  savedCard: { color: 'inherit', textDecoration: 'none', display: 'grid', gap: 8 },
  savedImage: { width: '100%', aspectRatio: '1.4 / 1', objectFit: 'cover', borderRadius: 8 },
};
