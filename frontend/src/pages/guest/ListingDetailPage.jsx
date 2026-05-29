import { Link, useParams } from 'react-router-dom';
import mockData from '../../mocks/api-mocks.json';

export default function ListingDetailPage() {
  const { id } = useParams();
  const listing = mockData.listings.summaryResponse.find((item) => item.id === id || item.slug === id) || mockData.listings.summaryResponse[0];
  const reviews = mockData.reviews.filter((review) => review.listingId === listing.id);
  const nights = 3;
  const total = listing.pricePerNight * nights + 25 + 15;

  return (
    <main style={styles.page}>
      <Link to="/listings" style={styles.back}>Volver a alojamientos</Link>

      <section style={styles.header}>
        <div>
          <h1 style={styles.title}>{listing.title}</h1>
          <p style={styles.muted}>{listing.city}, {listing.country} · {listing.rating} estrellas · {listing.reviewCount} reviews</p>
        </div>
        <strong style={styles.price}>${listing.pricePerNight} {listing.currency} / noche</strong>
      </section>

      <section style={styles.gallery}>
        {listing.images.map((image) => (
          <img key={image} src={image} alt={listing.title} style={styles.galleryImage} />
        ))}
      </section>

      <section style={styles.content}>
        <article style={styles.panel}>
          <div style={styles.host}>
            <img src={listing.host.avatar} alt={listing.host.name} style={styles.avatar} />
            <div>
              <h2 style={styles.sectionTitle}>Anfitrion: {listing.host.name}</h2>
              <p style={styles.muted}>Superhost · responde en {listing.host.responseTime} · {listing.host.responseRate}% de respuesta</p>
            </div>
          </div>
          <p style={styles.description}>{listing.description}</p>
          <h3 style={styles.smallTitle}>Comodidades</h3>
          <div style={styles.amenities}>
            {listing.amenities.map((amenity) => <span key={amenity} style={styles.chip}>{amenity}</span>)}
          </div>
          <h3 style={styles.smallTitle}>Reviews mockeadas</h3>
          <div style={styles.reviews}>
            {reviews.map((review) => (
              <div key={review.id} style={styles.review}>
                <img src={review.avatar} alt={review.guestName} style={styles.reviewAvatar} />
                <div>
                  <strong>{review.guestName}</strong>
                  <p style={styles.muted}>{review.rating} estrellas · {review.createdAt}</p>
                  <p style={styles.reviewText}>{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <aside style={styles.booking}>
          <h2 style={styles.sectionTitle}>Reserva demo</h2>
          <div style={styles.bookingRow}><span>Entrada</span><strong>20 jun 2026</strong></div>
          <div style={styles.bookingRow}><span>Salida</span><strong>23 jun 2026</strong></div>
          <div style={styles.bookingRow}><span>Huespedes</span><strong>{listing.guests}</strong></div>
          <hr style={styles.hr} />
          <div style={styles.bookingRow}><span>${listing.pricePerNight} x {nights} noches</span><strong>${listing.pricePerNight * nights}</strong></div>
          <div style={styles.bookingRow}><span>Servicio</span><strong>$25</strong></div>
          <div style={styles.bookingRow}><span>Limpieza</span><strong>$15</strong></div>
          <div style={styles.total}><span>Total</span><strong>${total} {listing.currency}</strong></div>
          <button style={styles.button}>Reservar con mock</button>
        </aside>
      </section>
    </main>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#fbfaf7', color: '#172026', padding: '28px' },
  back: { display: 'inline-flex', margin: '0 auto 16px', maxWidth: 1180, color: '#d64b6a', textDecoration: 'none', fontWeight: 800 },
  header: { maxWidth: 1180, margin: '0 auto 18px', display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'end' },
  title: { margin: 0, fontSize: 42, lineHeight: 1.05 },
  muted: { margin: 0, color: '#64727d' },
  price: { fontSize: 20 },
  gallery: { maxWidth: 1180, margin: '0 auto 24px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10 },
  galleryImage: { width: '100%', height: 320, objectFit: 'cover', borderRadius: 8 },
  content: { maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' },
  panel: { background: '#fff', border: '1px solid #e8e3dc', borderRadius: 8, padding: 22 },
  host: { display: 'flex', gap: 14, alignItems: 'center' },
  avatar: { width: 58, height: 58, borderRadius: '50%', objectFit: 'cover' },
  sectionTitle: { margin: 0, fontSize: 22 },
  description: { color: '#2f3a42', fontSize: 17, margin: '22px 0', lineHeight: 1.7 },
  smallTitle: { margin: '22px 0 10px', fontSize: 18 },
  amenities: { display: 'flex', flexWrap: 'wrap', gap: 10 },
  chip: { padding: '9px 12px', borderRadius: 999, background: '#f3f0eb', color: '#3b4650', fontWeight: 700 },
  reviews: { display: 'grid', gap: 14 },
  review: { display: 'flex', gap: 12, padding: 14, border: '1px solid #ece7df', borderRadius: 8 },
  reviewAvatar: { width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' },
  reviewText: { margin: '6px 0 0', color: '#2f3a42' },
  booking: { position: 'sticky', top: 20, background: '#fff', border: '1px solid #e8e3dc', borderRadius: 8, padding: 20, boxShadow: '0 16px 36px rgba(23,32,38,0.08)' },
  bookingRow: { display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 12 },
  hr: { border: 0, borderTop: '1px solid #ece7df', margin: '16px 0' },
  total: { display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 16, fontSize: 20 },
  button: { width: '100%', marginTop: 18, border: 0, borderRadius: 8, padding: '13px 16px', background: '#d64b6a', color: '#fff', fontWeight: 800, cursor: 'pointer' },
};
