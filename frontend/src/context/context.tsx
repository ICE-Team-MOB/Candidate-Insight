// src/context/HRRequirementsContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type EducationValue =
  | ""
  | "primary_education"
  | "basic_secondary_education"
  | "complete_secondary_education"
  | "vocational_education"
  | "junior_bachelor"
  | "bachelor"
  | "master"
  | "phd"
  | "doctor_of_science";

type SectorValue =
  | ""
  | "it"
  | "finance"
  | "hr"
  | "marketing"
  | "sales"
  | "engineering"
  | "education"
  | "healthcare"
  | "other";

type ExperienceValue = "" | "no_experience" | "0_1" | "1_3" | "3_5" | "5_plus";

type WorkFormatValue = "" | "office" | "remote" | "hybrid";

export interface HRRequirementsState {
  education: EducationValue;
  sector: SectorValue;
  experience: ExperienceValue;
  workFormat: WorkFormatValue;
}

interface HRRequirementsContextType extends HRRequirementsState {
  setEducation: (value: EducationValue) => void;
  setSector: (value: SectorValue) => void;
  setExperience: (value: ExperienceValue) => void;
  setWorkFormat: (value: WorkFormatValue) => void;
  resetRequirements: () => void;
}

const HRRequirementsContext = createContext<HRRequirementsContextType | undefined>(
  undefined
);

const initialState: HRRequirementsState = {
  education: "",
  sector: "",
  experience: "",
  workFormat: "",
};

export const HRRequirementsProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<HRRequirementsState>(initialState);

  const value: HRRequirementsContextType = {
    ...state,
    setEducation: (education) => setState((prev) => ({ ...prev, education })),
    setSector: (sector) => setState((prev) => ({ ...prev, sector })),
    setExperience: (experience) => setState((prev) => ({ ...prev, experience })),
    setWorkFormat: (workFormat) => setState((prev) => ({ ...prev, workFormat })),
    resetRequirements: () => setState(initialState),
  };

  return (
    <HRRequirementsContext.Provider value={value}>
      {children}
    </HRRequirementsContext.Provider>
  );
};

export const useHRRequirements = () => {
  const ctx = useContext(HRRequirementsContext);
  if (!ctx) {
    throw new Error("useHRRequirements must be used within HRRequirementsProvider");
  }
  return ctx;
};
