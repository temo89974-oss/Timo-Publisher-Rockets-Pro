import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Sparkles, 
  Download, 
  DollarSign, 
  TrendingUp, 
  BookOpen, 
  Star, 
  CheckCircle, 
  XCircle, 
  Target, 
  ExternalLink,
  ShieldAlert,
  LayoutGrid,
  List,
  Calendar,
  Layers,
  ArrowRight,
  Languages,
} from 'lucide-react';
import { CompetitorBook, AmazonMarketplace } from '../types';
import { formatCurrency, formatNumber } from '../utils/amazonCalculators';
import { exportCompetitorsToCSV } from '../utils/exportUtils';
import { Language, translations } from '../i18n/translations';
import { translateText } from '../services/translator';

interface CompetitionViewProps {
  competitors: CompetitorBook[];
  isLoading: boolean;
  onSearch: (query: string, marketplace: AmazonMarketplace) => void;
  onSendAsinToAds: (asin: string, title: string) => void;
  currentQuery: string;
  lang: Language;
}

export const CompetitionView: React.FC<CompetitionViewProps> = ({
  competitors,
  isLoading,
  onSearch,
  onSendAsinToAds,
  currentQuery,
  lang,
}) => {
  const t = translations[lang];
  const [searchInput, setSearchInput] = useState(currentQuery || 'dark mafia romance');
  const [marketplace, setMarketplace] = useState<AmazonMarketplace>('US');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sentAsin, setSentAsin] = useState<string | null>(null);
  const [isTranslatingSearch, setIsTranslatingSearch] = useState(false);
  const [translatedBooks, setTranslatedBooks] = useState<Record<string, { title: string; tactic?: string }>>({});
  const [translatingBookId, setTranslatingBookId] = useState<string | null>(null);

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

  const handleTranslateCompetitor = async (book: CompetitorBook) => {
    if (translatedBooks[book.id]) {
      setTranslatedBooks((prev) => {
        const next = { ...prev };
        delete next[book.id];
        return next;
      });
      return;
    }
    setTranslatingBookId(book.id);
    try {
      const fullText = `${book.title}. ${book.tacticalInsight || ''}`;
      const translated = await translateText(fullText, 'ar', 'gemini');
      const parts = translated.split('.');
      setTranslatedBooks((prev) => ({
        ...prev,
        [book.id]: {
          title: parts[0] || translated,
          tactic: parts.slice(1).join('.').trim() || book.tacticalInsight,
        },
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setTranslatingBookId(null);
    }
  };

  // Aggregated Niche Metrics
  const totalMonthlyRev = competitors.reduce((acc, c) => acc + c.estMonthlyRevenue, 0);
  const totalDailySales = competitors.reduce((acc, c) => acc + c.estDailySales, 0);
  const avgPrice = competitors.length > 0 
    ? Number((competitors.reduce((acc, c) => acc + c.price, 0) / competitors.length).toFixed(2)) 
    : 0;
  const avgAbsr = competitors.length > 0 
    ? Math.round(competitors.reduce((acc, c) => acc + c.absr, 0) / competitors.length) 
    : 0;
  const avgReviews = competitors.length > 0 
    ? Math.round(competitors.reduce((acc, c) => acc + c.reviewsCount, 0) / competitors.length) 
    : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim(), marketplace);
    }
  };

  const handleSendAsin = (asin: string, title: string) => {
    onSendAsinToAds(asin, title);
    setSentAsin(asin);
    setTimeout(() => setSentAsin(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Search Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-slate-900/80 shadow-xl">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t.compSearchPlaceholder}
              className="w-full pl-12 rtl:pl-28 rtl:pr-12 pr-28 py-3.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans"
            />
            <button
              type="button"
              onClick={handleTranslateSearchInput}
              disabled={isTranslatingSearch || !searchInput.trim()}
              className="absolute right-3 rtl:right-auto rtl:left-3 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition-all disabled:opacity-40 cursor-pointer shadow-sm"
              title={lang === 'ar' ? 'ترجمة فورية للإنجليزية/العربية' : 'Translate search term'}
            >
              {isTranslatingSearch ? (
                <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Languages className="w-3.5 h-3.5 text-indigo-400" />
              )}
              <span>{lang === 'ar' ? 'ترجمة' : 'Translate'}</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 rtl:space-x-reverse px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t.auditingRivals}</span>
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                <span>{t.analyzeCompetitors}</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Niche Viability Pulse Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="glass-panel-subtle rounded-xl p-4 border border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{t.nicheMonthlyRevenue}</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">
            {formatCurrency(totalMonthlyRev)}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">{t.nicheRevenueSub}</p>
        </div>

        <div className="glass-panel-subtle rounded-xl p-4 border border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{t.dailyCopiesSold}</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {formatNumber(totalDailySales)} <span className="text-xs text-slate-400 font-normal">units/day</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">{t.calculatedFromAbsr}</p>
        </div>

        <div className="glass-panel-subtle rounded-xl p-4 border border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{t.averageListPrice}</span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            ${avgPrice}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">{t.pricingBenchmark}</p>
        </div>

        <div className="glass-panel-subtle rounded-xl p-4 border border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{t.averageAbsrRank}</span>
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-300">
            #{formatNumber(avgAbsr)}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">{t.avgReviewsSub}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-bold text-white">
            {competitors.length} {t.rankedCompetitorBooks}
          </span>
          <span className="text-xs text-slate-400">
            {t.empiricalCurveSub}
          </span>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {/* View mode buttons */}
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'table' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Table Audit View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Book Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={() => exportCompetitorsToCSV(competitors, `KDP_Competitors_${searchInput.replace(/\s+/g, '_')}.csv`)}
            className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.exportCompetitorsCsv}</span>
          </button>
        </div>
      </div>

      {/* TABLE AUDIT VIEW */}
      {viewMode === 'table' ? (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">{t.thTitleAuthor}</th>
                  <th className="py-3.5 px-4 text-center">{t.thAgePages}</th>
                  <th className="py-3.5 px-4 text-center">{t.thAbsrRank}</th>
                  <th className="py-3.5 px-4 text-right rtl:text-left">{t.thEstDailySales}</th>
                  <th className="py-3.5 px-4 text-right rtl:text-left">{t.thEstMonthlyRev}</th>
                  <th className="py-3.5 px-4 text-center">{t.thPriceRating}</th>
                  <th className="py-3.5 px-4 text-center">{t.thInTitle}</th>
                  <th className="py-3.5 px-4 text-center">{t.thInSubtitle}</th>
                  <th className="py-3.5 px-4 text-center">{t.thTargetAsin}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {competitors.map((book) => {
                  return (
                    <tr key={book.id} className="transition-colors hover:bg-slate-800/40">
                      {/* Title & Author */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-start space-x-3">
                          <div className="w-9 h-13 rounded bg-gradient-to-br from-indigo-900 via-slate-800 to-slate-900 border border-slate-700 flex-shrink-0 flex items-center justify-center text-[9px] font-black text-indigo-300 p-1 text-center shadow">
                            {book.title.substring(0, 10)}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm line-clamp-1">{book.title}</p>
                            {translatedBooks[book.id]?.title && (
                              <p className="text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-md mt-0.5">
                                🇸🇦 {translatedBooks[book.id].title}
                              </p>
                            )}
                            {book.subtitle && (
                              <p className="text-[11px] text-slate-400 line-clamp-1 italic">{book.subtitle}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 flex-wrap">
                              <span>by <strong className="text-slate-300">{book.author}</strong></span>
                              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-indigo-300 font-semibold">
                                {book.publisherType}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleTranslateCompetitor(book)}
                                className="text-[10px] text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer hover:underline"
                                title="ترجمة تفاصيل الكتاب والتكتيك للعربية"
                              >
                                <Languages className="w-3 h-3 text-indigo-400" />
                                <span>
                                  {translatingBookId === book.id
                                    ? (lang === 'ar' ? 'جاري الترجمة...' : 'Translating...')
                                    : (translatedBooks[book.id]
                                        ? (lang === 'ar' ? 'إخفاء' : 'Hide')
                                        : (lang === 'ar' ? 'ترجمة الكتاب والتكتيك' : 'Translate to Arabic'))}
                                </span>
                              </button>
                            </div>
                            {book.tacticalInsight && (
                              <div className="text-[10px] text-indigo-300/90 mt-1 bg-indigo-950/40 p-1.5 rounded border border-indigo-500/20">
                                <span>💡 <strong>{t.tacticalTactic}</strong> {book.tacticalInsight}</span>
                                {translatedBooks[book.id]?.tactic && (
                                  <div className="text-emerald-300 font-semibold mt-1 pt-1 border-t border-indigo-500/20">
                                    🇸🇦 {translatedBooks[book.id].tactic}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Age / Pages */}
                      <td className="py-3.5 px-4 text-center text-slate-300">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold">{book.ageDays} days</span>
                          <span className="text-[10px] text-slate-500">{book.pageCount} pages</span>
                        </div>
                      </td>

                      {/* ABSR Rank */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-extrabold text-xs">
                          #{formatNumber(book.absr)}
                        </span>
                      </td>

                      {/* Est. Daily Sales */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-black text-white text-sm">
                            {formatNumber(book.estDailySales)}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatNumber(book.estMonthlySales)} / mo
                          </span>
                        </div>
                      </td>

                      {/* Monthly Revenue */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-black text-emerald-400 text-sm">
                          {formatCurrency(book.estMonthlyRevenue)}
                        </span>
                      </td>

                      {/* Price / Rating */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-extrabold text-white text-xs">${book.price.toFixed(2)}</span>
                          <span className="text-[10px] text-amber-300 flex items-center gap-0.5">
                            ★ {book.rating} ({formatNumber(book.reviewsCount)})
                          </span>
                        </div>
                      </td>

                      {/* In Title */}
                      <td className="py-3.5 px-4 text-center">
                        {book.hasKeywordInTitle ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-3.5 h-3.5" /> {t.yes}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                            <XCircle className="w-3.5 h-3.5" /> {t.no}
                          </span>
                        )}
                      </td>

                      {/* In Subtitle */}
                      <td className="py-3.5 px-4 text-center">
                        {book.hasKeywordInSubtitle ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-3.5 h-3.5" /> {t.yes}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                            <XCircle className="w-3.5 h-3.5" /> {t.no}
                          </span>
                        )}
                      </td>

                      {/* Action: Send ASIN to Ads */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleSendAsin(book.asin, book.title)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 mx-auto ${
                            sentAsin === book.asin
                              ? 'bg-emerald-600 text-white'
                              : 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600 hover:text-white'
                          }`}
                          title="Target this competitor book in your Amazon Advertising campaign"
                        >
                          <Target className="w-3.5 h-3.5" />
                          <span>{sentAsin === book.asin ? t.targetSent : t.targetInAds}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {competitors.map((book) => (
            <div
              key={book.id}
              className="glass-panel rounded-2xl border border-slate-800 p-5 flex flex-col justify-between hover:border-indigo-500/40 transition-all shadow-xl group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-14 h-20 rounded-lg bg-gradient-to-br from-indigo-800 via-indigo-950 to-slate-900 border border-indigo-500/30 flex items-center justify-center text-center p-1.5 shadow-md group-hover:scale-105 transition-transform">
                    <BookOpen className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-indigo-300 border border-slate-700">
                      {book.publisherType}
                    </span>
                    <h4 className="font-extrabold text-white text-sm line-clamp-2 mt-1">{book.title}</h4>
                    <p className="text-xs text-slate-400">by {book.author}</p>
                  </div>
                </div>

                {book.subtitle && (
                  <p className="text-xs text-slate-400 italic line-clamp-2 mb-3 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    "{book.subtitle}"
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Amazon ABSR</span>
                    <span className="font-bold text-amber-300">#{formatNumber(book.absr)}</span>
                  </div>
                  <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Est. Monthly Rev</span>
                    <span className="font-bold text-emerald-400">{formatCurrency(book.estMonthlyRevenue)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
                  <span>Price: <strong className="text-white">${book.price}</strong></span>
                  <span>Daily: <strong className="text-white">{book.estDailySales} units</strong></span>
                  <span className="text-amber-400 font-semibold">★ {book.rating}</span>
                </div>

                {book.tacticalInsight && (
                  <div className="text-[11px] text-indigo-300 bg-indigo-950/30 border border-indigo-500/20 p-2.5 rounded-xl">
                    <strong>Tactical Vulnerability:</strong> {book.tacticalInsight}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">ASIN: {book.asin}</span>
                <button
                  onClick={() => handleSendAsin(book.asin, book.title)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Target in Ads</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
