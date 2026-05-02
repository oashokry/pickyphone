import { createContext, useContext, useState, ReactNode } from "react";
import { Phone, Priority } from "@/lib/recommendation";

interface ComparisonContextType {
  slotsCount: number;
  setSlotsCount: (count: number) => void;
  selectedPhoneIds: (string | null)[];
  setSelectedPhoneId: (index: number, id: string | null) => void;
  priority: Priority;
  setPriority: (p: Priority) => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [slotsCount, setSlotsCount] = useState<number>(2);
  const [selectedPhoneIds, setSelectedPhoneIds] = useState<(string | null)[]>([null, null]);
  const [priority, setPriority] = useState<Priority>("balanced");

  const handleSetSlotsCount = (count: number) => {
    setSlotsCount(count);
    setSelectedPhoneIds(prev => {
      const newSlots = [...prev];
      if (count > prev.length) {
        return [...newSlots, ...Array(count - prev.length).fill(null)];
      } else {
        return newSlots.slice(0, count);
      }
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
      slotsCount,
      setSlotsCount: handleSetSlotsCount,
      selectedPhoneIds,
      setSelectedPhoneId,
      priority,
      setPriority
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
}
