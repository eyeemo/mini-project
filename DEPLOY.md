# 🚀 Deploy ke Render (Percuma)

Panduan hos app ni online (Laravel + Vue + PostgreSQL) di [Render](https://render.com) — **percuma**.

Semua konfigurasi dah siap dalam repo:
- `Dockerfile` — cara bina & jalankan app
- `docker/entrypoint.sh` — migration + start server
- `render.yaml` — auto-cipta web service + database

---

## Langkah-langkah

### 1. Daftar akaun Render
Pergi [render.com](https://render.com) → **Get Started** → **Sign in with GitHub** (guna akaun `eyeemo`).

### 2. Cipta Blueprint
- Klik **New +** (kanan atas) → **Blueprint**
- Pilih repo **`eyeemo/mini-project`** → **Connect**
- Render akan baca `render.yaml` dan tunjuk 2 benda nak dicipta:
  - 🌐 `mini-project` (web service)
  - 🗄️ `mini-project-db` (PostgreSQL)

### 3. Masukkan APP_KEY
Render akan minta nilai untuk **`APP_KEY`** (sebab ia rahsia, tak disimpan dalam kod).
Paste kunci ni:

```
base64:R69vPkRPU55Y0EjAnjWPT56olAiI/4PCiJ4cEXfmKH4=
```

### 4. Apply
Klik **Apply** → Render mula bina. Deploy pertama ambil masa **~5–10 minit**
(bina frontend + backend + database). Tunggu sampai status jadi **Live** 🟢.

### 5. Buka app kamu!
Klik URL yang Render bagi, contoh:
```
https://mini-project.onrender.com
```

Login guna akaun demo:
| Peranan | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `password` |
| User | `user@example.com` | `password` |

---

## ⚠️ Perkara nak ingat (tier percuma)

- **App tidur** selepas ~15 minit tak guna → load pertama lambat **~30–60 saat** (tunggu je, lepas tu laju).
- **Database percuma luput** selepas ~30–90 hari → kena cipta baru kalau nak teruskan.
- Data (item/user) tersimpan dalam database Render, bukan komputer kamu.

---

## 🔄 Auto-deploy

Lepas ni, setiap kali kamu `git push` ke `main`, Render **auto-deploy versi baru**.
Tak payah buat apa-apa — tolak kod je, Render update sendiri. 🎉

---

## Ada masalah?

- **Build gagal** → tengok tab **Logs** dalam Render, hantar ralat pada saya.
- **Login tak jalan** → pastikan `APP_KEY` dah diisi (Langkah 3).
- **Skrin error** → semak `APP_KEY` & database dah "Live".
