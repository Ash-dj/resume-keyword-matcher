const stopwords = require('./stopwords');

/**
 * Tokenizes text into lowercase alphabetic words.
 * Keeps length > 2 to remove noise.
 */
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/node\.js/g, 'nodejs') // light normalization
    .replace(/apis?/g, 'api')       // api / apis → api
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

/**
 * Computes term frequency for a list of words.
 */
function termFrequency(words) {
  const tf = {};
  for (const word of words) {
    tf[word] = (tf[word] || 0) + 1;
  }
  return tf;
}

/**
 * Computes IDF with smoothing for two documents (resume + JD).
 */
function computeIDF(resumeTF, jobTF) {
  const idf = {};
  const totalDocs = 2;

  const vocabulary = new Set([
    ...Object.keys(resumeTF),
    ...Object.keys(jobTF)
  ]);

  for (const word of vocabulary) {
    let df = 0;
    if (resumeTF[word]) df++;
    if (jobTF[word]) df++;

    // smoothed IDF
    idf[word] = Math.log((totalDocs + 1) / (df + 1)) + 1;
  }

  return idf;
}

/**
 * Main TF-IDF based matcher.
 * Uses strict stopword filtering with a JD fallback
 * to avoid empty keyword sets.
 */
function tfidfMatcher(resumeText, jobText) {
  const resumeTokens = tokenize(resumeText);
  const jobTokens = tokenize(jobText);

  let resumeWords = resumeTokens.filter(w => !stopwords.includes(w));
  let jobWords = jobTokens.filter(w => !stopwords.includes(w));

  // JD fallback: prevent empty keyword sets
  if (jobWords.length === 0) {
    jobWords = jobTokens;
  }

  const resumeTF = termFrequency(resumeWords);
  const jobTF = termFrequency(jobWords);

  const idf = computeIDF(resumeTF, jobTF);

  let matchedScore = 0;
  let totalScore = 0;
  const missing = [];

  for (const word in jobTF) {
    const weight = jobTF[word] * idf[word];
    totalScore += weight;

    if (resumeTF[word]) {
      matchedScore += weight;
    } else {
      missing.push(word);
    }
  }

  const score =
    totalScore === 0
      ? 0
      : Math.round((matchedScore / totalScore) * 100);

  return { score, missing };
}

module.exports = tfidfMatcher;
