import { Activity, ShieldAlert } from 'lucide-react';
import DashboardShell from '../../components/layout/DashboardShell';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import { money, shortDate, statusLabel } from '../../utils/formatters';
import mockData from '../../mocks/api-mocks.json';
import styles from './AdminDashboard.module.css';

function toneForStatus(status) {
  if (['active', 'closed', 'low'].includes(status)) return 'success';
  if (['medium', 'open'].includes(status)) return 'warning';
  if (['high', 'rejected'].includes(status)) return 'error';
  return 'neutral';
}

function labelForKpi(key) {
  const labels = {
    totalUsers: 'Usuarios',
    activeHosts: 'Anfitriones',
    activeListings: 'Anuncios',
    bookingsThisMonth: 'Reservas del mes',
    grossRevenue: 'Revenue bruto',
    conversionRate: 'Conversion',
  };
  return labels[key] || key;
}

function valueForKpi(key, value) {
  if (key === 'grossRevenue') return money(value);
  if (key === 'conversionRate') return `${value}%`;
  return value.toLocaleString('es-BO');
}

export default function AdminDashboard() {
  const dashboard = mockData.admin.dashboardResponse;
  const maxRevenue = Math.max(...dashboard.revenueSeries.map((item) => item.value));

  return (
    <DashboardShell
      role="admin"
      eyebrow="Administracion"
      title="Control general de StayBnb"
      subtitle="Supervisa usuarios, revenue, reportes y eventos de moderacion desde una vista operativa."
      actions={<Badge tone="accent"><Activity size={14} /> Sistema activo</Badge>}
    >
      <section className={styles.statsGrid}>
        {Object.entries(dashboard.kpis).map(([key, value]) => (
          <StatCard key={key} label={labelForKpi(key)} value={valueForKpi(key, value)} />
        ))}
      </section>

      <section className={styles.layout}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Revenue mensual</h2>
            <Badge tone="success">{money(dashboard.kpis.grossRevenue)}</Badge>
          </div>
          <div className={styles.chart} aria-label="Revenue por mes">
            {dashboard.revenueSeries.map((item) => (
              <div key={item.month} className={styles.barItem}>
                <div className={styles.bar} style={{ height: `${Math.round((item.value / maxRevenue) * 210)}px` }} />
                <strong>{item.month}</strong>
                <span>{money(item.value)}</span>
              </div>
            ))}
          </div>
        </article>

        <aside className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Usuarios recientes</h2>
            <Badge tone="neutral">{dashboard.recentUsers.length}</Badge>
          </div>
          <div className={styles.list}>
            {dashboard.recentUsers.map((user) => (
              <article key={user.id} className={styles.row}>
                <div>
                  <strong>{user.name}</strong>
                  <p className={styles.muted}>{shortDate(user.createdAt)}</p>
                </div>
                <Badge tone="neutral">{user.role}</Badge>
                <Badge tone={toneForStatus(user.status)}>{statusLabel(user.status)}</Badge>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className={styles.layout}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Reportes y moderacion</h2>
            <ShieldAlert size={20} />
          </div>
          <div className={styles.list}>
            {mockData.admin.reportsResponse.map((report) => (
              <article key={report.id} className={styles.report}>
                <div>
                  <strong>{report.title}</strong>
                  <p className={styles.muted}>{shortDate(report.createdAt)}</p>
                </div>
                <span>{report.type}</span>
                <Badge tone={toneForStatus(report.priority)}>{statusLabel(report.priority)}</Badge>
                <Badge tone={toneForStatus(report.status)}>{statusLabel(report.status)}</Badge>
              </article>
            ))}
          </div>
        </article>

        <aside className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Eventos recientes</h2>
            <Badge tone="warning">{dashboard.recentModerationEvents.length}</Badge>
          </div>
          <div className={styles.eventList}>
            {dashboard.recentModerationEvents.map((event) => (
              <article key={event.id} className={styles.event}>
                <strong>{event.message}</strong>
                <p className={styles.muted}>{event.type} - {shortDate(event.createdAt)}</p>
                <Badge tone={toneForStatus(event.severity)}>{statusLabel(event.severity)}</Badge>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </DashboardShell>
  );
}
