const stopwords = require('./stopwords');

function cleanText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(word =>
      word.length > 2 && !stopwords.includes(word)
    );
}

function getKeywords(text) {
  return new Set(cleanText(text));
}

function matchTexts(resumeText, jobText) {
  const resumeKeywords = getKeywords(resumeText);
  const jobKeywords = getKeywords(jobText);

  const matched = [];
  const missing = [];

  for (let word of jobKeywords) {
    if (resumeKeywords.has(word)) {
      matched.push(word);
    } else {
      missing.push(word);
    }
  }

  const score =
    jobKeywords.size === 0
      ? 0
      : Math.round((matched.length / jobKeywords.size) * 100);

  return {
    score,
    matched,
    missing
  };
}

module.exports = matchTexts;
