import type { ResumeState } from '../context/ResumeBuilderContext';

const SUMMARY_MIN_WORDS = 40;
const SUMMARY_MAX_WORDS = 120;
const MIN_PROJECTS = 2;
const MIN_SKILLS = 8;
const NUMBER_PATTERN = /[\d]+|%\s|k\b|K\b|\d+%|\d+x/i;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function hasNumberInText(text: string): boolean {
  return NUMBER_PATTERN.test(text);
}

/** Returns true if at least one education entry has all of school, degree, start, end non-empty */
function hasCompleteEducation(state: ResumeState): boolean {
  return state.education.some(
    (e) =>
      e.school.trim() !== '' &&
      e.degree.trim() !== '' &&
      e.start.trim() !== '' &&
      e.end.trim() !== ''
  );
}

/** Check experience/project bullets (role, company, description) for numbers */
function hasMeasurableImpact(state: ResumeState): boolean {
  const expHasNumber = state.experience.some(
    (e) =>
      hasNumberInText(e.role) ||
      hasNumberInText(e.company) ||
      (e.description && hasNumberInText(e.description))
  );
  const projHasNumber = state.projects.some(
    (p) => hasNumberInText(p.name) || hasNumberInText(p.description)
  );
  return expHasNumber || projHasNumber;
}

export function computeAtsScore(state: ResumeState): number {
  let score = 0;
  const summaryWords = wordCount(state.summary);
  if (summaryWords >= SUMMARY_MIN_WORDS && summaryWords <= SUMMARY_MAX_WORDS) score += 15;
  if (state.projects.length >= MIN_PROJECTS) score += 10;
  if (state.experience.length >= 1) score += 10;
  const skillsList = state.skills.split(',').map((s) => s.trim()).filter(Boolean);
  if (skillsList.length >= MIN_SKILLS) score += 10;
  const hasLink =
    (state.links.github && state.links.github.trim() !== '') ||
    (state.links.linkedin && state.links.linkedin.trim() !== '');
  if (hasLink) score += 10;
  if (hasMeasurableImpact(state)) score += 15;
  if (hasCompleteEducation(state)) score += 10;
  return Math.min(100, score);
}

export type SuggestionId =
  | 'summary'
  | 'projects'
  | 'experience'
  | 'skills'
  | 'links'
  | 'numbers'
  | 'education';

const SUGGESTION_MESSAGES: Record<SuggestionId, string> = {
  summary: 'Write a stronger summary (40–120 words).',
  projects: 'Add at least 2 projects.',
  experience: 'Add at least 1 experience entry.',
  skills: 'Add more skills (target 8+).',
  links: 'Add a GitHub or LinkedIn link.',
  numbers: 'Add measurable impact (numbers) in bullets.',
  education: 'Complete education section (school, degree, dates).',
};

/** Returns up to 3 suggestion messages for what's missing (priority order). */
export function getAtsSuggestions(state: ResumeState, maxCount = 3): string[] {
  const out: string[] = [];
  const summaryWords = wordCount(state.summary);
  if (summaryWords < SUMMARY_MIN_WORDS || summaryWords > SUMMARY_MAX_WORDS)
    out.push(SUGGESTION_MESSAGES.summary);
  if (state.projects.length < MIN_PROJECTS) out.push(SUGGESTION_MESSAGES.projects);
  if (state.experience.length < 1) out.push(SUGGESTION_MESSAGES.experience);
  const skillsList = state.skills.split(',').map((s) => s.trim()).filter(Boolean);
  if (skillsList.length < MIN_SKILLS) out.push(SUGGESTION_MESSAGES.skills);
  const hasLink =
    (state.links.github && state.links.github.trim() !== '') ||
    (state.links.linkedin && state.links.linkedin.trim() !== '');
  if (!hasLink) out.push(SUGGESTION_MESSAGES.links);
  if (!hasMeasurableImpact(state)) out.push(SUGGESTION_MESSAGES.numbers);
  if (!hasCompleteEducation(state)) out.push(SUGGESTION_MESSAGES.education);
  return out.slice(0, maxCount);
}
