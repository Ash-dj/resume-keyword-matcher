const multer = require('multer');
const pdfParse = require('pdf-parse/lib/pdf-parse.js');
const express = require('express');
const matchTexts = require('./matcher');

const app = express();

// Serve frontend
app.use(express.static('public'));

// Multer setup (in-memory for PDFs)
const upload = multer({
  storage: multer.memoryStorage(),
});

// Clean extracted PDF text
function cleanPdfText(text) {
  return text
    .replace(/\r?\n+/g, ' ')
    .replace(/•|▪|●|–|—/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Match route
app.post('/match', upload.single('resumePdf'), async (req, res) => {
  try {
    let resumeText = req.body.resume;
    const jobText = req.body.job;

    // If PDF uploaded, extract text
    if (req.file) {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = cleanPdfText(pdfData.text);
    }

    if (!resumeText || !jobText) {
      return res.json({
        score: 0,
        missing: [],
      });
    }

    const result = matchTexts(resumeText, jobText);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process resume' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
