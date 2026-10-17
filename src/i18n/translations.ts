export type Language = 'en' | 'ar';

export interface TranslationDictionary {
  // Brand & Header
  appTitle: string;
  appTagline: string;
  freeBadge: string;
  geminiActive: string;
  clientMode: string;
  clientModeActive: string;
  savedNiches: string;
  branding: string;
  clientPdfDossier: string;
  switchLang: string;
  translatorTool: string;

  // Navigation Tabs
  tabKeywords: string;
  tabKeywordsShort: string;
  tabCompetition: string;
  tabCompetitionShort: string;
  tabCategories: string;
  tabCategoriesShort: string;
  tabAds: string;
  tabAdsShort: string;
  tabTitles: string;
  tabTitlesShort: string;
  tabCalculator: string;
  tabCalculatorShort: string;
  tabWhiteLabel: string;
  tabWhiteLabelShort: string;
  slotsBadge: string;

  // Keywords View
  keywordSearchPlaceholder: string;
  runDeepSearch: string;
  analyzing: string;
  quickPresets: string;
  allFormats: string;
  kindleEbook: string;
  paperback: string;
  audible: string;
  official7SlotsTitle: string;
  official7SlotsSubtitle: string;
  selectedOf7: string;
  autoFillTop7: string;
  clearSlots: string;
  copy7Slots: string;
  copied7Slots: string;
  slotNumber: string;
  emptySlot: string;
  opportunitiesFound: string;
  allClusters: string;
  sortOpportunity: string;
  sortSearches: string;
  sortEarnings: string;
  sortCompetition: string;
  exportKeywordsCsv: string;

  // Keyword Table Headers
  thSlot: string;
  thKeyword: string;
  thAmazonSearches: string;
  thAvgMonthly: string;
  thCompetitors: string;
  thDifficulty: string;
  thOpportunity: string;
  thAction: string;
  diffLowGolden: string;
  diffModerate: string;
  diffFierce: string;

  // Competition View
  compSearchPlaceholder: string;
  analyzeCompetitors: string;
  auditingRivals: string;
  nicheMonthlyRevenue: string;
  nicheRevenueSub: string;
  dailyCopiesSold: string;
  calculatedFromAbsr: string;
  averageListPrice: string;
  pricingBenchmark: string;
  averageAbsrRank: string;
  avgReviewsSub: string;
  rankedCompetitorBooks: string;
  empiricalCurveSub: string;
  exportCompetitorsCsv: string;
  thTitleAuthor: string;
  thAgePages: string;
  thAbsrRank: string;
  thEstDailySales: string;
  thEstMonthlyRev: string;
  thPriceRating: string;
  thInTitle: string;
  thInSubtitle: string;
  thTargetAsin: string;
  tacticalTactic: string;
  targetInAds: string;
  targetSent: string;
  yes: string;
  no: string;

  // Categories View
  catSearchPlaceholder: string;
  kindleStoreOption: string;
  booksPrintOption: string;
  audibleAudiobooksOption: string;
  findCategories: string;
  scanningCategories: string;
  catIntroHint: string;
  howToAddKdp: string;
  kdpGuideTitle: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  step5: string;
  closeGuide: string;
  matchedCategories: string;
  fastestPathSub: string;
  catPathLabel: string;
  copyPath: string;
  copied: string;
  salesForNumberOne: string;
  toGetOrangeBadge: string;
  top10Cutoff: string;
  page1Visibility: string;
  monthlyCap: string;
  categoryRoyalties: string;
  easyTargetSub: string;
  mediumEffortSub: string;
  majorNicheSub: string;

  // Amazon Ads View
  adsSeedPlaceholder: string;
  adsAuthorPlaceholder: string;
  adsIntroHint: string;
  generateAmazonAds: string;
  harvestingAds: string;
  campaignNameLabel: string;
  globalBidScale: string;
  copyTargetList: string;
  copiedAll: string;
  downloadBulkAdsCsv: string;
  targetTypeLabel: string;
  allTargets: string;
  matchTypeLabel: string;
  allMatches: string;
  thTargetValue: string;
  thTargetType: string;
  thMatchType: string;
  thSuggestedBid: string;
  thEstImpressions: string;
  thRelevanceScore: string;

  // Title Optimizer View
  titleOptimizerTitle: string;
  titleOptimizerSubtitle: string;
  labelGenre: string;
  genrePlaceholder: string;
  labelCoreHook: string;
  coreHookPlaceholder: string;
  amazon200CharRule: string;
  generateSeoTitles: string;
  engineeringTitles: string;
  embeddedKeywordsLabel: string;
  copyFullTitle: string;
  copiedFullTitle: string;

