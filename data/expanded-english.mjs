import { collocations, homonyms, homophones, idioms, terms, vocabulary } from './english-lexicon.mjs';

const syllabus = 'https://careerairforce.gov.in/sites/default/files/2026-11/Notification-for-AFCAT-2027.pdf';
const grammar = 'https://dictionary.cambridge.org/grammar/british-grammar/';
const dictionary = 'https://dictionary.cambridge.org/dictionary/english/';
const grammarUsage = grammar + 'using-english';
const topic = {
  reading: 'Reading Comprehension', error: 'Error Detection', completion: 'Sentence Completion',
  usage: 'Correct Word Usage', vocabulary: 'Synonyms and Antonyms', cloze: 'Cloze Tests',
  idiom: 'Idioms and Phrases', analogy: 'Analogies', arrangement: 'Sentence Rearrangement',
  substitution: 'One-Word Substitution', transformation: 'Sentence Transformation', homonym: 'Homonyms'
};
const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const normalize = value => value.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const labelled = value => value.charAt(0).toUpperCase() + value.slice(1);
const vocabRef = word => dictionary + slug(word);
function shuffle(values, prompt) {
  let state = 2166136261;
  for (const char of prompt) state = Math.imul(state ^ char.codePointAt(0), 16777619);
  for (let i = values.length - 1; i > 0; i--) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    const j = (state >>> 0) % (i + 1);
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}
function others(rows, current, position, excluded = []) {
  const used = new Set([current[position], ...excluded].map(normalize));
  return shuffle([...rows], current[0] + position).flatMap(row => {
    const val = row[position];
    const key = normalize(val);
    if (used.has(key)) return [];
    used.add(key);
    return [val];
  }).slice(0, 3);
}

function relatedVocabulary(word) {
  const related = new Set([word]);
  // Related entries, including shared glosses, are seldom safe distractors for a contextual question.
  for (let pass = 0; pass < 2; pass++) {
    for (const row of vocabulary) {
      const meanings = row.slice(0, 3);
      if (meanings.some(meaning => related.has(meaning))) {
        for (const meaning of meanings) related.add(meaning);
      }
    }
  }
  return related;
}

