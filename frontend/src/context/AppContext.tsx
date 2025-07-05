import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingData {
  socials: string[];
  website: string;
  objective: string;
}

interface SelectedOffers {
  contentSuggestions: boolean;
  brandDealReports: boolean;
  analysisIdealFollowers: boolean;
  createContents: boolean;
}

interface AppContextType {
  onboardingData: OnboardingData;
  setOnboardingData: (data: OnboardingData) => void;
  selectedOffers: SelectedOffers;
  setSelectedOffers: (offers: SelectedOffers) => void;
  uploadedFiles: File[];
  setUploadedFiles: (files: File[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    socials: [],
    website: '',
    objective: ''
  });

  const [selectedOffers, setSelectedOffers] = useState<SelectedOffers>({
    contentSuggestions: false,
    brandDealReports: false,
    analysisIdealFollowers: false,
    createContents: false
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  return (
    <AppContext.Provider value={{
      onboardingData,
      setOnboardingData,
      selectedOffers,
      setSelectedOffers,
      uploadedFiles,
      setUploadedFiles
    }}>
      {children}
    </AppContext.Provider>
  );
};