import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ParsedResume, JobDescription } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeResume: ParsedResume | null;
  activeJd: JobDescription | null;
  onRefreshJd: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  activeResume,
  activeJd,
  onRefreshJd
}) => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar activeResume={activeResume} activeJd={activeJd} onRefreshJd={onRefreshJd} />
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