function lexical(emit) {
  for (const row of vocabulary) {
    const [word, similar, opposite, context] = row;
    const family = 'en-vocabulary-' + slug(word);
    const example = context.replace('___', word);
    const related = relatedVocabulary(word);
    // Use the antonym as an explicit polarity distractor, then choose unrelated words of the same form.
    emit(topic.vocabulary, 'Synonyms', family, example + '\n\nWhich word is closest in meaning to “' + word + '” here?',
      similar, [opposite, ...others(vocabulary, row, 1, [...related]).slice(0, 2)],
      'Here “' + word + '” means “' + similar + '”. Read the clause that provides the clue. “' + opposite + '” reverses the relevant meaning.',
      'Medium', vocabRef(word), 'Meaning in context');
    emit(topic.vocabulary, 'Antonyms', family, 'In the following context, choose the word most nearly opposite in meaning to “' + word + '”.\n\n' + example,
      opposite, [similar, ...others(vocabulary, row, 2, [...related]).slice(0, 2)],
      'The relevant sense of “' + word + '” is “' + similar + '”. Its contrast in this context is “' + opposite + '”.',
      'Medium', vocabRef(word), 'Antonym in context');
    const matchedArticle = context.match(/\b(an|a) ___/i)?.[1]?.toLowerCase();
    const distractors = shuffle(vocabulary.map(v => v[0]).filter(candidate => !related.has(candidate) &&
      (!matchedArticle || (/^[aeiou]/i.test(candidate) === (matchedArticle === 'an')))), word + '-blank').slice(0, 2);
    // For a/an questions make the contrast agree with the article as well.
    const contrast = matchedArticle && /^[aeiou]/i.test(opposite) !== (matchedArticle === 'an')
      ? vocabulary.map(v => v[0]).find(candidate => !related.has(candidate) && !distractors.includes(candidate) && /^[aeiou]/i.test(candidate) === (matchedArticle === 'an'))
      : opposite;
    emit(topic.usage, 'Contextual Vocabulary', family, 'Choose the word that fits both the sentence and its context.\n\n' + context,
      word, [...distractors, contrast], '“' + word + '” means “' + similar + '”, which matches the evidence given in the sentence.',
      'Medium', vocabRef(word), 'Contextual cloze');
  }
  const similarIdioms = {
    'a blessing in disguise': ['every cloud has a silver lining'],
    'a close shave': ["skin of one's teeth"],
    'a red herring': ['bark up the wrong tree'],
    'a shot in the dark': ['out of the blue'],
    'bury the hatchet': ['let sleeping dogs lie'],
    'call it a day': ['throw in the towel'],
    'get the ball rolling': ['keep the ball rolling'],
    'get wind of': ['word of mouth'],
    'in the bag': ['in black and white'],
    "keep one's chin up": ['weather the storm'],
    'let the cat out of the bag': ['spill the beans'],
    'spill the beans': ['let the cat out of the bag'],
    'on the same page': ['see eye to eye'],
    'see eye to eye': ['on the same page'],
    'rise to the occasion': ['go the extra mile'],
    'take the bull by the horns': ['bite the bullet'],
    'take it with a pinch of salt': ['give the benefit of the doubt']
  };
  for (const row of idioms) {
    const [phrase, gloss, situation] = row;
    const family = 'en-idiom-' + slug(phrase);
    const pool = idioms.filter(candidate => !(similarIdioms[phrase] ?? []).includes(candidate[0]) &&
      !(similarIdioms[candidate[0]] ?? []).includes(phrase));
    emit(topic.idiom, 'Everyday Idioms', family,
      'Choose the meaning of the idiom “' + phrase + '”.',
      gloss, others(pool, row, 1), '“' + phrase + '” means ' + gloss + '. For example, ' + situation + '.',
      'Medium', syllabus, 'Idiom interpretation');
    emit(topic.idiom, 'Idioms in Context', family,
      'Which idiom best expresses the situation?\n\n' + labelled(situation) + '.',
      phrase, others(pool, row, 0), 'The phrase “' + phrase + '” describes ' + gloss + '. The situation provides a concrete example of that meaning.',
      'Medium', syllabus, 'Idiom application');
  }
  for (const row of terms) {
    const [word, definition, subtopic] = row;
    const family = 'en-substitution-' + slug(word);
    const pool = terms.filter(other => other[2] === subtopic);
    emit(topic.substitution, subtopic, family, 'Choose a single word for the following expression.\n\n' + labelled(definition) + '.',
      word, others(pool, row, 0), '“' + word + '” is the term for ' + definition + '.', 'Medium', vocabRef(word), 'Definition to term');
    emit(topic.substitution, subtopic, family, 'Which expression can replace “' + word + '” without changing its core meaning?',
      definition, others(pool, row, 1), 'The defining meaning of “' + word + '” is ' + definition + '. Compare the object, action or person in each other explanation.',
      'Medium', vocabRef(word), 'Term to paraphrase');
  }
  const seenPairs = new Set();
  for (const [a, b, aExample, bExample] of homophones) {
    const pair = [a, b].sort().join('-');
    if (seenPairs.has(pair)) continue;
    seenPairs.add(pair);
    const family = 'en-sound-' + pair;
    const pool = homophones.flatMap(row => row.slice(0, 2)).filter(w => w !== a && w !== b);
    const close = shuffle([...new Set(pool)], pair).slice(0, 2);
    const note = 'The forms sound alike in many varieties of English. Read the surrounding words to choose the meaning and spelling. The completed examples are “' +
      aExample.replace('___', a) + '” and “' + bExample.replace('___', b) + '”';
    emit(topic.homonym, 'Shared Sound', family,
      'Choose the spelling required by the meaning.\n\n' + aExample,
      a, [b, ...close], note, 'Easy', vocabRef(a), 'Confusable spellings');
    emit(topic.homonym, 'Shared Sound', family,
      'Select the correct word for the blank.\n\n' + bExample,
      b, [a, ...close], note, 'Easy', vocabRef(b), 'Confusable spellings');
    emit(topic.homonym, 'Shared Sound', family,
      'Select the pair of words that completes these two sentences in order.\n\n' + aExample + '\n' + bExample,
      a + ' / ' + b, [b + ' / ' + a, a + ' / ' + a, b + ' / ' + b], note, 'Medium', syllabus, 'Contrast of homophones');
  }
  for (const row of homonyms) {
    const [word, a, b, aSense, bSense] = row;
    const family = 'en-spelling-' + slug(word);
    for (const [example, sense, alternative, slot] of [[a, aSense, bSense, 3], [b, bSense, aSense, 4]]) {
      emit(topic.homonym, 'Shared Spelling', family,
        'What does “' + word + '” mean in this sentence?\n\n' + example.replace('___', word),
        sense, [alternative, ...others(homonyms, row, slot, [sense, alternative]).slice(0, 2)],
        'This use of “' + word + '” means ' + sense + '. The same spelling can also mean ' + alternative + ' in a different setting.',
        'Medium', vocabRef(word), 'Meaning contrast');
    }
  }
  for (const [correct, a, b, c, prompt, explanation] of collocations) {
    const phrasal = /___ (?:off|down|out|up|into|in|on)\b/.test(prompt) && /(?:call off|turn down|put out|bring up|run out|look into|carry out|hand in|take on|see someone off|stand in for)/.test(explanation);
    const subtopic = phrasal ? 'Phrasal Verbs' : 'Collocation';
    emit(phrasal ? topic.idiom : topic.usage, subtopic, 'en-collocation-' + slug(explanation).slice(0, 65),
      'Select the standard English word combination.\n\n' + prompt,
      correct, [a, b, c], explanation, 'Medium', vocabRef(correct), phrasal ? 'Phrasal verb in context' : 'Collocation');
  }
}

