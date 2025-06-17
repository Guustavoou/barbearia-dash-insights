import React, { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PageType } from "@/lib/types";

interface DatabaseErrorDetectorProps {
  onDatabaseError: () => void;
}

export const DatabaseErrorDetector: React.FC<DatabaseErrorDetectorProps> = ({
  onDatabaseError,
}) => {
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        // Test the appointments table specifically
        const { error } = await supabase
          .from("appointments")
          .select("*")
          .limit(1);

        if (error && error.message.includes("does not exist")) {
          console.log(
            "🚨 Database error detected, redirecting to emergency fix...",
          );
          onDatabaseError();
        }
      } catch (error) {
        console.log("🚨 Database connectivity error detected:", error);
        onDatabaseError();
      }
    };

    // Check immediately
    checkDatabase();

    // Check every 30 seconds if still in error state
    const interval = setInterval(checkDatabase, 30000);

    return () => clearInterval(interval);
  }, [onDatabaseError]);

  return null; // This is a utility component with no UI
};

// Hook to easily use database error detection
export const useDatabaseErrorDetection = (
  onPageChange: (page: PageType) => void,
) => {
  const handleDatabaseError = () => {
    console.log("🚨 Redirecting to database emergency fix...");
    onPageChange("database-emergency");
  };

  return { handleDatabaseError };
};
