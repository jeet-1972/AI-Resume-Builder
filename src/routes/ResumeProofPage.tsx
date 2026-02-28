import { ResumeShellLayout } from '../components/ResumeShellLayout';

export function ResumeProofPage() {
  return (
    <ResumeShellLayout
      title="Proof"
      subtitle="Drop your artifacts, notes, or links from this builder."
    >
      <div
        style={{
          borderRadius: 16,
          border: '1px dashed #374151',
          padding: '1.25rem 1.5rem',
          background: 'rgba(15,23,42,0.6)',
          color: '#9ca3af',
          fontSize: '0.9rem',
        }}
      >
        <p style={{ marginTop: 0 }}>
          This area is reserved for proofs and artifacts related to your AI Resume Builder flow:
        </p>
        <ul>
          <li>Links to Lovable builds</li>
          <li>GitHub repositories or branches</li>
          <li>Deployed resume or portfolio URLs</li>
        </ul>
        <p>
          For now, it&apos;s a placeholder. We&apos;ll wire in structured capture and final
          submission later.
        </p>
      </div>
    </ResumeShellLayout>
  );
}

