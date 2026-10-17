import React from 'react';
import { 
  Rocket, 
  Download, 
  Settings, 
  Eye, 
  Sparkles, 
  FolderKanban, 
  Languages 
} from 'lucide-react';
import { WhiteLabelConfig } from '../types';
import { Language, translations } from '../i18n/translations';

interface HeaderProps {
  whiteLabel: WhiteLabelConfig;
  lang: Language;
  onToggleLang: () => void;
  onOpenTranslator: () => void;
  onOpenWhiteLabel: () => void;
  onOpenReport: () => void;
  onOpenProjects: () => void;
  onTogglePresentationMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  whiteLabel,
  lang,
  onToggleLang,
  onOpenTranslator,
  onOpenWhiteLabel,
  onOpenReport,
  onOpenProjects,
  onTogglePresentationMode,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand & Agency Logo */}
        <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
          {whiteLabel.agencyLogoUrl ? (
            <img
              src={whiteLabel.agencyLogoUrl}
              alt={whiteLabel.agencyName}
              className="h-10 w-auto rounded-lg object-contain bg-white/5 p-1 border border-white/10"
            />
          ) : (
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Rocket className="w-6 h-6 text-indigo-400 animate-pulse" />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>{whiteLabel.agencyName || t.appTitle}</span>
                {!whiteLabel.isPresentationMode && (
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 px-2 py-0.5 rounded-full">
                    {t.freeBadge}
                  </span>
                )}
              </h1>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-md hidden sm:block">
              {whiteLabel.tagline || t.appTagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 rtl:space-x-reverse">
          {/* Active AI Status */}
          <div className="hidden lg:flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-medium">{t.geminiActive}</span>
          </div>

          {/* Bilingual Translator Quick Tool */}
          <button
            onClick={onOpenTranslator}
            className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-2 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all"
            title="Open High-Precision Publishing Translator (EN ⟷ AR)"
          >
            <Languages className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">{t.translatorTool}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-2 rounded-lg bg-slate-900 text-slate-200 border border-slate-700 hover:bg-slate-800 hover:text-white text-xs font-black transition-all shadow-sm"
            title="Switch Language / تبديل اللغة"
          >
            <span className="text-amber-400 font-bold">{lang === 'en' ? '🇸🇦' : '🇺🇸'}</span>
            <span>{t.switchLang}</span>
          </button>

          {/* Presentation Mode Toggle */}
          <button
            onClick={onTogglePresentationMode}
            title={whiteLabel.isPresentationMode ? 'Exit Presentation Mode' : 'Enter Client Presentation Mode'}
            className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
              whiteLabel.isPresentationMode
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {whiteLabel.isPresentationMode ? t.clientModeActive : t.clientMode}
            </span>
          </button>

          {/* Projects Button */}
          <button
            onClick={onOpenProjects}
            className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white text-xs font-semibold transition-all"
          >
            <FolderKanban className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{t.savedNiches}</span>
          </button>

          {/* White-Label Settings */}
          <button
            onClick={onOpenWhiteLabel}
            className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white text-xs font-semibold transition-all"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{t.branding}</span>
          </button>

          {/* Export Report Button */}
          <button
            onClick={onOpenReport}
            className="flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.clientPdfDossier}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
