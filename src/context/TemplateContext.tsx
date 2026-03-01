import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

const TEMPLATE_KEY = 'resumeBuilderTemplate';
const COLOR_KEY = 'resumeBuilderAccentColor';

export type ResumeTemplate = 'classic' | 'modern' | 'minimal';

export const ACCENT_COLORS = [
  { id: 'teal', label: 'Teal', hsl: 'hsl(168, 60%, 40%)' },
  { id: 'navy', label: 'Navy', hsl: 'hsl(220, 60%, 35%)' },
  { id: 'burgundy', label: 'Burgundy', hsl: 'hsl(345, 60%, 35%)' },
  { id: 'forest', label: 'Forest', hsl: 'hsl(150, 50%, 30%)' },
  { id: 'charcoal', label: 'Charcoal', hsl: 'hsl(0, 0%, 25%)' },
] as const;

export type AccentColorId = (typeof ACCENT_COLORS)[number]['id'];

function loadTemplate(): ResumeTemplate {
  try {
    const raw = localStorage.getItem(TEMPLATE_KEY);
    if (raw === 'classic' || raw === 'modern' || raw === 'minimal') return raw;
  } catch {
    // ignore
  }
  return 'modern';
}

function loadAccentColor(): AccentColorId {
  try {
    const raw = localStorage.getItem(COLOR_KEY);
    if (ACCENT_COLORS.some((c) => c.id === raw)) return raw as AccentColorId;
  } catch {
    // ignore
  }
  return 'teal';
}

function saveTemplate(template: ResumeTemplate) {
  try {
    localStorage.setItem(TEMPLATE_KEY, template);
  } catch {
    // ignore
  }
}

function saveAccentColor(id: AccentColorId) {
  try {
    localStorage.setItem(COLOR_KEY, id);
  } catch {
    // ignore
  }
}

export function getAccentHsl(id: AccentColorId): string {
  return ACCENT_COLORS.find((c) => c.id === id)?.hsl ?? ACCENT_COLORS[0].hsl;
}

type TemplateContextValue = {
  template: ResumeTemplate;
  setTemplate: (t: ResumeTemplate) => void;
  accentColor: AccentColorId;
  setAccentColor: (id: AccentColorId) => void;
  accentHsl: string;
};

const TemplateContext = createContext<TemplateContextValue | null>(null);

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [template, setTemplateState] = useState<ResumeTemplate>(loadTemplate);
  const [accentColor, setAccentColorState] = useState<AccentColorId>(loadAccentColor);

  useEffect(() => {
    saveTemplate(template);
  }, [template]);

  useEffect(() => {
    saveAccentColor(accentColor);
  }, [accentColor]);

  const setTemplate = (t: ResumeTemplate) => setTemplateState(t);
  const setAccentColor = (id: AccentColorId) => setAccentColorState(id);
  const accentHsl = getAccentHsl(accentColor);

  return (
    <TemplateContext.Provider
      value={{ template, setTemplate, accentColor, setAccentColor, accentHsl }}
    >
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  const ctx = useContext(TemplateContext);
  if (!ctx) throw new Error('useTemplate must be used within TemplateProvider');
  return ctx;
}
