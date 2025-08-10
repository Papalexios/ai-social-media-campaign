import { Post } from '../types';

export const buildPostsCsv = (posts: Post[]): string => {
  const headers = [
    'platform','versionA','versionB','angleA','angleB','viralScore','whyThisWorks','imagePrompt','sourceUrl'
  ];
  const rows = posts.map(p => [
    p.platform,
    (p.versionA || '').replace(/\n/g, ' '),
    (p.versionB || '').replace(/\n/g, ' '),
    p.angleA || '',
    p.angleB || '',
    String(p.viralScore ?? ''),
    (p.whyThisWorks || '').replace(/\n/g, ' '),
    (p.imagePrompt || '').replace(/\n/g, ' '),
    p.sourceUrl || ''
  ]);
  return [headers, ...rows]
    .map(r => r.map(field => {
      const f = String(field ?? '');
      return /[",\n]/.test(f) ? '"' + f.replace(/"/g, '""') + '"' : f;
    }).join(','))
    .join('\n');
};

