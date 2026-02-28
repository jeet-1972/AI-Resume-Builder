const ACTION_VERBS = new Set([
  'built',
  'developed',
  'designed',
  'implemented',
  'led',
  'improved',
  'created',
  'optimized',
  'automated',
]);

const NUMBER_PATTERN = /[\d]+|%\s|k\b|K\b|\d+%|\d+x/i;

/** First word of a trimmed line, lowercased (letters only). */
function firstWordOfLine(line: string): string {
  const word = line.trim().split(/\s+/)[0] ?? '';
  return word.replace(/[^a-z]/gi, '').toLowerCase();
}

/** True if any non-empty bullet (line) does not start with an action verb. */
export function needsActionVerb(text: string): boolean {
  const lines = text.trim().split(/\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return false;
  return lines.some((line) => {
    const word = firstWordOfLine(line);
    return word.length > 0 && !ACTION_VERBS.has(word);
  });
}

export function needsMeasurableImpact(text: string): boolean {
  if (!text.trim()) return false;
  return !NUMBER_PATTERN.test(text);
}
