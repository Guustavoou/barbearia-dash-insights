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
    console.log("useRightSidebar initializing with:", {
      defaultOpen,
      isMobile,
    });

    // Don't show on mobile by default
    if (isMobile) {
      console.log("useRightSidebar: mobile detected, setting to false");
      return false;
    }

    // Try to get from localStorage
    if (typeof window !== "undefined" && persistKey) {
      const stored = localStorage.getItem(persistKey);
      if (stored !== null) {
        const storedValue = JSON.parse(stored);
        console.log("useRightSidebar: loaded from localStorage:", storedValue);
        return storedValue;
      }
    }

    console.log("useRightSidebar: using defaultOpen:", defaultOpen);
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
  }, [isMobile]);

  const toggle = () => {
    console.log("useRightSidebar toggle called, current state:", isOpen);
    setIsOpen((prev) => {
      console.log("useRightSidebar state changing from", prev, "to", !prev);
      return !prev;
    });
  };
  const open = () => {
    console.log("useRightSidebar open called");
    setIsOpen(true);
  };
  const close = () => {
    console.log("useRightSidebar close called");
    setIsOpen(false);
  };

  return {
    isOpen,
    toggle,
    open,
    close,
  };
};
