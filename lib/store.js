import EventEmitter from "events";
import fs from 'fs';

export function makeInMemoryStore({ logger } = {}) {
  if (!fs.existsSync("./session")) {
    fs.mkdirSync("./session", { recursive: true });
  }

  const state = {
    messages: {},   // { jid: [ ...msgs ] }
    chats: [],
    contacts: {}
  }

  const store = {
    logger,

    get contacts() {
      return state.contacts;
    },

    get chats() {
      return state.chats;
    },

    loadMessage: (jid, id) => {
      const msgs = state.messages[jid] || []
      return msgs.find(m => m.key?.id === id) || null
    },

    loadMessages: (jid) => {
      return state.messages[jid] || []
    },

    loadChats: () => state.chats,

    loadContacts: () => state.contacts,

    bind: (ev) => {
      ev.on("messages.upsert", ({ messages }) => {
        for (const msg of messages) {
          const jid = msg.key.remoteJid
          if (!state.messages[jid]) state.messages[jid] = []

          // hindari duplikat
          const idx = state.messages[jid].findIndex(m => m.key?.id === msg.key.id)
          if (idx !== -1) {
            state.messages[jid][idx] = msg
          } else {
            state.messages[jid].push(msg)
            // batasi 50 pesan per jid agar tidak habis RAM
            if (state.messages[jid].length > 50) {
              state.messages[jid].shift()
            }
          }
        }
      })

      ev.on("chats.update", (updates) => {
        for (const upd of updates) {
          const idx = state.chats.findIndex(c => c.id === upd.id)
          if (idx !== -1) {
            state.chats[idx] = { ...state.chats[idx], ...upd }
          } else {
            state.chats.push(upd)
          }
        }
      })

      ev.on("contacts.update", (updates) => {
        for (const upd of updates) {
          const id = upd.id
          state.contacts[id] = { ...(state.contacts[id] || {}), ...upd }
        }
      })
    }
  }

  return store
}
