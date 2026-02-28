import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRB, STEP_KEYS } from '../context/RBContext';
import type { StepStatus } from '../context/RBContext';
import styles from './ProofPage.module.css';

const STEP_LABELS: Record<string, string> = {
  '01-problem': 'Problem',
  '02-market': 'Market',
  '03-architecture': 'Architecture',
  '04-hld': 'HLD',
  '05-lld': 'LLD',
  '06-build': 'Build',
  '07-test': 'Test',
  '08-ship': 'Ship',
};

function statusLabel(s: StepStatus): string {
  switch (s) {
    case 'pending': return 'Pending';
    case 'uploaded': return 'Uploaded';
    case 'worked': return 'It Worked';
    case 'error': return 'Error';
    case 'screenshot': return 'Screenshot';
    default: return 'Pending';
  }
}

export function ProofPage() {
  const {
    stepStatus,
    artifacts,
    lovableLink,
    githubLink,
    deployLink,
    setLovableLink,
    setGithubLink,
    setDeployLink,
  } = useRB();
  const [copied, setCopied] = useState(false);

  const buildSubmission = () => {
    const lines: string[] = [
      '# AI Resume Builder — Build Track — Project 3',
      '',
      '## Step status',
      ...STEP_KEYS.map((k, i) => {
        const hasArt = (artifacts[k] ?? '').trim().length > 0;
        return `${i + 1}. ${STEP_LABELS[k] ?? k}: ${statusLabel(stepStatus[k])} ${hasArt ? '(artifact provided)' : ''}`;
      }),
      '',
      '## Links',
      `Lovable: ${lovableLink || '(not set)'}`,
      `GitHub: ${githubLink || '(not set)'}`,
      `Deploy: ${deployLink || '(not set)'}`,
      '',
      '## Artifacts',
      ...STEP_KEYS.map((k, i) => `rb_step_${i + 1}_artifact: ${(artifacts[k] ?? '').trim() || '(none)'}`),
    ];
    return lines.join('\n');
  };

  const handleCopyFinal = () => {
    navigator.clipboard.writeText(buildSubmission());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.root}>
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>AI Resume Builder</div>
        <div className={styles.topBarCenter}>Project 3 — Proof &amp; Submission</div>
        <div className={styles.topBarRight} />
      </header>

      <div className={styles.contextHeader}>Proof &amp; Submission</div>

      <div className={styles.main}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8-step status</h2>
          <ul className={styles.stepList}>
            {STEP_KEYS.map((k, i) => {
              const hasArt = (artifacts[k] ?? '').trim().length > 0;
              const status = stepStatus[k];
              return (
                <li key={k} className={styles.stepItem}>
                  <span className={styles.stepNum}>{i + 1}.</span>
                  <span className={styles.stepName}>{STEP_LABELS[k] ?? k}</span>
                  <span className={styles.stepStatus} data-status={status}>
                    {statusLabel(status)}
                  </span>
                  {hasArt && <span className={styles.artifactBadge}>artifact</span>}
                </li>
              );
            })}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Links</h2>
          <div className={styles.inputGroup}>
            <label>Lovable link</label>
            <input
              type="url"
              placeholder="https://..."
              value={lovableLink}
              onChange={(e) => setLovableLink(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>GitHub link</label>
            <input
              type="url"
              placeholder="https://github.com/..."
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Deploy link</label>
            <input
              type="url"
              placeholder="https://..."
              value={deployLink}
              onChange={(e) => setDeployLink(e.target.value)}
              className={styles.input}
            />
          </div>
        </section>

        <section className={styles.section}>
          <button type="button" className={styles.copyBtn} onClick={handleCopyFinal}>
            {copied ? 'Copied!' : 'Copy Final Submission'}
          </button>
        </section>
      </div>

      <footer className={styles.proofFooter}>
        <Link to="/rb/01-problem">← Back to Step 1</Link>
      </footer>
    </div>
  );
}
