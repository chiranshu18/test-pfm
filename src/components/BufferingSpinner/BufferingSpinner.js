import styles from './BufferingSpinner.module.css';

export default function BufferingSpinner({ size = 'md' }) {
  return (
    <span
      className={`${styles.spinner} ${size === 'sm' ? styles.sm : styles.md}`}
      aria-hidden="true"
    />
  );
}
