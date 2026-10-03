import React, { createContext, useContext, useState } from 'react';

export type Language = 'EN' | 'OD';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const DICTIONARY: Record<string, { EN: string; OD: string }> = {
  bmc_title: {
    EN: 'Bhubaneswar Municipal Corporation',
    OD: 'ଭୁବନେଶ୍ୱର ମହାନଗର ନିଗମ (BMC)'
  },
  platform_tagline: {
    EN: 'One City. One Intelligence. One Connected Response.',
    OD: 'ଗୋଟିଏ ନଗର · ଗୋଟିଏ ପ୍ରଜ୍ଞା · ଏକତ୍ରିତ ସେବା'
  },
  platform_emotional: {
    EN: "We're not just building a smarter city. We're building a city that cares.",
    OD: 'ଆମେ କେବଳ ଏକ ସ୍ମାର୍ଟ ସହର ଗଢ଼ୁନାହୁଁ, ଏକ ଯତ୍ନଶୀଳ ସହର ଗଢ଼ୁଛୁ।'
  },
  report_issue: {
    EN: 'Report a Civic Issue',
    OD: 'ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତୁ'
  },
  track_complaint: {
    EN: 'Track Grievance',
    OD: 'ଅଭିଯୋଗ ସ୍ଥିତି'
  },
  emergency_112: {
    EN: 'Emergency 112 SOS',
    OD: 'ଜରୁରୀକାଳୀନ ୧୧୨'
  },
  explore_city: {
    EN: 'Explore City Intelligence',
    OD: 'ନଗର ପରିଚାଳନା ଦେଖନ୍ତୁ'
  },
  namaskar: {
    EN: 'Namaskar',
    OD: 'ନମସ୍କାର'
  },
  citizen_help_prompt: {
    EN: 'What can we help you with today in Bhubaneswar?',
    OD: 'ଆଜି ଆପଣଙ୍କୁ ଭୁବନେଶ୍ୱର ସେବାରେ କିପରି ସାହାଯ୍ୟ କରିପାରିବା?'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('EN');

  const t = (key: string): string => {
    if (DICTIONARY[key]) {
      return DICTIONARY[key][lang] || DICTIONARY[key].EN;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
