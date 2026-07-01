# 🛠️ Panduan Setup — Item Manager

Panduan langkah demi langkah untuk pasang & jalankan sistem ni dari awal.
Stack: **Laravel (backend) + Vue 3 (frontend) + PostgreSQL (database)**.

---

## 0. Apa yang perlu ada dulu

| Perisian | Versi | Nota |
|---|---|---|
| **PHP** | **8.3** | Laragon dah ada di `C:\laragon\bin\php\php-8.3.10` |
| **Composer** | 2.x | Pengurus pakej PHP |
| **Node.js** | 20.19+ atau 22.12+ | Untuk frontend (Vue) |
| **PostgreSQL** | 14+ | Laragon dah ada |

---

## 1. Pastikan PostgreSQL berjalan

Buka **Laragon** → klik **Start All**. Pastikan PostgreSQL hijau/aktif.

Nak semak ia hidup (port 5432):
```bash
C:\laragon\bin\postgresql\postgresql-14.5-1\bin\pg_isready
```
Patut keluar: `accepting connections` ✅

---

## 2. Pasang "kebergantungan" (dependencies)

Buka terminal dalam folder projek (`c:\laragon\www\mini-project`), kemudian:

**a) Pakej PHP (backend):**
```bash
C:\laragon\bin\php\php-8.3.10\php.exe C:\laragon\bin\composer\composer.phar install
```

**b) Pakej JavaScript (frontend):**
```bash
npm install
```

> 🐛 **Kalau `npm install` error pasal "rolldown binding" / file `.node` hilang**, jalankan ni:
> ```bash
> npm install @rolldown/binding-win32-x64-msvc --no-save
> ```
> (Ini bug kecil npm di Windows — pakej native tak terpasang automatik.)

---

## 3. Sediakan fail `.env` (konfigurasi)

Kalau fail `.env` belum wujud, salin daripada contoh:
```bash
copy .env.example .env
```

Kemudian buka `.env`, pastikan bahagian database macam ni:
```dotenv
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=mini_project
DB_USERNAME=postgres
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=127.0.0.1:8000,localhost:8000,127.0.0.1,localhost
```

> Laragon set PostgreSQL guna mod `trust`, jadi `DB_PASSWORD` boleh dibiar **kosong**.

Jana kunci aplikasi (sekali sahaja):
```bash
C:\laragon\bin\php\php-8.3.10\php.exe artisan key:generate
```

---

## 4. Cipta pangkalan data

```bash
C:\laragon\bin\postgresql\postgresql-14.5-1\bin\psql -U postgres -h 127.0.0.1 -c "CREATE DATABASE mini_project;"
```
> Kalau dah wujud, ia akan kata "already exists" — takpe, abaikan.

---

## 5. Bina jadual + isi data contoh

```bash
C:\laragon\bin\php\php-8.3.10\php.exe artisan migrate --seed
```

Ini akan:
- Cipta semua jadual (`items`, `users`, `sessions`, dll.)
- Masukkan **6 item contoh** + **2 akaun demo**

Bina fail frontend (CSS/JS):
```bash
npm run build
```

---

## 6. ▶️ Jalankan sistem

**Cara senang:** klik dua kali fail **`start-dev.bat`** — ia buka dua tetingkap automatik.

**Atau** buka **dua terminal**:

Terminal 1 (frontend):
```bash
npm run dev
```

Terminal 2 (backend):
```bash
C:\laragon\bin\php\php-8.3.10\php.exe artisan serve
```

Kemudian buka pelayar:

### 👉 http://127.0.0.1:8000

---

## 7. Log masuk

| Peranan | Email | Password |
|---|---|---|
| **Admin** (nampak menu *Users*) | `admin@example.com` | `password` |
| **User biasa** | `user@example.com` | `password` |

Atau klik **"Create one"** untuk daftar akaun baru sendiri.

---

## ❓ Masalah biasa & penyelesaian

| Masalah | Sebab | Penyelesaian |
|---|---|---|
| `SQLSTATE... could not connect` | Postgres tak hidup | Start PostgreSQL dalam Laragon |
| Skrin putih / asset tak load | Belum `npm run build` | Jalankan `npm run build` (atau `npm run dev`) |
| `npm install` gagal (rolldown) | Bug native Windows | `npm install @rolldown/binding-win32-x64-msvc --no-save` |
| Login pusing balik ke login | Cookie/sesi | Pastikan buka guna `127.0.0.1:8000`, bukan IP lain |
| Nak reset semua data | — | `php artisan migrate:fresh --seed` (padam & isi semula) |

---

## 📁 Struktur ringkas projek

```
mini-project/
├── app/Http/Controllers/   ← "otak" backend (Item, Auth, User)
├── app/Models/             ← model data (Item, User)
├── database/migrations/    ← blueprint jadual database
├── database/seeders/       ← data contoh + akaun demo
├── routes/api.php          ← senarai URL backend
├── resources/js/
│   ├── pages/              ← skrin Vue (Dashboard, Login, Users...)
│   ├── components/         ← bahagian boleh guna semula (toast, dialog)
│   ├── store/              ← ingatan dikongsi (auth, toast)
│   ├── router.js           ← navigasi antara halaman
│   └── api.js              ← panggilan ke backend
├── .env                    ← konfigurasi (database, dll.)
└── start-dev.bat           ← pelancar mudah
```

Selamat mencuba geng! 🚀
