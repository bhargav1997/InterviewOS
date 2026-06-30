import React, { useState } from 'react';
import { ParsedResume, JobDescription, MatchAnalysis, AtsAnalysis, PromptTemplateId } from '../types';
import { generateOptimizedPrompt } from '../engine/promptGenerator';
import { PROMPT_TEMPLATES } from '../engine/templates';
import { Copy, Check, Sparkles, ShieldCheck, FileCode } from 'lucide-react';

interface PromptPageProps {
  resume: ParsedResume | null;
  jd: JobDescription | null;
  match: MatchAnalysis | null;
  ats: AtsAnalysis | null;
}

export const PromptPage: React.FC<PromptPageProps> = ({ resume, jd, match, ats }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplateId>('general_ats');
  const [copied, setCopied] = useState(false);

  if (!resume || !jd || !match || !ats) {
    return (
      <div className="text-center py-20 text-slate-500 text-xs">
        Please ensure a resume and target job description are active to generate custom prompts.
      </div>
    );
  }

  const generatedPrompt = generateOptimizedPrompt(resume, jd, match, ats, selectedTemplate);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const templatesList = Object.values(PROMPT_TEMPLATES);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">AI Prompt Studio</h1>
          <p className="text-xs text-slate-400">Generate context-stuffed prompts ready for ChatGPT, Claude, or Grok.</p>
        </div>
        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg ${
            copied
              ? 'bg-emerald-600 text-white shadow-emerald-600/30'
              : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-brand-600/30'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied to Clipboard!' : 'One-Click Copy Prompt'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selector Sidebar */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              Select Role Template ({templatesList.length})
            </h3>
            <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
              {templatesList.map((tpl) => {
                const isSelected = selectedTemplate === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={`w-full text-left p-3 rounded-xl border transition ${
                      isSelected
                        ? 'bg-brand-600/15 border-brand-500/60 text-slate-100'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <p className="text-xs font-bold">{tpl.name}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{tpl.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Prompt Output Preview */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4 flex flex-col h-[650px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <FileCode className="w-4 h-4 text-indigo-400" />
              Compiled Prompt Preview ({generatedPrompt.length.toLocaleString()} characters)
            </div>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Factual Guardrails Active
            </span>
          </div>

          <div className="flex-1 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-y-auto font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
            {generatedPrompt}
          </div>
        </div>
      </div>
    </div>
  );
};
