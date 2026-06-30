import React from 'react';

interface KeywordHeatmapProps {
  matchingKeywords: string[];
  missingKeywords: string[];
}

export const KeywordHeatmap: React.FC<KeywordHeatmapProps> = ({
  matchingKeywords,
  missingKeywords
}) => {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Matching Tech & Skills ({matchingKeywords.length})
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {matchingKeywords.length > 0 ? (
            matchingKeywords.map((kw, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shadow-sm flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {kw}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">No direct matching skills detected.</span>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
            Missing Keywords ({missingKeywords.length})
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.length > 0 ? (
            missingKeywords.map((kw, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20 shadow-sm flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                {kw}
              </span>
            ))
          ) : (
            <span className="text-xs text-emerald-400 font-medium">100% keyword coverage achieved!</span>
          )}
        </div>
      </div>
    </div>
  );
};
