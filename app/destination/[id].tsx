/**
 * Destination Detail Screen — app/destination/[id].tsx
 * 
 * 🎓 LESSON: Dynamic Routing + API Fetching + Form Management
 * 
 * 1. Expo Router matching:
 *    File path: app/destination/[id].tsx
 *    Laravel equivalent: Route::get('/destination/{id}', [DestinationController::class, 'show']);
 * 
 * 2. Route parameters:
 *    const { id } = useLocalSearchParams();
 *    Laravel equivalent: public function show($id) { ... }
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBooking, DestinationDetail, fetchDestinationById } from '@/services/api';

export default function DestinationDetailScreen() {
  const router = useRouter(); // 🎓 Equivalent to Laravel redirect() helper
  const { id } = useLocalSearchParams<{ id: string }>(); // 🎓 Get route parameter

  // ─────────────────────────────────────────────────────────────
  // 🎓 LESSON 1: Component State Management (useState)
  // Like Livewire public properties:
  //   public $destination = null;
  //   public $loading = true;
  //   public $guests = 1;
  // ─────────────────────────────────────────────────────────────
  const [destination, setDestination] = useState<DestinationDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form states (Livewire form properties)
  const [guests, setGuests] = useState<number>(1);
  const [travelDate, setTravelDate] = useState<string>('2026-09-15');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // ─────────────────────────────────────────────────────────────
  // 🎓 LESSON 2: Lifecycle Hook (useEffect)
  //
  // In Laravel/Livewire:
  //   public function mount($id) { $this->loadData($id); }
  //
  // In React:
  //   useEffect(() => { ... }, [id]);
  //   - Runs automatically when component mounts (loads).
  //   - The dependency array `[id]` means "re-run if route `id` changes".
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadDestination() {
      try {
        setLoading(true);
        setError(null);
        if (id) {
          const data = await fetchDestinationById(id);
          setDestination(data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load destination');
      } finally {
        setLoading(false); // Done loading
      }
    }

    loadDestination();
  }, [id]);

  // ─────────────────────────────────────────────────────────────
  // 🎓 LESSON 3: Form Handler / Submit Method
  //
  // In Livewire:
  //   public function bookNow() { $this->validate(); ... }
  // ─────────────────────────────────────────────────────────────
  const handleBookingSubmit = async () => {
    if (!destination) return;

    if (guests < 1) {
      Alert.alert('Validation Error', 'Please select at least 1 guest');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await createBooking({
        destinationId: destination.id,
        guests,
        travelDate,
        notes,
      });

      if (result.success) {
        Alert.alert(
          '🎉 Booking Confirmed!',
          `Your booking code is ${result.bookingId}. Total: $${(destination.price * guests).toLocaleString()}`,
          [
            {
              text: 'Back to Home',
              onPress: () => router.back(), // Navigate back
            },
          ]
        );
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to process booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render Loading State ──
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Fetching destination details...</Text>
      </View>
    );
  }

  // ── Render Error State ──
  if (error || !destination) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>⚠️ {error || 'Destination not found'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Render Full Detail & Booking Screen ──
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image with Back Button */}
        <View style={styles.imageContainer}>
          <Image source={destination.image} style={styles.heroImage} />
          <TouchableOpacity style={styles.floatingBackButton} onPress={() => router.back()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Destination Header Info */}
        <View style={styles.detailsSection}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>{destination.name}</Text>
              <Text style={styles.location}>📍 {destination.location}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ {destination.rating}</Text>
              <Text style={styles.reviewsText}>({destination.reviewsCount})</Text>
            </View>
          </View>

          <Text style={styles.sectionHeader}>Overview</Text>
          <Text style={styles.description}>{destination.description}</Text>

          {/* Highlights Pills */}
          <Text style={styles.sectionHeader}>Package Highlights</Text>
          <View style={styles.highlightsContainer}>
            {destination.highlights.map((item, idx) => (
              <View key={idx} style={styles.highlightChip}>
                <Text style={styles.highlightText}>✓ {item}</Text>
              </View>
            ))}
          </View>

          {/* ─────────────────────────────────────────────────────────────
              🎓 LESSON 4: Booking Form (Livewire equivalent form)
             ───────────────────────────────────────────────────────────── */}
          <View style={styles.cardForm}>
            <Text style={styles.formTitle}>🎟️ Book Your Trip</Text>

            {/* Guest Counter */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Number of Guests</Text>
              <View style={styles.counterRow}>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setGuests(Math.max(1, guests - 1))}
                >
                  <Text style={styles.counterBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{guests} Person(s)</Text>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setGuests(guests + 1)}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Travel Date Input */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Travel Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={travelDate}
                onChangeText={setTravelDate}
                placeholder="2026-09-15"
                placeholderTextColor="rgba(255,255,255,0.4)"
              />
            </View>

            {/* Notes / Special Requests */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Special Requests (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="e.g. Vegetarian meal, Honeymoon setup..."
                placeholderTextColor="rgba(255,255,255,0.4)"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Price Total Summary */}
            <View style={styles.totalRow}>
              <View>
                <Text style={styles.totalLabel}>Total Price</Text>
                <Text style={styles.totalPrice}>
                  ${(destination.price * guests).toLocaleString()}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.bookBtn, isSubmitting && styles.bookBtnDisabled]}
                onPress={handleBookingSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.bookBtnText}>Confirm & Pay</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0a0a1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 16,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  floatingBackButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailsSection: {
    padding: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
  },
  location: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 4,
  },
  ratingBadge: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingText: {
    color: '#FFD700',
    fontWeight: '700',
    fontSize: 14,
  },
  reviewsText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
  },
  sectionHeader: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 22,
  },
  highlightsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  highlightChip: {
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    borderWidth: 1,
    borderColor: '#6C63FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  highlightText: {
    color: '#fff',
    fontSize: 12,
  },
  cardForm: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  formTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    fontSize: 14,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  counterBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  counterValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  totalLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  totalPrice: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: '800',
  },
  bookBtn: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  bookBtnDisabled: {
    opacity: 0.6,
  },
  bookBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
