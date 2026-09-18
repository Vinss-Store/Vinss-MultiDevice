/*═══════════════════════════════════════════════════════
 *  AI MODE — AUTO-REPLY CHAT ONLY (NO VOICE)
 *═══════════════════════════════════════════════════════
 */

import { getPersonaPrompt, AI_PERSONAS } from './ai-persona.js';
import { askDeepSeek, overchat, chrunos } from './ai.js';
import * as logger from './logger.js';

// =================== MEMORY STORE ===================
export const aiModeMemory = new Map();

// =================== INIT CONFIG ===================
export function initAiModeGlobals() {
  global.aiModeConfig = global.aiModeConfig || {
    enabled: false,
    persona: "Vinss",
    engine: "gemini",
    autoJoinGroup: false,
    maxMemory: 8,
    respondDelay: 1200,
    onlyMention: true,
  };
}

// =================== BUILD PROMPT ===================
function buildPrompt(userMessage, history, persona) {
  const systemPrompt = getPersonaPrompt(persona);
  
  if (!history || history.length === 0) {
    return `${systemPrompt}\n\nUser: ${userMessage}\n\nAI (jawab singkat & natural):`;
  }
  
  const historyText = history.slice(-8).map(m => 
    `${m.role === "user" ? "User" : "AI"}: ${m.content}`
  ).join("\n");
  
  return `${systemPrompt}\n\n--- RIWAYAT ---\n${historyText}\n\nUser: ${userMessage}\n\nAI (jawab singkat, ingat konteks):`;
}

// =================== GENERATE AI REPLY ===================
export async function generateAiReply(userMessage, history = [], persona = "Vinss") {
  const cfg = global.aiModeConfig;
  const engine = cfg?.engine || "gemini";
  const finalPrompt = buildPrompt(userMessage, history, persona);
  
  let reply = null;
  
  try {
    if (engine === "deepseek") {
      reply = await askDeepSeek(finalPrompt);
    } else if (engine === "gpt") {
      reply = await overchat(finalPrompt);
    } else {
      reply = await chrunos(finalPrompt);
    }
  } catch (e) {
    logger.error(`[AI-MODE] Engine ${engine} error: ${e.message}`);
    
    // Fallback
    try {
      if (engine !== "gemini") {
        reply = await chrunos(finalPrompt);
      } else {
        reply = await askDeepSeek(finalPrompt);
      }
    } catch (e2) {
      logger.error(`[AI-MODE] Fallback error: ${e2.message}`);
    }
  }
  
  return reply || "Maaf, aku lagi error. Coba lagi ya 🙏";
}

// =================== MEMORY ===================
export function getMemory(jid) {
  if (!aiModeMemory.has(jid)) {
    aiModeMemory.set(jid, []);
  }
  return aiModeMemory.get(jid);
}

export function pushMemory(jid, role, content) {
  const memory = getMemory(jid);
  memory.push({ role, content, time: Date.now() });
  
  const max = (global.aiModeConfig?.maxMemory || 8) * 2;
  if (memory.length > max) {
    memory.splice(0, memory.length - max);
  }
  
  return memory;
}

export function clearMemory(jid) {
  if (jid) {
    aiModeMemory.set(jid, []);
  } else {
    aiModeMemory.clear();
  }
}

export function getMemoryStats() {
  const stats = [];
  for (const [jid, mem] of aiModeMemory.entries()) {
    if (mem.length > 0) {
      stats.push({ jid, count: mem.length });
    }
  }
  return stats;
}

// =================== SHOULD REPLY ===================
export function shouldAiReply(m, vinss) {
  const cfg = global.aiModeConfig;
  if (!cfg?.enabled) return false;
  
  // Private chat = selalu reply
  if (!m.isGroup) return true;
  
  const botNum = (vinss.user.id || "").split(":")[0];
  const botLid = (vinss.user.lid || "").split(":")[0];
  
  const mentioned = (m.mentionedJid || []).some(j => {
    const num = j.split("@")[0].split(":")[0];
    return num === botNum || num === botLid;
  });
  
  const text = (m.text || "").toLowerCase();
  const botName = (global.namabot || "").toLowerCase();
  const calledName = 
    text.includes(botName) || 
    text.includes("bot") || 
    text.includes("vinss") ||
    text.startsWith("@");
  
  if (cfg.onlyMention) {
    return mentioned || calledName;
  }
  
  if (cfg.autoJoinGroup) {
    return true;
  }
  
  return mentioned || calledName;
}

// =================== AUTO REPLY HANDLER ===================
export async function handleAiAutoReply(vinss, m, previewAd) {
  const cfg = global.aiModeConfig;
  if (!cfg?.enabled) return false;
  if (m.key?.fromMe) return false;
  if (!m.text || !m.text.trim()) return false;
  
  if (m.text.startsWith(".") || m.text.startsWith("/") || m.text.startsWith("#")) return false;
  if (/^https?:\/\/\S+$/.test(m.text.trim())) return false;
  
  if (!shouldAiReply(m, vinss)) return false;
  
  // Show typing
  await vinss.sendPresenceUpdate('composing', m.chat).catch(() => {});
  
  // Natural delay
  const delay = (cfg.respondDelay || 1200) + Math.floor(Math.random() * 800);
  await new Promise(r => setTimeout(r, delay));
  
  try {
    const memoryKey = m.isGroup ? m.chat : m.sender;
    const history = getMemory(memoryKey);
    
    const reply = await generateAiReply(m.text, history, cfg.persona);
    
    // Save memory
    pushMemory(memoryKey, "user", m.text);
    pushMemory(memoryKey, "ai", reply);
    
    // Send
    const sendOpts = {
      text: reply,
      contextInfo: previewAd({
        title: `🤖 ${cfg.persona}`,
        body: `AI Mode • ${cfg.engine}`,
        thumbnail: global.img,
        sourceUrl: global.web,
        mention: [m.sender],
        forward: false,
      })
    };
    
    try {
      await vinss.sendMessage(m.chat, sendOpts, { quoted: m });
    } catch (e) {
      await vinss.sendMessage(m.chat, { text: reply }, { quoted: m });
    }
    
    await vinss.sendPresenceUpdate('paused', m.chat).catch(() => {});
    return true;
  } catch (err) {
    logger.error("[AI-MODE] Reply error:", err.message);
    await vinss.sendPresenceUpdate('paused', m.chat).catch(() => {});
    return false;
  }
}