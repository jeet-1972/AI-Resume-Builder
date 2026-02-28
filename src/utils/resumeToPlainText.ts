import type { ResumeState } from '../context/ResumeBuilderContext';

/** True if resume may look incomplete (missing name or both project and experience). */
export function isResumeIncomplete(state: ResumeState): boolean {
  const hasName = (state.personal.name ?? '').trim().length > 0;
  const hasProject = state.projects.some((p) => (p.name ?? '').trim() || (p.description ?? '').trim());
  const hasExperience = state.experience.length > 0;
  return !hasName || (!hasProject && !hasExperience);
}

export function resumeToPlainText(state: ResumeState): string {
  const lines: string[] = [];

  lines.push(state.personal.name || 'Your Name');
  const contact = [state.personal.email, state.personal.phone, state.personal.location]
    .filter(Boolean)
    .join(' | ');
  if (contact) lines.push(contact);
  lines.push('');

  if (state.summary.trim()) {
    lines.push('Summary');
    lines.push(state.summary.trim());
    lines.push('');
  }

  if (state.education.some((e) => e.school || e.degree || e.start || e.end)) {
    lines.push('Education');
    state.education.forEach((e) => {
      if (e.school || e.degree || e.start || e.end) {
        lines.push(`${e.school || 'School'} — ${e.degree || 'Degree'} (${[e.start, e.end].filter(Boolean).join(' – ')})`);
      }
    });
    lines.push('');
  }

  if (state.experience.length > 0) {
    lines.push('Experience');
    state.experience.forEach((exp) => {
      lines.push(`${exp.role || 'Role'} at ${exp.company || 'Company'} (${[exp.start, exp.end].filter(Boolean).join(' – ')})`);
      if (exp.description?.trim()) lines.push(exp.description.trim());
    });
    lines.push('');
  }

  if (state.projects.some((p) => p.name || p.description)) {
    lines.push('Projects');
    state.projects.forEach((p) => {
      if (p.name || p.description) {
        lines.push(p.name || 'Project');
        if (p.description?.trim()) lines.push(p.description.trim());
      }
    });
    lines.push('');
  }

  const skills = state.skills.split(',').map((s) => s.trim()).filter(Boolean);
  if (skills.length > 0) {
    lines.push('Skills');
    lines.push(skills.join(', '));
    lines.push('');
  }

  if (state.links.github?.trim() || state.links.linkedin?.trim()) {
    lines.push('Links');
    if (state.links.github?.trim()) lines.push(`GitHub: ${state.links.github.trim()}`);
    if (state.links.linkedin?.trim()) lines.push(`LinkedIn: ${state.links.linkedin.trim()}`);
  }

  return lines.join('\n').trim();
}
