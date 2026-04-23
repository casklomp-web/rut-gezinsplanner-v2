/**
 * MVP Feature Flags
 * Control visibility of features without removing code
 */

export const MVP_FEATURES = {
  // Core MVP - always visible
  HOME: true,
  TODAY: true,
  WEEK: true,
  SHOPPING: true,
  TASKS: true,
  PROFILE: true,
  
  // Hidden in MVP but preserved
  RECIPES: false,
  HISTORY: false,
  DARK_MODE: false,
  VOICE_INPUT: false,
  PDF_EXPORT: false,
  SOCIAL_SHARE: false,
  SMART_SUGGESTIONS: false,
  PRICE_COMPARE: false,
  COLLABORATIVE: false,
  BARCODE_SCANNER: false,
  KEYBOARD_SHORTCUTS: false,
  EXPORT_IMPORT: false,
  MEAL_PREP_INDICATOR: true, // Keep this, it's useful
  
  // Simplified features
  NUTRITION_PANEL: 'minimal', // 'full' | 'minimal' | false
  RECIPE_EDITING: 'favorites_only', // 'full' | 'favorites_only' | false
} as const;

export type FeatureFlag = keyof typeof MVP_FEATURES;

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  const value = MVP_FEATURES[flag];
  return value === true || value === 'minimal' || value === 'favorites_only';
}

/**
 * Check if a feature is in minimal mode
 */
export function isFeatureMinimal(flag: FeatureFlag): boolean {
  return MVP_FEATURES[flag] === 'minimal';
}

/**
 * Get feature mode
 */
export function getFeatureMode(flag: FeatureFlag): string | boolean {
  return MVP_FEATURES[flag];
}
