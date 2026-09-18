/*═══════════════════════════════════════════════════════
 * PING LIVE + SPEEDTEST — Yushino-Md Monitor
 * Tema: BLACK PREMIUM EDITION
 *═══════════════════════════════════════════════════════
 * File    : lib/ping.js
 * Import  : import { buildPingMessage, collectServerData, checkPingRate } from "./lib/ping.js";
 * Command : .ping / .pinglive / .server
 *═══════════════════════════════════════════════════════
 */

import os from 'os'
import fs from 'fs'
import { execSync } from 'child_process'

const BANNER = 'https://j.top4top.io/p_3894432qz0.jpg'

// ===== CACHE SPEEDTEST (30 detik) =====
let SPEED_CACHE = { at: 0, ping: 0, download: '-', upload: '-' }
const SPEED_TTL = 30000

// ===== FORMAT HELPERS =====
function formatSize(bytes) {
  const u = ['B', 'KB', 'MB', 'GB', 'TB']
  let i = 0, v = bytes
  while (v >= 1024 && i < u.length - 1) { v /= 1024; i++ }
  return `${v.toFixed(i === 0 ? 0 : 2)} ${u[i]}`
}

function formatSpeed(bps) {
  if (bps >= 1024 * 1024) return (bps / 1024 / 1024).toFixed(2) + ' MB/s'
  if (bps >= 1024) return (bps / 1024).toFixed(2) + ' KB/s'
  return bps.toFixed(0) + ' B/s'
}

function safe(fn, fallback = null) {
  try { return fn() } catch { return fallback }
}

// ===== SYSTEM INFO =====
function getDisk() {
  return safe(() => {
    const out = execSync('df -kP /', { timeout: 3000 }).toString().trim().split('\n')
    const r = out.slice(1).map(l => l.trim().split(/\s+/))[0]
    const total = +r[1] * 1024, used = +r[2] * 1024
    return { total, used, percent: +(used / total * 100).toFixed(1) }
  })
}

function getSwap() {
  return safe(() => {
    const f = fs.readFileSync('/proc/meminfo', 'utf8')
    const total = (f.match(/^SwapTotal:\s+(\d+)/) || [0, 0])[1] * 1024
    const free  = (f.match(/^SwapFree:\s+(\d+)/)  || [0, 0])[1] * 1024
    if (!total) return null
    const used = total - free
    return { total, used, percent: +(used / total * 100).toFixed(1) }
  })
}

function getCpuTemp() {
  return safe(() => {
    const paths = [
      '/sys/class/thermal/thermal_zone0/temp',
      '/sys/class/thermal/thermal_zone1/temp',
      '/sys/devices/virtual/thermal/thermal_zone0/temp'
    ]
    for (const p of paths) {
      if (fs.existsSync(p)) {
        const val = parseInt(fs.readFileSync(p, 'utf8').trim(), 10)
        if (!isNaN(val)) {
          const temp = val > 1000 ? val / 1000 : val
          return { val: temp, text: temp.toFixed(1) + '°C' }
        }
      }
    }
    return { val: 0, text: 'N/A' }
  }, { val: 0, text: 'N/A' })
}

function getNetworkIP() {
  return safe(() => {
    const ni = os.networkInterfaces()
    for (const addrs of Object.values(ni)) {
      for (const a of addrs || []) {
        if (!a.internal && a.family === 'IPv4') return a.address
      }
    }
    return '-'
  }, '-')
}

// ===== NETWORK SPEEDTEST (CACHE) =====
async function measureNetwork() {
  const now = Date.now()
  if (now - SPEED_CACHE.at < SPEED_TTL) return SPEED_CACHE

  let ping = 0
  let download = '-'
  let upload = '-'

  try {
    const start = Date.now()
    const res = await fetch('https://speed.cloudflare.com/__down?bytes=500000', {
      signal: AbortSignal.timeout(5000)
    })
    ping = Date.now() - start
    if (res.ok) {
      const buf = await res.arrayBuffer()
      const sec = (Date.now() - start) / 1000
      download = formatSpeed(buf.byteLength / sec)
    }
  } catch { ping = 0; download = 'N/A' }

  try {
    const payload = 'x'.repeat(100000)
    const start = Date.now()
    await fetch('https://httpbin.org/post', {
      method: 'POST',
      body: payload,
      signal: AbortSignal.timeout(5000)
    })
    const sec = (Date.now() - start) / 1000
    upload = formatSpeed(100000 / sec)
  } catch { upload = 'N/A' }

  SPEED_CACHE = { at: now, ping, download, upload }
  return SPEED_CACHE
}