  // Calculator View
  calculatorTitle: string;
  calculatorSubtitle: string;
  simulatorParams: string;
  bookFormatLabel: string;
  absrLabel: string;
  listPriceLabel: string;
  eligible70Royalty: string;
  outsideBracket35: string;
  pageCountLabel: string;
  colorInteriorLabel: string;
  projectedVelocity: string;
  estDailySalesBox: string;
  estMonthlySalesBox: string;
  royaltyPerCopyBox: string;
  estMonthlyNetBox: string;
  annualProjectedBox: string;
  perCopyDistribution: string;
  authorProfit: string;
  printingCost: string;
  amazonShare: string;

  // White-Label Studio
  whiteLabelTitle: string;
  whiteLabelSubtitle: string;
  labelAgencyName: string;
  labelClientName: string;
  labelLogoUrl: string;
  labelTagline: string;
  labelEmail: string;
  labelWebsite: string;
  labelFooterNote: string;
  liveHeaderPreview: string;
  resetDefaults: string;
  saveWhiteLabel: string;
  savedExclamation: string;

  // Report Modal
  reportModalTitle: string;
  preparedByLabel: string;
  exportAllCsvs: string;
  downloadPdfReport: string;
  generatingPdf: string;
  coverBlueprintTitle: string;
  targetQueryLabel: string;
  section1Title: string;
  section2Title: string;
  section3Title: string;

  // Project Manager
  savedProjectsTitle: string;
  savedProjectsSubtitle: string;
  saveCurrentSession: string;
  saveProjectBtn: string;
  savedCampaignsLabel: string;
  noProjectsYet: string;
  loadBtn: string;

  // Translator Popup Tool
  translatorTitle: string;
  translatorDesc: string;
  translateInputPlaceholder: string;
  translateBtn: string;
  translating: string;
  translationResult: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appTitle: 'PublisherRocket Pro',
    appTagline: 'Amazon KDP Market Intelligence, ABSR Sales Velocity & Keyword Suite',
    freeBadge: '100% Free White-Label',
    geminiActive: 'Gemini AI Engine Active',
    clientMode: 'Client Mode',
    clientModeActive: 'Client Mode Active',
    savedNiches: 'Saved Niches',
    branding: 'Branding',
    clientPdfDossier: 'Client PDF Dossier',
    switchLang: 'العربية',
    translatorTool: 'Bilingual Translator',

    tabKeywords: 'Keywords & 7 Backend Slots',
    tabKeywordsShort: 'Keywords',
    tabCompetition: 'Competition Analyzer',
    tabCompetitionShort: 'Competition',
    tabCategories: 'Category Finder (#1 Bestseller)',
    tabCategoriesShort: 'Categories',
    tabAds: 'Amazon Ads Target Generator',
    tabAdsShort: 'Amazon Ads',
    tabTitles: 'Title & Subtitle Optimizer',
    tabTitlesShort: 'Title Optimizer',
    tabCalculator: 'KDP Royalties & ABSR Calculator',
    tabCalculatorShort: 'Calculator',
    tabWhiteLabel: 'White-Label Branding Studio',
    tabWhiteLabelShort: 'White-Label',
    slotsBadge: 'Slots',

    keywordSearchPlaceholder: "Enter book seed keyword, trope, niche or genre (e.g., 'dark mafia romance', 'habit building', 'sci fi opera')...",
    runDeepSearch: 'Run Deep Search',
    analyzing: 'Analyzing...',
    quickPresets: 'Quick Presets:',
    allFormats: 'All Formats',
    kindleEbook: 'Kindle eBook',
    paperback: 'Paperback',
    audible: 'Audible Audiobook',
    official7SlotsTitle: 'Your Official 7 KDP Backend Slots',
    official7SlotsSubtitle: 'Amazon provides exactly 7 backend keyword boxes in your KDP dashboard setup. Check or uncheck keywords to assign slots.',
    selectedOf7: 'of 7 Selected',
    autoFillTop7: 'Auto-Fill Top 7',
    clearSlots: 'Clear',
    copy7Slots: 'Copy 7 Slots to Clipboard',
    copied7Slots: 'Copied All 7!',
    slotNumber: 'Slot #',
    emptySlot: 'Empty Slot',
    opportunitiesFound: 'Keyword Opportunities',
    allClusters: 'All Semantic Clusters',
    sortOpportunity: 'Sort: Highest Opportunity',
    sortSearches: 'Sort: Most Amazon Searches',
    sortEarnings: 'Sort: Highest Average Earnings',
    sortCompetition: 'Sort: Lowest Competition (Easiest)',
    exportKeywordsCsv: 'Export Keywords CSV',

