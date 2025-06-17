/**
 * Utility functions for generating and handling slugs
 */

/**
 * Generates a URL-friendly slug from a given string
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  return (
    text
      .toLowerCase()
      .trim()
      // Replace spaces with hyphens
      .replace(/\s+/g, "-")
      // Remove special characters except hyphens
      .replace(/[^\w\-]+/g, "")
      // Replace multiple hyphens with single hyphen
      .replace(/\-\-+/g, "-")
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, "")
  );
}

/**
 * Generates a business slug from business name
 * @param businessName - The business name
 * @returns A slug suitable for businesses
 */
export function generateBusinessSlug(businessName: string): string {
  const baseSlug = generateSlug(businessName);

  // If empty after processing, provide a fallback
  if (!baseSlug) {
    return "business";
  }

  return baseSlug;
}

/**
 * Generates a unique slug by appending a random suffix if needed
 * @param baseSlug - The base slug
 * @param existingSlugs - Array of existing slugs to avoid duplicates
 * @returns A unique slug
 */
export function generateUniqueSlug(
  baseSlug: string,
  existingSlugs: string[] = [],
): string {
  let uniqueSlug = baseSlug;
  let counter = 1;

  // Check if slug already exists and increment until unique
  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

/**
 * Validates if a slug is valid
 * @param slug - The slug to validate
 * @returns Boolean indicating if slug is valid
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== "string") {
    return false;
  }

  // Must contain only lowercase letters, numbers, and hyphens
  // Cannot start or end with hyphen
  // Cannot contain consecutive hyphens
  const slugRegex = /^[a-z0-9]([a-z0-9\-]*[a-z0-9])?$/;

  return slugRegex.test(slug) && slug.length >= 1 && slug.length <= 100;
}

/**
 * Cleans and fixes an existing slug
 * @param slug - The slug to clean
 * @returns A cleaned, valid slug
 */
export function cleanSlug(slug: string): string {
  if (!slug) {
    return "";
  }

  return generateSlug(slug);
}