// ===== COLLECT DATA =====
export async function collectServerData(client) {
  const cores = os.cpus().length
  const load = os.loadavg()
  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const usedMem = totalMem - freeMem
  const heap = process.memoryUsage()
  const isBun = typeof Bun !== 'undefined'
  const disk = getDisk()
  const tempObj = getCpuTemp()
  const net = await measureNetwork()

  return {
    botName: client?.user?.name || 'Yushino-Md',
    cpu: +Math.min(99.9, (load[0] / Math.max(cores, 1)) * 100).toFixed(1),
    ram: +((usedMem / totalMem) * 100).toFixed(1),
    disk: disk ? disk.percent : 0,
    tempVal: tempObj.val,
    tempTxt: tempObj.text,
    cores,
    osType: `${os.type()} ${os.release()}`,
    arch: os.arch(),
    heapUsed: formatSize(heap.heapUsed),
    rss: formatSize(heap.rss),
    memUsed: formatSize(usedMem),
    memTotal: formatSize(totalMem),
    diskTxt: disk ? `${formatSize(disk.used)} / ${formatSize(disk.total)}` : '-',
    swapTxt: (s => s ? `${formatSize(s.used)} / ${formatSize(s.total)}` : 'None')(getSwap()),
    net: getNetworkIP(),
    runtime: isBun ? `Bun ${Bun.version}` : `Node ${process.version}`,
    engine: isBun ? 'JavaScriptCore' : `V8 ${process.versions.v8}`,
    botUpSec: Math.floor(process.uptime()),
    sysUpSec: Math.floor(os.uptime()),
    at: Date.now(),
    ping: net.ping,
    download: net.download,
    upload: net.upload,
  }
}

// ===== RATE LIMIT =====
const RATE = new Map()
export function checkPingRate(sender) {
  const last = RATE.get(sender) || 0
  if (Date.now() - last < 5000) {
    return Math.ceil((5000 - (Date.now() - last)) / 1000)
  }
  RATE.set(sender, Date.now())
  return 0
}

