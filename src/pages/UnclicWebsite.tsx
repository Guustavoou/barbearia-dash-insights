import React, { useState, useEffect } from "react";
import { UnclicLanding } from "./UnclicLanding";
import { UnclicAbout } from "./UnclicAbout";
import { UnclicNavigation } from "@/components/UnclicNavigation";

type UnclicPageType = "landing" | "about" | "contact";

export const UnclicWebsite: React.FC = () => {
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
        return <UnclicLanding />;
      case "about":
        return <UnclicAbout />;
      case "contact":
        // TODO: Implementar página de contato se necessário
        return <UnclicLanding />;
      default:
        return <UnclicLanding />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <UnclicNavigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        scrollY={scrollY}
      />
      <main>{renderCurrentPage()}</main>
    </div>
  );
};
