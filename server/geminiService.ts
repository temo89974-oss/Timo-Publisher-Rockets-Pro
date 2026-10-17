import { GoogleGenAI } from '@google/genai';
import { calculateDailySalesFromABSR, calculateMonthlySalesFromDaily, calculateRocketCompetitiveScore, calculateOpportunityScore } from '../src/utils/amazonCalculators';

// Initialize the Google Gen AI client with telemetry User-Agent header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

/**
 * Perform deep Keyword Research for Amazon KDP
 */
export async function analyzeKeywordsWithGemini(
  query: string,
  marketplace: string = 'US',
  format: string = 'all'
) {
  if (!ai) {
    return generateAlgorithmicKeywords(query, marketplace, format);
  }

  try {
    const prompt = `You are the world's most advanced Amazon KDP (Kindle Direct Publishing) and Publisher Rocket research intelligence system.
Analyze the book topic / keyword seed: "${query}" in marketplace: "${marketplace}" for format: "${format}".

Return a JSON array of 10 to 15 highly realistic, search-verified Amazon KDP keyword opportunities related to this seed.
For each keyword, provide:
- keyword: string (exact phrase Amazon shoppers type)
- amazonSearches: estimated monthly search volume on Amazon (e.g., between 800 and 45000)
- googleSearches: estimated monthly search volume on Google
- avgMonthlyEarnings: estimated average monthly royalties earned by top 10 books ranking for this keyword (in USD)
- competitorCount: number of competing books found in Amazon search results (e.g. 150 to 5000)
- competitiveScore: Rocket difficulty score 1-100 (1-35 = Green/Easy opportunity, 36-60 = Orange/Moderate, 61-100 = Red/Fierce competition)
- opportunityScore: 1-100 (high search volume combined with low/medium competition gives highest score)
- trend: "up" | "stable" | "down"
- semanticCluster: grouping category (e.g. "Core Niche", "Trope / Sub-genre", "Audience Hook", "Format Specific")
- notes: tactical advice on whether to use this as one of KDP's 7 backend keywords

Ensure the 7 best keywords have the highest opportunity scores so the user can easily select their 7 backend keywords.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item: any, idx: number) => ({
        id: `kw-gemini-${Date.now()}-${idx}`,
        keyword: item.keyword || `${query} guide`,
        amazonSearches: Number(item.amazonSearches) || 5000,
        googleSearches: Number(item.googleSearches) || 3500,
        avgMonthlyEarnings: Number(item.avgMonthlyEarnings) || 2800,
        competitorCount: Number(item.competitorCount) || 850,
        competitiveScore: Number(item.competitiveScore) || 38,
        opportunityScore: Number(item.opportunityScore) || 75,
        trend: item.trend || 'up',
        isSelectedBackend: idx < 7,
        semanticCluster: item.semanticCluster || 'Target Term',
        notes: item.notes || 'Strong candidate for KDP backend slots.',
      }));
    }
    return generateAlgorithmicKeywords(query, marketplace, format);
  } catch (error) {
    console.error('Gemini keywords error, falling back:', error);
    return generateAlgorithmicKeywords(query, marketplace, format);
  }
}

/**
 * Perform deep Competitor Analysis for Amazon KDP
 */
export async function analyzeCompetitionWithGemini(
  keywordOrNiche: string,
  marketplace: string = 'US'
) {
  if (!ai) {
    return generateAlgorithmicCompetitors(keywordOrNiche);
  }

  try {
    const prompt = `You are an elite Amazon KDP publishing strategist and Publisher Rocket competition analyzer.
Generate a comprehensive competitor breakdown of 8 to 12 realistic top-ranking books for the search term: "${keywordOrNiche}".

For each book, return:
- asin: valid 10-char ASIN format (e.g. B0... or ISBN-10)
- title: realistic, catchy book title
- subtitle: realistic subtitle with keyword placement
- author: author name
- ageDays: how many days ago it was published (30 to 900)
- publishDate: YYYY-MM-DD
- absr: Amazon Best Seller Rank (between 300 and 85000)
- price: USD list price (e.g. 2.99, 3.99, 4.99, 7.99, 9.99, 14.99)
- pageCount: integer between 120 and 520
- rating: star rating between 4.1 and 4.9
- reviewsCount: integer review count (between 45 and 6500)
- hasKeywordInTitle: boolean (true if "${keywordOrNiche}" appears in title)
- hasKeywordInSubtitle: boolean (true if "${keywordOrNiche}" appears in subtitle)
- publisherType: "KDP Indie" | "Trad" | "KDP Select" | "Small Press"
- tacticalInsight: specific tactical insight into why this book ranks and how a new author can outrank or differentiate from it.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item: any, idx: number) => {
        const absr = Number(item.absr) || Math.floor(Math.random() * 5000 + 500);
        const price = Number(item.price) || 4.99;
        const estDailySales = calculateDailySalesFromABSR(absr, 'kindle');
        const estMonthlySales = calculateMonthlySalesFromDaily(estDailySales);
        const estMonthlyRevenue = Math.round(estMonthlySales * price * 0.7);

        return {
          id: `comp-gemini-${Date.now()}-${idx}`,
          asin: item.asin || `B0${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          title: item.title,
          subtitle: item.subtitle || '',
          author: item.author || 'Independent Author',
          ageDays: Number(item.ageDays) || 120,
          publishDate: item.publishDate || '2025-08-10',
          absr,
          estDailySales,
          estMonthlySales,
          estMonthlyRevenue,
          price,
          pageCount: Number(item.pageCount) || 240,
          rating: Number(item.rating) || 4.6,
          reviewsCount: Number(item.reviewsCount) || 420,
          hasKeywordInTitle: Boolean(item.hasKeywordInTitle),
          hasKeywordInSubtitle: Boolean(item.hasKeywordInSubtitle),
          publisherType: item.publisherType || 'KDP Select',
          tacticalInsight: item.tacticalInsight || 'Strong subtitle SEO and active AMS campaigns.',
        };
      });
    }
    return generateAlgorithmicCompetitors(keywordOrNiche);
  } catch (error) {
    console.error('Gemini competition error, falling back:', error);
    return generateAlgorithmicCompetitors(keywordOrNiche);
  }
}

/**
 * Perform deep Category Finder for Amazon KDP
 */
export async function analyzeCategoriesWithGemini(
  nicheOrTopic: string,
  storeType: string = 'Kindle Store'
) {
  if (!ai) {
    return generateAlgorithmicCategories(nicheOrTopic, storeType);
  }

  try {
    const prompt = `You are the master cataloguer of Amazon KDP's 16,000+ categories (Publisher Rocket Category Search).
For the topic/niche: "${nicheOrTopic}", find 8 to 12 optimal Amazon categories across "${storeType}".

Return a JSON array of objects with:
- name: category terminal leaf name
- fullBreadcrumb: full Amazon hierarchical breadcrumb path (e.g. "Kindle Store > Kindle eBooks > Business & Money > Personal Finance > Budgeting")
- store: "${storeType}"
- salesForNumberOne: exact estimated daily sales required to achieve the #1 Bestseller orange banner today
- salesForTopTen: daily sales required to reach Top 10 in this category
- competitivenessScore: 1-100 difficulty
- growthRate: percentage growth trend (e.g. "+18% MoM")
- estimatedMonthlyCap: estimated total monthly royalty cap in this category (USD)
- directKdpPath: the exact BISAC / Amazon KDP backend dropdown category selector path to choose in your KDP dashboard`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item: any, idx: number) => ({
        id: `cat-gemini-${Date.now()}-${idx}`,
        name: item.name,
        fullBreadcrumb: item.fullBreadcrumb,
        store: item.store || storeType,
        salesForNumberOne: Number(item.salesForNumberOne) || 25,
        salesForTopTen: Number(item.salesForTopTen) || 8,
        competitivenessScore: Number(item.competitivenessScore) || 45,
        growthRate: item.growthRate || '+12% MoM',
        estimatedMonthlyCap: Number(item.estimatedMonthlyCap) || 35000,
        directKdpPath: item.directKdpPath || item.fullBreadcrumb,
      }));
    }
    return generateAlgorithmicCategories(nicheOrTopic, storeType);
  } catch (error) {
    console.error('Gemini categories error, falling back:', error);
    return generateAlgorithmicCategories(nicheOrTopic, storeType);
  }
}

/**
 * Generate 50+ Amazon Ads (AMS) targets: Keywords, Competitor ASINs, Categories, Authors
 */
export async function generateAmazonAdsWithGemini(
  seedOrTopic: string,
  authorOrBook: string = ''
) {
  if (!ai) {
    return generateAlgorithmicAds(seedOrTopic);
  }

  try {
    const prompt = `You are a high-ROI Amazon PPC & AMS Advertising specialist for KDP books.
Create a comprehensive Amazon Advertising target list for:
Seed Topic / Keyword: "${seedOrTopic}"
Related Book/Author: "${authorOrBook}"

Generate 20 to 30 highly targeted ad targets including:
1. Exact & Phrase Match high-intent buyer keywords
2. Broad Match discovery terms
3. Competitor ASINs (product targeting)
4. Leading Author names in this exact sub-genre

Return JSON array where each item has:
- targetType: "Keyword" | "Product/ASIN" | "Category" | "Author"
- targetValue: string (e.g., "dark mafia romance books", "B09ABC1234", "Colleen Hoover")
- matchType: "Exact" | "Phrase" | "Broad"
- suggestedBid: number in USD (e.g. 0.35, 0.52, 0.75 based on competitive density)
- estImpressions: estimated monthly impressions range (e.g., "35,000 / mo")
- relevanceScore: 1-100 relevance score
- sourceBook: optional explanation or competitor book title`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.35,
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item: any, idx: number) => ({
        id: `ad-gemini-${Date.now()}-${idx}`,
        targetType: item.targetType || 'Keyword',
        targetValue: item.targetValue,
        matchType: item.matchType || 'Exact',
        suggestedBid: Number(item.suggestedBid) || 0.45,
        estImpressions: item.estImpressions || '25,000 / mo',
        relevanceScore: Number(item.relevanceScore) || 90,
        sourceBook: item.sourceBook || '',
      }));
    }
    return generateAlgorithmicAds(seedOrTopic);
  } catch (error) {
    console.error('Gemini ads error, falling back:', error);
    return generateAlgorithmicAds(seedOrTopic);
  }
}

/**
 * Generate Book Title & Subtitle Opportunities with High Conversion Potential
 */
export async function generateBookTitlesWithGemini(
  genre: string,
  coreHook: string,
  targetAudience: string
) {
  if (!ai) {
    return generateAlgorithmicTitles(genre, coreHook);
  }

  try {
    const prompt = `You are a bestselling Amazon KDP title consultant.
Craft 6 to 10 killer, high-converting book titles and subtitles based on:
Genre: "${genre}"
Core Hook: "${coreHook}"
Target Audience: "${targetAudience}"

Rules:
- Amazon title + subtitle should be under 200 characters total.
- Must naturally incorporate high-traffic Amazon search phrases without keyword stuffing.
- Evoke emotion, curiosity, or clear value proposition.

Return JSON array where each object has:
- title: main title (punchy, memorable, 1-5 words)
- subtitle: descriptive, keyword-rich subtitle explaining the benefit or story hook
- hook: 1-sentence back cover elevator pitch
- primaryKeywords: array of 3-4 target search keywords embedded
- opportunityScore: 1-100 score based on title memorability + search volume
- marketAngle: strategic rationale for this angle`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item: any, idx: number) => {
        const fullTitle = `${item.title}: ${item.subtitle}`;
        return {
          id: `tit-gemini-${Date.now()}-${idx}`,
          title: item.title,
          subtitle: item.subtitle,
          hook: item.hook,
          primaryKeywords: item.primaryKeywords || [],
          opportunityScore: Number(item.opportunityScore) || 92,
          characterCount: fullTitle.length,
          marketAngle: item.marketAngle || 'Optimized for high CTR and search discovery.',
        };
      });
    }
    return generateAlgorithmicTitles(genre, coreHook);
  } catch (error) {
    console.error('Gemini titles error, falling back:', error);
    return generateAlgorithmicTitles(genre, coreHook);
  }
}

// ==================== ALGORITHMIC FALLBACKS ====================

function generateAlgorithmicKeywords(query: string, marketplace: string, format: string) {
  const variations = [
    `${query} for beginners`,
    `best ${query} guide 2026`,
    `${query} handbook and workbook`,
    `secrets of ${query} mastery`,
    `${query} step by step system`,
    `${query} lessons and blueprint`,
    `advanced ${query} strategies`,
    `${query} practical solutions`,
    `complete guide to ${query}`,
    `${query} daily habits and routines`,
    `${query} transformed in 30 days`,
    `${query} essential principles`,
  ];

  return variations.map((term, i) => {
    const baseSearches = Math.max(1200, Math.floor(25000 / (i * 0.7 + 1)));
    const competitors = Math.floor(Math.random() * 1800 + 200);
    const compScore = calculateRocketCompetitiveScore(competitors, 450, 8500);
    const oppScore = calculateOpportunityScore(baseSearches, compScore);

    return {
      id: `kw-algo-${Date.now()}-${i}`,
      keyword: term,
      amazonSearches: baseSearches,
      googleSearches: Math.round(baseSearches * 0.8),
      avgMonthlyEarnings: Math.round(baseSearches * 0.45),
      competitorCount: competitors,
      competitiveScore: compScore,
      opportunityScore: oppScore,
      trend: i % 3 === 0 ? 'up' : 'stable',
      isSelectedBackend: i < 7,
      semanticCluster: i < 4 ? 'High Demand Intent' : 'Long-tail Opportunity',
      notes: i < 7 ? 'Recommended for your 7 KDP Backend slots' : 'Solid secondary keyword for AMS ads',
    };
  });
}

function generateAlgorithmicCompetitors(query: string) {
  const titles = [
    { title: `The Master Key to ${query}`, sub: `A Proven Framework to Accelerate Results` },
    { title: `Atomic ${query}`, sub: `Tiny Changes, Remarkable Transformations` },
    { title: `The 30-Day ${query} Revolution`, sub: `Daily Action Guide for Total Mastery` },
    { title: `Beyond ${query}`, sub: `What Top 1% Practitioners Never Reveal` },
    { title: `${query} Unlocked`, sub: `Step-by-Step Practical Blueprint` },
    { title: `The Art of ${query}`, sub: `Timeless Wisdom and Modern Applications` },
  ];

  return titles.map((item, i) => {
    const absr = Math.floor(Math.random() * 15000 + 450);
    const price = [2.99, 4.99, 7.99, 9.99, 14.99][i % 5];
    const dailySales = calculateDailySalesFromABSR(absr, 'kindle');
    const monthlySales = calculateMonthlySalesFromDaily(dailySales);

    return {
      id: `comp-algo-${Date.now()}-${i}`,
      asin: `B0${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      title: item.title,
      subtitle: item.sub,
      author: ['Alexander Reed', 'Elena Scott', 'Dr. David Vance', 'Sarah Jenkins', 'Marcus Chen'][i % 5],
      ageDays: Math.floor(Math.random() * 400 + 30),
      publishDate: '2025-07-15',
      absr,
      estDailySales: dailySales,
      estMonthlySales: monthlySales,
      estMonthlyRevenue: Math.round(monthlySales * price * 0.7),
      price,
      pageCount: Math.floor(Math.random() * 200 + 150),
      rating: Number((Math.random() * 0.5 + 4.4).toFixed(1)),
      reviewsCount: Math.floor(Math.random() * 2500 + 150),
      hasKeywordInTitle: item.title.toLowerCase().includes(query.toLowerCase()),
      hasKeywordInSubtitle: item.sub.toLowerCase().includes(query.toLowerCase()),
      publisherType: (i % 2 === 0 ? 'KDP Select' : 'KDP Indie') as any,
      tacticalInsight: 'Captures primary niche traffic; weak subtitle allows easy outranking.',
    };
  });
}