    thSlot: 'Slot',
    thKeyword: 'Keyword Phrase',
    thAmazonSearches: 'Amazon Searches / Mo',
    thAvgMonthly: 'Avg Monthly $',
    thCompetitors: 'Competitors',
    thDifficulty: 'Rocket Difficulty',
    thOpportunity: 'Opportunity',
    thAction: 'Action',
    diffLowGolden: 'Low (Golden)',
    diffModerate: 'Moderate',
    diffFierce: 'Fierce',

    compSearchPlaceholder: 'Enter niche keyword, book topic, or competitor ASIN/ISBN to analyze top 10 books...',
    analyzeCompetitors: 'Analyze Competitors',
    auditingRivals: 'Auditing Rivals...',
    nicheMonthlyRevenue: 'Niche Monthly Revenue',
    nicheRevenueSub: 'Top ranking books pooled',
    dailyCopiesSold: 'Daily Copies Sold',
    calculatedFromAbsr: 'Calculated from Amazon ABSR',
    averageListPrice: 'Average List Price',
    pricingBenchmark: 'Optimal pricing benchmark',
    averageAbsrRank: 'Average ABSR Rank',
    avgReviewsSub: 'Avg reviews per book',
    rankedCompetitorBooks: 'Ranked Competitor Books',
    empiricalCurveSub: '(Estimated via empirical KDP Sales Velocity Curve)',
    exportCompetitorsCsv: 'Export Competitors CSV',
    thTitleAuthor: 'Book Title & Author',
    thAgePages: 'Age / Pages',
    thAbsrRank: 'ABSR Rank',
    thEstDailySales: 'Est. Daily Sales',
    thEstMonthlyRev: 'Est. Monthly Rev',
    thPriceRating: 'Price / Rating',
    thInTitle: 'Keyword in Title?',
    thInSubtitle: 'Keyword in Subtitle?',
    thTargetAsin: 'Target ASIN',
    tacticalTactic: 'Tactical Vulnerability:',
    targetInAds: 'Target ASIN',
    targetSent: 'Sent!',
    yes: 'YES',
    no: 'NO',

    catSearchPlaceholder: 'Search across 16,000+ Amazon categories by keyword, topic or genre...',
    kindleStoreOption: 'Kindle Store (eBooks)',
    booksPrintOption: 'Books (Paperback & Hardcover)',
    audibleAudiobooksOption: 'Audible Audiobooks',
    findCategories: 'Find Categories',
    scanningCategories: 'Scanning Categories...',
    catIntroHint: 'Target low-sales categories to claim the coveted orange #1 Bestseller banner with minimal advertising.',
    howToAddKdp: 'How to add categories in KDP',
    kdpGuideTitle: 'How to Select Categories in your Amazon KDP Dashboard',
    step1: 'Log in to your KDP Dashboard at kdp.amazon.com.',
    step2: 'Click Edit eBook Details or Edit Paperback Details on your title.',
    step3: 'Navigate down to Categories and click Choose Categories.',
    step4: 'Amazon allows up to 3 official categories per title. Use our exact breadcrumb paths below to locate each sub-genre.',
    step5: "If a specific sub-category isn't in the direct dropdown, submit a quick request via KDP Contact Us > Amazon Product Page > Update Categories.",
    closeGuide: 'Close',
    matchedCategories: 'Matched Categories',
    fastestPathSub: 'Sorted by fastest path to #1 Bestseller status',
    catPathLabel: 'Path:',
    copyPath: 'Copy Path',
    copied: 'Copied!',
    salesForNumberOne: 'Sales for #1',
    toGetOrangeBadge: 'to get orange badge',
    top10Cutoff: 'Top 10 Cutoff',
    page1Visibility: 'page 1 visibility',
    monthlyCap: 'Monthly Cap',
    categoryRoyalties: 'category royalties',
    easyTargetSub: 'Easy #1 Target (<15 sales/day)',
    mediumEffortSub: 'Medium Effort (15-50 sales/day)',
    majorNicheSub: 'Major Niche (>50 sales/day)',

