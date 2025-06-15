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

  // Auto-hide on mobile when becoming mobile, but allow manual toggle
  useEffect(() => {
    if (isMobile && isOpen) {
      console.log("📱 Mobile detected, auto-closing sidebar");
      setIsOpen(false);
    }
  }, [isMobile]); // Remove isOpen from dependencies to prevent infinite loop

  const toggle = () => {
    console.log("🔄 Toggle called - current state:", isOpen);
    console.log("📱 isMobile:", isMobile);

    setIsOpen((prev) => {
      const newState = !prev;
      console.log("🔄 State changing from", prev, "to", newState);

      // Force update localStorage immediately
      if (typeof window !== "undefined" && persistKey) {
        localStorage.setItem(persistKey, JSON.stringify(newState));
        console.log("💾 Saved to localStorage:", newState);
      }

      return newState;
    });
  };

  const open = () => {
    console.log("📂 Open called");
    setIsOpen(true);
  };

  const close = () => {
    console.log("📁 Close called");
    setIsOpen(false);
  };

  return {
    isOpen,
    toggle,
    open,
    close,
  };
};