// Each passage combines an authored setting, intervention, observation, and qualified conclusion.
const cases = `
The night bus|A college ran an evening shuttle for students after the public buses stopped.|For a month it moved the last departure from the gate to the library entrance.|The passenger count stayed nearly the same, but reports of unsafe walks fell.|The transport officer kept both measures and planned to repeat the trial after winter.|The new stop may have improved a part of the journey that total passenger counts did not capture.|safety on the walk to the bus
Window seats|A community centre wanted more visitors to stay for afternoon activities.|It rearranged the chairs around the busiest window.|More people stayed near the window, yet fewer used a previously popular corner.|The manager compared the total length of visits before ordering more furniture.|A larger crowd in one spot could reflect redistribution rather than an overall gain.|movement between seating areas
The water bottle|A school installed a new refill tap near its sports ground.|At first it recorded how often pupils pressed the tap button.|Some pupils pressed it repeatedly while filling a single bottle.|The staff added a meter that recorded the volume of water used.|Counting presses was an unreliable proxy for the amount of water dispensed.|volume rather than button presses
Quiet delivery|A neighbourhood shop moved its delivery from seven to nine in the morning.|The owner initially judged the change by the number of parcels unloaded per hour.|Unloading took longer, but the queue at the front door became shorter.|The owner asked a clerk to track unloading and customer waiting times separately.|A slower task can still improve another part of an organisation's work.|a trade-off between unloading and queues
The garden kiosk|Volunteers offered seed packets from a cabinet with an honesty box.|When they added short growing instructions, fewer packets were taken each day.|However, more visitors returned for a second variety after a month.|The volunteers asked return visitors whether they had managed to grow their first plants.|Immediate uptake and continued engagement were different measures of success.|whether early uptake turned into continued engagement
A printed map|A museum replaced a folded map with a wall chart beside the entrance.|The old paper order fell to zero, which was the expected saving.|Staff also noticed more visitors asking how to find the upstairs gallery.|The museum tested a small sign at the foot of the staircase.|Making a map easier to maintain does not necessarily make directions easier to find.|access to directions after printing ceased
Rain on the runway model|A training class used a cardboard runway model to demonstrate surface drainage.|The first teams tested the model by pouring water at the centre.|When they poured at the edges, one apparently successful design overflowed.|The class agreed to test each design at three locations before comparing results.|A test at one point can miss weaknesses elsewhere in the system.|whether a design worked in multiple locations
The helpful alert|A workshop added an audible chime to indicate that a machine was ready.|Experienced operators completed jobs slightly faster in the first week.|New trainees confused the chime with a nearby door signal.|The supervisor gave the machine a more distinct sound and timed both groups again.|An improvement for familiar users need not work for beginners.|different effects on experienced operators and novices
Mending the fence|A city repaired several gaps in a park fence to guide walkers onto marked paths.|A week later, there were fewer footprints on the wet ground beside the largest gap.|But that week had also brought persistent rain and fewer visitors overall.|Investigators returned in dry weather to compare the repaired path with a similar untreated path.|Changes in weather and attendance complicated the first comparison.|comparison conditions and changes in visitor numbers
Room temperature|A team found that a newly insulated room warmed faster during a morning test.|It proposed that the change would lower the building's winter power use.|Records showed that the uninsulated room had been tested on a colder morning.|The team repeated the comparison at matching outdoor temperatures.|A convenient comparison can mislead when an important condition differs.|temperature as a competing explanation for the warm-up time
Label colours|A pharmacist placed coloured bands on boxes holding similar-looking bottles.|Dispensing errors dropped for experienced employees during the first month.|Temporary staff relied on the printed names and had difficulty remembering the bands.|The pharmacy added a clear symbol as well as colour on each label.|A visual cue can help one group while requiring complementary information for another.|cues that also work for unfamiliar staff
Automatic reminders|A clinic sent text reminders before appointments.|More people cancelled in advance and consequently the clinic could offer their slots to others.|The number of missed appointments fell only slightly.|The director tracked the number of appointment slots put to use instead of treating missed appointments as the sole measure.|A reminder may be useful through what it allows staff to do after a cancellation.|the practical consequence of early cancellations
Bird observations|A school nature club counted birds from a lookout every Saturday morning.|It recorded twice as many birds one week after someone put up a feeder.|The club discovered that the feeder made birds stay longer in the same visible places.|The observers began noting unique birds where possible and recorded how long each remained.|A change in how easily birds can be observed can alter a count independently of population.|the distinction between visibility and population
A shorter form|A library replaced a six-page application with a one-page form.|Applications increased as the coordinator expected.|However, volunteers had to phone many applicants to collect an omitted emergency number.|The library restored that field and tested whether application numbers stayed high.|A shorter procedure can shift work downstream when necessary information is lost.|labour transferred from applicants to volunteers
The exhibition audio|A museum loaned visitors headphones to listen to brief exhibit recordings.|Initially visitors heard the pieces in a fixed order.|Staff found that people entering midway through a gallery missed the relevant recording.|They numbered each recording to match its exhibit so visitors could choose where to start.|An information tool works better when its order matches how people actually use it.|the mismatch between a fixed sequence and real visitor routes
A repaired cycle lane|A town repaired a short broken section of a lane used by cyclists.|People reported that they were more willing to cycle through the repaired stretch.|The daily count at the main entrance did not increase.|The planners added a counter at the repaired junction and a survey about route choices.|Counting arrivals at one place may miss changes in which routes people choose.|route choice beyond entrance totals
Library box|A village tried a book-return box beside its bus stop.|Returns through the box soon outnumbered returns at the desk.|When staff totalled both locations, overall returns had barely moved.|The library kept the box for convenience and watched for any change in late returns.|Substitution between channels and growth in overall use are separate outcomes.|reallocation between return locations
Running shoes|A coach tested whether a new shoe made runners faster.|Most participants ran slightly quicker on their second trial.|In the first test the athletes had worn their old shoes, and everyone wore the new shoes second.|The coach repeated the exercise, varying which shoes each runner wore first.|A fixed test order can mix the effect of equipment with that of practice.|separating practice effects from equipment effects
Wall clock|A community hall fitted a large wall clock to help event managers finish on time.|Meetings ended closer to their scheduled time in the first fortnight.|That fortnight happened to include mainly short meetings.|The caretakers compared short meetings with short meetings and long meetings with long meetings across periods.|The type of meeting can influence both recorded improvement and room use.|the differing mix of event lengths
The sign-up board|A volunteer group switched from email sign-ups to a board in its shared hall.|Open tasks were claimed more quickly during the first week.|Members working from home said they could no longer see which tasks were outstanding.|The organisers duplicated the board on a shared page and compared participation by location.|A faster shared tool can lose coverage if some users cannot reach it.|access for members who were away from the hall
A ruler for every desk|A classroom purchased a new set of rulers with coarser markings.|Students completed their drawings more quickly on average.|Marking exposed larger errors on drawings that required half-centimetre precision.|The teacher reserved the coarser rulers for tasks with a larger margin of error.|A tool that improves speed may be a poor choice when precision matters.|matching tool precision to the task
Public notice|A transport office posted a timetable notice in a location where many commuters waited.|More noticed the change, but some misread one of the departure times.|The office added a clearer column heading and moved the explanation directly below the table.|Staff then measured whether passengers could locate and correctly interpret the notice.|Information being seen does not guarantee that it is understood.|the distinction between exposure and understanding
The repair bulletin|An equipment cooperative posted maintenance bulletins on a wall.|Visitors took fewer printed bulletins after a digital version appeared.|A later survey found that some of those visitors consulted the digital version before travelling.|The cooperative recorded print uptake and online use when assessing the change.|Copy distribution alone cannot show the reach of information offered through several channels.|use of the same information across multiple channels
Fresh paint|A pool added a bright stripe to mark the edge of a step.|Reports of people missing the step did not immediately decline.|A week of unusually heavy attendance had brought more opportunities for incidents.|The manager compared incidents per thousand visitors rather than comparing totals.|Incident rates account for changes in the number of people at risk more directly than raw totals.|incidents relative to attendance
The shared cabinet|A laboratory placed two frequently used tools in a shared cabinet.|The average time to obtain a tool rose.|Nevertheless, staff spent much less time replacing tools that had gone missing from individual benches.|The head considered both retrieval time and replacement work before choosing an arrangement.|An isolated performance measure can miss savings in a different activity.|retrieval time in relation to replacement work
More rehearsal|A theatre allowed an additional hour of rehearsal before its preview.|Actors made fewer errors in scenes that were actually rehearsed during the extra hour.|The performance did not improve equally in other scenes.|The director examined improvement by scene and adjusted the next rehearsal plan.|A gain linked to targeted work need not extend to material that was left untouched.|which scenes received the intervention
Sorting the shelves|A college stores department arranged supplies by frequency of use.|Frequently requested items became easier to retrieve.|New workers spent longer finding unusual items because familiar categories no longer sat together.|Supervisors added clear shelf labels and tracked both common and unusual requests separately.|Organising for common cases can create difficulties in infrequent but important cases.|performance on common and uncommon requests
A borrowed bicycle|A city trialled shared bicycles near two railway stations.|At the first station most bicycles had been borrowed before nine each day.|The second station had several available even at the busiest times.|Planners asked where returning users left their bicycles before adjusting the supply.|A shortage at one borrowing point can involve the movement of resources as well as total demand.|the effect of returns on availability by station
The simpler display|A laboratory installed a display that showed rounded values on its main screen.|Trainees learned to read the display more quickly.|Technicians still needed exact values before deciding whether a result met its tolerance.|The designer added a second view with full measurements.|Making the main view simpler can help daily use while a detailed view serves specialist decisions.|different information needs in routine and specialist use
A new entrance|A shopping centre opened a second passage from its car park.|Shoppers reported that entering the building took less time.|The exit queue grew because both passages ultimately led to one narrow corridor.|Managers measured entire journeys and tested a better separation of entering and departing traffic.|Removing one bottleneck can expose or intensify another further along a route.|journey time from start to finish
Counting enquiries|A council added a chatbot to its website to answer basic enquiries.|The web tool registered thousands of conversations in its first month.|The support team discovered that one visitor often started multiple conversations about the same enquiry.|The council compared issues resolved and whether people contacted a human afterwards.|Conversation volume can overstate usefulness when repeated contacts concern the same problem.|resolution of distinct enquiries
Better lighting|A workshop replaced dark bulbs at one bench.|The change left output roughly unchanged during short tasks.|Workers reported less eye strain during long, detailed jobs.|The owner differentiated by task length when examining the benefits.|Aggregating different tasks can conceal effects concentrated in particular work.|the duration and visual demands of the task
Survey cards|A restaurant asked diners to return survey cards at the till.|The cards recorded mostly favourable responses.|The manager realised that customers who left without paying at the till never received a card.|The restaurant offered cards at the table instead and compared the pattern of feedback.|Where feedback is collected can alter who has an opportunity to respond.|coverage of different groups in the survey
The clay pot|Potters tested a thicker version of a jar intended to keep drinks cool.|The thicker jar warmed more slowly during its first hour in the sun.|It also took much longer to cool again after spending the entire day outside.|The group tested both warming and cooling before choosing a version.|A design that resists a change in temperature may delay desirable changes as well as undesirable ones.|both directions of a temperature change
A reserved table|An archive started reserving desks for people who booked online.|Its appointment records showed fewer late arrivals.|Walk-in readers, who were no longer listed on the desk register, sometimes waited longer.|The archive recorded waiting time for both appointment and walk-in readers.|A favourable record may cover a narrower group than the people affected by the change.|the experience of visitors left outside the new record
The hill garden|A school set out to compare two varieties of a kitchen herb.|It assigned one variety to the wet side of a path and the other to the dry side.|The second grew taller during the first fortnight.|The teacher planted both varieties on each side for the next comparison.|A useful comparison separates a plant's variety from the conditions in which it grows.|whether growing conditions differed by variety
`.trim().split('\n').map(row => row.split('|'));

