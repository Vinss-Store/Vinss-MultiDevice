<!-- ═══════════════════════ HEADER ═══════════════════════ -->
<div align="center">

<img src="https://capsule-render.vercel.app/api?type=venom&color=gradient&customColorList=12,6,20&height=260&section=header&text=VINSS%20MD&fontSize=90&fontColor=ffffff&animation=twinkling&fontAlignY=38&desc=Base%20Bot%20WhatsApp%20Terbaru%202026&descAlignY=62&descSize=20" alt="Vinss MD" width="100%"/>

<a href="https://github.com/Vinss-Store/Vinss-MultiDevice">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=900&color=25D366&center=true&vCenter=true&width=600&lines=Satu+Script%2C+Semua+Device+%F0%9F%93%B1%F0%9F%92%BB;Baileys+7+%7C+ESM+%7C+Pairing+Code+%F0%9F%94%91;Welcome%2C+Anticall%2C+JPM%2C+Sticker+%26+lainnya+%F0%9F%94%A5;Recode+by+Vinss+Students+%E2%9D%A4%EF%B8%8F" alt="Typing SVG"/>
</a>

<br/><br/>

<img src="https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="node"/>
<img src="https://img.shields.io/badge/Baileys-7.0.0--rc14-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="baileys"/>
<img src="https://img.shields.io/badge/Module-ESM-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="esm"/>
<img src="https://img.shields.io/badge/Version-1.0.0-ff69b4?style=for-the-badge" alt="version"/>
<img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="license"/>

<br/>

<a href="https://www.youtube.com/@VinssBotz"><img src="https://img.shields.io/badge/YouTube-Vinss%20Botz-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="youtube"/></a>
<a href="https://whatsapp.com/channel/0029VaF4IIt1CYoaRgoOaX2i"><img src="https://img.shields.io/badge/Channel-WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="channel"/></a>
<a href="https://www.vinss.biz.id/"><img src="https://img.shields.io/badge/Website-vinss.biz.id-0A66C2?style=for-the-badge&logo=googlechrome&logoColor=white" alt="web"/></a>

</div>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" alt="line"/>

## 📖 Tentang

