import { passages, scenarios, vocabulary } from './second-english-material.mjs';

const afcat = 'https://careerairforce.gov.in/sites/default/files/2026-11/Notification-for-AFCAT-2027.pdf';
const grammar = 'https://dictionary.cambridge.org/grammar/british-grammar/';
const dictionary = 'https://dictionary.cambridge.org/dictionary/english/';
const titleCase = text => text[0].toUpperCase() + text.slice(1);
const lowerFirst = text => text[0].toLowerCase() + text.slice(1);
const normalized = text => text.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const topic = {
  reading: 'Reading Comprehension', cloze: 'Cloze Tests', order: 'Sentence Rearrangement',
  usage: 'Correct Word Usage', detection: 'Error Detection', completion: 'Sentence Completion',
  transform: 'Sentence Transformation', vocabulary: 'Synonyms and Antonyms'
};

function shuffle(values, salt) {
  let state = 2166136261;
  for (const char of salt) state = Math.imul(state ^ char.codePointAt(0), 16777619);
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    const j = (state >>> 0) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function readingPractice(emit) {
  for (const [index, [title, setting, action, evidence, response, result, lesson]] of passages.entries()) {
    const sentences = [setting, action, evidence, response, result];
    const body = sentences.join(' ');
    const read = [topic.reading, 'Original reading passage', title];
    const also = [topic.cloze, 'Cohesion and grammar', title];
    const rearrange = [topic.order, 'Paragraph sequencing', title];
    const types = [
      ['Detail', 'What step did the participants take after noticing a problem?', response,
        [action, evidence, result], 'The response is distinct from what had already happened and from its outcome.'],
      ['Cause and effect', 'Which result is reported after the corrective or investigative step?', result,
        [action, response, evidence], 'The last sentence describes a subsequent observation. The investigative step itself appears just before it.'],
      ['Evidence', 'Which earlier detail most directly explains why the participants investigated or changed their approach?', evidence,
        [setting, response, result], 'The key detail is the observation made before the additional step. The response addresses the difficulty that observation exposed.'],
      ['Inference', 'Which conclusion is best supported by the passage as a whole?', lesson,
        ['The favourable final result can safely be expected in every other setting without further checks.',
          'The initial approach should have been retained unaltered because any first result outweighs later observations.',
          'The reported problem can be attributed solely to the personal skill of the people involved.'],
        'The evidence from the initial observation and the outcome under the revised approach supports a specific conclusion. The passage gives limited grounds for generalising further.']
    ];
    for (const [skill, stem, correct, alternatives, rationale] of types) {
      emit(...read, skill, stem + '\n\n' + body, correct, alternatives,
        rationale + ' The passage states: “' + (skill === 'Inference' ? result : correct) + '”',
        skill === 'Inference' ? 'Hard' : skill === 'Evidence' ? 'Medium' : 'Easy', afcat);
    }
    const frame = [
      ['For this reason', ['In much the same way', 'Before the original step', 'Rather unexpectedly'], 'a response to the evidence'],
      ['In response', ['In conclusion', 'In addition to the first trial', 'Before the issue arose'], 'a response to the observed problem'],
      ['Accordingly', ['Regardless of the finding', 'By contrast', 'Before any observations'], 'a step prompted by the preceding observation']
    ][index % 3];
    emit(...also, 'Connectors expressing a response',
      'Choose the connector that introduces the next step as a response to the preceding evidence.\n\n' +
        [setting, action, evidence, '___, ' + lowerFirst(response), result].join(' '),
      frame[0], frame[1], '“' + frame[0] + '” marks ' + frame[2] + '. The step was taken after the issue became apparent.',
      'Medium', grammar + 'conjunctions');
    emit(...also, 'Time sequence across clauses',
      'Choose the phrase that shows the earlier approach was followed by the later response.\n\n' + [setting, action, evidence].join(' ') +
        ' The account describes what happened initially ___ describing the additional step that followed. ' + result,
      'before', ['rather than', 'without', 'in spite of'],
      '“Before” orders two stages of the account. “Without” and “rather than” would exclude the later description; “in spite of” would make it a concession.',
      'Medium', grammar + 'before');
    emit(...also, 'Presenting the limit of evidence',
      'Complete the final sentence with a connector that adds a caution contrasting with the reported result.\n\n' + body +
        ' ___, the account gives no grounds for expecting exactly the same outcome in every setting.',
      'However', ['Equally', 'For instance', 'In other words'],
      '“However” contrasts the reported result with a limit on what can be inferred from that result. “In other words” would introduce a restatement.',
      'Medium', grammar + 'conjunctions');
    const labels = shuffle(['P', 'Q', 'R', 'S', 'T'], title);
    const ordered = sequence => sequence.map(i => labels[i]).join(' → ');
    const jumbled = shuffle(sentences.map((text, i) => labels[i] + '. ' + text), title + ' full order').join('\n');
    emit(...rearrange, 'Story development',
      'Arrange the sentences to present the setting, initial response or action, subsequent evidence, later intervention and outcome.\n\n' + jumbled,
      ordered([0, 1, 2, 3, 4]),
      [[0, 2, 3, 1, 4], [0, 1, 3, 4, 2], [1, 0, 2, 4, 3]].map(ordered),
      labels[0] + ' creates the setting. ' + labels[1] + ' explains what happened first, ' + labels[2] +
        ' supplies the observation, ' + labels[3] + ' responds to it, and ' + labels[4] + ' gives the outcome.',
      'Medium', afcat);
    const omittedIndex = 1 + index % 3;
    const rest = sentences.filter((_, i) => i !== omittedIndex);
    const gaps = ['Before the first sentence', 'Between the first and second sentences', 'Between the second and third sentences',
      'Between the third and fourth sentences', 'After the fourth sentence'];
    const rationale = ['',
      'The sentence describes what was first done. It follows the opening situation and precedes the observation that exposed a problem.',
      'The sentence introduces a finding from the initial approach. Its place is between that approach and the action taken in response.',
      'The sentence explains the later intervention. It follows the observation that motivates it and precedes the resulting improvement or finding.'
    ][omittedIndex];
    emit(...rearrange, 'Inserting a missing sentence',
      'Where should the missing sentence be inserted to restore the paragraph’s original sequence?\n\n' +
        rest.map((text, i) => (i + 1) + '. ' + text).join('\n') + '\n\nMissing sentence: ' + sentences[omittedIndex],
      gaps[omittedIndex], gaps.filter((_, i) => i !== 4 && i !== omittedIndex), rationale,
      'Hard', afcat);
  }
}

function grammarPractice(emit) {
  for (const [index, [role, item, items, place, receiver, event, inspection, problem, purpose, past, verb, ing]] of scenarios.entries()) {
    const who = 'the ' + role;
    const single = 'the ' + item;
    const several = 'the ' + items;
    const site = 'the ' + place;
    const to = 'the ' + receiver;
    const occasion = 'the ' + event;
    const audit = 'the ' + inspection;
    const error = (skill, label, segments, mistake, rationale, difficulty = 'Medium', reference = 'using-english') => {
      emit(topic.detection, label, skill, skill, 'Which segment needs correction? Read the sentence as standard written English.\n\n' +
        segments.join(' / '), segments[mistake], segments.filter((_, i) => i !== mistake), rationale, difficulty, grammar + reference);
    };
    const complete = (skill, label, sentence, answer, options, rationale, difficulty = 'Medium', reference = 'using-english') => {
      emit(topic.completion, label, skill, skill, 'Choose the correct completion for the sentence below.\n\n' + sentence,
        answer, options, rationale, difficulty, grammar + reference);
    };
    const rewrite = (skill, complex, simple, alternatives, rationale, difficulty = 'Medium') => {
      emit(topic.transform, 'Complex to Simple', skill, skill,
        'Select the simple sentence that preserves the meaning of the complex sentence.\n\n' + complex, simple, alternatives,
        rationale, difficulty, grammar + 'using-english');
    };
    const use = (skill, sentence, answer, options, rationale) => {
      emit(topic.usage, 'Formal and idiomatic usage', skill, skill, 'Choose the expression most appropriate in standard written English.\n\n' +
        sentence, answer, options, rationale, 'Medium', grammar + 'using-english');
    };

    error('Countable comparison', 'Quantifiers', [
      titleCase(who) + ' found', 'less ' + items, 'in ' + site, 'than the list showed.'
    ], 1, 'Use “fewer” in this formal comparison because ' + items + ' are individually countable. “Less” normally measures an amount rather than a number.', 'Easy');
    error('Indirect-question word order', 'Word Order', [
      titleCase(to) + ' asked', 'why had ' + who + ' moved', several, 'before ' + occasion + '.'
    ], 1, 'The embedded question uses statement order: “why ' + who + ' had moved”. Keep inversion for a direct question.');
    error('Parallel actions in a list', 'Parallelism', [
      titleCase(who) + ' checked the checklist,', 'counted ' + several + ',',
      'and storing the replacements', 'in ' + site + '.'
    ], 2, 'The other verbs are past simple. For parallel structure and a completed sequence, use “and stored the replacements”.', 'Easy');
    error('Its and it’s', 'Possessives', [
      'After ' + audit + ',', 'each ' + item + ' was moved', 'from it’s usual shelf', 'to the table in ' + site + '.'
    ], 2, '“Its” is the possessive determiner, without an apostrophe. “It’s” is short for “it is” or “it has”.', 'Easy');
    error('Person after a fronted preposition', 'Relative Pronouns', [
      titleCase(to), 'to which the defect had been reported,', 'asked for a follow-up check', 'before ' + occasion + '.'
    ], 1, 'The relative pronoun refers to a person after the preposition “to”. Use the formal object form “to whom”.', 'Hard', 'relative-pronouns');
    error('Double superlative', 'Comparison', [
      titleCase(who) + ' described', 'the new inspection plan', 'as the most easiest method', 'for checking ' + several + '.'
    ], 2, 'Use either a regular -est superlative or “most” followed by an adjective that needs it. “Easiest” already carries the superlative.', 'Easy');
    error('One followed by a plural noun', 'Agreement', [
      'One of ' + several, 'are still missing', 'even after ' + audit, 'was completed.'
    ], 1, 'The subject is “one”, which takes “is”. The plural noun after “of” identifies the set from which the one item is selected.', 'Medium', 'subject-verb-agreement');
    error('Avoid with a gerund', 'Verb Patterns', [
      'At ' + audit + ',', titleCase(who) + ' avoided', 'to move ' + several, 'without checking the list.'
    ], 2, '“Avoid” is followed by an -ing form here: “avoided moving”. It does not take a to-infinitive in this construction.', 'Medium');
    error('Information as a mass noun', 'Countability', [
      titleCase(to) + ' asked for', 'additional informations', 'about ' + several, 'before authorising ' + occasion + '.'
    ], 1, '“Information” is normally uncountable. Use “additional information” or specify countable items such as “additional details”.', 'Easy');
    error('Dangling purpose modifier', 'Modifiers', [
      'To finish ' + audit + ' on time,', 'the list of ' + items, 'was checked twice', 'before ' + occasion + '.'
    ], 1, 'The understood agent of “to finish” should be the main subject. Use “' + who + ' checked the list of ' + items + ' twice”, naming the person who can finish the check.', 'Hard');
    complete('Non-defining which clause', 'Relative Clauses',
      titleCase(single) + ', ___ was kept in ' + site + ', had to be inspected again.', 'which', ['that', 'where', 'whom'],
      'A non-defining relative clause about a thing uses “which”; “that” does not introduce this comma-framed clause.', 'Medium', 'relative-clauses-defining-and-non-defining');
    complete('Possessive relative whose', 'Relative Clauses',
      'The employee ___ signature appears on the record worked on ' + several + ' in ' + site + '.', 'whose', ['whom', 'which', 'who'],
      '“Whose” shows that the signature belongs to the employee. The blank comes before the possessed noun “signature”.', 'Medium', 'relative-pronouns');
    complete('Unfulfilled duty in the past', 'Modal Verbs',
      titleCase(who) + ' had a duty to report ' + problem + ' during ' + audit + ' but failed to do so. The employee ___ reported the problem then.',
      'should have', ['had never', 'may have', 'would always'],
      '“Should have” plus the past participle states what was advisable or required in the past but did not happen.', 'Hard', 'modal-verbs-and-modality');
    complete('Hypothetical second conditional', 'Conditionals',
      'If ' + site + ' had more room, ' + who + ' ___ spare ' + items + ' there. At present it is too small.',
      'would keep', ['will keep', 'had kept', 'has kept'],
      'Use a past form in the hypothetical if-clause and “would” plus the base form in its result. The final sentence makes clear this is not the current arrangement.', 'Medium', 'conditionals-if');
    const periods = [['last Tuesday', 'since', 'a starting day'], ['three days', 'for', 'a length of time'],
      ['the start of the week', 'since', 'a starting point'], ['several weeks', 'for', 'a duration']];
    const [period, preposition, kind] = periods[index % periods.length];
    complete('Past starting point and duration', 'Time Prepositions',
      titleCase(single) + ' has been kept in ' + site + ' ___ ' + period + '.', preposition, ['at', 'during', preposition === 'since' ? 'for' : 'since'],
      '“' + preposition + '” connects the continuing situation to ' + kind + '. “Since” introduces the starting point, and “for” introduces the duration.', 'Medium', 'for-or-since');
    complete('Correlative both and', 'Conjunctions',
      'Both ' + who + ' ___ ' + to + ' must sign before ' + occasion + ' can begin.', 'and', ['or', 'nor', 'but'],
      'The correlative pair is “both … and”. It includes two signatories and agrees with the plural requirement.', 'Easy');
    complete('Passive infinitive after a deadline',
      'Passive Voice', titleCase(several) + ' are damaged and cannot be used. They need ___ before ' + occasion + '.',
      'to be replaced', ['to have replacing', 'replace', 'to replacing'],
      'The items receive the action rather than perform it. After “need” use the passive infinitive “to be replaced”.', 'Medium');
    complete('No sooner inversion', 'Inversion',
      'No sooner ___ ' + who + ' finished ' + audit + ' than ' + to + ' called to ask for the results.',
      'had', ['did', 'was', 'has'],
      '“No sooner” at the start triggers inversion. “Had” plus “finished” describes the first of two past actions.', 'Hard');
    complete('Verb pattern preposition plus gerund', 'Prepositions',
      titleCase(who) + ' was responsible ___ before ' + occasion + '.', 'for ' + ing + ' ' + several,
      ['to ' + ing + ' ' + several, 'about ' + verb + ' ' + several, 'in ' + verb + ' ' + several],
      '“Responsible for” is the usual construction. An action after the preposition “for” takes the -ing form.', 'Medium');

    rewrite('Reduced passive relative clause',
      'The ' + items + ' that were kept in ' + site + ' were counted during ' + audit + '.',
      'The ' + items + ' kept in ' + site + ' were counted during ' + audit + '.',
      ['The ' + items + ' kept on top of ' + site + ' were counted during ' + audit + '.',
        'The ' + items + ' near ' + site + ' were counted after ' + audit + '.',
        'The ' + items + ' were counted in ' + site + ' after ' + audit + '.'],
      'The passive relative clause “that were kept in” can become the participle phrase “kept in”. The original place of storage and time of counting stay the same.');
    rewrite('Because clause to causal preposition',
      'Because the team had found ' + problem + ', ' + to + ' delayed ' + occasion + '.',
      'Because of ' + problem + ', ' + to + ' delayed ' + occasion + '.',
      ['Despite ' + problem + ', ' + to + ' delayed ' + occasion + '.',
        'Before any discovery of ' + problem + ', ' + to + ' delayed ' + occasion + '.',
        'During ' + occasion + ', ' + to + ' dealt with ' + problem + '.'],
      '“Because of” takes a noun phrase and preserves the causal connection between the problem and the delay.');
    rewrite('Purpose clause to infinitive',
      'The ' + role + ' visited ' + site + ' so that they could ' + verb + ' ' + several + '.',
      'The ' + role + ' visited ' + site + ' to ' + verb + ' ' + several + '.',
      ['Before the visit, the ' + role + ' had ' + past + ' ' + several + ' in ' + site + '.',
        'The ' + role + ' visited ' + site + ' without ' + ing + ' ' + several + '.',
        'The ' + role + ' visited ' + site + ' after ' + ing + ' ' + several + '.'],
      'The to-infinitive states the purpose of the visit. The same person is understood to visit and to perform the intended action.');
    rewrite('A necessary condition with without',
      'Unless ' + who + ' signs the checklist, ' + to + ' cannot begin ' + occasion + '.',
      'Without the ' + role + '’s signature on the checklist, ' + to + ' cannot begin ' + occasion + '.',
      ['After the ' + role + '’s signature on the checklist, ' + to + ' must immediately begin ' + occasion + '.',
        'Despite the ' + role + '’s signature, ' + to + ' cannot begin ' + occasion + '.',
        'Instead of ' + who + ', ' + to + ' must sign the checklist before ' + occasion + '.'],
      '“Without” converts the missing necessary condition into a prepositional phrase. Obtaining the signature remains required, without being stated as sufficient on its own.', 'Hard');
    rewrite('So that cannot to too to',
      'The replacement ' + item + ' was so badly damaged that nobody could use it for ' + purpose + '.',
      'The replacement ' + item + ' was too badly damaged for anyone to use for ' + purpose + '.',
      ['The replacement ' + item + ' was barely damaged and suitable for ' + purpose + '.',
        'The replacement ' + item + ' was damaged during use for ' + purpose + '.',
        'The replacement ' + item + ' was damaged but safe to use for ' + purpose + '.'],
      '“Too badly damaged for anyone to use” states the same degree and resulting impossibility, using an infinitive in place of the finite result clause.');

    use('Request a copy of a document',
      titleCase(to) + ' asked for a copy ___ the list of ' + items + ' used during ' + audit + '.', 'of', ['on', 'with', 'at'],
      '“A copy of” identifies the original document being reproduced. The list is the object copied.');
    use('Comply with a requirement',
      'Anyone working in ' + site + ' must ___ the written requirements before ' + occasion + '.', 'comply with',
      ['comply at', 'comply to', 'comply on'], '“Comply with” pairs the verb “comply” with a standard, rule or requirement that must be followed.');
  }
}

function vocabularyPractice(emit) {
  for (const [word, synonym, antonym, context] of vocabulary) {
    const source = dictionary + encodeURIComponent(word.replaceAll(' ', '-'));
    const family = 'Vocabulary in context · ' + word;
    const example = context.replace('___', word);
    const distractors = (column, anchored) => {
      const seen = new Set([word, synonym, antonym].map(normalized));
      const choices = [];
      for (const row of shuffle(vocabulary, word + ' ' + column + ' ' + anchored)) {
        const candidate = row[column];
        const key = normalized(candidate);
        if (seen.has(key)) continue;
        seen.add(key);
        choices.push(candidate);
        if (choices.length === 2) break;
      }
      return [anchored, ...choices];
    };
    emit(topic.vocabulary, 'Synonyms', family, 'Synonym in context',
      example + '\n\nWhich expression is closest in meaning to “' + word + '” in this context?',
      synonym, distractors(1, antonym),
      'In this sentence “' + word + '” is closest to “' + synonym + '”. The relevant contrast is “' + antonym + '”.',
      'Medium', source);
    emit(topic.vocabulary, 'Antonyms', family, 'Antonym in context',
      example + '\n\nWhich expression is closest to the opposite of “' + word + '” in this context?',
      antonym, distractors(2, synonym),
      'The contextual meaning is “' + synonym + '”, so “' + antonym + '” gives the closest contrast.',
      'Medium', source);
    const pool = vocabulary.filter(other => other[0]!==word && ![synonym,antonym].includes(other[0]));
    const candidates = shuffle(pool, 'word choice ' + word).slice(0,2).map(row=>row[0]);
    const distractor = [antonym,...candidates];
    if (new Set([word,...distractor].map(normalized)).size !== 4) continue;
    emit(topic.usage, 'Contextual Vocabulary', family, 'Context clues',
      'Complete the sentence with the word that best matches its meaning.\n\n' + context,
      word, distractor,
      '“' + word + '” means “' + synonym + '” in this sentence. The rest of the sentence supplies the context that rules out its contrast “' + antonym + '”.',
      'Medium', source);
  }
}

export function buildEnglishSecond() {
  const rows = [];
  const prompts = new Set();
  function emit(name, subtopic, family, concept, prompt, correct, distractors, explanation, difficulty, source) {
    const key = normalized(prompt);
    const options = shuffle([correct, ...distractors], prompt);
    if (prompts.has(key)) throw new Error('Duplicate English practice prompt: ' + prompt);
    if (options.length !== 4 || new Set(options.map(normalized)).size !== 4) {
      throw new Error('English practice item has non-distinct options: ' + prompt);
    }
    prompts.add(key);
    const variantGroup = ['Original reading passage','Cohesion and grammar','Paragraph sequencing'].includes(subtopic)
      ? 'english-passage-' + family : undefined;
    rows.push({subject:'en',topic:name,subtopic,prompt,options,answer:options.indexOf(correct),explanation,difficulty,source,
      classification:'ORIGINAL_AFCAT_STYLE',family,concept,variantGroup,style:concept});
  }
  readingPractice(emit);
  grammarPractice(emit);
  vocabularyPractice(emit);
  return rows;
}
