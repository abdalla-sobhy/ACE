export interface UserProfile {
  id: number;
  user_id: number;
  grade?: string;
  birth_date?: string;
  specialization?: string;
  years_of_experience?: string;
  children_count?: string;
  preferred_subjects?: string | null;
  goal?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  type: 'student' | 'university_student' | 'teacher' | 'parent' | 'company';
  profile?: UserProfile;
}

export interface AuthData {
  token: string;
  expiresAt: string;
  rememberMe: boolean;
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
}

export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authData');
    localStorage.removeItem('user');
    // Also remove cookie
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
}

export function getUser(): User | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function getAuthData(): AuthData | null {
  if (typeof window !== 'undefined') {
    const authStr = localStorage.getItem('authData');
    if (authStr) {
      try {
        return JSON.parse(authStr);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function isAuthenticated(): boolean {
  const authData = getAuthData();
  if (!authData) return false;
  
  const expiryDate = new Date(authData.expiresAt);
  return new Date() < expiryDate;
}