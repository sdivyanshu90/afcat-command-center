import { buildAwareness, buildAwarenessFromFacts } from './expanded-awareness.mjs';
import { politySecond } from './facts-polity-second.mjs';
import { historySecond } from './facts-history-second.mjs';
import { scienceSecond } from './facts-science-second.mjs';
import { defenceSecond } from './facts-defence-second.mjs';
import { economySecond } from './facts-economy-second.mjs';

const normalize=prompt=>prompt.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
export function buildAwarenessSecond() {
  const existing=new Set(buildAwareness().map(row=>normalize(row.prompt)));
  return buildAwarenessFromFacts([...politySecond,...historySecond,...scienceSecond,...defenceSecond,...economySecond])
    .filter(row=>!existing.has(normalize(row.prompt)));
}