function passages(emit) {
  for (const [i, [title, setting, intervention, observation, response, lesson, factor]] of cases.entries()) {
    const family = 'en-passage-' + slug(title);
    const passage = [setting, intervention, observation, response].join(' ');
    const construct = (question, rest = passage) => question + '\n\n' + rest;
    emit(topic.reading, 'Main Idea', family, construct('Which statement captures the central lesson of this passage?'),
      lesson, [
        'An initial measure should be accepted whenever it matches the expected result.',
        'An intervention should be judged entirely by how quickly it can be put into effect.',
        'A favourable result in one group makes it unnecessary to examine the remaining groups.'
      ], "The earlier observations and the team's final response together support this interpretation. The new check focuses on " + factor + '.',
      'Medium', syllabus, 'Passage theme');
    const detail = [setting, intervention, observation];
    emit(topic.reading, 'Detail', family, construct('What action was taken last in the passage?'),
      response, detail, 'The last sentence identifies the final action. The other choices describe the setting, intervention or earlier observation.',
      'Easy', syllabus, 'Chronological detail');
    emit(topic.reading, 'Inference', family, construct('Which issue was most relevant to the revised evaluation?'),
      labelled(factor), [
        'The ease of writing an initial proposal',
        'The timing of a decision to repeat the first intervention',
        'The popularity of similar work before the trial began'
      ], 'The closing action specifically addresses ' + factor + ', which the initial assessment did not fully capture. The passage therefore supports a cautious interpretation.',
      'Medium', syllabus, 'Evidence-based inference');
    const last = response.charAt(0).toLowerCase() + response.slice(1);
    const transitions = [
      ['In response', 'Before the trial', 'In contrast', 'For instance'],
      ['Accordingly', 'Even so', 'For example', 'Earlier'],
      ['In light of these findings', 'Unrelated to the findings', 'At the start', 'Similarly'],
      ['Consequently', 'Meanwhile', 'Before making the change', 'On the other hand']
    ][i % 4];
    emit(topic.cloze, 'Cohesion', family,
      construct('Choose the transition that introduces the final step as a reaction to the preceding finding.',
        [setting, intervention, observation, '___, ' + last].join(' ')),
      transitions[0], transitions.slice(1),
      '“' + transitions[0] + '” shows that the last action followed from the previous observation. The alternatives indicate a different relation such as contrast, parallel action or earlier timing.',
      'Medium', syllabus, 'Paragraph transition');
    emit(topic.cloze, 'Discourse Contrast', family,
      construct('Choose the expression that completes the conclusion by contrasting an initial result with the later evaluation.',
        passage + ' The case shows why a broad evaluation should consider ' + factor + ', ___ relying entirely on a first impression.'),
      'rather than', ['after thereby', 'because of', 'in which'],
      '“Rather than” introduces the alternative that the writer regards as less suitable. The preferred course is to consider ' + factor + '.',
      'Medium', syllabus, 'Paragraph completion');
    const sentences = [setting, intervention, observation, response];
    const order = shuffle(['P', 'Q', 'R', 'S'], title);
    const list = sentences.map((sentence, idx) => order[idx] + '. ' + sentence).sort().join('\n');
    const arrangement = indices => indices.map(index => order[index]).join(' → ');
    emit(topic.arrangement, 'Order', family, 'Arrange the sentences to give a coherent sequence from the initial situation to the final step.\n\n' + list,
      arrangement([0, 1, 2, 3]), [[0, 2, 3, 1], [1, 0, 3, 2], [2, 3, 0, 1]].map(arrangement),
      'Start with the setting (' + order[0] + '). The intervention (' + order[1] + ') sets up the finding (' +
        order[2] + '), which in turn motivates the response (' + order[3] + ').',
      'Medium', syllabus, 'Paragraph ordering');
  }
}

