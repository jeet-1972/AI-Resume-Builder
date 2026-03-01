import type { ResumeState } from '../context/ResumeBuilderContext';

/** Action verbs that earn +10 if present in summary (case-insensitive) */
const ACTION_VERBS = [
  'built', 'led', 'designed', 'improved', 'developed', 'managed', 'created',
  'implemented', 'delivered', 'launched', 'achieved', 'increased', 'reduced',
  'established', 'drove', 'spearheaded', 'optimized', 'streamlined',
];

function summaryHasActionVerbs(summary: string): boolean {
  const lower = summary.trim().toLowerCase();
  return ACTION_VERBS.some((verb) => {
    const re = new RegExp(`\\b${verb}\\b`, 'i');
    return re.test(lower);
  });
}

function hasExperienceWithBullets(state: ResumeState): boolean {
  return state.experience.some(
    (e) => (e.description && e.description.trim().length > 0)
  );
}

function hasEducationEntry(state: ResumeState): boolean {
  return state.education.some(
    (e) =>
      e.school.trim() !== '' ||
      e.degree.trim() !== '' ||
      e.start.trim() !== '' ||
      e.end.trim() !== ''
  );
}

function skillsCount(state: ResumeState): number {
  return [
    ...(state.skills.technical || []),
    ...(state.skills.soft || []),
    ...(state.skills.tools || []),
  ].filter(Boolean).length;
}

function hasProjectEntry(state: ResumeState): boolean {
  return state.projects.some(
    (p) =>
      p.name.trim() !== '' ||
      p.description.trim() !== '' ||
      (p.techStack && p.techStack.length > 0) ||
      (p.liveUrl && p.liveUrl.trim() !== '') ||
      (p.githubUrl && p.githubUrl.trim() !== '')
  );
}

/**
 * ATS Score: 0–100, deterministic.
 * +10 name, +10 email, +10 summary>50 chars, +15 1 exp with bullets,
 * +10 1 education, +10 5+ skills, +10 1 project, +5 phone, +5 LinkedIn, +5 GitHub,
 * +10 summary has action verbs.
 */
export function computeAtsScore(state: ResumeState): number {
  let score = 0;
  if (state.personal.name && state.personal.name.trim() !== '') score += 10;
  if (state.personal.email && state.personal.email.trim() !== '') score += 10;
  if (state.summary.trim().length > 50) score += 10;
  if (hasExperienceWithBullets(state)) score += 15;
  if (hasEducationEntry(state)) score += 10;
  if (skillsCount(state) >= 5) score += 10;
  if (hasProjectEntry(state)) score += 10;
  if (state.personal.phone && state.personal.phone.trim() !== '') score += 5;
  if (state.links.linkedin && state.links.linkedin.trim() !== '') score += 5;
  if (state.links.github && state.links.github.trim() !== '') score += 5;
  if (summaryHasActionVerbs(state.summary)) score += 10;
  return Math.min(100, score);
}

export type AtsSuggestion = { message: string; points: number };

/** Returns missing items that would increase score, with point values. */
export function getAtsSuggestions(state: ResumeState, maxCount?: number): AtsSuggestion[] {
  const out: AtsSuggestion[] = [];
  if (!(state.personal.name && state.personal.name.trim() !== '')) {
    out.push({ message: 'Add your name', points: 10 });
  }
  if (!(state.personal.email && state.personal.email.trim() !== '')) {
    out.push({ message: 'Add your email', points: 10 });
  }
  if (state.summary.trim().length <= 50) {
    out.push({ message: 'Add a professional summary', points: 10 });
  }
  if (!hasExperienceWithBullets(state)) {
    out.push({ message: 'Add at least one experience entry with bullets', points: 15 });
  }
  if (!hasEducationEntry(state)) {
    out.push({ message: 'Add at least one education entry', points: 10 });
  }
  if (skillsCount(state) < 5) {
    out.push({ message: 'Add at least 5 skills', points: 10 });
  }
  if (!hasProjectEntry(state)) {
    out.push({ message: 'Add at least one project', points: 10 });
  }
  if (!(state.personal.phone && state.personal.phone.trim() !== '')) {
    out.push({ message: 'Add your phone number', points: 5 });
  }
  if (!(state.links.linkedin && state.links.linkedin.trim() !== '')) {
    out.push({ message: 'Add your LinkedIn profile', points: 5 });
  }
  if (!(state.links.github && state.links.github.trim() !== '')) {
    out.push({ message: 'Add your GitHub profile', points: 5 });
  }
  if (!summaryHasActionVerbs(state.summary) && state.summary.trim().length > 0) {
    out.push({ message: 'Use action verbs in your summary (e.g. built, led, designed, improved)', points: 10 });
  }
  if (maxCount !== undefined) return out.slice(0, maxCount);
  return out;
}

/** Tier for display: 0–40 Needs Work (red), 41–70 Getting There (amber), 71–100 Strong (green). */
export function getAtsTier(score: number): 'needsWork' | 'gettingThere' | 'strong' {
  if (score <= 40) return 'needsWork';
  if (score <= 70) return 'gettingThere';
  return 'strong';
}

export const ATS_TIER_LABELS: Record<ReturnType<typeof getAtsTier>, string> = {
  needsWork: 'Needs Work',
  gettingThere: 'Getting There',
  strong: 'Strong Resume',
};
