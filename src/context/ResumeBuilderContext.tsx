import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

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
};

type ProjectEntry = {
  id: number;
  name: string;
  description: string;
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
  skills: string;
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
  skills: '',
  links: {
    github: '',
    linkedin: '',
  },
};

const ResumeBuilderContext = createContext<ResumeContextValue | null>(null);

export function ResumeBuilderProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<ResumeState>(emptyState);

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
        },
      ],
      projects: [
        {
          id: 1,
          name: 'AI Resume Builder',
          description: 'Built a guided resume builder with live preview using React and TypeScript.',
        },
      ],
      skills: 'React, TypeScript, Node.js, REST APIs, Git',
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

