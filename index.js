const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// MONGODB BAĞLANTISI - HATA DURUMUNDA DEVAM EDECEK
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/discordbot', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB bağlantısı başarılı!');
    return true;
  } catch (error) {
    console.log('ℹ️ MongoDB bağlantısı kurulamadı. JSON tabanlı sistem kullanılacak.');
    console.log('ℹ️ Hata:', error.message);
    return false;
  }
}

// Express uygulaması
const app = express();
const PORT = process.env.WEB_PORT || 3000;

// Middleware'ler
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'discord_bot_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// EJS template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Basit kimlik doğrulama middleware'i
const requireAuth = (req, res, next) => {
  if (req.session.authenticated) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Ana sayfa
app.get('/', requireAuth, (req, res) => {
  if (!client.isReady()) {
    return res.render('error', { message: 'Bot hazır değil' });
  }
  
  res.render('index', {
    bot: client,
    user: req.session.user,
    guilds: client.guilds.cache.map(guild => ({
      id: guild.id,
      name: guild.name,
      memberCount: guild.memberCount,
      owner: guild.ownerId,
      icon: guild.iconURL()
    }))
  });
});

// Giriş sayfası
app.get('/login', (req, res) => {
  if (req.session.authenticated) {
    return res.redirect('/');
  }
  res.render('login', { error: null });
});

// Giriş işlemi
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    req.session.authenticated = true;
    req.session.user = { username };
    res.redirect('/');
  } else {
    res.render('login', { error: 'Geçersiz kullanıcı adı veya şifre!' });
  }
});

// Çıkış
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Sunucu sayfası
app.get('/server/:id', requireAuth, (req, res) => {
  const guild = client.guilds.cache.get(req.params.id);
  if (!guild) {
    return res.status(404).render('error', { message: 'Sunucu bulunamadı' });
  }

  res.render('server', {
    guild: guild,
    bot: client,
    user: req.session.user
  });
});

// API endpoint'leri
app.get('/api/stats', requireAuth, (req, res) => {
  res.json({
    guildCount: client.guilds.cache.size,
    userCount: client.users.cache.size,
    channelCount: client.channels.cache.size,
    uptime: client.uptime,
    ping: client.ws.ping
  });
});

// Web sunucusunu başlat
app.listen(PORT, () => {
  console.log(`🌐 Web paneli http://localhost:${PORT} adresinde çalışıyor!`);
});

// Handler'ları yükle
loadCommands(client);
loadEvents(client);

// MongoDB'ye bağlan
connectToMongoDB().then(mongoConnected => {
  if (!mongoConnected) {
    // MongoDB bağlantısı yoksa, moderation utility'i JSON moduna ayarla
    const ModerationUtility = require('./utils/moderationUtility');
    ModerationUtility.useJSONMode();
  }
});

// Botu giriş yap
client.login(process.env.TOKEN)
  .then(() => console.log('✅ Bot başarıyla giriş yaptı!'))
  .catch(error => {
    console.error('❌ Bot giriş hatası:', error);
    process.exit(1);
  });

// Hata yakalama
process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
  console.error('Uncaught exception:', error);
});