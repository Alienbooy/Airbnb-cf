export default function AdminDashboard() {
  return <SimplePage title="Dashboard administrativo" text="Página temporal para el panel de administración." />;
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
  page: { minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#020617', color: '#fff', padding: '2rem' },
  card: { maxWidth: '720px', width: '100%', background: '#111827', borderRadius: '20px', padding: '2rem' },
  title: { margin: 0, fontSize: '2rem' },
  text: { margin: '1rem 0 0', color: 'rgba(255,255,255,0.75)' },
};
