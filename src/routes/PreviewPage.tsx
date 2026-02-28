import { ResumeShellLayout } from '../components/ResumeShellLayout';
import { useResumeBuilder } from '../context/ResumeBuilderContext';
import styles from './PreviewPage.module.css';

export function PreviewPage() {
  const { state } = useResumeBuilder();
  const skillsList = state.skills
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <ResumeShellLayout
      title="Preview"
      subtitle="Clean, minimal, print-friendly view of your resume."
    >
      <div className={styles.previewOuter}>
        <div className={styles.page}>
          <header className={styles.header}>
            <div className={styles.name}>{state.personal.name || 'Your Name'}</div>
            <div className={styles.meta}>
              {[state.personal.email, state.personal.phone, state.personal.location]
                .filter(Boolean)
                .join(' • ') || 'Email • Phone • Location'}
            </div>
          </header>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Summary</h2>
            <p className={styles.body}>
              {state.summary || 'A calm, 2–3 line summary of your experience and strengths.'}
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Experience</h2>
            {state.experience.length === 0 ? (
              <p className={styles.body}>Add one or two roles that show clear impact.</p>
            ) : (
              state.experience.map((exp) => (
                <div key={exp.id} className={styles.body}>
                  <div className={styles.itemTitle}>{exp.role || 'Role'}</div>
                  <div className={styles.itemMeta}>
                    {exp.company || 'Company'} • {[exp.start, exp.end].filter(Boolean).join(' – ')}
                  </div>
                </div>
              ))
            )}
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Education</h2>
            {state.education.length === 0 ? (
              <p className={styles.body}>Include your most relevant degree or program.</p>
            ) : (
              state.education.map((edu) => (
                <div key={edu.id} className={styles.body}>
                  <div className={styles.itemTitle}>{edu.school || 'School'}</div>
                  <div className={styles.itemMeta}>
                    {edu.degree || 'Degree'} • {[edu.start, edu.end].filter(Boolean).join(' – ')}
                  </div>
                </div>
              ))
            )}
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Projects</h2>
            {state.projects.length === 0 ? (
              <p className={styles.body}>Highlight one or two projects that match your target role.</p>
            ) : (
              state.projects.map((proj) => (
                <div key={proj.id} className={styles.body}>
                  <div className={styles.itemTitle}>{proj.name || 'Project'}</div>
                  <p>{proj.description || 'Short, results-focused project description.'}</p>
                </div>
              ))
            )}
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Skills</h2>
            {skillsList.length === 0 ? (
              <p className={styles.body}>Add 6–10 sharp, relevant skills.</p>
            ) : (
              <div className={styles.pillRow}>
                {skillsList.map((skill) => (
                  <span key={skill} className={styles.pill}>
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </ResumeShellLayout>
  );
}

