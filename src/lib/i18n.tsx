import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, ReportCategory, ReportStatus, PriorityBand } from '@/types';

interface Translations {
  appName: string;
  tagline: string;
  navHome: string;
  navReport: string;
  navMyReports: string;
  navTrack: string;
  navAdmin: string;
  navLogin: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaReport: string;
  ctaTrack: string;
  trackPlaceholder: string;
  trackButton: string;
  processTitle: string;
  processSubtitle: string;
  stepCapture: string;
  stepUnderstand: string;
  stepReveal: string;
  stepAct: string;
  stepResolve: string;
  categoriesTitle: string;
  categoriesSubtitle: string;
  statusSubmitted: string;
  statusVerified: string;
  statusAssigned: string;
  statusInProgress: string;
  statusResolved: string;
  statusRejected: string;
  prioCritical: string;
  prioHigh: string;
  prioMedium: string;
  prioLow: string;
}

const translations: Record<Language, Translations> = {
  en: {
    appName: 'CIVICLENS AI',
    tagline: 'From Complaints to Action',
    navHome: 'Home',
    navReport: 'Report an Issue',
    navMyReports: 'My Reports',
    navTrack: 'Track Status',
    navAdmin: 'Command Centre',
    navLogin: 'Sign In',
    heroTitle: 'Transforming Civic Complaints into Actionable Intelligence',
    heroSubtitle: 'Report public infrastructure problems in under 60 seconds. Our AI analyzes, prioritizes, and routes your voice directly to the responsible municipal authorities.',
    ctaReport: 'Report a Civic Issue',
    ctaTrack: 'Track Existing Complaint',
    trackPlaceholder: 'Enter 11-digit Tracking Token (e.g. CLK-DRN-8201)',
    trackButton: 'Lookup Report',
    processTitle: 'The CivicLens Action Pipeline',
    processSubtitle: 'A transparent, explainable lifecycle ensuring no public grievance is lost in bureaucracy.',
    stepCapture: 'Capture',
    stepUnderstand: 'Understand',
    stepReveal: 'Reveal',
    stepAct: 'Act',
    stepResolve: 'Resolve',
    categoriesTitle: 'Civic Problem Categories',
    categoriesSubtitle: 'Select a category to report or explore active municipal interventions.',
    statusSubmitted: 'Submitted',
    statusVerified: 'Verified',
    statusAssigned: 'Assigned',
    statusInProgress: 'In Progress',
    statusResolved: 'Resolved',
    statusRejected: 'Rejected',
    prioCritical: 'Critical',
    prioHigh: 'High',
    prioMedium: 'Medium',
    prioLow: 'Low',
  },
  kn: {
    appName: 'ಸಿವಿಕ್‌ಲೆನ್ಸ್ ಎಐ (CIVICLENS AI)',
    tagline: 'ದೂರುಗಳಿಂದ ತ್ವರಿತ ಪರಿಹಾರದವರೆಗೆ',
    navHome: 'ಮುಖಪುಟ',
    navReport: 'ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ',
    navMyReports: 'ನನ್ನ ವರದಿಗಳು',
    navTrack: 'ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ',
    navAdmin: 'ಆಡಳಿತ ಕೇಂದ್ರ',
    navLogin: 'ಲಾಗಿನ್',
    heroTitle: 'ನಾಗರಿಕ ಸಮಸ್ಯೆಗಳನ್ನು ತಕ್ಷಣದ ಕ್ರಮವಾಗಿ ಪರಿವರ್ತಿಸುವ ಎಐ ವ್ಯವಸ್ಥೆ',
    heroSubtitle: 'ಸಾರ್ವಜನಿಕ ಸಮಸ್ಯೆಗಳನ್ನು ೬೦ ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಸುಲಭವಾಗಿ ವರದಿ ಮಾಡಿ. ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ (AI) ತಕ್ಷಣ ವಿಶ್ಲೇಷಿಸಿ ನೇರವಾಗಿ ಸಂಬಂಧಪಟ್ಟ ಅಧಿಕೃತ ಇಲಾಖೆಗೆ ರವಾನಿಸುತ್ತದೆ.',
    ctaReport: 'ಹೊಸ ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ',
    ctaTrack: 'ದೂರಿನ ಸ್ಥಿತಿ ತಿಳಿಯಿರಿ',
    trackPlaceholder: 'ಟ್ರ್ಯಾಕಿಂಗ್ ಟೋಕನ್ ನಮೂದಿಸಿ (ಉದಾ: CLK-DRN-8201)',
    trackButton: 'ಹುಡುಕಿ',
    processTitle: 'ಸಿವಿಕ್‌ಲೆನ್ಸ್ ಪಾರದರ್ಶಕ ಕಾರ್ಯವಿಧಾನ',
    processSubtitle: 'ಪ್ರತಿಯೊಂದು ಸಾರ್ವಜನಿಕ ಸಮಸ್ಯೆಯೂ ಸ್ಪಷ್ಟವಾಗಿ ದಾಖಲಾಗಿ ಪರಿಹಾರ ಕಾಣುವ ಖಾತರಿ.',
    stepCapture: 'ದಾಖಲು',
    stepUnderstand: 'ವಿಶ್ಲೇಷಣೆ',
    stepReveal: 'ಗುರುತಿಸುವಿಕೆ',
    stepAct: 'ನಿಯೋಜನೆ',
    stepResolve: 'ಪರಿಹಾರ',
    categoriesTitle: 'ನಾಗರಿಕ ಸಮಸ್ಯೆಗಳ ವರ್ಗಗಳು',
    categoriesSubtitle: 'ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಲು ಅಥವಾ ಪ್ರಗತಿಯಲ್ಲಿರುವ ಕಾಮಗಾರಿ ತಿಳಿಯಲು ಆಯ್ಕೆಮಾಡಿ.',
    statusSubmitted: 'ದಾಖಲಾಗಿದೆ',
    statusVerified: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    statusAssigned: 'ಇಲಾಖೆಗೆ ನಿಯೋಜಿತ',
    statusInProgress: 'ಪ್ರಗತಿಯಲ್ಲಿದೆ',
    statusResolved: 'ಪರಿಹಾರವಾಗಿದೆ',
    statusRejected: 'ತಿರಸ್ಕೃತ',
    prioCritical: 'ಅತ್ಯಂತ ತುರ್ತು',
    prioHigh: 'ಹೆಚ್ಚಿನ ಆದ್ಯತೆ',
    prioMedium: 'ಮಧ್ಯಮ',
    prioLow: 'ಸಾಮಾನ್ಯ',
  }
};

