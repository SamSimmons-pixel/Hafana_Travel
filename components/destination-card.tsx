/**
 * DestinationCard Component
 *
 * 🎓 LESSON: Think of this like a Laravel Blade Component
 *
 * In Laravel:
 *   php artisan make:component DestinationCard
 *   → Creates: app/View/Components/DestinationCard.php  (the logic)
 *   → Creates: resources/views/components/destination-card.blade.php (the template)
 *
 * In React Native:
 *   → This ONE file is BOTH the logic AND the template.
 *   → The function at the bottom = the PHP class (receives "props" like $variables)
 *   → The `return (...)` block = the Blade template
 */

import { Image, ImageSourcePropType } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// ─────────────────────────────────────────────
// 🎓 LESSON: TypeScript Interface = PHP DocBlock / Eloquent $fillable
//
// In Laravel:
//   protected $fillable = ['name', 'country', 'price', 'rating', 'image'];
//
// In React Native (TypeScript):
//   We define what "props" (= $variables passed from parent) this component accepts.
// ─────────────────────────────────────────────
interface DestinationCardProps {
  name: string;         // The destination name (e.g. "Bali")
  country: string;      // The country (e.g. "Indonesia")
  price: number;        // Price in USD
  rating: number;       // Rating out of 5
  duration: string;     // Trip duration (e.g. "7 Days")
  image: ImageSourcePropType; // The image source (like a local require() path)
  onPress?: () => void; // Optional: what happens when card is tapped
                        // (like @click in a Blade template)
}

// ─────────────────────────────────────────────
// 🎓 LESSON: The Component Function = Your Blade Component Class + Template
//
// In Laravel:
//   <x-destination-card :name="$destination->name" :price="$destination->price" />
//
// In React Native:
//   <DestinationCard name="Bali" price={1200} ... />
//
// The `{ name, country, price, rating, duration, image, onPress }` = destructuring props
// Same as: $name = $props['name']; $price = $props['price']; in PHP
// ─────────────────────────────────────────────
export default function DestinationCard({
  name,
  country,
  price,
  rating,
  duration,
  image,
  onPress,
}: DestinationCardProps) {

  // 🎓 Render stars — this is like a @for loop in Blade
  // In Blade: @for($i = 0; $i < $rating; $i++) ⭐ @endfor
  // In React: We use a JS expression inside JSX
  const renderStars = (count: number) => {
    return '⭐'.repeat(Math.floor(count));
  };

  // ─────────────────────────────────────────────
  // 🎓 LESSON: The `return (...)` block = Your Blade Template
  //
  // In Blade:    {{ $name }}     → Echoes a variable
  // In JSX:      {name}          → Same thing!
  //
  // In Blade:    <div class="card">
  // In RN JSX:   <View style={styles.card}>   (No div! No class! Uses style objects)
  //
  // Key Rule: In React Native there is NO HTML.
  //   <div>  → <View>    (layout container)
  //   <p>    → <Text>    (ALL text MUST be in <Text>)
  //   <img>  → <Image>   (images)
  //   <button> → <TouchableOpacity> (tappable element)
  // ─────────────────────────────────────────────
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>

      {/* The Card Image — like <img src="{{ $image }}"> in Blade */}
      <Image source={image} style={styles.image} resizeMode="cover" />

      {/* Gradient overlay for text readability */}
      <View style={styles.overlay} />

      {/* Duration badge — top right */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{duration}</Text>
      </View>

      {/* Card Content at the bottom */}
      <View style={styles.content}>

        {/* Destination Name — like <h2>{{ $name }}</h2> */}
        <Text style={styles.name}>{name}</Text>

        {/* Country — like <p class="country">{{ $country }}</p> */}
        <Text style={styles.country}>📍 {country}</Text>

        {/* Footer row: rating + price */}
        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            <Text style={styles.stars}>{renderStars(rating)}</Text>
            {/* 🎓 Template expressions: {rating.toFixed(1)} = {{ number_format($rating, 1) }} */}
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>From</Text>
            {/* 🎓 {price.toLocaleString()} = number_format($price) in PHP */}
            <Text style={styles.price}>${price.toLocaleString()}</Text>
          </View>
        </View>

      </View>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────
// 🎓 LESSON: StyleSheet.create = Your CSS File
//
// In Laravel/Blade, you'd link a CSS file:
//   <link rel="stylesheet" href="/css/destination-card.css">
//
// In React Native, styles live IN the component file (like Tailwind inline, but structured).
//
// Blade CSS:              React Native StyleSheet:
//   .card {                 card: {
//     border-radius: 16px;    borderRadius: 16,   ← No px! Numbers only
//     background: #fff;       backgroundColor: '#fff', ← camelCase!
//   }                       },
//
// Key differences from CSS:
//   1. camelCase: background-color → backgroundColor
//   2. No units: use numbers, not '16px'
//   3. Flexbox by default (like display:flex on everything)
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    width: 280,
    height: 360,
    borderRadius: 20,
    overflow: 'hidden',           // Like CSS overflow: hidden
    marginRight: 16,
    backgroundColor: '#1a1a2e',
    // Shadow (iOS) — CSS: box-shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    // Shadow (Android) — separate property!
    elevation: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',         // Like CSS position: absolute
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    // Gradient effect using a semi-transparent dark overlay
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  badge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backdropFilter: 'blur(10px)',  // Glassmorphism
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
  },
  name: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  country: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',         // Like CSS display:flex; flex-direction: row
    justifyContent: 'space-between', // Like CSS justify-content: space-between
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stars: {
    fontSize: 12,
  },
  ratingText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
  },
  price: {
    color: '#FFD700',              // Gold color for price
    fontSize: 18,
    fontWeight: '800',
  },
});
