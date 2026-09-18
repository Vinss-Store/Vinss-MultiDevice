/**
 * CREATED : YT : VINSS STUDENTS
 * GITHUB  : https://github.com/Vinss-Store
 * WHATSAPP: https://www.whatsapp.com/channel/0029VaF4IIt1CYoaRgoOaX2i
 */

import axios from 'axios'
import FormData from 'form-data'
import zlib from 'zlib'

const BASE = 'https://webappcreator.amethystlab.org'

/* ========================= DEFAULT ICON GENERATOR ========================= */
function makeDefaultIcon() {
  const w = 8, h = 8
  const raw = Buffer.alloc(h * (1 + w * 3))
  for (let y = 0; y < h; y++) {
    raw[y * (1 + w * 3)] = 0
    for (let x = 0; x < w; x++) {
      raw[y * (1 + w * 3) + 1 + x * 3 + 0] = 76
      raw[y * (1 + w * 3) + 1 + x * 3 + 1] = 175
      raw[y * (1 + w * 3) + 1 + x * 3 + 2] = 80
    }
  }

  const idat = zlib.deflateSync(raw)

  const crc32 = (buf) => {
    let c = 0xFFFFFFFF
    const out = Buffer.alloc(4)
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i]
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
      }
    }
    out.writeUInt32BE((c ^ 0xFFFFFFFF) >>> 0)
    return out
  }

  const chunk = (type, data) => {
    const t = Buffer.from(type)
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const crc = crc32(Buffer.concat([t, data]))
    return Buffer.concat([len, t, data, crc])
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8
  ihdr[9] = 2

  return Buffer.concat([
    Buffer.from('89504e470d0a1a0a', 'hex'),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0))
  ])
}

/* ========================= FETCH ICON FROM URL ========================= */
async function getIconBuffer(url) {
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer' })
    return Buffer.from(res.data)
  } catch {
    return makeDefaultIcon()
  }
}

/* ========================= MAIN FUNCTION ========================= */
async function createApk(options = {}) {
  const {
    websiteUrl,
    appName = 'My App',
    packageName = 'com.app.webview',
    versionName = '1.0.0',
    versionCode = 1,
    iconUrl = null,
    iconBuffer = null
  } = options

  if (!websiteUrl) throw new Error('websiteUrl wajib diisi')

  let finalIcon = iconBuffer
  if (!finalIcon && iconUrl) finalIcon = await getIconBuffer(iconUrl)
  if (!finalIcon) finalIcon = makeDefaultIcon()

  const form = new FormData()
  form.append('websiteUrl', websiteUrl)
  form.append('appName', appName)
  form.append('packageName', packageName)
  form.append('versionName', versionName)
  form.append('versionCode', String(versionCode))
  form.append('icon', finalIcon, { filename: 'icon.png', contentType: 'image/png' })

  const { data } = await axios.post(`${BASE}/api/build-apk`, form, {
    headers: {
      ...form.getHeaders(),
      'Origin': BASE,
      'Referer': BASE + '/',
      'User-Agent': 'Mozilla/5.0'
    },
    timeout: 300000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  })

  if (!data.success) throw new Error(data.message || 'Build APK gagal')

  const dlUrl = data.downloadUrl.startsWith('http')
    ? data.downloadUrl
    : BASE + data.downloadUrl

  const apkRes = await axios.get(dlUrl, {
    responseType: 'arraybuffer',
    timeout: 300000
  })

  return {
    success: true,
    buffer: Buffer.from(apkRes.data),
    downloadUrl: dlUrl
  }
}

export { createApk }
