import { useState } from 'react';
import mockData from '../../mocks/api-mocks.json';

const initial = mockData.listings.createRequest;

export default function NewListingPage() {
  const [form, setForm] = useState(initial);

  function handle(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: name === 'pricePerNight' ? Number(value) : value }));
  }

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <span style={styles.eyebrow}>Nuevo alojamiento</span>
        <h1 style={styles.title}>Formulario mockeado con preview JSON.</h1>
      </section>

      <section style={styles.layout}>
        <form style={styles.form}>
          {['title', 'subtitle', 'city', 'country', 'address'].map((field) => (
            <label key={field} style={styles.field}>
              <span>{field}</span>
              <input name={field} value={form[field]} onChange={handle} style={styles.input} />
            </label>
          ))}
          <label style={styles.field}>
            <span>description</span>
            <textarea name="description" value={form.description} onChange={handle} style={styles.textarea} />
          </label>
          <label style={styles.field}>
            <span>pricePerNight</span>
            <input name="pricePerNight" type="number" value={form.pricePerNight} onChange={handle} style={styles.input} />
          </label>
          <button type="button" style={styles.button}>Guardar mock</button>
        </form>

        <aside style={styles.preview}>
          <img src={form.images[0]} alt={form.title} style={styles.image} />
          <pre style={styles.code}>{JSON.stringify(form, null, 2)}</pre>
        </aside>
      </section>
    </main>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f7f7f2', color: '#172026', padding: 28 },
  header: { maxWidth: 1180, margin: '0 auto 22px' },
  eyebrow: { color: '#d64b6a', fontWeight: 800, textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 },
  title: { margin: '8px 0 0', fontSize: 42, lineHeight: 1.05 },
  layout: { maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 18 },
  form: { background: '#fff', border: '1px solid #e8e3dc', borderRadius: 8, padding: 20, display: 'grid', gap: 14 },
  field: { display: 'grid', gap: 6, fontWeight: 800 },
  input: { border: '1px solid #dcd6ce', borderRadius: 8, padding: 12, font: 'inherit' },
  textarea: { border: '1px solid #dcd6ce', borderRadius: 8, padding: 12, font: 'inherit', minHeight: 110 },
  button: { border: 0, borderRadius: 8, padding: 13, background: '#d64b6a', color: '#fff', fontWeight: 800 },
  preview: { background: '#fff', border: '1px solid #e8e3dc', borderRadius: 8, padding: 20 },
  image: { width: '100%', aspectRatio: '1.35 / 1', objectFit: 'cover', borderRadius: 8, marginBottom: 12 },
  code: { margin: 0, whiteSpace: 'pre-wrap', background: '#172026', color: '#fff', padding: 14, borderRadius: 8, fontSize: 12 },
};