export const CATEGORY_TRANSLATIONS: Record<Language, Record<ReportCategory, string>> = {
  en: {
    'Roads & Potholes': 'Roads & Potholes',
    'Drainage & Waterlogging': 'Drainage & Waterlogging',
    'Garbage & Sanitation': 'Garbage & Sanitation',
    'Streetlights': 'Streetlights & Lighting',
    'Water Supply': 'Water Supply & Leakage',
    'Electrical Hazards': 'Electrical Hazards',
    'Public Infrastructure': 'Public Infrastructure',
    'Other Civic Issues': 'Other Civic Issues'
  },
  kn: {
    'Roads & Potholes': 'ರಸ್ತೆಗಳು ಮತ್ತು ಗುಂಡಿಗಳು',
    'Drainage & Waterlogging': 'ಒಳಚರಂಡಿ ಮತ್ತು ನೀರು ನಿಲ್ಲುವುದು',
    'Garbage & Sanitation': 'ಕಸ ಮತ್ತು ಸ್ವಚ್ಛತೆ',
    'Streetlights': 'ಬೀದಿದೀಪಗಳ ಸಮಸ್ಯೆ',
    'Water Supply': 'ಕುಡಿಯುವ ನೀರು ಮತ್ತು ಸೋರಿಕೆ',
    'Electrical Hazards': 'ವಿದ್ಯುತ್ ಅಪಾಯಗಳು',
    'Public Infrastructure': 'ಸಾರ್ವಜನಿಕ ಮೂಲಸೌಕರ್ಯ',
    'Other Civic Issues': 'ಇತರ ನಾಗರಿಕ ಸಮಸ್ಯೆಗಳು'
  }
};

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
  getCategoryName: (cat: ReportCategory) => string;
  getStatusName: (status: ReportStatus) => string;
  getPriorityName: (prio: PriorityBand) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('civiclens_lang');
    return (saved === 'kn' ? 'kn' : 'en') as Language;
  });

  useEffect(() => {
    localStorage.setItem('civiclens_lang', lang);
    if (lang === 'kn') {
      document.documentElement.lang = 'kn';
    } else {
      document.documentElement.lang = 'en';
    }
  }, [lang]);

  const t = translations[lang];

  const getCategoryName = (cat: ReportCategory) => {
    return CATEGORY_TRANSLATIONS[lang][cat] || cat;
  };

  const getStatusName = (status: ReportStatus) => {
    switch (status) {
      case 'Submitted': return t.statusSubmitted;
      case 'Verified': return t.statusVerified;
      case 'Assigned': return t.statusAssigned;
      case 'In Progress': return t.statusInProgress;
      case 'Resolved': return t.statusResolved;
      case 'Rejected': return t.statusRejected;
      default: return status;
    }
  };

  const getPriorityName = (prio: PriorityBand) => {
    switch (prio) {
      case 'Critical': return t.prioCritical;
      case 'High': return t.prioHigh;
      case 'Medium': return t.prioMedium;
      case 'Low': return t.prioLow;
      default: return prio;
    }
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t, getCategoryName, getStatusName, getPriorityName }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

