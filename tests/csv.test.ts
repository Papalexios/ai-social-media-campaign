import { describe, it, expect } from './tiny-test';
import { buildPostsCsv } from '../utils/export';

export const runCsvTests = () => {
  describe('buildPostsCsv', () => {
    it('escapes quotes and newlines correctly', () => {
      const csv = buildPostsCsv([{
        id: '1', platform: 'X', versionA: 'Hello, "world"', versionB: 'Line1\nLine2',
        angleA: 'Curiosity', angleB: 'Social Proof', viralScore: 88,
        imagePrompt: 'A "prompt" with, commas', sourceUrl: 'https://example.com'
      } as any]);
      expect(csv.includes('"Hello, ""world"""')).toBeTruthy();
      expect(csv.includes('"Line1 Line2"')).toBeTruthy();
      expect(csv.includes('"A ""prompt"" with, commas"')).toBeTruthy();
    });
  });
};

