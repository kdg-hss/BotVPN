// app.js
const express = require("express");
const { Telegraf } = require("telegraf");
const sqlite3 = require("sqlite3").verbose();
const axios = require("axios");

// Module create/renew
const {
  createssh,
  createvmess,
  createvless,
  createtrojan,
  createshadowsocks,
} = require("./modules/create");
const {
  renewssh,
  renewvmess,
  renewvless,
  renewtrojan,
  renewshadowsocks,
} = require("./modules/renew");

const BOT_TOKEN = "YOUR_BOT_TOKEN";
const bot = new Telegraf(BOT_TOKEN);

// Database
const db = new sqlite3.Database("./sellvpn.db", (err) => {
  if (err) {
    console.error("❌ Gagal connect DB:", err.message);
  } else {
    console.log("✅ Connected to sellvpn.db");
  }
});

// Tables
db.run(
  `CREATE TABLE IF NOT EXISTS servers(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain TEXT,
    auth TEXT,
    port INTEGER,
    name TEXT,
    max_user INTEGER,
    limit_ip INTEGER,
    quota INTEGER
  )`
);

db.run(
  `CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id TEXT,
    username TEXT,
    type TEXT,
    server_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`
);

// Utility function to request API server
async function requestAPIServer(type, server) {
  try {
    const url = `http://127.0.0.1:5000/create${type}`;
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.error(`❌ Gagal membuat ${type}:`, err.message);
    return null;
  }
}

// Bot commands
bot.start(async (ctx) => {
  const userId = ctx.from.id;
  console.log(`Start command from User ID ${userId}`);
  ctx.reply("Selamat datang! Silahkan pilih menu.");
});

bot.command("create_vmess", async (ctx) => {
  const server = { domain: "127.0.0.1", auth: "root:pass" }; // contoh
  const result = await requestAPIServer("vmess", server);
  if (result) {
    ctx.reply(`✅ VMess berhasil dibuat:\n${JSON.stringify(result)}`);
  } else {
    ctx.reply(`❌ Gagal membuat VMess.`);
  }
});

bot.command("create_vless", async (ctx) => {
  const server = { domain: "127.0.0.1", auth: "root:pass" };
  const result = await requestAPIServer("vless", server);
  if (result) {
    ctx.reply(`✅ VLess berhasil dibuat:\n${JSON.stringify(result)}`);
  } else {
    ctx.reply(`❌ Gagal membuat VLess.`);
  }
});

bot.command("create_trojan", async (ctx) => {
  const server = { domain: "127.0.0.1", auth: "root:pass" };
  const result = await requestAPIServer("trojan", server);
  if (result) {
    ctx.reply(`✅ Trojan berhasil dibuat:\n${JSON.stringify(result)}`);
  } else {
    ctx.reply(`❌ Gagal membuat Trojan.`);
  }
});

bot.command("create_ssh", async (ctx) => {
  const server = { domain: "127.0.0.1", auth: "root:pass" };
  const result = await requestAPIServer("ssh", server);
  if (result) {
    ctx.reply(`✅ SSH berhasil dibuat:\n${JSON.stringify(result)}`);
  } else {
    ctx.reply(`❌ Gagal membuat SSH.`);
  }
});

bot.command("create_shadowsocks", async (ctx) => {
  const server = { domain: "127.0.0.1", auth: "root:pass" };
  const result = await requestAPIServer("shadowsocks", server);
  if (result) {
    ctx.reply(`✅ Shadowsocks berhasil dibuat:\n${JSON.stringify(result)}`);
  } else {
    ctx.reply(`❌ Gagal membuat Shadowsocks.`);
  }
});

// Start bot
bot.launch();
console.log("🤖 Bot SellVPN berjalan.");

// Graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
