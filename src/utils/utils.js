export const colonsToUnicode = (text) => {
  const colonsRegex = new RegExp('(^|\\s)(:[a-zA-Z0-9-_+]+:(:skin-tone-[2-6]:)?)', 'g');
  const results = []
  let match;
  while (match = colonsRegex.exec(text)) {
    let colons = match[2];
    let offset = match.index + match[1].length;
    let length = colons.length;
    results.push({colons, offset, length})
  }
  return results
}
