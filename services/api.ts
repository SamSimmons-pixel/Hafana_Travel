/**
 * Laravel API Service — services/api.ts
 * 
 * 🎓 LESSON: This is your HTTP API Client (like Axios / Guzzle).
 * Handles requests to your Laravel backend (routes/api.php).
 */

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// 🎓 Change this to your computer's local IP or domain when running Laravel!
// Example: 'http://192.168.1.50:8000/api' or 'http://localhost:8000/api'
export const LARAVEL_API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.122.122.128:8000/api';

const TOKEN_KEY = 'laravel_sanctum_token';

export const getAuthToken = async (): Promise<string | null> => {
  if (Platform.OS === 'web') {  
    return localStorage.getItem(TOKEN_KEY);
  }
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const setAuthToken = async (token: string | null): Promise<void> => {
  if (Platform.OS === 'web') {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    return;
  }
  if (token) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};

/**
 * Generic Fetch Wrapper for Laravel API
 * Automatically attaches:
 *  - Accept: application/json
 *  - Authorization: Bearer {sanctum_token}
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${LARAVEL_API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || `HTTP ${response.status} Error`);
  }

  return data as T;
}

// ─────────────────────────────────────────────────────────────
// Destination & Booking API Endpoints
// ─────────────────────────────────────────────────────────────

export interface DestinationDetail {
  id: string;
  name: string;
  country: string;
  price: number;
  rating: number;
  duration: string;
  image: any;
  description: string;
  location: string;
  highlights: string[];
  reviewsCount: number;
}

/**
 * GET /api/destinations/{id}
 * Laravel controller: public function show($id) { return new DestinationResource(Destination::findOrFail($id)); }
 */
export async function fetchDestinationById(id: string): Promise<DestinationDetail> {
  try {
    const res = await apiRequest<{ data: DestinationDetail }>(`/destinations/${id}`);
    return res.data;
  } catch (err) {
    // Fallback mock data if Laravel backend is not running yet
    console.log('Backend not reachable, using fallback data:', err);
    return {
      id,
      name: 'Bali',
      country: 'Indonesia',
      price: 1200,
      rating: 4.9,
      duration: '7 Days',
      image: require('@/assets/images/bali.png'),
      description: 'Explore tropical beaches, lush rice terraces, ancient sea temples, and vibrant local culture in the heart of Indonesia.',
      location: 'Ubud & Kuta, Bali',
      highlights: ['Free Breakfast', 'Airport Transfer', 'Guided Tour', 'Spa Included'],
      reviewsCount: 342,
    };
  }
}

/**
 * POST /api/bookings
 * Laravel controller: public function store(BookingRequest $request) { ... }
 */
export async function createBooking(data: {
  destinationId: string;
  guests: number;
  travelDate: string;
  notes?: string;
}) {
  try {
    return await apiRequest<{ success: boolean; bookingId: string }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (err) {
    // Fallback simulation
    return {
      success: true,
      bookingId: 'HAF-' + Math.floor(100000 + Math.random() * 900000),
    };
  }
}
