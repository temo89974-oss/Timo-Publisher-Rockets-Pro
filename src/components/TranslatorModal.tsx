import React, { useState } from 'react';
import { 
  Languages, 
  X, 
  ArrowRightLeft, 
  Sparkles, 
  Copy, 
  Check, 
  Search,
  ExternalLink,
  BookOpen,
  Globe2,
  Cpu
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { translateText, TranslationEngine } from '../services/translator';

interface TranslatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onApplyKeywordToSearch: (term: string) => void;
}

const PUBLISHING_QUICK_PRESETS = [
  { en: 'dark mafia romance enemies to lovers', ar: 'روايات رومانسية مظلمة مافيا من أعداء إلى عشاق' },
  { en: '5 minute morning habits for productivity and focus', ar: 'عادات صباحية في 5 دقائق لمضاعفة الإنتاجية والتركيز' },
  { en: 'psychological thriller mystery with shocking plot twist', ar: 'إثارة وتشويق نفسي مع حبكة ونهاية مفاجئة' },
  { en: 'toddler coloring book cute animals ages 2-4', ar: 'كتاب تلوين للأطفال حيوانات لطيفة من عمر 2-4 سنوات' },
  { en: 'financial freedom real estate investing passive income', ar: 'الحرية المالية والاستثمار العقاري لتوليد دخل سلبي' },
];

export const TranslatorModal: React.FC<TranslatorModalProps> = ({
  isOpen,
  onClose,
  lang,
  onApplyKeywordToSearch,
}) => {
  const [inputText, setInputText] = useState('dark mafia romance enemies to lovers');
  const [targetLang, setTargetLang] = useState<'ar' | 'en'>(lang === 'ar' ? 'ar' : 'en');
  const [engine, setEngine] = useState<TranslationEngine>('google');
  const [translatedResult, setTranslatedResult] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const t = translations[lang];

  if (!isOpen) return null;

  const handleTranslate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    setIsTranslating(true);
    try {
      const result = await translateText(inputText.trim(), targetLang, engine);
      setTranslatedResult(result);
    } catch (err) {
      console.error('Translation error:', err);
      setTranslatedResult(inputText);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLangs = () => {
    setTargetLang(prev => (prev === 'ar' ? 'en' : 'ar'));
    if (translatedResult) {
      setInputText(translatedResult);
      setTranslatedResult('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyToSearch = () => {
    onApplyKeywordToSearch(translatedResult || inputText);
    onClose();
  };

  const handleOpenGoogleTranslateWeb = () => {
    const sl = targetLang === 'ar' ? 'en' : 'ar';
    const tl = targetLang;
    const url = `https://translate.google.com/?sl=${sl}&tl=${tl}&text=${encodeURIComponent(
      inputText
    )}&op=translate`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-600/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Languages className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <h3 className="text-base font-bold text-white">
                  {lang === 'ar' ? 'مترجم جوجل والذكاء الاصطناعي للنشر (EN ⟷ AR)' : 'Google & AI Publishing Translator (EN ⟷ AR)'}
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {lang === 'ar' ? 'دقيق ومتخصص' : 'Publishing Precision'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'ar' 
                  ? 'ترجمة فورية لعناوين الكتب، والكلمات المفتاحية الخلفية (7 Slots)، والتيمات الأدبية بدقة بالغة.'
                  : 'High-accuracy translation for book titles, Amazon KDP 7 backend keywords & tropes.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          
          {/* Engine Selector */}
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setEngine('google')}
              className={`flex items-center justify-center space-x-2 rtl:space-x-reverse py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                engine === 'google'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5 text-blue-300" />
              <span>{lang === 'ar' ? 'محرك ترجمة جوجل (Google Translate)' : 'Google Translate Engine'}</span>
            </button>

            <button
              type="button"
              onClick={() => setEngine('gemini')}
              className={`flex items-center justify-center space-x-2 rtl:space-x-reverse py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                engine === 'gemini'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-300" />
              <span>{lang === 'ar' ? 'الذكاء الاصطناعي الأدبي الفائق (Gemini KDP)' : 'Gemini AI Literary Precision'}</span>
            </button>
          </div>

          {/* Target Language Toggle Bar */}
          <div className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
            <span className="text-xs font-extrabold text-slate-300">
              {targetLang === 'ar' ? '🇺🇸 الإنجليزية ➔ 🇸🇦 العربية الفصحى' : '🇸🇦 العربية ➔ 🇺🇸 English'}
            </span>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button
                type="button"
                onClick={handleSwapLangs}
                className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-indigo-300 font-semibold transition-colors"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>{targetLang === 'ar' ? 'تبديل للإنجليزية' : 'Switch to Arabic'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenGoogleTranslateWeb}
                className="flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                title="Open in Google Translate Web"
              >
                <ExternalLink className="w-3 h-3 text-blue-400" />
                <span className="hidden sm:inline">Google Web</span>
              </button>
            </div>
          </div>

          {/* Quick Publishing Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 block">
              {lang === 'ar' ? 'أمثلة سريعة لنماذج كتب وكلمات مفتاحية شائعة:' : 'Quick KDP Niche & Trope Samples:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PUBLISHING_QUICK_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputText(targetLang === 'ar' ? p.en : p.ar);
                    setTranslatedResult(targetLang === 'ar' ? p.ar : p.en);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-indigo-500/40 transition-colors"
                >
                  {targetLang === 'ar' ? p.en : p.ar}
                </button>
              ))}
            </div>
          </div>

          {/* Input text */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>
                {targetLang === 'ar' 
                  ? 'النص أو الكلمة المفتاحية بالإنجليزية:' 
                  : 'النص أو العنوان باللغة العربية للترجمة لإنجليزية أمازون:'}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {inputText.length} {lang === 'ar' ? 'حرف' : 'chars'}
              </span>
            </label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.translateInputPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
              dir={targetLang === 'ar' ? 'ltr' : 'rtl'}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              type="button"
              onClick={() => handleTranslate()}
              disabled={isTranslating || !inputText.trim()}
              className="flex-1 flex items-center justify-center space-x-2 rtl:space-x-reverse py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all"
            >
              {isTranslating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.translating}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>
                    {engine === 'google' 
                      ? (lang === 'ar' ? 'الترجمة عبر محرك جوجل' : 'Translate with Google') 
                      : (lang === 'ar' ? 'ترجمة بالذكاء الاصطناعي الأدبي' : 'Translate with Gemini AI')}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Output text */}
          {translatedResult && (
            <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-2 mt-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-300">
                  {t.translationResult}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {engine === 'google' ? 'Google Translate' : 'Gemini KDP Neural'}
                </span>
              </div>
              
              <div 
                className="p-3 bg-slate-900/80 rounded-lg text-sm font-bold text-white leading-relaxed select-all border border-slate-800/80"
                dir={targetLang === 'ar' ? 'rtl' : 'ltr'}
              >
                {translatedResult}
              </div>
              
              <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ النص' : 'Copy')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleApplyToSearch}
                  className="flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-bold transition-all shadow-md shadow-emerald-600/20"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'بحث بهذا المصطلح على أمازون' : 'Search this on Amazon KDP'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
