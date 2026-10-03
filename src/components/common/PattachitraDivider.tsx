import React from 'react';

interface PattachitraDividerProps {
  className?: string;
  theme?: 'terracotta' | 'charcoal' | 'ochre' | 'subtle';
}

export const PattachitraDivider: React.FC<PattachitraDividerProps> = ({
  className = '',
  theme = 'terracotta'
}) => {
  const primaryColor = theme === 'charcoal' ? '#3D3732' : theme === 'ochre' ? '#C58B3A' : '#B8543A';
  const secondaryColor = theme === 'charcoal' ? '#211E1B' : '#C58B3A';

  return (
    <div className={`flex items-center justify-center gap-3 w-full py-2 opacity-80 ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#B8543A]/40 to-[#B8543A]" />
      
      {/* Traditional Temple Kalasha / Diamond geometric center */}
      <svg width="36" height="14" viewBox="0 0 36 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="18,2 24,7 18,12 12,7" fill={primaryColor} />
        <circle cx="18" cy="7" r="2" fill="#F7F1E5" />
        <circle cx="6" cy="7" r="1.5" fill={secondaryColor} />
        <circle cx="30" cy="7" r="1.5" fill={secondaryColor} />
        <line x1="0" y1="7" x2="10" y2="7" stroke={primaryColor} strokeWidth="1" />
        <line x1="26" y1="7" x2="36" y2="7" stroke={primaryColor} strokeWidth="1" />
      </svg>

      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#B8543A]/40 to-[#B8543A]" />
    </div>
  );
};