function generateAlgorithmicCategories(query: string, storeType: string) {
  return [
    {
      id: `cat-algo-1`,
      name: `${query} Reference & Guides`,
      fullBreadcrumb: `${storeType} > Nonfiction > Professional & Technical > Reference`,
      store: storeType as any,
      salesForNumberOne: 24,
      salesForTopTen: 7,
      competitivenessScore: 36,
      growthRate: '+19% MoM',
      estimatedMonthlyCap: 32000,
      directKdpPath: 'Reference > General Guides',
    },
    {
      id: `cat-algo-2`,
      name: `${query} Applied Practice`,
      fullBreadcrumb: `${storeType} > Self-Help > Personal Transformation > Productivity`,
      store: storeType as any,
      salesForNumberOne: 48,
      salesForTopTen: 16,
      competitivenessScore: 58,
      growthRate: '+12% MoM',
      estimatedMonthlyCap: 64000,
      directKdpPath: 'Self-Help > General',
    },
  ];
}

function generateAlgorithmicAds(seed: string) {
  return [
    {
      id: `ad-algo-1`,
      targetType: 'Keyword' as const,
      targetValue: `${seed} books`,
      matchType: 'Exact' as const,
      suggestedBid: 0.45,
      estImpressions: '35,000 / mo',
      relevanceScore: 96,
    },
    {
      id: `ad-algo-2`,
      targetType: 'Keyword' as const,
      targetValue: `best ${seed} 2026`,
      matchType: 'Phrase' as const,
      suggestedBid: 0.38,
      estImpressions: '22,000 / mo',
      relevanceScore: 91,
    },
  ];
}

