import styles from './ui.module.css';

export default function EmptyState({ title, message, children }) {
  return (
    <div className={styles.empty}>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {children}
    </div>
  );
}