// Independent grammatical targets reuse a set of original scenarios and their appropriate terminology.
const frames = `
editor|editors|the revised captions|reviewed|the final layout|the printer|the press deadline|plain wording
mechanic|mechanics|the worn bearings|checked|the inspection log|the shift supervisor|the restart|proper lubrication
gardener|gardeners|the young seedlings|counted|the watering plan|the nursery manager|the morning round|even moisture
cartographer|cartographers|the missing distances|plotted|the contour map|the field team|the survey meeting|accurate coordinates
librarian|librarians|the donated volumes|catalogued|the reading list|the school office|the library opening|consistent labels
designer|designers|the new colour samples|compared|the display plan|the purchasing team|the exhibition opening|consistent colour
trainer|trainers|the first exercise sheets|reviewed|the practice schedule|the course coordinator|the second session|clear instructions
ranger|rangers|the broken signs|photographed|the trail notice|the park office|the first guided walk|legible signs
porter|porters|the larger parcels|weighed|the collection record|the depot clerk|the van departure|accurate labels
chemist|chemists|the sealed samples|analysed|the calibration report|the research manager|the repeat measurement|clean containers
coach|coaches|the fastest finishes|recorded|the training plan|the club secretary|the next race|regular practice
archivist|archivists|the damaged letters|scanned|the catalogue entry|the conservator|the public opening|stable humidity
photographer|photographers|the selected frames|labelled|the contact sheet|the picture editor|the publication deadline|consistent lighting
plumber|plumbers|the new fittings|tested|the pipe routing plan|the site foreman|the water supply restart|tight connections
translator|translators|the technical terms|checked|the translated draft|the client|the project deadline|precise terminology
electrician|electricians|the replacement switches|inspected|the wiring diagram|the maintenance chief|the equipment test|clear diagrams
surveyor|surveyors|the field readings|compared|the location report|the mapping team|the site briefing|consistent units
organiser|organisers|the returned tickets|counted|the seating chart|the venue manager|the performance|clear markings
treasurer|treasurers|the latest invoices|recorded|the financial report|the finance committee|the annual meeting|accurate totals
technician|technicians|the spare modules|installed|the test checklist|the equipment team|the first trial|reliable connections
teacher|teachers|the completed essays|marked|the next assignment|the department head|the end of term|clear feedback
carpenter|carpenters|the wooden panels|cut|the cutting plan|the site manager|the afternoon fitting|accurate measurements
tutor|tutors|the mock responses|marked|the lesson plan|the course coordinator|the following lesson|structured revision
engineer|engineers|the prototype components|weighed|the performance summary|the production team|the design review|consistent tests
inspector|inspectors|the exit signs|checked|the inspection schedule|the building manager|the next public event|unobstructed routes
accountant|accountants|the monthly expenses|checked|the quarterly statement|the audit committee|the formal review|consistent records
guide|guides|the alternative routes|mapped|the visitor itinerary|the travel office|the afternoon walk|accurate directions
clerk|clerks|the signed applications|filed|the registration list|the admissions office|the registration deadline|complete records
nurse|nurses|the cleaned trays|counted|the shift checklist|the ward manager|the change of shift|clear labels
curator|curators|the new artefacts|catalogued|the exhibition catalogue|the gallery director|the opening ceremony|accurate attribution
technologist|technologists|the incoming specimens|labelled|the inventory sheet|the laboratory supervisor|the first processing run|consistent numbering
baker|bakers|the prepared loaves|counted|the production schedule|the shop manager|the morning delivery|reliable temperatures
choreographer|choreographers|the rehearsal clips|reviewed|the rehearsal record|the stage manager|the dress rehearsal|steady timing
meteorologist|meteorologists|the latest observations|compared|the forecast summary|the weather desk|the morning bulletin|consistent readings
registrar|registrars|the pending requests|logged|the deadline reminder|the records office|the next enrolment period|clear procedures
scout|scouts|the trail markers|checked|the route guide|the patrol leader|the evening hike|clear landmarks
`.trim().split('\n').map(row => row.split('|'));

