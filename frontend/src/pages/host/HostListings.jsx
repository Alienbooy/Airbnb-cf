import { Link } from 'react-router-dom';
import mockData from '../../mocks/api-mocks.json';

export default function HostListings() {
  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <div>
          <span style={styles.eyebrow}>Inventario</span>
          <h1 style={styles.title}>Publicaciones del anfitrion desde JSON.</h1>
        </div>
        <Link to="/host/listings/new" style={styles.button}>Crear alojamiento</Link>
      </section>

      <section style={styles.table}>
        {mockData.listings.summaryResponse.map((listing) => (
          <article key={listing.id} style={styles.row}>
            <img src={listing.coverImage} alt={listing.title} style={styles.image} />
            <div>
              <strong>{listing.title}</strong>
              <p style={styles.muted}>{listing.address}</p>
            </div>
            <span>{listing.status}</span>
            <span>{listing.rating} estrellas</span>
            <strong>${listing.pricePerNight}</strong>
            <Link to={`/listings/${listing.id}`} style={styles.link}>Ver</Link>
          </article>
        ))}
      </section>
    </main>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f7f7f2', color: '#172026', padding: 28 },
  header: { maxWidth: 1180, margin: '0 auto 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 18 },
  eyebrow: { color: '#d64b6a', fontWeight: 800, textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 },
  title: { margin: '8px 0 0', fontSize: 42, lineHeight: 1.05 },
  button: { textDecoration: 'none', background: '#172026', color: '#fff', padding: '12px 16px', borderRadius: 8, fontWeight: 800 },
  table: { maxWidth: 1180, margin: '0 auto', background: '#fff', border: '1px solid #e8e3dc', borderRadius: 8, padding: 10 },
  row: { display: 'grid', gridTemplateColumns: '80px 1fr 110px 110px 80px 50px', gap: 14, alignItems: 'center', padding: 12, borderBottom: '1px solid #ece7df' },
  image: { width: 80, height: 62, objectFit: 'cover', borderRadius: 6 },
  muted: { margin: 0, color: '#64727d' },
  link: { color: '#d64b6a', fontWeight: 800, textDecoration: 'none' },
};
