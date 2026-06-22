RoboHub 🤖
Aplikasi Eksplorasi Repository Robotika Open-Source berbasis Mobile Computing
Aplikasi RoboHub adalah platform mobile untuk menjelajahi, mencari, dan menyimpan repository bertema robotika dari GitHub secara real-time. Aplikasi ini dibangun menggunakan React Native (Expo), mengintegrasikan Firebase Authentication & Cloud Firestore sebagai layanan backend, dan Axios untuk mengambil data dari API publik GitHub (sesuai materi Modul 5).
---
👥 Anggota Tim & Tabel Pembagian Tugas
Nama Tim: (RoboHub)
Nama Anggota	Job Desk / Pembagian Tugas
[Kelvin Bintang Mahardhika]	Frontend & Axios Specialist:<br>• Merancang seluruh tampilan antarmuka (UI/UX) aplikasi agar responsif dan intuitif.<br>• Bertanggung jawab penuh atas integrasi library Axios untuk komunikasi dengan GitHub REST API.<br>• Mengimplementasikan fitur pencarian repository (`HomeScreen.js`) dan halaman detail repository (`DetailScreen.js`).
[Raihan Saputra]	Backend, State & Firebase Specialist:<br>• Mengatur logika state aplikasi dan penyimpanan data lokal di perangkat menggunakan AsyncStorage.<br>• Bertanggung jawab penuh atas seluruh integrasi layanan Firebase (Authentication & Cloud Firestore).<br>• Mengimplementasikan sistem Login/Register, penyimpanan favorit dengan catatan pribadi (CRUD Firestore), dan manajemen sesi pengguna via `AuthContext.js`.
---
🛠️ Fitur Utama Aplikasi
Cari & Jelajahi Repository Robotika: Mencari repository open-source bertema robotika dari GitHub secara real-time menggunakan Axios ke GitHub Search API, menampilkan nama, deskripsi, jumlah ⭐ star, dan bahasa pemrograman.
Login & Register Akun: Sistem autentikasi pengguna menggunakan Firebase Authentication (Email/Password), dengan manajemen sesi otomatis via `onAuthStateChanged` — navigasi berpindah otomatis tanpa kode manual saat status login berubah.
Simpan Favorit & Catatan Pribadi: Pengguna dapat menyimpan repository pilihan beserta catatan pribadi ke Cloud Firestore (CRUD), data tampil secara realtime menggunakan `onSnapshot` dan dapat dihapus kapan saja.
---
🌐 Daftar API yang Digunakan
1. GitHub REST API (via Axios)
Endpoint	Metode	Fungsi
`https://api.github.com/search/repositories?q={keyword}&sort=stars`	`GET`	Mengambil daftar repository berdasarkan kata kunci pencarian, diurutkan berdasarkan jumlah star
2. Firebase Authentication
Layanan	Fungsi
`signInWithEmailAndPassword`	Login pengguna dengan email & password
`createUserWithEmailAndPassword`	Registrasi akun baru
`onAuthStateChanged`	Memantau perubahan status login secara realtime
`signOut`	Logout pengguna
3. Cloud Firestore
Collection	Metode	Fungsi
`savedRepos`	`addDoc`	Menyimpan repository favorit beserta catatan
`savedRepos`	`onSnapshot`	Membaca data favorit secara realtime
`savedRepos`	`deleteDoc`	Menghapus repository dari daftar favorit
---
📂 Struktur Folder
```
RoboHub/
├── App.js                  # Entry point, navigasi utama & logika auth
├── firebaseConfig.js       # Konfigurasi & inisialisasi Firebase SDK
├── context/
│   └── AuthContext.js      # Global state management untuk autentikasi
└── screens/
    ├── LoginScreen.js      # Halaman login
    ├── RegisterScreen.js   # Halaman registrasi akun baru
    ├── HomeScreen.js       # Halaman utama pencarian repository (Axios)
    ├── DetailScreen.js     # Halaman detail repo + simpan favorit
    └── SavedScreen.js      # Halaman favorit (Firestore) & riwayat (AsyncStorage)
```
---
🚀 Cara Menjalankan Project
Clone repository ini
Install dependencies:
```bash
   npm install
   ```
Buat project di Firebase Console, aktifkan Authentication (Email/Password) dan Firestore Database, lalu isi kredensial di `firebaseConfig.js`
Jalankan project:
```bash
   npx expo start
   ```
Scan QR code menggunakan aplikasi Expo Go di HP
---
🔧 Tech Stack
Teknologi	Versi	Fungsi
React Native (Expo)	SDK 56	Framework utama aplikasi mobile
Axios	Latest	HTTP request ke GitHub API
Firebase Authentication	v10+	Autentikasi pengguna
Cloud Firestore	v10+	Database cloud realtime
AsyncStorage	Latest	Penyimpanan data lokal di perangkat
React Navigation	v6	Navigasi antar halaman
