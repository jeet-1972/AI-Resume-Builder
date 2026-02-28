import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

const STORAGE_KEY = 'resumeBuilderData';

function loadFromStorage(): ResumeState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return null;
    const p = parsed as Record<string, unknown>;
    const personal = (p.personal && typeof p.personal === 'object') ? (p.personal as Record<string, unknown>) : {};
    const linksObj = (p.links && typeof p.links === 'object') ? (p.links as Record<string, unknown>) : {};
    return {
      personal: {
        name: typeof personal.name === 'string' ? personal.name : '',
        email: typeof personal.email === 'string' ? personal.email : '',
        phone: typeof personal.phone === 'string' ? personal.phone : '',
        location: typeof personal.location === 'string' ? personal.location : '',
      },
      summary: typeof p.summary === 'string' ? p.summary : '',
      education: Array.isArray(p.education)
        ? p.education.map((e: unknown, i: number) => {
            const x = e && typeof e === 'object' ? (e as Record<string, unknown>) : {};
            return {
              id: typeof x.id === 'number' ? x.id : i + 1,
              school: typeof x.school === 'string' ? x.school : '',
              degree: typeof x.degree === 'string' ? x.degree : '',
              start: typeof x.start === 'string' ? x.start : '',
              end: typeof x.end === 'string' ? x.end : '',
            };
          })
        : [],
      experience: Array.isArray(p.experience)
        ? p.experience.map((e: unknown, i: number) => {
            const x = e && typeof e === 'object' ? (e as Record<string, unknown>) : {};
            return {
              id: typeof x.id === 'number' ? x.id : i + 1,
              company: typeof x.company === 'string' ? x.company : '',
              role: typeof x.role === 'string' ? x.role : '',
              start: typeof x.start === 'string' ? x.start : '',
              end: typeof x.end === 'string' ? x.end : '',
              description: typeof x.description === 'string' ? x.description : undefined,
            };
          })
        : [],
      projects: Array.isArray(p.projects)
        ? p.projects.map((e: unknown, i: number) => {
            const x = e && typeof e === 'object' ? (e as Record<string, unknown>) : {};
            const techStack = Array.isArray(x.techStack)
              ? (x.techStack as unknown[]).map((t) => (typeof t === 'string' ? t : ''))
              : [];
            return {
              id: typeof x.id === 'number' ? x.id : i + 1,
              name: typeof x.name === 'string' ? x.name : '',
              description: typeof x.description === 'string' ? x.description : '',
              techStack,
              liveUrl: typeof x.liveUrl === 'string' ? x.liveUrl : '',
              githubUrl: typeof x.githubUrl === 'string' ? x.githubUrl : '',
            };
          })
        : [],
      skills: (() => {
        const s = p.skills;
        if (s && typeof s === 'object' && !Array.isArray(s)) {
          const o = s as Record<string, unknown>;
          return {
            technical: Array.isArray(o.technical) ? (o.technical as string[]) : [],
            soft: Array.isArray(o.soft) ? (o.soft as string[]) : [],
            tools: Array.isArray(o.tools) ? (o.tools as string[]) : [],
          };
        }
        const str = typeof s === 'string' ? s : '';
        const list = str.split(',').map((x: string) => x.trim()).filter(Boolean);
        return { technical: list, soft: [], tools: [] };
      })(),
      links: {
        github: typeof linksObj.github === 'string' ? linksObj.github : '',
        linkedin: typeof linksObj.linkedin === 'string' ? linksObj.linkedin : '',
      },
    };
  } catch {
    return null;
  }
}

function saveToStorage(state: ResumeState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

type EducationEntry = {
  id: number;
  school: string;
  degree: string;
  start: string;
  end: string;
};

type ExperienceEntry = {
  id: number;
  company: string;
  role: string;
  start: string;
  end: string;
  description?: string;
};

type ProjectEntry = {
  id: number;
  name: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
};

export type SkillsByCategory = {
  technical: string[];
  soft: string[];
  tools: string[];
};

type Links = {
  github: string;
  linkedin: string;
};

type PersonalInfo = {
  name: string;
  email: string;
  phone: string;
  location: string;
};

export type ResumeState = {
  personal: PersonalInfo;
  summary: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: SkillsByCategory;
  links: Links;
};

type ResumeContextValue = {
  state: ResumeState;
  setState: (updater: (prev: ResumeState) => ResumeState) => void;
  loadSample: () => void;
};

const emptyState: ResumeState = {
  personal: {
    name: '',
    email: '',
    phone: '',
    location: '',
  },
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: { technical: [], soft: [], tools: [] },
  links: {
    github: '',
    linkedin: '',
  },
};

const ResumeBuilderContext = createContext<ResumeContextValue | null>(null);

function getInitialState(): ResumeState {
  const stored = loadFromStorage();
  return stored ?? emptyState;
}

export function ResumeBuilderProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<ResumeState>(getInitialState);

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const setState = (updater: (prev: ResumeState) => ResumeState) => {
    setStateInternal((prev) => updater(prev));
  };

  const loadSample = () => {
    setStateInternal({
      personal: {
        name: 'Aarya Sharma',
        email: 'aarya.sharma@example.com',
        phone: '+91-98765-43210',
        location: 'Bengaluru, India',
      },
      summary:
        'Software engineer focused on building clean, maintainable web applications with React and TypeScript.',
      education: [
        {
          id: 1,
          school: 'KodNest University',
          degree: 'B.Tech in Computer Science',
          start: '2019',
          end: '2023',
        },
      ],
      experience: [
        {
          id: 1,
          company: 'Acme Labs',
          role: 'Frontend Engineer',
          start: '2023',
          end: 'Present',
          description: 'Shipped 3 major features; reduced bundle size by 20%.',
        },
      ],
      projects: [
        {
          id: 1,
          name: 'AI Resume Builder',
          description: 'Built a guided resume builder with live preview using React and TypeScript.',
          techStack: ['React', 'TypeScript', 'Vite'],
          liveUrl: '',
          githubUrl: 'https://github.com/username/ai-resume-builder',
        },
      ],
      skills: {
        technical: ['React', 'TypeScript', 'Node.js'],
        soft: ['Problem Solving'],
        tools: ['Git', 'Docker'],
      },
      links: {
        github: 'https://github.com/username',
        linkedin: 'https://linkedin.com/in/username',
      },
    });
  };

  const value: ResumeContextValue = {
    state,
    setState,
    loadSample,
  };

  return <ResumeBuilderContext.Provider value={value}>{children}</ResumeBuilderContext.Provider>;
}

export function useResumeBuilder() {
  const ctx = useContext(ResumeBuilderContext);
  if (!ctx) {
    throw new Error('useResumeBuilder must be used within ResumeBuilderProvider');
  }
  return ctx;
}

