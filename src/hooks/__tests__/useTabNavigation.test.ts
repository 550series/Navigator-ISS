import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTabNavigation } from "../useTabNavigation";

const mockTabs = [
  { id: "tab1" as const, label: "Tab 1" },
  { id: "tab2" as const, label: "Tab 2" },
  { id: "tab3" as const, label: "Tab 3" },
];

describe("useTabNavigation", () => {
  it("returns default tab", () => {
    const { result } = renderHook(() => useTabNavigation(mockTabs, "tab1"));
    expect(result.current.activeTab).toBe("tab1");
  });

  it("changes tab", () => {
    const { result } = renderHook(() => useTabNavigation(mockTabs, "tab1"));

    act(() => {
      result.current.handleTabChange("tab2");
    });

    expect(result.current.activeTab).toBe("tab2");
  });

  it("returns current tab object", () => {
    const { result } = renderHook(() => useTabNavigation(mockTabs, "tab1"));
    expect(result.current.currentTab).toEqual({ id: "tab1", label: "Tab 1" });
  });

  it("updates current tab when tab changes", () => {
    const { result } = renderHook(() => useTabNavigation(mockTabs, "tab1"));

    act(() => {
      result.current.handleTabChange("tab3");
    });

    expect(result.current.currentTab).toEqual({ id: "tab3", label: "Tab 3" });
  });
});
