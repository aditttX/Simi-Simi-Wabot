const { WAConnection, MessageType } = require('@adiwajshing/baileys');
const fs = require('fs');
const { getSimiResponse } = require('./simi-simi');
const settings = require('./settings.json');

const conn = new WAConnection();

const connectToWhatsApp = async () => {
    conn.on('credentials-updated', () => {
        console.log('Credentials updated!');
        const authInfo = conn.base64EncodedAuthInfo();
        fs.writeFileSync('./auth_info.json', JSON.stringify(authInfo, null, '\t'));
    });

    fs.existsSync('./auth_info.json') && conn.loadAuthInfo('./auth_info.json');
    await conn.connect();

    conn.on('chat-update', async chatUpdate => {
        if (!chatUpdate.hasNewMessage) return;
        if (!chatUpdate.messages) return;
        if (chatUpdate.key && chatUpdate.key.remoteJid === 'status@broadcast') return;

        const m = chatUpdate.messages.all()[0];
        if (!m.message) return;

        const messageContent = m.message.conversation || m.message.extendedTextMessage?.text;
        const from = m.key.remoteJid;

        if (messageContent && !from.includes('@g.us')) {  // Cek kalau bukan group
            console.log(`Received private message: ${messageContent}`);
            const reply = await getSimiResponse(messageContent);

            await conn.sendMessage(from, reply, MessageType.text, { quoted: m });
        }
    });
};

const pairDevice = async () => {
    try {
        const authData = fs.readFileSync('./auth_info.json');
        conn.loadAuthInfo(JSON.parse(authData));
        await conn.connect();
    } catch (error) {
        console.log('Error loading auth info, connecting for the first time');
        await connectToWhatsApp();
    }
};

pairDevice();