function mechanics(emit) {
  for (const [i, [role, plural, things, participle, document, receiver, milestone, key]] of frames.entries()) {
    const person = 'The ' + role;
    const officials = 'the ' + plural;
    const prefix = 'en-grammar-';
    function error(family, subtopic, chunks, index, explanation, difficulty) {
      emit(topic.error, subtopic, prefix + family,
        'Which part of the sentence contains an error?\n\n' + chunks.join(' / ') + '.',
        chunks[index], chunks.filter((_, i) => i !== index), explanation, difficulty, grammarUsage, 'Segmented error detection');
    }
    function blank(family, subtopic, sentence, answer, distractors, explanation, difficulty) {
      emit(topic.completion, subtopic, prefix + family, 'Choose the option that correctly completes the sentence.\n\n' + sentence,
        answer, distractors, explanation, difficulty, grammarUsage, 'Sentence completion');
    }
    function transform(family, from, correct, distractors, explanation) {
      emit(topic.transformation, 'Complex to Simple', 'en-transformation-' + family,
        'Which simple sentence preserves the original meaning?\n\n' + from,
        correct, distractors, explanation, 'Medium', grammarUsage, 'Complex-to-simple transformation');
    }
    error('subject-verb-with-interrupter', 'Agreement', [
      'The list', 'of ' + things, 'have been copied', 'into ' + document
    ], 2, 'The head noun “list” is singular. The plural noun in the modifying phrase does not control agreement. Use “has been copied”.',
    'Easy');
    error('negative-did', 'Tense', [
      person, 'did not sent', document, 'to ' + receiver + ' yesterday'
    ], 1, 'After “did not”, use the base form of the main verb: “did not send”. The auxiliary “did” already marks the past.',
    'Easy');
    const time = [
      ['On six o’clock', 'at six o’clock', 'an exact time of day'],
      ['At Monday afternoon', 'on Monday afternoon', 'a named day or date'],
      ['On the middle of July', 'in the middle of July', 'a period containing the event'],
      ['In 15 March', 'on 15 March', 'a specific calendar date']
    ][i % 4];
    error('time-preposition-' + slug(time[2]), 'Prepositions',
      [time[0], 'after checking the figures,', person.toLowerCase() + ' handed over', document],
      0, 'For ' + time[2] + ', the standard expression is “' + time[1] + '” in this sentence.',
      'Easy');
    error('past-finished-time', 'Tense', [
      'In the previous calendar year', officials, 'have already prepared', document + ' for a similar project'
    ], 2, 'A finished time frame (“in the previous calendar year”) normally takes the past simple. Write “prepared”.',
    'Medium');
    error('relative-who', 'Pronouns', [
      person, 'where had brought ' + document, 'spoke briefly', 'to ' + receiver
    ], 1, 'The relative clause describes a person and needs a subject. Use “who had brought”. “Where” introduces a place-related clause.',
    'Easy');
    error('too-compared-with-enough', 'Modifiers', [
      person, 'was enough busy', 'to finish proofreading', document + ' before ' + milestone
    ], 1, '“Enough” normally follows an adjective (“busy enough”). In this sentence, use “too busy to finish” if the intended meaning is that workload prevented finishing.',
    'Medium');
    error('despite-clause', 'Prepositions', [
      'Despite the ' + role + ' arrived late', document, 'was ready', 'before ' + milestone
    ], 0, '“Despite” takes a noun phrase or -ing clause. Use “despite the ' + role + '’s late arrival”, or keep a finite clause after “although”.',
    'Medium');
    error('passive-agreement', 'Agreement', [
      labelled(things), 'has been ' + participle, 'for ' + document, 'ahead of ' + milestone
    ], 1, 'The subject is the plural noun phrase “' + things + '”. The passive construction therefore needs “have been ' + participle + '”.',
    'Easy');
    blank('unless-required-condition', 'Grammar', person + ' will miss ' + milestone + ' ___ ' + document + ' is ready on time.',
      'unless', ['during', 'despite', 'until after'], '“Unless” states an exception to the predicted outcome: missing the event is expected if the document is not ready in time.',
      'Medium');
    blank('emphasis-not-only', 'Grammar', 'Not only ___ ' + person.toLowerCase() + ' check ' + things + ', but the same person also prepared ' + document + '.',
      'did', ['has', 'does', 'was'], 'A fronted “not only” triggers inversion. Use “did” + subject + the base verb “check” for this completed event, consistent with “prepared”.',
      'Hard');
    blank('third-conditional', 'Grammar', 'At the debrief, ' + receiver + ' explained that if the ' + role + ' had sent ' + document + ' yesterday, the team ___ it before ' + milestone + '.',
      'would have read', ['will read', 'has read', 'would read yesterday'], 'The if-clause describes an unreal past condition. Use “would have” plus a past participle for its unreal past result.',
      'Hard');
    blank('reason-because-of', 'Context', labelled(receiver) + ' postponed ' + milestone + ' ___ the delays in preparing ' + document + '.',
      'because of', ['although', 'whereas', 'as if'], '“Because of” introduces a noun phrase giving a reason. The alternatives introduce clauses expressing contrast or manner.',
      'Easy');
    blank('participle-prior-action', 'Grammar', '___ ' + things + ', ' + person.toLowerCase() + ' wrote the outcome in ' + document + '.',
      'Having ' + participle, ['Has ' + participle, 'Have ' + participle, 'Will have ' + participle], 'An introductory perfect participle phrase (“having” + past participle) marks a completed earlier action by the same subject.',
      'Hard');
    blank('modal-obligation', 'Context', 'The instructions make ' + key + ' mandatory. Staff ___ follow the requirements in ' + document + '.',
      'must', ['might', 'could', 'would'], '“Must” expresses obligation, matching “mandatory”. The other options express possibility or conditional outcomes.',
      'Easy');
    blank('before-time-limit', 'Grammar', person + ' sent the figures ___ ' + receiver + ' before ' + milestone + '.',
      'to', ['at', 'of', 'throughout'], 'With an item and recipient, the standard pattern is “send something to someone”.',
      'Easy');
    const objectSentence = document + ' was ready before ' + milestone;
    transform('despite', 'Although the ' + role + ' arrived late, ' + objectSentence + '.',
      'Despite the ' + role + '’s late arrival, ' + objectSentence + '.',
      ['Because of the ' + role + '’s late arrival, ' + objectSentence + '.',
        'Because the ' + role + ' arrived late, ' + objectSentence + '.',
        'Until the ' + role + ' arrived late, ' + objectSentence + '.'],
      '“Despite” followed by the noun phrase “the ' + role + '’s late arrival” retains the concessive meaning without a subordinate finite clause.');
    transform('reason-adjective', 'The ' + role + ' checked ' + document + ' again because the team placed great importance on ' + key + '.',
      'Given the importance of ' + key + ', ' + person.toLowerCase() + ' checked ' + document + ' again.',
      ['Despite the importance of ' + key + ', ' + person.toLowerCase() + ' checked ' + document + ' again.',
        'Although the staff valued ' + key + ', ' + person.toLowerCase() + ' checked ' + document + ' again.',
        'Until the staff addressed ' + key + ', ' + person.toLowerCase() + ' checked ' + document + ' again.'],
      '“Given the importance of” compresses the reason clause into a phrase. The importance of ' + key + ' remains the reason for rechecking.');
    transform('upon-verb', 'When ' + person.toLowerCase() + ' received ' + document + ', that person contacted ' + receiver + '.',
      'On receiving ' + document + ', ' + person.toLowerCase() + ' contacted ' + receiver + '.',
      ['Before receiving ' + document + ', ' + person.toLowerCase() + ' contacted ' + receiver + '.',
        'Since the ' + role + ' received ' + document + ', the ' + role + ' contacted ' + receiver + '.',
        'Without receiving ' + document + ', ' + person.toLowerCase() + ' contacted ' + receiver + '.'],
      '“On receiving” expresses the immediate time relation through a non-finite phrase. Its understood subject is the same person who did the contacting.');
    transform('purpose-infinitive', person + ' took a spare copy of ' + document + ' so that ' + receiver + ' could read it during the briefing.',
      person + ' took a spare copy of ' + document + ' for ' + receiver + ' to read during the briefing.',
      [person + ' took a spare copy of ' + document + ' after ' + receiver + ' read it during the briefing.',
        person + ' took a spare copy of ' + document + ' despite ' + receiver + ' reading it during the briefing.',
        person + ' took a spare copy of ' + document + ' even though ' + receiver + ' could read it during the briefing.'],
      '“For [recipient] to read” is an infinitival purpose phrase. It preserves the intended reader and setting without a second finite verb.');
  }
}

