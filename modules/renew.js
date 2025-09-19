const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sellvpn.db');

/**
 * Fungsi umum untuk panggil API Xray untuk renew
 */
async function callXrayRenewAPI(serverId, endpoint, params) {
    return new Promise((resolve) => {
        db.get('SELECT * FROM Server WHERE id = ?', [serverId], async (err, server) => {
            if (err || !server) {
                console.error('Server tidak ditemukan:', err?.message);
                return resolve({ success: false, message: '❌ Server tidak ditemukan.' });
            }

            const url = `http://127.0.0.1:10000/${endpoint}?${params}&auth=${server.auth}`;
            try {
                const response = await axios.get(url);
                if (response.data.status === "success") {
                    resolve({ success: true, data: response.data.data });
                } else {
                    resolve({ success: false, message: response.data.message });
                }
            } catch (error) {
                console.error(`Error API renew ${endpoint}:`, error.message);
                resolve({ success: false, message: `❌ Terjadi kesalahan saat renew ${endpoint}.` });
            }
        });
    });
}

/**
 * Renew SSH
 */
async function renewssh(username, exp, serverId) {
    const params = `user=${username}&exp=${exp}`;
    const res = await callXrayRenewAPI(serverId, 'renewssh', params);
    if (!res.success) return res.message;

    return `✅ Akun SSH ${username} berhasil diperpanjang ${exp} hari. Expiry baru: \`${res.data.expired}\``;
}

/**
 * Renew VMess
 */
async function renewvmess(username, exp, serverId) {
    const params = `user=${username}&exp=${exp}`;
    const res = await callXrayRenewAPI(serverId, 'renewvmess', params);
    if (!res.success) return res.message;

    return `✅ Akun VMess ${username} berhasil diperpanjang ${exp} hari. Expiry baru: \`${res.data.expired}\``;
}

/**
 * Renew VLESS
 */
async function renewvless(username, exp, serverId) {
    const params = `user=${username}&exp=${exp}`;
    const res = await callXrayRenewAPI(serverId, 'renewvless', params);
    if (!res.success) return res.message;

    return `✅ Akun VLESS ${username} berhasil diperpanjang ${exp} hari. Expiry baru: \`${res.data.expired}\``;
}

/**
 * Renew Trojan
 */
async function renewtrojan(username, exp, serverId) {
    const params = `user=${username}&exp=${exp}`;
    const res = await callXrayRenewAPI(serverId, 'renewtrojan', params);
    if (!res.success) return res.message;

    return `✅ Akun Trojan ${username} berhasil diperpanjang ${exp} hari. Expiry baru: \`${res.data.expired}\``;
}

/**
 * Renew Shadowsocks
 */
async function renewshadowsocks(username, exp, serverId) {
    const params = `user=${username}&exp=${exp}`;
    const res = await callXrayRenewAPI(serverId, 'renewshadowsocks', params);
    if (!res.success) return res.message;

    return `✅ Akun Shadowsocks ${username} berhasil diperpanjang ${exp} hari. Expiry baru: \`${res.data.expired}\``;
}

module.exports = { renewssh, renewvmess, renewvless, renewtrojan, renewshadowsocks };
