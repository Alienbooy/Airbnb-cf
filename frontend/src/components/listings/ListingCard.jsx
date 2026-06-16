import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { money } from '../../utils/formatters';
import styles from './ListingCard.module.css';

export default function ListingCard({ listing, saved = false, compact = false, badge }) {
  return (
    <article className={`${styles.card} ${compact ? styles.compact : ''}`}>
      <Link to={`/listings/${listing.id}`} className={styles.media}>
        <img className={styles.image} src={listing.coverImage} alt={listing.title} loading="lazy" />
        {badge && <span className={styles.badge}>{badge}</span>}
      </Link>

      {!compact && (
        <button type="button" className={`${styles.favorite} ${saved ? styles.favoriteSaved : ''}`} aria-label="Guardar alojamiento">
          <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
      )}

      <div className={styles.body}>
        <Link to={`/listings/${listing.id}`} className={styles.link}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>{listing.title}</h3>
            <span className={styles.rating}><Star size={15} fill="currentColor" /> {listing.rating}</span>
          </div>
          <p className={styles.muted}>{listing.city}, {listing.country}</p>
          <p className={styles.muted}>{listing.guests} huespedes - {listing.bedrooms} hab. - {listing.beds} camas</p>
          <p className={styles.price}><strong>{money(listing.pricePerNight, listing.currency)}</strong> noche</p>
        </Link>
      </div>
    </article>
  );
}
