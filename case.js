/*═══════════════════════════════════════════════════════
 *INFORMATION SCRIPT
 *═══════════════════════════════════════════════════════
 * RECODE BY : VINSS STUDENTS
 * BASE ORI: ZASS DESUTA
 * YOUTUBE : https://www.youtube.com/@VinssBotz
 * CHANEL: https://whatsapp.com/channel/0029VaF4IIt1CYoaRgoOaX2i
 *═══════════════════ SEKIAN TERIMAKASIH ─════════════════════
 */

import "./settings.js";
import {
createUser,
getRpgUser,
msToTime,
Acakin,
pickRandom as rpgPickRandom,
checkCooldown,
rpgEmoji,
DEFAULT_RPG_USER,
totalUsers,
requireRegister
} from "./helper.js";
import {
clockString,
parseMention,
isUrl,
sleep,
runtime,
getBuffer,
jsonformat,
capital,
previewAd,
} from "./lib/myfunc.js";
import uploader from "./lib/upload.js";
import {
generateWAMessageFromContent,
proto,
generateWAMessageContent,
generateWAMessage,
prepareWAMessageMedia,
areJidsSameUser,
getContentType,
delay,
} from "@whiskeysockets/baileys";
import crypto from "crypto";
import { modul } from "./module.js";
import { exec, spawn, execSync } from "child_process";
import { color, bgcolor } from "./lib/color.js";
import { tiktokDl, capcutDl, wallpaper, wikimedia, happymod, ringtone, githubstalk, npmstalk, mlstalk, fbdl } from "./lib/scraper.js";
import { spotifyDl } from "./lib/spotify.js";
import { threadsStalk, tiktokStalk, ytStalk } from "./lib/stalker.js";
import { createApk } from "./lib/apkbuilder.js";
import { askDeepSeek, overchat, chrunos } from "./lib/ai.js";
import { TempMail } from "./lib/tempmail.js";
import { buildTicTacToeMessage } from "./lib/tictactoe.js";
import { buildSpaceRushMessage } from "./lib/spacerush.js";
import {
buildChessMessage
} from "./lib/chess.js";
import {
buildSubwaySurfMessage
} from "./lib/subwaysurf.js"
import {
  collectServerData,
  buildPingMessage,
  buildPingHtml,
  checkPingRate
} from "./lib/ping.js";
import {
  initAiModeGlobals,
  handleAiAutoReply,
  clearMemory,
  getMemory,
  getMemoryStats,
} from './lib/ai-mode.js';
import { AI_PERSONAS } from './lib/ai-persona.js';
import path from "path";
import util from "util";
import * as logger from "./lib/logger.js";
const {
os,
axios,
baileys,
chalk,
cheerio,
fs,
PhoneNumber,
process,
moment,
} = modul;
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';

// ============= UTILITIES & HELPERS =============
const readFile = util.promisify(fs.readFile);
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const yy1 = "`";
const yy2 = "```";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============= GAME SESSION STORE =============
const gameSession = new Map()
const tempMailSession = new Map()
const chessSession = new Map()
const spaceSession = new Map()
const confessSession = new Map()      
const confessUserMap = new Map()       
const menfessSession = new Map()       
const menfessReplyMap = new Map()

export default async function mainHandler(vinss, m, chatUpdate, store) {
try {
// Init AI Mode
initAiModeGlobals();
const cachedGroupMeta = async (jid) => {
const cache = global.groupCache
const cached = cache?.get(jid)
if (cached) return cached
const meta = await vinss.groupMetadata(jid)
cache?.set(jid, meta)
return meta
}

async function appenTextMessage(text, chatUpdate) {
let messages = await generateWAMessage(
m.chat,
{
text: text,
mentions: m.mentionedJid,
},
{
userJid: vinss.user.id,
quoted: m.quoted && m.quoted.fakeObj,
},
);
messages.key.fromMe = areJidsSameUser(m.sender, vinss.user.id);
messages.key.id = m.key.id;
messages.pushName = m.pushName;
if (m.isGroup) messages.participant = m.sender;
let msg = {
...chatUpdate,
messages: [proto.WebMessageInfo.fromObject(messages)],
type: "append",
};
vinss.ev.emit("messages.upsert", msg);
}
const { type, quotedMsg, mentioned, now, fromMe } = m;
let body =
m.mtype === "interactiveResponseMessage"
? JSON.parse(
m.message.interactiveResponseMessage.nativeFlowResponseMessage
.paramsJson,
).id
: m.mtype === "conversation"
? m.message.conversation
: m.mtype == "imageMessage"
? (m.message.imageMessage.caption || "")
: m.mtype == "videoMessage"
? m.message.videoMessage.caption
: m.mtype == "extendedTextMessage"
? m.message.extendedTextMessage.text
: m.mtype == "buttonsResponseMessage"
? m.message.buttonsResponseMessage.selectedButtonId
: m.mtype == "listResponseMessage"
? m.message.listResponseMessage.singleSelectReply
.selectedRowId
: m.mtype == "templateButtonReplyMessage"
? m.message.templateButtonReplyMessage.selectedId
: m.mtype == "messageContextInfo"
? m.message.buttonsResponseMessage?.selectedButtonId ||
m.message.listResponseMessage?.singleSelectReply
.selectedRowId ||
m.text
: m.mtype === "editedMessage"
? m.message.editedMessage.message.protocolMessage
.editedMessage.extendedTextMessage
? m.message.editedMessage.message.protocolMessage
.editedMessage.extendedTextMessage.text
: m.message.editedMessage.message.protocolMessage
.editedMessage.conversation
: "";
// pastikan body tidak null
body = body || "";

const thumbs = global.thumb
const randomThumbUrl = global.thumb

const budy = (typeof m.text == 'string' ? m.text : '.')
const prefixChars = global.prefix || '.'
const prefixCharClass = prefixChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
const prefixRegex = new RegExp(`^[${prefixCharClass}]`)
const prefix = prefixRegex.test(body) ? body.match(prefixRegex)[0] : '.'
const chath = body;
const pes = body;
const messagesC = pes.slice(0).trim();
const content = JSON.stringify(m.message);
const isCmd = body.startsWith(prefix);
const from = m.key.remoteJid;
const messagesD = body.slice(0).trim().split(/ +/).shift().toLowerCase();
const command = body
.replace(prefix, "")
.trim()
.split(/ +/)
.shift()
.toLowerCase();
const args = body.trim().split(/ +/).slice(1);
const lidBotNumber = await vinss.decodeJid(vinss.user.lid);
const botNumber = await vinss.decodeJid(vinss.user.id);
const isCreator = m.sender === global.ownernumber + "@s.whatsapp.net" ||
m.sender === botNumber ||
m.sender === global.lidownernumber + "@lid" ||
m.sender === lidBotNumber;
const pushname = m.pushName || "Anomali";
const q = args.join(" ");
const text = q;
const quoted = m.quoted ? m.quoted : m;
const mime = (quoted.msg || quoted).mimetype || "";
const qmsg = quoted.msg || quoted;
const isMedia = /image|video|sticker|audio/.test(mime);
const isImage = type == "imageMessage";
const isVideo = type == "videoMessage";
const isAudio = type == "audioMessage";
const isSticker = type == "stickerMessage";
const isQuotedImage =
type === "extendedTextMessage" && content.includes("imageMessage");
const isQuotedLocation =
type === "extendedTextMessage" && content.includes("locationMessage");
const isQuotedVideo =
type === "extendedTextMessage" && content.includes("videoMessage");
const isQuotedSticker =
type === "extendedTextMessage" && content.includes("stickerMessage");
const isQuotedAudio =
type === "extendedTextMessage" && content.includes("audioMessage");
const isQuotedContact =
type === "extendedTextMessage" && content.includes("contactMessage");
const isQuotedDocument =
type === "extendedTextMessage" && content.includes("documentMessage");
const sender = m.isGroup
? m.key.participant
? m.key.participant
: m.participant
: m.key.remoteJid;
const senderNumber = sender.split("@")[0];
const isGroup = m.chat.endsWith('@g.us')
const groupMetadata = m.isGroup
? await cachedGroupMeta(m.chat).catch((e) => { })
: "";
const participants =
m.isGroup && groupMetadata ? groupMetadata.participants : [];
const groupAdmins = m.isGroup
? await participants.filter((v) => v.admin !== null).map((v) => v.id)
: [];
const groupName = m.isGroup && groupMetadata ? groupMetadata.subject : [];
const groupOwner = m.isGroup && groupMetadata ? groupMetadata.owner : [];
const groupMembership =
m.isGroup && groupMetadata ? groupMetadata.membership : [];
const groupMembers =
m.isGroup && groupMetadata ? groupMetadata.participants : [];
const isBotAdmins = m.isGroup ? groupAdmins.includes(vinss.user.lid.split(":")[0] + "@lid") : false;
const isGroupAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const deviceinfo = /^3A/.test(m.id) ? 'ɪᴏs' : m.id.startsWith('3EB') ? 'ᴡᴇʙ' : /^.{21}/.test(m.id) ? 'ᴀɴᴅʀᴏɪᴅ' : /^.{18}/.test(m.id) ? 'ᴅᴇsᴋᴛᴏᴘ' : 'ᴜɴᴋɴᴏᴡ';
const ments = (text) => { return text.match('@') ? [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net') : [] }
const froms = m.quoted ? m.quoted.sender : text ? (text.replace(/[^0-9]/g, '') ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false) : false;
const mentionUser = [
...new Set([
...(m.mentionedJid || []),
...(m.quoted ? [m.quoted.sender] : []),
]),
];
const mentionByTag =
type == "extendedTextMessage" &&
m.message.extendedTextMessage.contextInfo != null
? m.message.extendedTextMessage.contextInfo.mentionedJid
: [];
const mentionByReply =
type == "extendedTextMessage" &&
m.message.extendedTextMessage.contextInfo != null
? m.message.extendedTextMessage.contextInfo.participant || ""
: "";
const numberQuery =
q.replace(new RegExp("[()+-/ +/]", "gi"), "") + "@s.whatsapp.net";
const usernya = mentionByReply ? mentionByReply : mentionByTag[0];
const Input = mentionByTag[0]
? mentionByTag[0]
: mentionByReply
? mentionByReply
: q
? numberQuery
: false;

const pentingPath = path.join(process.cwd(), "database", "penting.json")
let penting = JSON.parse(fs.readFileSync(pentingPath))

function savePenting() {
fs.writeFileSync(pentingPath, JSON.stringify(penting, null, 2))
}

const xtime = moment.tz("Asia/Jakarta").format("HH:mm:ss");
const xdate = moment.tz("Asia/Jakarta").format("DD/MM/YYYY");
const time2 = moment.tz("Asia/Jakarta").format("HH:mm:ss");

let timewisher;

if (time2 >= "00:00:00" && time2 < "05:00:00") {
timewisher = "Selamat Malam";
} else if (time2 >= "05:00:00" && time2 < "11:00:00") {
timewisher = "Selamat Pagi";
} else if (time2 >= "11:00:00" && time2 < "15:00:00") {
timewisher = "Selamat Siang";
} else if (time2 >= "15:00:00" && time2 < "19:00:00") {
timewisher = "Selamat Sore";
} else {
timewisher = "Selamat Malam";
}

let sekarang = new Date(
new Date().toLocaleString("en-US", {
timeZone: "Asia/Jakarta"
})
);

function tanggal(ms) {
return new Date(ms)
.getDate()
.toString()
.padStart(2, "0");
}

function bulan(ms) {
return (new Date(ms).getMonth() + 1)
.toString()
.padStart(2, "0");
}

function tahun(ms) {
return new Date(ms).getFullYear();
}

function formatJam(date) {
let jam = date.getHours().toString().padStart(2, "0");
let menit = date.getMinutes().toString().padStart(2, "0");
let detik = date.getSeconds().toString().padStart(2, "0");
return `${jam}:${menit}:${detik}`;
}

let futureDescription = `
📅 *Update Kurs:* ${tanggal(sekarang.getTime())}/${bulan(sekarang.getTime())}/${tahun(sekarang.getTime())}
🕰 *Waktu Jakarta (WIB):* ${formatJam(sekarang)}`

const qVinss = { key: { remoteJid: 'status@broadcast', participant: '0@s.whatsapp.net' }, message: { newsletterAdminInviteMessage: { newsletterJid: global.idSaluran, newsletterName: 'ᴠᴇʀɪғɪᴄᴀᴛɪᴏɴ', caption: `${namabot} Made By ${ownername}`, inviteExpiration: 0 } } }

const qtext = {
key: {
remoteJid: "status@broadcast",
participant: "0@s.whatsapp.net"
},
message: {
extendedTextMessage: {
text: global.namabot
}
}
};

const qloc = { key: { participant: '0@s.whatsapp.net', ...(m.chat ? { remoteJid: `status@broadcast` } : {}) }, message: { locationMessage: { name: `${global.namabot} by ${ownername}`, jpegThumbnail: "" } } }

const qlocJpm = { key: { participant: '0@s.whatsapp.net', ...(m.chat ? { remoteJid: `status@broadcast` } : {}) }, message: { locationMessage: { name: `${global.namabot} Made By ${ownername}`, jpegThumbnail: "" } } }

const qtoko = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "status@broadcast" } : {}) }, message: { "productMessage": { "product": { "productImage": { "mimetype": "image/jpeg", "jpegThumbnail": "" }, "title": `Payment By ${ownername}`, "description": null, "currencyCode": "IDR", "priceAmount1000": "999999999999999", "retailerId": `Powered By ${ownername}`, "productImageCount": 1 }, "businessOwnerJid": `0@s.whatsapp.net` } } }

var ppuser
try {
ppuser = await vinss.profilePictureUrl(m.sender, 'image')
} catch (err) {
ppuser = 'https://telegra.ph/file/a059a6a734ed202c879d3.jpg'
}
const qlive = { key: { participant: '0@s.whatsapp.net', ...(m.chat ? { remoteJid: `status@broadcast` } : {}) }, message: { liveLocationMessage: { caption: `ꪎ ${global.ownername}`, jpegThumbnail: "" } } }

async function reply(txt, opts = {}) {
return vinss.sendMessage(m.chat, {
text: txt,
contextInfo: previewAd({
title: `- ${namabot} -`,
body: `Runtime : ${runtime(process.uptime())}`,
thumbnail: global.img,
sourceUrl: global.web,
mention: opts.mentions || [],
forward: true,
}),
}, { quoted: m });
}

const reply2 = (teks) => {
vinss.sendMessage(from, { text: teks }, { quoted: m })
}

const example = async (teks) => {
await vinss.sendMessage(m.chat, {
react: { text: '✖️', key: m.key }
});

const commander = `• *Example:* ${prefix + command} ${teks}`;

return vinss.sendMessage(m.chat, {
text: commander,
contextInfo: previewAd({
title: `Dame dayo !!!!`,
body: `Runtime : ${runtime(process.uptime())}`,
thumbnail: global.thumbxm,
sourceUrl: global.web,
mention: [m.sender],
forward: true,
largerThumbnail: false,
}),
}, { quoted: m });
};

const larang = async () => {
await vinss.sendMessage(m.chat, {
react: { text: '✖️', key: m.key }
});

return vinss.sendMessage(m.chat, {
text: mess.creator,
contextInfo: previewAd({
title: `- Prohibition Message -`,
body: `Command ${prefix + command} From ${pushname}`,
thumbnail: global.img,
sourceUrl: global.web,
mention: [m.sender],
forward: true,
largerThumbnail: false,
}),
}, { quoted: qlocJpm });
};

if (m.message) {
logger.newMessage({
time: moment().tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm:ss'),
msgType: budy ? budy : m.mtype,
senderLabel: pushname,
senderJid: m.sender,
locationLabel: m.isGroup
? `${chalk.blue('Group:')} ${chalk.yellow(groupName)} ${chalk.gray(`(${m.chat})`)}`
: chalk.blue('Private Chat'),
isOwner: isCreator,
});
}

// ============= CEK JAWABAN GAME =============
const gameKey = m.chat || m.key.remoteJid

if (gameSession.has(gameKey) && !isCmd) {
const session = gameSession.get(gameKey)
const jawabanUser = budy.trim().toLowerCase()

const isReplyToGame = m.quoted &&
session.soalMsg?.key?.id &&
m.quoted.id === session.soalMsg.key.id

if (!isReplyToGame) {
} else if (session.isFamily100) {
const idxFound = session.jawabanList.findIndex(
(j, i) => !session.terjawab.has(i) && j === jawabanUser
)
if (idxFound !== -1) {
session.terjawab.add(idxFound)
await vinss.sendMessage(gameKey, { react: { text: '✅', key: m.key } })
await vinss.sendMessage(gameKey, {
text: `✅ @${senderNumber} benar! *${session.allJawaban[idxFound]}*\n📊 Terjawab: ${session.terjawab.size}/${session.jawabanList.length}`,
mentions: [m.sender]
}, { quoted: session.soalMsg })
if (session.terjawab.size === session.jawabanList.length) {
clearTimeout(session.timer)
gameSession.delete(gameKey)
await vinss.sendMessage(gameKey, { text: `🎉 *Semua jawaban berhasil ditemukan!*` })
}
} else {
await vinss.sendMessage(gameKey, { react: { text: '❌', key: m.key } })
await vinss.sendMessage(gameKey, {
text: `❌ *Jawaban salah!* @${senderNumber} Coba lagi!`,
mentions: [m.sender]
}, { quoted: session.soalMsg })
}
return
} else {
// === GAME BIASA: jawaban tunggal ===
const jawabanBenar = session.jawaban.toLowerCase()
const isBenar =
jawabanUser === jawabanBenar ||
(jawabanUser.length >= 3 && jawabanBenar.includes(jawabanUser)) ||
(jawabanBenar.length >= 3 && jawabanUser.includes(jawabanBenar))

if (isBenar) {
clearTimeout(session.timer)
gameSession.delete(gameKey)
await vinss.sendMessage(gameKey, { react: { text: '✅', key: m.key } })
await vinss.sendMessage(gameKey, {
text: `✅ *Jawaban Benar!*\n\n🎉 @${senderNumber} berhasil menjawab!\n💡 Jawaban: *${session.jawaban}*`,
mentions: [m.sender]
}, { quoted: session.soalMsg })
} else {
await vinss.sendMessage(gameKey, { react: { text: '❌', key: m.key } })
await vinss.sendMessage(gameKey, {
text: `❌ *Jawaban salah!*\n\n@${senderNumber} Silahkan jawab lagi! ⏰ Waktu masih ada.`,
mentions: [m.sender]
}, { quoted: session.soalMsg })
}
return
}
}

async function sendconnMessage(chatId, message, options = {}) {
let generate = await generateWAMessage(chatId, message, options);
let type2 = getContentType(generate.message);
if ("contextInfo" in options)
generate.message[type2].contextInfo = options?.contextInfo;
if ("contextInfo" in message)
generate.message[type2].contextInfo = message?.contextInfo;
return await vinss.relayMessage(chatId, generate.message, {
messageId: generate.key.id,
});
}

function GetType(Data) {
return new Promise((resolve, reject) => {
let Result, Status;
if (Buffer.isBuffer(Data)) {
Result = new Buffer.from(Data).toString("base64");
Status = 0;
} else {
Status = 1;
}
resolve({
status: Status,
result: Result,
});
});
}

function randomId() {
return Math.floor(100000 + Math.random() * 900000);
}

function monospace(string) {
return '```' + string + '```'
}

function monospa(string) {
return '`' + string + '`'
}

function getRandomFile(ext) {
return `${Math.floor(Math.random() * 10000)}${ext}`;
}

function randomNomor(min, max = null) {
if (max !== null) {
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min + 1)) + min;
} else {
return Math.floor(Math.random() * min) + 1
}
}

function generateRandomPassword() {
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#%^&*';
const length = 10;
let password = '';
for (let i = 0; i < length; i++) {
const randomIndex = Math.floor(Math.random() * characters.length);
password += characters[randomIndex];
}
return password;
}

function generateRandomNumber(min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}

const prefixOperator = {
telkomsel: ['0811', '0812', '0813', '0821', '0822', '0852', '0853', '0823'],
indosat: ['0814', '0815', '0816', '0855', '0856', '0857', '0858'],
xl: ['0817', '0818', '0819', '0859', '0877', '0878'],
axis: ['0838', '0831', '0832', '0833'],
tri: ['0895', '0896', '0897', '0898', '0899'],
smartfren: ['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888', '0889'],
byu: ['0851']
};

function detectOperator(nomor) {
const prefix = nomor.slice(0, 4);
for (let [operator, daftar] of Object.entries(prefixOperator)) {
if (daftar.includes(prefix)) {
return operator.charAt(0).toUpperCase() + operator.slice(1);
}
}
return 'Tidak diketahui';
}

function makeProgressBar(current, total, length = 20) {
const progress = Math.floor((current / total) * length);
const bar = "▓".repeat(progress) + "░".repeat(length - progress);
return `[${bar}] ${Math.floor((current / total) * 100)}%`;
}

async function listbut2(m, teks, listnye, qtext) {
let msg = generateWAMessageFromContent(m.chat, {
viewOnceMessage: {
message: {
"messageContextInfo": {
"deviceListMetadata": {},
"deviceListMetadataVersion": 2
},
interactiveMessage: proto.Message.InteractiveMessage.create({
contextInfo: {
mentionedJid: [m.sender],
forwardingScore: 999999,
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: idSaluran,
newsletterName: nameSaluran,
serverMessageId: 145
}
},
body: proto.Message.InteractiveMessage.Body.create({
text: teks
}),
footer: proto.Message.InteractiveMessage.Footer.create({
text: `${namabot} By ${ownername}`
}),
header: proto.Message.InteractiveMessage.Header.create({
title: ``,
thumbnailUrl: "",
gifPlayback: true,
subtitle: "",
hasMediaAttachment: true,
...(await prepareWAMessageMedia({ image: { url: randomThumbUrl } }, { upload: vinss.waUploadToServer })),
}),
gifPlayback: true,
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
buttons: [
{
"name": "single_select",
"buttonParamsJson": JSON.stringify(listnye)
}],
}),
})
}
}
}, { quoted: qtext })
await vinss.relayMessage(msg.key.remoteJid, msg.message, {
messageId: msg.key.id
})
}

async function dellCase(filePath, caseNameToRemove) {
fs.readFile(filePath, 'utf8', (err, data) => {
if (err) {
console.error('Terjadi kesalahan:', err);
return;
}

const regex = new RegExp(`case\\s+'${caseNameToRemove}':[\\s\\S]*?break`, 'g');
const modifiedData = data.replace(regex, '');

fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
if (err) {
console.error('Terjadi kesalahan saat menulis file:', err);
return;
}

console.log(`Teks dari case '${caseNameToRemove}' telah dihapus dari file.`);
});
});
}


// ======= AUTO ANTI LINK =======
if (m.isGroup && !isCreator && !isAdmins) {
const waLinkRegex = /(chat\.whatsapp\.com\/(?:invite\/)?[0-9A-Za-z]{20,24}|whatsapp\.com\/channel\/[0-9A-Za-z]+|wa\.me\/(?:\+?[0-9]+|settings)|api\.whatsapp\.com\/send)/i;
if (waLinkRegex.test(body)) {
if (isBotAdmins) {
try {
// Hapus pesan link
await vinss.sendMessage(m.chat, {
delete: {
remoteJid: m.chat,
fromMe: false,
id: m.key.id,
participant: m.sender
}
});

// Peringatan otomatis
await vinss.sendMessage(m.chat, {
text: `⚠️ *ANTI LINK WHATSAPP* ⚠️\n\nMaaf @${senderNumber}, dilarang mengirimkan link WhatsApp (Grup / Saluran / wa.me) di grup ini! Pesan kamu telah dihapus otomatis.`,
mentions: [m.sender]
});
return;
} catch (e) {
console.error("Gagal hapus pesan antilink:", e);
}
}
}
}

// ======= ANTI SPAM (PER USER) =======
if (global.antispam && !isCreator && !fromMe) {
  global.spamMap = global.spamMap || {}
  
  const now = Date.now()
  const userKey = m.sender
  const last = global.spamMap[userKey]?.last || 0
  const count = global.spamMap[userKey]?.count || 0
  
  // Reset tiap 5 detik
  if (now - last > 5000) {
    global.spamMap[userKey] = { last: now, count: 0 }
  } else {
    const newCount = count + 1
    global.spamMap[userKey] = { last: now, count: newCount }
    
    // Kalau > 5x dalam 5 detik
    if (newCount > 5) {
      await vinss.sendMessage(m.chat, {
        text: `🚫 @${senderNumber} *JANGAN SPAM!* Tunggu 5 detik.`,
        mentions: [m.sender]
      })
      return  // ✅ stop handler
    }
  }
}

// ======= ANTI TOXIC =======
if (m.isGroup && global.db.data.chats?.[m.chat]?.antitoxic && !isAdmins && !isCreator && !fromMe) {
  const badwords = global.db.data.badwords || []
  const foundBadword = badwords.find(w => body.toLowerCase().includes(w.toLowerCase()))
  
  if (foundBadword && isBotAdmins) {
    try {
      await vinss.sendMessage(m.chat, { delete: m.key })
      await vinss.sendMessage(m.chat, {
        text: `⚠️ @${senderNumber} jangan toxic ya!\nKata yang dilarang: *${foundBadword}*`,
        mentions: [m.sender]
      })
      return  // ✅ stop handler
    } catch (e) {
      console.error("antitoxic error:", e.message)
    }
  }
}

// ======= AUTO STICKER =======
if (
  global.autosticker &&
  !isCmd &&
  !fromMe &&
  !m.key.fromMe &&
  mime && 
  mime.startsWith('image/')  // ✅ cek mime start dengan image/
) {
  // ✅ Skip kalau dari bot sendiri
  const botJid = (vinss.user.id || '').split(':')[0] + '@s.whatsapp.net'
  const senderJid = (m.sender || '').split(':')[0] + '@s.whatsapp.net'
  
  if (botJid !== senderJid) {
    try {
      const mediaPath = await vinss.downloadAndSaveMediaMessage(qmsg)
      
      // ✅ PAKAI `sendMessage` langsung — BUKAN `sendImageAsSticker` (yang bisa loop)
      const buffer = fs.readFileSync(mediaPath)
      
      await vinss.sendMessage(m.chat, {
        sticker: buffer
      }, { quoted: m })
      
      try { fs.unlinkSync(mediaPath) } catch {}
      return  // ✅ WAJIB RETURN biar gak lanjut ke switch
      
    } catch (e) {
      console.error("autosticker error:", e.message)
      return  // ✅ RETURN walaupun error
    }
  }
}

// ========== AUTO-REPLY CONFESS  ==========//
if (!isCmd && budy.trim() && !fromMe) {
const senderNum = m.sender.split("@")[0]
const activeSessId = confessUserMap.get(senderNum)

if (activeSessId) {
const sess = confessSession.get(activeSessId)

if (sess && sess.active) {
// Tentukan role & lawan
const isSenderRole = sess.from === m.sender
const isTargetRole = sess.to === m.sender

if (isSenderRole || isTargetRole) {
const lawan = isSenderRole ? sess.to : sess.from
const pesanBalasan = budy.trim()

// Update lastActive
sess.lastActive = Date.now()

// React biar user tahu pesan terkirim
await vinss.sendMessage(m.chat, { react: { text: "📨", key: m.key } }).catch(() => {})

// Kirim ke lawan
try {
const sent = await vinss.sendMessage(lawan, {
text:
`💬 *BALASAN CONFESS*\n` +
`━━━━━━━━━━━━━━━━━━━━━━\n\n` +
`👤 *Dari:* ${isSenderRole ? sess.targetName : sess.fromName}\n` +
`💬 *Pesan:*\n${pesanBalasan}\n\n` +
`━━━━━━━━━━━━━━━━━━━━━━\n` +
`🆔 \`${activeSessId}\`\n\n` +
`_Balas langsung untuk lanjut chat_\n` +
`_Ketik .stopconfess untuk berhenti_`,
contextInfo: previewAd({
title: `💬 Balasan Confess`,
body: `Session ${activeSessId}`,
thumbnail: global.img,
sourceUrl: global.web,
forward: true,
})
})

// Update mapping biar lawan bisa balas tanpa reply juga
const lawanNum = lawan.split("@")[0]
confessUserMap.set(lawanNum, activeSessId)

// Konfirmasi pengirim
await vinss.sendMessage(m.chat, {
text: `✅ Pesan terkirim ke ${isSenderRole ? "target" : "pengirim"}.`,
mentions: [m.sender]
}).catch(() => {})

} catch (err) {
console.error("confess auto-reply error:", err.message)
await vinss.sendMessage(m.chat, {
text: `❌ Gagal kirim balasan: ${err.message}`
}).catch(() => {})
}

return // STOP handler biar gak lanjut ke command lain
}
}
}
}

// =================== HANDLER REPLY MENFESS (WAJIB REPLY) ===================
if (!isCmd && budy.trim() && !fromMe && m.quoted) {
const quotedId = m.quoted.id
  
// Cari session menfess yang msgId-nya match
let sessId = null
for (const [id, s] of menfessSession.entries()) {
if (s.msgId === quotedId && s.active) {
sessId = id
break
}
}
  
if (sessId) {
const sess = menfessSession.get(sessId)
  
// Jangan biarin pengirim balas menfess sendiri
if (sess.from === m.sender) {
return reply("❌ Kamu pengirim menfess ini, gak bisa balas sendiri 😅")
}
  
const pesanBalasan = budy.trim()
  
await vinss.sendMessage(m.chat, { react: { text: "📨", key: m.key } }).catch(() => {})
  
sess.replies.push({
from: m.sender,
name: pushname,
pesan: pesanBalasan,
time: Date.now()
})
sess.lastActive = Date.now()
  
// Simpan mapping biar user ini bisa lanjut chat di DM dengan pengirim
menfessReplyMap.set(m.sender.split("@")[0], sessId)
  
try {
const sent = await vinss.sendMessage(sess.from, {
text:
`💬 *BALASAN MENFESS*\n` +
`━━━━━━━━━━━━━━━━━━━━━━\n\n` +
`🆔 \`${sessId}\`\n` +
`👤 *Dari:* ${pushname}\n` +
`📍 *Grup:* ${groupName || "-"}\n` +
`💬 *Pesan:*\n${pesanBalasan}\n\n` +
`━━━━━━━━━━━━━━━━━━━━━━\n` +
`_Balas langsung untuk lanjut chat_\n` +
`_Ketik .stopmenfess ${sessId} untuk tutup_`,
contextInfo: previewAd({
title: `💬 Balasan Menfess`,
body: `Dari ${pushname}`,
thumbnail: global.img,
sourceUrl: global.web,
forward: true,
})
})
  
// Track supaya pengirim bisa balas lagi tanpa reply
menfessReplyMap.set(sess.from.split("@")[0], sessId)
  
await vinss.sendMessage(m.chat, {
text: `✅ Balasan terkirim ke pengirim menfess (anonymous).`,
mentions: [m.sender]
}).catch(() => {})
  
} catch (err) {
console.error("menfess reply error:", err.message)
}
  
return
}
}

// =================== AUTO-REPLY MENFESS (SETELAH REPLY PERTAMA) ===================
if (!isCmd && budy.trim() && !fromMe && !budy.startsWith("#")) {
const senderNum = m.sender.split("@")[0]
const sessId = menfessReplyMap.get(senderNum)
  
if (sessId) {
const sess = menfessSession.get(sessId)
  
if (sess && sess.active) {
const pesanBalasan = budy.trim()
  
await vinss.sendMessage(m.chat, { react: { text: "📨", key: m.key } }).catch(() => {})
  
sess.replies.push({
from: m.sender,
name: pushname,
pesan: pesanBalasan,
time: Date.now()
})
sess.lastActive = Date.now()
  
// Kirim ke lawan
const lawan = sess.from === m.sender
? sess.replies.find(r => r.from !== sess.from)?.from || null
: sess.from
  
if (lawan) {
try {
await vinss.sendMessage(lawan, {
text:
`💬 *BALASAN MENFESS*\n` +
`━━━━━━━━━━━━━━━━━━━━━━\n\n` +
`🆔 \`${sessId}\`\n` +
`👤 *Dari:* ${pushname}\n` +
`💬 *Pesan:*\n${pesanBalasan}\n\n` +
`_Balas langsung untuk lanjut chat_`,
contextInfo: previewAd({
title: `💬 Balasan Menfess`,
body: `Session ${sessId}`,
thumbnail: global.img,
sourceUrl: global.web,
forward: true,
})
})
  
// Update mapping lawan juga
menfessReplyMap.set(lawan.split("@")[0], sessId)
  
await vinss.sendMessage(m.chat, {
text: `✅ Terkirim.`,
mentions: [m.sender]
}).catch(() => {})
} catch (err) {
console.error("menfess auto-reply error:", err.message)
}
}
  
return
}
}
}

// ═══════════════════════════════════════════════════════
// 🤖 AI MODE AUTO-REPLY HANDLER ← TAMBAHKAN BLOK INI
// ═══════════════════════════════════════════════════════
if (
  global.aiModeConfig?.enabled &&
  !isCmd &&
  budy &&
  budy.trim() &&
  !m.key?.fromMe
) {
  try {
    // Panggil handler AI
    const replied = await handleAiAutoReply(vinss, m, previewAd)
    if (replied) {
      return // STOP handler biar gak lanjut ke switch
    }
  } catch (err) {
    console.error("[AI-MODE-HOOK] error:", err.message)
  }
}

if (isCmd) {

switch (command) {
case "menu": {
const _caseContent = fs.readFileSync('./case.js', 'utf-8')
const _caseRegex = /case\s+["']([^"']+)["']\s*:/g
const _allCases = new Set()

let _m
while ((_m = _caseRegex.exec(_caseContent)) !== null) {
_allCases.add(_m[1])
}

const _excluded = new Set([
'default',
'undefined',
'null',
'0',
'1',
'2',
'3',
'4',
'5'
])

const _totalFitur = [..._allCases]
.filter(c => !_excluded.has(c))
.length


// ==========================================
// USER
// ==========================================
const nomorUser = m.sender.split("@")[0]
const mentionUser = `@${nomorUser}`


// ==========================================
// PROGRESS BAR
// ==========================================
function makeProgressBar(current, total, length = 20) {
const progress = Math.min(
length,
Math.floor((current / total) * length)
)

const bar =
"▓".repeat(progress) +
"░".repeat(length - progress)

return `[${bar}] ${Math.floor((current / total) * 100)}%`
}


// ==========================================
// PESAN PROGRESS AWAL
// ==========================================
let progressMsg = await vinss.sendMessage(m.chat, {
text: `
╭━━━〔 ⏳ LOADING MENU 〕━━━╮
│
│${makeProgressBar(0, 100)}
│
│⚡ Menyiapkan menu...
│◌ Mohon tunggu sebentar
│
╰━━━━━━━━━━━━━━━━━━━━━━╯
`
}, {
quoted: qVinss
})


// ==========================================
// ANIMASI PROGRESS
// ==========================================
const progressSteps = [
{ percent: 10, text: "Memuat konfigurasi..." },
{ percent: 25, text: "Memuat fitur bot..." },
{ percent: 40, text: "Memuat downloader..." },
{ percent: 55, text: "Memuat tools..." },
{ percent: 70, text: "Memuat AI & game..." },
{ percent: 85, text: "Menyiapkan tampilan..." },
{ percent: 95, text: "Hampir selesai..." },
{ percent: 100, text: "Menu berhasil dimuat!" }
]

for (const step of progressSteps) {

await new Promise(resolve =>
setTimeout(resolve, 350)
)

const progressText = `
╭━━━〔 ⏳ LOADING MENU 〕━━━╮
│
│${makeProgressBar(step.percent, 100)}
│
│⚡ ${step.text}
│
│${step.percent === 100
? "✓ Loading selesai!"
: "◌ Please wait..."}
│
╰━━━━━━━━━━━━━━━━━━━━━━╯
`

try {
await vinss.sendMessage(m.chat, {
text: progressText,
edit: progressMsg.key
})
} catch (err) {
// fallback jika edit tidak didukung
console.log("Gagal edit progress:", err.message)
}
}


// ==========================================
// TUNGGU SEBENTAR AGAR 100% TERLIHAT
// ==========================================
await new Promise(resolve =>
setTimeout(resolve, 500)
)


// ==========================================
// HAPUS PESAN PROGRESS
// ==========================================
try {
await vinss.sendMessage(m.chat, {
delete: progressMsg.key
})
} catch (err) {
console.log("Gagal menghapus progress:", err.message)
}


// ==========================================
// MENU UTAMA
// ==========================================
let teksmenu = `
👋 Halo ${mentionUser}!
🌙 ${timewisher}!

◆ Creator: ${ownername}
◆ Number : ${global.ownernumber}
◆ Bot Name : ${global.namabot}
◆ Total Fitur : ${_totalFitur} Fitur
◆ Version: v${version}
◆ Mode : ${global.botMode ? '◉ Public' : '◉ Self'}
◆ Runtime: ${runtime(process.uptime())}

╭─────────────────────➤
│╭─▣「 *Cнαииєℓ Mєиυ* 」▣─╮
││ ⟿ .cekidch
│╰─➤
│
│╭─▣「 *Gяσυp Mєиυ* 」▣─╮
││ ⟿ .delete
││ ⟿ .leavegc
││ ⟿ .leavegc2
││ ⟿ .promote
││ ⟿ .demote
││ ⟿ .kick
││ ⟿ .hidetag
││ ⟿ .tagall
││ ⟿ .welcome
││ ⟿ .goodbye
││ ⟿ .upswgc
││ ⟿ .setdesc
││ ⟿ .setname
││ ⟿ .setppgc
││ ⟿ .revoke
││ ⟿ .mutegc
││ ⟿ .setwelcome
││ ⟿ .setgoodbye
││ ⟿ .infogc
││ ⟿ .listadmin
││ ⟿ .listmember
││ ⟿ .vote
││ ⟿ .hasilpoll
│╰─➤
│
│╭─▣「 *Iѕℓαмιc Mєиυ* 」▣─╮
││ ⟿ .kisahnabi
││ ⟿ .asmaulhusna
││ ⟿ .ayatkursi
││ ⟿ .bacaansholat
││ ⟿ .doaharian
││ ⟿ .salam
││ ⟿ .niatsholat
││ ⟿ .quotesislami
│╰─➤
│
│╭─▣「 *Rαиdσм Mєиυ* 」▣─╮
││ ⟿ .bluearchive
││ ⟿ .loli
││ ⟿ .getpp
││ ⟿ .meme
││ ⟿ .remini
││ ⟿ .waifu
││ ⟿ .gunung
││ ⟿ .hacker
││ ⟿ .wptechnology
││ ⟿ .wpaesthetic
││ ⟿ .wpgame
│╰─➤
│
│╭─▣「 *Sтι¢кєя Mєиυ* 」▣─╮
││ ⟿ .sticker
││ ⟿ .smeme
│╰─➤
│
│╭─▣「 *Dσωиlσαdєя Mєиυ* 」▣─╮
││ ⟿ .play
││ ⟿ .capcut
││ ⟿ .douyin
││ ⟿ .fbdl
││ ⟿ .gdrive
││ ⟿ .igdl
││ ⟿ .mediafire
││ ⟿ .spdl
││ ⟿ .ttdl
││ ⟿ .twitter
│╰─➤
│
│╭─▣「 *Sтαℓкєя Mєиυ* 」▣─╮
││ ⟿ .threads
││ ⟿ .tiktokstalk
││ ⟿ .twitter (stalk)
││ ⟿ .ytstalk
││ ⟿ .github
││ ⟿ .npm
││ ⟿ .cekml
│╰─➤
│
│╭─▣「 *Mαкєя Mєиυ* 」▣─╮
││ ⟿ .attp
││ ⟿ .brat
││ ⟿ .bratvid
││ ⟿ .iqc
││ ⟿ .qc
││ ⟿ .emojimix
││ ⟿ .toanime
││ ⟿ .tobotak
││ ⟿ .tofigura
│╰─➤
│
│╭─▣「 *Oωиєя Mєиυ* 」▣─╮
││ ⟿ .self
││ ⟿ .public
││ ⟿ .maintenance
││ ⟿ .reload
││ ⟿ .clearcache
││ ⟿ .botstat
││ ⟿ .backup
││ ⟿ .restoredb
││ ⟿ .eval
││ ⟿ .listgc
││ ⟿ .leavegc2 
││ ⟿ .cekidgc
││ ⟿ .createch 
││ ⟿ .broadcast
││ ⟿ .addmoney
││ ⟿ .addlimit
││ ⟿ .resetuser
││ ⟿ .setsaluran
││ ⟿ .setthumb
││ ⟿ .listuserrpg
││ ⟿ .ban
││ ⟿ .unban
││ ⟿ .listban
││ ⟿ .addpremium
││ ⟿ .delpremium
││ ⟿ .blacklist
││ ⟿ .unblacklist
││ ⟿ .listblcmd
│╰─➤
│
│╭─▣「 *Cσntrσl Mєиυ* 」▣─╮
││ ⟿ .addcase
││ ⟿ .addtoxic
││ ⟿ .ambilq
││ ⟿ .autosticker
││ ⟿ .anticall
││ ⟿ .antispam
││ ⟿ .antitoxic
││ ⟿ .autoread
││ ⟿ .autoreadsw
││ ⟿ .autojoingc
││ ⟿ .delcase
││ ⟿ .deltoxic
││ ⟿ .getcase
││ ⟿ .joingc
││ ⟿ .runtime
││ ⟿ .setbiobot
││ ⟿ .setnamabot
││ ⟿ .setppbot
││ ⟿ .setting
│╰─➤
│
│╭─▣「 *Cσnvєrtєя Mєиυ* 」▣─╮
││ ⟿ .toaudio
││ ⟿ .toimg
││ ⟿ .tovid
││ ⟿ .tourl
│╰─➤
│
│╭─▣「 *Sєαя¢н Mєиυ* 」▣─╮
││ ⟿ .applemusic
││ ⟿ .berita
││ ⟿ .brainly
││ ⟿ .giphy
││ ⟿ .githubsearch
││ ⟿ .grubwa
││ ⟿ .happymodsearch
││ ⟿ .jobstreet
││ ⟿ .komikindo
││ ⟿ .komikdetail
││ ⟿ .komikdownload
││ ⟿ .linesticker
││ ⟿ .netflix tv / films
││ ⟿ .npmsearch
││ ⟿ .pinterest
││ ⟿ .playstore
││ ⟿ .snackvideo
││ ⟿ .twibbon
││ ⟿ .webtoon
││ ⟿ .yts
││ ⟿ .ytshorts
│╰─➤
│
│╭─▣「 *Tσσℓѕ Mєиυ* 」▣─╮
││ ⟿ .makeapk
││ ⟿ .webclone
││ ⟿ .jsenc
││ ⟿ .lirik
││ ⟿ .tempmail
││ ⟿ .cekmail
││ ⟿ .bacamail
││ ⟿ .rvo
│╰─➤
│
│╭─▣「 *AI Mєиυ* 」▣─╮
││ ⟿ .deepseek
││ ⟿ .gpt
││ ⟿ .ai
│╰─➤
│
│╭─▣「 *RPG Mєиυ* 」▣─╮
││ ⟿ .daftar <nama>
││ ⟿ .profil
││ ⟿ .daily
││ ⟿ .kerja <pekerjaan>
││ ⟿ .nebang
││ ⟿ .mulung
││ ⟿ .mining
││ ⟿ .berburu
││ ⟿ .polisi
││ ⟿ .taxy
││ ⟿ .berdagang @user
││ ⟿ .merampok @user
││ ⟿ .casino <jumlah>
││ ⟿ .slot
││ ⟿ .bansos
││ ⟿ .nabung <jumlah>
││ ⟿ .bankcek
││ ⟿ .buy <item> <jumlah>
││ ⟿ .transfer <tipe> @user <jumlah>
││ ⟿ .leaderboard <type>
││ ⟿ .fightnaga
││ ⟿ .fightkyubi
││ ⟿ .fightphonix
││ ⟿ .fightkucing
││ ⟿ .fightgriffin
││ ⟿ .fightcentaur
│╰─➤
│
│╭─▣「 *Gαмє Mєиυ* 」▣─╮
││ ⟿ .spacerush
││ ⟿ .catur
││ ⟿ .tictactoe
││ ⟿ .asahotak
││ ⟿ .caklontong
││ ⟿ .cc
││ ⟿ .family100
││ ⟿ .maths
││ ⟿ .siapakahaku
││ ⟿ .susunkata
││ ⟿ .tebakanime
││ ⟿ .tebakbendera
││ ⟿ .tebakff
││ ⟿ .tebakgambar
││ ⟿ .tebakgame
││ ⟿ .tebakherml
││ ⟿ .tebakkalimat
││ ⟿ .tebakkata
││ ⟿ .tebakkimia
││ ⟿ .tebakpembola
││ ⟿ .tebaksurah
││ ⟿ .tekateki
│╰─➤
│
│╭==⊱ *Official Source* ▣─╮
││↻ YouTube: Vinss Students (@VinssBotz)
││↻ .owner — Hubungi Developer
│╰───➤
╰─────┈➤

⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕
『 *© 2026 Vinss Students* 』
`

// ==========================================
// KIRIM MENU
// ==========================================
await vinss.sendMessage(m.chat, {
text: teksmenu,
mentions: [m.sender],
contextInfo: previewAd({
title: `© ${namabot} - v${version}`,
body: `Made by ${ownername}.`,
thumbnail: randomThumbUrl,
sourceUrl: global.web,
mention: [m.sender],
forward: true,
largerThumbnail: true,
})
}, {
quoted: qVinss
})

}
break
case "upswgc":
case "swgc":
case "swgrup": {
if (!m.isGroup) return reply(mess.group);
if (!isAdmins) return reply(mess.admin);
if (!isBotAdmins) return reply(mess.botAdmin);

const qmsg = m.quoted ? m.quoted : m;
const mime = (qmsg.msg || qmsg).mimetype || "";
const caption = text.replace(new RegExp(`^${prefix + command}\\s*`, "i"), "").trim();

try {
if (!mime && !caption) {
return example(`Halo semua (opsional reply media)`);
}
async function groupStatus(sock, jid, content) {
const { backgroundColor } = content;
delete content.backgroundColor;

const inside = await generateWAMessageContent(content, {
upload: sock.waUploadToServer,
backgroundColor
});

const messageSecret = crypto.randomBytes(32);

const msg = generateWAMessageFromContent(
jid,
{
messageContextInfo: { messageSecret },
groupStatusMessageV2: {
message: {
...inside,
messageContextInfo: { messageSecret }
}
}
},
{}
);

await sock.relayMessage(jid, msg.message, {
messageId: msg.key.id
});

return msg;
}

let payload = {};

if (/image/.test(mime)) {
const buffer = await qmsg.download();
payload = {
image: buffer,
caption
};
}
else if (/video/.test(mime)) {
const buffer = await qmsg.download();
payload = {
video: buffer,
caption
};
}
else if (/audio/.test(mime)) {
const buffer = await qmsg.download();
payload = {
audio: buffer,
mimetype: "audio/mp4"
};
}
else if (caption) {
payload = {
text: caption
};
}

await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

await groupStatus(vinss, m.chat, payload);

m.reply("✅ Status grup berhasil diposting.");

} catch (err) {
console.error("upswgc error:", err);
m.reply("❌ Gagal upload status grup.", err);
}
}
break
case "emojimix": {
if (!text) return example("😭+😂");

let [emoji1, emoji2] = text.split("+");
if (!emoji1 || !emoji2) return example("😭+😂");

await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

try {
const apiUrl = `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`;

const { data } = await axios.get(apiUrl);

if (!data?.results?.length) {
return m.reply("❌ Emoji mix tidak ditemukan.");
}

const imgUrl = data.results[0].media_formats.png_transparent.url;

const res = await axios.get(imgUrl, { responseType: "arraybuffer" });
const buffer = Buffer.from(res.data);

const tempFile = `./database/emojimix-${Date.now()}.png`;
await fs.promises.writeFile(tempFile, buffer);

await vinss.sendImageAsSticker(
m.chat,
tempFile,
m,
{ packname: global.packname, author: global.author }
);

try { fs.unlinkSync(tempFile); } catch { }

} catch (err) {
console.error("emojimix cmd error:", err);
m.reply("❌ Gagal membuat emoji mix.");
}
}
break
case "iqc": {
if (!text) return example("teks nya");

await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

try {
let jam = new Date().toLocaleTimeString("id-ID", {
timeZone: "Asia/Jakarta",
hour: "2-digit",
minute: "2-digit"
});

let batre = Math.floor(Math.random() * 90) + 5;

const apiUrl = `https://api-faa.my.id/faa/iqcv2?prompt=${encodeURIComponent(text)}&jam=${encodeURIComponent(jam)}&batre=${batre}`;

const res = await axios.get(apiUrl, {
responseType: "arraybuffer"
});

const buffer = Buffer.from(res.data);

await vinss.sendMessage(m.chat, {
image: buffer,
caption: `🖼️ *Image Quote Creator*\n\n"${text}"`
}, { quoted: m });

} catch (err) {
console.error("iqc cmd error:", err);
m.reply("❌ Gagal membuat image quote.");
}
}
break

case "getpp": {
if (!m.quoted && !m.mentionedJid?.length) {
return example(`Tag atau reply user target.\n\nContoh: *${prefix + command} @user*`)
}

await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } })

try {
let target
if (m.quoted) {
target = m.quoted.sender
} else if (m.mentionedJid?.length) {
target = m.mentionedJid[0]
} else {
target = m.sender
}
let no = target.split("@")[0]
let pp
try {
pp = await vinss.profilePictureUrl(target, "image")
} catch {
return m.reply("❌ User tidak punya foto profil atau disembunyikan.")
}

await vinss.sendMessage(
m.chat,
{
image: { url: pp },
caption: `✅ Foto profil @${no}`,
mentions: [target]
},
{ quoted: m }
)

} catch (err) {
console.error(err)
m.reply("❌ Gagal mengambil foto profil.")
}
}
break

// =================== MEME ===================
case "meme": {
await vinss.sendMessage(m.chat, { react: { text: "😂", key: m.key } })
try {
const res = await axios.get("https://api-faa.my.id/faa/meme", {
responseType: "arraybuffer",
timeout: 15000
})
const buffer = Buffer.from(res.data)
await vinss.sendMessage(m.chat, {
image: buffer,
caption: "😂 *Random Meme*"
}, { quoted: m })
} catch (err) {
console.error("meme cmd error:", err)
m.reply(`❌ Gagal mengambil meme: ${err.message}`)
}
}
break

case "waifu": {
await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } })

try {
let res = await axios.get("https://api.ryuu-dev.offc.my.id/random/waifupic", {
responseType: "arraybuffer"
})
let buffer = Buffer.from(res.data)

await vinss.sendMessage(
m.chat,
{ image: buffer, caption: "✅ *Random Waifu Pic* 💮" },
{ quoted: m }
)
} catch (err) {
console.error(err)
m.reply(`❌ Error: ${err.message}`)
}
}
break


case "bluearchive":
case "ba": {
await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } })

try {
let res = await axios.get("https://api.deline.web.id/random/ba", {
responseType: "arraybuffer"
})
let buffer = Buffer.from(res.data)

await vinss.sendMessage(
m.chat,
{ image: buffer, caption: "✅ *Random Blue Archive Waifu*" },
{ quoted: m }
)
} catch (err) {
console.error(err)
m.reply(`❌ Error: ${err.message}`)
}
}
break

case "loli": {
await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } })
try {
let res = await axios.get("https://api.deline.web.id/random/loli", {
responseType: "arraybuffer"
})
let buffer = Buffer.from(res.data)
await vinss.sendMessage(
m.chat,
{ image: buffer, caption: "✅ *Random Loli* 🎀" },
{ quoted: m }
)
} catch (err) {
console.error(err)
m.reply(`❌ Error: ${err.message}`)
}
}
break


case "play": {
if (!text) return example(`cinta`);
if (!text.includes("|")) {
return await vinss.sendButton(m.chat, {
text: `🎧 Pilih sumber musik untuk:\n*${text}*`,
footer: global.foother,
buttons: [
{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: "▶ YouTube",
id: `.play yt|${text}`
})
},
{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: "☁ SoundCloud",
id: `.play soundcloud|${text}`
})
}
]
}, { quoted: m });
}
const [source, ...queryArr] = text.split("|");
const query = queryArr.join("|").trim().toLowerCase();

if (!query) return m.reply("❌ Query lagu tidak boleh kosong.");

await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

try {
let info, audioUrl, thumbnail, title, artist, sourceUrl;
if (source === "yt" || source === "youtube") {
const apiUrl = `https://api-faa.my.id/faa/ytplay?query=${encodeURIComponent(query)}`;
const { data } = await axios.get(apiUrl);

if (!data.status) return m.reply("❌ Lagu tidak ditemukan di YouTube.");

const res = data.result;
audioUrl = res.mp3;
thumbnail = res.thumbnail;
title = res.title;
artist = res.author;
sourceUrl = res.url;
}
else if (source === "soundcloud" || source === "sc") {
const apiUrl = `https://api-faa.my.id/faa/soundcloud-play?query=${encodeURIComponent(query)}`;
const { data } = await axios.get(apiUrl);

if (!data.status) return m.reply("❌ Lagu tidak ditemukan di SoundCloud.");

const res = data.result;
audioUrl = res.download_url;
thumbnail = res.thumbnail;
title = res.title;
artist = res.user;
sourceUrl = res.source_url;
}

else {
return m.reply("❌ Sumber tidak dikenal. Gunakan: yt | spotify | soundcloud");
}
await vinss.sendMessage(m.chat, {
text:
`🎵 *PLAY MUSIC*

📌 Judul : ${title}
🎤 Artis : ${artist}

🔗 Sumber:
${sourceUrl}`,
contextInfo: previewAd({
title,
body: artist,
thumbnail,
sourceUrl,
largerThumbnail: true,
})
}, { quoted: m });
await vinss.sendMessage(m.chat, {
audio: { url: audioUrl },
mimetype: "audio/mpeg",
ptt: false
}, { quoted: m });

} catch (err) {
console.error("play cmd error:", err);
m.reply("❌ Terjadi kesalahan saat memutar lagu.");
}
}
break

case "capcut": {
if (!text) return example(`https://www.capcut.com/tv2/ZSSCR6UFU/`);
if (!/^https?:\/\/(www\.)?capcut\.com\/.+/i.test(text)) {
return m.reply("❌ URL CapCut tidak valid.");
}

await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

try {
const res = await capcutDl(text);

await vinss.sendMessage(m.chat, {
video: { url: res.videoUrl },
caption: `✅ *CapCut Downloader*\n\n🎬 *Judul:* ${res.title}`
}, { quoted: m });

} catch (err) {
console.error("capcut cmd error:", err);
m.reply(`❌ Gagal download CapCut: ${err.message}`);
}
}
break

case "twitter":
case "twitdl": {
if (!text) return example(`https://twitter.com/9GAG/status/1661175429859012608`);
if (!/^https?:\/\/(www\.)?(twitter|x)\.com\/.+/i.test(text)) {
return m.reply("❌ URL Twitter/X tidak valid.");
}

await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

try {
const apiUrl = `https://api.siputzx.my.id/api/d/twitter?url=${encodeURIComponent(text)}`;
const { data } = await axios.get(apiUrl);

if (!data.status || !data.data || !data.data.downloadLink) {
return m.reply("❌ Gagal mengambil media dari Twitter.");
}

const { downloadLink, imgUrl, videoTitle, videoDescription } = data.data;

await vinss.sendMessage(
m.chat,
{
video: { url: downloadLink },
caption: `✅ *Twitter Video Downloaded*\n\n🎬 Title: ${videoTitle || "-"}\n📝 Desc: ${videoDescription || "-"}`
},
{ quoted: m }
);

} catch (err) {
console.error(err);
m.reply(`❌ Error: ${err.message}`);
}
}
break

// =================== DOUYIN ===================
case "douyin":
case "dy": {
if (!text) return example(`https://v.douyin.com/iPHW24DE/`)
if (!/^https?:\/\/.+/i.test(text)) return m.reply("❌ URL tidak valid.")

await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } })

try {
const { data } = await axios.get(
`https://api.deline.web.id/downloader/douyin?url=${encodeURIComponent(text)}`,
{ headers: { 'User-Agent': 'Mozilla/5.0' } }
)

if (!data.status) throw new Error('Gagal mengambil data')

const d = data.result?.data
if (!d || !d.medias?.length || data.result?.error) {
return m.reply("❌ Tidak ada media yang ditemukan di URL tersebut.")
}

const media = d.medias[0]
const cap = `✅ *Douyin Downloader*\n\n🎬 *Judul:* ${d.title || '-'}`

if (/video/i.test(media.type || '') || media.url?.includes('.mp4')) {
await vinss.sendMessage(m.chat, {
video: { url: media.url },
caption: cap
}, { quoted: m })
} else {
await vinss.sendMessage(m.chat, {
audio: { url: media.url },
mimetype: 'audio/mpeg',
caption: cap
}, { quoted: m })
}

} catch (err) {
console.error("douyin cmd error:", err)
m.reply(`❌ Gagal download Douyin: ${err.message}`)
}
}
break

// =================== GOOGLE DRIVE ===================
case "gdrive":
case "googledrive": {
if (!text) return example(`https://drive.google.com/file/d/xxxxx/view`)
if (!/drive\.google\.com/i.test(text)) return m.reply("❌ URL Google Drive tidak valid.")

await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } })

try {
const { data } = await axios.get(
`https://api.deline.web.id/downloader/gdrive?url=${encodeURIComponent(text)}`,
{ headers: { 'User-Agent': 'Mozilla/5.0' } }
)

if (!data.status || !data.result?.downloadUrl) throw new Error('Gagal mengambil link download')

const d = data.result
await vinss.sendMessage(m.chat, {
text: `✅ *Google Drive Downloader*\n\n` +
`📄 *Nama File:* ${d.fileName || '-'}\n` +
`📦 *Ukuran:* ${d.fileSize || '-'}\n` +
`📂 *Tipe:* ${d.mimetype || '-'}\n\n` +
`🔗 *Link Download:*\n${d.downloadUrl}`
}, { quoted: m })

} catch (err) {
console.error("gdrive cmd error:", err)
m.reply(`❌ Gagal mengambil link GDrive: ${err.message}`)
}
}
break

case "fbdl":
case "fb":
case "facebook": {
if (!text) return example(`https://www.facebook.com/watch?v=123456789`);
if (!/^https?:\/\/(www\.)?(facebook\.com|fb\.watch|fb\.com)\/.+/i.test(text)) {
return m.reply("❌ URL Facebook tidak valid.");
}

await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

try {
const res = await fbdl(text);

const cap = `✅ *Facebook Downloader*\n\n` +
`🎬 *Judul:* ${res.title}\n` +
(res.duration ? `⏱ *Durasi:* ${res.duration}\n` : '');

await vinss.sendMessage(m.chat, {
video: { url: res.downloadUrl },
caption: cap
}, { quoted: m });

} catch (err) {
console.error("fbdl cmd error:", err);
m.reply(`❌ Gagal download Facebook: ${err.message}`);
}
}
break

case "igdl": {
if (!text) return example(`https://www.instagram.com/reel/DMNiqN2TV3v/`);

if (!/^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/.+/i.test(text)) {
return m.reply("❌ URL Instagram tidak valid.");
}

await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

try {
const apiUrl = `https://api-faa.my.id/faa/igdl?url=${encodeURIComponent(text)}`;
const { data } = await axios.get(apiUrl);

if (!data.status || !data.result || !data.result.url || !data.result.url.length) {
return m.reply("❌ Gagal mengambil media dari Instagram.");
}

const { url: medias, metadata } = data.result;

for (let mediaUrl of medias) {
if (metadata.isVideo || mediaUrl.includes(".mp4")) {

await vinss.sendMessage(
m.chat,
{
video: { url: mediaUrl },
caption: `✅ Instagram Video berhasil didownload.\n\n👤 ${metadata.username}\n❤️ ${metadata.like}\n💬 ${metadata.comment}`
},
{ quoted: m }
);
} else {

await vinss.sendMessage(
m.chat,
{
image: { url: mediaUrl },
caption: `✅ Instagram Photo berhasil didownload.\n\n👤 ${metadata.username}\n❤️ ${metadata.like}\n💬 ${metadata.comment}`
},
{ quoted: m }
);
}

await sleep(1500);
}

} catch (err) {
console.error(err);
m.reply(`❌ Error: ${err.message}`);
}
}
break

case "spotify": {
if (!text) return example(`https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh`);
if (!/^https?:\/\/(open|play)\.spotify\.com\/.+/i.test(text)) {
return m.reply("❌ URL Spotify tidak valid.");
}

await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

try {
const apiUrl = `https://api.siputzx.my.id/api/d/spotifyv2?url=${encodeURIComponent(text)}`;
const { data } = await axios.get(apiUrl);

if (!data.status || !data.data) return m.reply("❌ Gagal mengambil detail lagu dari Spotify.");

const track = data.data;

let cap = `🎶 *Spotify Downloader*\n\n`;
cap += `🎵 Judul: *${track.songTitle}*\n`;
cap += `👤 Artis: *${track.artist}*\n`;
cap += `🔗 [Link Asli](${track.url})\n\n`;
cap += `✅ Lagu berhasil didownload!`;

await vinss.sendMessage(
m.chat,
{
audio: { url: track.mp3DownloadLink },
mimetype: "audio/mpeg",
fileName: `${track.songTitle}.mp3`,
ptt: false
},
{ quoted: m }
);

await vinss.sendMessage(
m.chat,
{
image: { url: track.coverImage },
caption: cap
},
{ quoted: m }
);

} catch (err) {
console.error(err);
m.reply(`❌ Error: ${err.message}`);
}
}
break


// =================== SPOTIFY DOWNLOAD BY JUDUL ===================
case "spdl":
case "spotifydl": {
if (!text) return example(`Bahagia Lagi - Piche Kota`)

await vinss.sendMessage(m.chat, { react: { text: "🎵", key: m.key } })

try {
const res = await spotifyDl(text)

const cap = `🎵 *Spotify Downloader*\n\n` +
`🎤 Judul: *${res.title}*\n` +
`👤 Artis: *${res.artist}*`

// вҶҗ pakai downloadUrl (bukan url)
await vinss.sendMessage(m.chat, {
audio: { url: res.downloadUrl },
mimetype: 'audio/mpeg',
fileName: `${res.title} - ${res.artist}.mp3`,
ptt: false
}, { quoted: m })

// cover tidak ada di spotifyDl, skip atau pakai thumbnail default
await m.reply(cap)

} catch (err) {
console.error('spdl error:', err)
m.reply(`❌ Gagal download: ${err.message}`)
}
}
break

case "mediafire": {
if (!text) return example(`https://www.mediafire.com/file/iojnikfucf67q74/Base_Bot_Simpel.zip/file`);
if (!/^https?:\/\/(www\.)?mediafire\.com\/.+/i.test(text)) {
return m.reply("❌ URL MediaFire tidak valid.");
}

await vinss.sendMessage(m.chat, { react: { text: "📥", key: m.key } });

try {
const apiUrl = `https://api-faa.my.id/faa/mediafire?url=${encodeURIComponent(text)}`;
const { data } = await axios.get(apiUrl);

if (!data.status || !data.result) {
return m.reply("❌ Gagal mengambil file dari MediaFire.");
}

const file = data.result;

let cap = `📥 *MediaFire Downloader*\n\n`;
cap += `📌 Nama File: *${file.filename}*\n`;
cap += `📦 Ukuran: *${file.size}*\n`;
cap += `📂 Tipe: ${file.mime}\n\n`;
cap += `⏬ File sedang dikirim...`;

await vinss.sendMessage(m.chat, {
document: { url: file.download_url },
fileName: file.filename,
mimetype: "application/zip",
caption: cap
}, { quoted: m });

} catch (err) {
console.error("mediafire cmd error:", err);
m.reply("❌ Terjadi kesalahan saat download file MediaFire.");
}
}
break

case "tt":
case "tiktok": {
  if (!text) return example(`https://vt.tiktok.com/ZSBhtXeVr/`);
  if (!/^https?:\/\/(www\.)?(tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com|m\.tiktok\.com)\/.+/i.test(text)) {
    return m.reply("❌ URL TikTok tidak valid.");
  }

  await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

  try {
    const apiUrl = `https://api-faa.my.id/faa/tiktok?url=${encodeURIComponent(text)}`;
    const { data } = await axios.get(apiUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 30000
    });

    if (!data || data.status === false) {
      throw new Error(data?.message || 'Video tidak ditemukan atau URL tidak valid');
    }

    const r = data.result;
    if (!r) throw new Error('Response API tidak memiliki result');

    // ===== DEBUG: tampilkan semua key & array =====
    // console.log('[TIKTOK KEYS]', Object.keys(r));
    // console.log('[TIKTOK ARRAYS]', Object.entries(r).filter(([k, v]) => Array.isArray(v)));

    // ===== Metadata =====
    const title    = r.title || "-";
    const author   = r.author?.nickname || r.author?.nickname || "-";
    const username = r.author?.username || "-";
    const duration = r.duration || "-";
    const views    = r.stats?.views || r.play_count || "0";
    const likes    = r.stats?.likes || r.digg_count || "0";
    const comments = r.stats?.comment || r.comment_count || "0";
    const shares   = r.stats?.share || r.share_count || "0";

    const cap = `✅ *TikTok Downloader*\n\n` +
      `🎥 *Judul:* ${title}\n` +
      `👤 *Creator:* ${author} (@${username})\n` +
      `⏱ *Durasi:* ${duration}\n` +
      `▶️ *Views:* ${views}\n` +
      `❤️ *Likes:* ${likes}\n` +
      `💬 *Comments:* ${comments}\n` +
      `🔄 *Shares:* ${shares}`;

    // ===== AUTO-DETECT: cari semua array yang berisi URL gambar =====
    const isImageUrl = (u) => typeof u === "string" && /^https?:\/\/.+\.(jpg|jpeg|png|webp|heic)/i.test(u);
    const isVideoUrl = (u) => typeof u === "string" && /^https?:\/\/.+\.(mp4|mov|webm)/i.test(u);

    // Cari field array yang isinya gambar
    let imageArrays = [];
    for (const [key, val] of Object.entries(r)) {
      if (Array.isArray(val) && val.length > 0) {
        const first = val[0];
        // Cek apakah item pertama itu string URL gambar atau object berisi URL gambar
        const looksLikeImage =
          isImageUrl(first) ||
          (typeof first === "object" && first !== null && (
            first.url || first.image_url || first.download_url ||
            first.display_image?.url_list?.[0] ||
            first.origin_image?.url_list?.[0]
          ));

        if (looksLikeImage && !isVideoUrl(first)) {
          imageArrays.push({ key, arr: val });
        }
      }
    }

    // Prioritas: images > slides > image_list > lainnya
    const priority = ["images", "slides", "image_list", "photo", "photos", "image_post_info", "imagePost"];
    imageArrays.sort((a, b) => {
      const ai = priority.indexOf(a.key);
      const bi = priority.indexOf(b.key);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });

    const picked = imageArrays[0];

    if (picked && picked.arr.length > 0) {
      // ===== SLIDE =====
      await m.reply(cap + `\n\n_📸 Slide (${picked.arr.length} gambar) — field: \`${picked.key}\`_`);

      let terkirim = 0;
      for (const img of picked.arr) {
        const imgUrl =
          typeof img === "string"
            ? img
            : img.url ||
              img.image_url ||
              img.download_url ||
              img.display_image?.url_list?.[0] ||
              img.origin_image?.url_list?.[0] ||
              img.owner_image_url ||
              null;

        if (imgUrl) {
          try {
            await vinss.sendMessage(m.chat, { image: { url: imgUrl } }, { quoted: m });
            terkirim++;
            await sleep(1000);
          } catch (e) {
            console.error("gagal kirim slide:", e.message);
          }
        }
      }

      if (terkirim === 0) {
        m.reply("⚠️ Slide terdeteksi tapi semua gambar gagal dikirim.");
      }
    } else {
      // ===== VIDEO =====
      const videoUrl =
        (typeof r.data === 'string' && isVideoUrl(r.data) ? r.data : null) ||
        r.alternatives?.hd ||
        r.alternatives?.sd ||
        r.alternatives?.selected ||
        r.alternatives?.nowm ||
        r.alternatives?.wm ||
        r.video ||
        r.play ||
        r.download_url ||
        null;

      // Kalau tidak ada video tapi ada cover, kirim cover aja
      if (!videoUrl) {
        console.log('[TIKTOK DEBUG] Tidak ada gambar & video. Keys:', Object.keys(r));
        console.log('[TIKTOK DEBUG] Full:', JSON.stringify(r, null, 2).slice(0, 3000));

        if (r.cover) {
          await vinss.sendMessage(m.chat, {
            image: { url: r.cover },
            caption: cap + "\n\n_⚠️ Hanya cover yang tersedia_"
          }, { quoted: m });
        } else {
          throw new Error('Tidak ada media (gambar/video) dalam response API');
        }
      } else {
        await vinss.sendMessage(m.chat, {
          video: { url: videoUrl },
          caption: cap
        }, { quoted: m });
      }
    }

  } catch (err) {
    console.error("tiktok cmd error:", err);
    m.reply(`❌ Gagal download TikTok: ${err.message}`);
  }
}
break

// =================== WALLPAPER RANDOM ===================
case 'gunung': {
await vinss.sendMessage(m.chat, { react: { text: '⛰️', key: m.key } });
try {
const g = await fetch('https://raw.githubusercontent.com/inirey/RESTAPI/master/data/Mountain.json');
const f = await g.json();
const a = f[Math.floor(Math.random() * f.length)];
await vinss.sendMessage(m.chat, {
image: { url: a },
caption: '🏔️ *Wallpaper Gunung*'
}, { quoted: m });
} catch (e) {
reply(`❌ Gagal mengambil gambar: ${e.message}`);
}
}
break;

case 'hacker': {
await vinss.sendMessage(m.chat, { react: { text: '💻', key: m.key } });
try {
const g = await fetch('https://raw.githubusercontent.com/inirey/RESTAPI/master/data/hekel.json');
const f = await g.json();
const a = f[Math.floor(Math.random() * f.length)];
await vinss.sendMessage(m.chat, {
image: { url: a },
caption: '💻 *Wallpaper Hacker*'
}, { quoted: m });
} catch (e) {
reply(`❌ Gagal mengambil gambar: ${e.message}`);
}
}
break;

case 'wptechnology': {
await vinss.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
try {
const g = await fetch('https://raw.githubusercontent.com/inirey/RESTAPI/master/data/Technology.json');
const f = await g.json();
const a = f[Math.floor(Math.random() * f.length)];
await vinss.sendMessage(m.chat, {
image: { url: a },
caption: '⚙️ *Wallpaper Technology*'
}, { quoted: m });
} catch (e) {
reply(`❌ Gagal mengambil gambar: ${e.message}`);
}
}
break;


case 'wpaesthetic': {
await vinss.sendMessage(m.chat, { react: { text: '🌸', key: m.key } });
try {
const g = await fetch('https://raw.githubusercontent.com/inirey/RESTAPI/master/data/aesthetic.json');
const f = await g.json();
const a = f[Math.floor(Math.random() * f.length)];
await vinss.sendMessage(m.chat, {
image: { url: a },
caption: '🌸 *Wallpaper Aesthetic*'
}, { quoted: m });
} catch (e) {
reply(`❌ Gagal mengambil gambar: ${e.message}`);
}
}
break;

case 'wpgame': {
await vinss.sendMessage(m.chat, { react: { text: '🎮', key: m.key } });
try {
const g = await fetch('https://raw.githubusercontent.com/inirey/RESTAPI/master/data/GameWallp.json');
const f = await g.json();
const a = f[Math.floor(Math.random() * f.length)];
await vinss.sendMessage(m.chat, {
image: { url: a },
caption: '🎮 *Wallpaper Game*'
}, { quoted: m });
} catch (e) {
reply(`❌ Gagal mengambil gambar: ${e.message}`);
}
}
break;

case "toimg": {
let quoted = m.quoted ? m.quoted : m;
let mime = (quoted.msg || quoted).mimetype || "";
if (!/webp/.test(mime)) return example(" Sambil Kirim atau reply sticker untuk diubah jadi gambar.");

await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

try {
let mediaPath = await vinss.downloadAndSaveMediaMessage(quoted);
let url = await uploader.auto(mediaPath);

if (!url) {
if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
return m.reply("❌ Gagal upload sticker.");
}

await vinss.sendMessage(
m.chat,
{ image: { url }, caption: `✅ *Sticker berhasil diubah jadi gambar*\n📎 URL: ${url}` },
{ quoted: m }
);

if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
} catch (err) {
console.error(err);
m.reply(`❌ Error: ${err.message}`);
}
}
break

case "remini": case "hd": {
let quoted = m.quoted ? m.quoted : m;
let mime = (quoted.msg || quoted).mimetype || "";
if (!/image/.test(mime)) return example(" Sambil kirim atau reply gambar untuk di-HD-in.");

await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

try {
let mediaPath = await vinss.downloadAndSaveMediaMessage(quoted);
let url = await uploader.auto(mediaPath);

let apiUrl = `https://api-faa.my.id/faa/hdv2?url=${encodeURIComponent(url)}`;
let { data } = await axios.get(apiUrl);

if (!data.status || !data.result) {
if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
return m.reply(`❌ Gagal memproses gambar: ${data.message || 'Unknown error'}`);
}

await vinss.sendMessage(
m.chat,
{ image: { url: data.result }, caption: `✅ *Successful Upscale 4k Quality*\n📎 URL: ${data.result}` },
{ quoted: m }
);

if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
} catch (err) {
console.error(err);
m.reply(`❌ Error: ${err.message}`);
}
}
break

case "tourl": {
if (!m.quoted) return example(`Reply media yang mau diupload.\nContoh: *${prefix + command}*`);
let mime = (m.quoted.msg || m.quoted).mimetype || "";
if (!mime) return m.reply("Media tidak ditemukan.");

await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

try {
let mediaPath = await vinss.downloadAndSaveMediaMessage(m.quoted);
let url = await uploader.auto(mediaPath);
await m.reply(`✅ *Berhasil Upload*\n\n📎 *URL:* ${url}`);
if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
} catch (err) {
console.error(err);
m.reply(`❌ Gagal upload: ${err.message}`);
}
}
break

case "bratvid": {
if (!text) return example("teksnya");
try {
await vinss.sendMessage(m.chat, {
react: { text: "👁️‍🗨️", key: m.key }
});

const url = `https://api-faa.my.id/faa/bratvid?text=${encodeURIComponent(text)}`;
const response = await axios.get(url, { responseType: "arraybuffer" });

await vinss.sendVideoAsSticker(
m.chat,
response.data,
m,
{
packname: global.packname,
author: global.author
}
);

} catch (err) {
console.error("Error:", err);
await vinss.sendMessage(m.chat, {
text: "Maaf, terjadi kesalahan saat mencoba membuat stiker brat video. Coba lagi nanti."
}, { quoted: m });
}
}
break

case "brat": {
if (!text) return example("teksnya");
try {
await vinss.sendMessage(m.chat, {
react: { text: "👁️‍🗨️", key: m.key }
});

const url = `https://api-faa.my.id/faa/brat?text=${encodeURIComponent(text)}`;
const response = await axios.get(url, { responseType: "arraybuffer" });

await vinss.sendImageAsSticker(
m.chat,
response.data,
m,
{
packname: global.packname,
author: global.author
}
);

} catch (err) {
console.error("Error:", err);
await vinss.sendMessage(m.chat, {
text: "Maaf, terjadi kesalahan saat mencoba membuat stiker brat. Coba lagi nanti."
}, { quoted: m });
}
}
break

case "sticker":
case "stiker":
case "sgif":
case "s": {
if (!/image|video|webp/.test(mime)) return example("Kirim atau reply gambar/video (maks 15 detik)");

if (/video/.test(mime) && (qmsg?.seconds > 15)) {
return m.reply("✖️ Durasi video maksimal 15 detik.");
}

await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

let media;
try {

media = await vinss.downloadAndSaveMediaMessage(qmsg);

if (/image|webp/.test(mime)) {
await vinss.sendImageAsSticker(
m.chat,
media,
m,
{ packname: global.packname, author: global.author }
);
} else if (/video/.test(mime)) {
await vinss.sendVideoAsSticker(
m.chat,
media,
m,
{ packname: global.packname, author: global.author }
);
} else {
return m.reply("✖️ Format tidak didukung. Kirim gambar atau video pendek.");
}

} catch (e) {
console.error("sticker cmd error:", e);
m.reply("✖️ Terjadi kesalahan saat mengeksekusi perintah.");
} finally {
try { if (media && fs.existsSync(media)) fs.unlinkSync(media); } catch { }
}
}
break

case "smeme": {
if (!/image|webp/.test(mime)) {
return example("Kirim atau reply gambar/webp dengan teks atas|bawah");
}

let [atas, bawah] = text.split("|");
if (!atas) return example("teksatas|teksbawah (teks bawah opsional)");

await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

let media, uploadedUrl, tempFile;
try {

media = await vinss.downloadAndSaveMediaMessage(qmsg);
tempFile = media;

uploadedUrl = await uploader.auto(tempFile);

const apiUrl = `https://api.ryuu-dev.offc.my.id/tools/smeme?img=${encodeURIComponent(uploadedUrl)}&atas=${encodeURIComponent(atas)}&bawah=${encodeURIComponent(bawah || "")}`;
const { data } = await axios.get(apiUrl, { responseType: "arraybuffer" });

await vinss.sendImageAsSticker(
m.chat,
data,
m,
{ packname: global.packname, author: global.author }
);

} catch (err) {
console.error("❌ smeme cmd error:", err);
m.reply(`✖️ Terjadi kesalahan saat membuat meme:\n${err.message || err}`);
} finally {

try {
if (tempFile && fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
} catch (cleanupErr) {
console.error("Gagal hapus file temp:", cleanupErr);
}
}
}
break

case "qc": {
if (!text) return example('teksnya');

let ppuser;
try {
ppuser = await vinss.profilePictureUrl(m.sender, "image");
} catch {
ppuser = "https://i.ibb.co/6BRf4Rc/no-profile.png";
}

let warna = ["#000000", "#ff2414", "#22b4f2", "#eb13f2"];
let reswarna = warna[Math.floor(Math.random() * warna.length)];

let makeid = Date.now();

const json = {
type: "quote",
format: "png",
backgroundColor: reswarna,
width: 512,
height: 768,
scale: 2,
messages: [
{
entities: [],
avatar: true,
from: {
id: 1,
name: m.pushName || "User",
photo: { url: ppuser }
},
text: text,
replyMessage: {}
}
]
};

await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

let tempnya;
try {
const { data } = await axios.post('https://bot.lyo.su/quote/generate', json, {
headers: { 'Content-Type': 'application/json' }
});

const buffer = Buffer.from(data.result.image, 'base64');
tempnya = `./database/${makeid}.png`;

await fs.promises.writeFile(tempnya, buffer);

await vinss.sendImageAsSticker(
m.chat,
tempnya,
m,
{ packname: global.packname, author: global.author }
);

} catch (err) {
console.error("qc cmd error:", err);
m.reply("✖️ Terjadi kesalahan saat membuat quote.");
} finally {

try { if (tempnya && fs.existsSync(tempnya)) fs.unlinkSync(tempnya); } catch { }
}
}
break

case "setppbot": case "setpp": {
if (!isCreator) return larang();
if (/image/g.test(mime)) {
let media = await vinss.downloadAndSaveMediaMessage(qmsg)
await vinss.updateProfilePicture(botNumber, { url: media })
await fs.unlinkSync(media)
m.reply("*Berhasil Mengganti Profil ✅*")
} else return example("dengan mengirim foto")
}
break

case "setnamabot": {
if (!isCreator) return larang();
if (!text) return example("teksnya")
vinss.updateProfileName(text)
m.reply("*Berhasil Mengganti Nama Bot ✅*")
}
break

case "setbio": case "setbiobot": {
if (!isCreator) return larang();
if (!text) return example("teksnya")
vinss.updateProfileStatus(text)
m.reply("*Berhasil Mengganti Bio Bot ✅*")
}
break

case "self": {
if (!isCreator) return m.reply(mess.creator)

global.botMode = false
vinss.public = false

let file = path.join(process.cwd(), "settings.js")
let text = fs.readFileSync(file, "utf8")

text = text.replace(/global\.botMode\s*=\s*(true|false)/, "global.botMode = false")

fs.writeFileSync(file, text)

m.reply("*Berhasil Mengganti Mode ✅*\nMode Bot Beralih Ke *Self*")
}
break

case "public": {
if (!isCreator) return larang()

global.botMode = true
vinss.public = true

let file = path.join(process.cwd(), "settings.js")
let text = fs.readFileSync(file, "utf8")

text = text.replace(/global\.botMode\s*=\s*(true|false)/, "global.botMode = true")

fs.writeFileSync(file, text)

m.reply("*Berhasil Mengganti Mode ✅*\nMode Bot Beralih Ke *Public*")
}
break

case "getcase": {
if (!isCreator) return larang();
if (!text) return example("menu")

const getcase = (cases) => {
let data = fs.readFileSync('./case.js', 'utf-8')
let regex = new RegExp(`case ['"]${cases}['"]([\\s\\S]*?)break`, "i")
let hasil = data.match(regex)
return hasil ? hasil[0] : null
}

let result = getcase(text)
if (result) {
m.reply(result)
} else {
m.reply(`❌ Case *${text}* Tidak Ditemukan`)
}
}
break

case 'listgc':
case 'listgrup': {
if (!isCreator) return larang();

await vinss.sendMessage(m.chat, { react: { text: '👁️‍🗨️', key: m.key } });

let gcall;
try {
gcall = Object.values(await vinss.groupFetchAllParticipating());
} catch (e) {
return m.reply("*✖️ Gagal mengambil daftar grup.*");
}

let teks = `*📦 Daftar Grup Terkait (${gcall.length} Grup):*\n\n`;
gcall.forEach((group, index) => {
teks += `*${index + 1}. ${group.subject}*\n`;
teks += `├ ID: ${group.id}\n`;
teks += `├ Member: ${group.participants.length}\n`;
teks += `├ Status: ${group.announce ? "🔒 Tertutup" : "🔓 Terbuka"}\n`;
teks += `└ Pembuat: ${group.owner ? "@" + group.owner.split('@')[0] : '✖️ Tidak Diketahui'}\n\n`;
});

vinss.sendMessage(m.chat, {
text: teks,
contextInfo: previewAd({
title: `${gcall.length} Grup Aktif`,
body: `Runtime : ${runtime(process.uptime())}`,
sourceUrl: global.web,
thumbnail: global.img,
mention: [m.sender],
largerThumbnail: true,
})
}, { quoted: m });
}
break

case 'cekidgc': case 'getidgrup': {
if (!isCreator) return larang()
if (!q) return example(`link grupnya`)
let linkRegex = args.join(" ")
let coded = linkRegex.split("https://chat.whatsapp.com/")[1]
if (!coded) return m.reply("Link Invalid")

try {
let res = await vinss.groupGetInviteInfo(coded)
let tekse = res.id ? res.id : "undefined"
m.reply(tekse)
} catch (e) {
console.log(e)
m.reply("❌ Gagal mengambil ID grup, mungkin link invalid / sesi error")
}
}
break

case "autoread": {
if (!isCreator) return larang()
if (!text) return example("on/off\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
if (text.toLowerCase() == "on") {
if (autoread) return m.reply("*Autoread* Sudah Aktif!\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
autoread = true
m.reply("*Berhasil Menyalakan Autoread ✅*\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
} else if (text.toLowerCase() == "off") {
if (!autoread) return m.reply("*Autoread* Sudah Tidak Aktif!\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
autoread = false
m.reply("*Berhasil Mematikan Autoread ✅*\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
} else {
return example("on/off\n\nKetik *.statusbot* Untuk Melihat Status Settingan Bot")
}
}
break

case "autoreadsw": {
if (!isCreator) return larang()
if (!text) return example("on/off\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
if (text.toLowerCase() == "on") {
if (autoreadsw) return m.reply("*Autoreadsw* Sudah Aktif!\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
autoreadsw = true
m.reply("*Berhasil Menyalakan Autoreadsw ✅*\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
} else if (text.toLowerCase() == "off") {
if (!autoreadsw) return m.reply("*Autoread* Sudah Tidak Aktif!\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
autoreadsw = false
m.reply("*Berhasil Mematikan Autoreadsw ✅*\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
} else {
return example("on/off\n\nKetik *.statusbot* Untuk Melihat Status Settingan Bot")
}
}
break

case "anticall": {
if (!isCreator) return larang()
if (!text) return example("on/off\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
if (text.toLowerCase() == "on") {
if (anticall) return m.reply("*Anticall* Sudah Aktif!\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
anticall = true
m.reply("*Berhasil Menyalakan Anticall ✅*\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
} else if (text.toLowerCase() == "off") {
if (!anticall) return m.reply("*Anticall* Sudah Tidak Aktif!\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
anticall = false
m.reply("*Berhasil Mematikan Anticall ✅*\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
} else {
return example("on/off\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
}
}
break

case "antispam":
case "antiflood": {
  if (!isCreator) return larang()
  if (!text) return example("on/off")
  
  const input = text.toLowerCase()
  if (input === "on") {
    global.antispam = true
    reply("✅ *Anti Spam ON*\nUser spam akan di-mute 1 menit")
  } else if (input === "off") {
    global.antispam = false
    reply("❌ *Anti Spam OFF*")
  }
}
break

case "autosticker": {
  if (!isCreator) return larang()
  if (!text) return example("on/off")
  
  if (text.toLowerCase() === "on") {
    global.autosticker = true
    reply("✅ *Auto Sticker ON*\nSemua media yang di-reply akan jadi sticker")
  } else {
    global.autosticker = false
    reply("❌ *Auto Sticker OFF*")
  }
}
break

case "antitoxic":
case "antibadword": {
  if (!m.isGroup) return reply(mess.group)
  if (!isAdmins && !isCreator) return reply(mess.admin)
  if (!text) return example("on/off")
  
  if (!global.db.data.chats) global.db.data.chats = {}
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  
  if (text.toLowerCase() === "on") {
    global.db.data.chats[m.chat].antitoxic = true
    reply("✅ *Anti Toxic ON*")
  } else {
    global.db.data.chats[m.chat].antitoxic = false
    reply("❌ *Anti Toxic OFF*")
  }
}
break

case "addtoxic":
case "addbadword": {
  if (!isCreator && !isAdmins) return larang()
  if (!text) return example("kata_kasar")
  
  if (!global.db.data.badwords) global.db.data.badwords = []
  global.db.data.badwords.push(text.toLowerCase())
  reply(`✅ Kata *${text}* berhasil ditambahkan ke badword list`)
}
break

case "deltoxic":
case "delbadword": {
  if (!isCreator) return larang()
  if (!text) return example("kata_kasar")
  
  if (!global.db.data.badwords) global.db.data.badwords = []
  global.db.data.badwords = global.db.data.badwords.filter(w => w !== text.toLowerCase())
  reply(`✅ Kata *${text}* dihapus dari badword list`)
}
break

case "setsaluran":
case "setchannel": {
  if (!isCreator) return larang()
  if (!text) return example("https://whatsapp.com/channel/xxx")
  
  // Update global.linkSaluran
  const settingsPath = path.join(process.cwd(), "settings.js")
  let content = fs.readFileSync(settingsPath, 'utf8')
  
  content = content.replace(
    /global\.linkSaluran\s*=\s*["'].*["']/,
    `global.linkSaluran = "${text}"`
  )
  
  fs.writeFileSync(settingsPath, content)
  global.linkSaluran = text
  
  reply(`✅ Link saluran berhasil diubah\n\n🔗 ${text}`)
}
break

case "setthumb": {
  if (!isCreator) return larang()
  if (!text && !m.quoted) return example("Reply/kirim URL gambar")
  
  let newThumb = text
  
  // Kalau reply image, upload dulu
  if (m.quoted && /image/.test(mime)) {
    const mediaPath = await vinss.downloadAndSaveMediaMessage(m.quoted)
    newThumb = await uploader.auto(mediaPath)
    try { fs.unlinkSync(mediaPath) } catch {}
  }
  
  if (!newThumb || !/^https?:\/\//.test(newThumb)) {
    return reply("❌ URL tidak valid")
  }
  
  const settingsPath = path.join(process.cwd(), "settings.js")
  let content = fs.readFileSync(settingsPath, 'utf8')
  
  content = content.replace(
    /global\.thumb\s*=\s*["'].*["']/,
    `global.thumb = "${newThumb}"`
  )
  
  fs.writeFileSync(settingsPath, content)
  global.thumb = newThumb
  
  await vinss.sendMessage(m.chat, {
    image: { url: newThumb },
    caption: `✅ Thumbnail bot berhasil diubah`
  }, { quoted: m })
}
break

case "autojoingc": {
if (!isCreator) return larang()
if (!text) return example("on/off")

let input = text.trim().toLowerCase()
if (input === "on") {
if (autojoingc) return m.reply("*Autojoingc* Sudah Aktif!\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
autojoingc = true
reply("✅ Fitur Auto Join GC berhasil diaktifkan.")
} else if (input === "off") {
if (autojoingc) return m.reply("*Autojoingc* Sudah Tidak Aktif!\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
autojoingc = false
reply("✅ Fitur Auto Join GC berhasil dimatikan.")
} else {
return example("on/off")
}
}
break

case "welcome": {
if (m.isGroup && !isAdmins && !isCreator) return reply(mess.admin)
if (!text) return example("on/off\nContoh: .welcome on")
let input = text.trim().toLowerCase()
if (!global.db.data.chats) global.db.data.chats = {}
if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
if (input === "on") {
global.db.data.chats[m.chat].welcome = true
reply("✅ Fitur *Welcome* berhasil diaktifkan untuk grup ini!")
} else if (input === "off") {
global.db.data.chats[m.chat].welcome = false
reply("❌ Fitur *Welcome* berhasil dinonaktifkan untuk grup ini!")
} else {
return example("on/off\nContoh: .welcome on")
}
}
break

case "goodbye":
case "leavemsg": {
if (m.isGroup && !isAdmins && !isCreator) return reply(mess.admin)
if (!text) return example("on/off\nContoh: .goodbye on")
let input = text.trim().toLowerCase()
if (!global.db.data.chats) global.db.data.chats = {}
if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
if (input === "on") {
global.db.data.chats[m.chat].leave = true
reply("✅ Fitur *Goodbye* berhasil diaktifkan untuk grup ini!")
} else if (input === "off") {
global.db.data.chats[m.chat].leave = false
reply("❌ Fitur *Goodbye* berhasil dinonaktifkan untuk grup ini!")
} else {
return example("on/off\nContoh: .goodbye on")
}
}
break

case "setting":
case "settingbot":
case "option":
case "statusbot": {
if (!isCreator) return larang()

var teks = `
*List Status Setting Bot :*

* Welcome (Global) : ${global.welcome ? "*Aktif*" : "*Tidak Aktif*"}
* Leave/Goodbye : ${global.leave ? "*Aktif*" : "*Tidak Aktif*"}
* Autoread : ${global.autoread ? "*Aktif*" : "*Tidak Aktif*"}
* Autoreadsw : ${global.autoreadsw ? "*Aktif*" : "*Tidak Aktif*"}
* Autojoingc : ${global.autojoingc ? "*Aktif*" : "*Tidak Aktif*"}
* Anticall : ${global.anticall ? "*Aktif*" : "*Tidak Aktif*"}

*Contoh Penggunaan :*
.welcome on/off
.goodbye on/off
.autoread on/off
`
m.reply(teks)
}
break

case "joingc": case "join": {
if (!isCreator) return larang()
if (!text && !m.quoted) return example('linknya')
let teks = m.quoted ? m.quoted.text : text
if (!teks.includes('whatsapp.com')) return m.reply("Link Tautan Tidak Valid!")
let result = teks.split('https://chat.whatsapp.com/')[1]
await vinss.groupAcceptInvite(result).then(respon => m.reply("Berhasil Bergabung Ke Dalam Grup ✅")).catch(error => m.reply(error.toString()))
}
break
case "leave": case "leavegc": {
if (!isCreator) return larang()
if (!isGroup) return m.reply(mess.group)
await m.reply("Otw Bosss")
await sleep(3000)
await vinss.groupLeave(m.chat)
}
break

case "leavegc2": case "leave2": {
if (!isCreator) return larang();

let gcall = Object.values(await vinss.groupFetchAllParticipating().catch(_ => null));
let num = [];
let listgc = `*Contoh Cara Penggunaan :*\nKetik *${prefix + command}* <Nomor Grup / all / tertutup>\n\n`;

gcall.forEach((u, i) => {
num.push(i);
listgc += `*${i + 1}.* ${u.subject}
* ID:* ${u.id}
* Total Member:* ${u.participants.length} Member
* Status Grup:* ${u.announce == true ? "Tertutup" : "Terbuka"}
* Pembuat:* ${u.owner ? u.owner.split('@')[0] : 'Sudah keluar'}\n\n`;
});

if (!args[0]) {
return vinss.sendMessage(
m.chat,
{
text: listgc,
contextInfo: previewAd({
thumbnail: ppuser,
title: `[ ${gcall.length} Group Chat ] `,
body: `Runtime : ${runtime(process.uptime())}`,
sourceUrl: global.web,
mention: [m.sender],
})
},
{ quoted: qVinss }
);
}

if (args[0].toLowerCase() === "all") {
for (let gc of gcall) {
await vinss.groupLeave(gc.id);
}
return m.reply(`Berhasil keluar dari semua grup ✅`);
}

if (args[0].toLowerCase() === "tertutup") {
let leftCount = 0;
for (let gc of gcall) {
if (gc.announce && !gc.participants.find(p => p.id === vinss.user.id && p.admin)) {
await vinss.groupLeave(gc.id);
leftCount++;
}
}
return m.reply(`Berhasil keluar dari ${leftCount} grup tertutup di mana bot bukan admin ✅`);
}

if (!num.includes(Number(args[0]) - 1)) return m.reply("Grup tidak ditemukan");
let leav = Number(args[0]) - 1;
await m.reply(`Berhasil keluar dari grup:\n*${gcall[leav].subject}*`);
await vinss.groupLeave(gcall[leav].id);
}
break

case 'cekkhodam':
if (!text) return m.reply('Nama nya mana yang mau di cek khodam nya')
function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}
m.reply(`
╭━━━━°「 *Khodam ${text}* 」°
┃
┊• Nama : ${text}
┊• Khodam : ${pickRandom(['Macan Tutul', 'Gajah Sumatera', 'Orangutan', 'Harimau Putih', 'Badak Jawa', 'Pocong', 'Kuntilanak', 'Genderuwo', 'Wewe Gombel', 'Kuyang', 'Lembuswana', 'Anoa', 'Komodo', 'Elang Jawa', 'Burung Cendrawasih', 'Tuyul', 'Babi Ngepet', 'Sundel Bolong', 'Jenglot', 'Lele Sangkuriang', 'Kucing Hutan', 'Ayam Cemani', 'Cicak', 'Burung Merak', 'Kuda Lumping', 'Buaya Muara', 'Banteng Jawa', 'Monyet Ekor Panjang', 'Tarsius', 'Cenderawasih Biru', 'Setan Merah', 'Kolor Ijo', 'Palasik', 'Nyi Roro Kidul', 'Siluman Ular', 'Kelabang', 'Beruang Madu', 'Serigala', 'Hiu Karang', 'Rajawali', 'Lutung Kasarung', 'Kuda Sumba', 'Ikan Arwana', 'Jalak Bali', 'Kambing Etawa', 'Kelelawar', 'Burung Hantu', 'Ikan Cupang'])}
┊• Mendampingi dari : ${pickRandom(['1 tahun lalu', '2 tahun lalu', '3 tahun lalu', '4 tahun lalu', 'dari lahir'])}
┃• Expired : ${pickRandom(['2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035'])}
╰═┅═━––––––๑`)
break

case 'cekkontol':
if (!text) return m.reply('Nama nya mana yang mau di cek kontol nya')
m.reply(`
╭━━━━°「 *Kontol ${text}* 」°
┃
┊• Nama : ${text}
┃• Kontol : ${pickRandom(['ih item', 'Belang wkwk', 'Muluss', 'Putih Mulus', 'Black Doff', 'Pink wow', 'Item Glossy'])}
┊• True : ${pickRandom(['perjaka', 'ga perjaka', 'udah pernah dimasukin', 'masih ori', 'jumbo'])}
┃• jembut : ${pickRandom(['lebat', 'ada sedikit', 'gada jembut', 'tipis', 'muluss'])}
┃• ukuran : ${pickRandom(['1cm', '2cm', '3cm', '4cm', '5cm', '20cm', '45cm', '50cm', '90meter', '150meter', '5km', 'gak normal'])}
╰═┅═━––––––๑`)
break
case "ambilq": {
let jsonData = JSON.stringify({ [m.quoted.mtype]: m.quoted }, null, 2)
m.reply(jsonData)
}
break

case "runtime":
{
let lowq = `*Telah Online Selama:*\n${runtime(
process.uptime(),
)}*`;
m.reply(`${lowq}`);
}
break

//======== CONTROL MENU ========//
case 'addcase': {
if (!isCreator) return reply(mess.creator)
if (!text) return reply('Mana case nya');
const namaFile = 'case.js';
const caseBaru = `${text}`;
fs.readFile(namaFile, 'utf8', (err, data) => {
if (err) {
console.error('Terjadi kesalahan saat membaca file:', err);
return;
}
const posisiAwalGimage = data.indexOf("case 'addcase':");

if (posisiAwalGimage !== -1) {
const kodeBaruLengkap = data.slice(0, posisiAwalGimage) + '\n' + caseBaru + '\n' + data.slice(posisiAwalGimage);
fs.writeFile(namaFile, kodeBaruLengkap, 'utf8', (err) => {
if (err) {
reply('Terjadi kesalahan saat menulis file:', err);
} else {
reply('Sukses Menambahkan Fitur\nJika Ingin Menginfokan Ss Dan Reply Ssan Barcaption .newfitur');
}
});
} else {
reply('Tidak dapat menambahkan case dalam file.');
}
});

}
break
case 'delcase': {
if (!isCreator) return reply('Fitur Khusus Owner!')
if (!text) return reply('Mana case nya bang?');
dellCase('./case.js', q)
m.reply('Berhasil menghapus case!.');
}
break

case "addmoney":
case "addmoneyuser": {
if (!isCreator) return larang()
const target = m.mentionedJid?.[0] || m.quoted?.sender
const jumlah = parseInt(args[1]) || parseInt(args[0])
if (!target || !jumlah) return example("@user 10000")

const user = getRpgUser(target)
user.money += jumlah
reply(`✅ Berhasil menambah Rp ${jumlah.toLocaleString()} ke @${target.split('@')[0]}`, { mentions: [target] })
}
break

case "addlimit":
case "addlimituser": {
if (!isCreator) return larang()
// sama seperti addmoney
}
break

case "resetuser":
case "resetrpg": {
if (!isCreator) return larang()
const target = m.mentionedJid?.[0] || m.quoted?.sender
if (!target) return example("@user")

global.db.data.users[target] = { ...DEFAULT_RPG_USER }
reply(`✅ User @${target.split('@')[0]} berhasil di-reset`, { mentions: [target] })
}
break

case "listuserrpg":
case "totaluser": {
if (!isCreator) return larang()
const users = Object.entries(global.db.data.users).filter(([_, v]) => v.registered)
let teks = `👥 *Total User RPG: ${users.length}*\n\n`
users.slice(0, 20).forEach(([jid, u], i) => {
teks += `${i+1}. ${u.name} (${jid.split('@')[0]})\n`
})
reply(teks)
}
break

case "broadcast":
case "bc": {
if (!isCreator) return larang()
if (!text) return example("Pesan broadcast")

const gcall = Object.values(await vinss.groupFetchAllParticipating())
let sukses = 0
for (const g of gcall) {
try {
await vinss.sendMessage(g.id, { text: `📢 *BROADCAST*\n\n${text}` })
sukses++
await sleep(3000)
} catch {}
}
reply(`✅ Broadcast terkirim ke ${sukses}/${gcall.length} grup`)
}
break

case "ban":
case "banned": {
if (!isCreator) return larang()
const target = m.mentionedJid?.[0] || m.quoted?.sender
if (!target) return example("@user")

if (!global.db.data.banned) global.db.data.banned = []
if (!global.db.data.banned.includes(target)) {
global.db.data.banned.push(target)
}
reply(`🚫 @${target.split('@')[0]} telah dibanned`, { mentions: [target] })
}
break

case "unban": {
if (!isCreator) return larang()
const target = m.mentionedJid?.[0] || m.quoted?.sender
if (!global.db.data.banned) global.db.data.banned = []
global.db.data.banned = global.db.data.banned.filter(v => v !== target)
reply(`✅ @${target.split('@')[0]} telah di-unban`, { mentions: [target] })
}
break

case "listban": {
if (!isCreator) return larang()
const banned = global.db.data.banned || []
reply(`🚫 *List Banned (${banned.length}):*\n\n${banned.map((v,i) => `${i+1}. ${v.split('@')[0]}`).join('\n')}`)
}
break

case "reload":
case "restart": {
if (!isCreator) return larang()
reply("♻️ Bot akan restart...")
await sleep(2000)
process.exit(0)
}
break

case "clearcache": {
if (!isCreator) return larang()
if (global.groupCache) global.groupCache.clear()
reply("✅ Cache grup berhasil dibersihkan")
}
break

case "addpremium": {
if (!isCreator) return larang()
const target = m.mentionedJid?.[0] || m.quoted?.sender
const hari = parseInt(args[1]) || 30

const user = getRpgUser(target)
user.premium = true
user.premiumTime = Date.now() + (hari * 86400000)

reply(`⭐ @${target.split('@')[0]} jadi premium selama ${hari} hari`, { mentions: [target] })
}
break

case "delpremium": {
if (!isCreator) return larang()
const target = m.mentionedJid?.[0] || m.quoted?.sender
const user = getRpgUser(target)
user.premium = false
user.premiumTime = 0
reply(`✅ Premium @${target.split('@')[0]} dihapus`, { mentions: [target] })
}
break

case "blacklist":
case "blcmd": {
if (!isCreator) return larang()
if (!text) return reply(`Format: *.blacklist <command>*\nKetik *.listblcmd* untuk lihat`)

if (!global.db.data.blacklistCmd) global.db.data.blacklistCmd = []
global.db.data.blacklistCmd.push(text.toLowerCase())
reply(`✅ Command *${text}* diblacklist`)
}
break

case "unblacklist":
case "unblcmd": {
if (!isCreator) return larang()
if (!global.db.data.blacklistCmd) global.db.data.blacklistCmd = []
global.db.data.blacklistCmd = global.db.data.blacklistCmd.filter(v => v !== text.toLowerCase())
reply(`✅ Command *${text}* di-unblacklist`)
}
break

case "listblcmd": {
if (!isCreator) return larang()
const bl = global.db.data.blacklistCmd || []
reply(`🚫 *Blacklist Command (${bl.length}):*\n\n${bl.map((v,i) => `${i+1}. ${v}`).join('\n')}`)
}
break

case "maintenance":
case "maint": {
if (!isCreator) return larang()
if (!text) return example("on/off")

const input = text.toLowerCase()
if (input === "on") {
global.maintenance = true
reply("🔧 *Maintenance Mode ON*\nHanya owner yang bisa menggunakan bot")
} else if (input === "off") {
global.maintenance = false
reply("✅ *Maintenance Mode OFF*\nBot kembali normal")
}
}
break

// =================== PLUGIN: cekidch ===================
case "cekidch":
case "idch": {
if (!text) return example("Masukkan minimal 1 link channel!");
const processMsg = await vinss.sendMessage(m.chat, { text: "Sedang memeriksa channel..." });

const links = text.split(/\s+/).slice(0, 10);
let captionArr = [];

for (let link of links) {
if (!link.includes("https://whatsapp.com/channel/")) {
captionArr.push(`[!] Link tidak valid: ${link}`);
continue;
}
let idPart = link.split('https://whatsapp.com/channel/')[1];
try {
let res = await vinss.newsletterMetadata("invite", idPart);
captionArr.push(
`*${res.name || "Tanpa Nama"}*\n` +
`* ID Channel: ${res.id}\n` +
`* Pengikut: ${res.subscribers || 0}\n` +
`* Verifikasi: ${res.verification || "–"}\n` +
`* State: ${res.state || "–"}\n`
);
} catch (err) {
console.error("❌ Error cek ID channel:", err);
captionArr.push(`[x] Gagal cek channel: ${link}`);
}
}

const caption = captionArr.join("\n\n") || "[x] Tidak ada channel valid untuk dicek.";
await vinss.sendMessage(m.chat, { text: caption, edit: processMsg.key });
}
break

// =================== PLUGIN: createch ===================
case "createchannel":
case "createch": {
if (!isCreator) return larang();
if (!text) return example("Nama Channel|Deskripsi");

let [chName, chDesc] = text.split("|");
if (!chName) return reply("❌ Harap tuliskan nama channel.");
chDesc = chDesc ? chDesc.trim() : "Tidak ada deskripsi.";

await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

let imageUrl = "https://files.catbox.moe/xpntd8.jpg";
if (m.quoted && /image/.test(mime)) {
try {
const mediaPath = await vinss.downloadAndSaveMediaMessage(qmsg);
const FormData = (await import('form-data')).default;
const fetch = (await import('node-fetch')).default;
const form = new FormData();
form.append("reqtype", "fileupload");
form.append("fileToUpload", fs.createReadStream(mediaPath));
const upload = await fetch("https://catbox.moe/user/api.php", { method: "POST", body: form });
const url = await upload.text();
if (url && url.startsWith("https")) imageUrl = url.trim();
fs.unlinkSync(mediaPath);
} catch (e) {
console.error(e);
reply("⚠️ Gagal upload gambar, menggunakan gambar default.");
}
}

try {
const newsletter = await vinss.newsletterCreate(chName.trim(), chDesc, { url: imageUrl });
const invite = newsletter?.invite || "❌ Tidak tersedia";
const id = newsletter?.id || "❓";
await vinss.sendMessage(m.chat, {
text: `✅ *Channel Berhasil Dibuat!*\n\n📡 *Nama:* ${chName}\n📝 *Deskripsi:* ${chDesc}\n🆔 *ID:* ${id}\n🔗 *Link:* https://whatsapp.com/channel/${invite}`,
contextInfo: previewAd({
title: chName,
body: "Channel berhasil dibuat",
sourceUrl: `https://whatsapp.com/channel/${invite}`,
thumbnail: imageUrl,
largerThumbnail: true,
}),
}, { quoted: m });
} catch (err) {
console.error(err);
reply("✖️ *Gagal membuat channel.* Pastikan akun bot kamu memenuhi syarat.");
}
}
break

// =================== PLUGIN: delete ===================
case "delete":
case "del": {
if (!m.isGroup) return reply(mess.group);
if (!isAdmins) return reply(mess.admin);
if (!isBotAdmins) return reply(mess.botAdmin);
if (!m.quoted) return reply("Reply pesan yang mau dihapus, baru ketik *.delete*");

try {
await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });
await vinss.sendMessage(m.chat, {
delete: {
remoteJid: m.chat,
fromMe: false,
id: m.quoted.id,
participant: m.quoted.sender
}
});
} catch (err) {
console.log(err);
reply("❌ Gagal menghapus pesan, mungkin pesan terlalu lama atau bukan dari member.");
}
}
break

// ============== FEATURE GROUP ==============
case "demote": {
if (!m.isGroup) return reply(mess.group);
if (!isAdmins) return reply(mess.admin);
if (!isBotAdmins) return reply(mess.botAdmin);

let demoteUser =
m.quoted?.sender ||
m.mentionedJid?.[0] ||
(args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

if (!demoteUser) return reply('Tag atau reply pesan user yang mau diturunkan dari admin.');
await vinss.groupParticipantsUpdate(m.chat, [demoteUser], 'demote');
return reply(`⬇️ Berhasil menurunkan @${demoteUser.split('@')[0]} dari admin grup.`, { mentions: [demoteUser] });
}
break

case "hidetag":
case "ht": {
if (!m.isGroup) return reply(mess.group);
if (!isAdmins) return reply(mess.admin);
if (!isBotAdmins) return reply(mess.botAdmin);

let htMessage = text || m.quoted?.text || m.quoted?.caption;
if (!htMessage) return reply('Kirim teks atau reply pesan untuk dihidetag.');

let htParticipants = participants.length ? participants : (await vinss.groupMetadata(m.chat)).participants;
let htMembers = htParticipants.map(u => u.id);

await vinss.sendMessage(m.chat, { text: htMessage, mentions: htMembers });
}
break

case "mute":
case "mutegc": {
if (!m.isGroup) return reply(mess.group);
if (!isAdmins) return reply(mess.admin);
if (!isBotAdmins) return reply(mess.botAdmin);

if (!text) return example("on/off\n\nMengunci/membuka grup (hanya admin yang bisa chat)");

const input = text.trim().toLowerCase();
if (input === "on") {
await vinss.groupSettingUpdate(m.chat, "announcement");
reply("🔒 *Grup dikunci!*\nHanya admin yang bisa mengirim pesan.");
} else if (input === "off") {
await vinss.groupSettingUpdate(m.chat, "not_announcement");
reply("📣 *Grup dibuka!*\nSemua member bisa mengirim pesan.");
} else {
return example("on/off");
}
}
break

case "setwelcome":
case "setwelcomemsg": {
if (!m.isGroup) return reply(mess.group);
if (!isAdmins) return reply(mess.admin);

if (!text) return example("Selamat datang @user di grup @group");

if (!global.db.data.chats) global.db.data.chats = {};
if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};

global.db.data.chats[m.chat].welcomeMsg = text;
reply(`✅… *Pesan Welcome berhasil diatur!*\n\n${text}\n\n*Variabel:*\n@user = nama member\n@group = nama grup`);
}
break

case "setgoodbye":
case "setleavemsg": {
if (!m.isGroup) return reply(mess.group);
if (!isAdmins) return reply(mess.admin);

if (!text) return example("Selamat tinggal @user");

if (!global.db.data.chats) global.db.data.chats = {};
if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};

global.db.data.chats[m.chat].leaveMsg = text;
reply(`✅… *Pesan Goodbye berhasil diatur!*\n\n${text}\n\n*Variabel:*\n@user = nama member\n@group = nama grup`);
}
break

// =================== INFO GC ===================
case "infogc":
case "groupinfo": {
if (!m.isGroup) return reply(mess.group);

await vinss.sendMessage(m.chat, { react: { text: "📊", key: m.key } });

try {
const meta = await vinss.groupMetadata(m.chat);
const pp = await vinss.profilePictureUrl(m.chat, 'image').catch(() => null);

const teks = `📊 *Info Group*\n\n` +
`📛 *Nama:* ${meta.subject}\n` +
`🆔 *ID:* ${meta.id}\n` +
`👥 *Total Member:* ${meta.participants.length}\n` +
`👨 *Admin:* ${meta.participants.filter(p => p.admin).length}\n` +
`📝 *Deskripsi:* ${meta.desc || "Tidak ada"}\n` +
`🔒 *Status:* ${meta.announce ? "Terkunci" : "Terbuka"}\n` +
`🖼️ *Foto:* ${pp ? "Ada" : "Tidak ada"}\n` +
`🕒 *Dibuat:* ${new Date(meta.creation * 1000).toLocaleString('id-ID')}`;

if (pp) {
await vinss.sendMessage(m.chat, {
image: { url: pp },
caption: teks
}, { quoted: m });
} else {
await vinss.sendMessage(m.chat, { text: teks }, { quoted: m });
}
} catch (err) {
console.error("infogc error:", err);
reply(`❌ Gagal mengambil info grup: ${err.message}`);
}
}
break

// =================== LIST ADMIN ===================
case "listadmin":
case "admin": {
if (!m.isGroup) return reply(mess.group);

const meta = await vinss.groupMetadata(m.chat);
const admins = meta.participants.filter(p => p.admin);

let teks = `👨 *Daftar Admin Group*\n\n`;
admins.forEach((admin, i) => {
teks += `${i + 1}. @${admin.id.split('@')[0]}\n`;
});

await vinss.sendMessage(m.chat, {
text: teks,
mentions: admins.map(a => a.id)
}, { quoted: m });
}
break

// =================== LIST MEMBER ===================
case "listmember":
case "member": {
if (!m.isGroup) return reply(mess.group);

const meta = await vinss.groupMetadata(m.chat);
const members = meta.participants;

let teks = `👥 *Daftar Member Group*\n\n` +
`Total: ${members.length} member\n\n`;

members.slice(0, 20).forEach((member, i) => {
teks += `${i + 1}. @${member.id.split('@')[0]}\n`;
});

if (members.length > 20) {
teks += `\n_dan ${members.length - 20} member lainnya..._`;
}

await vinss.sendMessage(m.chat, {
text: teks,
mentions: members.slice(0, 20).map(m => m.id)
}, { quoted: m });
}
break

case "poll":
case "vote": {
  if (!m.isGroup) return reply(mess.group)
  if (!isAdmins && !isCreator) return reply(mess.admin)
  if (!text) return example("Pilih ketua | Opsi1 | Opsi2 | Opsi3")
  
  const parts = text.split("|").map(s => s.trim())
  if (parts.length < 3) return example("Topik | Opsi1 | Opsi2")
  
  const [topik, ...opsi] = parts
  
  global.polls = global.polls || {}
  const pollId = Date.now().toString()
  
  global.polls[pollId] = {
    topik,
    opsi,
    votes: {},
    creator: m.sender,
    createdAt: Date.now()
  }
  
  let teks = `🗳️ *POLLING*\n━━━━━━━━━━━━━━━━━━━━━━\n\n`
  teks += `📌 *${topik}*\n\n`
  opsi.forEach((opt, i) => {
    teks += `*${i + 1}.* ${opt} → \`.vote ${i + 1}\`\n`
  })
  teks += `\n_Reply dengan_ \`.vote <nomor>\``
  
  reply(teks)
}
break

case "vote": {
  if (!m.isGroup) return reply(mess.group)
  if (!text) return example("1")
  
  const pollId = Object.keys(global.polls || {}).sort().pop()
  if (!pollId) return reply("❌ Tidak ada polling aktif")
  
  const poll = global.polls[pollId]
  const pilihan = parseInt(text) - 1
  
  if (isNaN(pilihan) || pilihan < 0 || pilihan >= poll.opsi.length) {
    return reply(`❌ Pilihan tidak valid. Pilih 1-${poll.opsi.length}`)
  }
  
  // Cek udah vote belum
  const udahVote = Object.values(poll.votes).includes(m.sender)
  if (udahVote) return reply("❌ Kamu sudah vote!")
  
  poll.votes[pilihan] = m.sender
  
  await vinss.sendMessage(m.chat, { react: { text: "✅", key: m.key } })
  reply(`✅ Vote kamu tercatat untuk: *${poll.opsi[pilihan]}*`)
}
break

case "hasilpoll": {
  if (!m.isGroup) return reply(mess.group)
  
  const pollId = Object.keys(global.polls || {}).sort().pop()
  if (!pollId) return reply("❌ Tidak ada polling aktif")
  
  const poll = global.polls[pollId]
  const total = Object.keys(poll.votes).length
  
  let teks = `🗳️ *HASIL POLLING*\n━━━━━━━━━━━━━━━━━━━━━━\n\n`
  teks += `📌 *${poll.topik}*\n\n`
  
  poll.opsi.forEach((opt, i) => {
    const count = Object.values(poll.votes).filter(v => poll.votes[i] === v).length
    const persen = total ? Math.round((count / total) * 100) : 0
    teks += `*${i + 1}.* ${opt}\n`
    teks += `   ${count} vote (${persen}%)\n\n`
  })
  
  teks += `📊 Total vote: ${total}`
  
  reply(teks)
}
break

// =================== REVOKE LINK GROUP ===================
case "revoke": {
if (!m.isGroup) return reply(mess.group);
if (!isAdmins) return reply(mess.admin);
if (!isBotAdmins) return reply(mess.botAdmin);

await vinss.sendMessage(m.chat, {
react: { text: "🔄", key: m.key }
});

try {
const result = await vinss.groupRevokeInvite(m.chat);
const newLink = await vinss.groupInviteCode(m.chat);
const fullLink = `https://chat.whatsapp.com/${newLink}`;

const teks = `🔄 *Link Group Berhasil Direset!*\n\n` +
`📦 *Group:* ${groupName || m.chat}\n` +
`🔗 *Link Baru:*\n${fullLink}\n\n` +
`_Link lama sudah tidak berlaku._`;

await vinss.sendMessage(m.chat, {
text: teks,
contextInfo: previewAd({
title: `🔄 Revoke Link Group`,
body: `${groupName || "Group"}`,
thumbnail: global.img,
sourceUrl: fullLink,
mention: [m.sender],
forward: true,
})
}, { quoted: m });

} catch (err) {
console.error("revokegc error:", err);
reply(`❌ Gagal mereset link grup: ${err.message}`);
}
}
break

// =================== KICK ===================
case "kick": {
if (!m.isGroup) return reply(mess.group);
if (!isAdmins) return reply(mess.admin);
if (!isBotAdmins) return reply(mess.botAdmin);

let kickUser =
m.quoted?.sender ||
m.mentionedJid?.[0] ||
(args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

if (!kickUser) return reply('Tag atau reply pesan user yang mau dikeluarkan.');
if (kickUser === m.sender) return reply('😅 Ngapain kick diri sendiri ngab.');

await vinss.groupParticipantsUpdate(m.chat, [kickUser], 'remove');
return reply(`Berhasil mengeluarkan @${kickUser.split('@')[0]} dari grup.`, { mentions: [kickUser] });
}
break

// =================== PROMOTE ===================
case "promote": {
if (!m.isGroup) return reply(mess.group);
if (!isAdmins) return reply(mess.admin);
if (!isBotAdmins) return reply(mess.botAdmin);

let promoteUser =
m.quoted?.sender ||
m.mentionedJid?.[0] ||
(args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

if (!promoteUser) return reply('Tag atau reply pesan user yang mau dijadikan admin.');
await vinss.groupParticipantsUpdate(m.chat, [promoteUser], 'promote');
return reply(`✅ Berhasil menaikkan @${promoteUser.split('@')[0]} menjadi admin grup.`, { mentions: [promoteUser] });
}
break

// =================== TAGALL ===================
case "tagall": {
if (!m.isGroup) return reply(mess.group);
if (!isAdmins) return reply(mess.admin);
if (!isBotAdmins) return reply(mess.botAdmin);

let tagallMeta = await vinss.groupMetadata(m.chat);
let tagallTeks = `📢 *TagAll oleh Admin*\n\n${text ? text + "\n\n" : ""}`;
let tagallMentions = tagallMeta.participants.map(a => a.id);
tagallMentions.forEach(u => (tagallTeks += `👤 @${u.split('@')[0]}\n`));

await vinss.sendMessage(m.chat, { text: tagallTeks, mentions: tagallMentions });
}
break

// =================== SET DESCRIPTION GROUP ===================
case "setdesc":
case "setdeskripsi":
case "setdeskgc": {
if (!m.isGroup) return reply(mess.group);
if (!isAdmins) return reply(mess.admin);
if (!isBotAdmins) return reply(mess.botAdmin);

if (!text) return example("Deskripsi baru untuk grup ini");

await vinss.sendMessage(m.chat, {
react: { text: "📝", key: m.key }
});

try {
await vinss.groupUpdateDescription(m.chat, text);

await vinss.sendMessage(m.chat, {
text: `✅ *Deskripsi Grup Berhasil Diupdate!*\n\n` +
`📝 *Deskripsi Baru:*\n${text}`,
contextInfo: previewAd({
title: `📝 Update Deskripsi Group`,
body: `${groupName || "Group"}`,
thumbnail: global.img,
sourceUrl: global.web,
mention: [m.sender],
forward: true,
})
}, { quoted: m });

} catch (err) {
console.error("setdesc error:", err);
reply(`❌ Gagal mengupdate deskripsi: ${err.message}`);
}
}
break

// =================== SET PHOTO GROUP ===================
case "setppgc":
case "setppgroup":
case "setphotogc":
case "setfotogrup": {
if (!m.isGroup) return reply(mess.group);
if (!isAdmins) return reply(mess.admin);
if (!isBotAdmins) return reply(mess.botAdmin);

const qmsg = m.quoted ? m.quoted : m;
const mime = (qmsg.msg || qmsg).mimetype || "";

if (!/image/.test(mime)) {
return example("Reply atau kirim foto untuk dijadikan foto profil grup");
}

await vinss.sendMessage(m.chat, {
react: { text: "📸", key: m.key }
});

let mediaPath;
try {
mediaPath = await vinss.downloadAndSaveMediaMessage(qmsg);

await vinss.updateProfilePicture(m.chat, { url: mediaPath });

await vinss.sendMessage(m.chat, {
text: `✅ *Foto Profil Grup Berhasil Diupdate!*\n\n` +
`👥 Foto baru telah diterapkan untuk grup *${groupName || "ini"}*`,
contextInfo: previewAd({
title: `📸 Update Foto Group`,
body: `${groupName || "Group"}`,
thumbnail: global.img,
sourceUrl: global.web,
mention: [m.sender],
forward: true,
})
}, { quoted: m });

} catch (err) {
console.error("setppgc error:", err);
reply(`❌ Gagal mengupdate foto profil: ${err.message}`);
} finally {
try { if (mediaPath && fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath); } catch { }
}
}
break

// =================== SET NAME GROUP ===================
case "setnamegc":
case "setnamegroup":
case "setnamagc":
case "setnamagrup": {
if (!m.isGroup) return reply(mess.group);
if (!isAdmins) return reply(mess.admin);
if (!isBotAdmins) return reply(mess.botAdmin);

if (!text) return example("Nama Grup Baru");

await vinss.sendMessage(m.chat, {
react: { text: "📛", key: m.key }
});

try {
await vinss.groupUpdateSubject(m.chat, text);

await vinss.sendMessage(m.chat, {
text: `✅ *Nama Grup Berhasil Diupdate!*\n\n` +
`📛 *Nama Baru:* ${text}\n` +
`👥 Nama lama: *${groupName}*`,
contextInfo: previewAd({
title: `📛 Update Nama Group`,
body: `${text}`,
thumbnail: global.img,
sourceUrl: global.web,
mention: [m.sender],
forward: true,
})
}, { quoted: m });

} catch (err) {
console.error("setnamegc error:", err);
reply(`❌ Gagal mengupdate nama grup: ${err.message}`);
}
}
break// ← ✅ SUDAH DIPERBAIKI (dari "bbrea")


// =================== WALLPAPER ===================
case "wallpaper":
case "wp": {
if (!text) return example("anime girl");
await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });
try {
const results = await wallpaper(text);
if (!results.length) return m.reply("❌ Tidak ada hasil ditemukan.");
const pick = results[Math.floor(Math.random() * results.length)];
const imgUrl = pick.image[0];
if (!imgUrl) return m.reply("❌ Gambar tidak tersedia.");
await vinss.sendMessage(m.chat, {
image: { url: imgUrl },
caption: `🖼️ *Wallpaper*\n\n📌 *Judul:* ${pick.title || "-"}\n🏷️ *Tipe:* ${pick.type || "-"}\n🔗 *Source:* ${pick.source || "-"}`
}, { quoted: m });
} catch (err) {
console.error("wallpaper cmd error:", err);
m.reply(`❌ Gagal mencari wallpaper: ${err.message}`);
}
}
break

// =================== WIKIMEDIA ===================
case "wikimedia":
case "wkm": {
if (!text) return example("sunset mountain");
await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });
try {
const results = await wikimedia(text);
if (!results.length) return m.reply("❌ Tidak ada hasil ditemukan.");
const pick = results[Math.floor(Math.random() * Math.min(results.length, 5))];
if (!pick.image) return m.reply("❌ Gambar tidak tersedia.");
await vinss.sendMessage(m.chat, {
image: { url: pick.image },
caption: `🖼️ *Wikimedia Image*\n\n📌 *Judul:* ${pick.title || "-"}\n🔗 *Source:* https://commons.wikimedia.org${pick.source || ""}`
}, { quoted: m });
} catch (err) {
console.error("wikimedia cmd error:", err);
m.reply(`❌ Gagal mencari gambar: ${err.message}`);
}
}
break

// =================== HAPPYMOD ===================
case "happymod": {
if (!text) return example("minecraft");
await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });
try {
const results = await happymod(text);
if (!results.length) return m.reply("❌ Tidak ada hasil ditemukan.");
let teks = `📦 *HappyMod Search*\n🔍 Query: *${text}*\n\n`;
results.slice(0, 5).forEach((app, i) => {
teks += `*${i + 1}. ${app.title}*\n`;
teks += `⭐ Rating: ${app.rating || "-"}\n`;
teks += `🔗 ${app.link}\n\n`;
});
await vinss.sendMessage(m.chat, { text: teks }, { quoted: m });
} catch (err) {
console.error("happymod cmd error:", err);
m.reply(`❌ Gagal mencari aplikasi: ${err.message}`);
}
}
break

// =================== RINGTONE ===================
case "ringtone":
case "nada": {
if (!text) return example("iphone");
await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });
try {
const results = await ringtone(text);
const valid = results.filter(r => r.audio);
if (!valid.length) return m.reply("❌ Tidak ada ringtone ditemukan.");
const pick = valid[0];
await vinss.sendMessage(m.chat, {
audio: { url: pick.audio },
mimetype: "audio/mpeg",
fileName: `${pick.title || "ringtone"}.mp3`,
ptt: false
}, { quoted: m });
await vinss.sendMessage(m.chat, {
text: `🎵 *Ringtone*\n\n📌 *Judul:* ${pick.title || "-"}\n🔗 *Source:* ${pick.source || "-"}`
}, { quoted: m });
} catch (err) {
console.error("ringtone cmd error:", err);
m.reply(`❌ Gagal mencari ringtone: ${err.message}`);
}
}
break

// =================== GITHUB STALK ===================
case "githubstalk":
case "github": {
if (!text) return example("torvalds");
await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });
try {
const d = await githubstalk(text);
const teks = `🐙 *GitHub Stalker*\n\n` +
`👤 *Username:* ${d.username}\n` +
`📛 *Nama:* ${d.nickname || "-"}\n` +
`📝 *Bio:* ${d.bio || "-"}\n` +
`🏢 *Company:* ${d.company || "-"}\n` +
`📍 *Lokasi:* ${d.location || "-"}\n` +
`📧 *Email:* ${d.email || "-"}\n` +
`🔗 *Blog:* ${d.blog || "-"}\n` +
`📦 *Public Repo:* ${d.public_repo}\n` +
`👥 *Followers:* ${d.followers}\n` +
`➡️ *Following:* ${d.following}\n` +
`🕒 *Dibuat:* ${d.created_at}\n` +
`🔗 *URL:* ${d.url}`;
await vinss.sendMessage(m.chat, {
image: { url: d.profile_pic },
caption: teks
}, { quoted: m });
} catch (err) {
console.error("github cmd error:", err);
m.reply(`❌ User tidak ditemukan: ${err.message}`);
}
}
break

// =================== NPM STALK ===================
case "npmstalk":
case "npm": {
if (!text) return example("axios");
await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });
try {
const d = await npmstalk(text);
const teks = `📦 *NPM Package Info*\n\n` +
`📌 *Nama:* ${d.name}\n` +
`🏷️ *Versi Terbaru:* ${d.versionLatest}\n` +
`🔰 *Versi Pertama:* ${d.versionPublish}\n` +
`🔄 *Total Update:* ${d.versionUpdate}x\n` +
`📚 *Deps (latest):* ${d.latestDependencies}\n` +
`📚 *Deps (pertama):* ${d.publishDependencies}\n` +
`📅 *Pertama publish:* ${d.publishTime}\n` +
`🕒 *Update terakhir:* ${d.latestPublishTime}`;
await vinss.sendMessage(m.chat, { text: teks }, { quoted: m });
} catch (err) {
console.error("npm cmd error:", err);
m.reply(`❌ Package tidak ditemukan: ${err.message}`);
}
}
break

// =================== ML STALK ===================
case "mlstalk":
case "cekml": {
if (!text) return example("123456789|1234");
const [mlId, mlZone] = text.split("|");
if (!mlId || !mlZone) return example("ID|ZoneID — contoh: 123456789|1234");
await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });
try {
const d = await mlstalk(mlId.trim(), mlZone.trim());
const teks = `🎮 *Mobile Legends Stalk*\n\n` +
`👤 *Nama:* ${d.username || d.name || "-"}\n` +
`🆔 *ID:* ${mlId}\n` +
`🌍 *Zone:* ${mlZone}\n` +
`📊 *Detail:* ${JSON.stringify(d, null, 2).slice(0, 300)}`;
await vinss.sendMessage(m.chat, { text: teks }, { quoted: m });
} catch (err) {
console.error("mlstalk cmd error:", err);
m.reply(`❌ Akun ML tidak ditemukan: ${err.message}`);
}
}
break

// =================== MENU STALK ===================
case "stalk":
case "stalkmenu": {
const teksStalk = `
╭─────────────────────➤
│╭─▣「 *🔍 Stalk Menu* 」▣─╮
││ ⟿ .threads <username>
││Stalk profil Threads
││
││ ⟿ .tiktokstalk <username>
││Stalk profil TikTok
││
││ ⟿ .ytstalk <username>
││Stalk channel YouTube
││
││ ⟿ .github <username>
││Stalk profil GitHub
││
││ ⟿ .npm <package>
││Info package NPM
││
││ ⟿ .cekml <id>|<zone>
││Stalk akun Mobile Legends
│╰─➤
╰─────┈➤`.trim()

await vinss.sendMessage(m.chat, {
text: teksStalk,
contextInfo: previewAd({
title: `🔍 Stalk Menu`,
body: `${namabot} - v${global.version}`,
thumbnail: global.img,
sourceUrl: global.web,
mention: [m.sender],
forward: true,
})
}, { quoted: m })
}
break

// =================== THREADS STALK ===================
case "threads":
case "threadsstalk": {
if (!text) return example("zuck");
await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });
try {
const d = await threadsStalk(text.replace('@', ''));
const teks = `🧵 *Threads Stalker*\n\n` +
`👤 *Username:* @${d.username}\n` +
`📛 *Nama:* ${d.displayName || "-"}\n` +
`👥 *Followers:* ${d.followers?.toLocaleString() || "-"}\n` +
`📝 *Threads:* ${d.threads?.toLocaleString() || "-"}\n` +
`✅ *Verified:* ${d.verified === true ? 'Ya' : d.verified === false ? 'Tidak' : 'Tidak diketahui'}`

if (d.image) {
await vinss.sendMessage(m.chat, {
image: { url: d.image },
caption: teks
}, { quoted: m })
} else {
await vinss.sendMessage(m.chat, { text: teks }, { quoted: m })
}
} catch (err) {
console.error("threads cmd error:", err)
m.reply(`❌ Gagal stalk Threads: ${err.message}`)
}
}
break

// =================== TIKTOK STALK ===================
case "tiktokstalk":
case "stalktiktok": {
if (!text) return example("username");
await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });
try {
const username = text.replace('@', '')
const { data } = await axios.get(
`https://api.deline.web.id/stalker/ttstalk?username=${encodeURIComponent(username)}`,
{ headers: { 'User-Agent': 'Mozilla/5.0' } }
)

if (!data.status || !data.result) throw new Error('User tidak ditemukan')

const u = data.result.user
const s = data.result.stats

const teks = `🎵 *TikTok Stalker*\n\n` +
`👤 *Username:* @${u.uniqueId}\n` +
`📛 *Nama:* ${u.nickname || "-"}\n` +
`📝 *Bio:* ${u.signature || "-"}\n` +
`🌍 *Region:* ${u.region || "-"}\n` +
`✅ *Verified:* ${u.verified ? 'Ya' : 'Tidak'}\n` +
`🔒 *Private:* ${u.privateAccount ? 'Ya' : 'Tidak'}\n` +
`👥 *Followers:* ${s.followerCount?.toLocaleString() || 0}\n` +
`➡️ *Following:* ${s.followingCount?.toLocaleString() || 0}\n` +
`❤️ *Total Likes:* ${s.heartCount?.toLocaleString() || 0}\n` +
`🎬 *Total Video:* ${s.videoCount?.toLocaleString() || 0}`

await vinss.sendMessage(m.chat, {
image: { url: u.avatarMedium || u.avatarThumb },
caption: teks
}, { quoted: m })

} catch (err) {
console.error("tiktokstalk cmd error:", err)
m.reply(`❌ Gagal stalk TikTok: ${err.message}`)
}
}
break

// =================== TWITTER/X STALK ===================
case "xstalk":
case "twstalk":
case "twitterstalk": {
if (!text) return example("elonmusk");
await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });
try {
const username = text.replace('@', '')
const { data } = await axios.get(
`https://api.deline.web.id/stalker/twitter?username=${encodeURIComponent(username)}`,
{ headers: { 'User-Agent': 'Mozilla/5.0' } }
)

if (!data.status || !data.result) throw new Error('User tidak ditemukan')

const r = data.result
const core = r.core || {}
const legacy = r.legacy || {}
const avatar = r.avatar?.image_url || r.profile_image_url_https || null
const profileBanner = r.profile_banner_url || null

// ambil stats dari berbagai kemungkinan field
const followers = r.followers_count ?? legacy.followers_count ?? r.public_metrics?.followers_count ?? 0
const following = r.friends_count ?? legacy.friends_count ?? r.public_metrics?.following_count ?? 0
const tweets = r.statuses_count ?? legacy.statuses_count ?? r.public_metrics?.tweet_count ?? 0
const likes = r.favourites_count ?? legacy.favourites_count ?? 0

const name = core.name ?? legacy.name ?? r.name ?? username
const screenName = core.screen_name ?? legacy.screen_name ?? r.username ?? username
const bio = r.description ?? legacy.description ?? r.legacy?.description ?? "-"
const location = r.location ?? legacy.location ?? "-"
const verified = r.verified ?? legacy.verified ?? r.is_blue_verified ?? false
const createdAt = core.created_at ?? legacy.created_at ?? "-"

const teks = `🐦 *Twitter/X Stalker*\n\n` +
`📛 *Nama:* ${name}\n` +
`👤 *Username:* @${screenName}\n` +
`📝 *Bio:* ${bio || "-"}\n` +
`📍 *Lokasi:* ${location || "-"}\n` +
`✅ *Verified:* ${verified ? 'Ya' : 'Tidak'}\n` +
`👥 *Followers:* ${Number(followers).toLocaleString()}\n` +
`➡️ *Following:* ${Number(following).toLocaleString()}\n` +
`🐦 *Tweets:* ${Number(tweets).toLocaleString()}\n` +
`❤️ *Likes:* ${Number(likes).toLocaleString()}\n` +
`📅 *Bergabung:* ${createdAt}`

// foto profil HD (hapus _normal dari URL)
const avatarHd = avatar ? avatar.replace('_normal.', '_400x400.') : null

if (avatarHd) {
await vinss.sendMessage(m.chat, {
image: { url: avatarHd },
caption: teks
}, { quoted: m })
} else {
await vinss.sendMessage(m.chat, { text: teks }, { quoted: m })
}

} catch (err) {
console.error("xstalk cmd error:", err)
m.reply(`❌ Gagal stalk Twitter/X: ${err.message}`)
}
}
break

// =================== YOUTUBE STALK ===================
case "ytstalk":
case "youtubestalk": {
if (!text) return example("VinssBotz");
await vinss.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });
try {
const d = await ytStalk(text.replace('@', ''));
if (d.status === false) return m.reply(`❌ ${d.message}`)

const teks = `▶️ *YouTube Stalker*\n\n` +
`📛 *Nama:* ${d.name || "-"}\n` +
`🔗 *Username:* ${d.username || "-"}\n` +
`👥 *Subscriber:* ${d.subscriber}\n` +
`🎬 *Video:* ${d.videos}`

if (d.profile) {
await vinss.sendMessage(m.chat, {
image: { url: d.profile },
caption: teks
}, { quoted: m })
} else {
await vinss.sendMessage(m.chat, { text: teks }, { quoted: m })
}
} catch (err) {
console.error("ytstalk cmd error:", err)
m.reply(`❌ Gagal stalk YouTube: ${err.message}`)
}
}
break

// =================== JS ENCRYPT ===================
case "jsenc":
case "jsencrypt":
case "encjs": {
if (!isCreator) return larang()

let code = text

// kalau tidak ada text, ambil dari quoted
if (!code && m.quoted?.text) code = m.quoted.text
if (!code) return example(`console.log('Hello World')`)

await vinss.sendMessage(m.chat, { react: { text: "🔐", key: m.key } })

try {
const { data } = await axios.get(
`https://api.deline.web.id/tools/enc?text=${encodeURIComponent(code)}`,
{ headers: { 'User-Agent': 'Mozilla/5.0' } }
)

if (!data.status || !data.result) throw new Error('Gagal mengenkripsi kode')

const hasil = data.result
const preview = hasil.slice(0, 200) + (hasil.length > 200 ? '...' : '')

await vinss.sendMessage(m.chat, {
text: `🔐 *JavaScript Encrypt*\n\n` +
`📥 *Input:*\n\`\`\`${code.slice(0, 100)}${code.length > 100 ? '...' : ''}\`\`\`\n\n` +
`📤 *Output (${hasil.length} chars):*\n\`\`\`${preview}\`\`\``
}, { quoted: m })

// kirim file juga kalau panjang
if (hasil.length > 100) {
const tempPath = `./database/enc_${Date.now()}.js`
fs.writeFileSync(tempPath, hasil)
await vinss.sendMessage(m.chat, {
document: fs.readFileSync(tempPath),
fileName: `encrypted_${Date.now()}.js`,
mimetype: 'application/javascript',
caption: '📎 File hasil enkripsi'
}, { quoted: m })
try { fs.unlinkSync(tempPath) } catch { }
}

} catch (err) {
console.error('jsenc cmd error:', err)
m.reply(`❌ Gagal enkripsi: ${err.message}`)
}
}
break

// =================== WEBCLONE ===================
case "webclone":
case "cloneweb": {
if (!isCreator) return larang()
if (!text) return example("https://www.vinss-dev.my.id")
if (!/^https?:\/\/.+/i.test(text)) return m.reply("❌ URL tidak valid. Pastikan diawali https://")

await vinss.sendMessage(m.chat, { react: { text: "⚙️", key: m.key } })

const processMsg = await vinss.sendMessage(m.chat, {
text: `⏳ *Sedang mengkloning website...*\n🌐 URL: ${text}\n\n_Mohon tunggu, proses ini membutuhkan beberapa detik..._`
}, { quoted: m })

try {
const { data } = await axios.get(
`https://api.azbry.com/api/tools/webclone?url=${encodeURIComponent(text)}`,
{ headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 60000 }
)

if (!data.status || !data.result) throw new Error('Gagal mengkloning website')

const { url: downloadUrl, filename } = data.result

await vinss.sendMessage(m.chat, {
text: `✅ *Website Berhasil Dikloning!*\n\n` +
`🌐 *URL Asli:* ${text}\n` +
`📦 *File:* ${filename}\n` +
`🔗 *Download:* ${downloadUrl}\n\n` +
`_Link aktif sementara, segera download!_`,
edit: processMsg.key
})

} catch (err) {
console.error("webclone cmd error:", err)
await vinss.sendMessage(m.chat, {
text: `❌ *Gagal mengkloning website!*\n\n${err.message}`,
edit: processMsg.key
})
}
}
break

// =================== MAKE APK ===================
case "makeapk":
case "buatapk": {
if (!isCreator) return larang()
if (!text) return example(`https://google.com | NamaApp | com.nama.app`)

const parts = text.split('|').map(s => s.trim())
const websiteUrl = parts[0]
const appName = parts[1] || 'My App'
const packageName = parts[2] || 'com.app.webview'

if (!websiteUrl || !/^https?:\/\/.+/i.test(websiteUrl)) {
return reply(`❌ URL tidak valid.\n\n*Format:* ${prefix + command} <url>|<nama app>|<package>`)
}

// ambil icon dari quoted image kalau ada
let iconBuffer = null
if (m.quoted && /image/.test((m.quoted.msg || m.quoted).mimetype || '')) {
try {
const mediaPath = await vinss.downloadAndSaveMediaMessage(m.quoted)
iconBuffer = fs.readFileSync(mediaPath)
try { fs.unlinkSync(mediaPath) } catch { }
} catch { }
}

await vinss.sendMessage(m.chat, { react: { text: "⚙️", key: m.key } })

const processMsg = await vinss.sendMessage(m.chat, {
text: `⏳ *Sedang membuild APK...*\n\n` +
`🌐 URL: ${websiteUrl}\n` +
`📛 Nama: ${appName}\n` +
`📦 Package: ${packageName}\n\n` +
`_Proses ini membutuhkan waktu 1-3 menit..._`
}, { quoted: m })

try {
const result = await createApk({
websiteUrl,
appName,
packageName,
iconBuffer
})

const apkName = `${appName.replace(/\s+/g, '_')}.apk`
const tempPath = `./database/${apkName}`
fs.writeFileSync(tempPath, result.buffer)

await vinss.sendMessage(m.chat, {
document: fs.readFileSync(tempPath),
fileName: apkName,
mimetype: 'application/vnd.android.package-archive',
caption: `✅ *APK Berhasil Dibuat!*\n\n` +
`📛 *Nama App:* ${appName}\n` +
`📦 *Package:* ${packageName}\n` +
`🌐 *Website:* ${websiteUrl}\n` +
`📥 *File:* ${apkName}`
}, { quoted: m })

try { fs.unlinkSync(tempPath) } catch { }

await vinss.sendMessage(m.chat, {
text: `✅ *Build selesai!*`,
edit: processMsg.key
})

} catch (err) {
console.error('makeapk cmd error:', err)
await vinss.sendMessage(m.chat, {
text: `❌ *Build APK Gagal!*\n\n${err.message}`,
edit: processMsg.key
})
}
}
break

// =================== PING LIVE / SERVER MONITOR ===================
case "ping":
case "pinglive":
case "server": {
  // Rate limit 5 detik
  const wait = checkPingRate(m.sender);
  if (wait > 0) {
    return m.reply(`⏳ Tunggu *${wait} detik* lagi sebelum cek server.`);
  }

  try {
    await vinss.sendMessage(m.chat, {
      react: { text: "💻", key: m.key }
    }).catch(() => {});

    // Collect data
    const d = await collectServerData(vinss);

    // Build WhatsApp rich message payload
    const pingMsg = buildPingMessage(d);

    if (!pingMsg) {
      throw new Error("buildPingMessage() menghasilkan data kosong");
    }

    // Generate WA message
    const pingWA = generateWAMessageFromContent(m.chat, pingMsg, {});

    if (!pingWA || !pingWA.message) {
      console.log(
        "[PING DEBUG] Hasil generate:",
        JSON.stringify(pingWA, null, 2).slice(0, 1500)
      );
      throw new Error("generateWAMessageFromContent() tidak menghasilkan message");
    }

    // Relay ke chat
    await vinss.relayMessage(
      m.chat,
      pingWA.message,
      { messageId: pingWA.key?.id || undefined }
    );

    console.log("[PING] Berhasil kirim monitor ke", m.chat);

  } catch (err) {
    console.error("[PING ERROR]", err);

    // Fallback: kirim teks biasa
    try {
      const d = await collectServerData(vinss);

      await m.reply(
        `💻 *SERVER MONITOR*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📡 *Ping*     : ${d.ping > 0 ? d.ping + ' ms' : 'N/A'}\n` +
        `⬇️ *Download* : ${d.download}\n` +
        `⬆️ *Upload*   : ${d.upload}\n` +
        `🌡️ *CPU Temp* : ${d.tempTxt}\n` +
        `⚙️ *CPU*      : ${d.cpu}%\n` +
        `🧠 *RAM*      : ${d.ram}%\n` +
        `💾 *Disk*     : ${d.disk}%\n` +
        `🕐 *Uptime*   : ${d.botUpSec}s\n` +
        `🖥️ *OS*       : ${d.osType}\n` +
        `⚡ *Runtime*  : ${d.runtime}`
      );
    } catch (fallbackErr) {
      m.reply(`❌ Gagal membuka Server Monitor\n\n${err.message}`);
    }
  }
}
break

// =================== AI: DEEPSEEK ===================
case "deepseek":
case "ds": {
if (!text) return example("siapa pencipta dunia?");
await vinss.sendMessage(m.chat, { react: { text: "🤖", key: m.key } });
const wait = await vinss.sendMessage(m.chat, { text: "⏳ *DeepSeek* sedang berpikir..." }, { quoted: m });
try {
const result = await askDeepSeek(text);
if (!result) throw new Error("Tidak ada jawaban");
await vinss.sendMessage(m.chat, {
text: `🤖 *DeepSeek AI*\n\n❓ *Pertanyaan:*\n${text}\n\n💬 *Jawaban:*\n${result}`,
edit: wait.key
});
} catch (err) {
console.error("deepseek cmd error:", err);
await vinss.sendMessage(m.chat, { text: `❌ DeepSeek error: ${err.message}`, edit: wait.key });
}
}
break

// =================== AI: GPT-4o via Overchat ===================
case "gpt":
case "gpt4": {
if (!text) return example("buatkan puisi tentang hujan");
await vinss.sendMessage(m.chat, { react: { text: "🤖", key: m.key } });
const wait = await vinss.sendMessage(m.chat, { text: "⏳ *GPT-4o* sedang berpikir..." }, { quoted: m });
try {
const result = await overchat(text);
if (!result) throw new Error("Tidak ada jawaban");
await vinss.sendMessage(m.chat, {
text: `🤖 *GPT-4o AI*\n\n❓ *Pertanyaan:*\n${text}\n\n💬 *Jawaban:*\n${result}`,
edit: wait.key
});
} catch (err) {
console.error("gpt cmd error:", err);
await vinss.sendMessage(m.chat, { text: `❌ GPT-4o error: ${err.message}`, edit: wait.key });
}
}
break

// =================== AI: CHRUNOS ===================
case "ai":
case "chrunos": {
if (!text) return example("jelaskan apa itu blackhole");
await vinss.sendMessage(m.chat, { react: { text: "🤖", key: m.key } });
const wait = await vinss.sendMessage(m.chat, { text: "⏳ *AI* sedang berpikir..." }, { quoted: m });
try {
const result = await chrunos(text);
if (!result) throw new Error("Tidak ada jawaban");
await vinss.sendMessage(m.chat, {
text: `🤖 *Chrunos AI*\n\n❓ *Pertanyaan:*\n${text}\n\n💬 *Jawaban:*\n${result}`,
edit: wait.key
});
} catch (err) {
console.error("ai cmd error:", err);
await vinss.sendMessage(m.chat, { text: `❌ AI error: ${err.message}`, edit: wait.key });
}
}
break

// =================== LIRIK ===================
case "lirik":
case "lyrics": {
if (!text) return example("naff kau masih kekasihku");

await vinss.sendMessage(m.chat, { react: { text: "🎵", key: m.key } });

try {
// format: "artis judul" atau "judul" saja
const query = encodeURIComponent(text);
const { data } = await axios.get(
`https://lrclib.net/api/search?q=${query}`,
{ headers: { 'User-Agent': 'VinssBotz/1.0' } }
);

if (!data || !data.length) return m.reply("❌ Lirik tidak ditemukan.");

// ambil hasil paling relevan yang ada liriknya
const track = data.find(t => t.plainLyrics && t.duration > 10) || data[0];

if (!track) return m.reply("❌ Tidak ada hasil yang valid.");

const durasi = track.duration
? `${Math.floor(track.duration / 60)}:${String(Math.floor(track.duration % 60)).padStart(2, '0')}`
: '-';

const lirik = track.plainLyrics
? track.plainLyrics.trim().slice(0, 3000) + (track.plainLyrics.length > 3000 ? '\n...(terpotong)' : '')
: '❌ Lirik tidak tersedia';

const teks =
`🎵 *${track.trackName}*\n` +
`👤 *Artis:* ${track.artistName}\n` +
`💿 *Album:* ${track.albumName || '-'}\n` +
`⏱ *Durasi:* ${durasi}\n` +
`${'─'.repeat(30)}\n\n` +
`${lirik}`;

await vinss.sendMessage(m.chat, { text: teks }, { quoted: m });

} catch (err) {
console.error("lirik cmd error:", err);
m.reply(`❌ Gagal mencari lirik: ${err.message}`);
}
}
break

// =================== TIC TAC TOE (AI) ===================
case "tictactoe":
case "ttt":
case "tic":
case "tictac": {
try {
await vinss.sendMessage(m.chat, {
react: { text: "🎮", key: m.key }
})

const tttMsg = buildTicTacToeMessage(
global.namabot || "VINSS BOTZ"
)

const tttWA = generateWAMessageFromContent(
m.chat,
tttMsg,
{}
)

await vinss.relayMessage(
m.chat,
tttWA.message,
{
messageId: tttWA.key.id
}
)

} catch (err) {
console.error("TicTacToe Error:", err)

await m.reply(
`❌ *Gagal membuka Tic-Tac-Toe!*\n\n${err.message}`
)
}
}
break

case "subwaysurf":
case "subway":
case "surf":
case "runner": {
try {
await vinss.sendMessage(m.chat, {
react: {
text: "🏃",
key: m.key
}
})

const subwayMsg = buildSubwaySurfMessage(
global.namabot || "VINSS BOTZ"
)

if (!subwayMsg) {
throw new Error("buildSubwaySurfMessage() menghasilkan data kosong")
}

const subwayWA = generateWAMessageFromContent(
m.chat,
subwayMsg,
{}
)

if (!subwayWA) {
throw new Error(
"generateWAMessageFromContent() menghasilkan undefined"
)
}

if (!subwayWA.message) {
console.log(
"[SUBWAYSURF DEBUG] Hasil generate:",
JSON.stringify(subwayWA, null, 2)
)

throw new Error(
"generateWAMessageFromContent() tidak menghasilkan message"
)
}

await vinss.relayMessage(
m.chat,
subwayWA.message,
{
messageId: subwayWA.key?.id || undefined
}
)

} catch (err) {
console.error(
"[SUBWAYSURF ERROR]",
err
)

await m.reply(
`❌ *Subway Surf gagal dikirim!*\n\n` +
`Error: ${err.message}`
)
}
}
break

case "catur":
case "chess": {
try {

await vinss.sendMessage(
m.chat,
{
react: {
text: "♟️",
key: m.key
}
}
);

const chessMsg =
buildChessMessage(
global.namabot ||
"VINSS BOTZ"
);

const chessWA =
generateWAMessageFromContent(
m.chat,
chessMsg,
{}
);

await vinss.relayMessage(
m.chat,
chessWA.message,
{
messageId:
chessWA.key.id
}
);

} catch (err) {

console.error(
"❌ CHESS ERROR:",
err
);

await m.reply(
`❌ *Gagal membuka Chess!*\n\n` +
`${err.stack || err.message}`
);

}
}
break;
// =================== SPACE RUSH (HTML Canvas Game) ===================
case "spacerush":
case "spacestart":
case "space": {
await vinss.sendMessage(m.chat, { react: { text: '🚀', key: m.key } })

spaceSession.set(m.sender, { chat: m.chat, sentAt: Date.now() })

const srMsg = buildSpaceRushMessage(global.namabot || 'VINSS BOTZ')
const srWA = generateWAMessageFromContent(m.chat, srMsg, {})
await vinss.relayMessage(m.chat, srWA.message, { messageId: srWA.key.id })
}
break

case "stoprush":
case "stopspace": {
if (!spaceSession.has(m.sender)) return reply('❌ Kamu tidak sedang main Space Rush.')
spaceSession.delete(m.sender)
await vinss.sendMessage(m.chat, { react: { text: '🛑', key: m.key } })
reply('🛑 *Space Rush dihentikan!*\nKetik *.spacerush* untuk main lagi.')
}
break


// =================== GAME: ASAH OTAK ===================
case "asahotak": {
await vinss.sendMessage(m.chat, { react: { text: "🧠", key: m.key } })
try {
const { data } = await axios.get("https://api.deline.web.id/game/asahotak")
if (!data.status) throw new Error("Gagal mengambil soal")
const d = data.data
const soalMsg = await vinss.sendMessage(m.chat, {
text: `🧠 *Asah Otak #${d.index}*\n\n❓ ${d.soal}\n\n_Ketik jawabanmu! Waktu: 30 detik_`
}, { quoted: m })

const timer = setTimeout(async () => {
if (gameSession.has(m.chat)) {
gameSession.delete(m.chat)
await vinss.sendMessage(m.chat, {
text: `⏰ *Waktu habis!*\n💡 Jawaban: *${d.jawaban}*`
}, { quoted: soalMsg })
}
}, 30000)

gameSession.set(m.chat, { jawaban: d.jawaban, timer, soalMsg })
} catch (err) { m.reply(`❌ Error: ${err.message}`) }
}
break

// =================== GAME: CAK LONTONG ===================
case "caklontong": {
await vinss.sendMessage(m.chat, { react: { text: "😂", key: m.key } })
try {
const { data } = await axios.get("https://api.deline.web.id/game/caklontong")
if (!data.status) throw new Error("Gagal mengambil soal")
const d = data.data
const soalMsg = await vinss.sendMessage(m.chat, {
text: `😂 *Cak Lontong #${d.index}*\n\n❓ ${d.soal}\n\n_Ketik jawabanmu! Waktu: 30 detik_`
}, { quoted: m })

const timer = setTimeout(async () => {
if (gameSession.has(m.chat)) {
gameSession.delete(m.chat)
await vinss.sendMessage(m.chat, {
text: `⏰ *Waktu habis!*\n💡 Jawaban: *${d.jawaban}*\n📝 _${d.deskripsi || ""}_`
}, { quoted: soalMsg })
}
}, 30000)

gameSession.set(m.chat, { jawaban: d.jawaban, timer, soalMsg })
} catch (err) { m.reply(`❌ Error: ${err.message}`) }
}
break

// =================== GAME: CERDAS CERMAT ===================
case "cc":
case "cerdascemat": {
const mapel = args[0] || "ipa"
const jumlah = Math.min(Math.max(parseInt(args[1]) || 5, 5), 10)
const validMapel = ["bindo", "tik", "pkn", "bing", "penjas", "pai", "matematika", "jawa", "ips", "ipa"]
if (!validMapel.includes(mapel)) {
return reply(`❌ Mata pelajaran tidak valid.\nPilihan: ${validMapel.join(", ")}`)
}
await vinss.sendMessage(m.chat, { react: { text: "📚", key: m.key } })
try {
const { data } = await axios.get(`https://api.deline.web.id/game/cc-sd?matapelajaran=${mapel}&jumlahsoal=${jumlah}`)
if (!data.status) throw new Error("Gagal mengambil soal")
let teks = `📚 *Cerdas Cermat — ${mapel.toUpperCase()}*\n${jumlah} soal\n\n`
data.soal.forEach((s, i) => {
teks += `*${i + 1}.* ${s.pertanyaan}\n`
s.semua_jawaban.forEach(j => {
const [k, v] = Object.entries(j)[0]
teks += ` ${k}. ${v}\n`
})
teks += `✅ Jawaban: *${s.jawaban_benar.toUpperCase()}*\n\n`
})
await vinss.sendMessage(m.chat, { text: teks }, { quoted: m })
} catch (err) {
m.reply(`❌ Error: ${err.message}`)
}
}
break

// =================== GAME: FAMILY 100 ===================
case "family100": {
await vinss.sendMessage(m.chat, { react: { text: "👨‍👩‍👧", key: m.key } })
try {
const { data } = await axios.get("https://api.deline.web.id/game/family100")
if (!data.status) throw new Error("Gagal mengambil soal")
const d = data.result
const soalMsg = await vinss.sendMessage(m.chat, {
text: `👨‍👩‍👧 *Family 100*\n\n❓ ${d.soal}\n\n_Ada ${d.jawaban.length} jawaban. Ketik satu per satu! Waktu: 60 detik_`
}, { quoted: m })

// family100 multi jawaban — simpan array, hapus yang sudah ditebak
const jawabanList = d.jawaban.map(j => j.toLowerCase())
const terjawab = new Set()

const timer = setTimeout(async () => {
if (gameSession.has(m.chat)) {
gameSession.delete(m.chat)
const sisa = d.jawaban.filter((_, i) => !terjawab.has(i))
await vinss.sendMessage(m.chat, {
text: `⏰ *Waktu habis!*\n💡 Jawaban yang tersisa:\n${sisa.map((j, i) => `${i + 1}. ${j}`).join('\n')}`
}, { quoted: soalMsg })
}
}, 60000)

gameSession.set(m.chat, {
jawaban: jawabanList[0], // untuk kompatibilitas cek jawaban tunggal
jawabanList,
terjawab,
soalMsg,
timer,
isFamily100: true,
allJawaban: d.jawaban
})
} catch (err) { m.reply(`❌ Error: ${err.message}`) }
}
break

// =================== GAME: MATHS ===================
case "maths":
case "matematik": {
const levels = ["noob", "easy", "medium", "hard", "extreme", "impossible", "impossible2", "impossible3", "impossible4", "impossible5"]
const level = args[0] || "easy"
if (!levels.includes(level)) return reply(`❌ Level tidak valid.\nPilihan: ${levels.join(", ")}`)
await vinss.sendMessage(m.chat, { react: { text: "🔢", key: m.key } })
try {
const { data } = await axios.get(`https://api.deline.web.id/game/maths?level=${level}`)
if (!data.status) throw new Error("Gagal mengambil soal")
const d = data.data
const soalMsg = await vinss.sendMessage(m.chat, {
text: `🔢 *Maths — ${d.mode}*\n\n❓ ${d.pertanyaan}\n\n_Ketik jawabanmu! Waktu: 30 detik_`
}, { quoted: m })

const timer = setTimeout(async () => {
if (gameSession.has(m.chat)) {
gameSession.delete(m.chat)
await vinss.sendMessage(m.chat, {
text: `⏰ *Waktu habis!*\n💡 Jawaban: *${d.jawaban}*`
}, { quoted: soalMsg })
}
}, 30000)

gameSession.set(m.chat, { jawaban: String(d.jawaban), timer, soalMsg })
} catch (err) { m.reply(`❌ Error: ${err.message}`) }
}
break

// =================== GAME: SIAPAKAH AKU ===================
case "siapakahaku": {
await vinss.sendMessage(m.chat, { react: { text: "🤔", key: m.key } })
try {
const { data } = await axios.get("https://api.deline.web.id/game/siapakahaku")
if (!data.status) throw new Error("Gagal mengambil soal")
const d = data.result
const soalMsg = await vinss.sendMessage(m.chat, {
text: `🤔 *Siapakah Aku?*\n\n❓ ${d.soal}\n\n_Ketik jawabanmu! Waktu: 30 detik_`
}, { quoted: m })
const timer = setTimeout(async () => {
if (gameSession.has(m.chat)) {
gameSession.delete(m.chat)
await vinss.sendMessage(m.chat, { text: `⏰ *Waktu habis!*\n💡 Jawaban: *${d.jawaban}*` }, { quoted: soalMsg })
}
}, 30000)
gameSession.set(m.chat, { jawaban: d.jawaban, timer, soalMsg })
} catch (err) { m.reply(`❌ Error: ${err.message}`) }
}
break

// =================== GAME: SUSUN KATA ===================
case "susunkata": {
await vinss.sendMessage(m.chat, { react: { text: "🔤", key: m.key } })
try {
const { data } = await axios.get("https://api.deline.web.id/game/susunkata")
if (!data.status) throw new Error("Gagal mengambil soal")
const d = data.result
const soalMsg = await vinss.sendMessage(m.chat, {
text: `🔤 *Susun Kata*\n\n🏷️ Tipe: ${d.tipe}\n❓ Susun huruf: *${d.soal}*\n\n_Ketik jawabanmu! Waktu: 30 detik_`
}, { quoted: m })
const timer = setTimeout(async () => {
if (gameSession.has(m.chat)) {
gameSession.delete(m.chat)
await vinss.sendMessage(m.chat, { text: `⏰ *Waktu habis!*\n💡 Jawaban: *${d.jawaban}*` }, { quoted: soalMsg })
}
}, 30000)
gameSession.set(m.chat, { jawaban: d.jawaban, timer, soalMsg })
} catch (err) { m.reply(`❌ Error: ${err.message}`) }
}
break

// =================== GAME: TEBAK ANIME ===================
case "tebakanime": {
await vinss.sendMessage(m.chat, { react: { text: "🎌", key: m.key } })
try {
const { data } = await axios.get("https://api.deline.web.id/game/tebakanime")
if (!data.status) throw new Error("Gagal mengambil soal")
const d = data.result
const msg = await vinss.sendMessage(m.chat, {
image: { url: d.soal },
caption: `🎌 *Tebak Anime*\n\n❓ Anime apakah ini?\n\n_Jawaban dikirim 30 detik lagi..._`
}, { quoted: m })
setTimeout(async () => {
await vinss.sendMessage(m.chat, {
text: `✅ *Jawaban:* ${d.jawaban}`,
edit: msg.key
})
}, 30000)
} catch (err) {
m.reply(`❌ Error: ${err.message}`)
}
}
break

// =================== GAME: TEBAK BENDERA ===================
case "tebakbendera": {
await vinss.sendMessage(m.chat, { react: { text: "🏳️", key: m.key } })
try {
const { data } = await axios.get("https://api.deline.web.id/game/tebakbendera")
if (!data.status) throw new Error("Gagal mengambil soal")
const d = data.result
const msg = await vinss.sendMessage(m.chat, {
image: { url: d.img },
caption: `🏳️ *Tebak Bendera*\n\n❓ Bendera negara apakah ini?\n\n_Jawaban dikirim 30 detik lagi..._`
}, { quoted: m })
setTimeout(async () => {
await vinss.sendMessage(m.chat, {
text: `✅ *Jawaban:* ${d.name}`,
edit: msg.key
})
}, 30000)
} catch (err) {
m.reply(`❌ Error: ${err.message}`)
}
}
break

// =================== GAME: TEBAK FF ===================
case "tebakff": {
await vinss.sendMessage(m.chat, { react: { text: "🔫", key: m.key } })
try {
const { data } = await axios.get("https://api.deline.web.id/game/tebakff")
if (!data.status) throw new Error("Gagal mengambil soal")
const d = data.result
const msg = await vinss.sendMessage(m.chat, {
image: { url: d.img },
caption: `🔫 *Tebak Karakter FF*\n\n❓ Siapakah karakter Free Fire ini?\n\n_Jawaban dikirim 30 detik lagi..._`
}, { quoted: m })
setTimeout(async () => {
await vinss.sendMessage(m.chat, {
text: `✅ *Jawaban:* ${d.jawaban}\n📝 _${d.deskripsi || ""}_`,
edit: msg.key
})
}, 30000)
} catch (err) {
m.reply(`❌ Error: ${err.message}`)
}
}
break

// =================== GAME: TEBAK GAMBAR ===================
case "tebakgambar": {
await vinss.sendMessage(m.chat, { react: { text: "🖼️", key: m.key } })
try {
const { data } = await axios.get("https://api.deline.web.id/game/tebakgambar")
if (!data.status) throw new Error("Gagal mengambil soal")
const d = data.result
const msg = await vinss.sendMessage(m.chat, {
image: { url: d.img },
caption: `🖼️ *Tebak Gambar #${d.index}*\n\n❓ Apa yang ada di gambar ini?\n\n_Jawaban dikirim 30 detik lagi..._`
}, { quoted: m })
setTimeout(async () => {
await vinss.sendMessage(m.chat, {
text: `✅ *Jawaban:* ${d.jawaban}\n📝 _${d.deskripsi || ""}_`,
edit: msg.key
})
}, 30000)
} catch (err) {
m.reply(`❌ Error: ${err.message}`)
}
}
break

// =================== GAME: TEBAK GAME ===================
case "tebakgame": {
await vinss.sendMessage(m.chat, { react: { text: "🎮", key: m.key } })
try {
const { data } = await axios.get("https://api.deline.web.id/game/tebakgame")
if (!data.status) throw new Error("Gagal mengambil soal")
const d = data.result
const msg = await vinss.sendMessage(m.chat, {
image: { url: d.img },
caption: `🎮 *Tebak Game*\n\n❓ Game apakah ini?\n\n_Jawaban dikirim 30 detik lagi..._`
}, { quoted: m })
setTimeout(async () => {
await vinss.sendMessage(m.chat, {
text: `✅ *Jawaban:* ${d.jawaban}`,
edit: msg.key
})
}, 30000)
} catch (err) {
m.reply(`❌ Error: ${err.message}`)
}
}
break

// =================== GAME: TEBAK HERO ML ===================
case "tebakheroml":
case "tebakherml": {
await vinss.sendMessage(m.chat, { react: { text: "⚔️", key: m.key } })
try {
const { data } = await axios.get("https://api.deline.web.id/game/tebakheroml")
if (!data.status) throw new Error("Gagal mengambil soal")
const d = data.result
const msg = await vinss.sendMessage(m.chat, {
image: { url: d.img },
caption: `⚔️ *Tebak Hero ML*\n\n❓ Hero Mobile Legends apakah ini?\n\n_Jawaban dikirim 30 detik lagi..._`
}, { quoted: m })
setTimeout(async () => {
await vinss.sendMessage(m.chat, {
text: `✅ *Jawaban:* ${d.jawaban}\n📝 _${d.deskripsi || ""}_`,
edit: msg.key
})
}, 30000)
} catch (err) {
m.reply(`❌ Error: ${err.message}`)
}
}
break

// =================== GAME: TEBAK KALIMAT ===================
case "tebakkalimat": {
await vinss.sendMessage(m.chat, { react: { text: "💬", key: m.key } })
try {
const { data } = await axios.get("https://api.deline.web.id/game/tebakkalimat")
if (!data.status) throw new Error("Gagal mengambil soal")
const d = data.result
const soalMsg = await vinss.sendMessage(m.chat, {
text: `💬 *Tebak Kalimat #${d.index}*\n\n❓ ${d.soal}\n\n_Ketik jawabanmu! Waktu: 30 detik_`
}, { quoted: m })
const timer = setTimeout(async () => {
if (gameSession.has(m.chat)) {
gameSession.delete(m.chat)
await vinss.sendMessage(m.chat, { text: `⏰ *Waktu habis!*\n💡 Jawaban: *${d.jawaban}*` }, { quoted: soalMsg })
}
}, 30000)
gameSession.set(m.chat, { jawaban: d.jawaban, timer, soalMsg })
} catch (err) { m.reply(`❌ Error: ${err.message}`) }
}
break

// =================== GAME: TEBAK KATA ===================
case "tebakkata": {
await vinss.sendMessage(m.chat, { react: { text: "🔤", key: m.key } })
try {
const { data } = await axios.get("https://api.deline.web.id/game/tebakkata")
if (!data.status) throw new Error("Gagal mengambil soal")
const d = data.result
const soalMsg = await vinss.sendMessage(m.chat, {
text: `🔤 *Tebak Kata*\n\n❓ Petunjuk: ${d.soal}\n\n_Ketik jawabanmu! Waktu: 30 detik_`
}, { quoted: m })
const timer = setTimeout(async () => {
if (gameSession.has(m.chat)) {
gameSession.delete(m.chat)
await vinss.sendMessage(m.chat, { text: `⏰ *Waktu habis!*\n💡 Jawaban: *${d.jawaban}*` }, { quoted: soalMsg })
}
}, 30000)
gameSession.set(m.chat, { jawaban: d.jawaban, timer, soalMsg })
} catch (err) { m.reply(`❌ Error: ${err.message}`) }
}
break

// =================== GAME: TEBAK KIMIA ===================
case "tebakkimia": {
await vinss.sendMessage(m.chat, { react: { text: "⚗️", key: m.key } })
try {
const { data } = await axios.get("https://api.deline.web.id/game/tebakkimia")
if (!data.status) throw new Error("Gagal mengambil soal")
const d = data.data
const soalMsg = await vinss.sendMessage(m.chat, {
text: `⚗️ *Tebak Kimia*\n\n❓ Apa lambang unsur dari: *${d.unsur}*?\n\n_Ketik jawabanmu! Waktu: 20 detik_`
}, { quoted: m })
const timer = setTimeout(async () => {
if (gameSession.has(m.chat)) {
gameSession.delete(m.chat)
await vinss.sendMessage(m.chat, { text: `⏰ *Waktu habis!*\n💡 Jawaban: *${d.lambang}*` }, { quoted: soalMsg })
}
}, 20000)
gameSession.set(m.chat, { jawaban: d.lambang, timer, soalMsg })
} catch (err) { m.reply(`❌ Error: ${err.message}`) }
}
break

// =================== GAME: TEBAK PEMAIN BOLA ===================
case "tebakpembola":
case "tebakpemainbola": {
await vinss.sendMessage(m.chat, { react: { text: "⚽", key: m.key } })
try {
const { data } = await axios.get("https://api.deline.web.id/game/tebakpemainbola")
if (!data.status) throw new Error("Gagal mengambil soal")
const d = data.result
const soalMsg = await vinss.sendMessage(m.chat, {
text: `⚽ *Tebak Pemain Bola*\n\n❓ ${d.soal}\n\n_Ketik jawabanmu! Waktu: 30 detik_`
}, { quoted: m })
const timer = setTimeout(async () => {
if (gameSession.has(m.chat)) {
gameSession.delete(m.chat)
await vinss.sendMessage(m.chat, {
text: `⏰ *Waktu habis!*\n💡 Jawaban: *${d.jawaban}*\n📝 _${d.deskripsi || ""}_`
}, { quoted: soalMsg })
}
}, 30000)
gameSession.set(m.chat, { jawaban: d.jawaban, timer, soalMsg })
} catch (err) { m.reply(`❌ Error: ${err.message}`) }
}
break

// =================== GAME: TEBAK SURAH ===================
case "tebaksurah": {
await vinss.sendMessage(m.chat, { react: { text: "📖", key: m.key } })
try {
const { data } = await axios.get("https://api.deline.web.id/game/tebaksurah")
if (!data.status) throw new Error("Gagal mengambil soal")
const d = data.result
const msg = await vinss.sendMessage(m.chat, {
audio: { url: d.audio },
mimetype: "audio/mpeg",
ptt: false,
}, { quoted: m })
await vinss.sendMessage(m.chat, {
text: `📖 *Tebak Surah*\n\nDengarkan audio di atas.\n❓ Surah apakah ini?\n\n_Jawaban dikirim 45 detik lagi..._`
}, { quoted: msg })
setTimeout(async () => {
await vinss.sendMessage(m.chat, {
text: `✅ *Jawaban:* ${d.surah.englishName} (${d.surah.name})\n📊 Ayat ke-${d.numberInSurah} dari ${d.surah.numberOfAyahs} ayat`
}, { quoted: msg })
}, 45000)
} catch (err) {
m.reply(`❌ Error: ${err.message}`)
}
}
break

// =================== GAME: TEKA TEKI ===================
case "tekateki": {
await vinss.sendMessage(m.chat, { react: { text: "🤯", key: m.key } })
try {
const { data } = await axios.get("https://api.deline.web.id/game/tekateki")
if (!data.status) throw new Error("Gagal mengambil soal")
const d = data.result
const soalMsg = await vinss.sendMessage(m.chat, {
text: `🤯 *Teka Teki*\n\n❓ ${d.soal}\n\n_Ketik jawabanmu! Waktu: 30 detik_`
}, { quoted: m })
const timer = setTimeout(async () => {
if (gameSession.has(m.chat)) {
gameSession.delete(m.chat)
await vinss.sendMessage(m.chat, { text: `⏰ *Waktu habis!*\n💡 Jawaban: *${d.jawaban}*` }, { quoted: soalMsg })
}
}, 30000)
gameSession.set(m.chat, { jawaban: d.jawaban, timer, soalMsg })
} catch (err) { m.reply(`❌ Error: ${err.message}`) }
}
break

// =========== RVO (Remove View Once) ===========
case "rvo":
case "antiviewonce": {
if (!m.quoted) {
return reply(
"❌ Reply foto/video sekali lihat atau VN sekali dengar terlebih dahulu.\n\n" +
`Contoh: ${prefix}rvo`
);
}

const qmsg = m.quoted;
const qmime = (qmsg.msg || qmsg).mimetype || "";
const isViewOnce =
m.quoted.mtype === "viewOnceMessage" ||
m.quoted.mtype === "viewOnceMessageV2" ||
m.quoted.mtype === "viewOnceMessageV2Extension" ||
content.includes('"viewOnce":true') ||
content.includes('"viewOnceMessage"');
const isAudio =
/audio/.test(qmime) ||
m.quoted.mtype === "audioMessage";

if (!isViewOnce && !/image|video|audio/.test(qmime)) {
return reply(
"❌ Pesan yang di-reply bukan media yang didukung.\n\n" +
"Reply salah satu media berikut:\n" +
"• Foto sekali lihat\n" +
"• Video sekali lihat\n" +
"• VN / audio sekali dengar"
);
}
await vinss.sendMessage(m.chat, {
react: {
text: "👁️‍🗨️",
key: m.key
}
});
try {
const buffer = await vinss.downloadMediaMessage(qmsg);

if (isAudio) {

await vinss.sendMessage(
m.chat,
{
audio: buffer,
mimetype: qmime || "audio/ogg; codecs=opus",

ptt: false
},
{ quoted: m }
);

return;
}

if (/video/.test(qmime)) {

await vinss.sendMessage(
m.chat,
{
video: buffer,
caption:
"✅ *RVO BERHASIL*\n\n" +
"🎥 Video sudah diubah menjadi media biasa dan dapat dilihat kembali."
},
{ quoted: m }
);

return;
}

if (/image/.test(qmime)) {

await vinss.sendMessage(
m.chat,
{
image: buffer,
caption:
"✅ *RVO BERHASIL*\n\n" +
"🖼️ Foto sudah diubah menjadi media biasa dan dapat dilihat kembali."
},
{ quoted: m }
);

return;
}

} catch (err) {

console.error("RVO error:", err);

return reply(
"❌ Gagal membuka media.\n\n" +
`Error: ${err.message}`
);
}
}
break;

// =================== TOANIME ===================
case "toanime":
case "anime": {
const qmsg = m.quoted ? m.quoted : m
const qmime = (qmsg.msg || qmsg).mimetype || ""
if (!/image/.test(qmime)) return example("Kirim atau reply foto dulu")

await vinss.sendMessage(m.chat, { react: { text: "🎨", key: m.key } })
try {
const mediaPath = await vinss.downloadAndSaveMediaMessage(qmsg)
const imgUrl = await uploader.auto(mediaPath)
try { fs.unlinkSync(mediaPath) } catch { }

const res = await axios.get(
`https://api-faa.my.id/faa/toanime?url=${encodeURIComponent(imgUrl)}`,
{ responseType: "arraybuffer", timeout: 60000 }
)
await vinss.sendMessage(m.chat, {
image: Buffer.from(res.data),
caption: "🎨 *To Anime Filter*"
}, { quoted: m })
} catch (err) {
console.error("toanime cmd error:", err)
m.reply(`❌ Gagal proses: ${err.message}`)
}
}
break

// =================== TOBOTAK ===================
case "tobotak":
case "botak": {
const qmsg = m.quoted ? m.quoted : m
const qmime = (qmsg.msg || qmsg).mimetype || ""
if (!/image/.test(qmime)) return example("Kirim atau reply foto dulu")

await vinss.sendMessage(m.chat, { react: { text: "👨‍🦲", key: m.key } })
try {
const mediaPath = await vinss.downloadAndSaveMediaMessage(qmsg)
const imgUrl = await uploader.auto(mediaPath)
try { fs.unlinkSync(mediaPath) } catch { }

const res = await axios.get(
`https://api-faa.my.id/faa/tobotak?url=${encodeURIComponent(imgUrl)}`,
{ responseType: "arraybuffer", timeout: 60000 }
)
await vinss.sendMessage(m.chat, {
image: Buffer.from(res.data),
caption: "👨‍🦲 *To Botak Filter*"
}, { quoted: m })
} catch (err) {
console.error("tobotak cmd error:", err)
m.reply(`❌ Gagal proses: ${err.message}`)
}
}
break

// =================== TOFIGURA ===================
case "tofigura":
case "figura": {
const qmsg = m.quoted ? m.quoted : m
const qmime = (qmsg.msg || qmsg).mimetype || ""
if (!/image/.test(qmime)) return example("Kirim atau reply foto dulu")

await vinss.sendMessage(m.chat, { react: { text: "🎭", key: m.key } })
try {
const mediaPath = await vinss.downloadAndSaveMediaMessage(qmsg)
const imgUrl = await uploader.auto(mediaPath)
try { fs.unlinkSync(mediaPath) } catch { }

const res = await axios.get(
`https://api-faa.my.id/faa/tofigura?url=${encodeURIComponent(imgUrl)}`,
{ responseType: "arraybuffer", timeout: 60000 }
)
await vinss.sendMessage(m.chat, {
image: Buffer.from(res.data),
caption: "🎭 *To Figura Filter* — Gambar diubah jadi figur skala 1/7"
}, { quoted: m })
} catch (err) {
console.error("tofigura cmd error:", err)
m.reply(`❌ Gagal proses: ${err.message}`)
}
}
break

// =================== TEMPMAIL: BUAT EMAIL ===================
case "tempmail":
case "buatemail":
case "genemail": {
await vinss.sendMessage(m.chat, { react: { text: "📧", key: m.key } })
const processMsg = await vinss.sendMessage(m.chat, {
text: `⏳ *Membuat email sementara...*`
}, { quoted: m })
try {
const mail = new TempMail()
const account = await mail.createEmail()

// simpan session per sender
tempMailSession.set(m.sender, { mail, address: account.address, password: account.password })

await vinss.sendMessage(m.chat, {
text: `✅ *Email Sementara Berhasil Dibuat!*\n\n` +
`📧 *Email:* \`${account.address}\`\n` +
`🔑 *Password:* \`${account.password}\`\n\n` +
`_Email aktif selama sesi ini._\n` +
`📥 Ketik *.cekmail* untuk cek inbox\n` +
`🗑️ Ketik *.hapusemail* untuk hapus sesi`,
edit: processMsg.key
})
} catch (err) {
console.error("tempmail cmd error:", err)
await vinss.sendMessage(m.chat, {
text: `❌ Gagal membuat email: ${err.message}`,
edit: processMsg.key
})
}
}
break

// =================== TEMPMAIL: CEK INBOX ===================
case "cekmail":
case "inboxmail":
case "checkmail": {
await vinss.sendMessage(m.chat, { react: { text: "📬", key: m.key } })

const session = tempMailSession.get(m.sender)
if (!session) return reply(`❌ Kamu belum punya email sementara.\nKetik *.tempmail* untuk membuat dulu.`)

try {
const messages = await session.mail.getMessages()

if (!messages.length) {
return reply(`📭 *Inbox Kosong*\n\n📧 Email: \`${session.address}\`\n\n_Belum ada email masuk._`)
}

let teks = `📬 *Inbox* — ${messages.length} pesan\n📧 \`${session.address}\`\n\n`
messages.slice(0, 5).forEach((msg, i) => {
teks += `*${i + 1}.* ${msg.subject || "(Tanpa subjek)"}\n`
teks += ` 📤 Dari: ${msg.from?.address || "-"}\n`
teks += ` 🕒 ${new Date(msg.createdAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n`
teks += ` 🆔 ID: \`${msg.id}\`\n\n`
})

teks += `_Ketik *.bacamail <ID>* untuk baca isi email_`

await vinss.sendMessage(m.chat, { text: teks }, { quoted: m })
} catch (err) {
console.error("cekmail cmd error:", err)
m.reply(`❌ Gagal cek inbox: ${err.message}`)
}
}
break

// =================== TEMPMAIL: BACA EMAIL ===================
case "bacamail":
case "readmail": {
if (!text) return example(`<ID email dari .cekmail>`)

const session = tempMailSession.get(m.sender)
if (!session) return reply(`❌ Kamu belum punya email sementara.\nKetik *.tempmail* untuk membuat dulu.`)

await vinss.sendMessage(m.chat, { react: { text: "📖", key: m.key } })

try {
const msg = await session.mail.getMessage(text.trim())

const body = msg.text || msg.html?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || "(Tidak ada isi)"
const preview = body.slice(0, 1000) + (body.length > 1000 ? '\n...(terpotong)' : '')

const teks = `📖 *Baca Email*\n\n` +
`📌 *Subjek:* ${msg.subject || "-"}\n` +
`📤 *Dari:* ${msg.from?.address || "-"}\n` +
`📥 *Ke:* ${msg.to?.[0]?.address || session.address}\n` +
`🕒 *Waktu:* ${new Date(msg.createdAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n` +
`${'─'.repeat(30)}\n\n` +
`${preview}`

await vinss.sendMessage(m.chat, { text: teks }, { quoted: m })
} catch (err) {
console.error("bacamail cmd error:", err)
m.reply(`❌ Gagal baca email: ${err.message}`)
}
}
break

// =================== TEMPMAIL: HAPUS SESI ===================
case "hapusemail":
case "deletemail": {
if (!tempMailSession.has(m.sender)) return reply("❌ Tidak ada sesi email aktif.")
const addr = tempMailSession.get(m.sender).address
tempMailSession.delete(m.sender)
reply(`🗑️ Sesi email *${addr}* telah dihapus.`)
}
break

// =================== ABOUT / INFO BOT ===================
case "about":
case "info":
case "botinfo": {
await vinss.sendMessage(m.chat, {
image: { url: global.img },
caption: `╔══════════════════════╗\n║🤖*${global.namabot}*🤖║\n╚══════════════════════╝\n\n` +
`📋 *Informasi Bot*\n` +
`━━━━━━━━━━━━━━━━━━━━━━\n` +
`🔖 *Nama:* ${global.namabot}\n` +
`🏷️ *Versi :* v${global.version}\n` +
`⚙️ *Mode:* ${global.botMode ? '🌍 Public' : '🔒 Self'}\n` +
`👑 *Owner :* ${global.ownername}\n` +
`⏱️ *Uptime:* ${runtime(process.uptime())}\n` +
`👥 *User:* ${totalUsers()} terdaftar\n` +
`📦 *Fitur :* 100+ command\n` +
`━━━━━━━━━━━━━━━━━━━━━━\n\n` +
`🌐 *Website :* ${global.web || '-'}\n` +
`📢 *Channel :* ${global.linkSaluran || '-'}\n\n` +
`_Ketik ${prefix}menu untuk melihat semua fitur_`,
contextInfo: previewAd({
title: `🤖 ${global.namabot} v${global.version}`,
body: `Made by ${global.ownername}`,
thumbnail: global.img,
sourceUrl: global.web,
mention: [m.sender],
forward: true,
largerThumbnail: true,
})
}, { quoted: m })
}
break

// =================== OWNER ===================
case "owner":
case "kontakowner":
case "contactowner": {

await vinss.sendMessage(m.chat, { react: { text: "👑", key: m.key } })

const ownerNum = global.ownernumber
const ownerJid = ownerNum + '@s.whatsapp.net'
const ownerName = global.ownername || 'Owner'

// Foto profil owner
let ownerPp
try {
ownerPp = await vinss.profilePictureUrl(ownerJid, 'image')
} catch {
ownerPp = global.img
}

// Kirim teks keren dulu
await vinss.sendMessage(m.chat, {
image: { url: ownerPp },
caption: `╔═══════════════════════╗\n║👑*DEVELOPER & OWNER BOT*👑║\n╚═══════════════════════╝\n\n` +
`🌟 *${ownerName}*\n` +
`━━━━━━━━━━━━━━━━━━━━━━\n` +
`📱 *Nomor :* +${ownerNum}\n` +
`🤖 *Bot:* ${global.namabot}\n` +
`🌐 *Web:* ${global.web || '-'}\n` +
`━━━━━━━━━━━━━━━━━━━━━━\n\n` +
`💬 Hubungi owner untuk:\n` +
`✦ Sewa bot\n` +
`✦ Request fitur\n` +
`✦ Laporan bug\n` +
`✦ Kerjasama\n\n` +
`_Tap kontak di bawah untuk langsung chat!_`,
contextInfo: previewAd({
title: `👑 ${ownerName} — Owner Bot`,
body: `${global.namabot} Developer`,
thumbnail: ownerPp,
sourceUrl: global.web || 'https://wa.me/' + ownerNum,
mention: [ownerJid],
forward: true,
largerThumbnail: true,
})
}, { quoted: m })

// Kirim kontak owner
await vinss.sendMessage(m.chat, {
contacts: {
displayName: `👑 ${ownerName}`,
contacts: [{
displayName: `👑 ${ownerName} | Dev ${global.namabot}`,
vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${ownerName};;;;\nFN:👑 ${ownerName}\nitem1.TEL;waid=${ownerNum}:+${ownerNum}\nitem1.X-ABLabel:WhatsApp\nitem2.URL:${global.web || 'https://wa.me/' + ownerNum}\nitem2.X-ABLabel:Website\nitem3.EMAIL;type=INTERNET:${ownerName.toLowerCase().replace(/\s+/g, '')}@vinss.dev\nitem3.X-ABLabel:Email\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nORG:${global.namabot} Developer\nTITLE:Owner & Developer Bot\nEND:VCARD`
}]
}
}, { quoted: m })
}
break

// =================== TOTAL FITUR ===================
case "totalfitur":
case "listfitur":
case "allfitur": {
try {
const caseFileContent = fs.readFileSync('./case.js', 'utf-8')
const caseRegex = /case\s+["']([^"']+)["']\s*:/g
const allCases = new Set()
let match
while ((match = caseRegex.exec(caseFileContent)) !== null) {
allCases.add(match[1].toLowerCase())
}
const excluded = new Set(['default', 'undefined', 'null', '0', '1', '2', '3', '4', '5'])
const commands = [...allCases].filter(c => !excluded.has(c)).sort()
const total = commands.length
const perBaris = 3
let teks = `📊 *Total Fitur Bot*\n`
teks += `━━━━━━━━━━━━━━━━━━━━\n`
teks += `⚙️ *Jumlah Command:* ${total}\n`
teks += `━━━━━━━━━━━━━━━━━━━━\n\n`
for (let i = 0; i < commands.length; i += perBaris) {
const row = commands.slice(i, i + perBaris)
teks += row.map(c => `${prefix}${c}`).join('|') + '\n'
}
teks += `\n━━━━━━━━━━━━━━━━━━━━`
teks += `\n_© ${namabot} — v${global.version}_`
await vinss.sendMessage(m.chat, {
text: teks,
contextInfo: previewAd({
title: `📊 ${total} Fitur Tersedia`,
body: `${namabot} - v${global.version}`,
thumbnail: global.img,
sourceUrl: global.web,
mention: [m.sender],
forward: true,
})
}, { quoted: m })

} catch (err) {
console.error("totalfitur cmd error:", err)
m.reply(`❌ Gagal menghitung fitur: ${err.message}`)
}
}
break

// =================== KISAH NABI ===================
case 'kisahnabi': {
if (!text) return example('adam (contoh: adam, idris, nuh, hud, dll)');
try {
const url = await fetch(`https://raw.githubusercontent.com/ZeroChanBot/Api-Freee/a9da6483809a1fbf164cdf1dfbfc6a17f2814577/data/kisahNabi/${text.toLowerCase()}.json`);
const kisah = await url.json();
if (!kisah || !kisah.name) return reply('❌ *Nabi tidak ditemukan!*\n📮 Tips: gunakan huruf kecil dan nama yang benar.');
let hasil = `_*👳 Nabi :*_ ${kisah.name}\n` +
`_*📅 Tanggal Lahir :*_ ${kisah.thn_kelahiran || '-'}\n` +
`_*📍 Tempat Lahir :*_ ${kisah.tmp || '-'}\n` +
`_*📊 Usia :*_ ${kisah.usia || '-'}\n\n` +
`*— — — — — — — [ K I S A H ] — — — — — — —*\n\n${kisah.description || 'Tidak ada deskripsi'}`;
reply(hasil);
} catch (e) {
reply(`❌ Gagal mengambil kisah nabi: ${e.message}`);
}
}
break;

// =================== ASMAUL HUSNA ===================
case 'asmaulhusna': {
const asmaulhusna = [
{ index: 1, latin: "Ar Rahman", arabic: "الرَّحْمَنُ", translation_id: "Yang Memiliki Mutlak sifat Pemurah", translation_en: "The All Beneficent" },
{ index: 2, latin: "Ar Rahiim", arabic: "الرَّحِيمُ", translation_id: "Yang Memiliki Mutlak sifat Penyayang", translation_en: "The Most Merciful" },
{ index: 3, latin: "Al Malik", arabic: "الْمَلِكُ", translation_id: "Yang Memiliki Mutlak sifat Merajai/Memerintah", translation_en: "The King, The Sovereign" },
{ index: 4, latin: "Al Quddus", arabic: "الْقُدُّوسُ", translation_id: "Yang Memiliki Mutlak sifat Suci", translation_en: "The Most Holy" },
{ index: 5, latin: "As Salaam", arabic: "السَّلاَمُ", translation_id: "Yang Memiliki Mutlak sifat Memberi Kesejahteraan", translation_en: "Peace and Blessing" },
{ index: 6, latin: "Al Mu’min", arabic: "الْمُؤْمِنُ", translation_id: "Yang Memiliki Mutlak sifat Memberi Keamanan", translation_en: "The Guarantor" },
{ index: 7, latin: "Al Muhaimin", arabic: "الْمُهَيْمِنُ", translation_id: "Yang Memiliki Mutlak sifat Pemelihara", translation_en: "The Guardian, the Preserver" },
{ index: 8, latin: "Al ‘Aziiz", arabic: "الْعَزِيزُ", translation_id: "Yang Memiliki Mutlak Kegagahan", translation_en: "The Almighty, the Self Sufficient" },
{ index: 9, latin: "Al Jabbar", arabic: "الْجَبَّارُ", translation_id: "Yang Memiliki Mutlak sifat Perkasa", translation_en: "The Powerful, the Irresistible" },
{ index: 10, latin: "Al Mutakabbir", arabic: "الْمُتَكَبِّرُ", translation_id: "Yang Memiliki Mutlak sifat Megah,Yang Memiliki Kebesaran", translation_en: "The Tremendous" },
{ index: 11, latin: "Al Khaliq", arabic: "الْخَالِقُ", translation_id: "Yang Memiliki Mutlak sifat Pencipta", translation_en: "The Creator" },
{ index: 12, latin: "Al Baari’", arabic: "الْبَارِئُ", translation_id: "Yang Memiliki Mutlak sifat Yang Melepaskan(Membuat, Membentuk, Menyeimbangkan)", translation_en: "The Maker" },
{ index: 13, latin: "Al Mushawwir", arabic: "الْمُصَوِّرُ", translation_id: "Yang Memiliki Mutlak sifat YangMembentuk Rupa (makhluknya)", translation_en: "The Fashioner of Forms" },
{ index: 14, latin: "Al Ghaffaar", arabic: "الْغَفَّارُ", translation_id: "Yang Memiliki Mutlak sifat Pengampun", translation_en: "The Ever Forgiving" },
{ index: 15, latin: "Al Qahhaar", arabic: "الْقَهَّارُ", translation_id: "Yang Memiliki Mutlak sifat Memaksa", translation_en: "The All Compelling Subduer" },
{ index: 16, latin: "Al Wahhaab", arabic: "الْوَهَّابُ", translation_id: "Yang Memiliki Mutlak sifat Pemberi Karunia", translation_en: "The Bestower" },
{ index: 17, latin: "Ar Razzaaq", arabic: "الرَّزَّاقُ", translation_id: "Yang Memiliki Mutlak sifat Pemberi Rejeki", translation_en: "The Ever Providing" },
{ index: 18, latin: "Al Fattaah", arabic: "الْفَتَّاحُ", translation_id: "Yang Memiliki Mutlak sifat Pembuka Rahmat", translation_en: "The Opener, the Victory Giver" },
{ index: 19, latin: "Al ‘Aliim", arabic: "اَلْعَلِيْمُ", translation_id: "Yang Memiliki Mutlak sifatMengetahui (Memiliki Ilmu)", translation_en: "The All Knowing, the Omniscient" },
{ index: 20, latin: "Al Qaabidh", arabic: "الْقَابِضُ", translation_id: "Yang Memiliki Mutlak sifat YangMenyempitkan (makhluknya)", translation_en: "The Restrainer, the Straightener" },
{ index: 21, latin: "Al Baasith", arabic: "الْبَاسِطُ", translation_id: "Yang Memiliki Mutlak sifat YangMelapangkan (makhluknya)", translation_en: "The Expander, the Munificent" },
{ index: 22, latin: "Al Khaafidh", arabic: "الْخَافِضُ", translation_id: "Yang Memiliki Mutlak sifat YangMerendahkan (makhluknya)", translation_en: "The Abaser" },
{ index: 23, latin: "Ar Raafi’", arabic: "الرَّافِعُ", translation_id: "Yang Memiliki Mutlak sifat YangMeninggikan (makhluknya)", translation_en: "The Exalter" },
{ index: 24, latin: "Al Mu’izz", arabic: "الْمُعِزُّ", translation_id: "Yang Memiliki Mutlak sifat YangMemuliakan (makhluknya)", translation_en: "The Giver of Honor" },
{ index: 25, latin: "Al Mudzil", arabic: "المُذِلُّ", translation_id: "Yang Memiliki Mutlak sifatYang Menghinakan (makhluknya)", translation_en: "The Giver of Dishonor" },
{ index: 26, latin: "Al Samii’", arabic: "السَّمِيعُ", translation_id: "Yang Memiliki Mutlak sifat Maha Mendengar", translation_en: "The All Hearing" },
{ index: 27, latin: "Al Bashiir", arabic: "الْبَصِيرُ", translation_id: "Yang Memiliki Mutlak sifat Maha Melihat", translation_en: "The All Seeing" },
{ index: 28, latin: "Al Hakam", arabic: "الْحَكَمُ", translation_id: "Yang Memiliki Mutlak sifat Maha Menetapkan", translation_en: "The Judge, the Arbitrator" },
{ index: 29, latin: "Al ‘Adl", arabic: "الْعَدْلُ", translation_id: "Yang Memiliki Mutlak sifat Maha Adil", translation_en: "The Utterly Just" },
{ index: 30, latin: "Al Lathiif", arabic: "اللَّطِيفُ", translation_id: "Yang Memiliki Mutlak sifat Maha Lembut", translation_en: "The Subtly Kind" },
{ index: 31, latin: "Al Khabiir", arabic: "الْخَبِيرُ", translation_id: "Yang Memiliki Mutlak sifatMaha Mengetahui Rahasia", translation_en: "The All Aware" },
{ index: 32, latin: "Al Haliim", arabic: "الْحَلِيمُ", translation_id: "Yang Memiliki Mutlak sifat Maha Penyantun", translation_en: "The Forbearing, the Indulgent" },
{ index: 33, latin: "Al ‘Azhiim", arabic: "الْعَظِيمُ", translation_id: "Yang Memiliki Mutlak sifat Maha Agung", translation_en: "The Magnificent, the Infinite" },
{ index: 34, latin: "Al Ghafuur", arabic: "الْغَفُورُ", translation_id: "Yang Memiliki Mutlak sifat Maha Pengampun", translation_en: "The All Forgiving" },
{ index: 35, latin: "As Syakuur", arabic: "الشَّكُورُ", translation_id: "Yang Memiliki Mutlak sifat MahaPembalas Budi (Menghargai)", translation_en: "The Grateful" },
{ index: 36, latin: "Al ‘Aliy", arabic: "الْعَلِيُّ", translation_id: "Yang Memiliki Mutlak sifat Maha Tinggi", translation_en: "The Sublimely Exalted" },
{ index: 37, latin: "Al Kabiir", arabic: "الْكَبِيرُ", translation_id: "Yang Memiliki Mutlak sifat Maha Besar", translation_en: "The Great" },
{ index: 38, latin: "Al Hafizh", arabic: "الْحَفِيظُ", translation_id: "Yang Memiliki Mutlak sifat Maha Menjaga", translation_en: "The Preserver" },
{ index: 39, latin: "Al Muqiit", arabic: "المُقيِت", translation_id: "Yang Memiliki Mutlak sifat Maha Pemberi Kecukupan", translation_en: "The Nourisher" },
{ index: 40, latin: "Al Hasiib", arabic: "الْحسِيبُ", translation_id: "Yang Memiliki Mutlak sifat MahaMembuat Perhitungan", translation_en: "The Reckoner" },
{ index: 41, latin: "Al Jaliil", arabic: "الْجَلِيلُ", translation_id: "Yang Memiliki Mutlak sifat Maha Mulia", translation_en: "The Majestic" },
{ index: 42, latin: "Al Kariim", arabic: "الْكَرِيمُ", translation_id: "Yang Memiliki Mutlak sifat Maha Pemurah", translation_en: "The Bountiful, the Generous" },
{ index: 43, latin: "Ar Raqiib", arabic: "الرَّقِيبُ", translation_id: "Yang Memiliki Mutlak sifat Maha Mengawasi", translation_en: "The Watchful" },
{ index: 44, latin: "Al Mujiib", arabic: "الْمُجِيبُ", translation_id: "Yang Memiliki Mutlak sifat Maha Mengabulkan", translation_en: "The Responsive, the Answerer" },
{ index: 45, latin: "Al Waasi’", arabic: "الْوَاسِعُ", translation_id: "Yang Memiliki Mutlak sifat Maha Luas", translation_en: "The Vast, the All Encompassing" },
{ index: 46, latin: "Al Hakiim", arabic: "الْحَكِيمُ", translation_id: "Yang Memiliki Mutlak sifat Maka Bijaksana", translation_en: "The Wise" },
{ index: 47, latin: "Al Waduud", arabic: "الْوَدُودُ", translation_id: "Yang Memiliki Mutlak sifat Maha Pencinta", translation_en: "The Loving, the Kind One" },
{ index: 48, latin: "Al Majiid", arabic: "الْمَجِيدُ", translation_id: "Yang Memiliki Mutlak sifat Maha Mulia", translation_en: "The All Glorious" },
{ index: 49, latin: "Al Baa’its", arabic: "الْبَاعِثُ", translation_id: "Yang Memiliki Mutlak sifat Maha Membangkitkan", translation_en: "The Raiser of the Dead" },
{ index: 50, latin: "As Syahiid", arabic: "الشَّهِيدُ", translation_id: "Yang Memiliki Mutlak sifat Maha Menyaksikan", translation_en: "The Witness" },
{ index: 51, latin: "Al Haqq", arabic: "الْحَقُّ", translation_id: "Yang Memiliki Mutlak sifat Maha Benar", translation_en: "The Truth, the Real" },
{ index: 52, latin: "Al Wakiil", arabic: "الْوَكِيلُ", translation_id: "Yang Memiliki Mutlak sifat Maha Memelihara", translation_en: "The Trustee, the Dependable" },
{ index: 53, latin: "Al Qawiyyu", arabic: "الْقَوِيُّ", translation_id: "Yang Memiliki Mutlak sifat Maha Kuat", translation_en: "The Strong" },
{ index: 54, latin: "Al Matiin", arabic: "الْمَتِينُ", translation_id: "Yang Memiliki Mutlak sifat Maha Kokoh", translation_en: "The Firm, the Steadfast" },
{ index: 55, latin: "Al Waliyy", arabic: "الْوَلِيُّ", translation_id: "Yang Memiliki Mutlak sifat Maha Melindungi", translation_en: "The Protecting Friend, Patron, and Helper" },
{ index: 56, latin: "Al Hamiid", arabic: "الْحَمِيدُ", translation_id: "Yang Memiliki Mutlak sifat Maha Terpuji", translation_en: "The All Praiseworthy" },
{ index: 57, latin: "Al Mushii", arabic: "الْمُحْصِي", translation_id: "Yang Memiliki Mutlak sifat Maha Mengkalkulasi", translation_en: "The Accounter, the Numberer of All" },
{ index: 58, latin: "Al Mubdi’", arabic: "الْمُبْدِئُ", translation_id: "Yang Memiliki Mutlak sifat Maha Memulai", translation_en: "The Producer, Originator, and Initiator of all" },
{ index: 59, latin: "Al Mu’iid", arabic: "الْمُعِيدُ", translation_id: "Yang Memiliki Mutlak sifat MahaMengembalikan Kehidupan", translation_en: "The Reinstater Who Brings Back All" },
{ index: 60, latin: "Al Muhyii", arabic: "الْمُحْيِي", translation_id: "Yang Memiliki Mutlak sifat Maha Menghidupkan", translation_en: "The Giver of Life" },
{ index: 61, latin: "Al Mumiitu", arabic: "اَلْمُمِيتُ", translation_id: "Yang Memiliki Mutlak sifat Maha Mematikan", translation_en: "The Bringer of Death, the Destroyer" },
{ index: 62, latin: "Al Hayyu", arabic: "الْحَيُّ", translation_id: "Yang Memiliki Mutlak sifat Maha Hidup", translation_en: "The Ever Living" },
{ index: 63, latin: "Al Qayyuum", arabic: "الْقَيُّومُ", translation_id: "Yang Memiliki Mutlak sifat Maha Mandiri", translation_en: "The Self Subsisting Sustainer of All" },
{ index: 64, latin: "Al Waajid", arabic: "الْوَاجِدُ", translation_id: "Yang Memiliki Mutlak sifat Maha Penemu", translation_en: "The Perceiver, the Finder, the Unfailing" },
{ index: 65, latin: "Al Maajid", arabic: "الْمَاجِدُ", translation_id: "Yang Memiliki Mutlak sifat Maha Mulia", translation_en: "The Illustrious, the Magnificent" },
{ index: 66, latin: "Al Wahiid", arabic: "الْواحِدُ", translation_id: "Yang Memiliki Mutlak sifat Maha Tunggal", translation_en: "The One, The Unique, Manifestation of Unity" },
{ index: 67, latin: "Al ‘Ahad", arabic: "اَلاَحَدُ", translation_id: "Yang Memiliki Mutlak sifat Maha Esa", translation_en: "The One, the All Inclusive, the Indivisible" },
{ index: 68, latin: "As Shamad", arabic: "الصَّمَدُ", translation_id: "Yang Memiliki Mutlak sifat MahaDibutuhkan, Tempat Meminta", translation_en: "The Self Sufficient, the Impregnable,the Eternally Besought of All, the Everlasting" },
{ index: 69, latin: "Al Qaadir", arabic: "الْقَادِرُ", translation_id: "Yang Memiliki Mutlak sifat MahaMenentukan, Maha Menyeimbangkan", translation_en: "The All Able" },
{ index: 70, latin: "Al Muqtadir", arabic: "الْمُقْتَدِرُ", translation_id: "Yang Memiliki Mutlak sifat Maha Berkuasa", translation_en: "The All Determiner, the Dominant" },
{ index: 71, latin: "Al Muqaddim", arabic: "الْمُقَدِّمُ", translation_id: "Yang Memiliki Mutlak sifat Maha Mendahulukan", translation_en: "The Expediter, He who brings forward" },
{ index: 72, latin: "Al Mu’akkhir", arabic: "الْمُؤَخِّرُ", translation_id: "Yang Memiliki Mutlak sifat Maha Mengakhirkan", translation_en: "The Delayer, He who puts far away" },
{ index: 73, latin: "Al Awwal", arabic: "الأوَّلُ", translation_id: "Yang Memiliki Mutlak sifat Maha Awal", translation_en: "The First" },
{ index: 74, latin: "Al Aakhir", arabic: "الآخِرُ", translation_id: "Yang Memiliki Mutlak sifat Maha Akhir", translation_en: "The Last" },
{ index: 75, latin: "Az Zhaahir", arabic: "الظَّاهِرُ", translation_id: "Yang Memiliki Mutlak sifat Maha Nyata", translation_en: "The Manifest; the All Victorious" },
{ index: 76, latin: "Al Baathin", arabic: "الْبَاطِنُ", translation_id: "Yang Memiliki Mutlak sifat Maha Ghaib", translation_en: "The Hidden; the All Encompassing" },
{ index: 77, latin: "Al Waali", arabic: "الْوَالِي", translation_id: "Yang Memiliki Mutlak sifat Maha Memerintah", translation_en: "The Patron" },
{ index: 78, latin: "Al Muta’aalii", arabic: "الْمُتَعَالِي", translation_id: "Yang Memiliki Mutlak sifat Maha Tinggi", translation_en: "The Self Exalted" },
{ index: 79, latin: "Al Barri", arabic: "الْبَرُّ", translation_id: "Yang Memiliki Mutlak sifat Maha Penderma", translation_en: "The Most Kind and Righteous" },
{ index: 80, latin: "At Tawwaab", arabic: "التَّوَابُ", translation_id: "Yang Memiliki Mutlak sifat Maha Penerima Tobat", translation_en: "The Ever Returning, Ever Relenting" },
{ index: 81, latin: "Al Muntaqim", arabic: "الْمُنْتَقِمُ", translation_id: "Yang Memiliki Mutlak sifat Maha Penuntut Balas", translation_en: "The Avenger" },
{ index: 82, latin: "Al Afuww", arabic: "العَفُوُّ", translation_id: "Yang Memiliki Mutlak sifat Maha Pemaaf", translation_en: "The Pardoner, the Effacer of Sins" },
{ index: 83, latin: "Ar Ra`uuf", arabic: "الرَّؤُوفُ", translation_id: "Yang Memiliki Mutlak sifat Maha Pengasih", translation_en: "The Compassionate, the All Pitying" },
{ index: 84, latin: "Malikul Mulk", arabic: "مَالِكُ الْمُلْكِ", translation_id: "Yang Memiliki Mutlak sifatPenguasa Kerajaan (Semesta)", translation_en: "The Owner of All Sovereignty" },
{ index: 85, latin: "Dzul JalaaliWal Ikraam", arabic: "ذُوالْجَلاَلِوَالإكْرَامِ", translation_id: "Yang Memiliki Mutlak sifat PemilikKebesaran dan Kemuliaan", translation_en: "The Lord of Majesty and Generosity" },
{ index: 86, latin: "Al Muqsith", arabic: "الْمُقْسِطُ", translation_id: "Yang Memiliki Mutlak sifat Maha Adil", translation_en: "The Equitable, the Requiter" },
{ index: 87, latin: "Al Jamii’", arabic: "الْجَامِعُ", translation_id: "Yang Memiliki Mutlak sifat Maha Mengumpulkan", translation_en: "The Gatherer, the Unifier" },
{ index: 88, latin: "Al Ghaniyy", arabic: "الْغَنِيُّ", translation_id: "Yang Memiliki Mutlak sifat Maha Berkecukupan", translation_en: "The All Rich, the Independent" },
{ index: 89, latin: "Al Mughnii", arabic: "الْمُغْنِي", translation_id: "Yang Memiliki Mutlak sifat Maha Memberi Kekayaan", translation_en: "The Enricher, the Emancipator" },
{ index: 90, latin: "Al Maani", arabic: "اَلْمَانِعُ", translation_id: "Yang Memiliki Mutlak sifat Maha Mencegah", translation_en: "The Withholder, the Shielder, the Defender" },
{ index: 91, latin: "Ad Dhaar", arabic: "الضَّارَّ", translation_id: "Yang Memiliki Mutlak sifat Maha Memberi Derita", translation_en: "The Distressor, the Harmer" },
{ index: 92, latin: "An Nafii’", arabic: "النَّافِعُ", translation_id: "Yang Memiliki Mutlak sifat Maha Memberi Manfaat", translation_en: "The Propitious, the Benefactor" },
{ index: 93, latin: "An Nuur", arabic: "النُّورُ", translation_id: "Yang Memiliki Mutlak sifat Maha Bercahaya(Menerangi, Memberi Cahaya)", translation_en: "The Light" },
{ index: 94, latin: "Al Haadii", arabic: "الْهَادِي", translation_id: "Yang Memiliki Mutlak sifat Maha Pemberi Petunjuk", translation_en: "The Guide" },
{ index: 95, latin: "Al Baadii", arabic: "الْبَدِيعُ", translation_id: "Yang Memiliki Mutlak sifat Maha Pencipta", translation_en: "Incomparable, the Originator" },
{ index: 96, latin: "Al Baaqii", arabic: "اَلْبَاقِي", translation_id: "Yang Memiliki Mutlak sifat Maha Kekal", translation_en: "The Ever Enduring and Immutable" },
{ index: 97, latin: "Al Waarits", arabic: "الْوَارِثُ", translation_id: "Yang Memiliki Mutlak sifat Maha Pewaris", translation_en: "The Heir, the Inheritor of All" },
{ index: 98, latin: "Ar Rasyiid", arabic: "الرَّشِيدُ", translation_id: "Yang Memiliki Mutlak sifat Maha Pandai", translation_en: "The Guide, Infallible Teacher, and Knower" },
{ index: 99, latin: "As Shabuur", arabic: "الصَّبُورُ", translation_id: "Yang Memiliki Mutlak sifat Maha Sabar", translation_en: "The Patient" }
];

if (!args[0]) {
let data = asmaulhusna.map(v => `${v.index}. ${v.latin}\n${v.arabic}\n${v.translation_id}`).join("\n\n");
let anjuran = `\n\nDari Abu hurarirah radhiallahu anhu, Rasulullah Saw bersabda: "إِنَّ لِلَّهِ تَعَالَى تِسْعَةً وَتِسْعِينَ اسْمًا، مِائَةٌ إِلَّا وَاحِدًا، مَنْ أَحْصَاهَا دخل الجنة، وهو وتر يُحِبُّ الْوِتْرَ"\nArtinya: "Sesungguhnya Allah mempunyai sembilan puluh sembilan nama, alias seratus kurang satu. Barang siapa yang menghitung-hitungnya, niscaya masuk surga; Dia Witir dan menyukai yang witir".`;
return reply(`*Asmaul Husna*\n\n${data}${anjuran}`);
}

const index = parseInt(args[0]);
if (isNaN(index) || index < 1 || index > 99) return reply('❌ Masukkan angka antara 1-99. Contoh: asmaulhusna 1');
const data = asmaulhusna.find(v => v.index === index);
if (!data) return reply('❌ Tidak ditemukan.');
let teks = `No. ${data.index}\n${data.arabic}\n${data.latin}\n${data.translation_id}\n${data.translation_en}`;
reply(teks);
}
break;

// =================== AYAT KURSI ===================
case 'ayatkursi': {
let caption = `*「 Ayat Kursi 」*\nاللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ\n\n“Alloohu laa ilaaha illaa huwal hayyul qoyyuum, laa ta’khudzuhuu sinatuw walaa naum. Lahuu maa fissamaawaati wa maa fil ardli man dzal ladzii yasyfa’u ‘indahuu illaa biidznih, ya’lamu maa baina aidiihim wamaa kholfahum wa laa yuhiithuuna bisyai’im min ‘ilmihii illaa bimaa syaa’ wasi’a kursiyyuhus samaawaati wal ardlo walaa ya’uuduhuu hifdhuhumaa wahuwal ‘aliyyul ‘adhiim.”\n\nArtinya: Allah, tidak ada Tuhan (yang berhak disembah) melainkan Dia Yang Hidup kekal lagi terus menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Tiada yang dapat memberi syafa'at di sisi Allah tanpa izin-Nya. Allah mengetahui apa-apa yang di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui apa-apa dari ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dan Allah tidak merasa berat memelihara keduanya, dan Allah Maha Tinggi lagi Maha Besar. (QS. Al Baqarah: 255)`;
reply(caption);
}
break;

// =================== BACAAN SHOLAT ===================
case 'bacaansholat': {
const bacaanshalat = {
result: [
{ id: 1, name: "Bacaan Iftitah", arabic: "اللَّهُ أَكْبَرُ كَبِيرًا وَالْحَمْدُ لِلَّهِ كَثِيرًا وَسُبْحَانَ اللَّهِ بُكْرَةً وَأَصِيلاً , إِنِّى وَجَّهْتُ وَجْهِىَ لِلَّذِى فَطَرَ السَّمَوَاتِ وَالأَرْضَ حَنِيفًا وَمَا أَنَا مِنَ الْمُشْرِكِينَ إِنَّ صَلاَتِى وَنُسُكِى وَمَحْيَاىَ وَمَمَاتِى لِلَّهِ رَبِّ الْعَالَمِينَ لاَ شَرِيكَ لَهُ وَبِذَلِكَ أُمِرْتُ وَأَنَا أَوَّلُ الْمُسْلِمِينَ", latin: "Alloohu akbar kabiirow wal hamdu lillaahi katsiiroo wasubhaanalloohi bukrotaw wa-ashiilaa, Innii wajjahtu wajhiya lilladzii fathoros samaawaati wal ardlo haniifaa wamaa ana minal musyrikiin. Inna sholaatii wa nusukii wamahyaa wa mamaatii lillaahi robbil &lsquo;aalamiin. Laa syariikalahu wa bidzaalika umirtu wa ana awwalul muslimiin", terjemahan: "Allah Maha Besar dengan sebesar-besarnya, segala puji bagi Allah dengan pujian yang banyak. Mahasuci Allah pada waktu pagi dan petang, Sesungguhnya aku hadapkan wajahku kepada Allah yang telah menciptakan langit dan bumi dalam keadaan tunduk dan aku bukanlah dari golongan orang-orang musyrik. Sesungguhnya shalatku, sembelihanku, hidupku dan matiku hanya untuk Allah Tuhan semesta alam. Tidak ada sekutu bagiNya. Dan dengan yang demikian itu lah aku diperintahkan. Dan aku adalah orang yang pertama berserah diri" },
{ id: 2, name: "Al Fatihah", arabic: "بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ ﴿١﴾الْحَمْدُ لِلَّـهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمَـٰنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧", latin: "1. Bismillahirrahmanirrahim, 2. Alhamdulillahi rabbil alamin, 3. Arrahmaanirrahiim, 4. Maaliki yaumiddiin, 5. Iyyaka nabudu waiyyaaka nastaiin, 6. Ihdinashirratal mustaqim, 7. shiratalladzina an&rsquo;amta alaihim ghairil maghduubi alaihim waladhaalin", terjemahan: "1. Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang, 2. Segala puji bagi Allah, Tuhan semesta alam, 3. Maha Pemurah lagi Maha Penyayang, 4. Yang menguasai di Hari Pembalasan, 5. Hanya Engkaulah yang kami sembah, dan hanya kepada Engkaulah kami meminta pertolongan, 6. Tunjukilah kami jalan yang lurus, 7. (yaitu) Jalan orang-orang yang telah Engkau beri nikmat kepada mereka; bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat" },
{ id: 3, name: "Bacaan Ruku", arabic: "(3x) سُبْحَانَ رَبِّيَ الْعَظِيْمِ وَبِحَمْدِهِ", latin: "Subhana Rabbiyal Adzimi Wabihamdih (3x)", terjemahan: "Maha Suci Tuhanku Yang Maha Agung Dan Dengan Memuji-Nya" },
{ id: 4, name: "Bacaan Sujud", arabic: "(3x) سُبْحَانَ رَبِّىَ الْأَعْلَى وَبِحَمْدِهِ", latin: "Subhaana robbiyal a'la wabihamdih (3x)", terjemahan: "Mahasuci Tuhanku yang Mahatinggi dan segala puji bagiNya" },
{ id: 5, name: "Bacaan Duduk Diantara Dua Sujud", arabic: "رَبِّ اغْفِرْلِيْ وَارْحَمْنِيْ وَاجْبُرْنِيْ وَارْفَعْنِيْ وَارْزُقْنِيْ وَاهْدِنِيْ وَعَافِنِيْ وَاعْفُ عَنِّيْ", latin: "Rabbighfirli Warhamni Wajburnii Warfaknii Wazuqnii Wahdinii Wa'aafinii Wa'fuannii", terjemahan: "Ya Allah,ampunilah dosaku,belas kasihinilah aku dan cukuplah segala kekuranganku da angkatlah derajatku dan berilah rezeki kepadaku,dan berilah aku petunjuk dan berilah kesehatan padaku dan berilah ampunan kepadaku" },
{ id: 6, name: "Duduk Tasyahud Awal", arabic: "اَلتَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ ِللهِ، السَّلاَمُ عَلَيْكَ اَيُّهَا النَّبِيُّ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ، السَّلاَمُ عَلَيْنَا وَعَلَى عِبَادِاللهِ الصَّالِحِيْنَ، أَشْهَدُ اَنْ لآ إِلَهَ إِلاَّاللهُ وَاَشْهَدُ أَنَّ مُحَمَّدًا رَسُوْلُ اللهُ، اَللهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ", latin: "Attahiyyaatul mubaarokaatush sholawaatuth thoyyibaatu lillaah. Assalaamualaika ayyuhan nabiyyu wa rohmatulloohi wa barokaatuh. Assalaaamualainaa wa alaa ibaadillaahish shoolihiin. Asyhadu allaa ilaaha illallooh wa asyhadu anna Muhammadar rosuulullooh. Allahummasholli ala Sayyidina Muhammad", terjemahan: "Segala penghormatan, keberkahan, shalawat dan kebaikan hanya bagi Allah. Semoga salam sejahtera selalu tercurahkan kepadamu wahai Nabi, demikian pula rahmat Allah dan berkahNya dan semoga salam sejahtera selalu tercurah kepada kami dan hamba-hamba Allah yang shalih. Aku bersaksi bahwa tiada ilah kecuali Allah dan aku bersaksi bahwa Muhammad adalah utusan Allah. Ya Tuhan kami, selawatkanlah ke atas Nabi Muhammad" },
{ id: 7, name: "Duduk Tasyahud Akhir", arabic: "اَلتَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ ِللهِ، السَّلاَمُ عَلَيْكَ اَيُّهَا النَّبِيُّ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ، السَّلاَمُ عَلَيْنَا وَعَلَى عِبَادِاللهِ الصَّالِحِيْنَ، أَشْهَدُ اَنْ لآ إِلَهَ إِلاَّاللهُ وَاَشْهَدُ أَنَّ مُحَمَّدًا رَسُوْلُ اللهُ، اَللهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى سَيِّدِنَا اِبْرَاهِيْمَ وَعَلَى آلِ سَيِّدِنَا اِبْرَاهِيْمَ وَبَارِكْ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ كَمَا بَرَكْتَ عَلَى سَيِّدِنَا اِبْرَاهِيْمَ وَعَلَى آلِ سَيِّدِنَا اِبْرَاهِيْمَ فِى الْعَالَمِيْنَ إِنَّكَ حَمِيْدٌ مَجِيْدٌ", latin: "Attahiyyaatul mubaarokaatush sholawaatuth thoyyibaatu lillaah. Assalaamualaika ayyuhan nabiyyu wa rohmatulloohi wa barokaatuh. Assalaaamualainaa wa alaa ibaadillaahish shoolihiin. Asyhadu allaa ilaaha illallooh wa asyhadu anna Muhammadar rosuulullooh. Allahumma Shalli Ala Sayyidina Muhammad Wa Ala Ali Sayyidina Muhammad. Kama Shollaita Ala Sayyidina Ibrahim wa alaa aali sayyidina Ibrahim, wabaarik ala Sayyidina Muhammad Wa Alaa Ali Sayyidina Muhammad, Kama barokta alaa Sayyidina Ibrahim wa alaa ali Sayyidina Ibrahim, Fil aalamiina innaka hamiidummajid", terjemahan: "Segala penghormatan yang berkat solat yang baik adalah untuk Allah. Sejahtera atas engkau wahai Nabi dan rahmat Allah serta keberkatannya. Sejahtera ke atas kami dan atas hamba-hamba Allah yang soleh. Aku bersaksi bahwa tiada Tuhan melainkan Allah dan aku bersaksi bahwasanya Muhammad itu adalah pesuruh Allah. Ya Tuhan kami, selawatkanlah ke atas Nabi Muhammad dan ke atas keluarganya. Sebagaimana Engkau selawatkan ke atas Ibrahim dan atas keluarga Ibrahim. Berkatilah ke atas Muhammad dan atas keluarganya sebagaimana Engkau berkati ke atas Ibrahim dan atas keluarga Ibrahim di dalam alam ini. Sesungguhnya Engkau Maha Terpuji lagi Maha Agung" },
{ id: 8, name: "Salam", arabic: "اَلسَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ", latin: "Assalamualaikum Warohmatullahi Wabarokatuh", terjemahan: "Semoga keselamatan, rohmat dan berkah ALLAH selalu tercurah untuk kamu sekalian." }
]
};
let data = bacaanshalat.result.map(v =>
`${v.id}. ${v.name}\n${v.arabic}\n${v.latin}\n*Artinya:*\n_${v.terjemahan}_`
).join("\n\n");
let caption = `*「 Bacaan Shalat 」*\n\n${data}`;
reply(caption);
}
break;

// =================== DOA HARIAN ===================
case 'doaharian': {
try {
const doaPath = path.join(process.cwd(), "database", "doaharian.json");
const src = JSON.parse(fs.readFileSync(doaPath, "utf-8"));
let caption = src.map((v, i) => {
return `*${i + 1}.* ${v.title}\n\n❃ Latin :\n${v.latin}\n\n❃ Arabic :\n${v.arabic}\n\n❃ Translate :\n${v.translation}`.trim();
}).join("\n\n");
reply(caption);
} catch (e) {
reply(`❌ Gagal memuat doa harian: ${e.message}`);
}
}
break;

// =================== SALAM ===================
case 'salam':
case 'assalamualaikum': {
let caption = `*Waalaikummussalam warahmatullahi wabarokatuh*\n\n_📚 Baca yang dibawah ya!_\n"Orang yang mengucapkan salam seperti ini maka ia mendapatkan 30 pahala, kemudian, orang yang dihadapan atau mendengarnya membalas dengan kalimat yang sama yaitu “Wa'alaikum salam warahmatullahi wabarakatuh” atau ditambah dengan yang lain (waridhwaana). Artinya selain daripada do'a selamat juga meminta pada Allah SWT"`;
reply(caption);
}
break;

// =================== NIAT SHOLAT ===================
case 'niatsholat': {
if (!text) return example('subuh (contoh: subuh, dzuhur, ashar, maghrib, isha)');
const niatsholat = [
{ solat: "subuh", latin: "Ushalli fardhosh shubhi rok'ataini mustaqbilal qiblati adaa-an lillaahi ta'aala", arabic: "اُصَلِّى فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى", translation_id: "Aku berniat shalat fardhu Shubuh dua raka'at menghadap kiblat karena Allah Ta'ala" },
{ solat: "maghrib", latin: "Ushalli fardhol maghribi tsalaata raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala", arabic: "اُصَلِّى فَرْضَ الْمَغْرِبِ ثَلاَثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى", translation_id: "Aku berniat shalat fardhu Maghrib tiga raka'at menghadap kiblat karena Allah Ta'ala" },
{ solat: "dzuhur", latin: "Ushalli fardhodl dhuhri arba'a raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala", arabic: "اُصَلِّى فَرْضَ الظُّهْرِاَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى", translation_id: "Aku berniat shalat fardhu Dzuhur empat raka'at menghadap kiblat karena Allah Ta'ala" },
{ solat: "isha", latin: "Ushalli fardhol 'isyaa-i arba'a raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala", arabic: "اُصَلِّى فَرْضَ الْعِشَاءِ اَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى", translation_id: "Aku berniat shalat fardhu Isya empat raka'at menghadap kiblat karena Allah Ta'ala" },
{ solat: "ashar", latin: "Ushalli fardhol 'ashri arba'a raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala", arabic: "اُصَلِّى فَرْضَ الْعَصْرِاَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى", translation_id: "Aku berniat shalat fardhu 'Ashar empat raka'at menghadap kiblat karena Allah Ta'ala" }
];
const input = text.toLowerCase().trim();
const data = niatsholat.find(v => v.solat === input);
if (!data) {
return reply(`❌ *${text}* tidak ditemukan.\n\n*List Sholat 5 Waktu:*\n• subuh\n• dzuhur\n• ashar\n• maghrib\n• isha`);
}
let teks = `_*Niat Sholat ${data.solat.charAt(0).toUpperCase() + data.solat.slice(1)}*_\n\n*Arab :* ${data.arabic}\n\n*Latin :* ${data.latin}\n\n*Translate :* ${data.translation_id}`;
reply(teks);
}
break;

// =================== QUOTES ISLAMI ===================
case 'quotesislami': {
const islami = [
{ arabic: "مَنْ سَارَ عَلىَ الدَّرْبِ وَصَلَ", arti: "Barang siapa berjalan pada jalannya, maka dia akan sampai (pada tujuannya)." },
{ arabic: "مَنْ صَبَرَ ظَفِرَ", arti: "Barang siapa bersabar, maka dia akan beruntung." },
{ arabic: "مَنْ جَدَّ وَجَـدَ", arti: "Barang siapa bersungguh-sungguh, maka dia akan meraih (kesuksesan)." },
{ arabic: "جَالِسْ أَهْلَ الصِّدْقِ وَالوَفَاءِ", arti: "Bergaulah bersama orang-orang yang jujur dan menepati janji." },
{ arabic: "مَنْ قَلَّ صِدْقُهُ قَلَّ صَدِيْقُهُ", arti: "Barang siapa sedikit kejujurannya, maka sedikit pulalah temannya." },
{ arabic: "مَوَدَّةُ الصَّدِيْقِ تَظْهَرُ وَقْتَ الضِّيْقِ", arti: "Kecintaan seorang teman itu akan terlihat pada waktu kesempitan." },
{ arabic: "الصَّبْرُ يُعِيْنُ عَلَى كُلِّ عَمَلٍ", arti: "Kesabaran akan menolong segala pekerjaan." },
{ arabic: "وَمَا اللَّذَّةُ إِلاَّ بَعْدَ التَّعَبِ", arti: "Tidak ada kenikmatan kecuali setelah kepayahan." },
{ arabic: "جَرِّبْ وَلاَحِظْ تَكُنْ عَارِفًا", arti: "Coba dan perhatikanlah, maka engkau akan menjadi orang yang tahu." },
{ arabic: "بَيْضَةُ اليَوْمِ خَيْرٌ مِنْ دَجَاجَةِ الغَدِ", arti: "Telur hari ini lebih baik daripada ayam esok hari." },
{ arabic: "أُطْلُبِ الْعِلْمَ مِنَ الْمَهْدِ إِلَى الَّلحْدِ", arti: "Carilah ilmu sejak dari buaian hingga liang lahat." },
{ arabic: "الوَقْتُ أَثْمَنُ مِنَ الذَّهَبِ", arti: "Waktu itu lebih berharga daripada emas." },
{ arabic: "لاَ خَيْرَ فيِ لَذَّةٍ تَعْقِبُ نَدَماً", arti: "Tak ada kebaikan bagi kenikmatan yang diiringi dengan penyesalan." },
{ arabic: "أَخِي لَنْ تَنَالَ العِلْمَ إِلاَّ بِسِتَّةٍ سَأُنْبِيْكَ عَنْ تَفْصِيْلِهَا بِبَيَانٍ: ذَكَاءٌ وَحِرْصٌ وَاجْتِهَادٌ وَدِرْهَمٌ وَصُحْبَةُ أُسْتَاذٍ وَطُوْلُ زَمَانٍ", arti: "Wahai saudaraku, Kamu tidak akan memperoleh ilmu kecuali dengan enam perkara, akan aku sampaikan rinciannya dengan jelas; 1) Kecerdasan, 2) Ketamaan (terhadap ilmu), 3) Kesungguhan, 4) Harta benda (sebagai bekal), 5) Bergaul dengan guru, 6) Waktu yang lama." },
{ arabic: "لاَ تَكُنْ رَطْباً فَتُعْصَرَ وَلاَ يَابِسًا فَتُكَسَّرَ", arti: "Janganlah kamu bersikap lemah, sehingga kamu mudah diperas. Dan janganlah kamu bersikap keras, sehingga kamu mudah dipatahkan." },
{ arabic: "لِكُلِّ مَقَامٍ مَقَالٌ وَلِكُلِّ مَقَالٍ مَقَامٌ", arti: "Setiap tempat memiliki perkataannya masing-masing, dan setiap perkataan memiliki tempatnya masing-masing." },
{ arabic: "خَيْرُ النَّاسِ أَحْسَنُهُمْ خُلُقاً وَأَنْفَعُهُمْ لِلنَّاسِ", arti: "Sebaik-baik manusia adalah yang paling baik budi pekertinya dan yang paling bermanfaat bagi manusia lainnya." },
{ arabic: "خَيْرُ جَلِيْسٍ في الزّمانِ كِتابُ", arti: "Sebaik-baik teman duduk di setiap waktu adalah buku." },
{ arabic: "مَنْ يَزْرَعْ يَحْصُدْ", arti: "Barang siapa menanam, pasti ia akan memetik (mengetam)." },
{ arabic: "لَوْلاَ العِلْمُ لَكَانَ النَّاسُ كَالبَهَائِمِ", arti: "Kalaulah tidak karena ilmu, niscaya manusia itu seperti binatang." },
{ arabic: "سَلاَمَةُ الإِنْسَانِ فيِ حِفْظِ اللِّسَانِ", arti: "Keselamatan manusia itu terletak pada penjagaan lidahnya (perkataannya)." },
{ arabic: "الرِّفْقُ بِالضَّعِيْفِ مِنْ خُلُقِ الشَّرِيْفِ", arti: "Berlaku lemah lembut kepada orang yang lemah itu termasuk akhlak orang yang mulia (terhormat)." },
{ arabic: "وَعَامِلِ النَّاسَ بِمَا تُحِبُّ مِنْهُ دَائِماً", arti: "Dan bergaullah dengan manusia dengan sikap yang kamu juga suka diperlakukan seperti itu." },
{ arabic: "لَيْسَ الجَمَالُ بِأَثْوَابٍ تُزَيِّنُنُا إِنَّ الجَمَالَ جمَاَلُ العِلْمِ وَالأَدَبِ", arti: "Kecantikan bukanlah dengan pakaian yang melekat menghiasi diri kita, sesungguhnya kecantikan ialah kecantikan dengan ilmu dan budi pekerti." },
{ arabic: "مَنْ أَعاَنَكَ عَلىَ الشَّرِّ ظَلَمَكَ", arti: "Barang siapa membantumu dalam kejahatan, maka sesungguhnya ia telah berbuat aniaya terhadapmu." }
];
const randomIndex = Math.floor(Math.random() * islami.length);
const quote = islami[randomIndex];
reply(`${quote.arabic}\n\n${quote.arti}`);
}
break;

// ═══════════════════════════════════════════════════════
//RPG MENU
// ═══════════════════════════════════════════════════════

// =================== KERJA ===================
case "kerja":
case "bekerja": {
if (!m.isGroup) return reply(mess.group);
if (requireRegister(m.sender, reply, prefix)) return;

const type = (args[0] || "").toLowerCase();
const user = getRpgUser(m.sender);
const COOLDOWN = 300000;
const time = (user.lastkerja || 0) + COOLDOWN;
const cd = checkCooldown(user, "lastkerja", COOLDOWN);

const penumpan = ["mas mas", "bapak bapak", "cewe sma", "bocil epep", "emak emak"];
const penumpang = rpgPickRandom(penumpan);
const daganga = ["wortel", "sawi", "selada", "tomat", "seledri", "cabai", "daging", "ikan", "ayam"];
const dagangan = rpgPickRandom(daganga);
const pasie = ["sakit kepala", "cedera", "luka bakar", "patah tulang"];
const pasien = rpgPickRandom(pasie);
const pane = ["Wortel", "Kubis", "Strawberry", "Teh", "Padi", "Jeruk", "Pisang", "Semangka", "Durian", "Rambutan"];
const panen = rpgPickRandom(pane);
const bengke = ["mobil", "motor", "becak", "bajaj", "bus", "angkot", "sepeda"];
const bengkel = rpgPickRandom(bengke);
const ruma = ["Membangun Rumah", "Membangun Gedung", "Memperbaiki Rumah", "Memperbaiki Gedung", "Membangun Fasilitas Umum", "Memperbaiki Fasilitas Umum"];
const rumah = rpgPickRandom(ruma);

const hasilRandom = () => Math.floor(Math.random() * 150000);

switch (type) {
case "ojek": {
if (!cd.ready) return reply(`Kamu sudah bekerja\nSaatnya istirahat selama ${clockString(time - Date.now())}`);
const hasil = hasilRandom();
user.money += hasil;
user.exp += 10;
user.lastkerja = Date.now();
return reply(`Kamu Sudah Mengantarkan *${penumpang}* 🚗\nDan mendapatkan uang senilai *Rp ${hasil.toLocaleString()} ${rpgEmoji.money}*`);
}
case "pedagang": {
if (!cd.ready) return reply(`Kamu sudah bekerja, Saatnya istirahat selama\n🕜 ${clockString(time - Date.now())}`);
const hasil = hasilRandom();
user.money += hasil;
user.exp += 10;
user.lastkerja = Date.now();
return reply(`Ada pembeli yg membeli *${dagangan}* 🛒\nDan mendapatkan uang senilai *Rp ${hasil.toLocaleString()} ${rpgEmoji.money}*`);
}
case "dokter": {
if (!cd.ready) return reply(`Kamu sudah bekerja, Saatnya istirahat selama\n🕜 ${clockString(time - Date.now())}`);
const hasil = hasilRandom();
user.money += hasil;
user.exp += 10;
user.lastkerja = Date.now();
return reply(`Kamu menyembuhkan pasien *${pasien}* 💉\nDan mendapatkan uang senilai *Rp ${hasil.toLocaleString()} ${rpgEmoji.money}*`);
}
case "petani": {
if (!cd.ready) return reply(`Kamu sudah bekerja, Saatnya istirahat selama\n🕜 ${clockString(time - Date.now())}`);
const hasil = hasilRandom();
user.money += hasil;
user.exp += 10;
user.lastkerja = Date.now();
return reply(`${panen} Sudah Panen! 🌽 Dan menjualnya 🧺\nDan mendapatkan uang senilai Rp *${hasil.toLocaleString()} ${rpgEmoji.money}*`);
}
case "montir": {
if (!cd.ready) return reply(`Kamu sudah bekerja, Saatnya istirahat selama\n🕜 ${clockString(time - Date.now())}`);
const hasil = hasilRandom();
user.money += hasil;
user.exp += 10;
user.lastkerja = Date.now();
return reply(`Kamu Baru saja mendapatkan pelanggan dan memperbaiki *${bengkel}* 🔧\nDan kamu mendapatkan uang senilai *Rp ${hasil.toLocaleString()} ${rpgEmoji.money}*`);
}
case "kuli": {
if (!cd.ready) return reply(`Kamu sudah bekerja, Saatnya istirahat selama\n🕜 ${clockString(time - Date.now())}`);
const hasil = hasilRandom();
user.money += hasil;
user.exp += 10;
user.lastkerja = Date.now();
return reply(`Kamu baru saja selesai ${rumah} 🔨\nDan mendapatkan uang senilai *Rp ${hasil.toLocaleString()} ${rpgEmoji.money}*`);
}
default:
return reply(`_*PILIH PEKERJAAN YANG KAMU INGINKAN*_\n\n➬ KULI\n➬ MONTIR\n➬ PETANI\n➬ DOKTER\n➬ PEDAGANG\n➬ OJEK\n\nContoh: *.kerja dokter*`);
}
}
break;

// ═══════════════════════════════════════════════════════
//REGISTER & PROFIL
// ═══════════════════════════════════════════════════════

// =================== DAFTAR RPG ===================
case "daftar":
case "register":
case "reg": {
const user = getRpgUser(m.sender);

if (user.registered === true) {
return reply(
`❌ *Kamu sudah terdaftar!*\n\n` +
`👤 Nama: *${user.name}*\n` +
`💰 Money: *Rp ${user.money.toLocaleString()}*\n` +
`✨ Exp: *${user.exp}*\n` +
`🔖 Limit: *${user.limit}*\n\n` +
`_Ketik *.profil* untuk lihat profil lengkap_`
);
}

const nama = text.trim().slice(0, 20);
if (!nama) {
return example(`NamaKamu\n\nContoh: *${prefix}daftar Budi*`);
}

if (!/^[a-zA-Z0-9 ]+$/.test(nama)) {
return reply(
`❌ Nama hanya boleh huruf, angka, dan spasi!\n\n` +
`Contoh: *${prefix}daftar Budi Santoso*`
);
}

const sudahDipakai = Object.values(global.db.data.users).some(
u => u.registered && u.name && u.name.toLowerCase() === nama.toLowerCase()
);
if (sudahDipakai) {
return reply(`❌ Nama *${nama}* sudah dipakai user lain!\nCoba nama lain.`);
}

user.registered = true;
user.name = nama;
user.regTime = Date.now();

// 🎁 Starter Pack
user.money = 10000;
user.exp = 100;
user.potion = 5;
user.pickaxe = 1;
user.health = 100;
user.atm = 1;
user.bank = 0;
user.fullatm = 5000000;
user.tiketcoin = 1;
user.limit = 10;

await vinss.sendMessage(m.chat, { react: { text: "🎉", key: m.key } });

return reply(
`🎉 *PENDAFTARAN BERHASIL!*\n\n` +
`👤 *Nama:* ${nama}\n` +
`📅 *Tanggal:* ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n\n` +
`🎁 *STARTER PACK:*\n` +
`💰 Money: *Rp 10.000*\n` +
`✨ Exp: *100*\n` +
`🧪 Potion: *5*\n` +
`⛏️ Pickaxe: *1*\n` +
`🏧 ATM: *Level 1*\n` +
`🎫 Tiketcoin: *1*\n` +
`🔖 Limit: *10*\n\n` +
`_Sekarang kamu bisa main RPG!_\n` +
`_Coba ketik: *.kerja ojek* atau *.nebang*_`
);
}
break

// =================== PROFIL RPG ===================
case "profil":
case "profile":
case "me": {
const user = getRpgUser(m.sender);

if (!user.registered) {
return reply(
`❌ Kamu belum terdaftar!\n\n` +
`Ketik *${prefix}daftar NamaKamu* untuk mulai main RPG.`
);
}

const rank = user.level > 999 ? "Elite" : user.level > 100 ? "Pro" : user.level > 10 ? "Intermediate" : "Pemula";

return reply(
`╭━━━〔 👤 *PROFIL RPG* 〕━━━╮\n` +
`│\n` +
`│ 👤 *Nama:* ${user.name}\n` +
`│ 📊 *Level:* ${user.level} (${rank})\n` +
`│ ✨ *Exp:* ${user.exp}\n` +
`│ 🔖 *Limit:* ${user.limit}\n` +
`│\n` +
`│ 💰 *Money:* Rp ${user.money.toLocaleString()}\n` +
`│ 🏦 *Bank:* Rp ${user.bank.toLocaleString()} / ${user.fullatm.toLocaleString()}\n` +
`│ 🎫 *Tiketcoin:* ${user.tiketcoin}\n` +
`│ 🎰 *Chip:* ${user.chip}\n` +
`│\n` +
`│ ❤️ *Health:* ${user.health}\n` +
`│ ⛏️ *Pickaxe:* ${user.pickaxe}\n` +
`│ 🧪 *Potion:* ${user.potion}\n` +
`│\n` +
`│ 🐾 *Pet:*\n` +
`│ 🐉 Naga: ${user.naga}\n` +
`│ 🦊 Kyubi: ${user.kyubi}\n` +
`│ 🦅 Phonix: ${user.phonix}\n` +
`│ 🐈 Kucing: ${user.kucing}\n` +
`│ 🦚 Griffin: ${user.griffin}\n` +
`│ 🐴 Centaur: ${user.centaur}\n` +
`│\n` +
`│ 📅 *Terdaftar:* ${new Date(user.regTime).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n` +
`│\n` +
`╰━━━━━━━━━━━━━━━━━━━━━━╯`
);
}
break

// =================== DAILY REWARD ===================
case "daily":
case "harian":
case "claim": {
if (requireRegister(m.sender, reply, prefix)) return;

const user = getRpgUser(m.sender);
const COOLDOWN = 86400000;
const cd = checkCooldown(user, "lastclaim", COOLDOWN);

if (!cd.ready) {
return reply(
`⏰ *Daily Reward Belum Siap!*\n\n` +
`Kamu sudah klaim daily.\n` +
`Tunggu *${clockString(cd.sisa)}* lagi.\n\n` +
`_Daily reward bisa diklaim setiap 24 jam_`
);
}

const rewardMoney = 10000;
const rewardExp = 100;
const rewardLimit = 10;
const rewardPotion = 2;
const rewardTiket = 1;

user.money += rewardMoney;
user.exp += rewardExp;
user.limit += rewardLimit;
user.potion += rewardPotion;
user.tiketcoin += rewardTiket;
user.lastclaim = Date.now();

await vinss.sendMessage(m.chat, { react: { text: "🎁", key: m.key } });

return reply(
`🎁 *DAILY REWARD CLAIMED!*\n\n` +
`📅 *Tanggal:* ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n\n` +
`💰 *Money:* +Rp ${rewardMoney.toLocaleString()}\n` +
`✨ *Exp:* +${rewardExp}\n` +
`🔖 *Limit:* +${rewardLimit}\n` +
`🧪 *Potion:* +${rewardPotion}\n` +
`🎫 *Tiketcoin:* +${rewardTiket}\n\n` +
`_Klaim lagi besok ya!_`
);
}
break

// =================== SLOT MACHINE ===================
case "slot":
case "jackpot": {
if (!m.isGroup) return reply(mess.group);
if (requireRegister(m.sender, reply, prefix)) return;

const user = getRpgUser(m.sender);

if (user.limit < 1) {
return reply(
`❌ *Limit kamu habis!*\n\n` +
`Butuh *1 limit* untuk main slot.\n` +
`Beli limit: *.buy limit <jumlah>*\n` +
`Atau klaim daily: *.daily*`
);
}

const sotoy = ['🍇', '🍉', '🍋', '🍌', '🍎', '🍑', '🍒', '🫐', '🥥', '🥑'];
const rpgPick = () => sotoy[Math.floor(Math.random() * sotoy.length)];

const slot1 = rpgPick();
const slot2 = rpgPick();
const slot3 = rpgPick();

const listSlot1 = `${rpgPick()} : ${rpgPick()} : ${rpgPick()}`;
const listSlot2 = `${slot1} : ${slot2} : ${slot3}`;
const listSlot3 = `${rpgPick()} : ${rpgPick()} : ${rpgPick()}`;

const randomLimit = Math.floor(Math.random() * 10) + 1;

user.limit -= 1;

let teks;
if (slot1 === slot2 && slot2 === slot3) {
const hadiahMoney = randomLimit * 500;
user.money += hadiahMoney;
user.exp += randomLimit;
user.limit += randomLimit;

teks =
`[🎰 VIRTUAL SLOT 🎰]\n` +
`------------------------\n\n` +
`${listSlot1}\n` +
`${listSlot2} <=====\n` +
`${listSlot3}\n\n` +
`------------------------\n` +
`[🎰 VIRTUAL SLOT 🎰]\n\n` +
`*Keterangan:*\n` +
`_You Win 🎉_ <=====\n` +
`🔖 Limit: +${randomLimit}\n` +
`💰 Money: +Rp ${hadiahMoney.toLocaleString()}\n` +
`✨ Exp: +${randomLimit}`;
} else {
teks =
`[🎰 VIRTUAL SLOT 🎰]\n` +
`------------------------\n\n` +
`${listSlot1}\n` +
`${listSlot2} <=====\n` +
`${listSlot3}\n\n` +
`------------------------\n` +
`[🎰 VIRTUAL SLOT 🎰]\n\n` +
`*Keterangan:*\n` +
`_You Lose_ <=====\n` +
`🔖 Limit: -1`;
}

await vinss.sendMessage(m.chat, { react: { text: slot1 === slot2 && slot2 === slot3 ? "🎉" : "❌", key: m.key } });

return reply(teks);
}
break

// =================== BUY ITEM ===================
case "buy":
case "beli": {
if (requireRegister(m.sender, reply, prefix)) return;

const user = getRpgUser(m.sender);
const item = (args[0] || "").toLowerCase();
const jumlah = parseInt(args[1]) || 1;

if (!item) {
return reply(
`🛒 *TOKO ITEM*\n` +
`━━━━━━━━━━━━━━━━━━━━━━\n\n` +
`🔖 *limit* — Rp 500/limit\n` +
`🧪 *potion* — Rp 5.000/potion\n` +
`⛏️ *pickaxe* — Rp 50.000/pickaxe\n` +
`❤️ *health* — Rp 1.000/health\n` +
`🎫 *tiketcoin* — Rp 100.000/tiket\n\n` +
`📝 *Cara beli:*\n` +
`*.buy <item> <jumlah>*\n\n` +
`Contoh:\n` +
`*.buy limit 10*\n` +
`*.buy potion 5*`
);
}

if (jumlah < 1 || jumlah > 10000) {
return reply(`❌ Jumlah harus antara 1-10000`);
}

let hargaSatuan = 0;
let itemName = "";

switch (item) {
case "limit":
case "limitnya":
hargaSatuan = 500;
itemName = "Limit";
break;
case "potion":
case "potions":
hargaSatuan = 5000;
itemName = "Potion";
break;
case "pickaxe":
case "pickax":
hargaSatuan = 50000;
itemName = "Pickaxe";
break;
case "health":
case "hp":
hargaSatuan = 1000;
itemName = "Health";
break;
case "tiket":
case "tiketcoin":
hargaSatuan = 100000;
itemName = "Tiketcoin";
break;
default:
return reply(
`❌ Item *${item}* tidak dikenal!\n\n` +
`Item yang tersedia: *limit, potion, pickaxe, health, tiketcoin*\n` +
`Ketik *.buy* untuk lihat daftar lengkap.`
);
}

const totalHarga = hargaSatuan * jumlah;

if (user.money < totalHarga) {
return reply(
`❌ *Uang tidak cukup!*\n\n` +
`💰 Uang kamu: *Rp ${user.money.toLocaleString()}*\n` +
`💵 Harga: *Rp ${totalHarga.toLocaleString()}*\n` +
`📊 Kekurangan: *Rp ${(totalHarga - user.money).toLocaleString()}*\n\n` +
`_Kerja dulu: *.kerja <pekerjaan>*_`
);
}

user.money -= totalHarga;

switch (item) {
case "limit":
case "limitnya":
user.limit += jumlah;
break;
case "potion":
case "potions":
user.potion += jumlah;
break;
case "pickaxe":
case "pickax":
user.pickaxe += jumlah;
break;
case "health":
case "hp":
user.health += jumlah;
break;
case "tiket":
case "tiketcoin":
user.tiketcoin += jumlah;
break;
}

await vinss.sendMessage(m.chat, { react: { text: "🛒", key: m.key } });

return reply(
`✅ *PEMBELIAN BERHASIL!*\n\n` +
`📦 *Item:* ${itemName}\n` +
`🔢 *Jumlah:* ${jumlah}\n` +
`💰 *Total Bayar:* Rp ${totalHarga.toLocaleString()}\n` +
`💵 *Sisa Uang:* Rp ${user.money.toLocaleString()}`
);
}
break

// =================== TRANSFER ===================
case "transfer":
case "tf": {
if (requireRegister(m.sender, reply, prefix)) return;

const user = getRpgUser(m.sender);
const type = (args[0] || "").toLowerCase();

if (!type) {
return reply(
`💸 *TRANSFER*\n` +
`━━━━━━━━━━━━━━━━━━━━━━\n\n` +
`📝 *Format:*\n` +
`*.transfer <tipe> @user <jumlah>*\n\n` +
`💵 *Tipe:*\n` +
`• money — Transfer uang\n` +
`• limit — Transfer limit\n\n` +
`📌 *Contoh:*\n` +
`*.transfer money @user 10000*\n` +
`*.transfer limit @user 5*`
);
}

if (!["money", "limit", "uang"].includes(type)) {
return reply(`❌ Tipe transfer harus *money* atau *limit*!`);
}

const target = m.mentionedJid?.[0] || m.quoted?.sender;
if (!target) {
return reply(`❌ Tag atau reply user yang mau ditransfer!`);
}

if (target === m.sender) {
return reply(`❌ Tidak bisa transfer ke diri sendiri!`);
}

const targetUser = getRpgUser(target);
if (!targetUser.registered) {
return reply(`❌ Target belum terdaftar di RPG!`);
}

const jumlah = parseInt(args[args.length - 1]);
if (!jumlah || jumlah < 1) {
return reply(`❌ Masukkan jumlah yang valid!\nContoh: *.transfer money @user 10000*`);
}

if (type === "money" || type === "uang") {
if (user.money < jumlah) {
return reply(
`❌ *Uang tidak cukup!*\n\n` +
`💰 Uang kamu: *Rp ${user.money.toLocaleString()}*\n` +
`💵 Mau transfer: *Rp ${jumlah.toLocaleString()}*`
);
}

user.money -= jumlah;
targetUser.money += jumlah;

await vinss.sendMessage(m.chat, { react: { text: "💸", key: m.key } });

return vinss.sendMessage(m.chat, {
text:
`✅ *TRANSFER BERHASIL!*\n\n` +
`📤 *Dari:* @${m.sender.split("@")[0]}\n` +
`📥 *Ke:* @${target.split("@")[0]}\n` +
`💵 *Jumlah:* Rp ${jumlah.toLocaleString()}\n` +
`💰 *Sisa Uang Kamu:* Rp ${user.money.toLocaleString()}`,
mentions: [m.sender, target]
}, { quoted: m });
}

if (type === "limit") {
if (user.limit < jumlah) {
return reply(
`❌ *Limit tidak cukup!*\n\n` +
`🔖 Limit kamu: *${user.limit}*\n` +
`📤 Mau transfer: *${jumlah}*`
);
}

user.limit -= jumlah;
targetUser.limit += jumlah;

await vinss.sendMessage(m.chat, { react: { text: "💸", key: m.key } });

return vinss.sendMessage(m.chat, {
text:
`✅ *TRANSFER LIMIT BERHASIL!*\n\n` +
`📤 *Dari:* @${m.sender.split("@")[0]}\n` +
`📥 *Ke:* @${target.split("@")[0]}\n` +
`🔖 *Jumlah:* ${jumlah} limit\n` +
`📊 *Sisa Limit Kamu:* ${user.limit}`,
mentions: [m.sender, target]
}, { quoted: m });
}
}
break

// =================== HEAL ===================
case "heal": {
if (requireRegister(m.sender, reply, prefix)) return;

const user = getRpgUser(m.sender);
const jumlah = parseInt(args[0]) || 1;

if (jumlah < 1) return reply(`❌ Jumlah heal minimal 1!`);
if (user.potion < jumlah) {
return reply(`❌ *Potion tidak cukup!*\n\n🧪 Potion kamu: *${user.potion}*\n🎯 Butuh: *${jumlah}*\n\n_Beli dulu: *.buy potion <jumlah>*_`);
}
if (user.health >= 100) {
return reply(`❤️ Health kamu sudah penuh!`);
}

user.potion -= jumlah;
const healAmount = jumlah * 20;
user.health = Math.min(100, user.health + healAmount);

await vinss.sendMessage(m.chat, { react: { text: "💊", key: m.key } });

return reply(`💊 *HEAL BERHASIL!*\n\n❤️ Health: *${user.health}/100*\n🧪 Sisa Potion: *${user.potion}*`);
}
break

// =================== NEBANG ===================
case "nebang": {
if (!m.isGroup) return reply(mess.group);
if (requireRegister(m.sender, reply, prefix)) return;

const user = getRpgUser(m.sender);
const COOLDOWN = 1800000;
const time = (user.lastparming || 0) + COOLDOWN;
const cd = checkCooldown(user, "lastparming", COOLDOWN);

if (!cd.ready) {
return reply(`Anda sudah lelah untuk bekerja\nTunggu selama ${msToTime(time - Date.now())} lagi`);
}

const wood = Math.floor(Math.random() * 50);
const money = Math.floor(Math.random() * 50000);

user.wood += wood;
user.money += money;
user.exp += 20;
user.lastparming = Date.now();

reply(`Selamat kamu mendapatkan :\n+${wood} ${rpgEmoji.wood} Kayu\n+${money} ${rpgEmoji.money} Money\n+20 ${rpgEmoji.exp} Exp`);
}
break;

// =================== MULUNG ===================
case "mulung": {
if (!m.isGroup) return reply(mess.group);
if (requireRegister(m.sender, reply, prefix)) return;

const user = getRpgUser(m.sender);
const COOLDOWN = 1800000;
const time = (user.lastmulung || 0) + COOLDOWN;
const cd = checkCooldown(user, "lastmulung", COOLDOWN);

if (!cd.ready) {
return reply(`Anda sudah lelah untuk mulung\nTunggu selama ${msToTime(time - Date.now())} lagi`);
}

const botol = Math.floor(Math.random() * 1000);
const kaleng = Math.floor(Math.random() * 1000);
const kardus = Math.floor(Math.random() * 1000);
const gelas = Math.floor(Math.random() * 1000);
const plastik = Math.floor(Math.random() * 1000);

user.botol += botol;
user.kaleng += kaleng;
user.kardus += kardus;
user.gelas += gelas;
user.plastik += plastik;
user.exp += 15;
user.lastmulung = Date.now();

reply(`Selamat kamu mendapatkan : \n+${botol} Botol\n+${kaleng} Kaleng\n+${kardus} Kardus\n+${gelas} Gelas\n+${plastik} Plastik\n+15 ${rpgEmoji.exp} Exp`);
}
break;

// =================== MINING ===================
case "mining": {
if (!m.isGroup) return reply(mess.group);
if (requireRegister(m.sender, reply, prefix)) return;

Array.prototype.getRandom = function () {
return this[Math.floor(Math.random() * this.length)];
};
Number.prototype.getRandom = function () {
return Math.floor(Math.random() * this);
};

const user = getRpgUser(m.sender);
const COOLDOWN = 300000;
const cd = checkCooldown(user, "lastmining", COOLDOWN);

if (user.health < 80) {
return reply(`⚠️ Butuh setidaknya 80 ${rpgEmoji.health} Healths untuk menambang!! ⚠️\n\nSilakan beli ${rpgEmoji.health}Healths dengan:\n*${prefix}buy potion <jumlah>*\n\nDan ketik *${prefix}heal <jumlah>* untuk pakai potion.`);
}

if (user.pickaxe == 0) {
return reply(`⛏️ Kamu tidak bisa menambang tanpa pickaxe! ⛏️\n\nBeli dulu di *${prefix}buy pickaxe <jumlah>*`);
}

if (!cd.ready) {
return reply(`⏳ Kamu sudah menambang sebelumnya! Tunggu *${(cd.sisa / 1000).toFixed(2)} detik* lagi.`);
}

const rewards = {
reward: {
exp: 1000, trash: 101, string: 25, rock: 30, iron: 25,
diamond: 10, emerald: 4,
common: (user.dog && (user.dog > 2 ? 2 : user.dog) * 1.2 || 1) * 2,
uncommon: [0, 0, 0, 1, 0].concat(new Array(5 - (user.dog > 2 && user.dog < 6 && user.dog || user.dog > 5 && 5 || 2)).fill(0)),
mythic: [0, 0, 0, 0, 0, 1, 0, 0, 0].concat(new Array(8 - (user.dog > 5 && user.dog < 8 && user.dog || user.dog > 7 && 8 || 3)).fill(0)),
legendary: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0].concat(new Array(10 - (user.dog > 8 && user.dog || 4)).fill(0)),
gold: [0, 0, 0, 0, 0, 1, 0]
},
lost: {
health: 40 - user.cat * 4,
pickaxe: 10
}
};

let text = "Kamu telah menambang dan kehilangan";
for (const lost in rewards.lost) {
if (user[lost] !== undefined) {
const total = rewards.lost[lost].getRandom();
user[lost] -= total * 1;
if (total) text += `\n*${rpgEmoji[lost] || lost}${lost}:* ${total}`;
}
}

text += "\n\nNamun kamu mendapatkan";
for (const rewardItem in rewards.reward) {
if (rewardItem in user) {
const arr = rewards.reward[rewardItem];
const total = Array.isArray(arr) ? arr.getRandom() : Math.floor(Math.random() * arr);
user[rewardItem] += total * 1;
if (total) text += `\n*${rpgEmoji[rewardItem] || rewardItem}${rewardItem}:* ${total}`;
}
}

user.lastmining = Date.now();
reply(text.trim());
}
break;

// =================== HEAL ===================
case "heal": {
if (requireRegister(m.sender, reply, prefix)) return;

const user = getRpgUser(m.sender);
const jumlah = parseInt(args[0]) || 1;

if (jumlah < 1) return reply(`❌ Jumlah heal minimal 1!`);
if (user.potion < jumlah) {
return reply(`❌ *Potion tidak cukup!*\n\n🧪 Potion kamu: *${user.potion}*\n🎯 Butuh: *${jumlah}*\n\n_Beli dulu: *.buy potion <jumlah>*_`);
}
if (user.health >= 100) {
return reply(`❤️ Health kamu sudah penuh!`);
}

user.potion -= jumlah;
const healAmount = jumlah * 20;
user.health = Math.min(100, user.health + healAmount);

await vinss.sendMessage(m.chat, { react: { text: "💊", key: m.key } });

return reply(`💊 *HEAL BERHASIL!*\n\n❤️ Health: *${user.health}/100*\n🧪 Sisa Potion: *${user.potion}*`);
}
break;

// =================== BERBURU ===================
case "berburu": {
if (!m.isGroup) return reply(mess.group);
if (requireRegister(m.sender, reply, prefix)) return;

const user = getRpgUser(m.sender);
const COOLDOWN = 3600000;
const time = (user.lastmisi || 0) + COOLDOWN;
const cd = checkCooldown(user, "lastmisi", COOLDOWN);

global.misi = global.misi || {};
if (m.sender in global.misi) {
return reply(`Selesaikan Misi ${global.misi[m.sender][0]} Terlebih Dahulu`);
}

if (!cd.ready) {
return reply(`Silahkan Menunggu Selama ${clockString(time - Date.now())}, Untuk Menyelesaikan Misi Kembali`);
}

const hewan1 = Math.floor(Math.random() * 10);
const hewan2 = Math.floor(Math.random() * 10);
const hewan3 = Math.floor(Math.random() * 10);
const hewan4 = Math.floor(Math.random() * 10);
const hewan5 = Math.floor(Math.random() * 10);
const hewan6 = Math.floor(Math.random() * 10);
const hewan7 = Math.floor(Math.random() * 10);
const hewan8 = Math.floor(Math.random() * 10);
const hewan9 = Math.floor(Math.random() * 10);
const hewan10 = Math.floor(Math.random() * 10);
const hewan11 = Math.floor(Math.random() * 10);
const hewan12 = Math.floor(Math.random() * 10);

const hsl = `🕸 *Hasil Berburu ${user.name}* 
${hewan1 ? `\n🐂 Banteng: ${hewan1}` : ""}${hewan2 ? `\n🐅 Harimau: ${hewan2}` : ""}${hewan3 ? `\n🐘 Gajah: ${hewan3}` : ""}${hewan4 ? `\n🐐 Kambing: ${hewan4}` : ""}${hewan5 ? `\n🐼 Panda: ${hewan5}` : ""}${hewan6 ? `\n🐊 Buaya: ${hewan6}` : ""}${hewan7 ? `\n🐃 Kerbau: ${hewan7}` : ""}${hewan8 ? `\n🐮 Sapi: ${hewan8}` : ""}${hewan9 ? `\n🐒 Monyet: ${hewan9}` : ""}${hewan10 ? `\n🐗 Babi Hutan: ${hewan10}` : ""}${hewan11 ? `\n🐖 Babi: ${hewan11}` : ""}${hewan12 ? `\n🐓 Ayam: ${hewan12}` : ""}`.trim();

user.banteng += hewan1;
user.harimau += hewan2;
user.gajah += hewan3;
user.kambing += hewan4;
user.panda += hewan5;
user.buaya += hewan6;
user.kerbau += hewan7;
user.sapi += hewan8;
user.monyet += hewan9;
user.babihutan += hewan10;
user.babi += hewan11;
user.ayam += hewan12;
user.lastmisi = Date.now();

global.misi[m.sender] = ["Berburu", setTimeout(() => {
delete global.misi[m.sender];
}, 20000)];

setTimeout(() => reply("Sedang mencari mangsa..."), 0);
setTimeout(() => reply("Dapat Sasaran"), 14000);
setTimeout(() => reply("Dorr🔥"), 15000);
setTimeout(() => reply("Nah ini dia"), 18000);
setTimeout(() => reply(hsl), 20000);
}
break;

// =================== POLISI ===================
case "polisi": {
if (!m.isGroup) return reply(mess.group);
if (requireRegister(m.sender, reply, prefix)) return;

const user = getRpgUser(m.sender);
const COOLDOWN = 3600000;
const time = (user.lastmisi || 0) + COOLDOWN;
const cd = checkCooldown(user, "lastmisi", COOLDOWN);

global.misi = global.misi || {};
if (m.sender in global.misi) {
return reply(`Selesaikan Misi ${global.misi[m.sender][0]} Terlebih Dahulu`);
}

if (!cd.ready) {
return reply(`Silahkan Menunggu Selama ${clockString(time - Date.now())}, Untuk Menyelesaikan Misi Kembali`);
}

const randomaku1 = Math.floor(Math.random() * 10);
const randomaku2 = Math.floor(Math.random() * 10);
const rbrb1 = randomaku1 * 100000;
const rbrb2 = randomaku2 * 1000;

const hsl = `*—[ Hasil Polisi ${user.name} ]—*\n➕ 💹 Uang = [ ${rbrb1} ]\n➕ ✨ Exp = [ ${rbrb2} ]\n➕ 😍 Order Selesai = +1\n➕ 📥 Total Order Sebelumnya : ${user.ojekk || 0}`.trim();

user.money += rbrb1;
user.exp += rbrb2;
user.ojekk = (user.ojekk || 0) + 1;
user.lastmisi = Date.now();

global.misi[m.sender] = ["Polisi", setTimeout(() => {
delete global.misi[m.sender];
}, 27000)];

setTimeout(() => reply("👮Sedang Berpatroli....."), 0);
setTimeout(() => reply("👮Mengejar Pencuri...."), 10000);
setTimeout(() => reply("👮Menangkap pencuri...."), 15000);
setTimeout(() => reply("🚔Membawa ke kantor polisi\nDan di penjara"), 20000);
setTimeout(() => reply("➕ 💹Menerima gaji...."), 25000);
setTimeout(() => reply(hsl), 27000);
}
break;

// =================== TAXY ===================
case "taxy":
case "taksi": {
if (!m.isGroup) return reply(mess.group);
if (requireRegister(m.sender, reply, prefix)) return;

const user = getRpgUser(m.sender);
const COOLDOWN = 3600000;
const time = (user.lastmisi || 0) + COOLDOWN;
const cd = checkCooldown(user, "lastmisi", COOLDOWN);

global.misi = global.misi || {};
if (m.sender in global.misi) {
return reply(`Selesaikan Misi ${global.misi[m.sender][0]} Terlebih Dahulu`);
}

if (!cd.ready) {
return reply(`Silahkan Menunggu Selama ${clockString(time - Date.now())}, Untuk Menyelesaikan Misi Kembali`);
}

const randomaku1 = Math.floor(Math.random() * 1000000);
const randomaku2 = Math.floor(Math.random() * 10000);
const order = user.ojekk || 0;

const dimas = `
🚶⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬜⬜⬜⬛⬜⬜⬜⬛⬛
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🏘️🏘️🏘️🏘️🌳🌳 🏘️ 🚕


✔️ Mendapatkan orderan....
`.trim();

const dimas2 = `
🚶⬛⬛⬛⬛⬛🚐⬛⬛⬛🚓🚚
🚖⬜⬜⬜⬛⬜⬜⬜🚓⬛🚑
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🚙
🏘️🏘️🏢️🌳🌳 🏘️🏘️🏡


🚖 Mengantar Ke tujuan.....
`.trim();

const dimas3 = `
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🚓
⬛⬜🚗⬜⬜⬛⬜🚐⬜⬜⬛🚙🚚🚑
⬛⬛⬛⬛🚒⬛⬛⬛⬛⬛⬛🚚
🏘️🏘️🏘️🏘️🌳🌳 🏘️


🚖 Selesai Mengantar Pelanggan....
`.trim();

const dimas4 = `➕ 💹Menerima gaji....`.trim();

const hsl = `*—[ Hasil Taxy ${user.name} ]—*\n➕ 💹 Uang = [ ${randomaku1} ]\n➕ ✨ Exp = [ ${randomaku2} ]\n➕ 😍 Order Selesai = +1\n➕ 📥Total Order Sebelumnya : ${order}`.trim();

user.money += randomaku1;
user.exp += randomaku2;
user.ojekk = (user.ojekk || 0) + 1;
user.lastmisi = Date.now();

global.misi[m.sender] = ["Taxy", setTimeout(() => {
delete global.misi[m.sender];
}, 27000)];

setTimeout(() => reply("🔍Mencari pelanggan....."), 0);
setTimeout(() => reply(dimas), 10000);
setTimeout(() => reply(dimas2), 15000);
setTimeout(() => reply(dimas3), 20000);
setTimeout(() => reply(dimas4), 25000);
setTimeout(() => reply(hsl), 27000);
}
break;

// =================== CASINO ===================
case "casino": {
if (!m.isGroup) return reply(mess.group);
if (requireRegister(m.sender, reply, prefix)) return;

const buatall = 1;
global.casino = global.casino || {};
if (m.chat in global.casino) {
return reply("Masih ada yang melakukan casino disini, tunggu sampai selesai!!");
} else {
global.casino[m.chat] = true;
}

try {
const user = getRpgUser(m.sender);
const randomaku = Math.floor(Math.random() * 101);
const randomkamu = Math.floor(Math.random() * 81);
const Aku = randomaku;
const Kamu = randomkamu;

let count = args[0];
count = count ? /all/i.test(count) ? Math.floor(user.exp / buatall) : parseInt(count) : args[0] ? parseInt(args[0]) : 1;
count = Math.max(1, count);

if (args.length < 1) {
return reply(`casino <jumlah>\ncasino 1000`);
}

if (user.exp >= count) {
user.exp -= count;
if (Aku > Kamu) {
reply(`💰 Casino 💰\n*Kamu:* ${Kamu} Point\n*Computer:* ${Aku} Point\n\n*You LOSE*\nKamu kehilangan ${count} Exp`);
} else if (Aku < Kamu) {
user.exp += count * 2;
reply(`💰 Casino 💰\n*Kamu:* ${Kamu} Point\n*Computer:* ${Aku} Point\n\n*You Win*\nKamu mendapatkan ${count * 2} Exp`);
} else {
user.exp += count;
reply(`💰 Casino 💰\n*Kamu:* ${Kamu} Point\n*Computer:* ${Aku} Point\n\n*SERI*\nKamu mendapatkan ${count} Exp`);
}
} else {
reply(`Exp kamu tidak mencukupi untuk Casino silahkan *#kerja* terlebih dahulu!`);
}
} catch (e) {
console.log(e);
reply("Error!!");
} finally {
delete global.casino[m.chat];
}
}
break;

// =================== BANSOS ===================
case "bansos": {
if (!m.isGroup) return reply(mess.group);
if (requireRegister(m.sender, reply, prefix)) return;

const user = getRpgUser(m.sender);
const randomaku = Math.floor(Math.random() * 101);
const randomkamu = Math.floor(Math.random() * 101);
const COOLDOWN = 300000;
const cd = checkCooldown(user, "lastbansos", COOLDOWN);

if (user.money < 1000) {
return reply(`Uang Anda Harus Diatas Seribu Untuk Menggunakan Command Ini`);
}

if (!cd.ready) {
return reply(`Silahkan Menunggu Beberapa Menit Untuk bansos Lagi`);
}

if (randomaku > randomkamu) {
user.money -= 3000000;
user.lastbansos = Date.now();
return vinss.sendMessage(m.chat, {
image: { url: "https://telegra.ph/file/afcf9a7f4e713591080b5.jpg" },
caption: `Kamu Tertangkap Setelah Kamu korupsi dana bansos🕴️💰, Dan Kamu harus membayar denda 3 Juta rupiah💵`
}, { quoted: m });
} else if (randomaku < randomkamu) {
user.money += 3000000;
user.lastbansos = Date.now();
return vinss.sendMessage(m.chat, {
image: { url: "https://telegra.ph/file/d31fcc46b09ce7bf236a7.jpg" },
caption: `Kamu berhasil korupsi dana bansos🕴️💰, Dan Kamu mendapatkan 3 Juta rupiah💵`
}, { quoted: m });
} else {
user.lastbansos = Date.now();
return reply(`Sorry Gan Lu g Berhasil Korupsi bansos Dan Tidak masuk penjara karna Kamu *melarikan diri🏃*`);
}
}
break;

// =================== BANKCEK ===================
case "bankcek":
case "bank": {
if (!m.isGroup) return reply(mess.group);
if (requireRegister(m.sender, reply, prefix)) return;

const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.key.fromMe ? vinss.user.id : m.sender;

if (!(who in global.db.data.users)) {
return reply(`User ${who} not in database`);
}

const user = global.db.data.users[who];
const isMods = m.sender === global.ownernumber + "@s.whatsapp.net" || m.sender === vinss.user.id;
const isPrems = isMods || new Date() - (user.premiumTime || 0) < 0;

const caption = `
▧「 *BANK CEK* 」
│ 👤 Name: ${user.registered ? user.name : "Belum daftar"}
│ ${rpgEmoji.atm} Atm: ${user.atm > 0 ? "Level " + user.atm : "✖️"}
│ ${rpgEmoji.bank} Bank: ${user.bank} / ${user.fullatm}
│ ${rpgEmoji.money} Money: ${user.money}
│ ${rpgEmoji.chip} Chip: ${user.chip}
│ ${rpgEmoji.limit} Limit: ${user.limit}
│ 🤖 Robo: ${user.robo > 0 ? "Level " + user.robo : "✖️"}
│ 🌟 Status: ${isMods ? "Developer" : isPrems ? "Premium User ✅" : user.level > 999 ? "Elite User" : "Free User"}
│ 📑 Registered: ${user.registered ? "Yes" : "No"}
└────···
`.trim();

reply(caption);
}
break;

// =================== NABUNG ===================
case "nabung": {
if (requireRegister(m.sender, reply, prefix)) return;

const xpperlimit = 1;
const user = getRpgUser(m.sender);
let count = args[0] ? (/all/i.test(args[0]) ? Math.floor(user.money / xpperlimit) : parseInt(args[0])) : 1;
count = Math.max(1, count);

if (user.atm == 0) {
return reply("Kamu belum mempunyai atm! Beli di *.buy atm*");
}
if (user.bank >= user.fullatm) {
return reply("Uang dibankmu sudah penuh!");
}
if (count > user.fullatm - user.bank) {
return reply("Uangnya ga muat dibank");
}
if (user.money >= xpperlimit * count) {
user.money -= xpperlimit * count;
user.bank += count;
reply(`Sukses menabung sebesar ${count} Money 💹`);
} else {
reply(`[❗] Uang anda tidak mencukupi untuk menabung ${count} money 💹`);
}
}
break;

// =================== MERAMPOK ===================
case "merampok":
case "rampok": {
if (!m.isGroup) return reply(mess.group);
if (requireRegister(m.sender, reply, prefix)) return;

const dapat = Math.floor(Math.random() * 100000);
const users = global.db.data.users;
const who = m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null);

if (!who) {
return reply("Tag orang yang mau kamu Rampok!");
}

if (typeof users[who] == "undefined") {
return reply("Pengguna tidak ada didalam database");
}

if (!users[who].registered) {
return reply("Target belum terdaftar di RPG!");
}

const user = getRpgUser(m.sender);

if (users[who].level > user.level) {
return vinss.sendMessage(m.chat, {
text: `Level kamu harus lebih tinggi dari @${who.split("@")[0]} Untuk bisa merampoknya!`,
mentions: [who]
}, { quoted: m });
}

const COOLDOWN = 3600000;
const cd = checkCooldown(user, "lastrampok", COOLDOWN);

if (!cd.ready) {
return reply(`Anda Sudah merampok dan berhasil sembunyi, tunggu ${clockString(cd.sisa)} untuk merampok lagi`);
}

if (users[who].money < 10000) {
return reply("ᴛᴀʀɢᴇᴛ ɢᴀᴀᴅᴀ 💰ᴜᴀɴɢ ʙᴏᴅᴏʜ, ᴋɪꜱᴍɪɴ ᴅɪᴀ");
}

users[who].money -= dapat;
user.money += dapat;
user.lastrampok = Date.now();
reply(`ʙᴇʀʜᴀꜱɪʟ ᴍᴇʀᴀᴍᴘᴏᴋ ᴍᴏɴᴇʏ ᴛᴀʀɢᴇᴛ ꜱᴇʙᴀꜱᴀʀ 💰${dapat}`);
}
break;

// =================== BERDAGANG ===================
case "berdagang": {
if (!m.isGroup) return reply(mess.group);
if (requireRegister(m.sender, reply, prefix)) return;

const dapat = Math.floor(Math.random() * 5000);
const who = m.mentionedJid[0] ? m.mentionedJid[0] : null;

if (!who) {
return reply("Tag salah satu lah, yang kamu ingin berdagang bareng");
}

const users = global.db.data.users;
if (typeof users[who] == "undefined") {
return reply("Pengguna tidak ada didalam data base");
}

if (!users[who].registered) {
return reply("Target belum terdaftar di RPG!");
}

const user = getRpgUser(m.sender);
const COOLDOWN = 28800000;
const cd = checkCooldown(user, "lastdagang", COOLDOWN);

if (!cd.ready) {
return reply(`Anda Sudah Berdagang, tunggu ${clockString(cd.sisa)} lagi..`);
}

if (users[who].money < 4999) {
return reply("Target tidak memiliki modal harap masukkan modal 5000");
}
if (user.money < 4999) {
return reply("Kamu tidak memiliki modal harap masukkan modal 5000");
}

users[who].money -= dapat;
user.money -= dapat;
user.lastdagang = Date.now();

reply(`Mohon tunggu kak..\nKamu dan @${who.replace(/@.+/, "")} sedang berdagang.. 😅\n\nKamu dan @${who.replace(/@.+/, "")} meletakkan modal -${dapat} 😅`);

setTimeout(() => {
user.money += 50000;
users[who].money += 50000;
vinss.sendMessage(m.chat, {
text: `Selamat kamu dan @${who.replace(/@.+/, "")} mendapatkan money..\n\nPenghasilan dagang kamu didapatkan +50000\n${user.money} Money kamu\n\nPenghasilan dagang @${who.replace(/@.+/, "")} didapatkan +50000\n${users[who].money} Money @${who.replace(/@.+/, "")}`,
mentions: [m.sender, who]
}, { quoted: m });
}, 3600000);
}
break;

// =================== LEADERBOARD ===================
case "leaderboard":
case "lb": {
if (!m.isGroup) return reply(mess.group);
if (requireRegister(m.sender, reply, prefix)) return;

const leaderboards = ["level", "exp", "limit", "money", "iron", "gold", "diamond", "emerald", "trash", "joinlimit", "potion", "petFood", "wood", "rock", "string", "common", "uncommon", "mythic", "legendary", "pet", "bank", "chip", "skata"];

const usersArr = Object.entries(global.db.data.users)
.filter(([_, v]) => v && v.registered)
.map(([key, value]) => ({ ...value, jid: key }));

const leaderboard = leaderboards.filter(v => v && usersArr.filter(user => user && user[v]).length);
const type = (args[0] || "").toLowerCase();

const wrong = `🔖 ᴛʏᴩᴇ ʟɪsᴛ :\n${leaderboard.map(v => `\n⮕ ${rpgEmoji[v] || "📊"} - ${v}`).trim()}\n––––––––––––––––––––––––\n💁🏻‍♂ ᴛɪᴩ :\n⮕ ᴛᴏ ᴠɪᴇᴡ ᴅɪғғᴇʀᴇɴᴛ ʟᴇᴀᴅᴇʀʙᴏᴀʀᴅ:\n${prefix + command} [type]\n★ ᴇxᴀᴍᴩʟᴇ:\n${prefix + command} legendary`.trim();

if (!leaderboard.includes(type)) {
return reply("*––––『 𝙻𝙴𝙰𝙳𝙴𝚁𝙱𝙾𝙰𝚁𝙳 』––––*\n" + wrong);
}

const sortedItem = usersArr
.map(u => ({ ...u, [type]: u[type] === undefined ? 0 : u[type] }))
.sort((a, b) => b[type] - a[type]);

const userItem = sortedItem.map(u => u.jid);
const myRank = userItem.indexOf(m.sender) + 1;

const listTop = sortedItem.slice(0, 10).map((user, i) => {
const isMember = participants.some(p => p.id === user.jid);
const name = user.registered ? user.name : user.jid.split("@")[0];
return `${i + 1}.*﹙${user[type]}﹚*- ${name}`;
}).join("\n\n");

const text = `🏆 ʀᴀɴᴋ: ${myRank} ᴏᴜᴛ ᴏғ ${userItem.length}\n\n*• ${rpgEmoji[type] || "📊"} ${type} •*\n\n${listTop}`.trim();

return vinss.sendMessage(m.chat, {
text,
mentions: sortedItem.slice(0, 10).map(u => u.jid)
}, { quoted: m });
}
break;

// =================== FIGHT NAGA ===================
case "fightnaga":
case "perangnaga": {
if (!m.isGroup) return reply(mess.group);
if (requireRegister(m.sender, reply, prefix)) return;

global.fightnaga = global.fightnaga || {};
if (global.fightnaga[m.sender]) {
return reply(`*Tidak bisa melakukan battle ⚔️ karena Arena yang kamu miliki dipakai untuk fight pet mu yg lain.*`);
}

const user = getRpgUser(m.sender);
const usersIds = participants.map(a => a.id);
let lawan;
lawan = usersIds[Math.floor(usersIds.length * Math.random())];
let tries = 0;
while ((typeof global.db.data.users[lawan] == "undefined" || lawan == m.sender || !global.db.data.users[lawan]?.registered) && tries < 20) {
lawan = usersIds[Math.floor(usersIds.length * Math.random())];
tries++;
}

if (tries >= 20 || !lawan) {
return reply("❌ Tidak ada lawan yang terdaftar di RPG. Ajak temanmu daftar dulu!");
}

const userLawan = global.db.data.users[lawan];
const penumpan = ["mas mas", "bapak bapak", "cewe sma", "bocil epep", "emak emak"];
const penumpang = rpgPickRandom(penumpan);
const nogorojo = rpgPickRandom(penumpan);

const lamaPertarungan = Acakin(1, 3);

reply(`*Pet Kamu* (🐉naga ${nogorojo} ) ⚔️menantang 🐉naganya *${penumpang}* (🐉naga kamu ) lagi berkelahi.\n\nTunggu ${lamaPertarungan} menit lagi dan lihat siapa yg menang🎮.`);

global.fightnaga[m.sender] = true;
await sleep(lamaPertarungan * 60000);

const alasanKalah = ["Naikin lagi levelnya😐", "Cupu", "Kurang hebat", "Ampas Petnya", "Pet gembel"];
const alasanMenang = ["Hebat", "Pro", "Ganas Pet", "Legenda Pet", "Sangat Pro", "Rajin Ngasi Makan Pet"];

const kesempatan = [];
for (let i = 0; i < (user.naga || 0); i++) kesempatan.push(m.sender);
for (let i = 0; i < (userLawan.naga || 0); i++) kesempatan.push(lawan);

if (kesempatan.length === 0) {
delete global.fightnaga[m.sender];
return reply("❌ Kamu atau lawan tidak punya pet naga. Beli dulu di shop!");
}

let pointPemain = 0;
let pointLawan = 0;
for (let i = 0; i < 10; i++) {
const unggul = Acakin(0, kesempatan.length - 1);
if (kesempatan[unggul] == m.sender) pointPemain += 1;
else pointLawan += 1;
}

if (pointPemain > pointLawan) {
const hadiah = (pointPemain - pointLawan) * 20000;
user.money += hadiah;
user.tiketcoin = (user.tiketcoin || 0) + 1;
reply(`*${user.name}* [${pointPemain * 10}] - [${pointLawan * 10}] *${userLawan.name}*\n\n*Pet🐉Kamu* (naga ${user.naga}) MENANG melawan 🐉naganya *${userLawan.name}* (naga ${userLawan.naga}) karena naga🐉kamu ${rpgPickRandom(alasanMenang)}\n\nHadiah Rp. ${hadiah.toLocaleString()}\n+1 Tiketcoin`);
} else if (pointPemain < pointLawan) {
const denda = (pointLawan - pointPemain) * 100000;
user.money -= denda;
user.tiketcoin = (user.tiketcoin || 0) + 1;
reply(`*${user.name}* [${pointPemain * 10}] - [${pointLawan * 10}] *${userLawan.name}*\n\n*Pet🐉Kamu* (naga ${user.naga}) KALAH melawan 🐉naganya *${userLawan.name}* (naga ${userLawan.naga}) karena pet kamu ${rpgPickRandom(alasanKalah)}\n\nUang kamu berkurang Rp. ${denda.toLocaleString()}\n+1 Tiketcoin`);
} else {
reply(`*${user.name}* [${pointPemain * 10}] - [${pointLawan * 10}] *${userLawan.name}*\n\nHasil imbang kak, ga dapet apa apa 😂`);
}

delete global.fightnaga[m.sender];
}
break;

// =================== FIGHT KYUBI ===================
case "fightkyubi": {
if (!m.isGroup) return reply(mess.group);
if (requireRegister(m.sender, reply, prefix)) return;

global.fightnaga = global.fightnaga || {};
if (global.fightnaga[m.sender]) {
return reply(`*Tidak bisa melakukan battle ⚔️ karena Arena yang kamu miliki dipakai untuk fight pet mu yg lain.*`);
}

const user = getRpgUser(m.sender);
const usersIds = participants.map(u => u.id);
let lawan = usersIds[Math.floor(usersIds.length * Math.random())];
let tries = 0;
while ((typeof global.db.data.users[lawan] == "undefined" || lawan == m.sender || !global.db.data.users[lawan]?.registered) && tries < 20) {
lawan = usersIds[Math.floor(usersIds.length * Math.random())];
tries++;
}

if (tries >= 20 || !lawan) {
return reply("❌ Tidak ada lawan yang terdaftar di RPG. Ajak temanmu daftar dulu!");
}

const userLawan = global.db.data.users[lawan];
const penumpan = ["mas mas", "bapak bapak", "cewe sma", "bocil epep", "emak emak"];

const lamaPertarungan = Acakin(1, 3);

reply(`*Pet Kamu* (🦊kyubi ${rpgPickRandom(penumpan)}) ⚔️menantang 🦊kyubinya *${rpgPickRandom(penumpan)}* (🦊kyubi kamu) lagi berkelahi.\n\nTunggu ${lamaPertarungan} menit lagi dan lihat siapa yg menang🎮.`);

global.fightnaga[m.sender] = true;
await sleep(lamaPertarungan * 60000);

const alasanKalah = ["Naikin lagi levelnya😐", "Cupu", "Kurang hebat", "Ampas Petnya", "Pet gembel"];
const alasanMenang = ["Hebat", "Pro", "Ganas Pet", "Legenda Pet", "Sangat Pro", "Rajin Ngasi Makan Pet"];

const kesempatan = [];
for (let i = 0; i < (user.kyubi || 0); i++) kesempatan.push(m.sender);
for (let i = 0; i < (userLawan.kyubi || 0); i++) kesempatan.push(lawan);

if (kesempatan.length === 0) {
delete global.fightnaga[m.sender];
return reply("❌ Kamu atau lawan tidak punya pet kyubi. Beli dulu di shop!");
}

let pointPemain = 0, pointLawan = 0;
for (let i = 0; i < 10; i++) {
const unggul = Acakin(0, kesempatan.length - 1);
if (kesempatan[unggul] == m.sender) pointPemain += 1;
else pointLawan += 1;
}

if (pointPemain > pointLawan) {
const hadiah = (pointPemain - pointLawan) * 20000;
user.money += hadiah;
user.tiketcoin = (user.tiketcoin || 0) + 1;
reply(`*${user.name}* [${pointPemain * 10}] - [${pointLawan * 10}] *${userLawan.name}*\n\n*Pet🦊Kamu* (kyubi ${user.kyubi}) MENANG melawan 🦊kyubinya *${userLawan.name}* (kyubi ${userLawan.kyubi}) karena kyubi🦊kamu ${rpgPickRandom(alasanMenang)}\n\nHadiah Rp. ${hadiah.toLocaleString()}\n+1 Tiketcoin`);
} else if (pointPemain < pointLawan) {
const denda = (pointLawan - pointPemain) * 100000;
user.money -= denda;
user.tiketcoin = (user.tiketcoin || 0) + 1;
reply(`*${user.name}* [${pointPemain * 10}] - [${pointLawan * 10}] *${userLawan.name}*\n\n*Pet🦊Kamu* (kyubi ${user.kyubi}) KALAH melawan 🦊kyubinya *${userLawan.name}* (kyubi ${userLawan.kyubi}) karena pet kamu ${rpgPickRandom(alasanKalah)}\n\nUang kamu berkurang Rp. ${denda.toLocaleString()}\n+1 Tiketcoin`);
} else {
reply(`*${user.name}* [${pointPemain * 10}] - [${pointLawan * 10}] *${userLawan.name}*\n\nHasil imbang kak, ga dapet apa apa 😂`);
}

delete global.fightnaga[m.sender];
}
break;

// =================== FIGHT PHONIX ===================
case "fightphonix": {
if (!m.isGroup) return reply(mess.group);
if (requireRegister(m.sender, reply, prefix)) return;

global.fightnaga = global.fightnaga || {};
if (global.fightnaga[m.sender]) {
return reply(`*Tidak bisa melakukan battle ⚔️ karena Arena yang kamu miliki dipakai untuk fight pet mu yg lain.*`);
}

const user = getRpgUser(m.sender);
const usersIds = participants.map(u => u.id);
let lawan = usersIds[Math.floor(usersIds.length * Math.random())];
let tries = 0;
while ((typeof global.db.data.users[lawan] == "undefined" || lawan == m.sender || !global.db.data.users[lawan]?.registered) && tries < 20) {
lawan = usersIds[Math.floor(usersIds.length * Math.random())];
tries++;
}

if (tries >= 20 || !lawan) {
return reply("❌ Tidak ada lawan yang terdaftar di RPG. Ajak temanmu daftar dulu!");
}

const userLawan = global.db.data.users[lawan];
const penumpan = ["mas mas", "bapak bapak", "cewe sma", "bocil epep", "emak emak"];
const lamaPertarungan = Acakin(1, 3);

reply(`*Pet Kamu* (🦅phonix ${rpgPickRandom(penumpan)}) ⚔️menantang 🦅phonixnya *${rpgPickRandom(penumpan)}* (🦅phonix kamu) lagi berkelahi.\n\nTunggu ${lamaPertarungan} menit lagi dan lihat siapa yg menang🎮.`);

global.fightnaga[m.sender] = true;
await sleep(lamaPertarungan * 60000);

const alasanKalah = ["Naikin lagi levelnya😐", "Cupu", "Kurang hebat", "Ampas Petnya", "Pet gembel"];
const alasanMenang = ["Hebat", "Pro", "Ganas Pet", "Legenda Pet", "Sangat Pro", "Rajin Ngasi Makan Pet"];

const kesempatan = [];
for (let i = 0; i < (user.phonix || 0); i++) kesempatan.push(m.sender);
for (let i = 0; i < (userLawan.phonix || 0); i++) kesempatan.push(lawan);

if (kesempatan.length === 0) {
delete global.fightnaga[m.sender];
return reply("❌ Kamu atau lawan tidak punya pet phonix. Beli dulu di shop!");
}

let pointPemain = 0, pointLawan = 0;
for (let i = 0; i < 10; i++) {
const unggul = Acakin(0, kesempatan.length - 1);
if (kesempatan[unggul] == m.sender) pointPemain += 1;
else pointLawan += 1;
}

if (pointPemain > pointLawan) {
const hadiah = (pointPemain - pointLawan) * 20000;
user.money += hadiah;
user.tiketcoin = (user.tiketcoin || 0) + 1;
reply(`*${user.name}* [${pointPemain * 10}] - [${pointLawan * 10}] *${userLawan.name}*\n\n*Pet🦅Kamu* (phonix ${user.phonix}) MENANG melawan 🦅phonixnya *${userLawan.name}* (phonix ${userLawan.phonix}) karena phonix🦅kamu ${rpgPickRandom(alasanMenang)}\n\nHadiah Rp. ${hadiah.toLocaleString()}\n+1 Tiketcoin`);
} else if (pointPemain < pointLawan) {
const denda = (pointLawan - pointPemain) * 10000;
user.money -= denda;
user.tiketcoin = (user.tiketcoin || 0) + 1;
reply(`*${user.name}* [${pointPemain * 10}] - [${pointLawan * 10}] *${userLawan.name}*\n\n*Pet🦅Kamu* (phonix ${user.phonix}) KALAH melawan 🦅phonixnya *${userLawan.name}* (phonix ${userLawan.phonix}) karena pet kamu ${rpgPickRandom(alasanKalah)}\n\nUang kamu berkurang Rp. ${denda.toLocaleString()}\n+1 Tiketcoin`);
} else {
reply(`*${user.name}* [${pointPemain * 10}] - [${pointLawan * 10}] *${userLawan.name}*\n\nHasil imbang kak, ga dapet apa apa 😂`);
}

delete global.fightnaga[m.sender];
}
break;

// =================== FIGHT KUCING ===================
case "fightkucing": {
if (!m.isGroup) return reply(mess.group);
if (requireRegister(m.sender, reply, prefix)) return;

global.fightnaga = global.fightnaga || {};
if (global.fightnaga[m.sender]) {
return reply(`*Tidak bisa melakukan battle karena arena yg kamu miliki sedang kamu pakai.*`);
}

const user = getRpgUser(m.sender);
const usersIds = participants.map(u => u.id);
let lawan = usersIds[Math.floor(usersIds.length * Math.random())];
let tries = 0;
while ((typeof global.db.data.users[lawan] == "undefined" || lawan == m.sender || !global.db.data.users[lawan]?.registered) && tries < 20) {
lawan = usersIds[Math.floor(usersIds.length * Math.random())];
tries++;
}

if (tries >= 20 || !lawan) {
return reply("❌ Tidak ada lawan yang terdaftar di RPG. Ajak temanmu daftar dulu!");
}

const userLawan = global.db.data.users[lawan];
const penumpan = ["mas mas", "bapak bapak", "cewe sma", "bocil epep", "emak emak"];
const lamaPertarungan = Acakin(1, 3);

reply(`*Pet Kamu* (🐱kucing ${rpgPickRandom(penumpan)}) menantang 🐈kucingnya *${rpgPickRandom(penumpan)}* (🐱kucing kamu) lagi kelahi rebutin bini.\n\nTunggu ${lamaPertarungan} menit lagi dan lihat siapa yg menang🎮.`);

global.fightnaga[m.sender] = true;
await sleep(lamaPertarungan * 60000);

const alasanKalah = ["Naikin lagi levelnya😐", "Cupu", "Kurang hebat", "Ampas Petnya", "Pet gembel"];
const alasanMenang = ["Hebat", "Pro", "Ganas Pet", "Legenda Pet", "Sangat Pro", "Rajin Ngasi Makan Pet"];

const kesempatan = [];
for (let i = 0; i < (user.kucing || 0); i++) kesempatan.push(m.sender);
for (let i = 0; i < (userLawan.kucing || 0); i++) kesempatan.push(lawan);

if (kesempatan.length === 0) {
delete global.fightnaga[m.sender];
return reply("❌ Kamu atau lawan tidak punya pet kucing. Beli dulu di shop!");
}

let pointPemain = 0, pointLawan = 0;
for (let i = 0; i < 10; i++) {
const unggul = Acakin(0, kesempatan.length - 1);
if (kesempatan[unggul] == m.sender) pointPemain += 1;
else pointLawan += 1;
}

if (pointPemain > pointLawan) {
const hadiah = (pointPemain - pointLawan) * 20000;
user.money += hadiah;
user.tiketcoin = (user.tiketcoin || 0) + 1;
reply(`*${user.name}* [${pointPemain * 10}] - [${pointLawan * 10}] *${userLawan.name}*\n\n*Pet🐈Kamu* (kucing ${user.kucing}) MENANG melawan 🐈kucingnya *${userLawan.name}* (kucing ${userLawan.kucing}) karena kucing🐈kamu ${rpgPickRandom(alasanMenang)}\n\nHadiah Rp. ${hadiah.toLocaleString()}\n+1 Tiketcoin`);
} else if (pointPemain < pointLawan) {
const denda = (pointLawan - pointPemain) * 100000;
user.money -= denda;
user.tiketcoin = (user.tiketcoin || 0) + 1;
reply(`*${user.name}* [${pointPemain * 10}] - [${pointLawan * 10}] *${userLawan.name}*\n\n*Pet🐈Kamu* (kucing ${user.kucing}) KALAH melawan 🐈kucingnya *${userLawan.name}* (kucing ${userLawan.kucing}) karena pet kamu ${rpgPickRandom(alasanKalah)}\n\nUang kamu berkurang Rp. ${denda.toLocaleString()}\n+1 Tiketcoin`);
} else {
reply(`*${user.name}* [${pointPemain * 10}] - [${pointLawan * 10}] *${userLawan.name}*\n\nHasil imbang kak, ga dapet apa apa 😂`);
}

delete global.fightnaga[m.sender];
}
break;

// =================== FIGHT GRIFFIN ===================
case "fightgriffin": {
if (!m.isGroup) return reply(mess.group);
if (requireRegister(m.sender, reply, prefix)) return;

global.fightnaga = global.fightnaga || {};
if (global.fightnaga[m.sender]) {
return reply(`*Tidak bisa melakukan battle ⚔️ karena Arena yang kamu miliki dipakai untuk fight pet mu yg lain.*`);
}

const user = getRpgUser(m.sender);
const usersIds = participants.map(u => u.id);
let lawan = usersIds[Math.floor(usersIds.length * Math.random())];
let tries = 0;
while ((typeof global.db.data.users[lawan] == "undefined" || lawan == m.sender || !global.db.data.users[lawan]?.registered) && tries < 20) {
lawan = usersIds[Math.floor(usersIds.length * Math.random())];
tries++;
}

if (tries >= 20 || !lawan) {
return reply("❌ Tidak ada lawan yang terdaftar di RPG. Ajak temanmu daftar dulu!");
}

const userLawan = global.db.data.users[lawan];
const penumpan = ["mas mas", "bapak bapak", "cewe sma", "bocil epep", "emak emak"];
const lamaPertarungan = Acakin(1, 3);

reply(`*Pet Kamu* (🦚griffin ${rpgPickRandom(penumpan)}) ⚔️menantang 🦚griffinnya *${rpgPickRandom(penumpan)}* (🦚griffin kamu) lagi berkelahi.\n\nTunggu ${lamaPertarungan} menit lagi dan lihat siapa yg menang🎮.`);

global.fightnaga[m.sender] = true;
await sleep(lamaPertarungan * 60000);

const alasanKalah = ["Naikin lagi levelnya😐", "Cupu", "Kurang hebat", "Ampas Petnya", "Pet gembel"];
const alasanMenang = ["Hebat", "Pro", "Ganas Pet", "Legenda Pet", "Sangat Pro", "Rajin Ngasi Makan Pet"];

const kesempatan = [];
for (let i = 0; i < (user.griffin || 0); i++) kesempatan.push(m.sender);
for (let i = 0; i < (userLawan.griffin || 0); i++) kesempatan.push(lawan);

if (kesempatan.length === 0) {
delete global.fightnaga[m.sender];
return reply("❌ Kamu atau lawan tidak punya pet griffin. Beli dulu di shop!");
}

let pointPemain = 0, pointLawan = 0;
for (let i = 0; i < 10; i++) {
const unggul = Acakin(0, kesempatan.length - 1);
if (kesempatan[unggul] == m.sender) pointPemain += 1;
else pointLawan += 1;
}

if (pointPemain > pointLawan) {
const hadiah = (pointPemain - pointLawan) * 20000;
user.money += hadiah;
user.tiketcoin = (user.tiketcoin || 0) + 1;
reply(`*${user.name}* [${pointPemain * 10}] - [${pointLawan * 10}] *${userLawan.name}*\n\n*Pet🦚Kamu* (griffin ${user.griffin}) MENANG melawan 🦚griffinnya *${userLawan.name}* (griffin ${userLawan.griffin}) karena griffin🦚kamu ${rpgPickRandom(alasanMenang)}\n\nHadiah Rp. ${hadiah.toLocaleString()}\n+1 Tiketcoin`);
} else if (pointPemain < pointLawan) {
const denda = (pointLawan - pointPemain) * 100000;
user.money -= denda;
user.tiketcoin = (user.tiketcoin || 0) + 1;
reply(`*${user.name}* [${pointPemain * 10}] - [${pointLawan * 10}] *${userLawan.name}*\n\n*Pet🦚Kamu* (griffin ${user.griffin}) KALAH melawan 🦚griffinnya *${userLawan.name}* (griffin ${userLawan.griffin}) karena pet kamu ${rpgPickRandom(alasanKalah)}\n\nUang kamu berkurang Rp. ${denda.toLocaleString()}\n+1 Tiketcoin`);
} else {
reply(`*${user.name}* [${pointPemain * 10}] - [${pointLawan * 10}] *${userLawan.name}*\n\nHasil imbang kak, ga dapet apa apa 😂`);
}

delete global.fightnaga[m.sender];
}
break;

// =================== FIGHT CENTAUR ===================
case "fightcentaur":
case "perangcentaur": {
if (!m.isGroup) return reply(mess.group);
if (requireRegister(m.sender, reply, prefix)) return;

global.fightnaga = global.fightnaga || {};
if (global.fightnaga[m.sender]) {
return reply(`*Tidak bisa melakukan battle ⚔️ karena Arena yang kamu miliki dipakai untuk fight pet mu yg lain.*`);
}

const user = getRpgUser(m.sender);
const usersIds = participants.map(u => u.id);
let lawan = usersIds[Math.floor(usersIds.length * Math.random())];
let tries = 0;
while ((typeof global.db.data.users[lawan] == "undefined" || lawan == m.sender || !global.db.data.users[lawan]?.registered) && tries < 20) {
lawan = usersIds[Math.floor(usersIds.length * Math.random())];
tries++;
}

if (tries >= 20 || !lawan) {
return reply("❌ Tidak ada lawan yang terdaftar di RPG. Ajak temanmu daftar dulu!");
}

const userLawan = global.db.data.users[lawan];
const penumpan = ["mas mas", "bapak bapak", "cewe sma", "bocil epep", "emak emak"];
const lamaPertarungan = Acakin(1, 3);

reply(`*Pet Kamu* (🐴centaur ${rpgPickRandom(penumpan)}) ⚔️menantang 🐴centaurnya *${rpgPickRandom(penumpan)}* (🐴centaur kamu) lagi berkelahi.\n\nTunggu ${lamaPertarungan} menit lagi dan lihat siapa yg menang🎮.`);

global.fightnaga[m.sender] = true;
await sleep(lamaPertarungan * 60000);

const alasanKalah = ["Naikin lagi levelnya😐", "Cupu", "Kurang hebat", "Ampas Petnya", "Pet gembel"];
const alasanMenang = ["Hebat", "Pro", "Ganas Pet", "Legenda Pet", "Sangat Pro", "Rajin Ngasi Makan Pet"];

const kesempatan = [];
for (let i = 0; i < (user.centaur || 0); i++) kesempatan.push(m.sender);
for (let i = 0; i < (userLawan.centaur || 0); i++) kesempatan.push(lawan);

if (kesempatan.length === 0) {
delete global.fightnaga[m.sender];
return reply("❌ Kamu atau lawan tidak punya pet centaur. Beli dulu di shop!");
}

let pointPemain = 0, pointLawan = 0;
for (let i = 0; i < 10; i++) {
const unggul = Acakin(0, kesempatan.length - 1);
if (kesempatan[unggul] == m.sender) pointPemain += 1;
else pointLawan += 1;
}

if (pointPemain > pointLawan) {
const hadiah = (pointPemain - pointLawan) * 20000;
user.money += hadiah;
user.tiketcoin = (user.tiketcoin || 0) + 1;
reply(`*${user.name}* [${pointPemain * 10}] - [${pointLawan * 10}] *${userLawan.name}*\n\n*Pet🐴Kamu* (centaur ${user.centaur}) MENANG melawan 🐴centaurnya *${userLawan.name}* (centaur ${userLawan.centaur}) karena centaur🐴kamu ${rpgPickRandom(alasanMenang)}\n\nHadiah Rp. ${hadiah.toLocaleString()}\n+1 Tiketcoin`);
} else if (pointPemain < pointLawan) {
const denda = (pointLawan - pointPemain) * 100000;
user.money -= denda;
user.tiketcoin = (user.tiketcoin || 0) + 1;
reply(`*${user.name}* [${pointPemain * 10}] - [${pointLawan * 10}] *${userLawan.name}*\n\n*Pet🐴Kamu* (centaur ${user.centaur}) KALAH melawan 🐴centaurnya *${userLawan.name}* (centaur ${userLawan.centaur}) karena pet kamu ${rpgPickRandom(alasanKalah)}\n\nUang kamu berkurang Rp. ${denda.toLocaleString()}\n+1 Tiketcoin`);
} else {
reply(`*${user.name}* [${pointPemain * 10}] - [${pointLawan * 10}] *${userLawan.name}*\n\nHasil imbang kak, ga dapet apa apa 😂`);
}

delete global.fightnaga[m.sender];
}
break;

// ═══════════════════════════════════════════════════════
//SEARCH MENU
// ═══════════════════════════════════════════════════════

// =================== APPLE MUSIC SEARCH ===================
case "applemusic":
case "ams":
case "applesearch": {
if (!text) return example("Kau masih kekasihku")

await vinss.sendMessage(m.chat, { react: { text: "🍎", key: m.key } })

try {
const { data } = await axios.get(
`https://api.deline.web.id/search/applemusic?q=${encodeURIComponent(text)}`,
{ timeout: 30000 }
)

if (!data.status || !data.result || !data.result.length) {
return m.reply("❌ Tidak ada hasil ditemukan.")
}

let teks = `🍎 *APPLE MUSIC SEARCH*\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n`
teks += `🔍 *Query:* ${text}\n`
teks += `📊 *Hasil:* ${data.result.length}\n\n`

data.result.slice(0, 10).forEach((song, i) => {
teks += `*${i + 1}. ${song.title}*\n`
teks += `👤 ${song.artist?.name || '-'}\n`
teks += `🔗 ${song.song}\n\n`
})

if (data.result.length > 10) {
teks += `_...dan ${data.result.length - 10} hasil lainnya_`
}

return vinss.sendMessage(m.chat, {
text: teks,
contextInfo: previewAd({
title: `🍎 Apple Music Search`,
body: `${text} - ${data.result.length} hasil`,
thumbnail: global.img,
sourceUrl: global.web,
mention: [m.sender],
forward: true,
})
}, { quoted: m })

} catch (err) {
console.error("applemusic error:", err)
m.reply(`❌ Gagal mencari: ${err.message}`)
}
}
break

// =================== HAPPYMOD SEARCH ===================
case "happymodsearch":
case "hms": {
if (!text) return example("kinemaster")

await vinss.sendMessage(m.chat, { react: { text: "🔍", key: m.key } })

try {
const { data } = await axios.get(
`https://api.deline.web.id/search/happymod?q=${encodeURIComponent(text)}`,
{ timeout: 30000 }
)

if (!data.status || !data.result || !data.result.length) {
return m.reply("❌ Aplikasi tidak ditemukan.")
}

let teks = `📦 *HAPPYMOD SEARCH*\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n`
teks += `🔍 *Query:* ${text}\n`
teks += `📊 *Hasil:* ${data.result.length}\n\n`

data.result.slice(0, 10).forEach((app, i) => {
teks += `*${i + 1}. ${app.title}*\n`
teks += `📱 Package: ${app.package || '-'}\n`
teks += `🏷️ Versi: ${app.version || '-'}\n`
teks += `💾 Size: ${app.size || '-'}\n`
teks += `⭐ Mod: ${app.modInfo || 'Original'}\n`
teks += `🔗 ${app.page_dl}\n\n`
})

return vinss.sendMessage(m.chat, {
text: teks,
contextInfo: previewAd({
title: `📦 HappyMod Search`,
body: `${text} - ${data.result.length} hasil`,
thumbnail: global.img,
sourceUrl: global.web,
mention: [m.sender],
forward: true,
})
}, { quoted: m })

} catch (err) {
console.error("happymodsearch error:", err)
m.reply(`❌ Gagal mencari: ${err.message}`)
}
}
break

// =================== JOBSTREET SEARCH ===================
case "jobstreet":
case "lowongan": {
if (!text) return example("satpam | Jakarta")

// Format: query | city
const [query, city] = text.split("|").map(s => s?.trim())
if (!query) return example("satpam | Jakarta")

const kota = city || "Jakarta"

await vinss.sendMessage(m.chat, { react: { text: "💼", key: m.key } })

try {
const { data } = await axios.get(
`https://api.deline.web.id/search/jobstreet?q=${encodeURIComponent(query)}&city=${encodeURIComponent(kota)}`,
{ timeout: 30000 }
)

if (!data.status || !data.result || !data.result.length) {
return m.reply("❌ Lowongan tidak ditemukan.")
}

let teks = `💼 *JOBSTREET SEARCH*\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n`
teks += `🔍 *Posisi:* ${query}\n`
teks += `📍 *Kota:* ${kota}\n`
teks += `📊 *Hasil:* ${data.result.length}\n\n`

data.result.slice(0, 10).forEach((job, i) => {
teks += `*${i + 1}. ${job.judul}*\n`
teks += `🏢 ${job.perusahaan}\n`
teks += `📍 ${job.lokasi}\n`
teks += `💰 ${job.gaji}\n`
teks += `📅 ${job.tanggal}\n`
teks += `🔗 ${job.link}\n\n`
})

return vinss.sendMessage(m.chat, {
text: teks,
contextInfo: previewAd({
title: `💼 JobStreet Search`,
body: `${query} di ${kota}`,
thumbnail: global.img,
sourceUrl: global.web,
mention: [m.sender],
forward: true,
})
}, { quoted: m })

} catch (err) {
console.error("jobstreet error:", err)
m.reply(`❌ Gagal mencari: ${err.message}`)
}
}
break

// =================== NPM SEARCH ===================
case "npmsearch":
case "npms": {
if (!text) return example("whiskeysockets")

await vinss.sendMessage(m.chat, { react: { text: "📦", key: m.key } })

try {
const { data } = await axios.get(
`https://api.deline.web.id/search/npm?q=${encodeURIComponent(text)}`,
{ timeout: 30000 }
)

if (!data.status || !data.result || !data.result.length) {
return m.reply("❌ Package tidak ditemukan.")
}

let teks = `📦 *NPM SEARCH*\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n`
teks += `🔍 *Query:* ${text}\n`
teks += `📊 *Hasil:* ${data.result.length}\n\n`

data.result.slice(0, 10).forEach((pkg, i) => {
teks += `*${i + 1}. ${pkg.name}*\n`
teks += `🏷️ Versi: ${pkg.version}\n`
teks += `📝 ${pkg.description?.slice(0, 100) || '-'}\n`
teks += `🔗 ${pkg.links?.npm || '-'}\n\n`
})

return vinss.sendMessage(m.chat, {
text: teks,
contextInfo: previewAd({
title: `📦 NPM Search`,
body: `${text} - ${data.result.length} hasil`,
thumbnail: global.img,
sourceUrl: global.web,
mention: [m.sender],
forward: true,
})
}, { quoted: m })

} catch (err) {
console.error("npmsearch error:", err)
m.reply(`❌ Gagal mencari: ${err.message}`)
}
}
break

// =================== PINTEREST SEARCH ===================
case "pinterest":
case "pin": {
if (!text) return example("Raizel")

await vinss.sendMessage(m.chat, { react: { text: "📌", key: m.key } })

try {
const { data } = await axios.get(
`https://api.deline.web.id/search/pinterest?q=${encodeURIComponent(text)}`,
{ timeout: 30000 }
)

if (!data.status || !data.data || !data.data.length) {
return m.reply("❌ Gambar tidak ditemukan.")
}

const images = data.data.slice(0, 5)

await m.reply(`📌 *PINTEREST SEARCH*\n🔍 *Query:* ${text}\n📊 Mengirim ${images.length} gambar...`)

for (const img of images) {
try {
await vinss.sendMessage(m.chat, {
image: { url: img.image },
caption: `📌 *${img.caption || 'No caption'}*\n👤 ${img.fullname || img.uploader || '-'}\n🔗 ${img.source}`
}, { quoted: m })
await sleep(1500)
} catch (e) {
console.error("pinterest img error:", e.message)
}
}

} catch (err) {
console.error("pinterest error:", err)
m.reply(`❌ Gagal mencari: ${err.message}`)
}
}
break

// =================== PLAY STORE SEARCH ===================
case "playstore":
case "pssearch": {
if (!text) return example("kinemaster")

await vinss.sendMessage(m.chat, { react: { text: "🎮", key: m.key } })

try {
const { data } = await axios.get(
`https://api.deline.web.id/search/playstore?q=${encodeURIComponent(text)}`,
{ timeout: 30000 }
)

if (!data.status || !data.result || !data.result.length) {
return m.reply("❌ Aplikasi tidak ditemukan.")
}

let teks = `🎮 *PLAY STORE SEARCH*\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n`
teks += `🔍 *Query:* ${text}\n`
teks += `📊 *Hasil:* ${data.result.length}\n\n`

data.result.slice(0, 10).forEach((app, i) => {
teks += `*${i + 1}. ${app.nama}*\n`
teks += `👨‍💻 ${app.developer}\n`
teks += `⭐ ${app.rate2} / 5.0\n`
teks += `🔗 ${app.link}\n\n`
})

return vinss.sendMessage(m.chat, {
text: teks,
contextInfo: previewAd({
title: `🎮 Play Store Search`,
body: `${text} - ${data.result.length} hasil`,
thumbnail: global.img,
sourceUrl: global.web,
mention: [m.sender],
forward: true,
})
}, { quoted: m })

} catch (err) {
console.error("playstore error:", err)
m.reply(`❌ Gagal mencari: ${err.message}`)
}
}
break

// =================== SNACKVIDEO SEARCH ===================
case "snackvideo":
case "svsearch": {
if (!text) return example("username")

await vinss.sendMessage(m.chat, { react: { text: "📱", key: m.key } })

try {
const { data } = await axios.get(
`https://api.deline.web.id/search/snackvideo?username=${encodeURIComponent(text)}`,
{ timeout: 30000 }
)

if (!data.status) {
return m.reply("❌ Gagal mengambil data.")
}

if (!data.result?.videos?.length) {
return m.reply(`📭 *Tidak ada video ditemukan*\n\n👤 Username: ${text}\n\n_Mungkin akun private atau username salah._`)
}

let teks = `📱 *SNACKVIDEO SEARCH*\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n`
teks += `👤 *Username:* ${text}\n`
teks += `📊 *Video:* ${data.result.videos.length}\n\n`

data.result.videos.slice(0, 10).forEach((vid, i) => {
teks += `*${i + 1}.* ${vid.title || 'Untitled'}\n`
teks += `🔗 ${vid.url || '-'}\n\n`
})

return reply(teks)

} catch (err) {
console.error("snackvideo error:", err)
m.reply(`❌ Gagal mencari: ${err.message}`)
}
}
break

// =================== WEBTOON SEARCH ===================
case "webtoon":
case "wts": {
if (!text) return example("lookism")

await vinss.sendMessage(m.chat, { react: { text: "📖", key: m.key } })

try {
const { data } = await axios.get(
`https://api.deline.web.id/search/webtoon?q=${encodeURIComponent(text)}`,
{ timeout: 30000 }
)

if (!data.status || !data.result) {
return m.reply("❌ Webtoon tidak ditemukan.")
}

const original = data.result.original || []
const canvas = data.result.canvas || []

if (!original.length && !canvas.length) {
return m.reply("❌ Webtoon tidak ditemukan.")
}

let teks = `📖 *WEBTOON SEARCH*\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n`
teks += `🔍 *Query:* ${text}\n\n`

if (original.length) {
teks += `🎨 *ORIGINAL (${original.length}):*\n\n`
original.slice(0, 5).forEach((w, i) => {
teks += `*${i + 1}. ${w.title}*\n`
teks += `✍️ ${w.author}\n`
teks += `👁️ ${w.viewCount}\n`
teks += `🔗 ${w.link}\n\n`
})
}

if (canvas.length) {
teks += `\n🎭 *CANVAS (${canvas.length}):*\n\n`
canvas.slice(0, 5).forEach((w, i) => {
teks += `*${i + 1}. ${w.title}*\n`
teks += `✍️ ${w.author}\n`
teks += `👁️ ${w.viewCount}\n`
teks += `🔗 ${w.link}\n\n`
})
}

// Kirim dengan thumbnail webtoon pertama
const firstImage = original[0]?.image || canvas[0]?.image

if (firstImage) {
return vinss.sendMessage(m.chat, {
image: { url: firstImage },
caption: teks,
}, { quoted: m })
}

return reply(teks)

} catch (err) {
console.error("webtoon error:", err)
m.reply(`❌ Gagal mencari: ${err.message}`)
}
}
break

// =================== WHATSAPP GROUP SEARCH ===================
case "grubwa":
case "grupwa":
case "wagroup": {
if (!text) return example("ML indonesia")

await vinss.sendMessage(m.chat, { react: { text: "💬", key: m.key } })

try {
const { data } = await axios.get(
`https://api.deline.web.id/search/grubwa?q=${encodeURIComponent(text)}`,
{ timeout: 30000 }
)

if (!data.status || !data.result || !data.result.length) {
return m.reply("❌ Grup tidak ditemukan.")
}

let teks = `💬 *WHATSAPP GROUP SEARCH*\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n`
teks += `🔍 *Keyword:* ${text}\n`
teks += `📊 *Total:* ${data.total || data.result.length} grup\n\n`

data.result.slice(0, 10).forEach((grp, i) => {
teks += `*${i + 1}. ${grp.Name}*\n`
teks += `📝 ${grp.Description || '-'}\n`
teks += `🔗 ${grp.Link}\n\n`
})

return vinss.sendMessage(m.chat, {
text: teks,
contextInfo: previewAd({
title: `💬 WhatsApp Group Search`,
body: `${text} - ${data.result.length} grup`,
thumbnail: global.img,
sourceUrl: global.web,
mention: [m.sender],
forward: true,
})
}, { quoted: m })

} catch (err) {
console.error("grubwa error:", err)
m.reply(`❌ Gagal mencari: ${err.message}`)
}
}
break

// =================== YOUTUBE SEARCH ===================
case "yts":
case "youtubesearch": {
if (!text) return example("Kau masih kekasihku")

await vinss.sendMessage(m.chat, { react: { text: "▶️", key: m.key } })

try {
const { data } = await axios.get(
`https://api.deline.web.id/search/youtube?q=${encodeURIComponent(text)}`,
{ timeout: 30000 }
)

if (!data.status || !data.result || !data.result.length) {
return m.reply("❌ Video tidak ditemukan.")
}

let teks = `▶️ *YOUTUBE SEARCH*\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n`
teks += `🔍 *Query:* ${text}\n`
teks += `📊 *Hasil:* ${data.result.length}\n\n`

data.result.slice(0, 10).forEach((vid, i) => {
teks += `*${i + 1}. ${vid.title}*\n`
teks += `📺 ${vid.channel}\n`
teks += `⏱️ ${vid.duration}\n`
teks += `🔗 ${vid.link}\n\n`
})

const thumb = data.result[0]?.imageUrl

if (thumb) {
return vinss.sendMessage(m.chat, {
image: { url: thumb },
caption: teks,
}, { quoted: m })
}

return reply(teks)

} catch (err) {
console.error("yts error:", err)
m.reply(`❌ Gagal mencari: ${err.message}`)
}
}
break

case "ytshorts":
case "shorts":
case "short": {
if (!text) return example("Lucu\n\nContoh:\n.ytshorts Lucu\n.ytshorts Motivasi")

await vinss.sendMessage(m.chat, { react: { text: "📱", key: m.key } })

const processMsg = await vinss.sendMessage(m.chat, {
text: `⏳ *Mencari YouTube Shorts...*\n🔍 Query: ${text}`
}, { quoted: m })

try {
const { data } = await axios.get(
`https://api.azbry.com/api/search/ytshorts?q=${encodeURIComponent(text)}`,
{ timeout: 60000 }
)

if (!data.status || !data.result) {
return vinss.sendMessage(m.chat, {
text: `❌ *Tidak ada Shorts ditemukan!*\n\n🔍 Query: ${text}`,
edit: processMsg.key
})
}

const r = data.result

const cap =
`📱 *YOUTUBE SHORTS*\n` +
`━━━━━━━━━━━━━━━━━━━━━━\n` +
`🎬 *Judul:* ${r.title || '-'}\n` +
`👁️ *Views:* ${r.views || '-'}\n` +
`🔗 *URL:* ${r.url || '-'}\n` +
`📌 *Type:* ${r.isShort ? 'YouTube Shorts' : 'Video'}\n` +
`━━━━━━━━━━━━━━━━━━━━━━\n\n` +
`_Sumber: YouTube Shorts + Savetube_`

// Kirim video
if (r.videoUrl) {
await vinss.sendMessage(m.chat, {
video: { url: r.videoUrl },
caption: cap,
contextInfo: previewAd({
title: r.title || 'YouTube Shorts',
body: r.views || 'YouTube Shorts',
thumbnail: r.thumbnail || global.img,
sourceUrl: r.url,
mention: [m.sender],
forward: true,
largerThumbnail: true,
})
}, { quoted: m })
} else if (r.thumbnail) {
// Fallback kalau video gagal
await vinss.sendMessage(m.chat, {
image: { url: r.thumbnail },
caption: cap
}, { quoted: m })
}

await vinss.sendMessage(m.chat, { delete: processMsg.key })

} catch (err) {
console.error("ytshorts error:", err)
await vinss.sendMessage(m.chat, {
text: `❌ *Gagal mencari Shorts!*\n\n🔍 Query: ${text}\n📝 Error: ${err.message}`,
edit: processMsg.key
})
}
}
break

// =================== NETFLIX TOP 10 ===================
case "netflix":
case "nf":
case "netflixtop": {
const type = (args[0] || 'tv').toLowerCase()
const validTypes = ['tv', 'films', 'tv shows', 'films']

// Normalisasi type
let nfType = 'tv'
if (['films', 'film', 'movie'].includes(type)) {
nfType = 'films'
} else if (['tv', 'series', 'shows', 'tv shows'].includes(type)) {
nfType = 'tv'
} else {
return reply(
`📺 *NETFLIX TOP 10*\n` +
`━━━━━━━━━━━━━━━━━━━━━━\n\n` +
`🎯 *Pilihan Type:*\n` +
`*1.* TV Shows → \`.netflix tv\`\n` +
`*2.* Films → \`.netflix films\`\n\n` +
`📝 *Contoh:*\n` +
`\`.netflix tv\`\n` +
`\`.netflix films\``
)
}

await vinss.sendMessage(m.chat, { react: { text: "🎬", key: m.key } })

const processMsg = await vinss.sendMessage(m.chat, {
text: `⏳ *Mengambil Netflix Top 10...*\n📺 Type: ${nfType === 'tv' ? 'TV Shows' : 'Films'}`
}, { quoted: m })

try {
const { data } = await axios.get(
`https://api.azbry.com/api/search/netflix?type=${nfType}`,
{ timeout: 60000 }
)

if (!data.status || !data.result) {
return vinss.sendMessage(m.chat, {
text: `❌ *Gagal mengambil data Netflix!*`,
edit: processMsg.key
})
}

const result = data.result
const items = result.items || []

if (!items.length) {
return vinss.sendMessage(m.chat, {
text: `❌ *Tidak ada data untuk type ${nfType}*`,
edit: processMsg.key
})
}

let teks = `🎬 *NETFLIX TOP 10*\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n`
teks += `📺 *Type:* ${result.type || '-'}\n`
teks += `📅 *Week End:* ${result.weekEndDate || '-'}\n`
teks += `📊 *Total:* ${result.total || items.length} titles\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n\n`

items.forEach((item, i) => {
teks += `*${item.rank}. ${item.title}*\n`
teks += `📝 ${item.shortSynopsis ? item.shortSynopsis.slice(0, 120) + (item.shortSynopsis.length > 120 ? '...' : '') : '-'}\n`
teks += `🎭 ${item.category || '-'} • ${item.maturityRating || 'N/A'} • ${item.releaseYear || '-'}\n`
teks += `📊 *${item.weeksInTop10} weeks* in Top 10\n`
teks += `🔗 ${item.netflixUrl}\n\n`
})

teks += `_Source: netflix.com/tudum_`

// Kirim dengan thumbnail rank 1
const topThumb = items[0]?.thumbnail

if (topThumb) {
await vinss.sendMessage(m.chat, {
image: { url: topThumb },
caption: teks,
contextInfo: previewAd({
title: `🎬 Netflix Top 10 - ${result.type}`,
body: `Week End: ${result.weekEndDate}`,
thumbnail: topThumb,
sourceUrl: 'https://www.netflix.com/tudum/top10',
mention: [m.sender],
forward: true,
largerThumbnail: true,
})
}, { quoted: m })
} else {
await reply(teks)
}

await vinss.sendMessage(m.chat, { delete: processMsg.key })

} catch (err) {
console.error("netflix error:", err)
await vinss.sendMessage(m.chat, {
text: `❌ *Gagal mengambil Netflix Top 10!*\n\n📝 Error: ${err.message}`,
edit: processMsg.key
})
}
}
break

// =================== BRAINLY SEARCH ===================
case "brainly":
case "bren":
case "brainlysearch": {
if (!text) return example("Who is the current president of Indonesia?")

await vinss.sendMessage(m.chat, { react: { text: "🧠", key: m.key } })

const processMsg = await vinss.sendMessage(m.chat, {
text: `⏳ *Mencari di Brainly...*\n🔍 Query: ${text}`
}, { quoted: m })

try {
const { data } = await axios.get(
`https://anabot.my.id/api/search/brainly?query=${encodeURIComponent(text)}&apikey=freeApikey`,
{ timeout: 30000, headers: { 'accept': 'application/json' } }
)

if (!data.success || !data.data?.result?.length) {
return vinss.sendMessage(m.chat, {
text: `❌ *Tidak ada hasil ditemukan!*\n\n🔍 Query: ${text}\n\n_Coba pakai keyword lain ya._`,
edit: processMsg.key
})
}

const results = data.data.result.slice(0, 5)

let teks = `🧠 *BRAINLY SEARCH*\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n`
teks += `🔍 *Query:* ${text}\n`
teks += `📊 *Total:* ${data.data.result.length} hasil\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n\n`

results.forEach((item, i) => {
const question = item.content || item.highlight?.contentFragments?.[0] || '-'
const answer = item.answer?.content || '-'
const author = item.answer?.author?.nick || 'Anonim'
const rank = item.answer?.author?.rank || '-'
const points = item.answer?.author?.points || 0
const verified = item.answer?.verified ? '✅' : '❌'
const best = item.answer?.best ? '⭐ Best Answer' : ''
const grade = item.grade?.name || '-'
const subject = item.subject?.name || '-'
const rating = item.answer?.rating || 0

// Bersihkan HTML tag dari jawaban
const cleanAnswer = answer
.replace(/<br\s*\/?>/gi, '\n')
.replace(/<[^>]*>/g, '')
.trim()
.slice(0, 500)

teks += `*${i + 1}. ${question.trim()}*\n\n`
teks += `📚 *Mapel:* ${subject}\n`
teks += `🎓 *Jenjang:* ${grade}\n`
teks += `⭐ *Rating:* ${rating}/5 ${best}\n`
teks += `👤 *Penjawab:* ${author} (${rank}, ${points.toLocaleString()} pts) ${verified}\n\n`
teks += `💬 *Jawaban:*\n${cleanAnswer}${answer.length > 500 ? '...' : ''}\n\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n\n`
})

teks += `_© Source: brainly.co.id_`

// Ambil avatar dari hasil pertama sebagai thumbnail
const firstAvatar = results[0]?.answer?.author?.avatarUrl

if (firstAvatar) {
await vinss.sendMessage(m.chat, {
image: { url: firstAvatar },
caption: teks,
contextInfo: previewAd({
title: `🧠 Brainly Search`,
body: `${text}`,
thumbnail: firstAvatar,
sourceUrl: 'https://brainly.co.id',
mention: [m.sender],
forward: true,
largerThumbnail: true,
})
}, { quoted: m })
} else {
await reply(teks)
}

await vinss.sendMessage(m.chat, { delete: processMsg.key })

} catch (err) {
console.error("brainly error:", err)
await vinss.sendMessage(m.chat, {
text: `❌ *Gagal mencari di Brainly!*\n\n🔍 Query: ${text}\n📝 Error: ${err.message}`,
edit: processMsg.key
})
}
}
break

// =================== GIPHY SEARCH ===================
case "giphy":
case "gif": {
if (!text) return example("cat")

await vinss.sendMessage(m.chat, { react: { text: "🎞️", key: m.key } })

try {
const { data } = await axios.get(
`https://anabot.my.id/api/search/giphy?query=${encodeURIComponent(text)}&apikey=freeApikey`,
{ timeout: 30000, headers: { 'accept': 'application/json' } }
)

if (!data.success || !data.data?.result?.length) {
return m.reply(`❌ *GIF tidak ditemukan!*\n\n🔍 Query: ${text}`)
}

const results = data.data.result.slice(0, 3)

for (const gif of results) {
try {
// Prioritaskan mp4 (lebih ringan & support WA)
const gifUrl = gif.images?.original?.mp4 || gif.images?.fixed_height?.mp4 || gif.images?.original?.url

if (!gifUrl) continue

await vinss.sendMessage(m.chat, {
video: { url: gifUrl },
gifPlayback: true,
caption: `🎞️ *${gif.title || 'Giphy'}*\n🔗 ${gif.url || '-'}`,
contextInfo: previewAd({
title: gif.title || 'Giphy GIF',
body: `By @${gif.username || 'anonymous'}`,
thumbnail: gif.images?.fixed_height?.webp || global.img,
sourceUrl: gif.url,
mention: [m.sender],
forward: true,
})
}, { quoted: m })

await sleep(2000)
} catch (e) {
console.error('giphy item error:', e.message)
}
}

} catch (err) {
console.error("giphy error:", err)
m.reply(`❌ Gagal mencari GIF: ${err.message}`)
}
}
break

// =================== GITHUB USER SEARCH ===================
case "githubsearch":
case "ghsearch":
case "ghuser": {
if (!text) return example("NajmyW")

await vinss.sendMessage(m.chat, { react: { text: "🐙", key: m.key } })

try {
const { data } = await axios.get(
`https://anabot.my.id/api/search/githubSearch?username=${encodeURIComponent(text)}&apikey=freeApikey`,
{ timeout: 30000, headers: { 'accept': 'application/json' } }
)

if (!data.success) {
return m.reply(`❌ *User GitHub tidak ditemukan!*\n\n👤 Username: ${text}`)
}

const d = data.data

let teks = `🐙 *GITHUB USER*\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n\n`
teks += `👤 *Username:* ${d.login || text}\n`
teks += `📛 *Nama:* ${d.name || '-'}\n`
teks += `📝 *Bio:* ${d.bio || '-'}\n`
teks += `🏢 *Company:* ${d.company || '-'}\n`
teks += `📍 *Lokasi:* ${d.location || '-'}\n`
teks += `📧 *Email:* ${d.email || '-'}\n`
teks += `🔗 *Blog:* ${d.blog || '-'}\n`
teks += `🐦 *Twitter:* ${d.twitter_username ? '@' + d.twitter_username : '-'}\n`
teks += `\n📊 *Statistik:*\n`
teks += `│ 📦 Public Repo: ${d.public_repos || 0}\n`
teks += `│ 📝 Public Gists: ${d.public_gists || 0}\n`
teks += `│ 👥 Followers: ${d.followers || 0}\n`
teks += `│ ➡️ Following: ${d.following || 0}\n`
teks += `\n📅 *Dibuat:* ${d.created_at ? new Date(d.created_at).toLocaleString('id-ID') : '-'}\n`
teks += `🔄 *Update:* ${d.updated_at ? new Date(d.updated_at).toLocaleString('id-ID') : '-'}\n`
teks += `🔗 *URL:* ${d.html_url || `https://github.com/${text}`}\n`

if (d.avatar_url) {
await vinss.sendMessage(m.chat, {
image: { url: d.avatar_url },
caption: teks,
contextInfo: previewAd({
title: `🐙 ${d.name || text}`,
body: `@${d.login || text}`,
thumbnail: d.avatar_url,
sourceUrl: d.html_url,
mention: [m.sender],
forward: true,
largerThumbnail: true,
})
}, { quoted: m })
} else {
await reply(teks)
}

} catch (err) {
console.error("githubsearch error:", err)
m.reply(`❌ Gagal mencari user: ${err.message}`)
}
}
break

// =================== KABAR KITA (BERITA) ===================
case "kabarkita":
case "berita":
case "news": {
await vinss.sendMessage(m.chat, { react: { text: "📰", key: m.key } })

const processMsg = await vinss.sendMessage(m.chat, {
text: `⏳ *Mengambil berita terbaru...*`
}, { quoted: m })

try {
const { data } = await axios.get(
`https://anabot.my.id/api/search/news/kabarKita?apikey=freeApikey`,
{ timeout: 30000, headers: { 'accept': 'application/json' } }
)

if (!data.success) {
return vinss.sendMessage(m.chat, {
text: `❌ *Gagal mengambil berita!*`,
edit: processMsg.key
})
}

const items = data.data?.result || data.data?.data || data.result || []
const berita = Array.isArray(items) ? items : [items]

if (!berita.length) {
return vinss.sendMessage(m.chat, {
text: `❌ *Tidak ada berita tersedia*`,
edit: processMsg.key
})
}

let teks = `📰 *KABAR TERBARU*\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n`
teks += `📅 ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n\n`

berita.slice(0, 8).forEach((item, i) => {
const judul = item.title || item.judul || item.headline || '-'
const link = item.link || item.url || '-'
const desc = item.description || item.deskripsi || item.summary || ''
const tanggal = item.date || item.publishedAt || item.tanggal || '-'
const sumber = item.source || item.sumber || 'Kabar Kita'

teks += `*${i + 1}. ${judul}*\n`
if (desc) teks += `📝 ${desc.slice(0, 150)}${desc.length > 150 ? '...' : ''}\n`
teks += `📅 ${tanggal}\n`
teks += `📡 ${sumber}\n`
teks += `🔗 ${link}\n\n`
})

teks += `_© Kabar Kita News_`

// Cari thumbnail dari item pertama
const thumb = berita[0]?.image || berita[0]?.thumbnail || berita[0]?.urlToImage

if (thumb) {
await vinss.sendMessage(m.chat, {
image: { url: thumb },
caption: teks,
contextInfo: previewAd({
title: `📰 Kabar Kita`,
body: `Berita terbaru hari ini`,
thumbnail: thumb,
sourceUrl: 'https://kabarkita.id',
mention: [m.sender],
forward: true,
largerThumbnail: true,
})
}, { quoted: m })
} else {
await reply(teks)
}

await vinss.sendMessage(m.chat, { delete: processMsg.key })

} catch (err) {
console.error("kabarkita error:", err)
await vinss.sendMessage(m.chat, {
text: `❌ *Gagal mengambil berita!*\n\n📝 Error: ${err.message}`,
edit: processMsg.key
})
}
}
break

// =================== KOMIKINDO SEARCH ===================
case "komikindo":
case "komik":
case "komiksearch": {
if (!text) return example("Naruto")

await vinss.sendMessage(m.chat, { react: { text: "📚", key: m.key } })

try {
const { data } = await axios.get(
`https://anabot.my.id/api/search/komikIndo/search?query=${encodeURIComponent(text)}&apikey=freeApikey`,
{ timeout: 30000, headers: { 'accept': 'application/json' } }
)

if (!data.success) {
return m.reply(`❌ *Komik tidak ditemukan!*\n\n🔍 Query: ${text}`)
}

const items = data.data?.result || data.result || []

if (!items.length) {
return m.reply(`❌ *Komik "${text}" tidak ditemukan*`)
}

let teks = `📚 *KOMIKINDO SEARCH*\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n`
teks += `🔍 *Query:* ${text}\n`
teks += `📊 *Total:* ${items.length} komik\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n\n`

items.slice(0, 10).forEach((k, i) => {
teks += `*${i + 1}. ${k.title || k.judul || '-'}*\n`
if (k.type) teks += `🏷️ ${k.type}\n`
if (k.status) teks += `📊 ${k.status}\n`
if (k.rating) teks += `⭐ ${k.rating}\n`
if (k.genre) teks += `🎭 ${Array.isArray(k.genre) ? k.genre.join(', ') : k.genre}\n`
teks += `🔗 ${k.link || k.url || '-'}\n\n`
})

teks += `_Ketik .komikdetail <url> untuk detail_\n`
teks += `_Ketik .komikdownload <url> untuk download_`

const thumb = items[0]?.image || items[0]?.thumbnail

if (thumb) {
await vinss.sendMessage(m.chat, {
image: { url: thumb },
caption: teks,
contextInfo: previewAd({
title: `📚 KomikIndo Search`,
body: `${text} - ${items.length} hasil`,
thumbnail: thumb,
sourceUrl: 'https://komikindo.ch',
mention: [m.sender],
forward: true,
largerThumbnail: true,
})
}, { quoted: m })
} else {
await reply(teks)
}

} catch (err) {
console.error("komikindo error:", err)
m.reply(`❌ Gagal mencari komik: ${err.message}`)
}
}
break

// =================== KOMIKINDO DETAIL ===================
case "komikdetail":
case "komikinfo": {
if (!text) return example("https://komikindo.ch/komik/renge-to-naruto/")
if (!/komikindo/i.test(text)) {
return m.reply(`❌ URL harus dari komikindo!\n\nContoh:\n.komikdetail https://komikindo.ch/komik/renge-to-naruto/`)
}

await vinss.sendMessage(m.chat, { react: { text: "📖", key: m.key } })

try {
const { data } = await axios.get(
`https://anabot.my.id/api/search/komikIndo/getDetails?url=${encodeURIComponent(text)}&apikey=freeApikey`,
{ timeout: 30000, headers: { 'accept': 'application/json' } }
)

if (!data.success) {
return m.reply(`❌ *Gagal mengambil detail komik!*`)
}

const d = data.data?.result || data.result || data.data

let teks = `📖 *DETAIL KOMIK*\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n\n`
teks += `📛 *Judul:* ${d.title || d.judul || '-'}\n`
if (d.type) teks += `🏷️ *Type:* ${d.type}\n`
if (d.status) teks += `📊 *Status:* ${d.status}\n`
if (d.rating) teks += `⭐ *Rating:* ${d.rating}\n`
if (d.author) teks += `✍️ *Author:* ${d.author}\n`
if (d.genre) teks += `🎭 *Genre:* ${Array.isArray(d.genre) ? d.genre.join(', ') : d.genre}\n`
if (d.sinopsis) teks += `\n📝 *Sinopsis:*\n${d.sinopsis.slice(0, 500)}${d.sinopsis.length > 500 ? '...' : ''}\n`
if (d.chapters?.length) {
teks += `\n📚 *Chapters (${d.chapters.length}):*\n`
d.chapters.slice(0, 10).forEach((ch, i) => {
teks += `${i + 1}. ${ch.title || ch.judul || '-'}\n`
})
if (d.chapters.length > 10) {
teks += `_...dan ${d.chapters.length - 10} chapter lagi_`
}
}

const thumb = d.image || d.thumbnail || d.cover

if (thumb) {
await vinss.sendMessage(m.chat, {
image: { url: thumb },
caption: teks,
contextInfo: previewAd({
title: `📖 ${d.title || 'Komik'}`,
body: `${d.status || ''} • ${d.rating || ''}`,
thumbnail: thumb,
sourceUrl: text,
mention: [m.sender],
forward: true,
largerThumbnail: true,
})
}, { quoted: m })
} else {
await reply(teks)
}

} catch (err) {
console.error("komikdetail error:", err)
m.reply(`❌ Gagal mengambil detail: ${err.message}`)
}
}
break

// =================== KOMIKINDO DOWNLOAD ===================
case "komikdownload":
case "komikdl": {
if (!text) return example("https://komikindo.ch/komik/renge-to-naruto/")
if (!/komikindo/i.test(text)) {
return m.reply(`❌ URL harus dari komikindo!`)
}

await vinss.sendMessage(m.chat, { react: { text: "📥", key: m.key } })

const processMsg = await vinss.sendMessage(m.chat, {
text: `⏳ *Mengunduh komik...*\n🔗 ${text}`
}, { quoted: m })

try {
const { data } = await axios.get(
`https://anabot.my.id/api/search/komikIndo/download?url=${encodeURIComponent(text)}&apikey=freeApikey`,
{ timeout: 60000, headers: { 'accept': 'application/json' } }
)

if (!data.success) {
return vinss.sendMessage(m.chat, {
text: `❌ *Gagal download komik!*`,
edit: processMsg.key
})
}

const d = data.data?.result || data.result || data.data
const images = d.images || d.pages || d.chapter_images || []

if (!images.length) {
return vinss.sendMessage(m.chat, {
text: `❌ *Tidak ada halaman ditemukan*`,
edit: processMsg.key
})
}

await vinss.sendMessage(m.chat, {
text: `✅ *Komik ditemukan!*\n📖 Judul: ${d.title || '-'}\n📄 Total halaman: ${images.length}\n\n_Mengirim halaman..._`,
edit: processMsg.key
})

// Kirim max 10 halaman biar gak spam
const maxSend = Math.min(images.length, 10)
for (let i = 0; i < maxSend; i++) {
try {
await vinss.sendMessage(m.chat, {
image: { url: images[i] },
caption: `📄 *Halaman ${i + 1}/${images.length}*`
}, { quoted: m })
await sleep(2000)
} catch (e) {
console.error('komik page error:', e.message)
}
}

if (images.length > maxSend) {
await vinss.sendMessage(m.chat, {
text: `_Hanya menampilkan ${maxSend} dari ${images.length} halaman_`
}, { quoted: m })
}

} catch (err) {
console.error("komikdownload error:", err)
await vinss.sendMessage(m.chat, {
text: `❌ *Gagal download:* ${err.message}`,
edit: processMsg.key
})
}
}
break

// =================== LINE STICKER SEARCH ===================
case "linesticker":
case "linestiker":
case "lstiker": {
if (!text) return example("Cat")

await vinss.sendMessage(m.chat, { react: { text: "🩷", key: m.key } })

try {
const { data } = await axios.get(
`https://anabot.my.id/api/search/lineSticker?query=${encodeURIComponent(text)}&apikey=freeApikey`,
{ timeout: 30000, headers: { 'accept': 'application/json' } }
)

if (!data.success) {
return m.reply(`❌ *Sticker Line tidak ditemukan!*\n\n🔍 Query: ${text}`)
}

const items = data.data?.result || data.result || []

if (!items.length) {
return m.reply(`❌ *Tidak ada sticker "${text}"*`)
}

let teks = `🩷 *LINE STICKER SEARCH*\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n`
teks += `🔍 *Query:* ${text}\n`
teks += `📊 *Total:* ${items.length} sticker pack\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n\n`

items.slice(0, 10).forEach((s, i) => {
teks += `*${i + 1}. ${s.title || s.name || '-'}*\n`
if (s.author) teks += `👤 ${s.author}\n`
if (s.price) teks += `💰 ${s.price}\n`
teks += `🔗 ${s.url || s.link || '-'}\n\n`
})

const thumb = items[0]?.image || items[0]?.thumbnail || items[0]?.stickerUrl

if (thumb) {
await vinss.sendMessage(m.chat, {
image: { url: thumb },
caption: teks,
contextInfo: previewAd({
title: `🩷 Line Sticker`,
body: `${text} - ${items.length} hasil`,
thumbnail: thumb,
sourceUrl: 'https://store.line.me',
mention: [m.sender],
forward: true,
largerThumbnail: true,
})
}, { quoted: m })
} else {
await reply(teks)
}

} catch (err) {
console.error("linesticker error:", err)
m.reply(`❌ Gagal mencari: ${err.message}`)
}
}
break

case "twibbon":
case "twibon": {
if (!text) return example("Wedding")

await vinss.sendMessage(m.chat, { react: { text: "🎨", key: m.key } })

try {
const { data } = await axios.get(
`https://anabot.my.id/api/search/twibbon?query=${encodeURIComponent(text)}&apikey=freeApikey`,
{ timeout: 30000, headers: { 'accept': 'application/json' } }
)

if (!data.success) {
return m.reply(`❌ *Twibbon tidak ditemukan!*\n\n🔍 Query: ${text}`)
}

const items = data.data?.result?.postInfos || data.data?.postInfos || []

if (!items.length) {
return m.reply(`❌ *Tidak ada twibbon "${text}"*`)
}

let teks = `🎨 *TWIBBON SEARCH*\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n`
teks += `🔍 *Query:* ${text}\n`
teks += `📊 *Total:* ${items.length} twibbon\n`
teks += `━━━━━━━━━━━━━━━━━━━━━━\n\n`

items.slice(0, 10).forEach((t, i) => {
teks += `*${i + 1}. ${t.name || '-'}*\n`
if (t.description) teks += `📝 ${t.description.slice(0, 100)}${t.description.length > 100 ? '...' : ''}\n`
if (t.campaignCreator?.name) teks += `👤 ${t.campaignCreator.name}\n`
if (t.hit) teks += `👁️ ${t.hit} views\n`
if (t.category) teks += `📂 ${t.category}\n`
teks += `🔗 ${t.url || '-'}\n\n`
})

// Build thumbnail URL dari item pertama
const firstThumb = items[0]?.thumbnail
const thumbUrl = firstThumb?.startsWith('http')
? firstThumb
: firstThumb
? `https://db1cdn.twicdn.id/thumbnail/${firstThumb}`
: null

if (thumbUrl) {
await vinss.sendMessage(m.chat, {
image: { url: thumbUrl },
caption: teks,
contextInfo: previewAd({
title: `🎨 Twibbon Search`,
body: `${text} - ${items.length} hasil`,
thumbnail: thumbUrl,
sourceUrl: 'https://www.twibbonize.com',
mention: [m.sender],
forward: true,
largerThumbnail: true,
})
}, { quoted: m })
} else {
await reply(teks)
}

} catch (err) {
console.error("twibbon error:", err)
m.reply(`❌ Gagal mencari: ${err.message}`)
}
}
break

// ============== ANONYMOUS MENU==============
// =================== CONFESS (FORMAT: nomor | nama | pesan) ===================
case "confess":
case "confes": {
if (!text) {
return reply(
`💌 *CONFESS*\n` +
`━━━━━━━━━━━━━━━━━━━━━━\n\n` +
`📝 *Format:*\n` +
`*.confess nomor | nama pengirim | pesan*\n\n` +
`📌 *Contoh:*\n` +
`*.confess 628123456789 | Budi | aku suka sama kamu*`
)
}

const parts = text.split("|").map(s => s.trim())
if (parts.length < 3) {
return reply(
`❌ Format salah!\n\n` +
`✅ *Format:* *.confess nomor | nama | pesan*\n` +
`📌 *Contoh:* *.confess 628123456789 | Budi | halo*`
)
}

const [nomorRaw, namaPengirim, ...pesanArr] = parts
const pesan = pesanArr.join("|").trim()

if (!nomorRaw || !namaPengirim || !pesan) {
return reply("❌ Nomor, nama, dan pesan wajib diisi!")
}

// Bersihkan nomor
let nomor = nomorRaw.replace(/[^0-9]/g, "")
if (nomor.startsWith("0")) nomor = "62" + nomor.slice(1)
if (nomor.startsWith("8")) nomor = "62" + nomor
if (!nomor.startsWith("62")) return reply("❌ Nomor tidak valid! Gunakan format 62xxx")

const targetJid = nomor + "@s.whatsapp.net"

if (targetJid === m.sender) {
return reply("❌ Tidak bisa confess ke diri sendiri 😅")
}

await vinss.sendMessage(m.chat, { react: { text: "💌", key: m.key } })

const sessId = crypto.randomBytes(4).toString("hex")

// ✅ KIRIM — JANGAN simpan return value, jangan akses .key.id
let realJid = targetJid

try {
// Validasi nomor (opsional, kalau fungsi tersedia)
if (typeof vinss.onWhatsApp === "function") {
try {
const cek = await vinss.onWhatsApp(nomor)
if (cek?.[0]?.exists) {
realJid = cek[0].jid || targetJid
}
} catch (e) {
console.log("onWhatsApp skip:", e.message)
}
}

// Kirim pesan — TANPA assign ke variable
await vinss.sendMessage(realJid, {
text:
`💌 *KAMU MENDAPAT CONFESS!*\n` +
`━━━━━━━━━━━━━━━━━━━━━━\n\n` +
`👤 *Dari:* ${namaPengirim}\n` +
`💬 *Pesan:*\n${pesan}\n\n` +
`━━━━━━━━━━━━━━━━━━━━━━\n` +
`🆔 *ID:* \`${sessId}\`\n\n` +
`_💡 Balas pesan ini LANGSUNG (tanpa reply) untuk membalas_\n` +
`_Ketik .stopconfess untuk berhenti_`,
contextInfo: previewAd({
title: `💌 Confess Masuk`,
body: `Dari ${namaPengirim}`,
thumbnail: global.img,
sourceUrl: global.web,
forward: true,
})
})

} catch (err) {
console.error("❌ confess send error:", err)
return reply(
`❌ *Gagal kirim confess!*\n\n` +
`📝 Error: ${err.message}\n\n` +
`💡 *Kemungkinan:*\n` +
`• Bot diblokir target\n` +
`• Nomor target tidak valid\n` +
`• Target private`
)
}

// ✅ Simpan session — TANPA lastMsgToTarget (gak butuh msgId)
confessSession.set(sessId, {
from: m.sender,
fromName: namaPengirim,
to: realJid,
targetName: pushname,
active: true,
createdAt: Date.now(),
lastActive: Date.now(),
})

// Mapping untuk auto-reply
confessUserMap.set(nomor, sessId)
confessUserMap.set(m.sender.split("@")[0], sessId)
if (realJid.includes("@s.whatsapp.net")) {
confessUserMap.set(realJid.split("@")[0], sessId)
}

// ✅ Reply sukses (bukan gagal!)
return reply(
`✅ *Confess berhasil dikirim!*\n\n` +
`📤 *Ke:* ${nomor}\n` +
`👤 *Nama:* ${namaPengirim}\n` +
`💬 *Pesan:* ${pesan}\n` +
`🆔 *ID:* \`${sessId}\`\n\n` +
`_Balasan target akan otomatis diteruskan ke kamu_`
)
}
break

// =================== STOP CONFESS ===================
case "stopconfess":
case "stopconfes": {
// Kalau user ketik .stopconfess <id>
if (args[0]) {
const sessId = args[0]
if (!confessSession.has(sessId)) {
return reply(`❌ Session \`${sessId}\` tidak ditemukan.`)
}

const sess = confessSession.get(sessId)
if (sess.from !== m.sender && sess.to !== m.sender && !isCreator) {
return reply("❌ Kamu bukan bagian dari sesi ini!")
}

sess.active = false
confessSession.delete(sessId)

// Hapus mapping
for (const [k, v] of confessUserMap.entries()) {
if (v === sessId) confessUserMap.delete(k)
}

await vinss.sendMessage(m.chat, { react: { text: "🛑", key: m.key } })

try {
const other = sess.from === m.sender ? sess.to : sess.from
await vinss.sendMessage(other, {
text: `🛑 *Sesi confess \`${sessId}\` telah dihentikan.*`
})
} catch {}

return reply(`🛑 *Confess \`${sessId}\` dihentikan.*`)
}

// Kalau tanpa ID, cari berdasarkan nomor user
const myKey1 = m.sender.split("@")[0]
const sessId = confessUserMap.get(myKey1)

if (!sessId) {
return reply("❌ Tidak ada sesi confess aktif untuk kamu.")
}

const sess = confessSession.get(sessId)
if (!sess) {
confessUserMap.delete(myKey1)
return reply("❌ Sesi sudah berakhir.")
}

sess.active = false
confessSession.delete(sessId)

for (const [k, v] of confessUserMap.entries()) {
if (v === sessId) confessUserMap.delete(k)
}

await vinss.sendMessage(m.chat, { react: { text: "🛑", key: m.key } })

try {
const other = sess.from === m.sender ? sess.to : sess.from
await vinss.sendMessage(other, {
text: `🛑 *Sesi confess \`${sessId}\` telah dihentikan.*`
})
} catch {}

return reply(`🛑 *Confess \`${sessId}\` dihentikan.*`)
}
break

// =================== MENFESS ===================
case "menfess":
case "menfes": {
if (!m.isGroup) return reply(mess.group)
if (!text) {
return reply(
`📨 *MENFESS*\n` +
`━━━━━━━━━━━━━━━━━━━━━━\n\n` +
`📝 *Format:*\n` +
`*.menfess nama | pesan*\n` +
`*.menfess pesan* (full anonymous)\n\n` +
`📌 *Contoh:*\n` +
`*.menfess Budi | ada yang mau jadian gak?*\n` +
`*.menfess siapa yang jomblo disini?*\n\n` +
`_Balasan akan masuk ke DM kamu_\n` +
`_Ketik .stopmenfess untuk berhenti_`
)
}

// Parse: kalau ada "|", berarti ada nama. Kalau tidak, full anonymous
let namaPengirim = "Anonymous"
let pesan = text.trim()

if (text.includes("|")) {
const parts = text.split("|").map(s => s.trim())
if (parts.length >= 2) {
namaPengirim = parts[0] || "Anonymous"
pesan = parts.slice(1).join("|").trim()
}
}

if (!pesan) return reply("❌ Pesan menfess tidak boleh kosong!")

await vinss.sendMessage(m.chat, { react: { text: "📨", key: m.key } })

const sessId = crypto.randomBytes(4).toString("hex")

// Kirim ke grup
try {
const sent = await vinss.sendMessage(m.chat, {
text:
`📨 *MENFESS ANONYMOUS*\n` +
`━━━━━━━━━━━━━━━━━━━━━━\n\n` +
`👤 *Dari:* ${namaPengirim}\n` +
`💬 *Pesan:*\n${pesan}\n\n` +
`━━━━━━━━━━━━━━━━━━━━━━\n` +
`🆔 *ID:* \`${sessId}\`\n\n` +
`_💡 Balas pesan ini LANGSUNG (tanpa reply) untuk DM pengirim_\n` +
`_Ketik .stopmenfess ${sessId} untuk tutup_`,
contextInfo: previewAd({
title: `📨 Menfess Masuk`,
body: `Dari ${namaPengirim}`,
thumbnail: global.img,
sourceUrl: global.web,
forward: true,
largerThumbnail: true,
})
})

// Simpan session
menfessSession.set(sessId, {
from: m.sender,
fromName: namaPengirim,
group: m.chat,
pesanAsli: pesan,
active: true,
replies: [],
createdAt: Date.now(),
lastActive: Date.now(),
msgId: sent.key.id,
})

} catch (err) {
console.error("menfess error:", err)
return reply(`❌ Gagal kirim menfess: ${err.message}`)
}
}
break

// =================== STOP MENFESS ===================
case "stopmenfess":
case "stopmenfes": {
if (!m.isGroup) return reply(mess.group)

const sessId = args[0]

// Tanpa ID → tampilkan list menfess aktif di grup ini
if (!sessId) {
const active = []
for (const [id, s] of menfessSession.entries()) {
if (s.group === m.chat && s.active) active.push({ id, ...s })
}

if (!active.length) return reply("❌ Tidak ada menfess aktif di grup ini.")

let teks = `📋 *MENFESS AKTIF DI GRUP INI*\n━━━━━━━━━━━━━━━━━━━━━━\n\n`
active.forEach((s, i) => {
teks += `*${i + 1}.*\n`
teks += `🆔 \`${s.id}\`\n`
teks += `👤 ${s.fromName}\n`
teks += `💬 "${s.pesanAsli.slice(0, 60)}${s.pesanAsli.length > 60 ? "..." : ""}"\n`
teks += `📩 Balasan: ${s.replies.length}\n\n`
})
teks += `_Ketik .stopmenfess <id> untuk tutup_\n`
teks += `_Hanya pengirim atau admin yang bisa stop_`

return reply(teks)
}

if (!menfessSession.has(sessId)) {
return reply(`❌ Menfess \`${sessId}\` tidak ditemukan atau sudah ditutup.`)
}

const sess = menfessSession.get(sessId)

// Cek permission
const isPengirim = sess.from === m.sender
const isLawanBalas = sess.replies.some(r => r.from === m.sender)
if (!isPengirim && !isLawanBalas && !isAdmins && !isCreator) {
return reply("❌ Hanya pengirim atau admin yang bisa stop menfess ini!")
}

sess.active = false
menfessSession.delete(sessId)

// Hapus semua mapping reply yang nunjuk ke sessId ini
for (const [k, v] of menfessReplyMap.entries()) {
if (v === sessId) menfessReplyMap.delete(k)
}

await vinss.sendMessage(m.chat, { react: { text: "🛑", key: m.key } })

return reply(
`🛑 *Menfess \`${sessId}\` ditutup.*\n\n` +
`📊 Total balasan: ${sess.replies.length}`
)
}
break

// ═══════════════════════════════════════════════════════
// 🤖 AI MODE CONTROL
// ═══════════════════════════════════════════════════════
case "modeai":
case "aimode": {
  if (!isCreator) return larang()
  
  initAiModeGlobals()
  const cfg = global.aiModeConfig
  
  if (!text) {
    const personaList = Object.keys(AI_PERSONAS).map(k => `   • ${k}`).join("\n")
    
    return reply(
      `🤖 *AI MODE CONTROL*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `📊 *Status:* ${cfg.enabled ? "✅ ON" : "❌ OFF"}\n` +
      `👤 *Persona:* ${cfg.persona}\n` +
      `🧠 *Engine:* ${cfg.engine}\n` +
      `📢 *Group Reply:* ${cfg.autoJoinGroup ? "✅" : "❌"}\n` +
      `🎯 *Only Mention:* ${cfg.onlyMention ? "✅" : "❌"}\n` +
      `💾 *Max Memory:* ${cfg.maxMemory}\n` +
      `⏱️ *Delay:* ${cfg.respondDelay}ms\n\n` +
      `📝 *PERINTAH:*\n` +
      `• .modeai on / off\n` +
      `• .modeai persona <nama>\n` +
      `• .modeai engine <gemini/deepseek/gpt>\n` +
      `• .modeai group <on/off>\n` +
      `• .modeai mention <on/off>\n` +
      `• .modeai delay <ms>\n` +
      `• .modeai memory <angka>\n` +
      `• .modeai clearmemory\n` +
      `• .modeai memstats\n\n` +
      `👤 *PERSONA:*\n${personaList}`
    )
  }
  
  const parts = text.split(" ")
  const action = parts[0].toLowerCase()
  const val = parts.slice(1).join(" ")
  
  // ON/OFF
  if (action === "on") {
    cfg.enabled = true
    await vinss.sendMessage(m.chat, { react: { text: "🤖", key: m.key } })
    return reply(
      `✅ *AI MODE AKTIF!*\n\n` +
      `👤 Persona: *${cfg.persona}*\n` +
      `🧠 Engine: *${cfg.engine}*\n\n` +
      `💬 Sekarang chat apapun akan dibalas AI!\n` +
      `_Ketik .modeai off untuk mematikan._`
    )
  }
  
  if (action === "off") {
    cfg.enabled = false
    await vinss.sendMessage(m.chat, { react: { text: "🛑", key: m.key } })
    return reply("🛑 *AI Mode dimatikan.*")
  }
  
  // PERSONA
  if (action === "persona") {
    if (!val) return reply(`❌ Persona:\n${Object.keys(AI_PERSONAS).join(", ")}`)
    cfg.persona = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    await vinss.sendMessage(m.chat, { react: { text: "👤", key: m.key } })
    return reply(`✅ Persona: *${cfg.persona}*`)
  }
  
  // ENGINE
  if (action === "engine") {
    const eng = val.toLowerCase()
    if (!["gemini", "deepseek", "gpt"].includes(eng)) {
      return reply("❌ Engine: gemini/deepseek/gpt")
    }
    cfg.engine = eng
    return reply(`✅ Engine: *${eng}*`)
  }
  
  // GROUP
  if (action === "group") {
    cfg.autoJoinGroup = val.toLowerCase() === "on"
    return reply(`✅ Group Reply: *${cfg.autoJoinGroup ? "ON" : "OFF"}*`)
  }
  
  // MENTION
  if (action === "mention") {
    cfg.onlyMention = val.toLowerCase() === "on"
    return reply(`✅ Only Mention: *${cfg.onlyMention ? "ON" : "OFF"}*`)
  }
  
  // DELAY
  if (action === "delay") {
    const d = parseInt(val)
    if (!d || d < 0 || d > 10000) return reply("❌ Delay 0-10000 ms")
    cfg.respondDelay = d
    return reply(`✅ Delay: *${d}ms*`)
  }
  
  // MEMORY
  if (action === "memory") {
    const n = parseInt(val)
    if (!n || n < 1 || n > 50) return reply("❌ Memory 1-50")
    cfg.maxMemory = n
    return reply(`✅ Max Memory: *${n}*`)
  }
  
  // CLEAR MEMORY
  if (action === "clearmemory") {
    clearMemory()
    return reply("🗑️ Memory AI dibersihkan.")
  }
  
  // MEMORY STATS
  if (action === "memstats") {
    const stats = getMemoryStats()
    if (!stats.length) return reply("📭 Belum ada memory.")
    
    let teks = `📊 *AI MEMORY STATS*\n━━━━━━━━━━━━━━━━━━━━━━\n\n`
    stats.slice(0, 15).forEach((s, i) => {
      teks += `${i + 1}. ${s.jid.split("@")[0]} — ${s.count} entri\n`
    })
    return reply(teks)
  }
  
  return example("on/off/persona/engine/group/mention/delay/memory/clearmemory/memstats")
}
break



default:


if (budy.startsWith('=>')) {
if (!isCreator) return

function Return(sul) {
sat = JSON.stringify(sul, null, 2)
bang = util.format(sat)
if (sat == undefined) {
bang = util.format(sul)
}
return m.reply(bang)
}
try {
m.reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
} catch (e) {
m.reply(String(e))
}
}

if (budy.startsWith('>')) {
if (!isCreator) return;
try {
let evaled = await eval(budy.slice(2));

if (typeof evaled !== 'string') {
const util = await import('util')
evaled = util.inspect(evaled, { depth: 1 })
}

await m.reply(evaled);
} catch (err) {
m.reply(String(err));
}
}

if (budy.startsWith('$')) {
if (!isCreator) return
exec(budy.slice(2), (err, stdout) => {
if (err) return m.reply(`${err}`)
if (stdout) return m.reply(stdout)
})
}

}
}
} catch (err) {
console.log(util.format(err))
}
}

