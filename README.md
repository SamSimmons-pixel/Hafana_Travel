# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.



## DEPLOYMENTS
Berikut adalah panduan **lengkap & praktis** langkah demi langkah untuk mendeploy backend **Laravel** dan aplikasi mobile **React Native (Expo)** ke domain Anda **`mysitearea.com`** di SiteGround (cPanel / Site Tools):

---

## 🛠️ BAGIAN 1: PENYESUAIAN BACKEND (LARAVEL)

### 1. Buat Database MySQL & User di SiteGround
1. Masuk ke **Site Tools SiteGround** → **Database** → **MySQL**.
2. Buat database baru (misal: `mysitear_hafana`).
3. Buat user database baru & hubungkan dengan memberikan akses penuh (*All Privileges*).

---

### 2. Upload File Laravel ke Server
1. Upload folder `Hafana-Backend` ke server SiteGround (misal via FTP/File Manager ke folder `/home/customer/www/mysitearea.com/`).
2. **Arahkan Document Root ke Folder `public`**:
   - Di SiteGround Site Tools → **Domain** → **Web Space Settings**, ubah root domain mengarah ke folder `/public` Laravel (`/public_html/public` atau `/Hafana-Backend/public`).

---

### 3. Uji & Sesuaikan File `.env` Production
Buat/edit file `.env` di folder root Laravel server:

```env
APP_NAME="Hafana Travel"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://mysitearea.com

LOG_CHANNEL=daily

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mysitear_hafana
DB_USERNAME=mysitear_user
DB_PASSWORD=PasswordDatabaseAnda123!

SESSION_DRIVER=database
SESSION_LIFETIME=120
```

---

### 4. Buat Storage Symlink & Jalankan Migration (via SSH SiteGround)
Buka terminal **SSH SiteGround** atau gunakan fitur Terminal di Site Tools:

```bash
# 1. Jalankan migrasi database di produksi
php artisan migrate --force

# 2. Buat symlink storage agar foto paket/galeri dapat diakses publik
php artisan storage:link

# 3. Cache konfigurasi & route untuk kecepatan maksimum
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

### 5. Pasang SSL gratis (Let's Encrypt)
- Buka Site Tools SiteGround → **Security** → **SSL Manager**.
- Pilih domain `mysitearea.com` → Pilih **Let's Encrypt** → Klik **Get**.
- Aktifkan **HTTPS Enforce** agar semua lalu lintas otomatis menggunakan HTTPS yang aman.

---

## 📱 BAGIAN 2: PENYESUAIAN FRONTEND (REACT NATIVE / EXPO)

### 1. Ubah API URL ke Domain Production (`services/api.ts`)
Ganti IP lokal (`yourip:8000`) dengan URL HTTPS domain produksi Anda:

```typescript
// services/api.ts
export const LARAVEL_API_URL = 
  process.env.EXPO_PUBLIC_API_URL || 'https://mysitearea.com/api';
```

Atau buat file `.env` di root project React Native:
```env
EXPO_PUBLIC_API_URL=https://mysitearea.com/api
```

---

### 2. Build File Installer APK / AAB (Untuk Android & iOS)

Gunakan **EAS Build (Expo Application Services)** untuk menghasilkan file instalasi APK (Android) dan IPA (iOS):

1. **Install EAS CLI & Login**:
   ```bash
   npm install -g eas-cli
   eas login
   ```

2. **Konfigurasi Project**:
   ```bash
   eas build:configure
   ```

3. **Build APK Android** (dapat langsung diinstall di HP jemaah/test):
   ```bash
   eas build -p android --profile preview
   ```

4. **Build Rilis Toko Aplikasi (Google Playstore / App Store)**:
   ```bash
   eas build -p android --profile production
   eas build -p ios --profile production
   ```

---

### 📋 Checklists Penting Sebelum Launching:

| Komponen | Status | Keterangan |
|---|---|---|
| **HTTPS Domain** | 🔒 `https://mysitearea.com` | SSL Let's Encrypt aktif di SiteGround |
| **Laravel Storage** | 📁 `php artisan storage:link` | Supaya foto paket & galeri bisa diakses dari web/app |
| **Debug Mode** | ⚙️ `APP_DEBUG=false` | Mencegah bocornya data error teknis di server |
| **Mobile API Endpoint** | 🌐 `https://mysitearea.com/api` | API Client di React Native mengarah ke HTTPS |
