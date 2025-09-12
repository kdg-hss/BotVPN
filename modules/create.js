// modules/create_debug.js
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sellvpn.db');

async function requestServer(url, authUser, authPass, type) {
    console.log(`[DEBUG] Memanggil API server untuk ${type}: ${url}`);
    console.log(`[DEBUG] Auth user: ${authUser}, Auth pass: ${authPass}`);

    try {
        const response = await axios.get(url, {
            auth: {
                username: authUser,
                password: authPass
            },
            timeout: 10000
        });
        console.log(`[DEBUG] Response dari server:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`[ERROR] Gagal request ke server untuk ${type}: ${error.message}`);
        if (error.response) {
            console.error(`[ERROR] Response status: ${error.response.status}`);
            console.error(`[ERROR] Response data:`, error.response.data);
        }
        return null;
    }
}

function getServer(domain) {
    return new Promise((resolve, reject) => {
        console.log(`[DEBUG] Mengambil data server dari DB: ${domain}`);
        db.get("SELECT * FROM servers WHERE domain = ?", [domain], (err, row) => {
            if (err) {
                console.error(`[ERROR] DB error: ${err.message}`);
                return reject(err);
            }
            if (!row) {
                console.warn(`[WARN] Server ${domain} tidak ditemukan di DB`);
                return resolve(null);
            }
            console.log(`[DEBUG] Server ditemukan:`, row);
            resolve(row);
        });
    });
}

async function createssh(domain) {
    const server = await getServer(domain);
    if (!server) return { error: `Server ${domain} tidak ditemukan.` };

    const [authUser, authPass] = server.auth.split(':');
    const url = `http://${server.domain}:5888/createssh`;
    return await requestServer(url, authUser, authPass, 'SSH');
}

async function createvmess(domain) {
    const server = await getServer(domain);
    if (!server) return { error: `Server ${domain} tidak ditemukan.` };

    const [authUser, authPass] = server.auth.split(':');
    const url = `http://${server.domain}:5888/createvmess`;
    return await requestServer(url, authUser, authPass, 'VMess');
}

async function createvless(domain) {
    const server = await getServer(domain);
    if (!server) return { error: `Server ${domain} tidak ditemukan.` };

    const [authUser, authPass] = server.auth.split(':');
    const url = `http://${server.domain}:5888/createvless`;
    return await requestServer(url, authUser, authPass, 'VLess');
}

async function createtrojan(domain) {
    const server = await getServer(domain);
    if (!server) return { error: `Server ${domain} tidak ditemukan.` };

    const [authUser, authPass] = server.auth.split(':');
    const url = `http://${server.domain}:5888/createtrojan`;
    return await requestServer(url, authUser, authPass, 'Trojan');
}

async function createshadowsocks(domain) {
    const server = await getServer(domain);
    if (!server) return { error: `Server ${domain} tidak ditemukan.` };

    const [authUser, authPass] = server.auth.split(':');
    const url = `http://${server.domain}:5888/createshadowsocks`;
    return await requestServer(url, authUser, authPass, 'Shadowsocks');
}

module.exports = {
    createssh,
    createvmess,
    createvless,
    createtrojan,
    createshadowsocks
};
