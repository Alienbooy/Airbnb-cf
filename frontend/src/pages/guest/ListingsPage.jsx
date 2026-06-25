import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import ListingCard from '../../components/listings/ListingCard';
import { amenityLabel } from '../../utils/formatters';
import { listingService } from '../../services/listings/listingService';
import styles from './GuestPages.module.css';

const saved = new Set();

export default function ListingsPage() {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const cities = useMemo(() => [...new Set(listings.map((listing) => listing.city))], []);
  const amenities = useMemo(() => [...new Set(listings.flatMap((listing) => listing.amenities))].slice(0, 8), []);

  const [filters, setFilters] = useState({
    query: '',
    city: searchParams.get('city') || '',
    maxPrice: '',
    guests: searchParams.get('guests') || '',
    rating: '',
    amenity: '',
    sort: 'recommended',
  });

  useEffect(() => {
    let mounted = true;

    listingService.listListings()
      .then((data) => {
        if (mounted) setListings(data);
      })
      .catch(() => {
        if (mounted) setLoadError('No se pudo cargar el catalogo desde el backend.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  function update(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function clearFilters() {
    setFilters({ query: '', city: '', maxPrice: '', guests: '', rating: '', amenity: '', sort: 'recommended' });
  }

  const filtered = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLowerCase();

    const next = listings.filter((listing) => {
      const matchesQuery = !normalizedQuery ||
        listing.title.toLowerCase().includes(normalizedQuery) ||
        listing.city.toLowerCase().includes(normalizedQuery) ||
        listing.country.toLowerCase().includes(normalizedQuery);
      const matchesCity = !filters.city || listing.city === filters.city;
      const matchesPrice = !filters.maxPrice || listing.pricePerNight <= Number(filters.maxPrice);
      const matchesGuests = !filters.guests || listing.guests >= Number(filters.guests);
      const matchesRating = !filters.rating || listing.rating >= Number(filters.rating);
      const matchesAmenity = !filters.amenity || listing.amenities.includes(filters.amenity);

      return matchesQuery && matchesCity && matchesPrice && matchesGuests && matchesRating && matchesAmenity;
    });

    if (filters.sort === 'price-low') return [...next].sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (filters.sort === 'price-high') return [...next].sort((a, b) => b.pricePerNight - a.pricePerNight);
    if (filters.sort === 'rating') return [...next].sort((a, b) => b.rating - a.rating);
    return next;
  }, [filters]);

  return (
    <AppShell>
      <main className={styles.page}>
        <section className={`${styles.container} ${styles.section}`}>
          <header className={styles.listHeader}>
            <div>
              <span className={styles.eyebrow}>Catalogo</span>
              <h1 className={styles.pageTitle}>Alojamientos disponibles</h1>
              <p>Filtra por destino, precio y comodidad para encontrar el espacio correcto.</p>
            </div>
            <span className={styles.resultsMeta}>{filtered.length} resultados</span>
          </header>

          <div className={styles.filters}>
            <label className={styles.filterBox}>
              <span className={styles.filterLabel}>Buscar</span>
              <span className={styles.searchControl}>
                <Search size={16} />
                <input
                  className={styles.searchTextInput}
                  value={filters.query}
                  onChange={(event) => update('query', event.target.value)}
                  placeholder="Titulo, ciudad o pais"
                />
              </span>
            </label>

            <label className={styles.filterBox}>
              <span className={styles.filterLabel}>Ciudad</span>
              <select className={styles.filterControl} value={filters.city} onChange={(event) => update('city', event.target.value)}>
                <option value="">Todas</option>
                {cities.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
            </label>

            <label className={styles.filterBox}>
              <span className={styles.filterLabel}>Precio max.</span>
              <select className={styles.filterControl} value={filters.maxPrice} onChange={(event) => update('maxPrice', event.target.value)}>
                <option value="">Sin limite</option>
                <option value="80">Hasta 80 USD</option>
                <option value="130">Hasta 130 USD</option>
                <option value="180">Hasta 180 USD</option>
                <option value="240">Hasta 240 USD</option>
              </select>
            </label>

            <label className={styles.filterBox}>
              <span className={styles.filterLabel}>Huespedes</span>
              <select className={styles.filterControl} value={filters.guests} onChange={(event) => update('guests', event.target.value)}>
                <option value="">Cualquiera</option>
                {[1, 2, 3, 4, 5, 6].map((value) => <option key={value} value={value}>{value}+</option>)}
              </select>
            </label>

            <label className={styles.filterBox}>
              <span className={styles.filterLabel}>Ordenar</span>
              <select className={styles.filterControl} value={filters.sort} onChange={(event) => update('sort', event.target.value)}>
                <option value="recommended">Recomendados</option>
                <option value="rating">Mejor rating</option>
                <option value="price-low">Menor precio</option>
                <option value="price-high">Mayor precio</option>
              </select>
            </label>

            <label className={styles.filterBox}>
              <span className={styles.filterLabel}>Rating</span>
              <select className={styles.filterControl} value={filters.rating} onChange={(event) => update('rating', event.target.value)}>
                <option value="">Todos</option>
                <option value="4.7">4.7+</option>
                <option value="4.85">4.85+</option>
                <option value="4.9">4.9+</option>
              </select>
            </label>

            <label className={styles.filterBox}>
              <span className={styles.filterLabel}>Amenity</span>
              <select className={styles.filterControl} value={filters.amenity} onChange={(event) => update('amenity', event.target.value)}>
                <option value="">Todas</option>
                {amenities.map((amenity) => <option key={amenity} value={amenity}>{amenityLabel(amenity)}</option>)}
              </select>
            </label>

            <div className={styles.filterBox}>
              <span className={styles.filterLabel}>Filtros</span>
              <Button type="button" variant="secondary" onClick={clearFilters}>
                <X size={16} /> Limpiar
              </Button>
            </div>
          </div>

          {loading && <p>Cargando catalogo...</p>}
          {loadError && (
            <EmptyState
              title="No se pudo cargar el catalogo"
              message={loadError}
            />
          )}

          {!loading && !loadError && filtered.length > 0 ? (
            <div className={styles.grid}>
              {filtered.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  saved={saved.has(listing.id)}
                  badge={listing.host.superhost ? 'Superhost' : 'Verificado'}
                />
              ))}
            </div>
          ) : !loading && !loadError ? (
            <EmptyState
              title="No encontramos alojamientos"
              message="Ajusta los filtros o vuelve al catalogo completo para explorar mas opciones."
            >
              <div className={styles.emptyAction}>
                <Button type="button" variant="secondary" onClick={clearFilters}>
                  <SlidersHorizontal size={18} /> Restablecer filtros
                </Button>
              </div>
            </EmptyState>
          ) : null}
        </section>
      </main>
    </AppShell>
  );
}