**Vinss MD** adalah base bot WhatsApp multi-device berbasis **[Baileys](https://github.com/WhiskeySockets/Baileys)** yang ditulis dengan **ES Modules**. Cocok buat kamu yang mau mulai bikin bot tanpa pusing bikin fondasinya dari nol.

| | |
|:---|:---|
| 🎬 **Recode by** | Vinss Students |
| 👑 **Base original** | Zass Desuta |
| 📅 **Rilis** | Base Bot WhatsApp Terbaru 2026 |
| 📜 **Lisensi** | MIT |

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" alt="line"/>

## ✨ Fitur

<div align="center">

| 🔑 Pairing Code | 🔥 Hot Reload | 👋 Welcome & Leave | 📵 Anticall |
|:---:|:---:|:---:|:---:|
| Login pakai nomor + kode pairing kustom, tanpa scan QR | `settings.js` otomatis dimuat ulang saat diubah | Sambut atau lepas member grup otomatis | Tolak panggilan masuk otomatis |

| 📢 JPM & Push Kontak | 👁️ Auto Read | 🌐 Public / Self | 🖼️ Media & Sticker |
|:---:|:---:|:---:|:---:|
| Broadcast dengan delay bisa diatur | Baca chat & status otomatis | Ganti mode bot dengan satu flag | Sticker, canvas, konversi audio/video |

</div>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" alt="line"/>

## 🗂️ Struktur Proyek

```text
Vinss-MultiDevice/
├── 📁 lib/              # library internal
├── 🚪 index.js          # entry point
├── 🧠 case.js           # logika command
├── 🧩 module.js         # module tambahan
├── 🛠️ helper.js         # fungsi utility
├── ⚙️ settings.js       # konfigurasi bot (buat dari settings.js.bak)
├── 📄 settings.js.bak   # template konfigurasi
├── 📋 package.json
└── 📜 LICENSE
```

### 🔄 Alur Kerja

```mermaid
flowchart LR
    A([📱 Pesan Masuk]) --> B[🚪 index.js]
    B --> C{🧠 case.js}
    C -->|command| D[🧩 module.js]
    C -->|utility| E[🛠️ helper.js]
    D --> F([💬 Balasan])
    E --> F
    S[⚙️ settings.js] -. global config .-> B
    S -. hot reload .-> S
```

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" alt="line"/>

## 🚀 Instalasi

### Prasyarat

- **Node.js 20+** (disarankan versi LTS terbaru)
- **Git**
- Nomor WhatsApp khusus untuk bot

### Langkah-langkah

```bash
# 1. Clone
git clone https://github.com/Vinss-Store/Vinss-MultiDevice.git
cd Vinss-MultiDevice

# 2. Install dependencies
npm install

# 3. Buat file konfigurasi dari template
cp settings.js.bak settings.js

# 4. Jalankan
npm start
```

> [!TIP]
> Kalau `settings.js` sudah ada di repo, langkah 3 bisa dilewati. Cukup edit isinya.

### 🔑 Login dengan Pairing Code

Bot ini memakai nomor bot (`nomorbot`) dan kode pairing kustom (`pair`), jadi login-nya tanpa scan QR:

1. Jalankan `npm start`, kode pairing akan muncul di terminal.
2. Di HP bot, buka **WhatsApp → Perangkat Tertaut → Tautkan Perangkat**.
3. Pilih **Tautkan dengan nomor telepon saja**, lalu masukkan kodenya.

> [!NOTE]
> Kode pairing WhatsApp panjangnya 8 karakter, dan `VINSSBOT` di template pas 8 huruf. Kalau kamu ganti, pastikan tetap 8 karakter.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" alt="line"/>

## ⚙️ Konfigurasi (`settings.js`)

Semua pengaturan disimpan sebagai variabel `global` di `settings.js`.

```js
// ── Owner ──
global.ownernumber = '62xxxxxxxxxxx'   // nomor owner (wajib restart setelah diubah)
global.ownername   = 'NAMA OWNER'

// ── Bot ──
global.namabot  = 'NAMA BOT'
global.nomorbot = '62xxxxxxxxxxx'      // nomor yang dipakai bot
global.pair     = 'VINSSBOT'           // kode pairing kustom (8 karakter)
global.botMode  = true                 // true = public, false = self
```

| Kategori | Variabel | Fungsi |
|:---|:---|:---|
| 👤 Owner | `ownernumber`, `lidownernumber`, `ownername` | Identitas owner bot |
| 🤖 Bot | `namabot`, `nomorbot`, `pair`, `version` | Identitas & login bot |
| 🔀 Mode | `botMode` | `true` public, `false` self |
| ⌨️ Prefix | `prefix` | Daftar karakter prefix command |
| 🎛️ Toggle | `welcome`, `leave`, `autojoingc`, `anticall`, `autoread`, `autoreadsw` | Aktif/nonaktifkan fitur otomatis |
| 🌐 Sosmed | `web`, `linkSaluran`, `idSaluran`, `nameSaluran` | Link website & saluran |
| 🏷️ Watermark | `packname`, `author`, `foother` | Watermark sticker & footer |
| 🖼️ Media | `img`, `thumb`, `thumbxm`, `thumbbc`, `favicon` | Gambar bawaan bot |
| 📢 Broadcast | `delayJpm`, `delayPushkontak`, `namakontak` | Delay (ms) & nama kontak |
| 💬 Pesan | `mess.*` | Teks balasan standar (success, wait, admin, dll.) |
| ⏱️ Interval | `closeMsgInterval`, `backMsgInterval` | Interval pesan (menit / jam) |

> [!IMPORTANT]
> Jangan commit nomor pribadi, token, atau kredensial ke repo publik. Simpan `settings.js` dan folder session di `.gitignore`.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" alt="line"/>

## 🧰 Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=nodejs,js,mongodb,git,github,npm&theme=dark" alt="stack"/>

</div>

<details>
<summary><b>📦 Lihat semua dependencies</b></summary>

<br/>

| Kategori | Package |
|:---|:---|
| 💬 WhatsApp | `@whiskeysockets/baileys` `7.0.0-rc14`, `@ryuu-reinzz/luna-lib`, `awesome-phonenumber` |
| 🌐 HTTP & Scraping | `axios`, `node-fetch`, `cheerio`, `form-data`, `cloudku-uploader` |
| 🎞️ Media | `@ffmpeg-installer/ffmpeg`, `fluent-ffmpeg`, `node-webpmux`, `node-canvas`, `node-html-to-image`, `file-type` |
| 🗄️ Database & Cache | `mongoose`, `lowdb`, `node-cache` |
| 🧪 Utility | `lodash`, `fs-extra`, `moment-timezone`, `parse-ms`, `yargs`, `pino` |
| 🎨 Tampilan Terminal | `chalk`, `figlet`, `gradient-string` |
| 🛠️ Dev | `depcheck` |

</details>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" alt="line"/>

## 🧩 Cara Nambah Fitur

1. Buka **`case.js`** dan tambahkan command baru di sana.
2. Taruh fungsi bantu di **`helper.js`** atau **`lib/`** kalau dipakai berulang.
3. Simpan. `settings.js` ter-reload otomatis, sedangkan file lain cukup restart bot.

```js
// contoh pola command sederhana di case.js
case 'ping': {
  await reply('Pong! 🏓')
}
break
```

> [!NOTE]
> Contoh di atas hanya ilustrasi pola `case`. Sesuaikan nama variabel (`reply`, dll.) dengan yang dipakai di `case.js` kamu.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" alt="line"/>

## 🤝 Kontribusi

1. 🍴 Fork repo ini
2. 🌿 `git checkout -b fitur-keren`
3. 💾 `git commit -m "Tambah fitur keren"`
4. 🚀 `git push origin fitur-keren`
5. 🔀 Buka Pull Request

## 👑 Kredit

<div align="center">

| Peran | Nama |
|:---:|:---:|
| 🎬 Recode | **Vinss Students** |
| 👑 Base Original | **Zass Desuta** |
| 📚 Library | **Baileys** (WhiskeySockets) & seluruh kontributor open source |

</div>

## 📜 Lisensi

Dirilis di bawah **[MIT License](LICENSE)**. Copyright © 2026 Zass Desuta, Record By Vinss Students.

> [!WARNING]
> Gunakan bot dengan bijak. Bot ini bukan produk resmi WhatsApp, dan penggunaan otomatisasi (terutama broadcast/JPM dan push kontak) bisa membuat nomor dibatasi atau diblokir. Segala risiko ditanggung pengguna. Jangan dipakai untuk spam atau pelanggaran aturan WhatsApp.

<!-- ═══════════════════════ FOOTER ═══════════════════════ -->
<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=16&pause=1500&color=F75C7E&center=true&vCenter=true&width=480&lines=Dibuat+dengan+%E2%9D%A4%EF%B8%8F+dan+%E2%98%95+oleh+Vinss+Students;Jangan+lupa+kasih+%E2%AD%90+ya!" alt="footer typing"/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,6,20&height=140&section=footer" alt="footer" width="100%"/>

</div>
