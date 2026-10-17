import { KeywordItem, CompetitorBook, AmazonCategory, AmazonAdTarget, TitleIdea, AmazonMarketplace, BookFormat } from '../types';
import { NICHE_PRESETS } from '../data/mockKdpDatabase';

export async function fetchKeywords(
  query: string,
  marketplace: AmazonMarketplace = 'US',
  format: BookFormat = 'all'
): Promise<KeywordItem[]> {
  try {
    const res = await fetch('/api/analyze-keywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, marketplace, format }),
    });
    if (!res.ok) throw new Error('Failed to fetch keywords');
    const result = await res.json();
    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
      return result.data;
    }
    throw new Error('Empty result from server');
  } catch (err) {
    console.warn('Using client preset fallback for keywords:', err);
    // Return matching preset or default
    const preset = NICHE_PRESETS.find(p => p.defaultSeedKeyword.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(p.nicheId)) || NICHE_PRESETS[0];
    return preset.keywords;
  }
}

export async function fetchCompetition(
  query: string,
  marketplace: AmazonMarketplace = 'US'
): Promise<CompetitorBook[]> {
  try {
    const res = await fetch('/api/analyze-competition', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, marketplace }),
    });
    if (!res.ok) throw new Error('Failed to fetch competition');
    const result = await res.json();
    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
      return result.data;
    }
    throw new Error('Empty result from server');
  } catch (err) {
    console.warn('Using client preset fallback for competition:', err);
    const preset = NICHE_PRESETS.find(p => p.defaultSeedKeyword.toLowerCase().includes(query.toLowerCase())) || NICHE_PRESETS[0];
    return preset.competitors;
  }
}

export async function fetchCategories(
  query: string,
  storeType: string = 'Kindle Store'
): Promise<AmazonCategory[]> {
  try {
    const res = await fetch('/api/analyze-categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, storeType }),
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const result = await res.json();
    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
      return result.data;
    }
    throw new Error('Empty result from server');
  } catch (err) {
    console.warn('Using client preset fallback for categories:', err);
    const preset = NICHE_PRESETS.find(p => p.defaultSeedKeyword.toLowerCase().includes(query.toLowerCase())) || NICHE_PRESETS[0];
    return preset.categories;
  }
}

export async function fetchAmazonAds(
  query: string,
  authorOrBook: string = ''
): Promise<AmazonAdTarget[]> {
  try {
    const res = await fetch('/api/generate-ads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, authorOrBook }),
    });
    if (!res.ok) throw new Error('Failed to fetch ads');
    const result = await res.json();
    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
      return result.data;
    }
    throw new Error('Empty result from server');
  } catch (err) {
    console.warn('Using client preset fallback for ads:', err);
    const preset = NICHE_PRESETS.find(p => p.defaultSeedKeyword.toLowerCase().includes(query.toLowerCase())) || NICHE_PRESETS[0];
    return preset.ads;
  }
}

export async function fetchTitleIdeas(
  genre: string,
  coreHook: string,
  targetAudience: string
): Promise<TitleIdea[]> {
  try {
    const res = await fetch('/api/generate-titles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ genre, coreHook, targetAudience }),
    });
    if (!res.ok) throw new Error('Failed to fetch title ideas');
    const result = await res.json();
    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
      return result.data;
    }
    throw new Error('Empty result from server');
  } catch (err) {
    console.warn('Using client preset fallback for titles:', err);
    const preset = NICHE_PRESETS[0];
    return preset.titleIdeas;
  }
}
