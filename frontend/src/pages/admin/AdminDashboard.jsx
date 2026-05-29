import mockData from '../../mocks/api-mocks.json';

export default function AdminDashboard() {
  const dashboard = mockData.admin.dashboardResponse;

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <span style={styles.eyebrow}>Admin</span>
        <h1 style={styles.title}>Metricas, usuarios y reportes mockeados.</h1>
      </section>

      <section style={styles.stats}>
        {Object.entries(dashboard.kpis).map(([key, value]) => (
          <div key={key} style={styles.stat}>
            <strong>{typeof value === 'number' && key.includes('Revenue') ? `$${value}` : value}</strong>
            <span>{key}</span>
          </div>
        ))}
      </section>

      <section style={styles.layout}>
        <article style={styles.panel}>
          <h2 style={styles.sectionTitle}>Revenue series</h2>
          <div style={styles.bars}>
            {dashboard.revenueSeries.map((item) => (
              <div key={item.month} style={styles.barItem}>
                <div style={{ ...styles.bar, height: `${item.value / 900}px` }} />
                <strong>{item.month}</strong>
                <span>${item.value}</span>
              </div>
            ))}
          </div>
        </article>

        <article style={styles.panel}>
          <h2 style={styles.sectionTitle}>Usuarios recientes</h2>
          {dashboard.recentUsers.map((user) => (
            <div key={user.id} style={styles.row}>
              <strong>{user.name}</strong>
              <span>{user.role}</span>
              <small>{user.status}</small>
            </div>
          ))}
        </article>
      </section>

      <section style={styles.panelWide}>
        <h2 style={styles.sectionTitle}>Reportes y moderacion</h2>
        {mockData.admin.reportsResponse.map((report) => (
          <div key={report.id} style={styles.report}>
            <strong>{report.title}</strong>
            <span>{report.type}</span>
            <span>{report.priority}</span>
            <small>{report.status}</small>
          </div>
        ))}
      </section>
    </main>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f7f7f2', color: '#172026', padding: 28 },
  header: { maxWidth: 1180, margin: '0 auto 22px' },
  eyebrow: { color: '#d64b6a', fontWeight: 800, textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 },
  title: { margin: '8px 0 0', fontSize: 42, lineHeight: 1.05 },
  stats: { maxWidth: 1180, margin: '0 auto 18px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 },
  stat: { background: '#fff', border: '1px solid #e8e3dc', borderRadius: 8, padding: 18, display: 'grid', gap: 4 },
  layout: { maxWidth: 1180, margin: '0 auto 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 },
  panel: { background: '#fff', border: '1px solid #e8e3dc', borderRadius: 8, padding: 20 },
  panelWide: { maxWidth: 1180, margin: '0 auto', background: '#fff', border: '1px solid #e8e3dc', borderRadius: 8, padding: 20 },
  sectionTitle: { margin: '0 0 14px', fontSize: 22 },
  bars: { minHeight: 170, display: 'flex', alignItems: 'end', gap: 18 },
  barItem: { display: 'grid', justifyItems: 'center', gap: 6, color: '#64727d' },
  bar: { width: 42, borderRadius: '8px 8px 0 0', background: '#d64b6a' },
  row: { display: 'grid', gridTemplateColumns: '1fr 90px 80px', gap: 12, padding: '12px 0', borderBottom: '1px solid #ece7df' },
  report: { display: 'grid', gridTemplateColumns: '1fr 180px 100px 90px', gap: 12, padding: '12px 0', borderBottom: '1px solid #ece7df' },
};
