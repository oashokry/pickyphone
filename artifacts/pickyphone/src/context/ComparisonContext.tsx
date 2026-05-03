import { createContext, useContext, useState, ReactNode } from "react";
import { Phone, Priority, UsageType } from "@/lib/recommendation";

interface ComparisonContextType {
  slotsCount: number;
  setSlotsCount: (count: number) => void;
  selectedPhoneIds: (string | null)[];
  setSelectedPhoneId: (index: number, id: string | null) => void;
  priority: Priority;
  setPriority: (p: Priority) => void;
  budget: [number, number];
  setBudget: (b: [number, number]) => void;
  usageType: UsageType;
  setUsageType: (u: UsageType) => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [slotsCount, setSlotsCount] = useState<number>(2);
  const [selectedPhoneIds, setSelectedPhoneIds] = useState<(string | null)[]>([null, null]);
  const [priority, setPriority] = useState<Priority>("balanced");
  const [budget, setBudget] = useState<[number, number]>([200, 1200]);
  const [usageType, setUsageType] = useState<UsageType>("Mixed");

  const handleSetSlotsCount = (count: number) => {
    setSlotsCount(count);
    setSelectedPhoneIds(prev => {
      const next = [...prev];
      if (count > prev.length) return [...next, ...Array(count - prev.length).fill(null)];
      return next.slice(0, count);
    });
  };

  const setSelectedPhoneId = (index: number, id: string | null) => {
    setSelectedPhoneIds(prev => {
      const next = [...prev];
      next[index] = id;
      return next;
    });
  };

  return (
    <ComparisonContext.Provider value={{
      slotsCount, setSlotsCount: handleSetSlotsCount,
      selectedPhoneIds, setSelectedPhoneId,
      priority, setPriority,
      budget, setBudget,
      usageType, setUsageType,
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const ctx = useContext(ComparisonContext);
  if (!ctx) throw new Error("useComparison must be used within a ComparisonProvider");
  return ctx;
}
