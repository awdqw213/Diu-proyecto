import React, { createContext, useContext, useState, ReactNode } from "react";
import { Application, PositionCategory } from "@/types/position";

interface ApplicationContextType {
  applications: Application[];
  addApplication: (application: Omit<Application, "id" | "submittedAt" | "status">) => void;
  cancelApplication: (id: string) => void;
  getAppliedCategories: (positionId: string) => PositionCategory[];
  hasAppliedToPosition: (positionId: string, category?: string) => boolean;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
  const [applications, setApplications] = useState<Application[]>([]);

  const addApplication = (application: Omit<Application, "id" | "submittedAt" | "status">) => {
    const newApplication: Application = {
      ...application,
      id: Math.random().toString(36).substr(2, 9),
      submittedAt: new Date(),
      status: "pending",
    };
    setApplications((prev) => [...prev, newApplication]);
  };

  const cancelApplication = (id: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "cancelled" as const } : app))
    );
  };

  const getAppliedCategories = (positionId: string): PositionCategory[] => {
    return applications
      .filter((app) => app.positionId === positionId && app.status === "pending")
      .map((app) => app.category)
      .filter((cat): cat is PositionCategory => cat !== undefined);
  };

  const hasAppliedToPosition = (positionId: string, category?: string) => {
    const activeApps = applications.filter(
      (app) => app.positionId === positionId && app.status === "pending"
    );
    
    if (category) {
      return activeApps.some((app) => app.category === category);
    }
    
    return activeApps.length > 0;
  };

  return (
    <ApplicationContext.Provider 
      value={{ 
        applications, 
        addApplication, 
        cancelApplication, 
        getAppliedCategories,
        hasAppliedToPosition 
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error("useApplications must be used within ApplicationProvider");
  }
  return context;
};
