export default function ListingsPage() {
  return <SimplePage title="Listado de alojamientos" text="Página temporal de listings." />;
}

function SimplePage({ title, text }) {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.text}>{text}</p>
      </section>
    </main>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#111827', color: '#fff', padding: '2rem' },
  card: { maxWidth: '720px', width: '100%', background: '#1f2937', borderRadius: '20px', padding: '2rem' },
  title: { margin: 0, fontSize: '2rem' },
  text: { margin: '1rem 0 0', color: 'rgba(255,255,255,0.75)' },
};
