import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Bath, BedDouble, CalendarDays, Check, Home, Star, Users } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import { amenityLabel, compactDate, money, nightsBetween } from '../../utils/formatters';
import mockData from '../../mocks/api-mocks.json';
import styles from './GuestPages.module.css';

export default function ListingDetailPage() {
  const { id } = useParams();
  const listing = mockData.listings.summaryResponse.find((item) => item.id === id || item.slug === id) || mockData.listings.summaryResponse[0];
  const reviews = mockData.reviews.filter((review) => review.listingId === listing.id);
  const detail = mockData.listings.detailResponse;
  const [booking, setBooking] = useState({ checkIn: '2026-06-20', checkOut: '2026-06-23', guests: String(listing.guests) });

  const gallery = useMemo(() => {
    const unique = [...new Set([listing.coverImage, ...listing.images])];
    return unique.length >= 4 ? unique.slice(0, 4) : [...unique, ...unique].slice(0, 4);
  }, [listing]);

  const nights = nightsBetween(booking.checkIn, booking.checkOut);
  const subtotal = listing.pricePerNight * nights;
  const serviceFee = Math.round(subtotal * 0.1);
  const cleaningFee = listing.pricePerNight > 150 ? 55 : 25;
  const total = subtotal + serviceFee + cleaningFee;

  function update(name, value) {
    setBooking((current) => ({ ...current, [name]: value }));
  }

  return (
    <AppShell>
      <main className={styles.page}>
        <section className={`${styles.container} ${styles.detailHeader}`}>
          <Link to="/listings" className={styles.backLink}>
            <ArrowLeft size={18} /> Volver al catalogo
          </Link>

          <div className={styles.detailTitleRow}>
            <div>
              <h1 className={styles.pageTitle}>{listing.title}</h1>
              <div className={styles.detailMeta}>
                <span><Star size={16} fill="currentColor" /> {listing.rating}</span>
                <span>{listing.reviewCount} reviews</span>
                <span>{listing.city}, {listing.country}</span>
              </div>
            </div>
            <Badge tone={listing.host.superhost ? 'accent' : 'neutral'}>
              {listing.host.superhost ? 'Superhost' : 'Anfitrion verificado'}
            </Badge>
          </div>
        </section>

        <section className={`${styles.container} ${styles.gallery}`} aria-label="Galeria de alojamiento">
          {gallery.map((image, index) => (
            <img key={`${image}-${index}`} src={image} alt={`${listing.title} ${index + 1}`} />
          ))}
        </section>

        <section className={`${styles.container} ${styles.detailLayout}`}>
          <div className={styles.detailMain}>
            <section className={styles.plainBlock}>
              <div className={styles.hostRow}>
                <img src={listing.host.avatar} alt={listing.host.name} />
                <div>
                  <h2>Alojamiento publicado por {listing.host.name}</h2>
                  <p className={styles.muted}>
                    Responde en {listing.host.responseTime} - {listing.host.responseRate}% de respuesta
                  </p>
                </div>
              </div>
            </section>

            <section className={styles.plainBlock}>
              <div className={styles.detailMeta}>
                <span><Users size={17} /> {listing.guests} huespedes</span>
                <span><BedDouble size={17} /> {listing.bedrooms} habitaciones</span>
                <span><Home size={17} /> {listing.beds} camas</span>
                <span><Bath size={17} /> {listing.baths} banos</span>
              </div>
            </section>

            <section className={styles.plainBlock}>
              <h2>Descripcion</h2>
              <p className={styles.description}>{listing.description}</p>
            </section>

            <section className={styles.plainBlock}>
              <h2>Lo que ofrece este lugar</h2>
              <div className={styles.amenities}>
                {listing.amenities.map((amenity) => (
                  <div key={amenity} className={styles.amenity}>
                    <Check size={17} /> {amenityLabel(amenity)}
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.plainBlock}>
              <h2>Reglas y horarios</h2>
              <div className={styles.amenities}>
                <div className={styles.amenity}><CalendarDays size={17} /> Check-in desde {detail.checkInTime}</div>
                <div className={styles.amenity}><CalendarDays size={17} /> Check-out hasta {detail.checkOutTime}</div>
                {detail.houseRules.map((rule) => (
                  <div key={rule} className={styles.amenity}><Check size={17} /> {rule}</div>
                ))}
              </div>
            </section>

            <section className={styles.plainBlock}>
              <h2>Reviews</h2>
              <div className={styles.reviews}>
                {reviews.length ? reviews.map((review) => (
                  <article key={review.id} className={styles.review}>
                    <img className={styles.reviewAvatar} src={review.avatar} alt={review.guestName} />
                    <div>
                      <strong>{review.guestName}</strong>
                      <p>{review.rating} estrellas - {compactDate(review.createdAt)}</p>
                      <p>{review.comment}</p>
                    </div>
                  </article>
                )) : (
                  <p className={styles.muted}>Este alojamiento aun no tiene reviews publicadas.</p>
                )}
              </div>
            </section>
          </div>

          <aside className={styles.booking}>
            <div className={styles.bookingPrice}>
              <div>
                <strong>{money(listing.pricePerNight, listing.currency)}</strong>
                <span> noche</span>
              </div>
              <span><Star size={15} fill="currentColor" /> {listing.rating}</span>
            </div>

            <div className={styles.bookingForm}>
              <div className={styles.bookingGrid}>
                <FormField
                  label="Entrada"
                  type="date"
                  value={booking.checkIn}
                  min="2026-06-16"
                  onChange={(event) => update('checkIn', event.target.value)}
                />
                <FormField
                  label="Salida"
                  type="date"
                  value={booking.checkOut}
                  min={booking.checkIn}
                  onChange={(event) => update('checkOut', event.target.value)}
                />
              </div>
              <FormField label="Huespedes" as="select" value={booking.guests} onChange={(event) => update('guests', event.target.value)}>
                <select value={booking.guests} onChange={(event) => update('guests', event.target.value)}>
                  {Array.from({ length: listing.guests }, (_, index) => index + 1).map((value) => (
                    <option key={value} value={value}>{value} huespedes</option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>{money(listing.pricePerNight, listing.currency)} x {nights} noches</span>
                <strong>{money(subtotal, listing.currency)}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Servicio</span>
                <strong>{money(serviceFee, listing.currency)}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Limpieza</span>
                <strong>{money(cleaningFee, listing.currency)}</strong>
              </div>
              <div className={styles.totalRow}>
                <span>Total</span>
                <strong>{money(total, listing.currency)}</strong>
              </div>
            </div>

            <Button full type="button">Reservar</Button>
          </aside>
        </section>
      </main>
    </AppShell>
  );
}
