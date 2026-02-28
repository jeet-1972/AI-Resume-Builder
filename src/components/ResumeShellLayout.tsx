import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './ResumeShellLayout.module.css';

interface ResumeShellLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function ResumeShellLayout({ title, subtitle, children }: ResumeShellLayoutProps) {
  return (
    <div className={styles.root}>
      <header className={styles.topBar}>
        <div className={styles.brand}>
          <span className={styles.brandTitle}>AI Resume Builder</span>
          <span className={styles.brandSubtitle}>KodNest Premium</span>
        </div>
        <nav className={styles.nav}>
          <NavLink
            to="/builder"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
            }
          >
            Builder
          </NavLink>
          <NavLink
            to="/preview"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
            }
          >
            Preview
          </NavLink>
          <NavLink
            to="/proof"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
            }
          >
            Proof
          </NavLink>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{title}</h1>
          {subtitle ? <p className={styles.pageSubtitle}>{subtitle}</p> : null}
        </div>
        {children}
      </main>
    </div>
  );
}

