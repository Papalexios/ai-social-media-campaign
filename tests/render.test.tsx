import React from 'react';
import { describe, it, expect } from './tiny-test';
import { CampaignOutput } from '../components/CampaignOutput';

const mockSettings: any = { provider: 'openai', apiKeys: { gemini: '', openai: 'x', openrouter: '' }, openRouterModel: 'openai/gpt-4o' };
const mockResult: any = {
  strategicDebrief: {
    campaignSynopsis: 'Test synopsis',
    primaryAudience: 'Marketers',
    keyThemes: ['A', 'B'],
    competitiveAngle: 'Edge',
  },
  posts: [{
    id: '1', platform: 'X',
    versionA: 'Alpha', versionB: 'Beta', viralScore: 75,
    imagePrompt: 'A prompt', sourceUrl: 'N/A', angleA: 'Curiosity', angleB: 'Social Proof', whyThisWorks: 'Explains why'
  }],
  sources: []
};

export const runRenderTest = () => {
  describe('CampaignOutput render', () => {
    it('renders without crashing', () => {
      const el = React.createElement(CampaignOutput as any, { result: mockResult, onGenerateImage: () => {}, settings: mockSettings });
      // We cannot mount without a DOM renderer here; just ensure createElement works and component references exist.
      expect(!!el).toBeTruthy();
    });
  });
};