    adsSeedPlaceholder: "Enter seed keyword or book niche (e.g. 'dark mafia romance')...",
    adsAuthorPlaceholder: 'Optional: Competitor author name or book title to reverse-engineer...',
    adsIntroHint: 'Generates high-converting Exact, Phrase, Broad keyword targets + Competitor ASINs for Amazon Sponsored Products.',
    generateAmazonAds: 'Generate Amazon Ads',
    harvestingAds: 'Harvesting Ad Targets...',
    campaignNameLabel: 'Campaign Name:',
    globalBidScale: 'Global Bid Scale:',
    copyTargetList: 'Copy Target List',
    copiedAll: 'Copied All!',
    downloadBulkAdsCsv: 'Download Amazon Ads Bulk File (CSV)',
    targetTypeLabel: 'Target Type:',
    allTargets: 'All Targets',
    matchTypeLabel: 'Match:',
    allMatches: 'All Matches',
    thTargetValue: 'Target Value',
    thTargetType: 'Target Type',
    thMatchType: 'Match Type',
    thSuggestedBid: 'Suggested CPC Bid',
    thEstImpressions: 'Est. Monthly Impressions',
    thRelevanceScore: 'Relevance Score',

    titleOptimizerTitle: 'Amazon SEO Title & Subtitle Optimizer',
    titleOptimizerSubtitle: 'Amazon search algorithms give the heaviest weight to keywords found in your Title and Subtitle. Maximize discoverability and click-through rate without keyword stuffing.',
    labelGenre: 'Book Genre / Category',
    genrePlaceholder: 'e.g. Dark Romance, Sci-Fi Thriller, Personal Finance',
    labelCoreHook: 'Core Hook / Trope / Main Problem',
    coreHookPlaceholder: 'e.g. Arranged marriage enemies to lovers, 5-minute morning habits for focus',
    amazon200CharRule: 'Amazon KDP Rule: Total characters (Title + Subtitle) must remain under 200 characters.',
    generateSeoTitles: 'Generate SEO Titles',
    engineeringTitles: 'Engineering Titles...',
    embeddedKeywordsLabel: 'Target Keywords Embedded:',
    copyFullTitle: 'Copy Full Title',
    copiedFullTitle: 'Copied Full Title!',

    calculatorTitle: 'KDP Royalties & Amazon Best Seller Rank (ABSR) Simulator',
    calculatorSubtitle: 'Simulate how any Amazon Best Seller Rank converts into real daily and monthly book sales, royalties, and Amazon fee splits.',
    simulatorParams: 'Simulator Parameters',
    bookFormatLabel: 'Book Format',
    absrLabel: 'Amazon Best Seller Rank (ABSR)',
    listPriceLabel: 'Retail List Price ($ USD)',
    eligible70Royalty: '✓ Eligible for 70% Amazon Royalty rate',
    outsideBracket35: '⚠ Outside $2.99–$9.99 bracket: Drops to 35% royalty',
    pageCountLabel: 'Book Page Count',
    colorInteriorLabel: 'Color Interior (Higher printing cost)',
    projectedVelocity: 'Projected Sales Velocity & Royalties',
    estDailySalesBox: 'Est. Daily Sales',
    estMonthlySalesBox: 'Est. Monthly Sales',
    royaltyPerCopyBox: 'Royalty Per Copy',
    estMonthlyNetBox: 'Est. Monthly Net',
    annualProjectedBox: 'Annual Projected Passive Royalties',
    perCopyDistribution: 'Per Copy Revenue Distribution',
    authorProfit: 'Author Profit:',
    printingCost: 'Printing Cost:',
    amazonShare: 'Amazon Share:',

    whiteLabelTitle: 'White-Label Branding Studio',
    whiteLabelSubtitle: 'Rebrand this platform and client reports under your agency or company name.',
    labelAgencyName: 'Agency / Brand Name',
    labelClientName: 'Target Client Name',
    labelLogoUrl: 'Agency Logo URL (PNG or SVG)',
    labelTagline: 'Agency Tagline / Subtitle',
    labelEmail: 'Contact Email',
    labelWebsite: 'Website URL',
    labelFooterNote: 'Report Footer Disclaimer Note',
    liveHeaderPreview: 'Live Header Preview in Client PDF:',
    resetDefaults: 'Reset Defaults',
    saveWhiteLabel: 'Save White-Label',
    savedExclamation: 'Saved!',

    reportModalTitle: 'Client Intelligence Dossier & Launch Blueprint',
    preparedByLabel: 'Prepared by',
    exportAllCsvs: 'Export All CSVs',
    downloadPdfReport: 'Download Branded PDF Report',
    generatingPdf: 'Generating PDF...',
    coverBlueprintTitle: 'Strategic KDP Publishing Blueprint',
    targetQueryLabel: 'Target Search Query:',
    section1Title: '1. Designated 7 KDP Backend Slots',
    section2Title: '2. Top Ranking Competitors Breakdown',
    section3Title: '3. Category Blueprint to #1 Bestseller Rank',

