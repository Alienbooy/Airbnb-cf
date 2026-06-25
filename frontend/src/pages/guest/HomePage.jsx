import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, CheckCircle2, MapPin, Search, ShieldCheck, SlidersHorizontal, Users } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import Button from '../../components/ui/Button';
import ListingCard from '../../components/listings/ListingCard';
import { listingService } from '../../services/listings/listingService';
import styles from './GuestPages.module.css';

const saved = new Set();

const categories = [
  'Todos',
  'Frente al mar',
  'Cabana',
  'Ciudad',
  'Piscina',
  'Trabajo remoto',
  'Familias',
];

export default function HomePage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const cities = useMemo(() => [...new Set(listings.map((listing) => listing.city))], []);
  const featured = useMemo(() => listings.slice(0, 6), []);
  const heroListing = featured[1] || featured[0];
  const [destination, setDestination] = useState('');
  const [guests, setGuests] = useState('2');

  useEffect(() => {
    let mounted = true;

    listingService.listListings()
      .then((data) => {
        if (mounted) setListings(data);
      })
      .catch(() => {
        if (mounted) setLoadError('No se pudieron cargar los alojamientos publicados.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  function submitSearch(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set('city', destination);
    if (guests) params.set('guests', guests);
    navigate(`/listings?${params.toString()}`);
  }

  return (
    <AppShell>
      <main className={styles.page}>
        <section className={`${styles.container} ${styles.hero}`}>
          <div className={styles.heroGrid}>
            <div>
              <span className={styles.eyebrow}>Reservas premium sin friccion</span>
              <h1>Encuentra una estancia que se sienta lista para llegar.</h1>
              <p className={styles.heroCopy}>
                Explora alojamientos verificados, compara precios claros y reserva desde una interfaz pensada para viajeros y anfitriones.
              </p>

              <form className={styles.searchBar} onSubmit={submitSearch}>
                <label className={styles.searchField}>
                  <span>Destino</span>
                  <select value={destination} onChange={(event) => setDestination(event.target.value)}>
                    <option value="">Cualquier ciudad</option>
                    {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                  </select>
                </label>
                <label className={styles.searchField}>
                  <span>Entrada</span>
                  <input type="date" defaultValue="2026-06-20" />
                </label>
                <label className={styles.searchField}>
                  <span>Huespedes</span>
                  <select value={guests} onChange={(event) => setGuests(event.target.value)}>
                    {[1, 2, 3, 4, 5, 6].map((value) => <option key={value} value={value}>{value} huespedes</option>)}
                  </select>
                </label>
                <Button type="submit">
                  <Search size={18} /> Buscar
                </Button>
              </form>
            </div>

            {heroListing && (
              <aside className={styles.heroImage}>
                <img src={heroListing.coverImage} alt={heroListing.title} />
                <div className={styles.heroBadge}>
                  <strong>{heroListing.title}</strong>
                  <span>{heroListing.city}, {heroListing.country} - desde ${heroListing.pricePerNight} USD</span>
                </div>
              </aside>
            )}
          </div>
        </section>

        <section className={styles.featureBand}>
          <div className={styles.container}>
            <div className={styles.featureGrid}>
              <article className={styles.featureItem}>
                <ShieldCheck size={24} />
                <h3>Anfitriones verificados</h3>
                <p>Perfiles, estado de publicaciones y respuestas visibles antes de reservar.</p>
              </article>
              <article className={styles.featureItem}>
                <CalendarDays size={24} />
                <h3>Reservas claras</h3>
                <p>Fechas, fees y total se muestran antes de confirmar el viaje.</p>
              </article>
              <article className={styles.featureItem}>
                <CheckCircle2 size={24} />
                <h3>Gestion por rol</h3>
                <p>Huespedes, anfitriones y administradores tienen paneles dedicados.</p>
              </article>
            </div>
          </div>
        </section>

        <section className={`${styles.container} ${styles.section}`}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>Explorar</span>
              <h2>Alojamientos destacados</h2>
              <p>Opciones seleccionadas para escapadas urbanas, playa y naturaleza.</p>
            </div>
            <Button as={Link} to="/listings" variant="secondary">
              <SlidersHorizontal size={18} /> Ver catalogo
            </Button>
          </div>

          <div className={styles.categoryStrip} aria-label="Categorias">
            {categories.map((category, index) => (
              <button key={category} type="button" className={`${styles.category} ${index === 0 ? styles.categoryActive : ''}`}>
                {index === 0 ? <MapPin size={16} /> : <Users size={16} />}
                {category}
              </button>
            ))}
          </div>

          {loading && <p>Cargando alojamientos...</p>}
          {loadError && <p>{loadError}</p>}
          {!loading && !loadError && featured.length === 0 && (
            <p>Aun no hay alojamientos aprobados para mostrar.</p>
          )}
          <div className={styles.grid}>
            {featured.map((listing, index) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                saved={saved.has(listing.id)}
                badge={index < 2 ? 'Verificado' : undefined}
              />
            ))}
          </div>
        </section>
      </main>
    </AppShell>
  );
}
