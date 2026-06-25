import { useMemo, useState } from 'react';
import { CheckCircle2, Save, Send } from 'lucide-react';
import DashboardShell from '../../components/layout/DashboardShell';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import { amenityLabel, money } from '../../utils/formatters';
import { listingService } from '../../services/listings/listingService';
import styles from './HostPages.module.css';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80';
const AMENITIES = ['wifi', 'airConditioning', 'kitchen', 'workspace', 'parking', 'breakfast', 'pool', 'terrace'];

const initialListing = {
  title: '',
  subtitle: '',
  description: '',
  city: '',
  country: 'Bolivia',
  address: '',
  type: 'apartment',
  pricePerNight: 45,
  currency: 'USD',
  guests: 2,
  bedrooms: 1,
  beds: 1,
  baths: 1,
  amenities: ['wifi'],
  imagesText: `${DEFAULT_IMAGE}`,
};

export default function NewListingPage() {
  const [form, setForm] = useState(initialListing);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const images = useMemo(() => (
    form.imagesText
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
  ), [form.imagesText]);

  const preview = {
    ...form,
    images,
    coverImage: images[0] || DEFAULT_IMAGE,
  };

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setNotice('');
    setSubmitError('');
  }

  function toggleAmenity(amenity) {
    setForm((current) => {
      const exists = current.amenities.includes(amenity);
      return {
        ...current,
        amenities: exists
          ? current.amenities.filter((item) => item !== amenity)
          : [...current.amenities, amenity],
      };
    });
  }

  function validate() {
    const nextErrors = {};
    if (form.title.trim().length < 5) nextErrors.title = 'Agrega un titulo mas descriptivo.';
    if (form.description.trim().length < 10) nextErrors.description = 'Agrega una descripcion mas completa.';
    if (!form.city.trim()) nextErrors.city = 'La ciudad es requerida.';
    if (!form.address.trim()) nextErrors.address = 'La direccion es requerida.';
    if (Number(form.pricePerNight) < 20) nextErrors.pricePerNight = 'El precio minimo es 20 USD.';
    if (Number(form.guests) < 1) nextErrors.guests = 'La capacidad minima es 1 huesped.';
    if (images.length === 0) nextErrors.imagesText = 'Agrega al menos una URL de imagen.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function save(kind) {
    if (!validate()) return;

    if (kind === 'draft') {
      setNotice('Borrador guardado localmente.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      await listingService.createListing({ ...form, images });
      setNotice('Publicacion enviada a revision.');
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'No se pudo publicar el alojamiento.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardShell
      role="host"
      eyebrow="Nuevo alojamiento"
      title="Crear anuncio"
      subtitle="Completa la informacion clave para que el alojamiento quede claro, confiable y facil de reservar."
      actions={notice && <Badge tone="success"><CheckCircle2 size={14} /> {notice}</Badge>}
    >
      <section className={styles.formLayout}>
        <form className={styles.form}>
          <div className={styles.formSection}>
            <h2>Informacion principal</h2>
            <FormField
              label="Titulo"
              value={form.title}
              onChange={(event) => setField('title', event.target.value)}
            />
            {errors.title && <span className={styles.error}>{errors.title}</span>}
            <FormField
              label="Subtitulo"
              value={form.subtitle}
              onChange={(event) => setField('subtitle', event.target.value)}
            />
            <FormField label="Tipo" as="select">
              <select value={form.type} onChange={(event) => setField('type', event.target.value)}>
                <option value="apartment">Departamento</option>
                <option value="house">Casa</option>
                <option value="cabin">Cabana</option>
                <option value="room">Habitacion</option>
              </select>
            </FormField>
            <FormField
              label="Descripcion"
              as="textarea"
              value={form.description}
              onChange={(event) => setField('description', event.target.value)}
            />
            {errors.description && <span className={styles.error}>{errors.description}</span>}
          </div>

          <div className={styles.formSection}>
            <h2>Ubicacion</h2>
            <div className={styles.fieldGrid}>
              <FormField label="Ciudad" value={form.city} onChange={(event) => setField('city', event.target.value)} />
              <FormField label="Pais" value={form.country} onChange={(event) => setField('country', event.target.value)} />
            </div>
            {errors.city && <span className={styles.error}>{errors.city}</span>}
            <FormField label="Direccion" value={form.address} onChange={(event) => setField('address', event.target.value)} />
            {errors.address && <span className={styles.error}>{errors.address}</span>}
          </div>

          <div className={styles.formSection}>
            <h2>Capacidad y precio</h2>
            <div className={styles.fieldGrid}>
              <FormField label="Precio por noche" type="number" value={form.pricePerNight} onChange={(event) => setField('pricePerNight', Number(event.target.value))} />
              <FormField label="Moneda" value={form.currency} onChange={(event) => setField('currency', event.target.value)} />
              <FormField label="Huespedes" type="number" value={form.guests} onChange={(event) => setField('guests', Number(event.target.value))} />
              <FormField label="Habitaciones" type="number" value={form.bedrooms} onChange={(event) => setField('bedrooms', Number(event.target.value))} />
              <FormField label="Camas" type="number" value={form.beds} onChange={(event) => setField('beds', Number(event.target.value))} />
              <FormField label="Banos" type="number" value={form.baths} onChange={(event) => setField('baths', Number(event.target.value))} />
            </div>
            {errors.pricePerNight && <span className={styles.error}>{errors.pricePerNight}</span>}
            {errors.guests && <span className={styles.error}>{errors.guests}</span>}
          </div>

          <div className={styles.formSection}>
            <h2>Amenities</h2>
            <div className={styles.amenityGrid}>
              {AMENITIES.map((amenity) => (
                <label key={amenity} className={styles.checkBox}>
                  <input
                    type="checkbox"
                    checked={form.amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                  />
                  {amenityLabel(amenity)}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.formSection}>
            <h2>Imagenes</h2>
            <FormField
              label="URLs de imagen, una por linea"
              as="textarea"
              value={form.imagesText}
              onChange={(event) => setField('imagesText', event.target.value)}
            />
            {errors.imagesText && <span className={styles.error}>{errors.imagesText}</span>}
          </div>

          {submitError && <span className={styles.error}>{submitError}</span>}

          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={() => save('draft')} disabled={submitting}>
              <Save size={18} /> Guardar borrador
            </Button>
            <Button type="button" onClick={() => save('publish')} disabled={submitting}>
              <Send size={18} /> {submitting ? 'Publicando...' : 'Publicar'}
            </Button>
          </div>
        </form>

        <aside className={styles.preview}>
          <h2>Preview</h2>
          <img className={styles.previewImage} src={preview.coverImage} alt={preview.title || 'Preview del alojamiento'} />
          <div className={styles.previewMeta}>
            <strong>{preview.title || 'Titulo del alojamiento'}</strong>
            <span className={styles.muted}>{preview.city || 'Ciudad'}, {preview.country}</span>
            <span>{preview.guests} huespedes - {preview.bedrooms} habitaciones - {preview.beds} camas</span>
            <strong>{money(Number(preview.pricePerNight) || 0, preview.currency || 'USD')} noche</strong>
          </div>
          <div className={styles.actions}>
            {preview.amenities.slice(0, 4).map((amenity) => (
              <Badge key={amenity} tone="neutral">{amenityLabel(amenity)}</Badge>
            ))}
          </div>
        </aside>
      </section>
    </DashboardShell>
  );
}
