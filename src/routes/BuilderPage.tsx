import { useState, useCallback } from 'react';
import { ResumeShellLayout } from '../components/ResumeShellLayout';
import { TemplatePicker } from '../components/TemplatePicker';
import { TemplateTabs } from '../components/TemplateTabs';
import { useResumeBuilder } from '../context/ResumeBuilderContext';
import { useTemplate } from '../context/TemplateContext';
import type { SkillsByCategory } from '../context/ResumeBuilderContext';
import { computeAtsScore, getAtsSuggestions } from '../utils/atsScore';
import { needsActionVerb, needsMeasurableImpact } from '../utils/bulletGuidance';
import styles from './BuilderPage.module.css';

const SUGGESTED_SKILLS: SkillsByCategory = {
  technical: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL'],
  soft: ['Team Leadership', 'Problem Solving'],
  tools: ['Git', 'Docker', 'AWS'],
};

const SKILL_CATEGORIES: { key: keyof SkillsByCategory; label: string }[] = [
  { key: 'technical', label: 'Technical Skills' },
  { key: 'soft', label: 'Soft Skills' },
  { key: 'tools', label: 'Tools & Technologies' },
];

export function BuilderPage() {
  const { state, setState, loadSample } = useResumeBuilder();
  const { template, accentHsl } = useTemplate();
  const [suggestSkillsLoading, setSuggestSkillsLoading] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  const [skillInputs, setSkillInputs] = useState<Record<string, string>>({ technical: '', soft: '', tools: '' });
  const atsScore = computeAtsScore(state);
  const suggestions = getAtsSuggestions(state);
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
  const skillsList = [
    ...(state.skills.technical || []),
    ...(state.skills.soft || []),
    ...(state.skills.tools || []),
  ];
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

  const addSkill = useCallback(
    (category: keyof SkillsByCategory, skill: string) => {
      const trimmed = skill.trim();
      if (!trimmed) return;
      setState((prev) => ({
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...(prev.skills[category] || []), trimmed],
        },
      }));
      setSkillInputs((prev) => ({ ...prev, [category]: '' }));
    },
    [setState]
  );

  const removeSkill = useCallback(
    (category: keyof SkillsByCategory, index: number) => {
      setState((prev) => ({
        ...prev,
        skills: {
          ...prev.skills,
          [category]: prev.skills[category].filter((_, i) => i !== index),
        },
      }));
    },
    [setState]
  );

  const handleSuggestSkills = useCallback(() => {
    setSuggestSkillsLoading(true);
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        skills: {
          technical: [...(prev.skills.technical || []), ...SUGGESTED_SKILLS.technical],
          soft: [...(prev.skills.soft || []), ...SUGGESTED_SKILLS.soft],
          tools: [...(prev.skills.tools || []), ...SUGGESTED_SKILLS.tools],
        },
      }));
      setSuggestSkillsLoading(false);
    }, 1000);
  }, [setState]);

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
    const nextId = state.projects.length
      ? Math.max(...state.projects.map((p) => p.id)) + 1
      : 1;
    setState((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: nextId,
          name: '',
          description: '',
          techStack: [],
          liveUrl: '',
          githubUrl: '',
        },
      ],
    }));
    setExpandedProjectId(nextId);
  };

  const removeProject = (id: number) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
    if (expandedProjectId === id) setExpandedProjectId(null);
  };

  const updateProject = useCallback(
    (
      id: number,
      patch: Partial<{
        name: string;
        description: string;
        techStack: string[];
        liveUrl: string;
        githubUrl: string;
      }>
    ) => {
      setState((prev) => ({
        ...prev,
        projects: prev.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      }));
    },
    [setState]
  );

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
          <div className={styles.projectAccordion}>
            {state.projects.map((proj) => {
              const isExpanded = expandedProjectId === proj.id;
              const titleDisplay = proj.name.trim() || 'Untitled Project';
              return (
                <div key={proj.id} className={styles.projectEntry}>
                  <div
                    className={styles.projectEntryHeader}
                    onClick={() => setExpandedProjectId(isExpanded ? null : proj.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setExpandedProjectId(isExpanded ? null : proj.id);
                      }
                    }}
                  >
                    <span className={styles.projectEntryTitle}>{titleDisplay}</span>
                    <div className={styles.projectEntryActions} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className={styles.projectDeleteBtn}
                        onClick={() => removeProject(proj.id)}
                        aria-label="Delete project"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className={styles.projectEntryBody}>
                      <label className={styles.label}>Project Title</label>
                      <input
                        className={styles.input}
                        value={proj.name}
                        onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                        placeholder="Project name"
                      />
                      <label className={styles.label}>Description (max 200 characters)</label>
                      <textarea
                        className={styles.textarea}
                        rows={2}
                        maxLength={200}
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                        placeholder="Short description"
                      />
                      <div className={styles.charCounter}>
                        {proj.description.length}/200
                      </div>
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
                      <label className={styles.label}>Tech Stack</label>
                      <div className={styles.tagInputWrap}>
                        {(proj.techStack || []).map((t, i) => (
                          <span key={`${t}-${i}`} className={styles.tagPill}>
                            {t}
                            <button
                              type="button"
                              className={styles.tagPillRemove}
                              onClick={() =>
                                updateProject(proj.id, {
                                  techStack: (proj.techStack || []).filter((_, j) => j !== i),
                                })
                              }
                              aria-label={`Remove ${t}`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        <input
                          className={styles.tagInput}
                          placeholder="Add tech, press Enter"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = (e.target as HTMLInputElement).value.trim();
                              if (val) {
                                updateProject(proj.id, {
                                  techStack: [...(proj.techStack || []), val],
                                });
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                      </div>
                      <label className={styles.label}>Live URL (optional)</label>
                      <input
                        className={styles.input}
                        type="url"
                        value={proj.liveUrl || ''}
                        onChange={(e) => updateProject(proj.id, { liveUrl: e.target.value })}
                        placeholder="https://..."
                      />
                      <label className={styles.label}>GitHub URL (optional)</label>
                      <input
                        className={styles.input}
                        type="url"
                        value={proj.githubUrl || ''}
                        onChange={(e) => updateProject(proj.id, { githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button type="button" className={styles.chipButton} onClick={addProject}>
            + Add Project
          </button>

          <h2 className={styles.sectionTitle}>Skills</h2>
          {SKILL_CATEGORIES.map(({ key, label }) => (
            <div key={key} className={styles.skillCategory}>
              <div className={styles.skillCategoryHeader}>
                {label} ({(state.skills[key] || []).length})
              </div>
              <div className={styles.skillCategoryBody}>
                <div className={styles.tagInputWrap}>
                  {(state.skills[key] || []).map((skill, i) => (
                    <span key={`${skill}-${i}`} className={styles.tagPill}>
                      {skill}
                      <button
                        type="button"
                        className={styles.tagPillRemove}
                        onClick={() => removeSkill(key, i)}
                        aria-label={`Remove ${skill}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    className={styles.tagInput}
                    placeholder="Type skill, press Enter"
                    value={skillInputs[key] ?? ''}
                    onChange={(e) =>
                      setSkillInputs((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(key, (e.target as HTMLInputElement).value);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            className={styles.suggestSkillsBtn}
            onClick={handleSuggestSkills}
            disabled={suggestSkillsLoading}
          >
            {suggestSkillsLoading ? 'Adding…' : '✨ Suggest Skills'}
          </button>

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
          <TemplatePicker />
          <div
            className={styles.previewCard}
            data-template={template}
            style={{ ['--accent' as string]: accentHsl }}
          >
            <div className={styles.previewHeading}>Live Preview</div>
            {template === 'modern' ? (
              <div className={styles.previewModernWrap}>
                <div className={styles.previewSidebar}>
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
                  {hasSkills && (
                    <>
                      <div className={styles.previewSectionTitle}>Skills</div>
                      {SKILL_CATEGORIES.map(
                        ({ key, label }) =>
                          (state.skills[key] || []).length > 0 && (
                            <div key={key} className={styles.previewBlock}>
                              <div className={styles.previewItemMeta}>{label}</div>
                              <div className={styles.previewPills}>
                                {(state.skills[key] || []).map((s) => (
                                  <span key={s} className={styles.previewPill}>
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )
                      )}
                    </>
                  )}
                </div>
                <div className={styles.previewMain}>
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
                        .filter(
                          (p) =>
                            p.name.trim() ||
                            p.description.trim() ||
                            (p.techStack && p.techStack.length > 0) ||
                            p.liveUrl?.trim() ||
                            p.githubUrl?.trim()
                        )
                        .map((proj) => (
                          <div key={proj.id} className={styles.previewProjectCard}>
                            <div className={styles.previewProjectCardTitle}>
                              {proj.name || 'Project'}
                            </div>
                            {proj.description?.trim() && (
                              <p className={styles.previewProjectCardDesc}>{proj.description}</p>
                            )}
                            {(proj.techStack || []).length > 0 && (
                              <div className={styles.previewProjectTech}>
                                {(proj.techStack || []).map((t) => (
                                  <span key={t} className={styles.previewPill}>
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                            {(proj.liveUrl?.trim() || proj.githubUrl?.trim()) && (
                              <div className={styles.previewProjectLinks}>
                                {proj.liveUrl?.trim() && (
                                  <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer">
                                    🔗 Live
                                  </a>
                                )}
                                {proj.githubUrl?.trim() && (
                                  <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer">
                                    GitHub
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                    </>
                  )}
                  {hasLinks && (
                    <>
                      <div className={styles.previewSectionTitle}>Links</div>
                      <div className={styles.previewBody}>
                        {state.links.github?.trim() && (
                          <a href={state.links.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent, #93c5fd)' }}>
                            GitHub
                          </a>
                        )}
                        {state.links.github?.trim() && state.links.linkedin?.trim() && ' · '}
                        {state.links.linkedin?.trim() && (
                          <a href={state.links.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent, #93c5fd)' }}>
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
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
                  .filter(
                    (p) =>
                      p.name.trim() ||
                      p.description.trim() ||
                      (p.techStack && p.techStack.length > 0) ||
                      p.liveUrl?.trim() ||
                      p.githubUrl?.trim()
                  )
                  .map((proj) => (
                    <div key={proj.id} className={styles.previewProjectCard}>
                      <div className={styles.previewProjectCardTitle}>
                        {proj.name || 'Project'}
                      </div>
                      {proj.description?.trim() && (
                        <p className={styles.previewProjectCardDesc}>{proj.description}</p>
                      )}
                      {(proj.techStack || []).length > 0 && (
                        <div className={styles.previewProjectTech}>
                          {(proj.techStack || []).map((t) => (
                            <span key={t} className={styles.previewPill}>
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      {(proj.liveUrl?.trim() || proj.githubUrl?.trim()) && (
                        <div className={styles.previewProjectLinks}>
                          {proj.liveUrl?.trim() && (
                            <a
                              href={proj.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              🔗 Live
                            </a>
                          )}
                          {proj.githubUrl?.trim() && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              GitHub
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </>
            )}
            {hasSkills && (
              <>
                <div className={styles.previewSectionTitle}>Skills</div>
                {SKILL_CATEGORIES.map(
                  ({ key, label }) =>
                    (state.skills[key] || []).length > 0 && (
                      <div key={key} className={styles.previewBlock}>
                        <div className={styles.previewItemMeta}>{label}</div>
                        <div className={styles.previewPills}>
                          {(state.skills[key] || []).map((s) => (
                            <span key={s} className={styles.previewPill}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                )}
              </>
            )}
            {hasLinks && (
              <>
                <div className={styles.previewSectionTitle}>Links</div>
                <div className={styles.previewBody}>
                  {state.links.github?.trim() && (
                    <a href={state.links.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent, #93c5fd)' }}>
                      GitHub
                    </a>
                  )}
                  {state.links.github?.trim() && state.links.linkedin?.trim() && ' · '}
                  {state.links.linkedin?.trim() && (
                    <a href={state.links.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent, #93c5fd)' }}>
                      LinkedIn
                    </a>
                  )}
                </div>
              </>
            )}
            {!hasContact && !hasSummary && !hasEducation && !hasExperience && !hasProjects && !hasSkills && !hasLinks && (
              <p className={styles.subtle}>Fill the form to see your resume here.</p>
            )}
          </>
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
                {suggestions.map((s, i) => (
                  <li key={i} className={styles.atsSuggestion}>
                    {s.message} (+{s.points} points)
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </ResumeShellLayout>
  );
}

