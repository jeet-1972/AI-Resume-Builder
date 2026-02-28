import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

const STEP_KEYS = ['01-problem', '02-market', '03-architecture', '04-hld', '05-lld', '06-build', '07-test', '08-ship'] as const;
export type StepKey = (typeof STEP_KEYS)[number];

export type StepStatus = 'pending' | 'uploaded' | 'worked' | 'error' | 'screenshot';

export interface RBState {
  artifacts: Record<StepKey, string>;
  stepStatus: Record<StepKey, StepStatus>;
  lovableLink: string;
  githubLink: string;
  deployLink: string;
}

const emptyArtifacts = STEP_KEYS.reduce((acc, k) => ({ ...acc, [k]: '' }), {} as Record<StepKey, string>);
const emptyStatus = STEP_KEYS.reduce((acc, k) => ({ ...acc, [k]: 'pending' as StepStatus }), {} as Record<StepKey, StepStatus>);

type RBContextValue = RBState & {
  setArtifact: (step: StepKey, value: string) => void;
  setStepStatus: (step: StepKey, status: StepStatus) => void;
  setLovableLink: (v: string) => void;
  setGithubLink: (v: string) => void;
  setDeployLink: (v: string) => void;
  hasArtifact: (step: StepKey) => boolean;
  canProceedToNext: (currentStepIndex: number) => boolean;
  getStepIndex: (pathStep: string) => number;
};

const RBContext = createContext<RBContextValue | null>(null);

export function RBProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RBState>({
    artifacts: emptyArtifacts,
    stepStatus: emptyStatus,
    lovableLink: '',
    githubLink: '',
    deployLink: '',
  });

  const setArtifact = useCallback((step: StepKey, value: string) => {
    setState((s) => ({ ...s, artifacts: { ...s.artifacts, [step]: value } }));
  }, []);

  const setStepStatus = useCallback((step: StepKey, status: StepStatus) => {
    setState((s) => ({ ...s, stepStatus: { ...s.stepStatus, [step]: status } }));
  }, []);

  const setLovableLink = useCallback((v: string) => setState((s) => ({ ...s, lovableLink: v })), []);
  const setGithubLink = useCallback((v: string) => setState((s) => ({ ...s, githubLink: v })), []);
  const setDeployLink = useCallback((v: string) => setState((s) => ({ ...s, deployLink: v })), []);

  const hasArtifact = useCallback(
    (step: StepKey) => (state.artifacts[step] ?? '').trim().length > 0,
    [state.artifacts]
  );

  const canProceedToNext = useCallback(
    (currentStepIndex: number) => {
      if (currentStepIndex >= STEP_KEYS.length - 1) return true;
      const currentStep = STEP_KEYS[currentStepIndex];
      return hasArtifact(currentStep);
    },
    [hasArtifact]
  );

  const getStepIndex = useCallback((pathStep: string): number => {
    const i = STEP_KEYS.indexOf(pathStep as StepKey);
    return i >= 0 ? i : 0;
  }, []);

  const value: RBContextValue = {
    ...state,
    setArtifact,
    setStepStatus,
    setLovableLink,
    setGithubLink,
    setDeployLink,
    hasArtifact,
    canProceedToNext,
    getStepIndex,
  };

  return <RBContext.Provider value={value}>{children}</RBContext.Provider>;
}

export function useRB() {
  const ctx = useContext(RBContext);
  if (!ctx) throw new Error('useRB must be used within RBProvider');
  return ctx;
}

export { STEP_KEYS };