function generateAlgorithmicTitles(genre: string, hook: string) {
  return [
    {
      id: `tit-algo-1`,
      title: `The ${genre} Protocol`,
      subtitle: `How to Master ${hook} Without Overwhelm`,
      hook: `Discover the breakthrough blueprint for fast results.`,
      primaryKeywords: [genre, hook],
      opportunityScore: 94,
      characterCount: 65,
      marketAngle: 'Direct, clear, and action-oriented.',
    },
  ];
}

/**
 * High-precision bilingual translator for Amazon KDP & Book Publishing (English <-> Arabic)
 * Supports both Google Translate engine and Gemini Literary Precision engine.
 */
export async function translateTextWithGemini(
  text: string,
  targetLang: 'ar' | 'en' = 'ar',
  engine: 'google' | 'gemini' = 'gemini'
): Promise<string> {
  if (!text || !text.trim()) return '';

  // If Google Translate requested or Gemini unavailable, attempt Google Translate API
  if (engine === 'google' || !ai) {
    try {
      const sourceLang = targetLang === 'ar' ? 'en' : 'ar';
      const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
        text
      )}`;
      const gtxRes = await fetch(gtxUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      if (gtxRes.ok) {
        const data = await gtxRes.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const joined = data[0].map((chunk: any) => chunk[0]).join('');
          if (joined.trim()) return joined.trim();
        }
      }
    } catch (e) {
      console.warn('Google Translate proxy error, falling back to AI if available:', e);
    }
  }

  if (!ai) {
    return text;
  }

  try {
    const prompt = `أنت مترجم أدبي وخبير نشر متخصص في Amazon KDP وتحليل الكلمات المفتاحية والأسواق.
المطلوب ترجمة النص التالي بين الإنجليزية والعربية بأعلى درجات الدقة اللغوية والبلاغية المناسبة لصناعة النشر والكتب على أمازون.
اللغة المستهدفة: ${
      targetLang === 'ar' 
        ? 'العربية الفصحى الدقيقة المستخدمة في عناوين الكتب، والنيشات، والكلمات المفتاحية التجارية، ودور النشر الرائدة' 
        : 'English (Fluent, authentic Amazon book marketing and high-intent buyer keywords)'
    }.

إرشادات هامة:
1. تجنب الترجمة الحرفية الركيكة تماماً؛ استخدم المصطلحات الدارجة المعتمدة لدى دور النشر والقراء (مثلاً: "Enemies to lovers" تترجم إلى "من أعداء إلى عشاق"، و"Habit building" تترجم إلى "بناء العادات واكتسابها").
2. إذا كان النص عبارة مفتاحية (Keyword)، اجعلها عبارة بحث طبيعية يكتبها القارئ الفعلي.
3. إذا كان عنوان كتاب أو عنوان فرعي، حافظ على الرنين التسويقي والجاذبية الأدبية.

النص المطلوب ترجمته:
"${text}"

أعد فقط النص المترجم بدقة بدون أي علامات تنصيص أو شروحات إضافية.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return (response.text || text).trim();
  } catch (err) {
    console.error('Translation error:', err);
    return text;
  }
}

