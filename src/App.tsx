import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { KeywordsView } from './components/KeywordsView';
import { CompetitionView } from './components/CompetitionView';
import { CategoriesView } from './components/CategoriesView';
import { AmazonAdsView } from './components/AmazonAdsView';
import { TitleOptimizerView } from './components/TitleOptimizerView';
import { CalculatorView } from './components/CalculatorView';
import { WhiteLabelSettingsModal } from './components/WhiteLabelSettingsModal';
import { ReportModal } from './components/ReportModal';
import { ProjectManager } from './components/ProjectManager';
import { TranslatorModal } from './components/TranslatorModal';
import { 
  TabType, 
  KeywordItem, 
  CompetitorBook, 
  AmazonCategory, 
  AmazonAdTarget, 
  TitleIdea, 
  WhiteLabelConfig, 
  SavedProject,
  AmazonMarketplace,
  BookFormat
} from './types';
import { NICHE_PRESETS } from './data/mockKdpDatabase';
import { 
  fetchKeywords, 
  fetchCompetition, 
  fetchCategories, 
  fetchAmazonAds, 
  fetchTitleIdeas 
} from './services/api';
import { Sparkles } from 'lucide-react';
import { Language, translations } from './i18n/translations';

const DEFAULT_WHITE_LABEL: WhiteLabelConfig = {
  agencyName: 'PublisherRocket Pro',
  agencyLogoUrl: '',
  tagline: 'Amazon KDP Market Intelligence & Category Blueprint',
  accentColor: '#4f46e5',
  contactEmail: 'author@kdpintelligence.com',
  websiteUrl: 'https://publisherrocket.pro',
  reportFooterNote: 'Prepared with PublisherRocket Pro - 100% Confidential Amazon KDP Intelligence Dossier.',
  clientName: 'Private Author / Publisher',
  isPresentationMode: false,
  watermarkEnabled: false,
};

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      return (localStorage.getItem('pr_lang') as Language) || 'ar';
    } catch {
      return 'ar';
    }
  });

  const [activeTab, setActiveTab] = useState<TabType>('keywords');
  const [currentQuery, setCurrentQuery] = useState('dark mafia romance');
  
  // Data States
  const [keywords, setKeywords] = useState<KeywordItem[]>(NICHE_PRESETS[0].keywords);
  const [competitors, setCompetitors] = useState<CompetitorBook[]>(NICHE_PRESETS[0].competitors);
  const [categories, setCategories] = useState<AmazonCategory[]>(NICHE_PRESETS[0].categories);
  const [adTargets, setAdTargets] = useState<AmazonAdTarget[]>(NICHE_PRESETS[0].ads);
  const [titleIdeas, setTitleIdeas] = useState<TitleIdea[]>(NICHE_PRESETS[0].titleIdeas);

  // Loading States
  const [isKeywordsLoading, setIsKeywordsLoading] = useState(false);
  const [isCompetitionLoading, setIsCompetitionLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [isAdsLoading, setIsAdsLoading] = useState(false);
  const [isTitlesLoading, setIsTitlesLoading] = useState(false);

  // White-Label Config (persisted to LocalStorage)
  const [whiteLabel, setWhiteLabel] = useState<WhiteLabelConfig>(() => {
    try {
      const saved = localStorage.getItem('pr_white_label_config');
      return saved ? JSON.parse(saved) : DEFAULT_WHITE_LABEL;
    } catch {
      return DEFAULT_WHITE_LABEL;
    }
  });

  // Saved Projects (persisted to LocalStorage)
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(() => {
    try {
      const saved = localStorage.getItem('pr_saved_projects');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals
  const [isWhiteLabelModalOpen, setIsWhiteLabelModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Set RTL / LTR document direction automatically when lang changes
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('pr_lang', lang);
    } catch (e) {
      console.error(e);
    }
  }, [lang]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const t = translations[lang];

  // Save white-label to LocalStorage whenever updated
  const handleSaveWhiteLabel = (updated: WhiteLabelConfig) => {
    setWhiteLabel(updated);
    try {
      localStorage.setItem('pr_white_label_config', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showToast(lang === 'ar' ? 'تم تحديث هوية الوايت ليبل بنجاح!' : 'White-Label branding updated successfully!');
  };

  const handleTogglePresentationMode = () => {
    setWhiteLabel((prev) => {
      const next = { ...prev, isPresentationMode: !prev.isPresentationMode };
      try {
        localStorage.setItem('pr_white_label_config', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Keyword Research Handler
  const handleSearchKeywords = async (
    query: string, 
    marketplace: AmazonMarketplace = 'US', 
    format: BookFormat = 'all'
  ) => {
    setCurrentQuery(query);
    setIsKeywordsLoading(true);
    try {
      const data = await fetchKeywords(query, marketplace, format);
      setKeywords(data);
      showToast(
        lang === 'ar'
          ? `تم العثور على ${data.length} فرصة كلمات مفتاحية لمجال "${query}"`
          : `Found ${data.length} high-opportunity keywords for "${query}"`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsKeywordsLoading(false);
    }
  };

  // Competition Research Handler
  const handleSearchCompetition = async (
    query: string, 
    marketplace: AmazonMarketplace = 'US'
  ) => {
    setCurrentQuery(query);
    setIsCompetitionLoading(true);
    try {
      const data = await fetchCompetition(query, marketplace);
      setCompetitors(data);
      showToast(
        lang === 'ar'
          ? `تم فحص وتحليل ${data.length} كتب منافسة لمجال "${query}"`
          : `Analyzed ${data.length} competitor books for "${query}"`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsCompetitionLoading(false);
    }
  };

  // Category Research Handler
  const handleSearchCategories = async (
    query: string, 
    storeType: string = 'Kindle Store'
  ) => {
    setCurrentQuery(query);
    setIsCategoriesLoading(true);
    try {
      const data = await fetchCategories(query, storeType);
      setCategories(data);
      showToast(
        lang === 'ar'
          ? `تم مطابقة ${data.length} تصنيف في أمازون لمجال "${query}"`
          : `Mapped ${data.length} Amazon categories for "${query}"`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  // Amazon Ads Generation Handler
  const handleGenerateAds = async (query: string, authorOrBook: string) => {
    setCurrentQuery(query);
    setIsAdsLoading(true);
    try {
      const data = await fetchAmazonAds(query, authorOrBook);
      setAdTargets(data);
      showToast(
        lang === 'ar'
          ? `تم توليد ${data.length} استهداف لإعلانات أمازون بنجاح!`
          : `Generated ${data.length} targeted Amazon Ads targets!`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdsLoading(false);
    }
  };

  // Title Optimization Handler
  const handleGenerateTitles = async (genre: string, coreHook: string, targetAudience: string) => {
    setIsTitlesLoading(true);
    try {
      const data = await fetchTitleIdeas(genre, coreHook, targetAudience);
      setTitleIdeas(data);
      showToast(
        lang === 'ar'
          ? `تمت صياغة ${data.length} أفكار عناوين جذابة وفق خوارزميات أمازون!`
          : `Engineered ${data.length} high-converting book titles!`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsTitlesLoading(false);
    }
  };

  // Toggle 7 Backend Slots
  const handleToggleBackendSlot = (id: string) => {
    setKeywords((prev) => {
      const currentSelectedCount = prev.filter((k) => k.isSelectedBackend).length;
      return prev.map((k) => {
        if (k.id === id) {
          if (!k.isSelectedBackend && currentSelectedCount >= 7) {
            showToast(
              lang === 'ar'
                ? 'لديك بالفعل 7 خانات KDP مكتملة! ألغِ تحديد كلمة أولاً.'
                : 'You already have all 7 KDP slots filled! Remove one first.'
            );
            return k;
          }
          return { ...k, isSelectedBackend: !k.isSelectedBackend };
        }
        return k;
      });
    });
  };

  const handleAutoSelectTop7 = () => {
    const sorted = [...keywords].sort((a, b) => b.opportunityScore - a.opportunityScore);
    const top7Ids = new Set(sorted.slice(0, 7).map((k) => k.id));
    setKeywords((prev) =>
      prev.map((k) => ({
        ...k,
        isSelectedBackend: top7Ids.has(k.id),
      }))
    );
    showToast(
      lang === 'ar'
        ? 'تم التحديد التلقائي لأفضل 7 كلمات مفتاحية ذات أعلى فرصة!'
        : 'Auto-selected the top 7 highest opportunity keywords!'
    );
  };

  const handleClearBackendSlots = () => {
    setKeywords((prev) =>
      prev.map((k) => ({
        ...k,
        isSelectedBackend: false,
      }))
    );
  };

  // Send ASIN from Competitor tab straight to Amazon Ads target list
  const handleSendAsinToAds = (asin: string, title: string) => {
    const newTarget: AmazonAdTarget = {
      id: `ad-target-${Date.now()}`,
      targetType: 'Product/ASIN',
      targetValue: asin,
      matchType: 'Exact',
      suggestedBid: 0.42,
      estImpressions: '25,000 / mo',
      relevanceScore: 98,
      sourceBook: title,
    };
    setAdTargets((prev) => [newTarget, ...prev.filter((t) => t.targetValue !== asin)]);
    showToast(
      lang === 'ar'
        ? `تمت إضافة رقم ASIN (${asin}) إلى قائمة استهدافات إعلانات أمازون!`
        : `ASIN ${asin} added to Amazon Ads targets!`
    );
  };

  // Project Management Handlers
  const handleSaveCurrentProject = (name: string) => {
    const newProj: SavedProject = {
      id: `proj-${Date.now()}`,
      name,
      targetAudience: 'General Readers',
      niche: currentQuery,
      marketplace: 'US',
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString(),
      keywords,
      competitors,
      categories,
      adTargets,
      titleIdeas,
      notes: '',
    };
    const updated = [newProj, ...savedProjects];
    setSavedProjects(updated);
    try {
      localStorage.setItem('pr_saved_projects', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoadProject = (project: SavedProject) => {
    setCurrentQuery(project.niche);
    setKeywords(project.keywords);
    setCompetitors(project.competitors);
    setCategories(project.categories);
    setAdTargets(project.adTargets);
    if (project.titleIdeas) setTitleIdeas(project.titleIdeas);
    showToast(
      lang === 'ar'
        ? `تم تحميل مشروع: "${project.name}"`
        : `Loaded campaign "${project.name}"`
    );
  };

  const handleDeleteProject = (projectId: string) => {
    const updated = savedProjects.filter((p) => p.id !== projectId);
    setSavedProjects(updated);
    try {
      localStorage.setItem('pr_saved_projects', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showToast(lang === 'ar' ? 'تم حذف المشروع.' : 'Project deleted.');
  };

  const selectedBackendCount = keywords.filter((k) => k.isSelectedBackend).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-600 selection:text-white font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 bg-slate-900 border border-indigo-500/50 text-white px-4 py-3 rounded-xl shadow-2xl shadow-indigo-950/80 flex items-center space-x-2 rtl:space-x-reverse text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        whiteLabel={whiteLabel}
        lang={lang}
        onToggleLang={() => setLang((l) => (l === 'en' ? 'ar' : 'en'))}
        onOpenTranslator={() => setIsTranslatorOpen(true)}
        onOpenWhiteLabel={() => setIsWhiteLabelModalOpen(true)}
        onOpenReport={() => setIsReportModalOpen(true)}
        onOpenProjects={() => setIsProjectsModalOpen(true)}
        onTogglePresentationMode={handleTogglePresentationMode}
      />

      {/* Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'white-label') {
            setIsWhiteLabelModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        selectedBackendCount={selectedBackendCount}
        lang={lang}
      />

      {/* Client Mode Active Notice */}
      {whiteLabel.isPresentationMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-4 text-center text-xs text-amber-300 font-semibold flex items-center justify-center gap-2">
          <span>
            {lang === 'ar' ? (
              <>وضع العرض للعميل نشط — جميع نتائج البحث والتقارير تظهر حصرياً تحت اسم وكالتك <strong>{whiteLabel.agencyName}</strong></>
            ) : (
              <>Client Presentation Mode Active — All research is branded exclusively under <strong>{whiteLabel.agencyName}</strong></>
            )}
          </span>
          <button
            onClick={handleTogglePresentationMode}
            className="underline hover:text-white ml-2 rtl:mr-2 rtl:ml-0 text-[11px] cursor-pointer"
          >
            {lang === 'ar' ? 'الخروج من الوضع' : 'Exit Mode'}
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === 'keywords' && (
          <KeywordsView
            keywords={keywords}
            isLoading={isKeywordsLoading}
            onSearch={handleSearchKeywords}
            onToggleBackendSlot={handleToggleBackendSlot}
            onAutoSelectTop7={handleAutoSelectTop7}
            onClearBackendSlots={handleClearBackendSlots}
            currentQuery={currentQuery}
            lang={lang}
          />
        )}

        {activeTab === 'competition' && (
          <CompetitionView
            competitors={competitors}
            isLoading={isCompetitionLoading}
            onSearch={handleSearchCompetition}
            onSendAsinToAds={handleSendAsinToAds}
            currentQuery={currentQuery}
            lang={lang}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesView
            categories={categories}
            isLoading={isCategoriesLoading}
            onSearch={handleSearchCategories}
            currentQuery={currentQuery}
            lang={lang}
          />
        )}

        {activeTab === 'amazon-ads' && (
          <AmazonAdsView
            adTargets={adTargets}
            isLoading={isAdsLoading}
            onGenerateAds={handleGenerateAds}
            currentQuery={currentQuery}
            lang={lang}
          />
        )}

        {activeTab === 'title-generator' && (
          <TitleOptimizerView
            titleIdeas={titleIdeas}
            isLoading={isTitlesLoading}
            onGenerateTitles={handleGenerateTitles}
            lang={lang}
          />
        )}

        {activeTab === 'calculator' && <CalculatorView lang={lang} />}
      </main>

      {/* App Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium text-slate-400">
            {whiteLabel.agencyName} • {whiteLabel.tagline}
          </p>
          <p className="text-[11px] text-slate-600">
            {whiteLabel.reportFooterNote}
          </p>
        </div>
      </footer>

      {/* Modals */}
      <WhiteLabelSettingsModal
        isOpen={isWhiteLabelModalOpen}
        onClose={() => setIsWhiteLabelModalOpen(false)}
        config={whiteLabel}
        onSave={handleSaveWhiteLabel}
        lang={lang}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        whiteLabel={whiteLabel}
        nicheQuery={currentQuery}
        keywords={keywords}
        competitors={competitors}
        categories={categories}
        adTargets={adTargets}
        titleIdeas={titleIdeas}
        lang={lang}
      />

      <ProjectManager
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        savedProjects={savedProjects}
        currentQuery={currentQuery}
        currentKeywords={keywords}
        currentCompetitors={competitors}
        currentCategories={categories}
        currentAds={adTargets}
        currentTitles={titleIdeas}
        onLoadProject={handleLoadProject}
        onSaveCurrentProject={handleSaveCurrentProject}
        onDeleteProject={handleDeleteProject}
        lang={lang}
      />

      <TranslatorModal
        isOpen={isTranslatorOpen}
        onClose={() => setIsTranslatorOpen(false)}
        lang={lang}
        onApplyKeywordToSearch={(term) => {
          handleSearchKeywords(term);
        }}
      />

    </div>
  );
}
