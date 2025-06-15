import { useState, useEffect } from "react";

interface UseRightSidebarProps {
  defaultOpen?: boolean;
  persistKey?: string;
  isMobile?: boolean;
}

export const useRightSidebar = ({
  defaultOpen = true,
  persistKey = "rightSidebarOpen",
  isMobile = false,
}: UseRightSidebarProps = {}) => {
  const [isOpen, setIsOpen] = useState(() => {
    // Don't show on mobile by default
    if (isMobile) {
      return false;
    }

    // Try to get from localStorage
    if (typeof window !== "undefined" && persistKey) {
      const stored = localStorage.getItem(persistKey);
      if (stored !== null) {
        try {
          return JSON.parse(stored);
        } catch {
          return defaultOpen;
        }
      }
    }

    return defaultOpen;
  });

  // Persist state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && persistKey) {
      localStorage.setItem(persistKey, JSON.stringify(isOpen));
    }
  }, [isOpen, persistKey]);

  // Auto-hide on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, isOpen]);

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    toggle,
    open,
    close,
  };
};
