import React from 'react';
import { 
  FileText, 
  BarChart2, 
  ShieldCheck, 
  Sparkles, 
  Briefcase, 
  Kanban, 
  Settings,
  PenLine,
  BrainCircuit,
  Mail,
  BookOpen,
  Linkedin
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: BarChart2 },
    { id: 'resume', label: 'Resume Lab', icon: FileText },
    { id: 'analysis', label: 'Match Engine', icon: Sparkles },
    { id: 'bullet', label: 'Bullet Rewriter', icon: PenLine },
    { id: 'ats', label: 'ATS Auditor', icon: ShieldCheck },
    { id: 'skillgap', label: 'Skill Gap Roadmap', icon: BookOpen },
    { id: 'prompt', label: 'Prompt Studio', icon: Briefcase },
    { id: 'cover', label: 'Cover Letter', icon: Mail },
    { id: 'interview', label: 'Interview Prep', icon: BrainCircuit },
    { id: 'linkedin', label: 'LinkedIn Optimizer', icon: Linkedin },
    { id: 'tracker', label: 'Job Tracker', icon: Kanban },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between p-4 min-h-screen">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-slate-100 flex items-center gap-1">
              Interview<span className="text-brand-500">OS</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Interview-Ready Resumes</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800/80 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-medium mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          100% Local Processing
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">Zero External APIs. Privacy guaranteed.</p>
      </div>
    </aside>
  );
};
