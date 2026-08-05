/**
 * Login & Register Screen — app/login.tsx
 * 
 * 🎓 LESSON: This handles Authentication Forms & Submission
 * Laravel equivalent: LoginController / RegisterController + Blade view
 */

import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth';

export default function LoginScreen() {
  const router = useRouter();

  const [nomor_visa, setnomor_visa] = useState<string>('');
  const [tanggal_lahir, setTanggal_lahir] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { signIn } = useAuth();

  const handleLogin = async (): Promise<void> => {
      try {
        await signIn(nomor_visa, tanggal_lahir);
      } catch (err) {
        setError('Invalid email or password.');
      }
    };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        {/* Header Title */}
        <Text style={styles.brandTitle}>✈️ Hafana Travel</Text>

        {/* nomor_visa Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>nomor_visa</Text>
          <TextInput
            style={styles.input}
            value={nomor_visa}
            onChangeText={setnomor_visa}
            placeholder="219219"
            placeholderTextColor="rgba(255,255,255,0.4)"
            keyboardType="number-pad"
            autoCapitalize="none"
          />
        </View>

        {/* tanggal_lahir Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>tanggal_lahir</Text>
          <TextInput
            style={styles.input}
            value={tanggal_lahir}
            onChangeText={setTanggal_lahir}
            placeholder="••••••••"
            placeholderTextColor="rgba(255,255,255,0.4)"
            keyboardType="number-pad"
            secureTextEntry
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Sign In
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  brandTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 28,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  toggleContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: '600',
  },
});
