import { useState } from 'react';
import { useRB } from '../context/RBContext';
import type { StepKey, StepStatus } from '../context/RBContext';
import styles from './BuildPanel.module.css';

interface BuildPanelProps {
  stepSlug: string;
  stepIndex: number;
}

export function BuildPanel({ stepSlug, stepIndex }: BuildPanelProps) {
  const { artifacts, setArtifact, setStepStatus } = useRB();
  const [copyText, setCopyText] = useState('');
  const artifactValue = artifacts[stepSlug as StepKey] ?? '';

  const setStatus = (status: StepStatus) => () =>
    setStepStatus(stepSlug as StepKey, status);

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText);
  };

  return (
    <div className={styles.panel}>
      <label className={styles.label}>Copy This Into Lovable</label>
      <textarea
        className={styles.textarea}
        placeholder="Paste or type content to copy into Lovable..."
        value={copyText}
        onChange={(e) => setCopyText(e.target.value)}
        rows={6}
      />
      <div className={styles.actions}>
        <button type="button" className={styles.btn} onClick={handleCopy}>
          Copy
        </button>
        <a
          href="https://lovable.dev"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btnPrimary}
        >
          Build in Lovable
        </a>
      </div>
      <div className={styles.statusRow}>
        <span className={styles.statusLabel}>Status:</span>
        <button type="button" className={styles.statusBtn} onClick={setStatus('worked')}>
          It Worked
        </button>
        <button type="button" className={styles.statusBtnError} onClick={setStatus('error')}>
          Error
        </button>
        <button type="button" className={styles.statusBtnScreenshot} onClick={setStatus('screenshot')}>
          Add Screenshot
        </button>
      </div>
      <label className={styles.label}>Artifact (rb_step_{stepIndex + 1}_artifact)</label>
      <textarea
        className={styles.textarea}
        placeholder="Paste link or output to unlock Next..."
        value={artifactValue}
        onChange={(e) => setArtifact(stepSlug as StepKey, e.target.value)}
        rows={3}
      />
      <p className={styles.hint}>Add your artifact for this step to unlock the Next button.</p>
    </div>
  );
}
