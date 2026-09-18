import { getBuffer, sleep, previewAd, runtime } from './myfunc.js';

/**
 * Handle group participants update event (welcome & leave)
 * Otomatis aktif untuk semua grup (tanpa perlu setting manual)
 * @param {import('@whiskeysockets/baileys').WASocket} vinss 
 * @param {{ id: string, participants: (string | { id?: string, jid?: string })[], action: 'add' | 'remove' | 'promote' | 'demote' }} event 
 */
export async function handleGroupParticipantsUpdate(vinss, event) {
  try {
    if (!event || !event.id) return;
    const { id, participants, action } = event;
    if (typeof id !== 'string' || !id.endsWith('@g.us')) return;
    if (!participants || !Array.isArray(participants) || participants.length === 0) return;

    // Ambil metadata grup
    let groupMetadata;
    try {
      groupMetadata = (await vinss.groupMetadata(id)) || {};
    } catch {
      groupMetadata = global.groupCache?.get(id) || {};
    }

    const groupName = groupMetadata.subject || "Group";
    const groupDesc = groupMetadata.desc?.toString() || "Patuhi peraturan grup ya kak!";
    const totalMembers = groupMetadata.participants ? groupMetadata.participants.length : "Beberapa";

    for (let rawUser of participants) {
      let num = typeof rawUser === 'string' ? rawUser : (rawUser?.id || rawUser?.jid || '');
      if (!num || typeof num !== 'string') continue;

      const userNum = num.split('@')[0];

      // Ambil foto profil user
      let ppUser;
      try {
        ppUser = await vinss.profilePictureUrl(num, 'image');
      } catch {
        ppUser = 'https://telegra.ph/file/a059a6a734ed202c879d3.jpg';
      }

      if (action === 'add') {
        const welcomeText = 
`╭━✦「 *WELCOME* 」✦━╮
┃ 
┃ 👤 *Halo Kak:* @${userNum}
┃ 🏰 *Selamat Datang di:* 
┃    ┗━ *${groupName}*
┃ 👥 *Member ke:* ${totalMembers}
┃
┣━━✦「 *DESKRIPSI GRUP* 」✦━━┫
┃ 
${groupDesc.split('\n').map(l => `┃ 📜 ${l}`).join('\n')}
┃
┣━━✦「 *RULES* 」✦━━┫
┃ ✦ Jangan spam link/fitur!
┃ ✦ Saling menghargai sesama member
┃ ✦ Patuhi arahan admin
┃ 
╰━━━━━━━━━━━━━━╯
_Semoga betah dan seru-seruan bareng di sini ya kak!_ ✨`;

        const contextInfo = previewAd({
          title: `✨ W E L C O M E  T O  G R O U P ✨`,
          body: `Selamat datang di ${groupName}`,
          thumbnail: ppUser,
          sourceUrl: global.linkSaluran || global.web,
          mention: [num],
          forward: true,
          largerThumbnail: true
        });

        await vinss.sendMessage(id, {
          text: welcomeText,
          mentions: [num],
          contextInfo
        });

      } else if (action === 'remove') {
        const leaveText = 
`╭━✦「 *GOODBYE* 」✦━╮
┃
┃ 👤 *Selamat Tinggal:* @${userNum}
┃ 🏰 *Keluar dari:* *${groupName}*
┃ 👥 *Sisa Member:* ${totalMembers}
┃
┃ _Sayonara, semoga harimu menyenangkan!_ 🍃
╰━━━━━━━━━━━━━━╯`;

        const contextInfo = previewAd({
          title: `👋 G O O D  B Y E 👋`,
          body: `Sayonara from ${groupName}`,
          thumbnail: ppUser,
          sourceUrl: global.linkSaluran || global.web,
          mention: [num],
          forward: true,
          largerThumbnail: false
        });

        await vinss.sendMessage(id, {
          text: leaveText,
          mentions: [num],
          contextInfo
        });
      }
    }
  } catch (err) {
    console.error("[WELCOME/LEAVE ERROR]", err);
  }
}
