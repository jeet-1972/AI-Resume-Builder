import { useTemplate } from '../context/TemplateContext';
import type { ResumeTemplate } from '../context/TemplateContext';
import styles from './TemplateTabs.module.css';

const TEMPLATES: { id: ResumeTemplate; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
];

export function TemplateTabs() {
  const { template, setTemplate } = useTemplate();

  return (
    <div className={styles.tabs} role="tablist" aria-label="Resume template">
      {TEMPLATES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={template === id}
          className={template === id ? styles.tabActive : styles.tab}
          onClick={() => setTemplate(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
