export interface ParagraphMetrics {
  elapsedMs: number;
  wordsPerMinute: number;
  score: number;
}

export const normalizeParagraphText = (value: string) => value.normalize('NFC');

export const paragraphMatches = (target: string, input: string) => normalizeParagraphText(target) === normalizeParagraphText(input);

export const paragraphCharacterState = (target: string, input: string, index: number): 'pending' | 'correct' | 'incorrect' => {
  const entered = normalizeParagraphText(input)[index];
  if (entered === undefined) return 'pending';
  return entered === normalizeParagraphText(target)[index] ? 'correct' : 'incorrect';
};

export const paragraphMetrics = (target: string, elapsedMs: number): ParagraphMetrics => {
  const safeElapsed = Math.max(1_000, elapsedMs);
  const wordsPerMinute = Math.round((target.length / 5) / (safeElapsed / 60_000));
  return { elapsedMs: safeElapsed, wordsPerMinute, score: wordsPerMinute * 10 };
};
