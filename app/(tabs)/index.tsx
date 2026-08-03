/**
 * Home Screen — app/(tabs)/index.tsx
 *
 * 🎓 LESSON: This file = your routes/web.php + HomeController + home.blade.php
 *
 * Because Expo Router is FILE-BASED (like Laravel, but even simpler):
 *   - This file lives at:  app/(tabs)/index.tsx
 *   - It maps to the URL:  / (the root tab)
 *
 * In Laravel:
 *   Route::get('/', [HomeController::class, 'index']); → home.blade.php
 *
 * In Expo Router:
 *   The file itself IS the route. No route file needed!
 */

// ─────────────────────────────────────────────
// 🎓 LESSON: Imports = PHP `use` statements
//
// In Laravel:
//   use App\Models\Destination;
//   use App\Http\Controllers\Controller;
//
// In React Native:
//   import { View, Text } from 'react-native';  ← from npm package
//   import DestinationCard from '@/components/destination-card'; ← our own file
//
// The `@/` prefix = the root of the project (configured in tsconfig.json)
// Same as Laravel's App\ namespace prefix!
// ─────────────────────────────────────────────
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import DestinationCard from '@/components/destination-card';

// ─────────────────────────────────────────────
// 🎓 LESSON: Data = Your Eloquent Collection / JSON Response
//
// In a real app, this would come from an API (like your Laravel API).
// For now, we hard-code it — same as returning a static array from a controller:
//
// Laravel:  return view('home', ['destinations' => Destination::all()]);
// React:    const destinations = [...]; (data defined locally for now)
// ─────────────────────────────────────────────
const destinations = [
  {
    id: 1,
    name: 'Bali',
    country: 'Indonesia',
    price: 1200,
    rating: 4.9,
    duration: '7 Days',
    image: require('@/assets/images/bali.png'),
  },
  {
    id: 2,
    name: 'Paris',
    country: 'France',
    price: 2500,
    rating: 4.7,
    duration: '5 Days',
    image: require('@/assets/images/paris.png'),
  },
  {
    id: 3,
    name: 'Maldives',
    country: 'Maldives',
    price: 3800,
    rating: 5.0,
    duration: '10 Days',
    image: require('@/assets/images/maldives.png'),
  },
];

// Category filter data
const categories = ['All', 'Beach', 'Mountain', 'City', 'Cultural'];

// ─────────────────────────────────────────────
// 🎓 LESSON: The Screen Component = Controller Method + View
//
// In Laravel, your HomeController@index does:
//   1. Fetches data
//   2. Returns a view with that data
//
// In React Native, the component does:
//   1. Holds state (like session/request data)
//   2. Returns JSX (the visual output)
// ─────────────────────────────────────────────
export default function HomeScreen() {

  // ─────────────────────────────────────────────
  // 🎓 LESSON: useState = A reactive PHP variable
  //
  // In PHP/Blade:
  //   $activeCategory = 'All';
  //   // But changing it doesn't update the UI automatically!
  //
  // In React:
  //   const [activeCategory, setActiveCategory] = useState('All');
  //   // When you call setActiveCategory('Beach'), the UI AUTOMATICALLY re-renders!
  //   // This is React's superpower — no page refresh needed (like Vue/Alpine.js)
  //
  // Syntax: const [value, setter] = useState(initialValue);
  //   - value: read the current state (like echo $activeCategory)
  //   - setter: change the state  (like $activeCategory = 'Beach')
  // ─────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* Hide status bar or style it */}
      <StatusBar barStyle="light-content" backgroundColor="#0a0a1a" />

      {/* 🎓 ScrollView = <div style="overflow-y: scroll"> in HTML/CSS */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View>
            {/* 🎓 JSX Text — All text MUST be wrapped in <Text>. No loose strings! */}
            <Text style={styles.greeting}>Good Morning 👋</Text>
            <Text style={styles.headerTitle}>Where to next?</Text>
          </View>
          {/* Avatar circle */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AB</Text>
          </View>
        </View>

        {/* ── SEARCH BAR ── */}
        {/*
          🎓 LESSON: TextInput = <input type="text"> in HTML
          The `value` and `onChangeText` = v-model in Vue / wire:model in Livewire
          When user types, setSearchQuery runs → searchQuery updates → UI re-renders
        */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search destinations..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}  // Called on every keystroke
          />
        </View>

        {/* ── CATEGORY FILTERS ── */}
        {/*
          🎓 LESSON: Horizontal ScrollView = overflow-x: scroll in CSS
          The `horizontal` prop makes it scroll left/right
        */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {/*
            🎓 LESSON: .map() = @foreach in Blade
            In Blade:
              @foreach($categories as $category)
                <button>{{ $category }}</button>
              @endforeach

            In React:
              {categories.map((category) => (
                <TouchableOpacity key={...}>
                  <Text>{category}</Text>
                </TouchableOpacity>
              ))}

            ⚠️ The `key` prop is REQUIRED in lists — like a unique ID for each item.
            In Blade you'd use $loop->index, here use the item itself or its id.
          */}
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                // 🎓 Conditional styling — like @class(['active' => $activeCategory === $category])
                activeCategory === category && styles.categoryChipActive,
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── FEATURED DESTINATIONS ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✈️ Featured Destinations</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {/*
            🎓 Horizontal card list — scrolls left/right like a carousel
            This ScrollView wraps our DestinationCard components
          */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsContainer}
          >
            {/*
              🎓 LESSON: Rendering a list of components with .map()
              Each item in `destinations` array gets its own <DestinationCard />
              
              This is like:
                @foreach($destinations as $destination)
                  <x-destination-card
                    :name="$destination['name']"
                    :price="$destination['price']"
                    ...
                  />
                @endforeach
            */}
            {destinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                name={destination.name}
                country={destination.country}
                price={destination.price}
                rating={destination.rating}
                duration={destination.duration}
                image={destination.image}
                onPress={() => alert(`You tapped on ${destination.name}!`)}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── POPULAR SECTION ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Most Popular</Text>
          <View style={styles.popularGrid}>
            {destinations.slice(0, 2).map((dest) => (
              <TouchableOpacity key={dest.id} style={styles.popularCard}>
                <View style={styles.popularInfo}>
                  <Text style={styles.popularName}>{dest.name}</Text>
                  <Text style={styles.popularCountry}>{dest.country}</Text>
                </View>
                <Text style={styles.popularPrice}>${dest.price.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// 🎓 STYLES — Your CSS (Scoped to this component only)
// Rule: camelCase, numbers instead of px, flexbox everywhere
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,                      // Fill the whole screen (like height: 100vh)
    backgroundColor: '#0a0a1a',   // Deep dark navy — our app's bg color
  },
  scrollContent: {
    paddingBottom: 32,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginBottom: 4,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(108, 99, 255, 0.5)',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 24,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 24,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  // Categories
  categoriesContainer: {
    marginBottom: 28,
  },
  categoriesContent: {
    paddingHorizontal: 24,
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  categoryChipActive: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  categoryText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  // Sections
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  seeAll: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: '600',
  },
  cardsContainer: {
    paddingHorizontal: 24,
  },
  // Popular
  popularGrid: {
    paddingHorizontal: 24,
    gap: 12,
  },
  popularCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
  },
  popularInfo: {
    gap: 2,
  },
  popularName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  popularCountry: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  popularPrice: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '800',
  },
});
