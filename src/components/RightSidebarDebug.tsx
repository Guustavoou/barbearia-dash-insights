import React from "react";
import { Button } from "@/components/ui/button";

interface RightSidebarDebugProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const RightSidebarDebug: React.FC<RightSidebarDebugProps> = ({
  isOpen,
  onToggle,
}) => {
  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg">
      <div className="text-sm font-medium mb-2">RightSidebar Debug</div>
      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
        Estado atual:{" "}
        <span className="font-mono">{isOpen ? "OPEN" : "CLOSED"}</span>
      </div>
      <Button onClick={onToggle} size="sm" className="w-full">
        {isOpen ? "Fechar" : "Abrir"} Sidebar
      </Button>
    </div>
  );
};
