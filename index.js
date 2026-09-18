/*═══════════════════════════════════════════════════════
 *  INFORMATION SCRIPT
 *═══════════════════════════════════════════════════════
 * RECODE BY   : VINSS STUDENTS
 * BASE ORI    : ZASS DESUTA
 * YOUTUBE     : https://www.youtube.com/@VinssBotz
 * CHANEL      : https://whatsapp.com/channel/0029VaF4IIt1CYoaRgoOaX2i
 *═══════════════════ SEKIAN TERIMAKASIH ─════════════════════
 */

import './settings.js'

import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  Browsers,
  makeCacheableSignalKeyStore,
  getAggregateVotesInPollMessage,
} from "@whiskeysockets/baileys";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { modul } from './module.js'
import * as logger from './lib/logger.js'
import { attachSocketHelpers, initLidOwner, attachCallHandler } from './lib/socket.js'
import { bootstrapFiles, makePentingStore } from './lib/database.js'
import { collectOwnerConfig } from './lib/setup.js'

const {
  fs,
  fileTypeFromBuffer,
  path,
  pino,
  PhoneNumber,
  axios
} = modul

import { makeInMemoryStore } from './lib/store.js'
import Pino from 'pino'
import yargs from 'yargs/yargs'
import _ from 'lodash'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import mongoDB from './lib/mongoDB.js'
import NodeCache from 'node-cache'

import { smsg, sleep, loadModule, previewAd } from './lib/myfunc.js'
import { handleGroupParticipantsUpdate } from './lib/welcome.js'
import { initRpgGlobals, createUser } from './helper.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prefix = "";

const dbPath = path.join(__dirname, "database");
const { pentingFile } = bootstrapFiles(dbPath);

let mainHandler;
let caseFileMtime = 0;
const caseFilePath = path.join(__dirname, "case.js");
const loadHandler = async () => {
  const mtime = fs.statSync(caseFilePath).mtimeMs;
  if (mainHandler && mtime === caseFileMtime) return;
  caseFileMtime = mtime;
  mainHandler = (await import(`./case.js?update=${Date.now()}`)).default;
};
loadHandler();

const store = makeInMemoryStore({
  logger: pino().child({
    level: "silent",
    stream: "store",
  }),
});

global.opts = yargs(process.argv.slice(2)).exitProcess(false).parse();
const defaultData = {
  users: [],
  chats: [],
  settings: {}
}
global.db = new Low(
  /mongodb/.test(opts['db'] || '')
    ? new mongoDB(opts['db'])
    : new JSONFile('./database/database.json'),
  defaultData
)
global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read()
  global.db.READ = false
  global.db.data = {
    users: {},
    chats: {},
    game: {},
    database: {},
    settings: {},
    setting: {},
    others: {},
    sticker: {},
    ...(global.db.data || {})
  }
  global.db.chain = _.chain(global.db.data)

  // ✅ Inisialisasi global RPG (casino, misi, fightnaga, dll)
  initRpgGlobals()
}
loadDatabase()

console.clear();
logger.starting("Welcome In Terminal Kuroko!");

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection →", reason);
});
process.on("rejectionHandled", () => {
  logger.info("Rejection handled.");
});
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception →", err);
});

setTimeout(() => {
  logger.banner("VINSS BOTZ");
  logger.subBanner("Booting Vinss Engine...");
  logger.section(`Welcome to Vinss Botz v${global.version} - YT VinssBotz`);
  logger.systemInfo(modul);
}, 1000);

