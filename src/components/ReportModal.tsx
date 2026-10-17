import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  X, 
  Users, 
  KeyRound, 
  FolderTree 
} from 'lucide-react';
import { 
  KeywordItem, 
  CompetitorBook, 
  AmazonCategory, 
  AmazonAdTarget, 
  TitleIdea, 
  WhiteLabelConfig 
} from '../types';
import { formatCurrency, formatNumber } from '../utils/amazonCalculators';
import { 
  generateWhiteLabelPDFReport, 
  exportKeywordsToCSV, 
  exportCompetitorsToCSV, 
  exportAmazonAdsBulkCSV 
} from '../utils/exportUtils';
import { Language, translations } from '../i18n/translations';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  whiteLabel: WhiteLabelConfig;
  nicheQuery: string;
  keywords: KeywordItem[];
  competitors: CompetitorBook[];
  categories: AmazonCategory[];
  adTargets: AmazonAdTarget[];
  titleIdeas: TitleIdea[];
  lang: Language;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  whiteLabel,
  nicheQuery,
  keywords,
  competitors,
  categories,
  adTargets,
  titleIdeas,
  lang,
}) => {
  const t = translations[lang];
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  if (!isOpen) return null;

  const top7 = keywords.filter((k) => k.isSelectedBackend).slice(0, 7);
  const totalSearches = top7.reduce((acc, k) => acc + k.amazonSearches, 0);
  const totalCompetitorRev = competitors.reduce((acc, c) => acc + c.estMonthlyRevenue, 0);

  const handleDownloadPDF = () => {
    setDownloadingPdf(true);
    setTimeout(() => {
      generateWhiteLabelPDFReport({
        whiteLabel,
        nicheQuery,
        keywords,
        competitors,
        categories,
        adTargets,
        titleIdeas,
      });
      setDownloadingPdf(false);
    }, 600);
  };

  const handleDownloadAllCSVs = () => {
    setDownloadingZip(true);
    exportKeywordsToCSV(keywords, `KDP_${nicheQuery}_Keywords.csv`);
    setTimeout(() => exportCompetitorsToCSV(competitors, `KDP_${nicheQuery}_Competitors.csv`), 300);
    setTimeout(() => exportAmazonAdsBulkCSV(adTargets, `KDP_${nicheQuery}_Campaign`, `KDP_${nicheQuery}_AmazonAds.csv`), 600);
    setTimeout(() => setDownloadingZip(false), 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="glass-panel w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {t.reportModalTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {t.preparedByLabel} <strong className="text-indigo-300">{whiteLabel.agencyName}</strong> {lang === 'ar' ? 'لصالح' : 'for'} <strong className="text-white">{whiteLabel.clientName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={handleDownloadAllCSVs}
              disabled={downloadingZip}
              className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.exportAllCsvs}</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPdf}
              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all"
            >
              {downloadingPdf ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.generatingPdf}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{t.downloadPdfReport}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2 rtl:mr-2 rtl:ml-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Preview Document */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-950/40">
          
          {/* Cover Header Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 p-6 border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
                  {whiteLabel.tagline || t.appTagline}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  {t.coverBlueprintTitle}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {t.targetQueryLabel} <strong className="text-slate-200">"{nicheQuery}"</strong>
                </p>
              </div>

              <div className="text-right rtl:text-left text-xs text-slate-400 font-mono">
                <span className="block text-slate-200 font-bold">{whiteLabel.agencyName}</span>
                <span>{t.labelClientName}: {whiteLabel.clientName}</span>
                <span className="block text-slate-500">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Executive Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{lang === 'ar' ? 'بحث الـ 7 خانات' : '7 Backend Searches'}</span>
                <div className="text-lg font-black text-white">{formatNumber(totalSearches)}/mo</div>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{lang === 'ar' ? 'عوائد المنافسين المتصدرين' : 'Top Rivals Monthly $'}</span>
                <div className="text-lg font-black text-emerald-400">{formatCurrency(totalCompetitorRev)}</div>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{lang === 'ar' ? 'هدف المركز #1 الأسهل' : 'Best #1 Target'}</span>
                <div className="text-lg font-black text-amber-300">
                  {categories[0]?.salesForNumberOne || 20} {lang === 'ar' ? 'مبيعة/يوم' : 'sales/day'}
                </div>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{lang === 'ar' ? 'أهداف إعلانات أمازون' : 'Amazon Ad Targets'}</span>
                <div className="text-lg font-black text-cyan-400">{adTargets.length} {lang === 'ar' ? 'هدف' : 'Targets'}</div>
              </div>
            </div>
          </div>

          {/* Section 1: The 7 Backend Keywords */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 rtl:space-x-reverse">
              <KeyRound className="w-4 h-4 text-indigo-400" />
              <span>{t.section1Title}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
              {top7.map((k, i) => (
                <div key={k.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <span className="text-[10px] text-indigo-400 font-bold block">{t.slotNumber}{i + 1}</span>
                  <p className="font-bold text-white line-clamp-2 mt-0.5">{k.keyword}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{formatNumber(k.amazonSearches)}/mo</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Top Competitors */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 rtl:space-x-reverse">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>{t.section2Title}</span>
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left rtl:text-right text-xs bg-slate-900">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">{t.thTitleAuthor}</th>
                    <th className="p-3 text-center">{t.thAbsrRank}</th>
                    <th className="p-3 text-right rtl:text-left">{t.thEstDailySales}</th>
                    <th className="p-3 text-right rtl:text-left">{t.thEstMonthlyRev}</th>
                    <th className="p-3 text-center">{t.thPriceRating}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {competitors.slice(0, 5).map((comp) => (
                    <tr key={comp.id}>
                      <td className="p-3">
                        <span className="font-bold text-white">{comp.title}</span>
                        <span className="text-slate-400 block text-[11px]">{lang === 'ar' ? 'تأليف' : 'by'} {comp.author}</span>
                      </td>
                      <td className="p-3 text-center font-bold text-amber-300">#{formatNumber(comp.absr)}</td>
                      <td className="p-3 text-right rtl:text-left font-bold text-white">{comp.estDailySales} {lang === 'ar' ? 'نسخة' : 'units'}</td>
                      <td className="p-3 text-right rtl:text-left font-bold text-emerald-400">{formatCurrency(comp.estMonthlyRevenue)}</td>
                      <td className="p-3 text-center text-slate-300">★ {comp.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Recommended Categories */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 rtl:space-x-reverse">
              <FolderTree className="w-4 h-4 text-indigo-400" />
              <span>{t.section3Title}</span>
            </h3>
            <div className="space-y-2">
              {categories.slice(0, 3).map((cat) => (
                <div key={cat.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{cat.name}</span>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{cat.fullBreadcrumb}</p>
                  </div>
                  <div className="text-right rtl:text-left">
                    <span className="text-emerald-400 font-extrabold text-sm">{cat.salesForNumberOne} {lang === 'ar' ? 'مبيعة/يومياً' : 'sales/day'}</span>
                    <span className="text-[10px] text-slate-400 block">{t.toGetOrangeBadge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