// Pairs have a stated common relation and distractors designed for the target, not an unrelated word list.
const analogies = `
author|novel|composer|symphony|conductor|orchestra|recital|the maker and the work created
cartographer|map|lexicographer|dictionary|alphabet|syllable|bookshop|the professional and the reference work produced
potter|vase|weaver|rug|loom|shuttle|thread|the craftsperson and the finished product
carpenter|saw|tailor|shears|hem|cloth|jacket|the craftsperson and a cutting tool
painter|brush|sculptor|chisel|statue|marble|pedestal|the craftsperson and a hand tool used to shape the work
surveyor|theodolite|meteorologist|barometer|rainfall|air pressure|forecast|the specialist and a measuring instrument
thermometer|temperature|anemometer|wind speed|humidity|direction|rainfall|the measuring instrument and its specific quantity
odometer|distance travelled|barometer|atmospheric pressure|altitude|wind speed|temperature|the instrument and the quantity that it measures
seismograph|ground motion|tide gauge|sea level|wave direction|ocean salinity|wind speed|the recording instrument and its measured variable
microscope|tiny objects|telescope|distant objects|underground objects|hidden sounds|fine smells|the aid and the kind of thing it makes easier to observe
compass|direction|stopwatch|elapsed time|calendar date|weight|latitude|the instrument and the information it provides
seed|seedling|egg|hatchling|adult|shell|nest|the starting form and the young organism that emerges
kitten|cat|foal|horse|stable|saddle|hay|the young animal and its adult form
calf|cow|gosling|goose|duck|feather|chick|the young animal and its adult form
cub|lion|fawn|deer|hare|stag beetle|forest|the young animal and the kind of adult it becomes
gills|fish|lungs|human|fin|air|heart|a respiratory organ and an animal that uses it
nest|bird|den|fox|wing|egg|reptile|the customary shelter and an animal that uses it
hive|bee|stable|horse|field|saddle|sparrow|the structure and its customary animal occupant
page|book|brick|wall|clay|builder|mortar|a repeated component and the larger whole
letter|word|note|melody|violin|string|silence|the minimal unit and a larger sequence it can help form
petal|flower|scale|fish|river|water|boat|a part and the organism that carries it
wheel|bicycle|propeller|aircraft|hangar|pilot|runway|a rotating component and a vehicle it helps operate
chapter|book|act|play|author|audience|theatre|a major division and the work it belongs to
departure|arrival|emigration|immigration|migration|travel|settlement|opposing descriptions of leaving and entering
entrance|exit|ingress|egress|aisle|gateway|corridor|terms for entry followed by the corresponding opposite
increase|decrease|expand|contract|unfold|extend|multiply|contrasting changes in size or amount
voracious|ravenous|taciturn|reticent|talkative|polite|fickle|terms with closely related meanings
lucid|clear|tenacious|persistent|flexible|timid|thoughtful|terms with closely related meanings
fleeting|brief|durable|lasting|temporary|heavy|faint|terms with closely related meanings
abundant|scarce|vigilant|inattentive|suspicious|diligent|alert|words with opposite meanings
candid|evasive|diligent|negligent|industrious|cautious|careful|words with opposite meanings
divide|division|decide|decision|decisive|decided|decider|the verb and its noun for the corresponding act or result
persuade|persuasion|conclude|conclusion|conclusive|concluding|concluded|the verb and its noun for the corresponding act or result
deep|depth|broad|breadth|broaden|broadly|broader|the adjective and its noun naming the dimension
long|length|high|height|highly|higher|heighten|the adjective and its noun naming the dimension
careful|carefully|visible|visibly|visibility|invisible|vision|the adjective and the adverb describing manner
visible|invisible|audible|inaudible|audibly|audibility|audio|an adjective and its negative form with the prefix “in-”
kind|kindness|weak|weakness|weaken|weakly|weaker|the adjective and its corresponding quality noun
large|larger|wide|wider|wide enough|widely|width|the base adjective and its comparative form
bright|brightest|quiet|quietest|quietly|quieter|quietness|the base adjective and its superlative form
teach|taught|seek|sought|seeking|search|seeker|the present form of an irregular verb and its past simple
take|took|forsake|forsook|forsaken|forsaking|abandons|the present form of an irregular verb and its past simple
write|written|speak|spoken|spoke|speaker|speaking|the base form of a verb and its past participle
choose|chosen|freeze|frozen|froze|freezing|freezer|the base form of a verb and its past participle
mouse|mice|goose|geese|goslings|feathers|ducks|the singular and an irregular plural
criterion|criteria|phenomenon|phenomena|phenomenal|phenomics|phenomenologist|the singular and an irregular plural
person|people|child|children|childhood|families|childish|the singular and an irregular plural
paper|ream|bees|swarm|wing|orchard|nectar|a member or material and a collective quantity or group
ships|fleet|birds|flock|song|cage|feather|members and the noun for the group
lions|pride|wolves|pack|forest|pup|fur|members and the noun for the group
flour|bread|clay|pottery|wheel|glaze|kiln|the material and a product made from it
wool|jumper|leather|shoe|tannery|cobbler|hide|the material and a product made from it
acorn|oak|pine cone|pine|wood|needle|branch|the seed or seed-bearing structure and the kind of tree it comes from
bee|buzz|snake|hiss|rattle|crawl|scale|an animal and a familiar characteristic sound it makes
library|books|gallery|paintings|frames|artists|tickets|the institution and the creative works it houses or displays
auction|bidder|debate|speaker|room|topic|programme|the event and a person who takes an active part
prologue|opening|epilogue|ending|middle|title|appendix|the literary section and its structural function
famine|food shortage|drought|water shortage|heat wave|soil damage|crop disease|the condition and its essential scarcity
orthography|spelling|phonetics|speech sounds|word origins|sentence order|fiction|the field and its object of study
etymology|word origins|syntax|sentence structure|punctuation|vocabulary size|pronunciation|the field and its particular focus
clumsy|dexterity|timid|courage|fear|silence|caution|a description and a positive quality it implies a lack of
illiterate|reading ability|innumerate|numerical ability|musical ability|literary taste|spoken fluency|a description and the skill it means a person lacks
procrastinate|delay|persevere|persist|surrender|depart|hurry|verbs with similar core meanings
prohibit|forbid|permit|allow|require|refuse|demand|verbs with similar core meanings
assemble|disperse|accumulate|scatter|collect|amass|gather|verbs that express opposite movements in relation to grouping
scrutinise|examine closely|glimpse|see briefly|hear suddenly|hold firmly|speak plainly|each verb and a paraphrase of how the action is performed
oasis|desert|clearing|forest|river|grassland|shore|an open or distinct area and the wider environment in which it appears
quench|thirst|satisfy|hunger|flame|throat|meal|the verb and the bodily need it addresses
appease|anger|allay|fear|joy|memory|duty|the verb and an unpleasant emotion that it can lessen
scabbard|sword|holster|pistol|arrow|helmet|shield|the fitted holder and the object carried in it
manuscript|publication|prototype|production|marketing|transport|retail|an early version and the later stage toward which it leads
hour|minute|degree|arcminute|second|metre|kilometre|a unit and a unit equal to one sixtieth of it
decade|year|century|decade|week|day|month|a period and a smaller period of which it contains ten
dozen|twelve|score|twenty|fifty|twenty-four|one hundred|the word for an exact number and the number it denotes
fibula|bone|sapphire|mineral|metal|tissue|chemical compound|an example and the broad physical category it belongs to
quartz|mineral|oak|tree|metal|rock|herb|an example and the broad category it belongs to
narrator|story|umpire|match|report|scorecard|spectator|a role and the event or work through which the role is exercised
editor|draft|restorer|damaged artwork|gallery|reference book|catalogue number|the person and the material on which they act
`.trim().split('\n').map(row => row.split('|'));

