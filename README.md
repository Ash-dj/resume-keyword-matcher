# Resume Keyword Matcher

A simple ATS-style resume screening tool that compares a resume with a job description
and calculates a keyword-based match score. The tool highlights missing keywords to help
candidates improve alignment with job requirements.

---

## 🚀 Features
- Paste resume and job description text
- Keyword-based matching similar to early ATS filters
- Match percentage score
- List of missing keywords
- Input validation for empty fields

---

## 🛠 Tech Stack
- JavaScript
- Node.js
- Express.js
- HTML, CSS

---

## ⚙️ How It Works
1. Resume and job description text are preprocessed:
   - Converted to lowercase
   - Punctuation and numbers removed
   - Common stopwords filtered out
2. Keywords are extracted from both texts
3. Job description keywords are treated as required skills
4. Resume keywords are compared against them
5. A match score is calculated and missing keywords are displayed

---

## ▶️ How to Run Locally

1. Clone the repository
```bash
git clone <your-repo-url>
```
2. Install dependencies
```bash
npm install
```
3. Start the server
```bash
node server.js
```
4. Open in browser:
http://localhost:3000

---

## ⚠️ Limitations
```md

1. Uses keyword matching only (no semantic understanding)
2. Does not parse PDF files
3. Designed to simulate early-stage ATS filtering, not final hiring decisions
```
---

## 📌 Future Improvements
```md
1. TF-IDF based keyword weighting
2. PDF resume upload
3. Ranking multiple resumes against one job description
```
---

## 🔬 TF-IDF Upgrade

This project was extended to use TF-IDF based keyword weighting instead of simple
keyword overlap.

### Improvements
1. Applied IDF smoothing to prevent zero-weight collapse
2. Added domain-specific stopword filtering for ATS-style job descriptions
3. Improved relevance scoring for shared technical skills

---

## 📄 PDF Resume Support

The application supports uploading resume PDFs in addition to pasted text.

- PDF resumes are uploaded via the frontend and processed server-side
- Text is extracted using `pdf-parse`
- Extracted content is cleaned to remove formatting noise
- The processed text is fed into the same TF-IDF matching pipeline

If a PDF is uploaded, it takes priority over pasted resume text.

---

## 🧠 Matching Logic Notes

- Uses TF-IDF with smoothing to weight important job description keywords
- Removes generic role and boilerplate terms using a custom stopword list
- Includes a fallback mechanism to prevent empty keyword sets for short or noisy job descriptions
- Performs exact keyword matching to simulate early-stage ATS behavior
- Supports both pasted text and PDF resumes for realistic ATS-style screening



