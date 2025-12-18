const stopwords = require('./stopwords');

function preprocess(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopwords.includes(word));
}

function termFrequency(words) {
  const tf = {};
  for (const word of words) {
    tf[word] = (tf[word] || 0) + 1;
  }
  return tf;
}

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

    idf[word] = Math.log((totalDocs + 1) / (df + 1)) + 1;

  }

  return idf;
}

function tfidfMatcher(resumeText, jobText) {
  const resumeWords = preprocess(resumeText);
  const jobWords = preprocess(jobText);

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
    totalScore === 0 ? 0 : Math.round((matchedScore / totalScore) * 100);

  return {
    score,
    missing
  };
}

module.exports = tfidfMatcher;
