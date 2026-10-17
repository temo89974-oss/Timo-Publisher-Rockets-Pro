/**
 * Dual Translation Engine for Amazon KDP & Book Publishing:
 * 1. Google Translate Engine (ترجمة جوجل الفورية)
 * 2. Gemini Literary & Publishing Precision Engine (الذكاء الاصطناعي الأدبي فائق الدقة)
 */

export type TranslationEngine = 'google' | 'gemini';

export async function translateWithGoogle(
  text: string,
  targetLang: 'ar' | 'en'
): Promise<string> {
  if (!text.trim()) return '';

  const sourceLang = targetLang === 'ar' ? 'en' : 'ar';
  
  // Try client-side Google Translate GTX endpoint first
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
      text
    )}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const fullTranslation = data[0].map((chunk: any) => chunk[0]).join('');
        if (fullTranslation.trim()) {
          return fullTranslation.trim();
        }
      }
    }
  } catch (clientErr) {
    console.warn('Direct Google Translate request failed, trying server endpoint:', clientErr);
  }

  // Fallback to server endpoint
  return translateWithGeminiApi(text, targetLang, 'google');
}

export async function translateWithGeminiApi(
  text: string,
  targetLang: 'ar' | 'en',
  engine: TranslationEngine = 'gemini'
): Promise<string> {
  if (!text.trim()) return '';

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text.trim(),
        targetLang,
        engine,
      }),
    });
    const data = await res.json();
    if (data.success && data.translated) {
      return data.translated;
    }
    return text;
  } catch (err) {
    console.error('Translation API error:', err);
    return text;
  }
}

/**
 * Universal translate function with engine selector
 */
export async function translateText(
  text: string,
  targetLang: 'ar' | 'en',
  engine: TranslationEngine = 'google'
): Promise<string> {
  if (engine === 'google') {
    try {
      const result = await translateWithGoogle(text, targetLang);
      if (result && result !== text) return result;
    } catch {
      // Fallback to Gemini
    }
  }
  return translateWithGeminiApi(text, targetLang, 'gemini');
}
