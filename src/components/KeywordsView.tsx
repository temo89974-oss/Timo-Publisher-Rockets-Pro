import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Filter, 
  Download, 
  Copy, 
  Check, 
  ArrowUpDown, 
  Flame, 
  TrendingUp, 
  HelpCircle, 
  Layers,
  ChevronDown,
  Info,
  CheckCircle2,
  Trash2,
  Zap,
  Languages,
} from 'lucide-react';
import { KeywordItem, AmazonMarketplace, BookFormat } from '../types';
import { formatCurrency, formatNumber } from '../utils/amazonCalculators';
import { exportKeywordsToCSV } from '../utils/exportUtils';
import { NICHE_PRESETS } from '../data/mockKdpDatabase';
import { Language, translations } from '../i18n/translations';
import { translateText } from '../services/translator';

interface KeywordsViewProps {
  keywords: KeywordItem[];
  isLoading: boolean;
  onSearch: (query: string, marketplace: AmazonMarketplace, format: BookFormat) => void;
  onToggleBackendSlot: (id: string) => void;
  onAutoSelectTop7: () => void;
  onClearBackendSlots: () => void;
  currentQuery: string;
  lang: Language;
}

export const KeywordsView: React.FC<KeywordsViewProps> = ({
  keywords,
  isLoading,
  onSearch,
  onToggleBackendSlot,
  onAutoSelectTop7,
  onClearBackendSlots,
  currentQuery,
  lang,
}) => {
  const t = translations[lang];
  const [searchInput, setSearchInput] = useState(currentQuery || 'dark mafia romance');
  const [marketplace, setMarketplace] = useState<AmazonMarketplace>('US');
  const [format, setFormat] = useState<BookFormat>('all');
  const [filterCluster, setFilterCluster] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'opportunity' | 'searches' | 'earnings' | 'competition'>('opportunity');
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const [copiedAllSlots, setCopiedAllSlots] = useState(false);
  const [isTranslatingSearch, setIsTranslatingSearch] = useState(false);
  const [translatedKeywords, setTranslatedKeywords] = useState<Record<string, string>>({});
  const [translatingKeywordId, setTranslatingKeywordId] = useState<string | null>(null);

  const handleTranslateSearchInput = async () => {
    if (!searchInput.trim()) return;
    setIsTranslatingSearch(true);
    try {
      const hasArabic = /[\u0600-\u06FF]/.test(searchInput);
      const targetLang = hasArabic ? 'en' : 'ar';
      const translated = await translateText(searchInput, targetLang, 'gemini');
      setSearchInput(translated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTranslatingSearch(false);
    }
  };

  const handleTranslateSingleKeyword = async (id: string, keyword: string) => {
    if (translatedKeywords[id]) {
      setTranslatedKeywords((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }
    setTranslatingKeywordId(id);
    try {
      const hasArabic = /[\u0600-\u06FF]/.test(keyword);
      const targetLang = hasArabic ? 'en' : 'ar';
      const translated = await translateText(keyword, targetLang, 'gemini');
      setTranslatedKeywords((prev) => ({ ...prev, [id]: translated }));
    } catch (e) {
      console.error(e);
    } finally {
      setTranslatingKeywordId(null);
    }
  };

  const selectedBackendKeywords = keywords.filter(k => k.isSelectedBackend);

  // Extract unique clusters for filter dropdown
  const clusters = Array.from(new Set(keywords.map(k => k.semanticCluster).filter(Boolean)));

  // Filter & Sort
  const processedKeywords = [...keywords]
    .filter(k => {
      if (filterCluster !== 'all' && k.semanticCluster !== filterCluster) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'opportunity') return b.opportunityScore - a.opportunityScore;
      if (sortBy === 'searches') return b.amazonSearches - a.amazonSearches;
      if (sortBy === 'earnings') return b.avgMonthlyEarnings - a.avgMonthlyEarnings;
      if (sortBy === 'competition') return a.competitiveScore - b.competitiveScore; // Lower is easier
      return 0;
    });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim(), marketplace, format);
    }
  };

  const handleCopySingle = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyword(text);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  const handleCopyAllSlots = () => {
    const textToCopy = selectedBackendKeywords.map(k => k.keyword).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopiedAllSlots(true);
    setTimeout(() => setCopiedAllSlots(false), 2500);
  };

  // Helper for Rocket Competitive Score color and rating
  const getScoreBadge = (score: number) => {
    if (score <= 35) {
      return {
        bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
        label: t.diffLowGolden,
        color: 'text-emerald-400',
      };
    }
    if (score <= 60) {
      return {
        bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
        label: t.diffModerate,
        color: 'text-amber-400',
      };
    }
    return {
      bg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
      label: t.diffFierce,
      color: 'text-rose-400',
    };
  };

  return (
    <div className="space-y-6">
      
      {/* Search Header Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-slate-900/80 shadow-xl">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t.keywordSearchPlaceholder}
                className="w-full pl-12 rtl:pl-28 rtl:pr-12 pr-28 py-3.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans"
              />
              <button
                type="button"
                onClick={handleTranslateSearchInput}
                disabled={isTranslatingSearch || !searchInput.trim()}
                className="absolute right-3 rtl:right-auto rtl:left-3 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition-all disabled:opacity-40 cursor-pointer shadow-sm"
                title={lang === 'ar' ? 'ترجمة فورية للإنجليزية/العربية عبر جوجل والذكاء الاصطناعي' : 'Instant translate query with Google / AI'}
              >
                {isTranslatingSearch ? (
                  <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Languages className="w-3.5 h-3.5 text-indigo-400" />
                )}
                <span>{lang === 'ar' ? 'ترجمة' : 'Translate'}</span>
              </button>
            </div>

            {/* Marketplace Selector */}
            <div className="flex gap-2">
              <select
                value={marketplace}
                onChange={(e) => setMarketplace(e.target.value as AmazonMarketplace)}
                className="px-3.5 py-3.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="US">🇺🇸 Amazon US (.com)</option>
                <option value="UK">🇬🇧 Amazon UK (.co.uk)</option>
                <option value="DE">🇩🇪 Amazon DE (.de)</option>
                <option value="CA">🇨🇦 Amazon CA (.ca)</option>
                <option value="AU">🇦🇺 Amazon AU (.com.au)</option>
              </select>

              {/* Format Selector */}
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as BookFormat)}
                className="px-3.5 py-3.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">{t.allFormats}</option>
                <option value="kindle">{t.kindleEbook}</option>
                <option value="paperback">{t.paperback}</option>
                <option value="audible">{t.audible}</option>
              </select>

              {/* Search Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t.analyzing}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{t.runDeepSearch}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Preset Pills */}
          <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              {t.quickPresets}
            </span>
            {NICHE_PRESETS.map((preset) => (
              <button
                key={preset.nicheId}
                type="button"
                onClick={() => {
                  setSearchInput(preset.defaultSeedKeyword);
                  onSearch(preset.defaultSeedKeyword, marketplace, format);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-500/50 border border-slate-700 text-slate-300 hover:text-white transition-all text-[11px] cursor-pointer"
              >
                {lang === 'ar' ? (preset.nameAr || preset.name) : preset.name}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* The 7 KDP Backend Keywords Action Drawer */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-slate-950 p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-indigo-500/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold">
              7
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{t.official7SlotsTitle}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                  selectedBackendKeywords.length === 7 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                }`}>
                  {selectedBackendKeywords.length} {t.selectedOf7}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {t.official7SlotsSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={onAutoSelectTop7}
              className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 text-xs font-semibold transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.autoFillTop7}</span>
            </button>

            {selectedBackendKeywords.length > 0 && (
              <button
                onClick={onClearBackendSlots}
                className="flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-rose-400 text-xs font-medium transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.clearSlots}</span>
              </button>
            )}

            <button
              onClick={handleCopyAllSlots}
              disabled={selectedBackendKeywords.length === 0}
              className="flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
            >
              {copiedAllSlots ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{t.copied7Slots}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.copy7Slots}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 7 Slots Visual Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2.5">
          {Array.from({ length: 7 }).map((_, idx) => {
            const kw = selectedBackendKeywords[idx];
            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all flex flex-col justify-between min-h-[82px] ${
                  kw
                    ? 'bg-slate-900/90 border-indigo-500/50 shadow-md shadow-indigo-950/50'
                    : 'bg-slate-950/40 border-dashed border-slate-800 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className={kw ? 'text-indigo-400' : 'text-slate-600'}>{t.slotNumber}{idx + 1}</span>
                  {kw && (
                    <button
                      onClick={() => onToggleBackendSlot(kw.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove from slot"
                    >
                      ×
                    </button>
                  )}
                </div>

                {kw ? (
                  <div>
                    <p className="text-xs font-bold text-white line-clamp-2 leading-tight">{kw.keyword}</p>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                      <span>{formatNumber(kw.amazonSearches)}/mo</span>
                      <span className="font-semibold text-emerald-400">Score {kw.opportunityScore}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-600 italic">{t.emptySlot}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Metrics Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div className="flex items-center space-x-3 rtl:space-x-reverse flex-wrap">
          <span className="text-sm font-bold text-white">
            {processedKeywords.length} {t.opportunitiesFound}
          </span>

          {/* Cluster filter */}
          {clusters.length > 0 && (
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <select
                value={filterCluster}
                onChange={(e) => setFilterCluster(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-300 text-xs focus:outline-none"
              >
                <option value="all">{t.allClusters}</option>
                {clusters.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {/* Sort By */}
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-300 text-xs focus:outline-none"
            >
              <option value="opportunity">{t.sortOpportunity}</option>
              <option value="searches">{t.sortSearches}</option>
              <option value="earnings">{t.sortEarnings}</option>
              <option value="competition">{t.sortCompetition}</option>
            </select>
          </div>
        </div>

        {/* Export CSV */}
        <button
          onClick={() => exportKeywordsToCSV(processedKeywords, `KDP_Keywords_${searchInput.replace(/\s+/g, '_')}.csv`)}
          className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>{t.exportKeywordsCsv}</span>
        </button>
      </div>

      {/* Main High-Performance Keywords Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 w-12 text-center">{t.thSlot}</th>
                <th className="py-3.5 px-4">{t.thKeyword}</th>
                <th className="py-3.5 px-4 text-right rtl:text-left">
                  <span className="flex items-center justify-end rtl:justify-start gap-1">
                    {t.thAmazonSearches}
                    <span title="Estimated monthly searches by Amazon shoppers">
                      <Info className="w-3 h-3 text-slate-500" />
                    </span>
                  </span>
                </th>
                <th className="py-3.5 px-4 text-right rtl:text-left">{t.thAvgMonthly}</th>
                <th className="py-3.5 px-4 text-right rtl:text-left">{t.thCompetitors}</th>
                <th className="py-3.5 px-4 text-center">
                  <span className="flex items-center justify-center gap-1">
                    {t.thDifficulty}
                    <span title="Rocket Score 1-100: Green (Easy), Orange (Moderate), Red (Fierce)">
                      <Info className="w-3 h-3 text-slate-500" />
                    </span>
                  </span>
                </th>
                <th className="py-3.5 px-4 text-center">{t.thOpportunity}</th>
                <th className="py-3.5 px-4 text-center">{t.thAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {processedKeywords.map((item) => {
                const scoreBadge = getScoreBadge(item.competitiveScore);
                const isSelected = item.isSelectedBackend;

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors hover:bg-slate-800/40 ${
                      isSelected ? 'bg-indigo-950/20' : ''
                    }`}
                  >
                    {/* Checkbox for 7 Backend Slots */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onToggleBackendSlot(item.id)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm shadow-indigo-500/50'
                            : 'border-slate-700 hover:border-slate-500 text-transparent'
                        }`}
                        title={isSelected ? 'Remove from 7 KDP slots' : 'Add to 7 KDP slots'}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </td>

                    {/* Keyword Phrase */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-100 text-sm hover:text-indigo-400 transition-colors">
                          {item.keyword}
                        </span>
                        
                        {translatedKeywords[item.id] && (
                          <div className="text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-md mt-1 inline-block w-fit">
                            🇸🇦 {translatedKeywords[item.id]}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {item.semanticCluster && (
                            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                              {item.semanticCluster}
                            </span>
                          )}
                          {item.trend === 'up' && (
                            <span className="flex items-center text-[10px] text-emerald-400 font-semibold gap-0.5">
                              <TrendingUp className="w-3 h-3" /> Trending Up
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleTranslateSingleKeyword(item.id, item.keyword)}
                            className="text-[10px] text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer hover:underline"
                            title={lang === 'ar' ? 'ترجمة دقيقة للغة العربية' : 'Translate accurately to Arabic'}
                          >
                            <Languages className="w-3 h-3 text-indigo-400" />
                            <span>
                              {translatingKeywordId === item.id 
                                ? (lang === 'ar' ? 'جاري الترجمة...' : 'Translating...') 
                                : (translatedKeywords[item.id] 
                                    ? (lang === 'ar' ? 'إخفاء الترجمة' : 'Hide translation') 
                                    : (lang === 'ar' ? 'ترجمة عربية دقيقة' : 'Translate to Arabic'))}
                            </span>
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Amazon Searches */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-extrabold text-white text-sm">
                          {formatNumber(item.amazonSearches)}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Google: {formatNumber(item.googleSearches)}
                        </span>
                      </div>
                    </td>

                    {/* Avg Monthly Earnings */}
                    <td className="py-3.5 px-4 text-right font-bold text-slate-200">
                      {formatCurrency(item.avgMonthlyEarnings)}
                    </td>

                    {/* Competitors Count */}
                    <td className="py-3.5 px-4 text-right text-slate-300">
                      {formatNumber(item.competitorCount)}
                    </td>

                    {/* Rocket Competitive Score */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${scoreBadge.bg}`}>
                          {item.competitiveScore} / 100
                        </span>
                        <span className={`text-[10px] font-semibold mt-0.5 ${scoreBadge.color}`}>
                          {scoreBadge.label}
                        </span>
                      </div>
                    </td>

                    {/* Opportunity Score */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-black">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span>{item.opportunityScore}</span>
                      </div>
                    </td>

                    {/* Copy action */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleCopySingle(item.keyword)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                        title="Copy keyword"
                      >
                        {copiedKeyword === item.keyword ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
