import { Link } from 'react-router-dom';
import mockData from '../../mocks/api-mocks.json';

export default function HostDashboard() {
  const kpis = mockData.host.dashboardResponse.kpis;
  const listings = mockData.listings.summaryResponse;

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <div>
          <span style={styles.eyebrow}>Panel anfitrion</span>
          <h1 style={styles.title}>Gestion mockeada de publicaciones y reservas.</h1>
        </div>
        <Link to="/host/listings/new" style={styles.button}>Nueva publicacion</Link>
      </section>

      <section style={styles.stats}>
        <Stat label="Publicaciones activas" value={kpis.activeListings} />
        <Stat label="Reservas del mes" value={kpis.monthlyBookings} />
        <Stat label="Ocupacion" value={`${kpis.occupancyRate}%`} />
        <Stat label="Ingresos" value={`$${kpis.monthlyRevenue}`} />
        <Stat label="Rating" value={kpis.averageRating} />
      </section>

      <section style={styles.layout}>
        <article style={styles.panel}>
          <h2 style={styles.sectionTitle}>Tus alojamientos</h2>
          <div style={styles.cards}>
            {listings.slice(0, 4).map((listing) => (
              <Link key={listing.id} to={`/listings/${listing.id}`} style={styles.card}>
                <img src={listing.coverImage} alt={listing.title} style={styles.cardImage} />
                <div>
                  <strong>{listing.title}</strong>
                  <p style={styles.muted}>{listing.city} · {listing.status} · ${listing.pricePerNight}/noche</p>
                </div>
              </Link>
            ))}
          </div>
        </article>

        <aside style={styles.panel}>
          <h2 style={styles.sectionTitle}>Calendario</h2>
          {mockData.host.dashboardResponse.calendar.map((item) => (
            <div key={`${item.date}-${item.listing}`} style={styles.calendarItem}>
              <strong>{item.date}</strong>
              <span>{item.listing}</span>
              <small>{item.status}</small>
            </div>
          ))}
        </aside>
      </section>
    </main>
  );
}

function Stat({ label, value }) {
  return <div style={styles.stat}><strong>{value}</strong><span>{label}</span></div>;
}

const styles = {
  page: { minHeight: '100vh', background: '#f7f7f2', color: '#172026', padding: 28 },
  header: { maxWidth: 1180, margin: '0 auto 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 18 },
  eyebrow: { color: '#d64b6a', fontWeight: 800, textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 },
  title: { margin: '8px 0 0', fontSize: 42, lineHeight: 1.05 },
  button: { textDecoration: 'none', background: '#172026', color: '#fff', padding: '12px 16px', borderRadius: 8, fontWeight: 800 },
  stats: { maxWidth: 1180, margin: '0 auto 18px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 },
  stat: { background: '#fff', border: '1px solid #e8e3dc', borderRadius: 8, padding: 18, display: 'grid', gap: 4 },
  layout: { maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 18 },
  panel: { background: '#fff', border: '1px solid #e8e3dc', borderRadius: 8, padding: 20 },
  sectionTitle: { margin: '0 0 14px', fontSize: 22 },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 },
  card: { color: 'inherit', textDecoration: 'none', border: '1px solid #ece7df', borderRadius: 8, overflow: 'hidden' },
  cardImage: { width: '100%', aspectRatio: '1.35 / 1', objectFit: 'cover', display: 'block' },
  muted: { margin: '4px 0 0', color: '#64727d' },
  calendarItem: { display: 'grid', gap: 3, padding: '12px 0', borderBottom: '1px solid #ece7df' },
};
