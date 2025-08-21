# 🛡️ Guard Bot

A modern Discord moderation bot with a simple web admin panel. Built with Discord.js v14, Express, EJS, and optional MongoDB (falls back to JSON storage if MongoDB is unavailable).

Türkçe açıklama aşağıdadır.

---

## ✨ Features
- 🔨 Slash moderation commands: `ban`, `kick`, `mute`, `unmute`
- 🧰 Server setup commands: `log-ayarla`, `muterol-ayarla`
- 🧾 Moderation logs to a chosen channel
- 🌐 Web admin panel with session-based login (`/login` → `/` dashboard)
- 📊 Server dashboard + stats API (`/api/stats`)
- 🗃️ MongoDB via Mongoose, with JSON fallback for persistence
- 🧩 Clean file structure (`commands/`, `events/`, `handlers/`, `models/`, `utils/`, `views/`)

## 🧱 Tech Stack
- Node.js, Discord.js v14
- Express, EJS, express-session
- Mongoose (optional)

## 📁 Project Structure
```
.
├─ commands/
│  ├─ ban.js
│  ├─ kick.js
│  ├─ mute.js
│  ├─ unmute.js
│  ├─ log-ayarla.js
│  └─ muterol-ayarla.js
├─ events/
│  ├─ interactionCreate.js
│  ├─ ready.js
│  └─ guildLogger.js
├─ handlers/
│  ├─ commandHandler.js
│  └─ eventHandler.js
├─ models/
│  ├─ LogSetting.js
│  ├─ Moderation.js
│  └─ MuteRole.js
├─ utils/
│  ├─ embedResponse.js
│  ├─ logHandler.js
│  ├─ moderationUtility.js
│  └─ timeParser.js
├─ views/ (EJS templates)
├─ public/ (static assets)
├─ deploy-commands.js (register slash commands)
└─ index.js (bot + web server)
```

## 🔑 Environment Variables (.env)
```
TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_application_client_id
GUILD_ID=dev_guild_id_for_command_registration

# Optional but recommended
MONGODB_URI=mongodb://127.0.0.1:27017/discordbot
WEB_PORT=3000
SESSION_SECRET=super-secret-session-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me
```

## 🚀 Setup
1. Install dependencies
   ```bash
   npm install
   ```
2. Create a `.env` file with the values above
3. Register slash commands (per-guild)
   ```bash
   node deploy-commands.js
   ```
4. Start the bot + web panel
   ```bash
   node index.js
   # or (if installed globally) nodemon index.js
   ```
5. Open the panel: http://localhost:3000 → log in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`

## 🧭 Usage (Slash Commands)
- `/ban kullanıcı:<@user> sebep?:string mesaj-silme-süresi?:{0,1,7}`
- `/kick kullanıcı:<@user> sebep?:string`
- `/mute kullanıcı:<@user> süre:<string> sebep?:string`
  - Duration format supports: `s, m, h, d, w` (e.g., `30m`, `1h30m`, `2d`)
- `/unmute kullanıcı:<@user> sebep?:string`
- `/log-ayarla kanal:<#text-channel>` — Sets the log channel
- `/muterol-ayarla rol:<@role>` — Sets the mute role required for mute/unmute

## 📝 Logging
- Configure with `/log-ayarla`.
- Actions are logged with rich embeds: BAN, KICK, MUTE, UNMUTE (`utils/logHandler.js`).

## 🧰 Web Admin Panel (EJS + Express)
- `GET /login` → Simple username/password login (from `.env`)
- `GET /` → Dashboard (requires login)
- `GET /server/:id` → Server view
- `GET /api/stats` → Bot stats (requires login)

## 🗃️ Data Persistence
- Tries MongoDB first (`MONGODB_URI`).
- If MongoDB fails, switches to JSON mode automatically (`utils/moderationUtility.js` → `data/moderation.json`).

## 🧪 Development Notes
- Commands are loaded from `commands/` by `handlers/commandHandler.js`.
- Slash commands are registered via `deploy-commands.js` using `CLIENT_ID`, `GUILD_ID`, and `TOKEN`.

