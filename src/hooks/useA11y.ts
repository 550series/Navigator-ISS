import { useCallback, type KeyboardEvent } from "react";

export function useA11y() {
  const handleKeyDown = useCallback(
    (callback: () => void) => (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        callback();
      }
    },
    []
  );

  const getButtonProps = (onClick: () => void, label: string) => ({
    role: "button",
    tabIndex: 0,
    "aria-label": label,
    onClick,
    onKeyDown: handleKeyDown(onClick),
  });

  const getToggleProps = (isOn: boolean, onToggle: () => void, label: string) => ({
    role: "switch",
    tabIndex: 0,
    "aria-checked": isOn,
    "aria-label": label,
    onClick: onToggle,
    onKeyDown: handleKeyDown(onToggle),
  });

  return { handleKeyDown, getButtonProps, getToggleProps };
}

export function getAriaLabel(label: string, value?: string | number): string {
  if (value !== undefined) {
    return `${label}: ${value}`;
  }
  return label;
}
