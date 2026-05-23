import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div>
        <div className={styles.logo}>// Scrum Workload Simulator</div>
        <h1 className={styles.title}>
          Worker <span>Load</span>
          <br />
          Analyzer
        </h1>
        <div className={styles.subtitle}>v1.0 · IT Scrum Team · Sprint Capacity Model</div>
      </div>
    </header>
  );
}
