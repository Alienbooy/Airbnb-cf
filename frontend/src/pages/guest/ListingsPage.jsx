import { Link } from 'react-router-dom';
import mockData from '../../mocks/api-mocks.json';

const listings = mockData.listings.summaryResponse;

export default function ListingsPage() {
  const cities = [...new Set(listings.map((listing) => listing.city))];

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div>
          <span style={styles.eyebrow}>Explorar alojamientos</span>
          <h1 style={styles.title}>Estancias mockeadas con datos reales de frontend.</h1>
          <p style={styles.copy}>Todos los cards salen de <code>api-mocks.json</code> y usan imagenes remotas de internet.</p>
        </div>
        <div style={styles.filters}>
          {cities.map((city) => <span key={city} style={styles.chip}>{city}</span>)}
        </div>
      </section>

      <section style={styles.grid}>
        {listings.map((listing) => (
          <Link key={listing.id} to={`/listings/${listing.id}`} style={styles.card}>
            <img src={listing.coverImage} alt={listing.title} style={styles.image} />
            <div style={styles.cardBody}>
              <div style={styles.row}>
                <strong>{listing.city}, {listing.country}</strong>
                <span>{listing.rating} estrellas</span>
              </div>
              <h2 style={styles.cardTitle}>{listing.title}</h2>
              <p style={styles.muted}>{listing.subtitle}</p>
              <div style={styles.row}>
                <span>{listing.guests} huespedes · {listing.bedrooms} hab.</span>
                <strong>${listing.pricePerNight} {listing.currency}</strong>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f7f7f2', color: '#172026', padding: '32px' },
  hero: { maxWidth: 1180, margin: '0 auto 28px', display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: 24, alignItems: 'end' },
  eyebrow: { color: '#d64b6a', fontWeight: 800, textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 },
  title: { margin: '8px 0', fontSize: 44, lineHeight: 1.02, maxWidth: 760 },
  copy: { color: '#5f6b76', fontSize: 17 },
  filters: { display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'flex-end' },
  chip: { padding: '10px 14px', borderRadius: 999, background: '#fff', border: '1px solid #e6e2dc', fontWeight: 700 },
  grid: { maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 },
  card: { color: 'inherit', textDecoration: 'none', background: '#fff', border: '1px solid #e8e3dc', borderRadius: 8, overflow: 'hidden', boxShadow: '0 16px 36px rgba(23,32,38,0.08)' },
  image: { width: '100%', aspectRatio: '1.25 / 1', objectFit: 'cover', display: 'block' },
  cardBody: { padding: 16, display: 'grid', gap: 8 },
  row: { display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', color: '#5f6b76', fontSize: 14 },
  cardTitle: { margin: 0, fontSize: 20, color: '#172026' },
  muted: { margin: 0, color: '#697782' },
};
