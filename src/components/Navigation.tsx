import React from 'react';
import { 
  KeyRound, 
  Users, 
  FolderTree, 
  Megaphone, 
  PenTool, 
  Calculator, 
  Palette,
} from 'lucide-react';
import { TabType } from '../types';
import { Language, translations } from '../i18n/translations';

interface NavigationProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  selectedBackendCount: number;
  lang: Language;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  selectedBackendCount,
  lang,
}) => {
  const t = translations[lang];

  const tabs = [
    {
      id: 'keywords' as TabType,
      label: t.tabKeywords,
      shortLabel: t.tabKeywordsShort,
      icon: KeyRound,
      badge: `${selectedBackendCount}/7 ${t.slotsBadge}`,
      badgeColor: selectedBackendCount === 7 
        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
        : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'competition' as TabType,
      label: t.tabCompetition,
      shortLabel: t.tabCompetitionShort,
      icon: Users,
    },
    {
      id: 'categories' as TabType,
      label: t.tabCategories,
      shortLabel: t.tabCategoriesShort,
      icon: FolderTree,
    },
    {
      id: 'amazon-ads' as TabType,
      label: t.tabAds,
      shortLabel: t.tabAdsShort,
      icon: Megaphone,
    },
    {
      id: 'title-generator' as TabType,
      label: t.tabTitles,
      shortLabel: t.tabTitlesShort,
      icon: PenTool,
    },
    {
      id: 'calculator' as TabType,
      label: t.tabCalculator,
      shortLabel: t.tabCalculatorShort,
      icon: Calculator,
    },
    {
      id: 'white-label' as TabType,
      label: t.tabWhiteLabel,
      shortLabel: t.tabWhiteLabelShort,
      icon: Palette,
    },
  ];

  return (
    <nav className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-18 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 rtl:space-x-reverse overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer select-none ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>
                {tab.badge && (
                  <span
                    className={`ml-1.5 rtl:mr-1.5 rtl:ml-0 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                      isActive ? 'bg-white/20 text-white border-white/30' : tab.badgeColor
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
