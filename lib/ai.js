import axios from 'axios'
import * as cheerio from 'cheerio'
import crypto from 'crypto'

/**
 * DeepSeek AI via deep-seek.ai
 * @param {string} msg - pertanyaan
 */
async function askDeepSeek(msg) {
  const html = await axios.get('https://deep-seek.ai/chat', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 15; Pixel 9) Chrome/150' }
  })

  const cookies = {}
  ;(html.headers['set-cookie'] || []).forEach(c => {
    const [k, v] = c.split(';')[0].split('=')
    if (k && v) cookies[k.trim()] = v.trim()
  })

  const $ = cheerio.load(html.data)
  let csrf = $('meta[name="csrf-token"]').attr('content') || cookies['XSRF-TOKEN']
  if (!csrf) {
    const script = $('script').toArray().find(s => $(s).html().includes('csrfToken'))
    csrf = script ? $(script).html().match(/csrfToken["']?\s*[:=]\s*["']([^"']+)["']/)?.[1] : null
  }
  if (!csrf) throw new Error('No CSRF token')

  const cookieStr = Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ')
  const payload = { model: 'deepseek/deepseek-v4-flash', messages: [{ role: 'user', content: msg }] }

  const res = await axios({
    method: 'POST',
    url: 'https://deep-seek.ai/api/chat',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 15; Pixel 9) Chrome/150',
      'Content-Type': 'application/json',
      'Cookie': cookieStr,
      'X-CSRF-Token': csrf,
      'Origin': 'https://deep-seek.ai',
      'Referer': 'https://deep-seek.ai/chat'
    },
    data: payload,
    responseType: 'stream',
    timeout: 120000
  })

  let answer = '', buffer = ''
  return new Promise((resolve, reject) => {
    res.data.on('data', chunk => {
      buffer += chunk.toString()
      const parts = buffer.split('\n\n')
      buffer = parts.pop() || ''
      for (const p of parts) {
        for (const line of p.split('\n')) {
          if (line.startsWith('data: ')) {
            const json = line.slice(6).trim()
            if (json === '[DONE]') continue
            try {
              const d = JSON.parse(json)
              if (d.choices?.[0]?.delta?.content) answer += d.choices[0].delta.content
              if (d.choices?.[0]?.finish_reason === 'stop') resolve(answer)
            } catch (_) {}
          }
        }
      }
    })
    res.data.on('end', () => resolve(answer))
    res.data.on('error', reject)
  })
}

/**
 * GPT-4o via overchat.ai
 * @param {string} prompt
 * @param {string} model - default: openai/gpt-4o
 */
async function overchat(prompt, model = 'openai/gpt-4o') {
  const { data } = await axios({
    method: 'POST',
    url: 'https://api.overchat.ai/v1/chat/completions',
    responseType: 'stream',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'Origin': 'https://overchat.ai',
      'Referer': 'https://overchat.ai/',
      'User-Agent': 'Mozilla/5.0',
      'x-device-language': 'id',
      'x-device-platform': 'web',
      'x-device-version': '1.0.44',
      'x-device-uuid': crypto.randomUUID()
    },
    data: {
      chatId: crypto.randomUUID(),
      model,
      stream: true,
      temperature: 0.5,
      top_p: 0.95,
      max_tokens: 4000,
      frequency_penalty: 0,
      presence_penalty: 0,
      personaId: 'best-free-ai-chat-landing',
      messages: [
        { id: crypto.randomUUID(), role: 'user', content: prompt },
        { id: crypto.randomUUID(), role: 'system', content: '' }
      ]
    }
  })

  return new Promise((resolve, reject) => {
    let result = '', buffer = ''
    data.on('data', chunk => {
      buffer += chunk.toString()
      const events = buffer.split('\n\n')
      buffer = events.pop()
      for (const event of events) {
        const line = event.trim()
        if (!line.startsWith('data:')) continue
        const payload = line.slice(5).trim()
        if (payload === '[DONE]') { data.destroy(); return resolve(result.trim()) }
        try {
          const json = JSON.parse(payload)
          result += json.choices?.[0]?.delta?.content || ''
        } catch {}
      }
    })
    data.on('end', () => resolve(result.trim()))
    data.on('error', reject)
  })
}

/**
 * Chrunos AI (Qwen/DeepSeek) via tecuts-chat HuggingFace
 * @param {string} prompt
 * @param {number} temperature
 * @param {boolean} useSearch
 */
async function chrunos(prompt, temperature = 0.6, useSearch = false) {
  const { data } = await axios({
    method: 'POST',
    url: 'https://tecuts-chat.hf.space/chat/stream',
    responseType: 'stream',
    headers: {
      'Accept': 'text/event-stream',
      'Content-Type': 'application/json',
      'Origin': 'https://chrunos.com',
      'Referer': 'https://chrunos.com/',
      'User-Agent': 'Mozilla/5.0'
    },
    data: {
      message: `${prompt} /no_think`,
      history: [{ role: 'user', content: prompt }],
      temperature,
      use_search: useSearch
    }
  })

  return new Promise((resolve, reject) => {
    let result = '', buffer = ''
    data.on('data', chunk => {
      buffer += chunk.toString()
      const events = buffer.split('\n\n')
      buffer = events.pop()
      for (const event of events) {
        const line = event.trim()
        if (!line.startsWith('data:')) continue
        try {
          const json = JSON.parse(line.slice(5).trim())
          if (json.type === 'content') {
            if (json.data === '<think>' || json.data === '</think>') continue
            result += json.data
          }
          if (json.type === 'done') { data.destroy(); return resolve(result.trim()) }
        } catch {}
      }
    })
    data.on('error', reject)
    data.on('end', () => resolve(result.trim()))
  })
}

export { askDeepSeek, overchat, chrunos }
