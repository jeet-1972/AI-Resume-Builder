import { ResumeShellLayout } from '../components/ResumeShellLayout';
import { TemplateTabs } from '../components/TemplateTabs';
import { useResumeBuilder } from '../context/ResumeBuilderContext';
import { useTemplate } from '../context/TemplateContext';
import { computeAtsScore, getAtsSuggestions, getTop3Improvements } from '../utils/atsScore';
import { needsActionVerb, needsMeasurableImpact } from '../utils/bulletGuidance';
import styles from './BuilderPage.module.css';

export function BuilderPage() {
  const { state, setState, loadSample } = useResumeBuilder();
  const { template } = useTemplate();
  const atsScore = computeAtsScore(state);
  const suggestions = getAtsSuggestions(state, 3);
  const top3Improvements = getTop3Improvements(state);
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
  const skillsList = state.skills.split(',').map((s) => s.trim()).filter(Boolean);
  const hasSkills = skillsList.length > 0;
  const hasLinks = !!(state.links.github?.trim() || state.links.linkedin?.trim());

  const updatePersonal = (field: keyof typeof state.personal, value: string) => {
    setState((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  const updateSummary = (value: string) => {
    setState((prev) => ({ ...prev, summary: value }));
  };

  const updateSkills = (value: string) => {
    setState((prev) => ({ ...prev, skills: value }));
  };

  const updateLinks = (field: keyof typeof state.links, value: string) => {
    setState((prev) => ({
      ...prev,
      links: { ...prev.links, [field]: value },
    }));
  };

  const addEducation = () => {
    setState((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: prev.education.length + 1,
          school: '',
          degree: '',
          start: '',
          end: '',
        },
      ],
    }));
  };

  const addExperience = () => {
    setState((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: prev.experience.length + 1,
          company: '',
          role: '',
          start: '',
          end: '',
        },
      ],
    }));
  };

  const addProject = () => {
    setState((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: prev.projects.length + 1,
          name: '',
          description: '',
        },
      ],
    }));
  };

  return (
    <ResumeShellLayout
      title="Resume Builder"
      subtitle="Fill in your details on the left. Preview updates on the right."
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <TemplateTabs />
        <button type="button" className={styles.chipButton} onClick={loadSample}>
          Load Sample Data
        </button>
      </div>
      <div className={styles.builderGrid}>
        <section className={styles.formColumn}>
          <h2 className={styles.sectionTitle}>Personal Info</h2>
          <div className={styles.fieldRow}>
            <div>
              <label className={styles.label}>Name</label>
              <input
                className={styles.input}
                value={state.personal.name}
                onChange={(e) => updatePersonal('name', e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className={styles.label}>Location</label>
              <input
                className={styles.input}
                value={state.personal.location}
                onChange={(e) => updatePersonal('location', e.target.value)}
                placeholder="City, Country"
              />
            </div>
          </div>
          <div className={styles.fieldRow}>
            <div>
              <label className={styles.label}>Email</label>
              <input
                className={styles.input}
                value={state.personal.email}
                onChange={(e) => updatePersonal('email', e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className={styles.label}>Phone</label>
              <input
                className={styles.input}
                value={state.personal.phone}
                onChange={(e) => updatePersonal('phone', e.target.value)}
                placeholder="+91-00000-00000"
              />
            </div>
          </div>

          <h2 className={styles.sectionTitle}>Summary</h2>
          <textarea
            className={styles.textarea}
            value={state.summary}
            onChange={(e) => updateSummary(e.target.value)}
            placeholder="Short 2–3 line summary about your experience and focus."
          />

          <h2 className={styles.sectionTitle}>Education</h2>
          {state.education.map((edu) => (
            <div key={edu.id} className={styles.previewBlock}>
              <div className={styles.inlineInputs}>
                <div>
                  <label className={styles.label}>School</label>
                  <input
                    className={styles.input}
                    value={edu.school}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        education: prev.education.map((entry) =>
                          entry.id === edu.id ? { ...entry, school: e.target.value } : entry,
                        ),
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={styles.label}>Degree</label>
                  <input
                    className={styles.input}
                    value={edu.degree}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        education: prev.education.map((entry) =>
                          entry.id === edu.id ? { ...entry, degree: e.target.value } : entry,
                        ),
                      }))
                    }
                  />
                </div>
              </div>
              <div className={styles.inlineInputs}>
                <div>
                  <label className={styles.label}>Start</label>
                  <input
                    className={styles.input}
                    value={edu.start}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        education: prev.education.map((entry) =>
                          entry.id === edu.id ? { ...entry, start: e.target.value } : entry,
                        ),
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={styles.label}>End</label>
                  <input
                    className={styles.input}
                    value={edu.end}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        education: prev.education.map((entry) =>
                          entry.id === edu.id ? { ...entry, end: e.target.value } : entry,
                        ),
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className={styles.chipButton} onClick={addEducation}>
            + Add education
          </button>

          <h2 className={styles.sectionTitle}>Experience</h2>
          {state.experience.map((exp) => (
            <div key={exp.id} className={styles.previewBlock}>
              <div className={styles.inlineInputs}>
                <div>
                  <label className={styles.label}>Company</label>
                  <input
                    className={styles.input}
                    value={exp.company}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        experience: prev.experience.map((entry) =>
                          entry.id === exp.id ? { ...entry, company: e.target.value } : entry,
                        ),
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={styles.label}>Role</label>
                  <input
                    className={styles.input}
                    value={exp.role}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        experience: prev.experience.map((entry) =>
                          entry.id === exp.id ? { ...entry, role: e.target.value } : entry,
                        ),
                      }))
                    }
                  />
                </div>
              </div>
              <div className={styles.inlineInputs}>
                <div>
                  <label className={styles.label}>Start</label>
                  <input
                    className={styles.input}
                    value={exp.start}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        experience: prev.experience.map((entry) =>
                          entry.id === exp.id ? { ...entry, start: e.target.value } : entry,
                        ),
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={styles.label}>End</label>
                  <input
                    className={styles.input}
                    value={exp.end}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        experience: prev.experience.map((entry) =>
                          entry.id === exp.id ? { ...entry, end: e.target.value } : entry,
                        ),
                      }))
                    }
                  />
                </div>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <label className={styles.label}>Description / bullets</label>
                <textarea
                  className={styles.textarea}
                  rows={2}
                  value={exp.description ?? ''}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      experience: prev.experience.map((entry) =>
                        entry.id === exp.id ? { ...entry, description: e.target.value } : entry,
                      ),
                    }))
                  }
                  placeholder="e.g. Shipped 3 features; reduced load time by 40%"
                />
                {(exp.description ?? '').trim() && (
                  <div className={styles.bulletHint}>
                    {needsActionVerb(exp.description ?? '') && (
                      <div>Start with a strong action verb.</div>
                    )}
                    {needsMeasurableImpact(exp.description ?? '') && (
                      <div>Add measurable impact (numbers).</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <button type="button" className={styles.chipButton} onClick={addExperience}>
            + Add experience
          </button>

          <h2 className={styles.sectionTitle}>Projects</h2>
          {state.projects.map((proj) => (
            <div key={proj.id} className={styles.previewBlock}>
              <label className={styles.label}>Project name</label>
              <input
                className={styles.input}
                value={proj.name}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    projects: prev.projects.map((entry) =>
                      entry.id === proj.id ? { ...entry, name: e.target.value } : entry,
                    ),
                  }))
                }
              />
              <label className={styles.label}>Short description</label>
              <textarea
                className={styles.textarea}
                value={proj.description}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    projects: prev.projects.map((entry) =>
                      entry.id === proj.id ? { ...entry, description: e.target.value } : entry,
                    ),
                  }))
                }
              />
              {proj.description.trim() && (
                <div className={styles.bulletHint}>
                  {needsActionVerb(proj.description) && (
                    <div>Start with a strong action verb.</div>
                  )}
                  {needsMeasurableImpact(proj.description) && (
                    <div>Add measurable impact (numbers).</div>
                  )}
                </div>
              )}
            </div>
          ))}
          <button type="button" className={styles.chipButton} onClick={addProject}>
            + Add project
          </button>

          <h2 className={styles.sectionTitle}>Skills</h2>
          <textarea
            className={styles.textarea}
            value={state.skills}
            onChange={(e) => updateSkills(e.target.value)}
            placeholder="React, TypeScript, Node.js, ..."
          />

          <h2 className={styles.sectionTitle}>Links</h2>
          <div className={styles.fieldRow}>
            <div>
              <label className={styles.label}>GitHub</label>
              <input
                className={styles.input}
                value={state.links.github}
                onChange={(e) => updateLinks('github', e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className={styles.label}>LinkedIn</label>
              <input
                className={styles.input}
                value={state.links.linkedin}
                onChange={(e) => updateLinks('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>
        </section>

        <aside className={styles.previewColumn}>
          <div className={styles.previewCard} data-template={template}>
            <div className={styles.previewHeading}>Live Preview</div>
            {hasContact && (
              <>
                <div className={styles.previewName}>
                  {state.personal.name || 'Your Name'}
                </div>
                <div className={styles.previewMeta}>
                  {[state.personal.email, state.personal.phone, state.personal.location]
                    .filter(Boolean)
                    .join(' • ')}
                </div>
              </>
            )}
            {hasSummary && (
              <>
                <div className={styles.previewSectionTitle}>Summary</div>
                <p className={styles.previewBody}>{state.summary}</p>
              </>
            )}
            {hasEducation && (
              <>
                <div className={styles.previewSectionTitle}>Education</div>
                {state.education
                  .filter((e) => e.school.trim() || e.degree.trim() || e.start.trim() || e.end.trim())
                  .map((edu) => (
                    <div key={edu.id} className={styles.previewBlock}>
                      <div className={styles.previewItemTitle}>{edu.school || 'School'}</div>
                      <div className={styles.previewItemMeta}>
                        {edu.degree} {[edu.start, edu.end].filter(Boolean).join(' – ')}
                      </div>
                    </div>
                  ))}
              </>
            )}
            {hasExperience && (
              <>
                <div className={styles.previewSectionTitle}>Experience</div>
                {state.experience.map((exp) => (
                  <div key={exp.id} className={styles.previewBlock}>
                    <div className={styles.previewItemTitle}>{exp.role || 'Role'}</div>
                    <div className={styles.previewItemMeta}>
                      {exp.company} • {[exp.start, exp.end].filter(Boolean).join(' – ')}
                    </div>
                    {exp.description?.trim() && (
                      <p className={styles.previewBody}>{exp.description}</p>
                    )}
                  </div>
                ))}
              </>
            )}
            {hasProjects && (
              <>
                <div className={styles.previewSectionTitle}>Projects</div>
                {state.projects
                  .filter((p) => p.name.trim() || p.description.trim())
                  .map((proj) => (
                    <div key={proj.id} className={styles.previewBlock}>
                      <div className={styles.previewItemTitle}>{proj.name || 'Project'}</div>
                      {proj.description?.trim() && (
                        <p className={styles.previewBody}>{proj.description}</p>
                      )}
                    </div>
                  ))}
              </>
            )}
            {hasSkills && (
              <>
                <div className={styles.previewSectionTitle}>Skills</div>
                <div className={styles.previewPills}>
                  {skillsList.map((s) => (
                    <span key={s} className={styles.previewPill}>
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}
            {hasLinks && (
              <>
                <div className={styles.previewSectionTitle}>Links</div>
                <div className={styles.previewBody}>
                  {state.links.github?.trim() && (
                    <a href={state.links.github} target="_blank" rel="noopener noreferrer" style={{ color: '#93c5fd' }}>
                      GitHub
                    </a>
                  )}
                  {state.links.github?.trim() && state.links.linkedin?.trim() && ' · '}
                  {state.links.linkedin?.trim() && (
                    <a href={state.links.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#93c5fd' }}>
                      LinkedIn
                    </a>
                  )}
                </div>
              </>
            )}
            {!hasContact && !hasSummary && !hasEducation && !hasExperience && !hasProjects && !hasSkills && !hasLinks && (
              <p className={styles.subtle}>Fill the form to see your resume here.</p>
            )}
          </div>

          <div className={styles.atsCard}>
            <div className={styles.atsLabel}>ATS Readiness Score</div>
            <div className={styles.atsMeterWrap}>
              <div
                className={styles.atsMeterFill}
                style={{ width: `${atsScore}%` }}
                role="progressbar"
                aria-valuenow={atsScore}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className={styles.atsScoreValue}>{atsScore}/100</div>
            {suggestions.length > 0 && (
              <ul className={styles.atsSuggestions}>
                {suggestions.map((msg, i) => (
                  <li key={i} className={styles.atsSuggestion}>
                    {msg}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.improvementsCard}>
            <div className={styles.improvementsLabel}>Top 3 Improvements</div>
            {top3Improvements.length > 0 ? (
              <ul className={styles.improvementsList}>
                {top3Improvements.map((msg, i) => (
                  <li key={i} className={styles.improvementItem}>
                    {msg}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.subtle}>No improvements needed at this time.</p>
            )}
          </div>
        </aside>
      </div>
    </ResumeShellLayout>
  );
}