async function startsesi() {
  await new Promise((r) => setTimeout(r, 5000));
  logger.banner(`Vinss Botz v${global.version}`, "full");
  logger.section("Initializing Vinss System...");

  await collectOwnerConfig();

  logger.ownerSetupInfo({ modul, ownername: global.ownername, ownernumber: global.ownernumber });
  logger.info("Membuat koneksi dan pairing code...");

  const { saveCreds, state } = await useMultiFileAuthState("./session");
  const msgRetryCounterCache = new NodeCache();
  const groupCache = new NodeCache({ stdTTL: 5 * 60, useClones: false });
  global.groupCache = groupCache;
  const { version } = await fetchLatestBaileysVersion();

  const getMessage = async (key) => {
    if (store) {
      const msg = await store.loadMessage(key.remoteJid, key.id);
      return msg?.message || undefined;
    }
    return { conversation: "" };
  };

  const vinss = makeWASocket({
    version,
    logger: Pino({ level: "silent" }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Safari"),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "silent" })),
    },
    markOnlineOnConnect: false,
    generateHighQualityLinkPreview: false,
    msgRetryCounterCache,
    keepAliveIntervalMs: 15_000,
    connectTimeoutMs: 60_000,
    retryRequestDelayMs: 500,
    maxMsgRetryCount: 5,
    syncFullHistory: false,
    fireInitQueries: true,
    emitOwnEvents: true,
    cachedGroupMetadata: async (jid) => groupCache.get(jid),
    getMessage,
  });

  vinss.ev.on("creds.update", saveCreds);
  store.bind(vinss.ev);

  vinss.ev.on("groups.update", async ([event]) => {
    try {
      const metadata = await vinss.groupMetadata(event.id);
      groupCache.set(event.id, metadata);
    } catch {}
  });

  vinss.ev.on("group-participants.update", async (event) => {
    try {
      const metadata = await vinss.groupMetadata(event.id);
      groupCache.set(event.id, metadata);
    } catch {}
    try {
      const { handleGroupParticipantsUpdate } = await import(`./lib/welcome.js?update=${Date.now()}`);
      await handleGroupParticipantsUpdate(vinss, event);
    } catch (err) {
      logger.error("Error welcome handler:", err);
    }
  });

  if (!vinss.authState.creds.registered) {
    await new Promise((r) => setTimeout(r, 3000));
    const code = await vinss.requestPairingCode(global.nomorbot, pair);
    logger.pairingCode(code);
  }

  let reconnectAttempts = 0;
  const MAX_RECONNECT = 10;

  vinss.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    const statusCode = lastDisconnect?.error?.output?.statusCode;

    if (connection === "connecting") {
      logger.connecting();
    } else if (connection === "open") {
      reconnectAttempts = 0;
      await sleep(3000);
      await initLidOwner(vinss);
      loadModule(vinss);
      logger.connected();

      // auto join channel
      try {
        const channelId = global.idSaluran;
        if (channelId) {
          const invite = channelId.split('@')[0];
          await vinss.newsletterFollow(channelId);
          logger.info(`Auto join channel: ${channelId}`);
        }
      } catch (err) {
        logger.warn(`Gagal auto join channel: ${err.message}`);
      }
    } else if (connection === "close") {
      const isLoggedOut = statusCode === DisconnectReason.loggedOut;
      const isForbidden = statusCode === 403;

      logger.disconnected(statusCode, isLoggedOut);

      if (isLoggedOut || isForbidden) {
        logger.loggedOut();
        try { fs.rmSync("./session", { recursive: true, force: true }); } catch {}
        process.exit(1);
      }

      if (reconnectAttempts >= MAX_RECONNECT) {
        logger.reconnectFailed(MAX_RECONNECT);
        process.exit(1);
      }

      const backoff = Math.min(3000 * Math.pow(1.5, reconnectAttempts), 60_000);
      reconnectAttempts++;
      logger.reconnecting(reconnectAttempts, backoff);
      await sleep(backoff);
      startsesi();
    }
  });

  attachCallHandler(vinss, { previewAd, sleep });

  vinss.ev.on("messages.upsert", async (chatUpdate) => {
    try {
      const kay = chatUpdate.messages[0];
      if (!kay.message) return;

      kay.message =
        Object.keys(kay.message)[0] === "ephemeralMessage"
          ? kay.message.ephemeralMessage.message
          : kay.message;

      const m = smsg(vinss, kay, store);

      if (!m.message) return;
      m.message = Object.keys(m.message)[0] === 'ephemeralMessage' ? m.message.ephemeralMessage.message : m.message;
      if (m.isBaileys) return;
      if (m.key && m.key.remoteJid === 'status@broadcast') {
        if (global.autoreadsw) vinss.readMessages([m.key]);
      }

      if (global.autojoingc && chatUpdate.type === 'notify' && m.text && m.text.includes('chat.whatsapp.com/')) {
        const invite = m.text.match(/chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i);
        if (invite?.[1]) {
          try { await vinss.groupAcceptInvite(invite[1]); } catch {}
        }
      }

      const isAllowedInSelf =
        kay.key.fromMe ||
        vinss.isOwnerJid(m.sender) ||
        vinss.isOwnerJid(kay.key.participant);

      if (!vinss.public && !isAllowedInSelf && chatUpdate.type === 'notify') return;

      if (global.autoread) vinss.readMessages([m.key]);

      if (kay.key.id.startsWith("BAE5") && kay.key.id.length === 16) return;

      await loadHandler();

      // ✅ Buat/ambil user RPG untuk sender
      createUser(m.sender);

      // ✅ Buat user group (opsional, untuk keperluan group-level RPG)
      if (m.isGroup) createUser(m.chat);

      mainHandler(vinss, m, chatUpdate, store);
    } catch (err) {
      logger.error("Error saat memproses pesan:", err);
    }
  });

  vinss.ev.on("messages.update", async (chatUpdate) => {
    for (const { key, update } of chatUpdate) {
      if (update.pollUpdates && key.fromMe) {
        const pollCreation = await getMessage(key);
        if (pollCreation) {
          const pollUpdate = await getAggregateVotesInPollMessage({
            message: pollCreation,
            pollUpdates: update.pollUpdates,
          });
          const toCmd = pollUpdate.filter((v) => v.voters.length !== 0)[0]?.name;
          if (toCmd === undefined) return;
          const prefCmd = prefix + toCmd;
          vinss.appenTextMessage(prefCmd, chatUpdate);
        }
      }
    }
  });

  attachSocketHelpers(vinss, { fs, fileTypeFromBuffer, PhoneNumber, store, axios });
  vinss.public = global.botMode;

  // ✅ Auto-save database tiap 10 detik
  setInterval(async () => {
    if (global.db && global.db.data) {
      try {
        await global.db.write()
      } catch (e) {
        logger.error('DB auto-save error:', e.message)
      }
    }
  }, 10000)

  return vinss;
}
startsesi();

fs.watchFile(__filename, async () => {
  fs.unwatchFile(__filename);
  logger.info(`Update ${__filename}`);
  try {
    await import(`file:///${__filename.replace(/\\/g, '/')}?update=${Date.now()}`);
  } catch (err) {
    logger.error("Gagal hot-reload index.js:", err);
  }
});