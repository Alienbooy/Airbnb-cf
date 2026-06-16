import styles from './ui.module.css';

export default function StatCard({ label, value }) {
  return (
    <article className={styles.statCard}>
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}