function analogyQuestions(emit) {
  for (const [first, second, third, fourth, a, b, c, relation] of analogies) {
    const family = 'en-analogy-' + slug(relation).slice(0, 66);
    emit(topic.analogy, 'Lexical Relations', family,
      'Complete the analogy using the relationship in the first pair.\n\n' + labelled(first) + ' : ' + second + ' :: ' + labelled(third) + ' : ___',
      fourth, [a, b, c], 'The relationship is ' + relation + '. “' + first + '” corresponds to “' + second +
      '” just as “' + third + '” corresponds to “' + fourth + '”.', 'Medium', syllabus, 'Lexical analogy');
  }
}

export function buildEnglish() {
  const questions = [];
  const seen = new Set();
  function emit(name, subtopic, family, prompt, correct, distractors, explanation, difficulty, source, style) {
    const key = normalize(prompt);
    const options = [correct, ...distractors];
    if (options.length !== 4 || options.some(option => !option) || new Set(options.map(normalize)).size !== options.length) {
      throw new Error('Invalid English options for ' + prompt + ': ' + JSON.stringify(options));
    }
    if (seen.has(key)) throw new Error('Duplicate English prompt: ' + prompt);
    seen.add(key);
    shuffle(options, prompt);
    const readableFamily = family.replace(/^en-/, '').replaceAll('-', ' ');
    questions.push({
      subject: 'en', topic: name, subtopic, family: labelled(readableFamily), concept: subtopic, prompt,
      options, answer: options.indexOf(correct), explanation, difficulty, source, style, classification: 'ORIGINAL_AFCAT_STYLE'
    });
  }
  lexical(emit);
  passages(emit);
  mechanics(emit);
  analogyQuestions(emit);
  return questions;
}
