import { useMemo, useState } from 'react';
import { CheckCircle2, Save, Send } from 'lucide-react';
import DashboardShell from '../../components/layout/DashboardShell';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import { amenityLabel, money } from '../../utils/formatters';
import mockData from '../../mocks/api-mocks.json';
import styles from './HostPages.module.css';

const initialListing = {
  ...mockData.listings.createRequest,
  imagesText: mockData.listings.createRequest.images.join('\n'),
};

export default function NewListingPage() {
  const amenities = useMemo(() => [...new Set(mockData.listings.summaryResponse.flatMap((listing) => listing.amenities))], []);
  const [form, setForm] = useState(initialListing);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');

  const images = form.imagesText
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

  const preview = {
    ...form,
    images,
    coverImage: images[0] || mockData.listings.summaryResponse[0].coverImage,
  };

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setNotice('');
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
    if (!form.city.trim()) nextErrors.city = 'La ciudad es requerida.';
    if (!form.address.trim()) nextErrors.address = 'La direccion es requerida.';
    if (Number(form.pricePerNight) < 20) nextErrors.pricePerNight = 'El precio minimo es 20 USD.';
    if (images.length === 0) nextErrors.imagesText = 'Agrega al menos una URL de imagen.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function save(kind) {
    if (!validate()) return;
    setNotice(kind === 'draft' ? 'Borrador guardado localmente.' : 'Publicacion lista para enviar al backend.');
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
            <FormField
              label="Descripcion"
              as="textarea"
              value={form.description}
              onChange={(event) => setField('description', event.target.value)}
            />
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
          </div>

          <div className={styles.formSection}>
            <h2>Amenities</h2>
            <div className={styles.amenityGrid}>
              {amenities.map((amenity) => (
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

          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={() => save('draft')}>
              <Save size={18} /> Guardar borrador
            </Button>
            <Button type="button" onClick={() => save('publish')}>
              <Send size={18} /> Publicar
            </Button>
          </div>
        </form>

        <aside className={styles.preview}>
          <h2>Preview</h2>
          <img className={styles.previewImage} src={preview.coverImage} alt={preview.title} />
          <div className={styles.previewMeta}>
            <strong>{preview.title || 'Titulo del alojamiento'}</strong>
            <span className={styles.muted}>{preview.city}, {preview.country}</span>
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
