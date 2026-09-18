/*═══════════════════════════════════════════════════════
 *  HELPER SCRIPT - RPG & UTILITIES
 *═══════════════════════════════════════════════════════
 * RECODE BY   : VINSS STUDENTS
 * BASE ORI    : ZASS DESUTA
 *═══════════════════ SEKIAN TERIMAKASIH ─════════════════════
 */

// =================== DEFAULT RPG USER ===================
export const DEFAULT_RPG_USER = {
  // === Currency & Level ===
  money: 0,
  exp: 0,
  level: 0,
  bank: 0,
  fullatm: 5000000,
  atm: 0,
  chip: 0,
  robo: 0,
  tiketcoin: 0,

  // === Stats ===
  health: 100,
  pickaxe: 0,
  potion: 0,
  pet: 0,
  petFood: 0,

  // === Limit System (BARU) ===
  limit: 10,          // ← limit harian
  lastclaim: 0,       // ← cooldown daily
  lastslot: 0,        // ← cooldown slot
  lastbegal: 0,       // ← cooldown begal

  // === Resources ===
  wood: 0,
  rock: 0,
  string: 0,
  iron: 0,
  gold: 0,
  diamond: 0,
  emerald: 0,
  trash: 0,

  // === Loot Tiers ===
  common: 0,
  uncommon: 0,
  mythic: 0,
  legendary: 0,

  // === Pet RPG ===
  naga: 0,
  kyubi: 0,
  phonix: 0,
  kucing: 0,
  griffin: 0,
  centaur: 0,
  fox: 0,
  cat: 0,
  dog: 0,

  // === Hasil Mulung ===
  botol: 0,
  kaleng: 0,
  kardus: 0,
  gelas: 0,
  plastik: 0,

  // === Hasil Berburu ===
  banteng: 0,
  harimau: 0,
  gajah: 0,
  kambing: 0,
  panda: 0,
  buaya: 0,
  kerbau: 0,
  sapi: 0,
  monyet: 0,
  babihutan: 0,
  babi: 0,
  ayam: 0,

  // === Cooldown Timers ===
  lastkerja: 0,
  lastparming: 0,
  lastmulung: 0,
  lastmining: 0,
  lastbansos: 0,
  lastmisi: 0,
  lastdagang: 0,
  lastrampok: 0,

  // === User Info ===
  registered: false,
  name: '',
  regTime: 0,
  premiumTime: 0,
  ojekk: 0,

  // === Misc ===
  joinlimit: 0,
  skata: 0,
}

// =================== RPG EMOJI MAP ===================
export const rpgEmoji = {
  money: "💵",
  bank: "🏦",
  atm: "🏧",
  chip: "🎰",
  health: "❤️",
  wood: "🪵",
  rock: "🪨",
  string: "🧵",
  iron: "⛓️",
  gold: "🥇",
  diamond: "💎",
  emerald: "🟢",
  trash: "🗑️",
  common: "📦",
  uncommon: "🎁",
  mythic: "🔮",
  legendary: "👑",
  potion: "🧪",
  pet: "🐾",
  petFood: "🍖",
  pickaxe: "⛏️",
  exp: "✨",
  level: "📊",
  tiketcoin: "🎫",
  bank_emoji: "🏦",
  robo: "🤖",
  naga: "🐉",
  kyubi: "🦊",
  phonix: "🦅",
  kucing: "🐈",
  griffin: "🦚",
  centaur: "🐴",
  limit: "🔖",
}

// =================== CREATE / GET USER ===================
export function createUser(jid) {
  if (!global.db.data.users[jid]) {
    global.db.data.users[jid] = { ...DEFAULT_RPG_USER }
  } else {
    for (const key in DEFAULT_RPG_USER) {
      if (global.db.data.users[jid][key] === undefined) {
        global.db.data.users[jid][key] = DEFAULT_RPG_USER[key]
      }
    }
  }
  return global.db.data.users[jid]
}

export function getRpgUser(jid) {
  return createUser(jid)
}

// =================== TIME HELPERS ===================
export function msToTime(duration) {
  const milliseconds = parseInt((duration % 1000) / 100)
  let seconds = Math.floor((duration / 1000) % 60)
  let minutes = Math.floor((duration / 60000) % 60)
  let hours = Math.floor((duration / 3600000) % 24)

  hours = hours < 10 ? "0" + hours : hours
  minutes = minutes < 10 ? "0" + minutes : minutes
  seconds = seconds < 10 ? "0" + seconds : seconds

  return `${hours} jam ${minutes} menit ${seconds} detik`
}

export function clockString(ms) {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor(ms / 60000) % 60
  const s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, "0")).join(":")
}

// =================== RANDOM HELPERS ===================
export function Acakin(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

export function totalUsers() {
  return Object.keys(global.db.data.users || {}).length
}

// =================== RPG COOLDOWN CHECKER ===================
export function checkCooldown(user, field, cooldownMs) {
  const last = user[field] || 0
  const elapsed = Date.now() - last
  if (elapsed < cooldownMs) {
    return { ready: false, sisa: cooldownMs - elapsed }
  }
  return { ready: true, sisa: 0 }
}

// =================== REQUIRE REGISTER (BARU) ===================
/**
 * Cek apakah user sudah terdaftar di RPG
 * @param {string} jid - JID user
 * @param {Function} reply - Function reply dari case.js
 * @param {string} prefix - Prefix command (default ".")
 * @returns {boolean} - true kalau BELUM daftar (harus return)
 */
export function requireRegister(jid, reply, prefix = ".") {
  const user = getRpgUser(jid)
  if (!user.registered) {
    reply(
      `❌ *Kamu belum terdaftar!*\n\n` +
      `Untuk main RPG, kamu harus daftar dulu.\n\n` +
      `📝 Ketik: *${prefix}daftar NamaKamu*\n` +
      `Contoh: *${prefix}daftar Budi*`
    )
    return true
  }
  return false
}

// =================== INIT GLOBAL ===================
export function initRpgGlobals() {
  global.db.data.users = global.db.data.users || {}
  global.casino = global.casino || {}
  global.misi = global.misi || {}
  global.fightnaga = global.fightnaga || {}
  global.fightkyubi = global.fightkyubi || {}
  global.fightphonix = global.fightphonix || {}
  global.fightkucing = global.fightkucing || {}
  global.fightgriffin = global.fightgriffin || {}
  global.fightcentaur = global.fightcentaur || {}
}