    savedProjectsTitle: 'Saved KDP Research Projects',
    savedProjectsSubtitle: 'Save and switch between your book research campaigns.',
    saveCurrentSession: 'Save Current Research Session',
    saveProjectBtn: 'Save Project',
    savedCampaignsLabel: 'Saved Campaigns',
    noProjectsYet: 'No saved research projects yet. Save your current session above!',
    loadBtn: 'Load',

    translatorTitle: 'High-Precision Publishing Translator (EN ⟷ AR)',
    translatorDesc: 'Translate book titles, backend keywords, tropes, and descriptions with literary and publishing accuracy.',
    translateInputPlaceholder: 'Type English or Arabic text to translate...',
    translateBtn: 'Translate with Gemini',
    translating: 'Translating...',
    translationResult: 'Translated Result:',
  },
  ar: {
    appTitle: 'ببليشر روكيت برو (PublisherRocket Pro)',
    appTagline: 'منصة استخبارات أسواق أمازون KDP، وحساب سرعة مبيعات ABSR، وبحث الكلمات المفتاحية',
    freeBadge: 'وايت ليبل مجاني 100%',
    geminiActive: 'محرك Gemini للذكاء الاصطناعي نشط',
    clientMode: 'وضع العميل',
    clientModeActive: 'وضع العرض للعميل نشط',
    savedNiches: 'المشاريع المحفوظة',
    branding: 'العلامة التجارية',
    clientPdfDossier: 'تقرير العميل (PDF)',
    switchLang: 'English',
    translatorTool: 'المترجم الدقيق',

    tabKeywords: 'الكلمات المفتاحية والـ 7 خانات الإلزامية',
    tabKeywordsShort: 'الكلمات المفتاحية',
    tabCompetition: 'محلل المنافسين والمبيعات',
    tabCompetitionShort: 'تحليل المنافسين',
    tabCategories: 'مستكشف التصنيفات (#1 Bestseller)',
    tabCategoriesShort: 'التصنيفات',
    tabAds: 'مولد استهداف إعلانات أمازون (AMS)',
    tabAdsShort: 'إعلانات أمازون',
    tabTitles: 'مُحسّن العناوين والعناوين الفرعية',
    tabTitlesShort: 'تحسين العناوين',
    tabCalculator: 'حاسبة أرباح KDP ومبيعات ABSR',
    tabCalculatorShort: 'حاسبة الأرباح',
    tabWhiteLabel: 'استوديو الوايت ليبل (العلامة البيضاء)',
    tabWhiteLabelShort: 'الوايت ليبل',
    slotsBadge: 'خانات',

    keywordSearchPlaceholder: "أدخل الكلمة المفتاحية، أو النيش، أو التيمة الأدبية (مثال: 'dark mafia romance', 'بناء العادات والإنتاجية', 'رواية خيال علمي')...",
    runDeepSearch: 'بدء البحث المعمق',
    analyzing: 'جاري التحليل...',
    quickPresets: 'مجالات جاهزة سريعة:',
    allFormats: 'جميع الصيغ',
    kindleEbook: 'كتاب إلكتروني (Kindle)',
    paperback: 'كتاب ورقي (غلاف ورقي)',
    audible: 'كتاب صوتي (Audible)',
    official7SlotsTitle: 'خانات الـ 7 كلمات المفتاحية الخلفية الرسمية لـ KDP',
    official7SlotsSubtitle: 'تمنحك أمازون في إعدادات كتابك 7 خانات فقط للكلمات المفتاحية؛ حدد الكلمات المطلوبة لتعبئة الخانات مباشرة.',
    selectedOf7: 'من 7 محددة',
    autoFillTop7: 'تعبئة أفضل 7 تلقائياً',
    clearSlots: 'مسح الكل',
    copy7Slots: 'نسخ الـ 7 خانات للحافظة',
    copied7Slots: 'تم نسخ الـ 7 كلمات بنجاح!',
    slotNumber: 'الخانة #',
    emptySlot: 'خانة فارغة',
    opportunitiesFound: 'فرصة لكلمات مفتاحية مكتشفة',
    allClusters: 'جميع المجموعات الدلالية',
    sortOpportunity: 'ترتيب: أعلى مؤشر فرصة',
    sortSearches: 'ترتيب: الأكثر بحثاً على أمازون',
    sortEarnings: 'ترتيب: أعلى متوسط أرباح شهرية',
    sortCompetition: 'ترتيب: الأسهل منافسة',
    exportKeywordsCsv: 'تصدير الكلمات المفتاحية (CSV)',

    thSlot: 'الخانة',
    thKeyword: 'العبارة المفتاحية',
    thAmazonSearches: 'بحث المشترين على أمازون / شهرياً',
    thAvgMonthly: 'متوسط الأرباح الشهري $',
    thCompetitors: 'الكتب المنافسة',
    thDifficulty: 'مؤشر صعوبة روكيت',
    thOpportunity: 'مؤشر الفرصة',
    thAction: 'إجراء',
    diffLowGolden: 'منخفضة (فرصة ذهبية)',
    diffModerate: 'متوسطة',
    diffFierce: 'منافسة شرسة',

    compSearchPlaceholder: 'أدخل الكلمة المفتاحية أو رقم ASIN/ISBN للمنافس لتحليل أفضل 10 كتب متصدرة...',
    analyzeCompetitors: 'تحليل المنافسين',
    auditingRivals: 'جاري فحص المنافسين...',
    nicheMonthlyRevenue: 'إجمالي عوائد النيش الشهرية',
    nicheRevenueSub: 'مجموع أرباح الكتب المتصدرة',
    dailyCopiesSold: 'النسخ المباعة يومياً',
    calculatedFromAbsr: 'محسوبة بدقة من ترتيب ABSR بأمازون',
    averageListPrice: 'متوسط سعر البيع',
    pricingBenchmark: 'المعيار الأمثل للتسعير',
    averageAbsrRank: 'متوسط رتبة المبيعات (ABSR)',
    avgReviewsSub: 'متوسط عدد المراجعات لكل كتاب',
    rankedCompetitorBooks: 'الكتب المنافسة المتصدرة',
    empiricalCurveSub: '(محسوبة وفق منحنى سرعة مبيعات KDP المعياري)',
    exportCompetitorsCsv: 'تصدير تحليل المنافسين (CSV)',
    thTitleAuthor: 'عنوان الكتاب واسم المؤلف',
    thAgePages: 'العمر / الصفحات',
    thAbsrRank: 'رتبة ABSR',
    thEstDailySales: 'المبيعات اليومية التقديرية',
    thEstMonthlyRev: 'العوائد الشهرية التقديرية',
    thPriceRating: 'السعر / التقييم',
    thInTitle: 'الكلمة في العنوان؟',
    thInSubtitle: 'الكلمة في الفرعي؟',
    thTargetAsin: 'استهداف ASIN',
    tacticalTactic: 'الثغرة التكتيكية وكيف تتفوق عليه:',
    targetInAds: 'استهداف ASIN في الإعلانات',
    targetSent: 'تم الإرسال!',
    yes: 'نعم',
    no: 'لا',

    catSearchPlaceholder: 'ابحث في أكثر من 16,000 تصنيف في أمازون عبر الكلمة المفتاحية أو المجال...',
    kindleStoreOption: 'متجر كيندل (Kindle eBooks)',
    booksPrintOption: 'الكتب الورقية (Paperback & Hardcover)',
    audibleAudiobooksOption: 'الكتب الصوتية (Audible)',
    findCategories: 'البحث عن التصنيفات',
    scanningCategories: 'جاري مسح التصنيفات...',
    catIntroHint: 'استهدف التصنيفات منخفضة المنافسة لنيل شارة المركز الأول (#1 Bestseller) البرتقالية بأقل مبيعات.',
    howToAddKdp: 'كيفية إضافة التصنيفات في لوحة KDP',
    kdpGuideTitle: 'دليل اختيار وتثبيت التصنيفات في لوحة تحكم Amazon KDP',
    step1: 'سجل دخولك إلى لوحة KDP عبر الرابط kdp.amazon.com.',
    step2: 'انقر على تعديل تفاصيل الكتاب (Edit eBook Details) أو الكتاب الورقي.',
    step3: 'انزل لأسفل حتى تصل إلى قسم التصنيفات (Categories) وانقر على Choose Categories.',
    step4: 'تسمح أمازون بما يصل إلى 3 تصنيفات رسمية لكل كتاب؛ استخدم المسار الشجري الموضح بالأسفل للوصول للتصنيف الدقيق.',
    step5: 'إذا كان التصنيف الفرعي غير ظاهر في القائمة المباشرة، أرسل رسالة فورية عبر KDP Contact Us > Amazon Product Page > Update Categories متضمنة المسار الشجري ورقم ASIN.',
    closeGuide: 'إغلاق الدليل',
    matchedCategories: 'تصنيف مطابق',
    fastestPathSub: 'مرتبة حسب المسار الأسرع للحصول على شارة #1 Bestseller',
    catPathLabel: 'المسار الشجري:',
    copyPath: 'نسخ المسار',
    copied: 'تم النسخ!',
    salesForNumberOne: 'المبيعات للمركز #1',
    toGetOrangeBadge: 'لنيل الشارة البرتقالية',
    top10Cutoff: 'حد أفضل 10 كتب',
    page1Visibility: 'للظهور في الصفحة الأولى',
    monthlyCap: 'سقف العوائد الشهري',
    categoryRoyalties: 'عوائد التصنيف شهرياً',
    easyTargetSub: 'هدف سهل للمركز الأول (< 15 كتاب/يومياً)',
    mediumEffortSub: 'مجهود متوسط (15 - 50 كتاب/يومياً)',
    majorNicheSub: 'نيش ضخم رئيسي (> 50 كتاب/يومياً)',

    adsSeedPlaceholder: "أدخل الكلمة المفتاحية أو مجال الكتاب (مثال: 'dark mafia romance')...",
    adsAuthorPlaceholder: 'اختياري: اسم مؤلف منافس أو عنوان كتاب لهندسة استهدافه عكسياً...',
    adsIntroHint: 'توليد مئات الكلمات الاستهدافية (Exact, Phrase, Broad) وأرقام ASIN لكتب المنافسين لإعلانات Sponsored Products.',
    generateAmazonAds: 'توليد استهدافات إعلانات أمازون',
    harvestingAds: 'جاري استخراج استهدافات الإعلانات...',
    campaignNameLabel: 'اسم الحملة الإعلانية:',
    globalBidScale: 'مضاعف العطاءات العام:',
    copyTargetList: 'نسخ قائمة الاستهدافات',
    copiedAll: 'تم نسخ جميع الأهداف!',
    downloadBulkAdsCsv: 'تحميل ملف إعلانات أمازون الجاهز للرفع (CSV)',
    targetTypeLabel: 'نوع الاستهداف:',
    allTargets: 'جميع الأهداف',
    matchTypeLabel: 'نوع المطابقة:',
    allMatches: 'جميع المطابقات',
    thTargetValue: 'قيمة الاستهداف',
    thTargetType: 'نوع الهدف',
    thMatchType: 'نوع المطابقة',
    thSuggestedBid: 'سعر النقرة المقترح (CPC)',
    thEstImpressions: 'مرات الظهور التقديرية / شهرياً',
    thRelevanceScore: 'معدل الصلة والأهمية',

    titleOptimizerTitle: 'مُحسّن العناوين والعناوين الفرعية لمحركات بحث أمازون (SEO)',
    titleOptimizerSubtitle: 'خوارزميات أمازون تعطي أعلى وزن ترتيبي للكلمات المفتاحية الموجودة في العنوان الرئيسي والفرعي. حقق أعلى تصدر ونقر دون حشو عشوائي.',
    labelGenre: 'تصنيف أو نيش الكتاب',
    genrePlaceholder: 'مثال: روايات رومانسية مظلمة، إثارة وتشويق، مال وأعمال وتطوير ذات',
    labelCoreHook: 'الخطاف الأساسي / المشكلة المحورية / التيمة',
    coreHookPlaceholder: 'مثال: زواج مصلحة وأعداء يتحولون لعشاق، أو عادات يومية في 5 دقائق لإنهاء التسويف',
    amazon200CharRule: 'قاعدة أمازون الصارمة: يجب ألا يتجاوز مجموع حروف (العنوان الرئيسي + العنوان الفرعي) 200 حرف.',
    generateSeoTitles: 'توليد العناوين المحسنة',
    engineeringTitles: 'جاري صياغة وهندسة العناوين...',
    embeddedKeywordsLabel: 'الكلمات المفتاحية المدمجة في العنوان:',
    copyFullTitle: 'نسخ العنوان بالكامل',
    copiedFullTitle: 'تم نسخ العنوان بالكامل!',

    calculatorTitle: 'محاكي أرباح KDP ومبيعات رتبة أمازون (ABSR)',
    calculatorSubtitle: 'شاهد بدقة كيف تتحول أي رتبة مبيعات في أمازون إلى نسخ مباعة حقيقية يومياً وشهرياً، وأرباح صافية بالدولار.',
    simulatorParams: 'معايير المحاكاة',
    bookFormatLabel: 'صيغة الكتاب',
    absrLabel: 'ترتيب المبيعات في أمازون (ABSR)',
    listPriceLabel: 'سعر البيع المقترح ($ بالدولار)',
    eligible70Royalty: '✓ مؤهل لنسبة أرباح 70% من أمازون',
    outsideBracket35: '⚠ خارج شريحة 2.99$ - 9.99$: تنخفض النسبة إلى 35%',
    pageCountLabel: 'عدد صفحات الكتاب',
    colorInteriorLabel: 'طباعة داخلية ملونة (تكلفة طباعة أعلى)',
    projectedVelocity: 'المبيعات التقديرية وصافي الأرباح المتوقعة',
    estDailySalesBox: 'المبيعات اليومية',
    estMonthlySalesBox: 'المبيعات الشهرية',
    royaltyPerCopyBox: 'صافي ربح النسخة',
    estMonthlyNetBox: 'صافي الربح الشهري',
    annualProjectedBox: 'الأرباح السنوية التراكمية السلبية المتوقعة',
    perCopyDistribution: 'توزيع إيراد كل نسخة مباعة',
    authorProfit: 'أرباح المؤلف الصافية:',
    printingCost: 'تكلفة الطباعة الورقية:',
    amazonShare: 'حصة منصة أمازون:',

    whiteLabelTitle: 'استوديو العلامة البيضاء (White-Label)',
    whiteLabelSubtitle: 'تخصيص كامل للنظام والتقارير لتظهر باسم وكالتك وشعارك وعنوانك بالكامل أمام العملاء.',
    labelAgencyName: 'اسم الوكالة أو الشركة الناشرة',
    labelClientName: 'اسم العميل المستهدف في التقرير',
    labelLogoUrl: 'رابط شعار الوكالة (PNG أو SVG)',
    labelTagline: 'الشعار اللفظي أو الوصف الفرعي للوكالة',
    labelEmail: 'البريد الإلكتروني للتواصل',
    labelWebsite: 'رابط الموقع الإلكتروني',
    labelFooterNote: 'الملاحظة الختامية وحقوق الملكية للتقرير',
    liveHeaderPreview: 'معاينة حية لترويسة التقرير المطبوع (PDF):',
    resetDefaults: 'استعادة الإعدادات الافتراضية',
    saveWhiteLabel: 'حفظ إعدادات الهوية',
    savedExclamation: 'تم الحفظ بنجاح!',

    reportModalTitle: 'ملف التقرير الاستخباراتي وخطة إطلاق الكتاب للعميل',
    preparedByLabel: 'أُعدت هذه الدراسة بواسطة',
    exportAllCsvs: 'تصدير كافة جداول البيانات (CSV)',
    downloadPdfReport: 'تحميل التقرير الرسمي المطبوع (PDF)',
    generatingPdf: 'جاري إنشاء وطباعة التقرير...',
    coverBlueprintTitle: 'خطة إطلاق ونشر الكتاب الاستراتيجية على KDP',
    targetQueryLabel: 'النيش ومجال البحث المستهدف:',
    section1Title: '1. الـ 7 خانات الخلفية المخصصة لكلمات KDP',
    section2Title: '2. تحليل ومقارنة الكتب المنافسة الأكثر مبيعاً',
    section3Title: '3. خارطة طريق التصنيفات للوصول للمركز الأول #1 Bestseller',

    savedProjectsTitle: 'مشاريع ونيشات KDP المحفوظة',
    savedProjectsSubtitle: 'حفظ وتصفح حملات وأبحاث نيشات الكتب المتعددة الخاصة بك.',
    saveCurrentSession: 'حفظ جلسة البحث الحالية',
    saveProjectBtn: 'حفظ المشروع',
    savedCampaignsLabel: 'المشاريع المحفوظة',
    noProjectsYet: 'لا توجد مشاريع محفوظة حالياً. احفظ جلستك الحالية في الأعلى!',
    loadBtn: 'تحميل',

    translatorTitle: 'مترجم النشر الدقيق المتخصص (عربي ⟷ إنجليزي)',
    translatorDesc: 'ترجمة عناوين الكتب، والكلمات المفتاحية، ومصطلحات دور النشر بأعلى درجات الدقة اللغوية والتسويقية على أمازون.',
    translateInputPlaceholder: 'اكتب النص بالإنجليزية أو العربية لترجمته فوراً بدقة...',
    translateBtn: 'ترجمة عبر محرك الذكاء الاصطناعي',
    translating: 'جاري الترجمة...',
    translationResult: 'الترجمة الدقيقة المتخصصة:',
  },
};