## ❓ Troubleshooting
- Commands don’t appear? Re-run `node deploy-commands.js` and ensure `CLIENT_ID`/`GUILD_ID` are correct.
- MongoDB not available? The bot will continue in JSON mode with a console notice.
- Permission errors? Ensure the bot has role permissions (Ban/Kick/Manage Roles) and correct intents.

## 📜 License
ISC

---

# 🇹🇷 Guard Bot (Türkçe)

Basit bir web paneli olan modern bir Discord moderasyon botu. Discord.js v14, Express, EJS ve opsiyonel MongoDB ile geliştirildi (MongoDB yoksa JSON depolamaya otomatik geçer).

## ✨ Özellikler
- 🔨 Slash moderasyon komutları: `ban`, `kick`, `mute`, `unmute`
- 🧰 Sunucu kurulum komutları: `log-ayarla`, `muterol-ayarla`
- 🧾 Seçilen kanala moderasyon logları
- 🌐 Oturum tabanlı giriş ile web paneli (`/login` → `/`)
- 📊 Sunucu paneli + istatistik API’si (`/api/stats`)
- 🗃️ MongoDB (Mongoose) veya JSON ile kalıcı kayıt

## 🔑 Ortam Değişkenleri (.env)
```
TOKEN=discord_bot_token
CLIENT_ID=discord_uygulama_client_id
GUILD_ID=komut_kaydı_için_guild_id
MONGODB_URI=mongodb://127.0.0.1:27017/discordbot
WEB_PORT=3000
SESSION_SECRET=oturum_sifresi
ADMIN_USERNAME=admin
ADMIN_PASSWORD=degistir
```

## 🚀 Kurulum
1. Bağımlılıkları kurun
   ```bash
   npm install
   ```
2. `.env` dosyasını doldurun
3. Slash komutlarını kaydedin (sunucuya özel)
   ```bash
   node deploy-commands.js
   ```
4. Botu ve web panelini başlatın
   ```bash
   node index.js
   ```
5. Paneli açın: http://localhost:3000 → `.env`’deki kullanıcı adı/şifre ile giriş yapın

## 🧭 Kullanım (Slash Komutları)
- `/ban kullanıcı:<@kullanıcı> sebep?:metin mesaj-silme-süresi?:{0,1,7}`
- `/kick kullanıcı:<@kullanıcı> sebep?:metin`
- `/mute kullanıcı:<@kullanıcı> süre:<metin> sebep?:metin`
  - Süre biçimi: `s, m, h, d, w` (örn: `30m`, `1h30m`, `2d`)
- `/unmute kullanıcı:<@kullanıcı> sebep?:metin`
- `/log-ayarla kanal:<#yazı-kanalı>` — Log kanalını ayarlar
- `/muterol-ayarla rol:<@rol>` — Mute için gerekli rolü ayarlar

## 📝 Loglama
- `/log-ayarla` ile bir log kanalı seçin.
- İşlemler zengin embed ile loglanır: BAN, KICK, MUTE, UNMUTE (`utils/logHandler.js`).

## 🌐 Web Panel
- `GET /login` → Giriş (kullanıcı adı/parola `.env`)
- `GET /` → Panel (giriş gerekir)
- `GET /server/:id` → Sunucu görünümü
- `GET /api/stats` → Bot istatistikleri (giriş gerekir)

## 🗃️ Kalıcı Kayıt
- Önce MongoDB’ye bağlanmayı dener (`MONGODB_URI`).
- Bağlantı başarısızsa otomatik JSON moduna geçer (`utils/moderationUtility.js`).

## ❓ Sorun Giderme
- Komutlar görünmüyor mu? `node deploy-commands.js` çalıştırın, `CLIENT_ID` / `GUILD_ID` doğru mu kontrol edin.
- Yetki hatası mı? Botun gerekli yetkileri olduğundan emin olun (Yasakla/At/Role Yönetimi) ve uygun intentler açık olsun.

## 📜 Lisans
ISC
