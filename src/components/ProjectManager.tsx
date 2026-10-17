import React, { useState } from 'react';
import { 
  FolderKanban, 
  Trash2, 
  FolderOpen, 
  X, 
  Calendar, 
  Save, 
  Check,
} from 'lucide-react';
import { SavedProject, KeywordItem, CompetitorBook, AmazonCategory, AmazonAdTarget, TitleIdea } from '../types';
import { Language, translations } from '../i18n/translations';

interface ProjectManagerProps {
  isOpen: boolean;
  onClose: () => void;
  savedProjects: SavedProject[];
  currentQuery: string;
  currentKeywords: KeywordItem[];
  currentCompetitors: CompetitorBook[];
  currentCategories: AmazonCategory[];
  currentAds: AmazonAdTarget[];
  currentTitles: TitleIdea[];
  onLoadProject: (project: SavedProject) => void;
  onSaveCurrentProject: (projectName: string) => void;
  onDeleteProject: (projectId: string) => void;
  lang: Language;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  isOpen,
  onClose,
  savedProjects,
  currentQuery,
  currentKeywords,
  currentCompetitors,
  currentCategories,
  currentAds,
  currentTitles,
  onLoadProject,
  onSaveCurrentProject,
  onDeleteProject,
  lang,
}) => {
  const t = translations[lang];
  const [newProjectName, setNewProjectName] = useState(
    currentQuery 
      ? (lang === 'ar' ? `مشروع بحث: ${currentQuery}` : `${currentQuery.toUpperCase()} Book Research`) 
      : (lang === 'ar' ? 'مشروع KDP جديد' : 'My KDP Project')
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onSaveCurrentProject(newProjectName.trim());
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t.savedProjectsTitle}</h3>
              <p className="text-xs text-slate-400">{t.savedProjectsSubtitle}</p>
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
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Save Current Session */}
          <form onSubmit={handleSave} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {t.saveCurrentSession}
            </h4>
            <div className="flex gap-2 rtl:space-x-reverse">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder={lang === 'ar' ? 'اكتب اسم المشروع...' : 'Enter project name...'}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{t.savedExclamation}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>{t.saveProjectBtn}</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              {lang === 'ar' 
                ? `سيتم حفظ ${currentKeywords.length} كلمة مفتاحية، و${currentCompetitors.length} كتب منافسة، و${currentCategories.length} تصنيفات، و${currentAds.length} أهداف إعلانات.`
                : `Saves ${currentKeywords.length} keywords, ${currentCompetitors.length} competitors, ${currentCategories.length} categories, and ${currentAds.length} ad targets.`}
            </p>
          </form>

          {/* Project List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.savedCampaignsLabel} ({savedProjects.length})
            </h4>

            {savedProjects.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 italic">
                {t.noProjectsYet}
              </div>
            ) : (
              <div className="space-y-2">
                {savedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-between gap-3"
                  >
                    <div>
                      <h5 className="font-bold text-white text-sm">{project.name}</h5>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {project.createdAt}
                        </span>
                        <span>• {project.keywords.length} {lang === 'ar' ? 'كلمات' : 'Keywords'}</span>
                        <span>• {project.competitors.length} {lang === 'ar' ? 'منافسين' : 'Competitors'}</span>
                        <span>• {project.adTargets.length} {lang === 'ar' ? 'إعلانات' : 'Ads'}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                      <button
                        onClick={() => {
                          onLoadProject(project);
                          onClose();
                        }}
                        className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>{t.loadBtn}</span>
                      </button>

                      <button
                        onClick={() => onDeleteProject(project.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
                        title={lang === 'ar' ? 'حذف المشروع' : 'Delete project'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
