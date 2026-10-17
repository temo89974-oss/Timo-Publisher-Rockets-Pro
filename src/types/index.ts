export type TabType = 
  | 'keywords' 
  | 'competition' 
  | 'categories' 
  | 'amazon-ads' 
  | 'title-generator' 
  | 'calculator' 
  | 'white-label' 
  | 'projects';

export type BookFormat = 'all' | 'kindle' | 'paperback' | 'audible';
export type AmazonMarketplace = 'US' | 'UK' | 'DE' | 'CA' | 'AU' | 'FR' | 'IT' | 'ES';

export interface KeywordItem {
  id: string;
  keyword: string;
  amazonSearches: number;
  googleSearches: number;
  avgMonthlyEarnings: number;
  competitorCount: number;
  competitiveScore: number; // 1-100 (Green <= 35, Orange 36-60, Red > 60)
  opportunityScore: number; // 1-100 (Higher is better)
  trend: 'up' | 'stable' | 'down';
  isSelectedBackend: boolean;
  semanticCluster?: string;
  notes?: string;
}

export interface CompetitorBook {
  id: string;
  asin: string;
  title: string;
  subtitle?: string;
  author: string;
  coverUrl?: string;
  ageDays: number;
  publishDate: string;
  absr: number; // Amazon Best Seller Rank
  estDailySales: number;
  estMonthlySales: number;
  estMonthlyRevenue: number;
  price: number;
  pageCount: number;
  rating: number;
  reviewsCount: number;
  hasKeywordInTitle: boolean;
  hasKeywordInSubtitle: boolean;
  publisherType: 'KDP Indie' | 'Trad' | 'KDP Select' | 'Small Press';
  tacticalInsight?: string;
}

export interface AmazonCategory {
  id: string;
  name: string;
  fullBreadcrumb: string;
  store: 'Kindle Store' | 'Books (Print)' | 'Audible Audiobooks';
  salesForNumberOne: number; // Daily sales to rank #1
  salesForTopTen: number;    // Daily sales to rank Top 10
  competitivenessScore: number; // 1-100
  growthRate: string;
  estimatedMonthlyCap: number;
  directKdpPath: string;
}

export interface AmazonAdTarget {
  id: string;
  targetType: 'Keyword' | 'Product/ASIN' | 'Category' | 'Author';
  targetValue: string;
  matchType: 'Exact' | 'Phrase' | 'Broad' | 'Negative';
  suggestedBid: number; // In USD
  estImpressions: string;
  relevanceScore: number; // 1-100
  sourceBook?: string;
}

export interface TitleIdea {
  id: string;
  title: string;
  subtitle: string;
  hook: string;
  primaryKeywords: string[];
  opportunityScore: number;
  characterCount: number;
  marketAngle: string;
}

export interface WhiteLabelConfig {
  agencyName: string;
  agencyLogoUrl: string;
  tagline: string;
  accentColor: string;
  contactEmail: string;
  websiteUrl: string;
  reportFooterNote: string;
  clientName: string;
  isPresentationMode: boolean;
  watermarkEnabled: boolean;
}

export interface SavedProject {
  id: string;
  name: string;
  targetAudience: string;
  niche: string;
  marketplace: AmazonMarketplace;
  createdAt: string;
  updatedAt: string;
  keywords: KeywordItem[];
  competitors: CompetitorBook[];
  categories: AmazonCategory[];
  adTargets: AmazonAdTarget[];
  titleIdeas: TitleIdea[];
  notes: string;
}
