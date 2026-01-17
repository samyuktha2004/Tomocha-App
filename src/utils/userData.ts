/**
 * User Data Utility
 * Provides consistent access to user data across the app
 * with comforting placeholders for guest users or missing data
 */

export interface UserData {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  medicalConditions?: string;
  medications?: string;
  allergies?: string;
  therapist?: {
    name: string;
    phone: string;
  };
  primaryCareProvider?: string;
  emergencyContacts?: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
  isGuest?: boolean;
  createdAt: string;
}

/**
 * Get user data from localStorage
 * Returns null if no user data exists
 */
export function getUserData(): UserData | null {
  const userDataStr = localStorage.getItem('tomochaUser');
  if (!userDataStr) return null;
  
  try {
    return JSON.parse(userDataStr);
  } catch (e) {
    console.error('Failed to parse user data:', e);
    return null;
  }
}

/**
 * Save user data to localStorage
 */
export function saveUserData(userData: UserData): void {
  localStorage.setItem('tomochaUser', JSON.stringify(userData));
}

/**
 * Update specific user data fields
 */
export function updateUserData(updates: Partial<UserData>): void {
  const currentData = getUserData();
  if (currentData) {
    const updatedData = { ...currentData, ...updates };
    saveUserData(updatedData);
  }
}

/**
 * Get user's first name with comforting placeholder
 * Returns "Friend" for guest users or when name is missing
 */
export function getUserFirstName(): string {
  // First check individual firstName in localStorage (from account settings)
  const savedFirstName = localStorage.getItem('userFirstName');
  if (savedFirstName) return savedFirstName;
  
  // Then check user data object
  const userData = getUserData();
  if (!userData) return 'Friend';
  
  // Guest user
  if (userData.isGuest) return 'Friend';
  
  // Check firstName field
  if (userData.firstName) return userData.firstName;
  
  // Try to extract from name field
  if (userData.name && userData.name !== 'Guest') {
    const firstName = userData.name.split(' ')[0];
    return firstName || 'Friend';
  }
  
  return 'Friend';
}

/**
 * Get user's full name with comforting placeholder
 * Returns "Friend" for guest users or when name is missing
 */
export function getUserFullName(): string {
  const userData = getUserData();
  if (!userData) return 'Friend';
  
  // Guest user
  if (userData.isGuest) return 'Friend';
  
  // Check if we have both first and last name
  if (userData.firstName && userData.lastName) {
    return `${userData.firstName} ${userData.lastName}`;
  }
  
  // Check name field
  if (userData.name && userData.name !== 'Guest') {
    return userData.name;
  }
  
  return 'Friend';
}

/**
 * Check if user is a guest
 */
export function isGuestUser(): boolean {
  const userData = getUserData();
  return userData?.isGuest === true;
}

/**
 * Get field with placeholder
 * Returns a comforting placeholder if the field is empty
 */
export function getFieldWithPlaceholder(
  field: string | undefined | null, 
  placeholder: string
): string {
  if (!field || field.trim() === '') {
    return placeholder;
  }
  return field;
}

/**
 * Get user's profile avatar
 * Returns empty string if not set
 */
export function getProfileAvatar(): string {
  return localStorage.getItem('profileAvatar') || '';
}

/**
 * Save user's profile avatar
 */
export function saveProfileAvatar(avatar: string): void {
  localStorage.setItem('profileAvatar', avatar);
}

/**
 * Get user's theme preference
 */
export function getTheme(): 'light' | 'dark' {
  return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
}

/**
 * Save user's theme preference
 */
export function saveTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem('theme', theme);
}