// ===== BUILD HTML — BLACK PREMIUM EDITION =====
// ===== BUILD HTML — TERMINAL MISSION CONTROL =====
export function buildPingHtml(d) {
  const DATA = JSON.stringify({
    cpu: d.cpu, ram: d.ram, disk: d.disk, temp: d.tempVal,
    botUpSec: d.botUpSec, sysUpSec: d.sysUpSec, at: d.at,
  }).replace(/</g, '\\u003c')

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
</head>
<body style="margin:0;padding:0;background:#000;">
<style>
*{box-sizing:border-box;margin:0;font-family:'Courier New',monospace;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
html,body{width:100%}

/* ═══ BODY — TERMINAL BLACK ═══ */
body{
  background:#000;
  padding:12px 10px 16px;
  color:#00ff88;
  overflow-y:auto;
  position:relative;
  min-height:100vh;
  font-family:'Courier New',monospace;
}

/* Scanline effect */
body::before{
  content:'';
  position:fixed;
  inset:0;
  background:repeating-linear-gradient(
    0deg,
    rgba(0,255,136,.02) 0px,
    rgba(0,255,136,.02) 1px,
    transparent 1px,
    transparent 3px
  );
  pointer-events:none;
  z-index:100;
  animation:scan 8s linear infinite;
}
@keyframes scan{
  0%{transform:translateY(0)}
  100%{transform:translateY(3px)}
}

/* Vignette */
body::after{
  content:'';
  position:fixed;
  inset:0;
  background:radial-gradient(circle at center,transparent 30%,rgba(0,0,0,.7) 100%);
  pointer-events:none;
  z-index:99;
}

#app{max-width:460px;margin:0 auto;position:relative;z-index:1}

/* ═══ TOP BAR — JAM LIVE ═══ */
.topbar{
  display:flex;justify-content:space-between;align-items:center;
  padding:6px 4px 12px;
  border-bottom:1px solid rgba(0,255,136,.2);
  margin-bottom:14px;
  font-size:10px;
  color:#00ff88;
  text-shadow:0 0 8px rgba(0,255,136,.7);
  animation:flicker 4s infinite;
}
@keyframes flicker{
  0%,100%{opacity:1}
  92%{opacity:1}
  93%{opacity:.7}
  94%{opacity:1}
  96%{opacity:.85}
  97%{opacity:1}
}
.topbar .left{color:#00ff88;font-weight:700;letter-spacing:1px}
.topbar .left::before{content:'▸ ';animation:blinkCaret 1s infinite}
@keyframes blinkCaret{50%{opacity:0}}
.topbar .right{color:#4ade80;font-weight:700;letter-spacing:.8px}
.topbar .right .blip{
  display:inline-block;
  width:6px;height:6px;
  border-radius:50%;
  background:#00ff88;
  box-shadow:0 0 8px #00ff88;
  margin-right:4px;
  vertical-align:middle;
  animation:blip 1.2s infinite;
}
@keyframes blip{50%{opacity:.2}}

/* ═══ HERO CARD ═══ */
.hero{
  position:relative;
  padding:16px 14px;
  margin-bottom:14px;
  border:1px solid rgba(0,255,136,.4);
  border-radius:6px;
  background:
    linear-gradient(135deg,rgba(0,255,136,.05) 0%,rgba(0,20,10,.4) 100%);
  overflow:hidden;
  animation:heroGlow 3s ease-in-out infinite;
}
@keyframes heroGlow{
  0%,100%{box-shadow:0 0 15px rgba(0,255,136,.15),inset 0 0 20px rgba(0,255,136,.03)}
  50%{box-shadow:0 0 30px rgba(0,255,136,.35),inset 0 0 30px rgba(0,255,136,.08)}
}
/* Corner brackets */
.hero::before,.hero::after{
  content:'';
  position:absolute;
  width:14px;height:14px;
  border:2px solid #00ff88;
  filter:drop-shadow(0 0 4px #00ff88);
}
.hero::before{top:-1px;left:-1px;border-right:none;border-bottom:none}
.hero::after{bottom:-1px;right:-1px;border-left:none;border-top:none}

.hero-head{
  display:flex;align-items:center;gap:12px;
  margin-bottom:14px;
  padding-bottom:12px;
  border-bottom:1px dashed rgba(0,255,136,.25);
}
.hero-head img{
  width:48px;height:48px;border-radius:4px;object-fit:cover;
  border:1px solid #00ff88;
  box-shadow:0 0 12px rgba(0,255,136,.6);
  filter:contrast(1.1) saturate(1.2);
  animation:avatarFlicker 5s infinite;
}
@keyframes avatarFlicker{
  0%,100%{opacity:1}
  90%{opacity:1}
  91%{opacity:.6}
  92%{opacity:1}
}
.hero-head .meta h1{
  font:900 15px 'Arial Black';
  color:#00ff88;
  letter-spacing:2px;
  text-shadow:0 0 10px rgba(0,255,136,.8),0 0 20px rgba(0,255,136,.4);
  margin-bottom:3px;
}
.hero-head .meta .status{
  font-size:9px;
  color:#4ade80;
  letter-spacing:1.5px;
  display:flex;align-items:center;gap:5px;
}
.hero-head .meta .status::before{
  content:'';
  width:6px;height:6px;border-radius:50%;
  background:#00ff88;
  box-shadow:0 0 8px #00ff88,0 0 16px #00ff88;
  animation:blip 1s infinite;
}

.hero-uptime{
  text-align:center;
  padding:6px 0;
}
.hero-uptime .label{
  font-size:9px;
  color:#4ade80;
  letter-spacing:3px;
  margin-bottom:6px;
  opacity:.7;
}
.hero-uptime .big{
  font:900 32px 'Arial Black';
  color:#00ff88;
  letter-spacing:1px;
  text-shadow:
    0 0 15px rgba(0,255,136,1),
    0 0 30px rgba(0,255,136,.6),
    0 0 60px rgba(0,255,136,.3);
  font-variant-numeric:tabular-nums;
  line-height:1;
  animation:uptimePulse 2s ease-in-out infinite;
}
@keyframes uptimePulse{
  0%,100%{text-shadow:0 0 15px rgba(0,255,136,1),0 0 30px rgba(0,255,136,.6),0 0 60px rgba(0,255,136,.3)}
  50%{text-shadow:0 0 25px rgba(0,255,136,1),0 0 50px rgba(0,255,136,.8),0 0 90px rgba(0,255,136,.4)}
}
.hero-uptime .sys{
  font-size:9px;
  color:#4ade80;
  margin-top:6px;
  opacity:.7;
  letter-spacing:1px;
}

/* ═══ NETWORK BARS (horizontal) ═══ */
.net-block{
  margin-bottom:14px;
  border:1px solid rgba(0,255,136,.25);
  border-radius:6px;
  padding:12px 14px;
  background:rgba(0,20,10,.3);
  position:relative;
  overflow:hidden;
}
.net-block::before{
  content:'';
  position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,#00ff88,transparent);
  animation:sweep 3s linear infinite;
}
@keyframes sweep{
  0%{transform:translateX(-100%)}
  100%{transform:translateX(100%)}
}
.net-header{
  font-size:9px;
  color:#4ade80;
  letter-spacing:2px;
  margin-bottom:10px;
  padding-bottom:6px;
  border-bottom:1px dashed rgba(0,255,136,.15);
  display:flex;justify-content:space-between;
}
.net-header span:last-child{color:#00ff88}

.net-row{
  display:flex;align-items:center;
  gap:10px;
  padding:6px 0;
  font-size:11px;
}
.net-row + .net-row{
  border-top:1px solid rgba(0,255,136,.08);
}
.net-row .icon{
  width:24px;height:24px;
  border-radius:4px;
  display:flex;align-items:center;justify-content:center;
  font-size:12px;
  flex-shrink:0;
  border:1px solid;
  position:relative;
}
.net-row .icon.ping{border-color:#00e5ff;color:#00e5ff;background:rgba(0,229,255,.08);box-shadow:0 0 8px rgba(0,229,255,.3)}
.net-row .icon.dl{border-color:#a855f7;color:#a855f7;background:rgba(168,85,247,.08);box-shadow:0 0 8px rgba(168,85,247,.3)}
.net-row .icon.ul{border-color:#f59e0b;color:#f59e0b;background:rgba(245,158,11,.08);box-shadow:0 0 8px rgba(245,158,11,.3)}

.net-row .label{
  flex:1;
  color:#4ade80;
  letter-spacing:1px;
  font-size:10px;
}
.net-row .value{
  font-weight:900;
  font-size:12px;
  letter-spacing:.5px;
}
.net-row .value.ping{color:#00e5ff;text-shadow:0 0 8px rgba(0,229,255,.7)}
.net-row .value.dl{color:#c084fc;text-shadow:0 0 8px rgba(168,85,247,.7)}
.net-row .value.ul{color:#fbbf24;text-shadow:0 0 8px rgba(245,158,11,.7)}

/* ═══ METRIC BLOCK — CIRCULAR GAUGE ═══ */
.metric-block{
  margin-bottom:14px;
  border:1px solid rgba(0,255,136,.25);
  border-radius:6px;
  padding:12px 14px;
  background:rgba(0,20,10,.3);
}
.metric-header{
  font-size:9px;
  color:#4ade80;
  letter-spacing:2px;
  margin-bottom:12px;
  padding-bottom:6px;
  border-bottom:1px dashed rgba(0,255,136,.15);
  display:flex;justify-content:space-between;
}
.metric-header span:last-child{color:#00ff88}

.metric-grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:12px;
}

.metric{
  display:flex;align-items:center;gap:10px;
}
.circle{
  position:relative;
  width:56px;height:56px;
  flex-shrink:0;
}
.circle svg{
  width:100%;height:100%;
  transform:rotate(-90deg);
}
.circle svg circle{
  fill:none;
  stroke-width:4;
}
.circle svg .track{stroke:rgba(0,255,136,.1)}
.circle svg .fill{
  stroke-linecap:round;
  stroke-dasharray:157;
  stroke-dashoffset:157;
  transition:stroke-dashoffset 1.5s cubic-bezier(.45,.05,.3,1);
  filter:drop-shadow(0 0 4px currentColor);
}
.circle svg .fill.cpu{stroke:#00e5ff;color:#00e5ff}
.circle svg .fill.ram{stroke:#a855f7;color:#a855f7}
.circle svg .fill.disk{stroke:#22c55e;color:#22c55e}
.circle svg .fill.temp{stroke:#f59e0b;color:#f59e0b}
.circle svg .fill.danger{stroke:#ef4444;color:#ef4444;animation:dangerCircle 1s infinite}
@keyframes dangerCircle{50%{opacity:.5}}

.circle .inside{
  position:absolute;
  inset:0;
  display:flex;align-items:center;justify-content:center;
  font:900 11px 'Arial Black';
  font-variant-numeric:tabular-nums;
  letter-spacing:-.5px;
}
.circle .inside.cpu{color:#00e5ff;text-shadow:0 0 6px rgba(0,229,255,.7)}
.circle .inside.ram{color:#c084fc;text-shadow:0 0 6px rgba(168,85,247,.7)}
.circle .inside.disk{color:#4ade80;text-shadow:0 0 6px rgba(34,197,94,.7)}
.circle .inside.temp{color:#fbbf24;text-shadow:0 0 6px rgba(245,158,11,.7)}

.metric .info{flex:1;min-width:0}
.metric .info .name{
  font-size:9px;
  color:#4ade80;
  letter-spacing:1.5px;
  margin-bottom:3px;
}
.metric .info .desc{
  font-size:9px;
  color:#64748b;
  letter-spacing:.5px;
  font-family:'Courier New',monospace;
}

/* ═══ INFO LIST ═══ */
.info-block{
  border:1px solid rgba(0,255,136,.25);
  border-radius:6px;
  padding:12px 14px;
  background:rgba(0,20,10,.3);
  margin-bottom:14px;
}
.info-header{
  font-size:9px;
  color:#4ade80;
  letter-spacing:2px;
  margin-bottom:10px;
  padding-bottom:6px;
  border-bottom:1px dashed rgba(0,255,136,.15);
  display:flex;justify-content:space-between;
}
.info-header span:last-child{color:#00ff88}

.info-row{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:12px;
  padding:7px 0;
  font-size:10px;
  border-bottom:1px solid rgba(0,255,136,.06);
}
.info-row:last-child{border-bottom:none}
.info-row .key{
  color:#64748b;
  letter-spacing:1px;
  flex-shrink:0;
  font-weight:700;
}
.info-row .key::before{content:'> ';color:#00ff88;opacity:.5}
.info-row .val{
  color:#cbd5e1;
  text-align:right;
  word-break:break-word;
  font-weight:700;
  letter-spacing:.3px;
  font-size:10px;
  max-width:65%;
}
.info-row .val.green{color:#4ade80}
.info-row .val.cyan{color:#00e5ff}

/* ═══ FOOTER ═══ */
.footer{
  text-align:center;
  padding:12px 0 4px;
  font-size:8.5px;
  color:#475569;
  letter-spacing:2px;
  border-top:1px dashed rgba(0,255,136,.15);
  margin-top:8px;
}
.footer .cursor{
  display:inline-block;
  width:7px;height:11px;
  background:#00ff88;
  margin-left:3px;
  vertical-align:middle;
  animation:blinkCaret 1s steps(1) infinite;
  box-shadow:0 0 6px #00ff88;
}
.footer .brand{color:#00ff88;font-weight:900;text-shadow:0 0 8px rgba(0,255,136,.6)}

/* small phone */
@media(max-width:380px){
  .hero-uptime .big{font-size:26px}
  .metric-grid{gap:8px}
  .circle{width:48px;height:48px}
  .circle .inside{font-size:10px}
}
</style>

<div id="app">

  <!-- TOP BAR -->
  <div class="topbar">
    <div class="left" id="clock">--:--:--</div>
    <div class="right"><span class="blip"></span>SECURE LINE</div>
  </div>

  <!-- HERO -->
  <div class="hero">
    <div class="hero-head">
      <img src="${BANNER}" onerror="this.style.display='none'">
      <div class="meta">
        <h1>SERVER LIVE</h1>
        <div class="status">MONITORING ACTIVE</div>
      </div>
    </div>
    <div class="hero-uptime">
      <div class="label">— BOT UPTIME —</div>
      <div class="big" id="up">--:--:--</div>
      <div class="sys" id="sys">system: --</div>
    </div>
  </div>

  <!-- NETWORK -->
  <div class="net-block">
    <div class="net-header">
      <span>NETWORK DIAGNOSTICS</span>
      <span>◆ ONLINE</span>
    </div>
    <div class="net-row">
      <div class="icon ping">⇄</div>
      <div class="label">PING</div>
      <div class="value ping">${d.ping > 0 ? d.ping + ' ms' : 'N/A'}</div>
    </div>
    <div class="net-row">
      <div class="icon dl">↓</div>
      <div class="label">DOWNLOAD</div>
      <div class="value dl">${d.download}</div>
    </div>
    <div class="net-row">
      <div class="icon ul">↑</div>
      <div class="label">UPLOAD</div>
      <div class="value ul">${d.upload}</div>
    </div>
  </div>

  <!-- METRICS -->
  <div class="metric-block">
    <div class="metric-header">
      <span>SYSTEM METRICS</span>
      <span>◆ LIVE</span>
    </div>
    <div class="metric-grid">

      <div class="metric">
        <div class="circle">
          <svg viewBox="0 0 56 56">
            <circle class="track" cx="28" cy="28" r="25"></circle>
            <circle class="fill cpu" id="cc" cx="28" cy="28" r="25"></circle>
          </svg>
          <div class="inside cpu" id="cv">0%</div>
        </div>
        <div class="info">
          <div class="name">CPU</div>
          <div class="desc">${d.cores} cores</div>
        </div>
      </div>

      <div class="metric">
        <div class="circle">
          <svg viewBox="0 0 56 56">
            <circle class="track" cx="28" cy="28" r="25"></circle>
            <circle class="fill ram" id="rc" cx="28" cy="28" r="25"></circle>
          </svg>
          <div class="inside ram" id="rv">0%</div>
        </div>
        <div class="info">
          <div class="name">RAM</div>
          <div class="desc">${d.heapUsed} heap</div>
        </div>
      </div>

      <div class="metric">
        <div class="circle">
          <svg viewBox="0 0 56 56">
            <circle class="track" cx="28" cy="28" r="25"></circle>
            <circle class="fill disk" id="dc" cx="28" cy="28" r="25"></circle>
          </svg>
          <div class="inside disk" id="dv">0%</div>
        </div>
        <div class="info">
          <div class="name">DISK</div>
          <div class="desc">${d.diskTxt ? d.diskTxt.split(' ')[0] : '-'}</div>
        </div>
      </div>

      <div class="metric">
        <div class="circle">
          <svg viewBox="0 0 56 56">
            <circle class="track" cx="28" cy="28" r="25"></circle>
            <circle class="fill temp" id="tc" cx="28" cy="28" r="25"></circle>
          </svg>
          <div class="inside temp" id="tv">N/A</div>
        </div>
        <div class="info">
          <div class="name">TEMP</div>
          <div class="desc">${d.tempVal > 0 ? 'sensor' : 'unsupported'}</div>
        </div>
      </div>

    </div>
  </div>

  <!-- INFO LIST -->
  <div class="info-block">
    <div class="info-header">
      <span>SYSTEM INFO</span>
      <span>◆ SECURE</span>
    </div>
    <div class="info-row">
      <div class="key">OS</div>
      <div class="val">${d.osType}</div>
    </div>
    <div class="info-row">
      <div class="key">ARCH</div>
      <div class="val">${d.arch}</div>
    </div>
    <div class="info-row">
      <div class="key">RUNTIME</div>
      <div class="val cyan">${d.runtime}</div>
    </div>
    <div class="info-row">
      <div class="key">ENGINE</div>
      <div class="val">${d.engine}</div>
    </div>
    <div class="info-row">
      <div class="key">HEAP / RSS</div>
      <div class="val">${d.heapUsed} / ${d.rss}</div>
    </div>
    <div class="info-row">
      <div class="key">SWAP</div>
      <div class="val">${d.swapTxt}</div>
    </div>
    <div class="info-row">
      <div class="key">IP ADDR</div>
      <div class="val green">${d.net}</div>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <span class="brand">${d.botName.toUpperCase()}</span>
    <span class="cursor"></span>
  </div>

</div>

<script>
var D=${DATA};
function $(i){return document.getElementById(i)}
function fmt(s){
  var d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),x=s%60;
  return (d?d+'d ':'')+(h||d?h+'h ':'')+(m||h||d?m+'m ':'')+x+'s'
}
function fmtClock(){
  var n=new Date();
  return [n.getHours(),n.getMinutes(),n.getSeconds()].map(v=>String(v).padStart(2,'0')).join(':');
}

// Circular gauge — circumference = 2*PI*25 = 157
function setCircle(id, val){
  var el=$(id);
  var offset=157-(157*Math.min(100,val)/100);
  el.style.strokeDashoffset=offset;
}

function paint(cpu,ram,disk,temp){
  $('cv').textContent=cpu.toFixed(1)+'%';
  $('rv').textContent=ram.toFixed(1)+'%';
  $('dv').textContent=disk.toFixed(1)+'%';
  $('tv').textContent=temp>0?temp.toFixed(0)+'°':'N/A';
  setCircle('cc',cpu);
  setCircle('rc',ram);
  setCircle('dc',disk);
  setCircle('tc',temp);
  // Danger mode
  $('cc').classList.toggle('danger',cpu>85);
  $('rc').classList.toggle('danger',ram>85);
  $('dc').classList.toggle('danger',disk>90);
  $('tc').classList.toggle('danger',temp>70);
}

function tick(){
  var el=Math.floor((Date.now()-D.at)/1000);
  $('up').textContent=fmt(D.botUpSec+el);
  $('sys').textContent='system: '+fmt(D.sysUpSec+el);
  $('clock').textContent=fmtClock();
}

paint(D.cpu,D.ram,D.disk,D.temp);
setInterval(tick,1000);
tick();
</script>
</body></html>`
}
// ===== BUILD WHATSAPP RICH MESSAGE =====
export function buildPingMessage(data) {
  const html = buildPingHtml(data)

  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })

  const payloadJson = {
    response_id: uuid,
    sections: [{
      view_model: {
        primitive: {
          __typename: "GenAIaeacdsnwHtmlPrimitive",
          payload: html,
          trusted_sources: ["vinss.bot"]
        },
        __typename: "GenAISingleLayoutViewModel"
      }
    }]
  }

  const unifiedResponseData = Buffer
    .from(JSON.stringify(payloadJson))
    .toString('base64')

  return {
    botForwardedMessage: {
      message: {
        richResponseMessage: {
          messageType: 1,
          submessages: [{ messageType: 2, messageText: 'Server Live Monitor' }],
          unifiedResponse: { data: unifiedResponseData },
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedAiBotMessageInfo: { botJid: "867051314767696@bot" },
            forwardOrigin: 4
          }
        }
      }
    }
  }
}