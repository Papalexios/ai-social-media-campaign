// Simple in-browser smoke tests (run manually via a minimal test harness or console)
import { describe, it, expect } from './tiny-test';
import { safeJsonParse } from '../services/aiService';

export const runSmoke = () => {
  describe('safeJsonParse', () => {
    it('parses plain JSON', () => {
      const obj = safeJsonParse<{ a: number }>(JSON.stringify({ a: 1 }), 'plain');
      expect(obj.a).toBe(1);
    });
    it('parses JSON wrapped in markdown fences', () => {
      const obj = safeJsonParse<{ b: string }>("```json\n{\n  \"b\": \"ok\"\n}\n```", 'fenced');
      expect(obj.b).toBe('ok');
    });
  });
};

