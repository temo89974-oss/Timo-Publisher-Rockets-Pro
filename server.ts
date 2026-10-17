import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import {
  analyzeKeywordsWithGemini,
  analyzeCompetitionWithGemini,
  analyzeCategoriesWithGemini,
  generateAmazonAdsWithGemini,
  generateBookTitlesWithGemini,
  translateTextWithGemini,
} from './server/geminiService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Endpoints
app.post('/api/analyze-keywords', async (req, res) => {
  try {
    const { query, marketplace, format } = req.body;
    const data = await analyzeKeywordsWithGemini(query, marketplace, format);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/analyze-competition', async (req, res) => {
  try {
    const { query, marketplace } = req.body;
    const data = await analyzeCompetitionWithGemini(query, marketplace);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/analyze-categories', async (req, res) => {
  try {
    const { query, storeType } = req.body;
    const data = await analyzeCategoriesWithGemini(query, storeType);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/generate-ads', async (req, res) => {
  try {
    const { query, authorOrBook } = req.body;
    const data = await generateAmazonAdsWithGemini(query, authorOrBook);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/generate-titles', async (req, res) => {
  try {
    const { genre, coreHook, targetAudience } = req.body;
    const data = await generateBookTitlesWithGemini(genre, coreHook, targetAudience);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLang, engine } = req.body;
    const translated = await translateTextWithGemini(text, targetLang, engine);
    res.json({ success: true, translated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static frontend files in production
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`PublisherRocket Server running on http://0.0.0.0:${PORT}`);
});
