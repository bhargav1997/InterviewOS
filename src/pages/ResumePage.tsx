import React, { useState } from 'react';
import { ParsedResume } from '../types';
import { parsePdfFile } from '../parser/pdfParser';
import { parseDocxFile } from '../parser/docxParser';
import { parseTxtFile } from '../parser/txtParser';
import { parseRawResume } from '../parser/sectionExtractor';
import { Upload, FileText, CheckCircle, Trash2, ShieldCheck, Plus, Briefcase } from 'lucide-react';

interface ResumePageProps {
  resumes: ParsedResume[];
  activeResume: ParsedResume | null;
  onSaveResume: (resume: ParsedResume) => Promise<void>;
  onDeleteResume: (id: string) => Promise<void>;
  onSetActive: (id: string) => Promise<void>;
}

export const ResumePage: React.FC<ResumePageProps> = ({
  resumes,
  activeResume,
  onSaveResume,
  onDeleteResume,
  onSetActive
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [resumeTitle, setResumeTitle] = useState('');
  const [selectedResume, setSelectedResume] = useState<ParsedResume | null>(activeResume);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      let rawText = '';
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith('.pdf')) {
        rawText = await parsePdfFile(file);
      } else if (fileName.endsWith('.docx')) {
        rawText = await parseDocxFile(file);
      } else if (fileName.endsWith('.txt')) {
        rawText = await parseTxtFile(file);
      } else {
        throw new Error('Unsupported file format. Please upload a PDF, DOCX, or TXT file.');
      }

      if (!rawText.trim()) {
        throw new Error('Could not extract text from file. Please ensure it is not an image scan.');
      }

      const titleToUse = resumeTitle.trim() || file.name.replace(/\.[^/.]+$/, "");
      const newResume = parseRawResume(rawText, titleToUse);
      
      await onSaveResume(newResume);
      setSelectedResume(newResume);
      setResumeTitle('');
    } catch (err: any) {
      setUploadError(err.message || 'Failed to parse file');
    } finally {
      setIsUploading(false);
      // Reset so the same file can be re-uploaded
      e.target.value = '';
    }
  };

  const activeDisplayResume = selectedResume || activeResume || (resumes.length > 0 ? resumes[0] : null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Resume Management Lab</h1>
          <p className="text-xs text-slate-400">Upload and manage tailored resume versions parsed locally.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          Local Browser Parsing Only
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload & Manager Column */}
        <div className="space-y-6">
          {/* File Upload Box */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-200">Upload New Resume</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">Resume Label / Title (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Amazon Senior Resume"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <label className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition ${
              isUploading ? 'border-brand-500 bg-brand-500/5' : 'border-slate-800 hover:border-brand-500/50 bg-slate-900/40'
            }`}>
              <Upload className="w-8 h-8 text-brand-400 mb-2 animate-bounce" />
              <span className="text-xs font-semibold text-slate-200">Click to upload resume</span>
              <span className="text-[11px] text-slate-400 mt-1">PDF, DOCX, or TXT (Max 10MB)</span>
              <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="hidden" />
            </label>

            {isUploading && <p className="text-xs text-brand-400 text-center animate-pulse">Parsing file locally...</p>}
            {uploadError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <p className="text-xs text-rose-400 whitespace-pre-line leading-relaxed">{uploadError}</p>
              </div>
            )}
          </div>

          {/* Saved Resumes List */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-200">Saved Resumes ({resumes.length})</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {resumes.map((r) => {
                const isActive = activeResume?.id === r.id;
                const isSelected = activeDisplayResume?.id === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedResume(r)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      isSelected
                        ? 'bg-brand-600/10 border-brand-500/50 text-slate-100'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-400' : 'text-slate-500'}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">{r.title}</p>
                        <p className="text-[10px] text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isActive ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetActive(r.id);
                          }}
                          className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        >
                          Set Active
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteResume(r.id);
                        }}
                        className="p-1 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Extracted Resume Inspector Column */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-6">
          {activeDisplayResume ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-100">{activeDisplayResume.title}</h2>
                  <p className="text-xs text-slate-400">
                    Candidate: {activeDisplayResume.contactInfo.name} | {activeDisplayResume.yearsOfExperience} Years Exp
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  {activeDisplayResume.skills.allSkills.length} Skills Extracted
                </span>
              </div>

              {/* Parsed Sections Tabs */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                <div>
                  <h4 className="text-xs font-semibold uppercase text-brand-400 mb-2">Technical Skills & Taxonomy</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeDisplayResume.skills.allSkills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 border border-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase text-brand-400 mb-2">Work Experience</h4>
                  <div className="space-y-3">
                    {activeDisplayResume.workExperience.map((exp) => (
                      <div key={exp.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold text-slate-200">{exp.role}</span>
                            <span className="text-xs text-slate-400"> @ {exp.company}</span>
                          </div>
                          <span className="text-[11px] text-slate-500">{exp.startDate} - {exp.endDate}</span>
                        </div>
                        <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                          {exp.bulletPoints.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase text-brand-400 mb-2">Education & Certifications</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {activeDisplayResume.education.map((edu) => (
                      <div key={edu.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                        <p className="font-semibold text-slate-200">{edu.degree}</p>
                        <p className="text-slate-400">{edu.institution} ({edu.graduationYear})</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs">
              Select or upload a resume to inspect parsed entities.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
