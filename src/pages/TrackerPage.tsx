import React, { useState } from 'react';
import { TrackedJob, JobApplicationStatus } from '../types';
import { Kanban, Plus, Trash2, Edit2, ExternalLink, Calendar, DollarSign } from 'lucide-react';

interface TrackerPageProps {
  jobs: TrackedJob[];
  onSaveJob: (job: TrackedJob) => Promise<void>;
  onUpdateStatus: (id: string, status: JobApplicationStatus) => Promise<void>;
  onDeleteJob: (id: string) => Promise<void>;
}

export const TrackerPage: React.FC<TrackerPageProps> = ({
  jobs,
  onSaveJob,
  onUpdateStatus,
  onDeleteJob
}) => {
  const [editingJob, setEditingJob] = useState<Partial<TrackedJob> | null>(null);
  const [isNewJob, setIsNewJob] = useState(false);

  const columns: JobApplicationStatus[] = ['Wishlist', 'Saved', 'Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted'];

  const handleCreateNew = () => {
    setIsNewJob(true);
    setEditingJob({
      id: `job_${Date.now()}`,
      jobTitle: '',
      company: '',
      location: 'Remote',
      url: '',
      status: 'Wishlist',
      notes: '',
      salary: ''
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob?.jobTitle || !editingJob?.company) return;
    await onSaveJob(editingJob as TrackedJob);
    setEditingJob(null);
    setIsNewJob(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Job Application Tracker</h1>
          <p className="text-xs text-slate-400">Manage your pipeline locally across application stages.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-lg shadow-brand-600/25"
        >
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[550px]">
        {columns.map((col) => {
          const colJobs = jobs.filter(j => j.status === col);
          return (
            <div key={col} className="w-72 shrink-0 bg-slate-900/50 rounded-2xl border border-slate-800/80 p-3 flex flex-col gap-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{col}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                  {colJobs.length}
                </span>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {colJobs.map((j) => (
                  <div key={j.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 group hover:border-brand-500/40 transition shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">{j.jobTitle}</h4>
                        <p className="text-[11px] text-slate-400">{j.company} • {j.location}</p>
                      </div>
                      <button onClick={() => { setIsNewJob(false); setEditingJob(j); }} className="p-1 hover:text-brand-400 text-slate-500 transition">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {j.salary && (
                      <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> {j.salary}
                      </p>
                    )}

                    {j.notes && (
                      <p className="text-[11px] text-slate-400 line-clamp-2 italic bg-slate-950/40 p-2 rounded-lg border border-slate-800/50">
                        "{j.notes}"
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] text-slate-500">
                      <span>{j.appliedDate || new Date(j.createdAt).toLocaleDateString()}</span>
                      <div className="flex items-center gap-1">
                        {j.url && (
                          <a href={j.url} target="_blank" rel="noreferrer" className="hover:text-slate-300">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <button onClick={() => onDeleteJob(j.id)} className="hover:text-rose-400 ml-1">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Stage Selector Dropdown */}
                    <select
                      value={j.status}
                      onChange={(e) => onUpdateStatus(j.id, e.target.value as JobApplicationStatus)}
                      className="w-full mt-2 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-slate-300 focus:outline-none"
                    >
                      {columns.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit/Create Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-slate-100">
              {isNewJob ? 'Add New Job Application' : 'Edit Tracked Job'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400">Job Title</label>
                <input
                  required
                  type="text"
                  value={editingJob.jobTitle || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, jobTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Company Name</label>
                <input
                  required
                  type="text"
                  value={editingJob.company || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, company: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Stage / Status</label>
                  <select
                    value={editingJob.status || 'Wishlist'}
                    onChange={(e) => setEditingJob({ ...editingJob, status: e.target.value as JobApplicationStatus })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 mt-1"
                  >
                    {columns.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400">Salary Estimate</label>
                  <input
                    type="text"
                    placeholder="e.g. $180k"
                    value={editingJob.salary || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, salary: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400">Notes & Interview Insights</label>
                <textarea
                  rows={3}
                  value={editingJob.notes || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingJob(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-brand-600 text-xs font-semibold text-white shadow-lg shadow-brand-600/20"
              >
                Save Job
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
