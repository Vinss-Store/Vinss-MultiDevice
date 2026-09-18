import axios from 'axios'
import crypto from 'crypto'

class TempMail {
  constructor() {
    this.baseURL = 'https://api.mail.tm'
    this.token = null
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json'
      }
    })
  }

  async getDomains() {
    const { data } = await this.client.get('/domains')
    return data['hydra:member'] || data
  }

  randomString(length = 10) {
    return crypto.randomBytes(length).toString('hex').slice(0, length)
  }

  async createEmail() {
    const domains = await this.getDomains()
    if (!domains.length) throw new Error('No domains available')
    const domain = domains[0].domain
    const username = this.randomString(8)
    const password = this.randomString(12)
    const address = `${username}@${domain}`
    await this.createAccount(address, password)
    await this.login(address, password)
    return { address, password }
  }

  async createAccount(address, password) {
    const { data } = await this.client.post('/accounts', { address, password })
    return data
  }

  async login(address, password) {
    const { data } = await this.client.post('/token', { address, password })
    this.token = data.token
    this.client.defaults.headers.common['authorization'] = `Bearer ${data.token}`
    return data.token
  }

  async getMessages(page = 1) {
    if (!this.token) throw new Error('Login first')
    const { data } = await this.client.get(`/messages?page=${page}`)
    return data['hydra:member'] || data
  }

  async getMessage(id) {
    if (!this.token) throw new Error('Login first')
    const { data } = await this.client.get(`/messages/${id}`)
    return data
  }

  async deleteMessage(id) {
    if (!this.token) throw new Error('Login first')
    await this.client.delete(`/messages/${id}`)
    return true
  }

  async waitMessage({ interval = 5000, timeout = 120000 } = {}) {
    const start = Date.now()
    while (Date.now() - start < timeout) {
      const messages = await this.getMessages()
      if (messages.length) return messages
      await new Promise(r => setTimeout(r, interval))
    }
    throw new Error('Timeout menunggu email')
  }
}

export { TempMail }
