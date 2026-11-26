import { buildAwareness } from './expanded-awareness.mjs';
import { buildEnglish } from './expanded-english.mjs';
import { buildNumerical } from './expanded-numeric.mjs';
import { buildReasoning } from './expanded-reasoning.mjs';

import { buildAwarenessSecond } from './second-awareness.mjs';
import { buildEnglishSecond } from './second-english.mjs';
import { buildNumericalSecond } from './second-numeric.mjs';
import { buildReasoningSecond } from './second-reasoning.mjs';

export const questionPacks = [
  {id:'awareness-2027-r1',subject:'ga',build:buildAwareness},
  {id:'english-2027-r1',subject:'en',build:buildEnglish},
  {id:'numerical-2027-r1',subject:'num',build:buildNumerical},
  {id:'reasoning-2027-r1',subject:'rea',build:buildReasoning},
  {id:'awareness-2027-r2',subject:'ga',build:buildAwarenessSecond},
  {id:'english-2027-r2',subject:'en',build:buildEnglishSecond},
  {id:'numerical-2027-r2',subject:'num',build:buildNumericalSecond},
  {id:'reasoning-2027-r2',subject:'rea',build:buildReasoningSecond}
];
