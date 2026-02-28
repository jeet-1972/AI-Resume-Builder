import { useNavigate } from 'react-router-dom';
import { ResumeShellLayout } from '../components/ResumeShellLayout';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <ResumeShellLayout
      title="Build a Resume That Gets Read."
      subtitle="A calm, guided builder for modern, AI-ready resumes."
    >
      <div style={{ maxWidth: 520 }}>
        <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Focus on your story. We’ll give it a clean, structured layout recruiters can skim in
          seconds.
        </p>
        <button
          type="button"
          onClick={() => navigate('/builder')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: 999,
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: 600,
            background: '#f9fafb',
            color: '#111827',
          }}
        >
          Start Building
        </button>
      </div>
    </ResumeShellLayout>
  );
}

