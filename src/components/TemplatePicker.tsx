import { useTemplate } from '../context/TemplateContext';
import type { ResumeTemplate } from '../context/TemplateContext';
import { ACCENT_COLORS } from '../context/TemplateContext';
import type { AccentColorId } from '../context/TemplateContext';
import styles from './TemplatePicker.module.css';

const TEMPLATES: { id: ResumeTemplate; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
];

export function TemplatePicker() {
  const { template, setTemplate, accentColor, setAccentColor } = useTemplate();

  return (
    <div className={styles.picker}>
      <div className={styles.thumbnails}>
        {TEMPLATES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`${styles.thumb} ${template === id ? styles.thumbActive : ''}`}
            onClick={() => setTemplate(id)}
            aria-pressed={template === id}
            aria-label={`Select ${label} template`}
          >
            <div className={styles.thumbSketch} data-layout={id}>
              {id === 'classic' && (
                <>
                  <div className={styles.sketchLine} />
                  <div className={styles.sketchLine} />
                  <div className={styles.sketchLine} />
                  <div className={styles.sketchLine} />
                </>
              )}
              {id === 'modern' && (
                <>
                  <div className={styles.sketchSidebar} />
                  <div className={styles.sketchMain}>
                    <div className={styles.sketchLine} />
                    <div className={styles.sketchLine} />
                  </div>
                </>
              )}
              {id === 'minimal' && (
                <>
                  <div className={styles.sketchLineMinimal} />
                  <div className={styles.sketchLineMinimal} />
                  <div className={styles.sketchLineMinimal} />
                </>
              )}
            </div>
            {template === id && (
              <span className={styles.checkmark} aria-hidden>✓</span>
            )}
            <span className={styles.thumbLabel}>{label}</span>
          </button>
        ))}
      </div>
      <div className={styles.colorRow}>
        {ACCENT_COLORS.map((color) => (
          <button
            key={color.id}
            type="button"
            className={styles.colorCircle}
            style={{ background: color.hsl }}
            onClick={() => setAccentColor(color.id as AccentColorId)}
            aria-label={`Accent color: ${color.label}`}
            aria-pressed={accentColor === color.id}
            title={color.label}
          />
        ))}
      </div>
    </div>
  );
}
