import { useState, useCallback } from "react";

interface Tab<T extends string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
}

export function useTabNavigation<T extends string>(tabs: Tab<T>[], defaultTab: T) {
  const [activeTab, setActiveTab] = useState<T>(defaultTab);

  const handleTabChange = useCallback((tabId: T) => {
    setActiveTab(tabId);
  }, []);

  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  return {
    activeTab,
    currentTab,
    handleTabChange,
    setActiveTab,
  };
}
