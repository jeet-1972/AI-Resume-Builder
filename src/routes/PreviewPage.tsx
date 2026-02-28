import { useState } from 'react';
import { ResumeShellLayout } from '../components/ResumeShellLayout';
import { TemplateTabs } from '../components/TemplateTabs';
import { useResumeBuilder } from '../context/ResumeBuilderContext';
import { useTemplate } from '../context/TemplateContext';
import { isResumeIncomplete, resumeToPlainText } from '../utils/resumeToPlainText';
import styles from './PreviewPage.module.css';

export function PreviewPage() {
  const { state } = useResumeBuilder();
  const { template } = useTemplate();
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handlePrint = () => {
    setShowIncompleteWarning(isResumeIncomplete(state));
    window.print();
  };

  const handleCopyText = async () => {
    setShowIncompleteWarning(isResumeIncomplete(state));
    const text = resumeToPlainText(state);
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch {
      setCopyFeedback(false);
    }
  };
  const skillsList = [
    ...(state.skills.technical || []),
    ...(state.skills.soft || []),
    ...(state.skills.tools || []),
  ].filter(Boolean);
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
  const hasProjects = state.projects.some(
    (p) =>
      p.name.trim() ||
      p.description.trim() ||
      (p.techStack && p.techStack.length > 0) ||
      p.liveUrl?.trim() ||
      p.githubUrl?.trim()
  );
  const hasSkills = skillsList.length > 0;
  const hasLinks = !!(state.links.github?.trim() || state.links.linkedin?.trim());

  return (
    <ResumeShellLayout
      title="Preview"
      subtitle="Clean, minimal, print-friendly view of your resume."
    >
      <div className="no-print" style={{ marginBottom: '1rem' }}>
        <TemplateTabs />
      </div>
      <div className={`no-print ${styles.exportBar}`}>
        <button type="button" className={styles.exportBtn} onClick={handlePrint}>
          Print / Save as PDF
        </button>
        <button
          type="button"
          className={`${styles.exportBtn} ${styles.exportBtnSecondary}`}
          onClick={handleCopyText}
        >
          {copyFeedback ? 'Copied!' : 'Copy Resume as Text'}
        </button>
        {showIncompleteWarning && (
          <p className={styles.incompleteWarning}>
            Your resume may look incomplete.
          </p>
        )}
      </div>
      <div className={styles.previewOuter}>
        <div className={styles.page} data-template={template}>
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
                <div key={exp.id} className={styles.sectionItem}>
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
                  <div key={edu.id} className={styles.sectionItem}>
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
                .filter(
                  (p) =>
                    p.name.trim() ||
                    p.description.trim() ||
                    (p.techStack && p.techStack.length > 0) ||
                    p.liveUrl?.trim() ||
                    p.githubUrl?.trim()
                )
                .map((proj) => (
                  <div key={proj.id} className={styles.sectionItem}>
                    <div className={styles.itemTitle}>{proj.name || 'Project'}</div>
                    {proj.description?.trim() && <p className={styles.body}>{proj.description}</p>}
                    {(proj.techStack || []).length > 0 && (
                      <div className={styles.pillRow}>
                        {(proj.techStack || []).map((t) => (
                          <span key={t} className={styles.pill}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    {(proj.liveUrl?.trim() || proj.githubUrl?.trim()) && (
                      <p className={styles.body}>
                        {proj.liveUrl?.trim() && (
                          <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer">
                            Live
                          </a>
                        )}
                        {proj.liveUrl?.trim() && proj.githubUrl?.trim() && ' · '}
                        {proj.githubUrl?.trim() && (
                          <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer">
                            GitHub
                          </a>
                        )}
                      </p>
                    )}
                  </div>
                ))}
            </section>
          )}

          {hasSkills && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Skills</h2>
              {state.skills.technical?.length > 0 && (
                <>
                  <div className={styles.itemMeta}>Technical Skills</div>
                  <div className={styles.pillRow}>
                    {state.skills.technical.map((s) => (
                      <span key={s} className={styles.pill}>
                        {s}
                      </span>
                    ))}
                  </div>
                </>
              )}
              {state.skills.soft?.length > 0 && (
                <>
                  <div className={styles.itemMeta}>Soft Skills</div>
                  <div className={styles.pillRow}>
                    {state.skills.soft.map((s) => (
                      <span key={s} className={styles.pill}>
                        {s}
                      </span>
                    ))}
                  </div>
                </>
              )}
              {state.skills.tools?.length > 0 && (
                <>
                  <div className={styles.itemMeta}>Tools & Technologies</div>
                  <div className={styles.pillRow}>
                    {state.skills.tools.map((s) => (
                      <span key={s} className={styles.pill}>
                        {s}
                      </span>
                    ))}
                  </div>
                </>
              )}
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

