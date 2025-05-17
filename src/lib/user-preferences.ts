// User preferences service for Juris.AI
// Handles storing and retrieving user preferences like default jurisdiction

// Define the structure of user preferences
export interface UserPreferences {
  defaultJurisdiction?: string;
  // Add other preferences as needed
}

// Local storage key
const PREFERENCES_KEY = 'juris_ai_user_preferences';

// Get all user preferences
export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') {
    return {};
  }
  
  try {
    const storedPrefs = localStorage.getItem(PREFERENCES_KEY);
    return storedPrefs ? JSON.parse(storedPrefs) : {};
  } catch (error) {
    console.error('Error retrieving user preferences:', error);
    return {};
  }
}

// Save user preferences
export function saveUserPreferences(preferences: UserPreferences): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    const currentPrefs = getUserPreferences();
    const updatedPrefs = { ...currentPrefs, ...preferences };
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updatedPrefs));
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
}

// Get default jurisdiction
export function getDefaultJurisdiction(): string {
  const prefs = getUserPreferences();
  return prefs.defaultJurisdiction || 'us'; // Default to US if not set
}

// Save default jurisdiction
export function saveDefaultJurisdiction(jurisdiction: string): void {
  saveUserPreferences({ defaultJurisdiction: jurisdiction });
}
