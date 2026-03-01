import { describe, it, expect } from 'vitest';
import type { ResumeState } from '../context/ResumeBuilderContext';
import { computeAtsScore, getAtsSuggestions, getAtsTier, ATS_TIER_LABELS } from './atsScore';

function emptyState(): ResumeState {
  return {
    personal: { name: '', email: '', phone: '', location: '' },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: { technical: [], soft: [], tools: [] },
    links: { github: '', linkedin: '' },
  };
}

describe('computeAtsScore', () => {
  it('starts at 0 for empty state', () => {
    expect(computeAtsScore(emptyState())).toBe(0);
  });

  it('adds 10 for name', () => {
    const s = emptyState();
    s.personal.name = 'Jane Doe';
    expect(computeAtsScore(s)).toBe(10);
  });

  it('adds 10 for email', () => {
    const s = emptyState();
    s.personal.email = 'jane@example.com';
    expect(computeAtsScore(s)).toBe(10);
  });

  it('adds 10 for summary > 50 chars', () => {
    const s = emptyState();
    s.summary = 'A'.repeat(51);
    expect(computeAtsScore(s)).toBe(10);
  });

  it('does not add 10 for summary <= 50 chars', () => {
    const s = emptyState();
    s.summary = 'A'.repeat(50);
    expect(computeAtsScore(s)).toBe(0);
  });

  it('adds 15 for at least one experience with bullets', () => {
    const s = emptyState();
    s.experience = [{ id: 1, company: '', role: '', start: '', end: '', description: 'Built X' }];
    expect(computeAtsScore(s)).toBe(15);
  });

  it('adds 10 for at least one education entry', () => {
    const s = emptyState();
    s.education = [{ id: 1, school: 'MIT', degree: '', start: '', end: '' }];
    expect(computeAtsScore(s)).toBe(10);
  });

  it('adds 10 for at least 5 skills', () => {
    const s = emptyState();
    s.skills.technical = ['a', 'b', 'c', 'd', 'e'];
    expect(computeAtsScore(s)).toBe(10);
  });

  it('adds 10 for at least one project', () => {
    const s = emptyState();
    s.projects = [{ id: 1, name: 'Proj', description: '', techStack: [], liveUrl: '', githubUrl: '' }];
    expect(computeAtsScore(s)).toBe(10);
  });

  it('adds 5 for phone', () => {
    const s = emptyState();
    s.personal.phone = '+1234567890';
    expect(computeAtsScore(s)).toBe(5);
  });

  it('adds 5 for LinkedIn', () => {
    const s = emptyState();
    s.links.linkedin = 'https://linkedin.com/in/jane';
    expect(computeAtsScore(s)).toBe(5);
  });

  it('adds 5 for GitHub', () => {
    const s = emptyState();
    s.links.github = 'https://github.com/jane';
    expect(computeAtsScore(s)).toBe(5);
  });

  it('adds 10 when summary contains action verb', () => {
    const s = emptyState();
    s.summary = 'I built and led the team.';
    expect(computeAtsScore(s)).toBe(10);
  });

  it('caps at 100', () => {
    const s = emptyState();
    s.personal.name = 'Jane';
    s.personal.email = 'j@x.com';
    s.summary = 'I built and led the team. Designed systems. Improved performance. '.repeat(2);
    s.experience = [{ id: 1, company: 'C', role: 'R', start: '', end: '', description: 'Did things' }];
    s.education = [{ id: 1, school: 'S', degree: 'D', start: '', end: '' }];
    s.skills.technical = ['a', 'b', 'c', 'd', 'e'];
    s.projects = [{ id: 1, name: 'P', description: '', techStack: [], liveUrl: '', githubUrl: '' }];
    s.personal.phone = '1';
    s.links.linkedin = 'l';
    s.links.github = 'g';
    expect(computeAtsScore(s)).toBe(100);
  });
});

describe('getAtsTier', () => {
  it('returns needsWork for 0-40', () => {
    expect(getAtsTier(0)).toBe('needsWork');
    expect(getAtsTier(40)).toBe('needsWork');
  });
  it('returns gettingThere for 41-70', () => {
    expect(getAtsTier(41)).toBe('gettingThere');
    expect(getAtsTier(70)).toBe('gettingThere');
  });
  it('returns strong for 71-100', () => {
    expect(getAtsTier(71)).toBe('strong');
    expect(getAtsTier(100)).toBe('strong');
  });
});

describe('ATS_TIER_LABELS', () => {
  it('has labels for all tiers', () => {
    expect(ATS_TIER_LABELS.needsWork).toBe('Needs Work');
    expect(ATS_TIER_LABELS.gettingThere).toBe('Getting There');
    expect(ATS_TIER_LABELS.strong).toBe('Strong Resume');
  });
});

describe('getAtsSuggestions', () => {
  it('returns missing name suggestion when name empty', () => {
    const suggestions = getAtsSuggestions(emptyState());
    const nameSuggestion = suggestions.find((s) => s.message.includes('name') && s.points === 10);
    expect(nameSuggestion).toBeDefined();
  });

  it('returns professional summary suggestion when summary short', () => {
    const s = emptyState();
    s.summary = 'Short.';
    const suggestions = getAtsSuggestions(s);
    const summarySuggestion = suggestions.find((s) => s.message.includes('summary') && s.points === 10);
    expect(summarySuggestion).toBeDefined();
  });

  it('does not suggest action verbs when summary is empty', () => {
    const suggestions = getAtsSuggestions(emptyState());
    const actionVerb = suggestions.find((s) => s.message.includes('action verb'));
    expect(actionVerb).toBeUndefined();
  });

  it('suggests action verbs when summary exists but has none', () => {
    const s = emptyState();
    s.summary = 'I did some stuff at a company. Nothing special.';
    const suggestions = getAtsSuggestions(s);
    const actionVerb = suggestions.find((s) => s.message.includes('action verb'));
    expect(actionVerb).toBeDefined();
    expect(actionVerb?.points).toBe(10);
  });
});
