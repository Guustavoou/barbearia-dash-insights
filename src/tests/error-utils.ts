// Utility function to properly format error messages
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object") {
    // Try to extract common error properties
    const errorObj = error as any;

    if (errorObj.message) {
      return errorObj.message;
    }

    if (errorObj.error) {
      return formatErrorMessage(errorObj.error);
    }

    if (errorObj.details) {
      return errorObj.details;
    }

    // For Supabase errors that might have nested structure
    if (errorObj.code) {
      return `Error ${errorObj.code}: ${errorObj.message || "Unknown error"}`;
    }
  }

  // Fallback to JSON stringify for complex objects
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

// Enhanced error handler for debugging
export function logError(context: string, error: unknown): void {
  const formattedError = formatErrorMessage(error);
  console.error(`❌ ${context}:`, formattedError);

  // Also log the original error for debugging
  if (typeof error === "object" && error !== null) {
    console.error("Original error object:", error);
  }
}

// Force browser cache refresh for testing files
if (typeof window !== "undefined") {
  const timestamp = Date.now();
  console.log(
    `🔄 Error utilities loaded at ${timestamp} - forcing refresh of validation cache`,
  );

  // Clear any cached validation results
  try {
    localStorage.removeItem("validationCache");
    localStorage.removeItem("lastValidationResults");
  } catch (e) {
    // Ignore localStorage errors
  }
}
