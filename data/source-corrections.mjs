// Display corrected catalogue references without rewriting question versions
// already pinned to attempts. The old IDs below belong to the first GA pack.
const unesco = 'https://whc.unesco.org/en/list/';
const originalHeritageIds = new Map([
  ['242','246'], ['243','249'], ['240','243'],
  ['1377','1338'], ['241','255'], ['251','232']
]);

export function questionSources({id, source, references}) {
  if (!id.startsWith('awareness-2027-r1-')) return {source, references};
  function correct(url) {
    if (typeof url !== 'string' || !url.startsWith(unesco)) return url;
    const newId = originalHeritageIds.get(url.slice(unesco.length));
    return newId ? unesco + newId : url;
  }
  return {source:correct(source), references:references?.map(correct)};
}
