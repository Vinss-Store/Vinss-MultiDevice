import axios from 'axios'
import * as cheerio from 'cheerio'

async function tiktokDl(url) {
  // delay kecil untuk short link vt.tiktok.com
  if (url.includes('vt.tiktok.com') || url.includes('vm.tiktok.com')) {
    await new Promise(r => setTimeout(r, 3000))
  }
  const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`
  const { data } = await axios.get(api, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  })
  if (!data || !data.data) throw new Error('Video tidak ditemukan')
  const json = data.data
  return {
    title: json.title,
    creator: json.author?.nickname || '-',
    username: json.author?.unique_id || '-',
    views: json.play_count || 0,
    likes: json.digg_count || 0,
    comments: json.comment_count || 0,
    shares: json.share_count || 0,
    video: json.play,
    videoWm: json.wmplay,
    cover: json.cover,
    duration: json.duration || 0
  }
}

async function capcutDl(url) {
  const { data } = await axios.post(
    'https://3bic.com/api/download',
    { url },
    {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://3bic.com',
        'Referer': 'https://3bic.com/id',
        'User-Agent': 'Mozilla/5.0'
      }
    }
  )
  if (data.code !== 200) throw new Error('Gagal mengambil data dari CapCut')
  const videoUrl = data.originalVideoUrl.startsWith('http')
    ? data.originalVideoUrl
    : 'https://3bic.com' + data.originalVideoUrl
  return {
    title: data.title || 'CapCut Video',
    videoUrl,
    thumbnail: data.coverUrl || null,
    duration: data.duration || null
  }
}

async function wallpaper(title, page = '1') {
  const { data } = await axios.get(`https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${encodeURIComponent(title)}`)
  const $ = cheerio.load(data)
  const hasil = []
  $('div.grid-item').each((i, elem) => {
    hasil.push({
      title: $(elem).find('div.info > a > h3').text(),
      type: $(elem).find('div.info > a:nth-child(2)').text(),
      source: 'https://www.besthdwallpaper.com/' + $(elem).find('div > a:nth-child(3)').attr('href'),
      image: [
        $(elem).find('picture > img').attr('data-src') || $(elem).find('picture > img').attr('src'),
        $(elem).find('picture > source:nth-child(1)').attr('srcset'),
        $(elem).find('picture > source:nth-child(2)').attr('srcset')
      ]
    })
  })
  return hasil
}

async function wikimedia(title) {
  const { data } = await axios.get(`https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(title)}&title=Special:MediaSearch&go=Go&type=image`)
  const $ = cheerio.load(data)
  const hasil = []
  $('.sdms-search-results__list-wrapper > div > a').each((i, elem) => {
    hasil.push({
      title: $(elem).find('img').attr('alt'),
      source: $(elem).attr('href'),
      image: $(elem).find('img').attr('data-src') || $(elem).find('img').attr('src')
    })
  })
  return hasil
}

async function happymod(query) {
  const baseUrl = 'https://www.happymod.com/'
  const { data } = await axios.get(`${baseUrl}search.html?q=${encodeURIComponent(query)}`)
  const $ = cheerio.load(data)
  const hasil = []
  $('div.pdt-app-box').each((i, elem) => {
    hasil.push({
      title: $(elem).find('a').text().trim(),
      icon: $(elem).find('img.lazy').attr('data-original'),
      rating: $(elem).find('span').text(),
      link: baseUrl + $(elem).find('a').attr('href')
    })
  })
  return hasil
}

async function ringtone(title) {
  const { data } = await axios.get('https://meloboom.com/en/search/' + encodeURIComponent(title))
  const $ = cheerio.load(data)
  const hasil = []
  $('ul > li').each((i, elem) => {
    hasil.push({
      title: $(elem).find('h4').text(),
      source: 'https://meloboom.com/' + $(elem).find('a').attr('href'),
      audio: $(elem).find('audio').attr('src')
    })
  })
  return hasil
}

async function githubstalk(user) {
  const { data } = await axios.get('https://api.github.com/users/' + user)
  return {
    username: data.login,
    nickname: data.name,
    bio: data.bio,
    id: data.id,
    profile_pic: data.avatar_url,
    url: data.html_url,
    type: data.type,
    admin: data.site_admin,
    company: data.company,
    blog: data.blog,
    location: data.location,
    email: data.email,
    public_repo: data.public_repos,
    public_gists: data.public_gists,
    followers: data.followers,
    following: data.following,
    created_at: data.created_at,
    updated_at: data.updated_at
  }
}

async function npmstalk(packageName) {
  const { data } = await axios.get('https://registry.npmjs.org/' + packageName)
  const versions = data.versions
  const allver = Object.keys(versions)
  const verLatest = allver[allver.length - 1]
  const verPublish = allver[0]
  const packageLatest = versions[verLatest]
  return {
    name: packageName,
    versionLatest: verLatest,
    versionPublish: verPublish,
    versionUpdate: allver.length,
    latestDependencies: Object.keys(packageLatest.dependencies || {}).length,
    publishDependencies: Object.keys(versions[verPublish].dependencies || {}).length,
    publishTime: data.time.created,
    latestPublishTime: data.time[verLatest]
  }
}

async function mlstalk(id, zoneId) {
  const { data } = await axios.post(
    'https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store',
    new URLSearchParams({
      productId: '1',
      itemId: '2',
      catalogId: '57',
      paymentId: '352',
      gameId: id,
      zoneId: zoneId,
      product_ref: 'REG',
      product_ref_denom: 'AE'
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://www.duniagames.co.id/',
        'Accept': 'application/json'
      }
    }
  )
  return data.data.gameDetail
}

/**
 * Facebook Video Downloader
 * @param {string} url - Facebook video URL
 */
async function fbdl(url) {
  const { data } = await axios.get(
    `https://api.ryuu-dev.offc.my.id/download/facebook?url=${encodeURIComponent(url)}`,
    { headers: { 'User-Agent': 'Mozilla/5.0' } }
  )
  if (!data.status || !data.result) throw new Error('Gagal mengambil video Facebook')
  return {
    title: data.result.title || 'Facebook Video',
    thumbnail: data.result.thumbnail || null,
    duration: data.result.duration || null,
    videoHd: data.result.hd || null,
    videoSd: data.result.sd || null,
    downloadUrl: data.result.hd || data.result.sd
  }
}

export {
  tiktokDl,
  capcutDl,
  wallpaper,
  wikimedia,
  happymod,
  ringtone,
  githubstalk,
  npmstalk,
  mlstalk,
  fbdl
}
