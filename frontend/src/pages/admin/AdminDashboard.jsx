import { useEffect, useMemo, useState } from 'react';
import { Activity, CheckCircle2, ShieldAlert, XCircle } from 'lucide-react';
import DashboardShell from '../../components/layout/DashboardShell';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import { money, shortDate, statusLabel } from '../../utils/formatters';
import { listingService } from '../../services/listings/listingService';
import { reservationService } from '../../services/reservations/reservationService';
import mockData from '../../mocks/api-mocks.json';
import styles from './AdminDashboard.module.css';

function toneForStatus(status) {
  if (['active', 'closed', 'low', 'confirmed', 'completed'].includes(status)) return 'success';
  if (['medium', 'open', 'pending'].includes(status)) return 'warning';
  if (['high', 'rejected', 'cancelled'].includes(status)) return 'error';
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
  return Number(value || 0).toLocaleString('es-BO');
}

function monthBucket(value) {
  const date = value ? new Date(value) : new Date();
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function lastSixMonths() {
  const now = new Date();
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: monthBucket(date),
      month: date.toLocaleDateString('es-BO', { month: 'short' }).replace('.', ''),
      value: 0,
    };
  });
}

export default function AdminDashboard() {
  const mockDashboard = mockData.admin.dashboardResponse;
  const [listings, setListings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [notice, setNotice] = useState('');
  const [actionId, setActionId] = useState('');

  async function loadDashboard() {
    setLoading(true);
    setLoadError('');

    try {
      const adminListings = await listingService.getAdminListings();
      const allReservations = await reservationService.getAllReservations(adminListings);
      setListings(adminListings);
      setReservations(allReservations);
    } catch (error) {
      setLoadError(error.response?.data?.message || 'No se pudo cargar la informacion administrativa.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const dashboard = useMemo(() => {
    const currentMonth = monthBucket(new Date());
    const uniqueHosts = new Set(listings.map((listing) => listing.hostId).filter(Boolean));
    const validRevenueReservations = reservations.filter((reservation) => !['cancelled', 'rejected'].includes(reservation.status));
    const grossRevenue = validRevenueReservations.reduce((sum, reservation) => sum + reservation.total, 0);
    const bookingsThisMonth = reservations.filter((reservation) => monthBucket(reservation.checkIn) === currentMonth).length;
    const revenueSeries = lastSixMonths();

    validRevenueReservations.forEach((reservation) => {
      const bucket = revenueSeries.find((item) => item.key === monthBucket(reservation.checkIn || reservation.createdAt));
      if (bucket) bucket.value += reservation.total;
    });

    return {
      kpis: {
        totalUsers: mockDashboard.kpis.totalUsers,
        activeHosts: uniqueHosts.size,
        activeListings: listings.filter((listing) => listing.status === 'active').length,
        bookingsThisMonth,
        grossRevenue,
        conversionRate: listings.length ? Math.round((reservations.length / Math.max(1, listings.length)) * 10) : 0,
      },
      revenueSeries,
      recentUsers: mockDashboard.recentUsers,
      recentModerationEvents: mockDashboard.recentModerationEvents,
    };
  }, [listings, mockDashboard, reservations]);

  const pendingListings = listings.filter((listing) => listing.status === 'pending');
  const maxRevenue = Math.max(1, ...dashboard.revenueSeries.map((item) => item.value));

  async function moderateListing(id, action) {
    setActionId(id);
    setActionError('');
    setNotice('');

    try {
      const updated = action === 'approve'
        ? await listingService.approveListing(id)
        : await listingService.rejectListing(id);

      setListings((current) => current.map((listing) => (
        listing.id === id ? { ...listing, status: updated.status } : listing
      )));
      setNotice(action === 'approve' ? 'Alojamiento aprobado.' : 'Alojamiento rechazado.');
    } catch (error) {
      setActionError(error.response?.data?.message || 'No se pudo actualizar el alojamiento.');
    } finally {
      setActionId('');
    }
  }

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

      {loading && <p className={styles.muted}>Cargando datos administrativos...</p>}
      {loadError && <p className={styles.error}>{loadError}</p>}
      {actionError && <p className={styles.error}>{actionError}</p>}
      {notice && <p className={styles.success}>{notice}</p>}

      <section className={styles.layout}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Revenue mensual</h2>
            <Badge tone="success">{money(dashboard.kpis.grossRevenue)}</Badge>
          </div>
          <div className={styles.chart} aria-label="Revenue por mes">
            {dashboard.revenueSeries.map((item) => (
              <div key={item.key} className={styles.barItem}>
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
          <div className={styles.pendingList}>
            {pendingListings.length === 0 && <p className={styles.muted}>No hay alojamientos pendientes de moderacion.</p>}
            {pendingListings.map((listing) => (
              <article key={listing.id} className={styles.pendingItem}>
                <div>
                  <strong>{listing.title}</strong>
                  <p className={styles.muted}>{listing.city} - {money(listing.pricePerNight, listing.currency)} noche</p>
                </div>
                <Badge tone={toneForStatus(listing.status)}>{statusLabel(listing.status)}</Badge>
                <div className={styles.actions}>
                  <Button
                    type="button"
                    variant="secondary"
                    size="small"
                    disabled={actionId === listing.id}
                    onClick={() => moderateListing(listing.id, 'approve')}
                  >
                    <CheckCircle2 size={15} /> Aprobar
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="small"
                    disabled={actionId === listing.id}
                    onClick={() => moderateListing(listing.id, 'reject')}
                  >
                    <XCircle size={15} /> Rechazar
                  </Button>
                </div>
              </article>
            ))}
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
