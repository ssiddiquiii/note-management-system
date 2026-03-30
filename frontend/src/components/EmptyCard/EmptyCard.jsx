import React from "react";

const AddNotesIllustration = () => (
  <svg viewBox="0 0 280 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-52 mx-auto">
    {/* Background circle */}
    <circle cx="140" cy="130" r="100" fill="var(--accent-light)" opacity="0.5"/>
    {/* Notebook */}
    <rect x="85" y="55" width="130" height="170" rx="12" fill="var(--bg-surface)" stroke="var(--border-color)" strokeWidth="2"/>
    {/* Binding spine */}
    <rect x="85" y="55" width="25" height="170" rx="12" fill="var(--accent-light)"/>
    {/* Lines */}
    <line x1="125" y1="95" x2="195" y2="95" stroke="var(--border-color)" strokeWidth="2" strokeLinecap="round"/>
    <line x1="125" y1="115" x2="185" y2="115" stroke="var(--border-color)" strokeWidth="2" strokeLinecap="round"/>
    <line x1="125" y1="135" x2="175" y2="135" stroke="var(--border-color)" strokeWidth="2" strokeLinecap="round"/>
    <line x1="125" y1="155" x2="190" y2="155" stroke="var(--border-color)" strokeWidth="2" strokeLinecap="round"/>
    <line x1="125" y1="175" x2="160" y2="175" stroke="var(--border-color)" strokeWidth="2" strokeLinecap="round"/>
    {/* Plus button */}
    <circle cx="205" cy="205" r="24" fill="var(--accent)" stroke="var(--bg-surface)" strokeWidth="3"/>
    <path d="M205 193V217M193 205H217" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    {/* Sparkles */}
    <g className="animate-pulseGlow">
      <circle cx="60" cy="80" r="3" fill="var(--accent)" opacity="0.5"/>
      <circle cx="235" cy="70" r="4" fill="var(--accent)" opacity="0.4"/>
      <circle cx="55" cy="180" r="2.5" fill="var(--accent)" opacity="0.3"/>
      <circle cx="240" cy="160" r="3" fill="var(--accent)" opacity="0.4"/>
    </g>
    {/* Star decorations */}
    <path d="M248 90l3 6 6 1-4 4 1 7-6-3-6 3 1-7-4-4 6-1z" fill="var(--warning)" opacity="0.6"/>
    <path d="M50 130l2 4 5 1-3 3 1 5-5-2-5 2 1-5-3-3 5-1z" fill="var(--warning)" opacity="0.5"/>
  </svg>
);

const NoDataIllustration = () => (
  <svg viewBox="0 0 280 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-52 mx-auto">
    {/* Background circle */}
    <circle cx="140" cy="130" r="100" fill="var(--accent-light)" opacity="0.3"/>
    {/* Magnifying glass */}
    <circle cx="130" cy="120" r="50" stroke="var(--border-color)" strokeWidth="6" fill="var(--bg-surface)"/>
    <circle cx="130" cy="120" r="35" stroke="var(--accent)" strokeWidth="2" strokeDasharray="6 4" opacity="0.5"/>
    {/* Handle */}
    <line x1="168" y1="155" x2="210" y2="197" stroke="var(--border-color)" strokeWidth="8" strokeLinecap="round"/>
    <line x1="170" y1="157" x2="208" y2="195" stroke="var(--bg-hover)" strokeWidth="5" strokeLinecap="round"/>
    {/* X in the center */}
    <path d="M118 108L142 132M142 108L118 132" stroke="var(--text-secondary)" strokeWidth="4" strokeLinecap="round" opacity="0.4"/>
    {/* Scattered dots */}
    <circle cx="60" cy="90" r="3" fill="var(--accent)" opacity="0.3"/>
    <circle cx="230" cy="80" r="2" fill="var(--accent)" opacity="0.4"/>
    <circle cx="245" cy="140" r="3" fill="var(--accent)" opacity="0.25"/>
    <circle cx="50" cy="170" r="2.5" fill="var(--accent)" opacity="0.35"/>
    {/* Text line placeholder */}
    <rect x="95" y="225" width="90" height="8" rx="4" fill="var(--border-color)" opacity="0.4"/>
    <rect x="115" y="240" width="50" height="6" rx="3" fill="var(--border-color)" opacity="0.25"/>
  </svg>
);

const EmptyCard = ({ imgSrc, message, isSearch }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fadeInUp">
      <div className="animate-float">
        {isSearch ? <NoDataIllustration /> : <AddNotesIllustration />}
      </div>

      <p className="max-w-xs text-sm text-[var(--text-secondary)] text-center mt-6 leading-relaxed">
        {message}
      </p>

      {!isSearch && (
        <button 
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all duration-200 hover:shadow-lg active:scale-95"
          style={{ background: 'var(--accent-gradient)' }}
          onClick={() => {
            const fabBtn = document.querySelector('[data-fab-add]');
            if (fabBtn) fabBtn.click();
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Create your first note
        </button>
      )}
    </div>
  );
};

export default EmptyCard;
