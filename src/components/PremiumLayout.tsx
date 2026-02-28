import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useRB } from '../context/RBContext';
import styles from './PremiumLayout.module.css';

interface PremiumLayoutProps {
  stepSlug: string;
  stepIndex: number;
  contextTitle: string;
  children: ReactNode;
}

function statusLabel(s: string): string {
  if (s === 'worked') return 'It Worked';
  if (s === 'error') return 'Error';
  if (s === 'screenshot') return 'Screenshot';
  if (s === 'uploaded') return 'Uploaded';
  return 'Pending';
}

export function PremiumLayout({
  stepSlug,
  stepIndex,
  contextTitle,
  children,
}: PremiumLayoutProps) {
  const { stepStatus } = useRB();
  const status = stepStatus[stepSlug as keyof typeof stepStatus] ?? 'pending';

  return (
    <div className={styles.root}>
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>AI Resume Builder</div>
        <div className={styles.topBarCenter}>Project 3 — Step {stepIndex + 1} of 8</div>
        <div className={styles.topBarRight}>
          <span className={styles.statusBadge} data-status={status}>
            {statusLabel(status)}
          </span>
        </div>
      </header>

      <div className={styles.contextHeader}>{contextTitle}</div>

      <div className={styles.workspaceRow}>
        <main className={styles.mainWorkspace}>{children}</main>
      </div>

      <footer className={styles.proofFooter}>
        <Link to="/rb/proof">Proof &amp; Submission</Link>
      </footer>
    </div>
  );
}
