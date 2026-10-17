import React, { useState } from 'react';
import { 
  PenTool, 
  Sparkles, 
  Copy, 
  Check, 
  Flame, 
  AlertCircle,
  Tag,
} from 'lucide-react';
import { TitleIdea } from '../types';
import { Language, translations } from '../i18n/translations';

interface TitleOptimizerViewProps {
  titleIdeas: TitleIdea[];
  isLoading: boolean;
  onGenerateTitles: (genre: string, coreHook: string, targetAudience: string) => void;
  lang: Language;
}

export const TitleOptimizerView: React.FC<TitleOptimizerViewProps> = ({
  titleIdeas,
  isLoading,
  onGenerateTitles,
  lang,
}) => {
  const t = translations[lang];
  const [genre, setGenre] = useState(lang === 'ar' ? 'روايات رومانسية وإثارة' : 'Dark Mafia Romance');
  const [coreHook, setCoreHook] = useState(
    lang === 'ar' 
      ? 'زواج مصلحة وأعداء يتحولون لعشاق مع بطل ملياردير غامض' 
      : 'Arranged marriage enemies to lovers with possessive billionaire antihero'
  );
  const [targetAudience, setTargetAudience] = useState(
    lang === 'ar' ? 'قراء الروايات الرومانسية المعاصرة' : 'Adult romance and BookTok readers'
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (genre && coreHook) {
      onGenerateTitles(genre, coreHook, targetAudience);
    }
  };

  const handleCopy = (idea: TitleIdea) => {
    const full = `${idea.title}: ${idea.subtitle}`;
    navigator.clipboard.writeText(full);
    setCopiedId(idea.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title Generator Form */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/80 shadow-xl space-y-5">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <PenTool className="w-5 h-5 text-indigo-400" />
            {t.titleOptimizerTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t.titleOptimizerSubtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">{t.labelGenre}</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder={t.genrePlaceholder}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1.5">{t.labelCoreHook}</label>
              <input
                type="text"
                value={coreHook}
                onChange={(e) => setCoreHook(e.target.value)}
                placeholder={t.coreHookPlaceholder}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>{t.amazon200CharRule}</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50 self-end sm:self-auto"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.engineeringTitles}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.generateSeoTitles}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Title Cards */}
      <div className="space-y-4">
        {titleIdeas.map((idea, idx) => {
          const isCopied = copiedId === idea.id;
          const charCount = idea.characterCount || `${idea.title}: ${idea.subtitle}`.length;
          const isSafeLength = charCount <= 190;

          return (
            <div
              key={idea.id}
              className="glass-panel rounded-2xl border border-slate-800 p-5 hover:border-indigo-500/40 transition-all shadow-xl space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 font-bold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>Score: {idea.opportunityScore}/100</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                    isSafeLength ? 'bg-slate-800 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {charCount} / 200 chars
                  </span>

                  <button
                    onClick={() => handleCopy(idea)}
                    className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? t.copiedFullTitle : t.copyFullTitle}</span>
                  </button>
                </div>
              </div>

              {/* Title and Subtitle Showcase */}
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-white tracking-tight">{idea.title}</h3>
                <p className="text-sm text-indigo-300 font-medium">{idea.subtitle}</p>
              </div>

              {/* Hook */}
              {idea.hook && (
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 italic">
                  "{idea.hook}"
                </div>
              )}

              {/* Keywords embedded */}
              <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <Tag className="w-3 h-3 text-indigo-400" />
                  {t.embeddedKeywordsLabel}
                </span>
                {idea.primaryKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-medium"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
