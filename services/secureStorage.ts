// services/secureStorage.ts
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const saveToken = async (token: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem('auth_token', token); // not encrypted, but web has no keychain anyway
  } else {
    await SecureStore.setItemAsync('auth_token', token);
  }
};

export const getToken = async (): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return localStorage.getItem('auth_token');
  }
  return await SecureStore.getItemAsync('auth_token');
};

export const deleteToken = async () => {
  if (Platform.OS === 'web') {
    localStorage.removeItem('auth_token');
  } else {
    await SecureStore.deleteItemAsync('auth_token');
  }
};