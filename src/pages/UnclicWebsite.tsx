import React, { useState, useEffect } from "react";
import { UnclicLanding } from "./UnclicLanding";
import { UnclicAbout } from "./UnclicAbout";
import { UnclicNavigation } from "@/components/UnclicNavigation";

type UnclicPageType = "landing" | "about" | "contact";

interface UnclicWebsiteProps {
  onNavigateToLogin?: () => void;
}

export const UnclicWebsite: React.FC<UnclicWebsiteProps> = ({
  onNavigateToLogin,
}) => {
  const [currentPage, setCurrentPage] = useState<UnclicPageType>("landing");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "landing":
        return <UnclicLanding onNavigateToLogin={onNavigateToLogin} />;
      case "about":
        return <UnclicAbout onNavigateToLogin={onNavigateToLogin} />;
      case "contact":
        // TODO: Implementar página de contato se necessário
        return <UnclicLanding onNavigateToLogin={onNavigateToLogin} />;
      default:
        return <UnclicLanding onNavigateToLogin={onNavigateToLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <UnclicNavigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        scrollY={scrollY}
        onNavigateToLogin={onNavigateToLogin}
      />
      <main>{renderCurrentPage()}</main>
    </div>
  );
};
