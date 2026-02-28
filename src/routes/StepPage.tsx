import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import { useRB, STEP_KEYS } from '../context/RBContext';
import { PremiumLayout } from '../components/PremiumLayout';
import styles from './StepPage.module.css';

const STEP_TITLES: Record<string, string> = {
  '01-problem': 'Problem',
  '02-market': 'Market',
  '03-architecture': 'Architecture',
  '04-hld': 'HLD',
  '05-lld': 'LLD',
  '06-build': 'Build',
  '07-test': 'Test',
  '08-ship': 'Ship',
};

export function StepPage() {
  const { step } = useParams<{ step: string }>();
  const navigate = useNavigate();
  const { getStepIndex, canProceedToNext, hasArtifact } = useRB();

  const isValidStep = step && STEP_KEYS.includes(step as (typeof STEP_KEYS)[number]);
  const stepIndex = step && isValidStep ? getStepIndex(step) : 0;
  const stepSlug = STEP_KEYS[stepIndex];
  const contextTitle = `Step ${stepIndex + 1}: ${STEP_TITLES[stepSlug] ?? stepSlug}`;
  const hasCurrentArtifact = hasArtifact(stepSlug);
  const canNext = canProceedToNext(stepIndex);
  const isLastStep = stepIndex >= STEP_KEYS.length - 1;

  const prevStep = stepIndex > 0 ? STEP_KEYS[stepIndex - 1] : null;
  const nextStep = !isLastStep ? STEP_KEYS[stepIndex + 1] : null;

  const goNext = () => {
    if (nextStep && canNext) navigate(`/rb/${nextStep}`);
  };

  if (step && !isValidStep) {
    return <Navigate to="/rb/01-problem" replace />;
  }

  return (
    <PremiumLayout stepSlug={stepSlug} stepIndex={stepIndex} contextTitle={contextTitle}>
      <div className={styles.stepContent}>
        <p className={styles.placeholder}>
          Step {stepIndex + 1} — {STEP_TITLES[stepSlug] ?? stepSlug}. Complete the build panel and add an artifact to continue.
        </p>
        <nav className={styles.nav}>
          {prevStep ? (
            <Link to={`/rb/${prevStep}`} className={styles.navLink}>
              ← Previous
            </Link>
          ) : (
            <span className={styles.navDisabled}>← Previous</span>
          )}
          {nextStep ? (
            <button
              type="button"
              className={styles.navBtn}
              onClick={goNext}
              disabled={!canNext}
              title={!hasCurrentArtifact ? 'Add an artifact in the build panel to unlock Next' : undefined}
            >
              Next →
            </button>
          ) : (
            <Link to="/rb/proof" className={styles.navLink}>
              Go to Proof →
            </Link>
          )}
        </nav>
      </div>
    </PremiumLayout>
  );
}
