import { ResumeShellLayout } from '../components/ResumeShellLayout';
import { useResumeBuilder } from '../context/ResumeBuilderContext';
import styles from './PreviewPage.module.css';

export function PreviewPage() {
  const { state } = useResumeBuilder();
  const skillsList = state.skills
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const hasContact =
    state.personal.name ||
    state.personal.email ||
    state.personal.phone ||
    state.personal.location;
  const hasSummary = state.summary.trim().length > 0;
  const hasEducation = state.education.some(
    (e) => e.school.trim() || e.degree.trim() || e.start.trim() || e.end.trim()
  );
  const hasExperience = state.experience.length > 0;
  const hasProjects = state.projects.some((p) => p.name.trim() || p.description.trim());
  const hasSkills = skillsList.length > 0;
  const hasLinks = !!(state.links.github?.trim() || state.links.linkedin?.trim());

  return (
    <ResumeShellLayout
      title="Preview"
      subtitle="Clean, minimal, print-friendly view of your resume."
    >
      <div className={styles.previewOuter}>
        <div className={styles.page}>
          {(hasContact || true) && (
            <header className={styles.header}>
              <div className={styles.name}>{state.personal.name || 'Your Name'}</div>
              <div className={styles.meta}>
                {[state.personal.email, state.personal.phone, state.personal.location]
                  .filter(Boolean)
                  .join(' • ') || 'Email • Phone • Location'}
              </div>
            </header>
          )}

          {hasSummary && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Summary</h2>
              <p className={styles.body}>{state.summary}</p>
            </section>
          )}

          {hasExperience && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Experience</h2>
              {state.experience.map((exp) => (
                <div key={exp.id} className={styles.body}>
                  <div className={styles.itemTitle}>{exp.role || 'Role'}</div>
                  <div className={styles.itemMeta}>
                    {exp.company || 'Company'} • {[exp.start, exp.end].filter(Boolean).join(' – ')}
                  </div>
                  {exp.description?.trim() && <p className={styles.body}>{exp.description}</p>}
                </div>
              ))}
            </section>
          )}

          {hasEducation && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Education</h2>
              {state.education
                .filter((e) => e.school.trim() || e.degree.trim() || e.start.trim() || e.end.trim())
                .map((edu) => (
                  <div key={edu.id} className={styles.body}>
                    <div className={styles.itemTitle}>{edu.school || 'School'}</div>
                    <div className={styles.itemMeta}>
                      {edu.degree || 'Degree'} • {[edu.start, edu.end].filter(Boolean).join(' – ')}
                    </div>
                  </div>
                ))}
            </section>
          )}

          {hasProjects && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Projects</h2>
              {state.projects
                .filter((p) => p.name.trim() || p.description.trim())
                .map((proj) => (
                  <div key={proj.id} className={styles.body}>
                    <div className={styles.itemTitle}>{proj.name || 'Project'}</div>
                    {proj.description?.trim() && <p>{proj.description}</p>}
                  </div>
                ))}
            </section>
          )}

          {hasSkills && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Skills</h2>
              <div className={styles.pillRow}>
                {skillsList.map((skill) => (
                  <span key={skill} className={styles.pill}>
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {hasLinks && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Links</h2>
              <p className={styles.body}>
                {state.links.github?.trim() && (
                  <a href={state.links.github} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                )}
                {state.links.github?.trim() && state.links.linkedin?.trim() && ' · '}
                {state.links.linkedin?.trim() && (
                  <a href={state.links.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                )}
              </p>
            </section>
          )}
        </div>
      </div>
    </ResumeShellLayout>
  );
}

