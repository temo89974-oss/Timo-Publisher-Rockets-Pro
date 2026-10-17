import React, { useState } from 'react';
import { 
  Megaphone, 
  Search, 
  Sparkles, 
  Download, 
  Target, 
  Sliders, 
  Copy, 
  Check, 
  Filter, 
  Plus, 
  Trash2,
  DollarSign,
  Layers,
  ArrowUpDown,
  Languages,
} from 'lucide-react';
import { AmazonAdTarget } from '../types';
import { exportAmazonAdsBulkCSV } from '../utils/exportUtils';
import { Language, translations } from '../i18n/translations';
import { translateText } from '../services/translator';

interface AmazonAdsViewProps {
  adTargets: AmazonAdTarget[];
  isLoading: boolean;
  onGenerateAds: (query: string, authorOrBook: string) => void;
  currentQuery: string;
  lang: Language;
}

export const AmazonAdsView: React.FC<AmazonAdsViewProps> = ({
  adTargets,
  isLoading,
  onGenerateAds,
  currentQuery,
  lang,
}) => {
  const t = translations[lang];
  const [searchInput, setSearchInput] = useState(currentQuery || 'dark romance');
  const [authorInput, setAuthorInput] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterMatch, setFilterMatch] = useState<string>('all');
  const [globalBidMultiplier, setGlobalBidMultiplier] = useState<number>(1.0);
  const [copiedAll, setCopiedAll] = useState(false);
  const [campaignName, setCampaignName] = useState('KDP_High_ROI_Targets');
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
      onGenerateAds(searchInput.trim(), authorInput.trim());
    }
  };

  const filteredTargets = adTargets
    .filter((t) => {
      if (filterType !== 'all' && t.targetType !== filterType) return false;
      if (filterMatch !== 'all' && t.matchType !== filterMatch) return false;
      return true;
    })
    .map((t) => ({
      ...t,
      suggestedBid: Number((t.suggestedBid * globalBidMultiplier).toFixed(2)),
    }));

  const handleCopyAll = () => {
    const list = filteredTargets.map((t) => t.targetValue).join('\n');
    navigator.clipboard.writeText(list);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleExportBulkCSV = () => {
    exportAmazonAdsBulkCSV(filteredTargets, campaignName, `${campaignName}_Bulk_Ads.csv`);
  };

  return (
    <div className="space-y-6">
      
      {/* Search Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-slate-900/80 shadow-xl">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative flex items-center">
              <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t.adsSeedPlaceholder}
                className="w-full pl-12 rtl:pl-28 rtl:pr-12 pr-28 py-3.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 font-sans"
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

            <div className="relative">
              <Target className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={authorInput}
                onChange={(e) => setAuthorInput(e.target.value)}
                placeholder={t.adsAuthorPlaceholder}
                className="w-full pl-12 rtl:pl-4 rtl:pr-12 pr-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <span className="text-xs text-slate-400">
              {t.adsIntroHint}
            </span>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50 self-end sm:self-auto"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.harvestingAds}</span>
                </>
              ) : (
                <>
                  <Megaphone className="w-4 h-4" />
                  <span>{t.generateAmazonAds}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Campaign Adjuster & Quick Bid Controls */}
      <div className="glass-panel-subtle rounded-2xl p-5 border border-slate-800 bg-slate-900/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Campaign Name */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <label className="text-xs font-semibold text-slate-400 whitespace-nowrap">{t.campaignNameLabel}</label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-indigo-500 w-48"
          />
        </div>

        {/* Global Bid Adjuster */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <label className="text-xs font-semibold text-slate-400 whitespace-nowrap flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            {t.globalBidScale}
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={globalBidMultiplier}
            onChange={(e) => setGlobalBidMultiplier(parseFloat(e.target.value))}
            className="w-32 accent-indigo-500 cursor-pointer"
          />
          <span className="text-xs font-bold text-indigo-300 w-12">{globalBidMultiplier.toFixed(1)}x</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={handleCopyAll}
            className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? t.copiedAll : t.copyTargetList}</span>
          </button>

          <button
            onClick={handleExportBulkCSV}
            className="flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.downloadBulkAdsCsv}</span>
          </button>
        </div>

      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-xs font-bold text-slate-400">{t.targetTypeLabel}</span>
          {['all', 'Keyword', 'Product/ASIN', 'Author'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterType === type
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {type === 'all' ? t.allTargets : type}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-xs font-bold text-slate-400">{t.matchTypeLabel}</span>
          {['all', 'Exact', 'Phrase', 'Broad'].map((match) => (
            <button
              key={match}
              onClick={() => setFilterMatch(match)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterMatch === match
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {match === 'all' ? t.allMatches : match}
            </button>
          ))}
        </div>
      </div>

      {/* Targets Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">{t.thTargetValue}</th>
                <th className="py-3.5 px-4 text-center">{t.thTargetType}</th>
                <th className="py-3.5 px-4 text-center">{t.thMatchType}</th>
                <th className="py-3.5 px-4 text-right rtl:text-left">{t.thSuggestedBid}</th>
                <th className="py-3.5 px-4 text-right rtl:text-left">{t.thEstImpressions}</th>
                <th className="py-3.5 px-4 text-center">{t.thRelevanceScore}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredTargets.map((ad) => (
                <tr key={ad.id} className="transition-colors hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-slate-200">
                    <div className="flex items-center space-x-2">
                      <span className="select-all">{ad.targetValue}</span>
                      {ad.sourceBook && (
                        <span className="text-[10px] text-slate-400 font-sans italic">
                          ({ad.sourceBook})
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      ad.targetType === 'Product/ASIN'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : ad.targetType === 'Author'
                        ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                        : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                    }`}>
                      {ad.targetType}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]">
                      {ad.matchType}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-emerald-400">
                    ${ad.suggestedBid.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 text-right text-slate-400">
                    {ad.estImpressions}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-extrabold text-[11px]">
                      {ad.relevanceScore}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
