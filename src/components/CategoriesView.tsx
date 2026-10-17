import React, { useState } from 'react';
import { 
  FolderTree, 
  Search, 
  Sparkles, 
  Copy, 
  Check, 
  Award, 
  Flame, 
  TrendingUp, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info,
  Languages,
} from 'lucide-react';
import { AmazonCategory } from '../types';
import { formatCurrency, formatNumber } from '../utils/amazonCalculators';
import { Language, translations } from '../i18n/translations';
import { translateText } from '../services/translator';

interface CategoriesViewProps {
  categories: AmazonCategory[];
  isLoading: boolean;
  onSearch: (query: string, storeType: string) => void;
  currentQuery: string;
  lang: Language;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  isLoading,
  onSearch,
  currentQuery,
  lang,
}) => {
  const t = translations[lang];
  const [searchInput, setSearchInput] = useState(currentQuery || 'dark romance');
  const [storeType, setStoreType] = useState<'Kindle Store' | 'Books (Print)' | 'Audible Audiobooks'>('Kindle Store');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showKdpGuide, setShowKdpGuide] = useState(false);
  const [isTranslatingSearch, setIsTranslatingSearch] = useState(false);

  const handleTranslateSearch = async () => {
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim(), storeType);
    }
  };

  const handleCopyBreadcrumb = (cat: AmazonCategory) => {
    navigator.clipboard.writeText(cat.fullBreadcrumb);
    setCopiedId(cat.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to colorize sales required for #1
  const getSalesNumberOneBadge = (sales: number) => {
    if (sales <= 15) {
      return {
        badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        label: t.easyTargetSub,
        color: 'text-emerald-400',
      };
    }
    if (sales <= 50) {
      return {
        badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        label: t.mediumEffortSub,
        color: 'text-amber-400',
      };
    }
    return {
      badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      label: t.majorNicheSub,
      color: 'text-rose-400',
    };
  };

  return (
    <div className="space-y-6">
      
      {/* Search Header */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-slate-900/80 shadow-xl">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t.catSearchPlaceholder}
                className="w-full pl-12 rtl:pl-28 rtl:pr-12 pr-28 py-3.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans"
              />
              <button
                type="button"
                onClick={handleTranslateSearch}
                disabled={isTranslatingSearch || !searchInput.trim()}
                className="absolute right-3 rtl:right-auto rtl:left-3 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition-all disabled:opacity-40 cursor-pointer shadow-sm"
                title="ترجمة مصطلح البحث"
              >
                {isTranslatingSearch ? (
                  <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Languages className="w-3.5 h-3.5 text-indigo-400" />
                )}
                <span>{lang === 'ar' ? 'ترجمة' : 'Translate'}</span>
              </button>
            </div>

            {/* Store Type Dropdown */}
            <select
              value={storeType}
              onChange={(e) => setStoreType(e.target.value as any)}
              className="px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="Kindle Store">{t.kindleStoreOption}</option>
              <option value="Books (Print)">{t.booksPrintOption}</option>
              <option value="Audible Audiobooks">{t.audibleAudiobooksOption}</option>
            </select>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 rtl:space-x-reverse px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.scanningCategories}</span>
                </>
              ) : (
                <>
                  <FolderTree className="w-4 h-4" />
                  <span>{t.findCategories}</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400">
              {t.catIntroHint}
            </span>
            <button
              type="button"
              onClick={() => setShowKdpGuide(!showKdpGuide)}
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {t.howToAddKdp}
            </button>
          </div>
        </form>
      </div>

      {/* Guide Banner (Collapsible) */}
      {showKdpGuide && (
        <div className="glass-panel rounded-2xl p-5 border border-indigo-500/30 bg-indigo-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {t.kdpGuideTitle}
            </h4>
            <button
              onClick={() => setShowKdpGuide(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              {t.closeGuide}
            </button>
          </div>
          <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <li>{t.step1}</li>
            <li>{t.step2}</li>
            <li>{t.step3}</li>
            <li>{t.step4}</li>
            <li>{t.step5}</li>
          </ol>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-bold text-white">
            {categories.length} {t.matchedCategories} ({storeType})
          </span>
          <span className="text-xs text-slate-400">
            {t.fastestPathSub}
          </span>
        </div>
      </div>

      {/* Category Cards List */}
      <div className="space-y-3.5">
        {categories.map((cat, idx) => {
          const badge = getSalesNumberOneBadge(cat.salesForNumberOne);
          const isCopied = copiedId === cat.id;

          return (
            <div
              key={cat.id}
              className="glass-panel rounded-2xl border border-slate-800 p-5 hover:border-indigo-500/40 transition-all shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Category Breadcrumbs & Details */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                    {cat.store}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.badge}`}>
                    {badge.label}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    {cat.growthRate}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white">{cat.name}</h3>

                {/* Full Amazon Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800/80 font-mono overflow-x-auto">
                  <span className="text-indigo-400 font-bold flex-shrink-0">{t.catPathLabel}</span>
                  <span className="truncate">{cat.fullBreadcrumb}</span>
                  <button
                    onClick={() => handleCopyBreadcrumb(cat)}
                    className="ml-auto rtl:ml-0 rtl:mr-auto text-slate-400 hover:text-white flex items-center gap-1 flex-shrink-0 px-2 py-0.5 rounded bg-slate-800 text-[10px]"
                    title="Copy full category path"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">{t.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>{t.copyPath}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Target Sales Badges */}
              <div className="flex items-center gap-4 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                {/* Sales for #1 */}
                <div className="bg-slate-950/90 border border-slate-800 px-4 py-3 rounded-xl text-center min-w-[130px]">
                  <div className="flex items-center justify-center gap-1 text-[11px] text-amber-400 font-bold mb-0.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>{t.salesForNumberOne}</span>
                  </div>
                  <div className={`text-xl font-black ${badge.color}`}>
                    {cat.salesForNumberOne} <span className="text-xs font-semibold text-slate-400">/day</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{t.toGetOrangeBadge}</span>
                </div>

                {/* Sales for Top 10 */}
                <div className="bg-slate-950/90 border border-slate-800 px-4 py-3 rounded-xl text-center min-w-[120px]">
                  <span className="text-[11px] text-slate-400 font-bold block mb-0.5">{t.top10Cutoff}</span>
                  <div className="text-xl font-black text-white">
                    {cat.salesForTopTen} <span className="text-xs font-semibold text-slate-400">/day</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{t.page1Visibility}</span>
                </div>

                {/* Monthly Pool */}
                <div className="hidden sm:block bg-slate-950/90 border border-slate-800 px-4 py-3 rounded-xl text-center min-w-[130px]">
                  <span className="text-[11px] text-slate-400 font-bold block mb-0.5">{t.monthlyCap}</span>
                  <div className="text-base font-black text-emerald-400">
                    {formatCurrency(cat.estimatedMonthlyCap)}
                  </div>
                  <span className="text-[10px] text-slate-500">{t.categoryRoyalties}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
