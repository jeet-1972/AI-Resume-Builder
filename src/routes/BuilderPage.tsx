import { ResumeShellLayout } from '../components/ResumeShellLayout';
import { useResumeBuilder } from '../context/ResumeBuilderContext';
import styles from './BuilderPage.module.css';

export function BuilderPage() {
  const { state, setState, loadSample } = useResumeBuilder();

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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
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
          <div className={styles.previewPlaceholder}>
            <div className={styles.previewHeading}>Live Preview</div>
            <p className={styles.subtle}>
              This is a structured resume layout placeholder. Content will reflect your entries,
              but export and scoring are not implemented yet.
            </p>
            <div className={styles.previewBlock}>
              <strong>{state.personal.name || 'Your Name'}</strong>
              <div className={styles.subtle}>
                {[state.personal.email, state.personal.phone, state.personal.location]
                  .filter(Boolean)
                  .join(' • ') || 'Email • Phone • Location'}
              </div>
            </div>
            <div className={styles.previewBlock}>
              <strong>Summary</strong>
              <p className={styles.subtle}>
                {state.summary || 'A concise, 2–3 line overview of your skills and focus.'}
              </p>
            </div>
            <div className={styles.previewBlock}>
              <strong>Education</strong>
              {state.education.length === 0 ? (
                <p className={styles.subtle}>Add your degrees and schools.</p>
              ) : (
                state.education.map((edu) => (
                  <p key={edu.id} className={styles.subtle}>
                    <strong>{edu.school}</strong> — {edu.degree} ({edu.start}–{edu.end})
                  </p>
                ))
              )}
            </div>
            <div className={styles.previewBlock}>
              <strong>Experience</strong>
              {state.experience.length === 0 ? (
                <p className={styles.subtle}>Add roles that show relevant impact.</p>
              ) : (
                state.experience.map((exp) => (
                  <p key={exp.id} className={styles.subtle}>
                    <strong>{exp.role}</strong> — {exp.company} ({exp.start}–{exp.end})
                  </p>
                ))
              )}
            </div>
            <div className={styles.previewBlock}>
              <strong>Projects</strong>
              {state.projects.length === 0 ? (
                <p className={styles.subtle}>Highlight side projects or key work.</p>
              ) : (
                state.projects.map((proj) => (
                  <p key={proj.id} className={styles.subtle}>
                    <strong>{proj.name}</strong> — {proj.description}
                  </p>
                ))
              )}
            </div>
            <div className={styles.previewBlock}>
              <strong>Skills</strong>
              <p className={styles.subtle}>
                {state.skills || 'List your core skills, separated by commas.'}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </ResumeShellLayout>
  );
}

