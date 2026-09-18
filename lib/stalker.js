import axios from 'axios'
import * as cheerio from 'cheerio'

/**
 * Threads Profile Stalker via threadlook.com
 * @param {string} username - tanpa @
 */
async function threadsStalk(username) {
  const html = (await axios.get(`https://threadlook.com/profile/${username}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 15; Pixel 9) Chrome/150' }
  })).data
  const $ = cheerio.load(html)
  const result = { username, displayName: null, image: null, followers: null, threads: null, verified: null }

  result.displayName = $('h1').first().text().trim()
  result.image = $('img[alt*="@"]').first().attr('src')

  $('dl dd').each((i, el) => {
    const val = parseInt($(el).text().replace(/,/g, ''))
    if (!isNaN(val)) {
      if (i === 0) result.followers = val
      else if (i === 2) result.threads = val
    }
  })

  const faq = $('dl dd').filter((i, el) => $(el).text().toLowerCase().includes('not currently verified'))
  result.verified = faq.length > 0 ? false : ($('svg[aria-label="Verified"]').length > 0 ? true : null)

  return result
}

/**
 * TikTok Profile Stalker
 * @param {string} profile - username tiktok
 */
async function tiktokStalk(profile) {
  const { data } = await axios.post(
    'https://tools.xrespond.com/api/tiktok/profile/details',
    { profile },
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': 'https://slidesigma.com',
        'Referer': 'https://slidesigma.com/'
      }
    }
  )
  const user = data.data.data.user
  const stats = data.data.data.stats
  return {
    nama: user.nickname,
    bio: user.signature,
    fotoProfilKecil: user.avatarThumb,
    fotoProfilSedang: user.avatarMedium,
    fotoProfilBesar: user.avatarLarger,
    mengikuti: stats.followingCount,
    pengikut: stats.followerCount,
    totalSuka: stats.heartCount,
    jumlahVideo: stats.videoCount,
    jumlahDisukai: stats.diggCount
  }
}

/**
 * YouTube Channel Stalker
 * @param {string} username - nama channel (tanpa @)
 */
async function ytStalk(username) {
  const { data } = await axios.get(`https://www.youtube.com/@${username}`, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  })

  const json = data.split('var ytInitialData = ')[1].split(';</script>')[0]
  const yt = JSON.parse(json)
  const meta = yt.metadata.channelMetadataRenderer
  const header = yt.header?.pageHeaderRenderer?.content?.pageHeaderViewModel

  let usn = meta.vanityChannelUrl || ''
  usn = usn.replace('https://www.youtube.com/', '').replace('http://www.youtube.com/', '')

  let subscriber = 'Tidak diketahui'
  let videos = 'Tidak diketahui'
  try {
    const rows = header.metadata.contentMetadataViewModel.metadataRows
    for (const row of rows) {
      for (const part of row.metadataParts) {
        const text = part.text.content
        if (text.includes('subscriber')) subscriber = text
        if (text.includes('video')) videos = text
      }
    }
  } catch {}

  let profile = ''
  try { profile = meta.avatar.thumbnails.pop().url } catch {}

  let banner = ''
  try {
    banner = yt.header.pageHeaderRenderer.content.pageHeaderViewModel.banner.imageBannerViewModel.image.sources.pop().url
  } catch {}

  return { name: meta.title, username: usn, subscriber, videos, profile, banner }
}

export { threadsStalk, tiktokStalk, ytStalk }
