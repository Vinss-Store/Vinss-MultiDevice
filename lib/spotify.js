import axios from 'axios'

/**
 * Spotify Downloader via spotsaver.net
 * Support query: "judul" atau "judul - artis"
 * Auto refresh cookie setiap 5 menit
 */

let _cookie = ''
let _lastRefresh = 0
const COOKIE_INTERVAL = 5 * 60 * 1000 // 5 menit
const DEFAULT_COOKIE = '__cf_bm=UAXrIUhlDpf75O02Q5js1bSmuDi9pG5b.n6ZkkKFuHc-1788997601.2172897-1.0.1.1-ieHbzgVTOZV1M4HPE47SHYF2DGvhSjTFjyJ.OG.OeMMmk77k_qMAlkoE2Hp3u8VAmf8hwus.0fmvt8giyVu8JyL3Q2BPKbzjSRfzq_MLbqN9Im3o1Veckj9M7Bulg.FR'

async function getCookie(force = false) {
  const now = Date.now()
  if (!force && _cookie && (now - _lastRefresh) < COOKIE_INTERVAL) {
    return _cookie
  }

  try {
    const { headers } = await axios.get('https://spotsaver.net', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
        'Accept': 'text/html'
      },
      timeout: 15000
    })

    if (headers['set-cookie']) {
      _cookie = headers['set-cookie'].map(c => c.split(';')[0]).join('; ')
      _lastRefresh = Date.now()
      return _cookie
    }
  } catch (e) {
    // fallback di bawah
  }

  _cookie = DEFAULT_COOKIE
  _lastRefresh = Date.now()
  return _cookie
}

function buildHeaders(cookie) {
  return {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
    'Cookie': cookie,
    'Content-Type': 'application/json',
    'origin': 'https://spotsaver.net',
    'referer': 'https://spotsaver.net/results/',
    'Accept': 'application/json'
  }
}

async function spotifySearch(query) {
  const cookie = await getCookie()
  const headers = buildHeaders(cookie)

  const { data, headers: resHeaders } = await axios.get(
    `https://spotsaver.net/api/spotify/?q=${encodeURIComponent(query)}`,
    { headers, timeout: 20000 }
  )

  // update cookie
  if (resHeaders['set-cookie']) {
    _cookie = resHeaders['set-cookie'].map(c => c.split(';')[0]).join('; ')
    _lastRefresh = Date.now()
  }

  return (data?.items || []).map(item => ({
    title: item.name || '-',
    artist: item.artists?.map(a => a.name).join(', ') ||
            item.artist ||
            item.artist_name ||
            '-',
    duration: item.duration_ms || item.duration || null,
    cover: item.album?.images?.[0]?.url || item.cover || null,
    url: item.external_urls?.spotify || null
  }))
}

async function spotifyDl(query) {
  const cookie = await getCookie()
  const headers = buildHeaders(cookie)

  // ===== Parse query =====
  let title = query
  let artist = ''

  if (query.includes(' - ')) {
    const parts = query.split(' - ')
    title = parts[0].trim()
    artist = parts.slice(1).join(' - ').trim()
  }

  // ===== Kalau tidak ada artis вҶ’ search dulu =====
  if (!artist) {
    const search = await axios.get(
      `https://spotsaver.net/api/spotify/?q=${encodeURIComponent(title)}`,
      { headers, timeout: 20000 }
    )

    if (search.headers['set-cookie']) {
      _cookie = search.headers['set-cookie'].map(c => c.split(';')[0]).join('; ')
      _lastRefresh = Date.now()
    }

    const items = search.data?.items || []
    if (items.length) {
      for (const item of items) {
        if (item && item.name && item.name !== 'Unknown' && item.name !== 'undefined') {
          title = item.name
          artist = item.artists?.map(a => a.name).join(', ') ||
                   item.artist ||
                   item.artist_name ||
                   'Unknown'
          break
        }
      }
    }
  }

  // ===== Fallback parsing =====
  if (!artist || artist === 'Unknown' || artist === 'undefined') {
    const lastDash = query.lastIndexOf(' - ')
    if (lastDash > 0) {
      title = query.substring(0, lastDash).trim()
      artist = query.substring(lastDash + 3).trim()
    }
  }

  if (!title || title === 'undefined' || title === '') title = 'Unknown'
  if (!artist || artist === 'undefined' || artist === '') artist = 'Unknown'

  // ===== Get video ID =====
  const freshCookie = await getCookie(true)
  headers.Cookie = freshCookie

  const id = await axios.post(
    'https://spotsaver.net/api/get-id/',
    { title, artist },
    { headers, timeout: 20000 }
  )

  if (id.headers['set-cookie']) {
    _cookie = id.headers['set-cookie'].map(c => c.split(';')[0]).join('; ')
    _lastRefresh = Date.now()
  }

  const videoId = id.data?.videoId
  if (!videoId) throw new Error('Gagal dapat video ID')

  // ===== Get download URL =====
  const freshCookie2 = await getCookie(true)
  headers.Cookie = freshCookie2

  const fullTitle = `${title} - ${artist}`
  const dl = await axios.post(
    'https://spotsaver.net/api/download/',
    {
      videoId,
      candidateIds: [],
      format: 'mp3',
      title: fullTitle
    },
    { headers, timeout: 30000 }
  )

  const url = dl.data?.downloadUrl
  if (!url) throw new Error('Gagal dapat download URL')

  return {
    title,
    artist,
    videoId,
    downloadUrl: url
  }
}

async function spotifyDlFromUrl(url) {
  // resolve spotify.link redirect
  if (url.includes('spotify.link')) {
    try {
      const res = await axios.get(url, {
        maxRedirects: 0,
        validateStatus: () => true,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      })
      url = res.headers.location || url
    } catch (e) {
      // biarkan
    }
  }

  const match = url.match(/track\/([a-zA-Z0-9]+)/)
  if (!match) throw new Error('URL Spotify tidak valid')

  // get metadata via oEmbed
  const { data } = await axios.get(
    `https://open.spotify.com/oembed?url=https://open.spotify.com/track/${match[1]}`,
    { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }
  )

  const title = data.title
  const artist = data.author_name

  return spotifyDl(`${title} - ${artist}`)
}

export {
  spotifySearch,
  spotifyDl,
  spotifyDlFromUrl
}