import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

const STORAGE_KEY = 'resumeBuilderTemplate';

export type ResumeTemplate = 'classic' | 'modern' | 'minimal';

function loadTemplate(): ResumeTemplate {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'classic' || raw === 'modern' || raw === 'minimal') return raw;
  } catch {
    // ignore
  }
  return 'modern';
}

function saveTemplate(template: ResumeTemplate) {
  try {
    localStorage.setItem(STORAGE_KEY, template);
  } catch {
    // ignore
  }
}

type TemplateContextValue = {
  template: ResumeTemplate;
  setTemplate: (t: ResumeTemplate) => void;
};

const TemplateContext = createContext<TemplateContextValue | null>(null);

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [template, setTemplateState] = useState<ResumeTemplate>(loadTemplate);

  useEffect(() => {
    saveTemplate(template);
  }, [template]);

  const setTemplate = (t: ResumeTemplate) => setTemplateState(t);

  return (
    <TemplateContext.Provider value={{ template, setTemplate }}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  const ctx = useContext(TemplateContext);
  if (!ctx) throw new Error('useTemplate must be used within TemplateProvider');
  return ctx;
}
