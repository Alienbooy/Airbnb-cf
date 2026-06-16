import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, PauseCircle, Pencil, PlusCircle, Search } from 'lucide-react';
import DashboardShell from '../../components/layout/DashboardShell';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { money, statusLabel } from '../../utils/formatters';
import mockData from '../../mocks/api-mocks.json';
import styles from './HostPages.module.css';

function toneForStatus(status) {
  if (status === 'active') return 'success';
  if (status === 'pending') return 'warning';
  if (status === 'rejected') return 'error';
  return 'neutral';
}

export default function HostListings() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const listings = mockData.listings.summaryResponse;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((listing) => {
      const matchesQuery = !q ||
        listing.title.toLowerCase().includes(q) ||
        listing.city.toLowerCase().includes(q) ||
        listing.address.toLowerCase().includes(q);
      const matchesStatus = !status || listing.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status, listings]);

  return (
    <DashboardShell
      role="host"
      eyebrow="Inventario"
      title="Gestion de anuncios"
      subtitle="Revisa disponibilidad, estado, precio y acciones principales de tus propiedades."
      actions={(
        <Button as={Link} to="/host/listings/new">
          <PlusCircle size={18} /> Crear alojamiento
        </Button>
      )}
    >
      <section className={styles.filters}>
        <label>
          <span className="srOnly">Buscar anuncio</span>
          <div className={styles.searchWrap}>
            <Search size={17} className={styles.searchIcon} />
            <input
              className={`${styles.searchInput} ${styles.searchInputWithIcon}`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por titulo, ciudad o direccion"
            />
          </div>
        </label>
        <select className={styles.select} value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">Todos los estados</option>
          {mockData.meta.listingStatuses.map((item) => (
            <option key={item} value={item}>{statusLabel(item)}</option>
          ))}
        </select>
        <Button type="button" variant="secondary" onClick={() => { setQuery(''); setStatus(''); }}>
          Limpiar
        </Button>
      </section>

      <section className={styles.table}>
        <div className={styles.tableHead}>
          <span>Alojamiento</span>
          <span>Estado</span>
          <span>Rating</span>
          <span>Precio</span>
          <span>Acciones</span>
        </div>

        {filtered.map((listing) => (
          <article key={listing.id} className={styles.tableRow}>
            <div className={styles.listingCell}>
              <img src={listing.coverImage} alt={listing.title} />
              <div>
                <strong>{listing.title}</strong>
                <p className={styles.muted}>{listing.address}</p>
              </div>
            </div>
            <Badge tone={toneForStatus(listing.status)}>{statusLabel(listing.status)}</Badge>
            <span>{listing.rating} estrellas</span>
            <strong>{money(listing.pricePerNight, listing.currency)}</strong>
            <div className={styles.actions}>
              <Button as={Link} to={`/listings/${listing.id}`} variant="secondary" size="small"><Eye size={15} /> Ver</Button>
              <Button type="button" variant="ghost" size="small"><Pencil size={15} /> Editar</Button>
              <Button type="button" variant="ghost" size="small"><PauseCircle size={15} /> Pausar</Button>
            </div>
          </article>
        ))}
      </section>
    </DashboardShell>
  );
}
