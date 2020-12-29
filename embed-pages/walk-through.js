// First, we'll import Discord.JS.
const Discord = require('discord.js');

// CODE:
let current = 1;
let m = await msg.channel.send('Loading pages...');
showPage(msg, current);

async function showPage (message, page) {
    let output = createEmbed(page);
    await m.edit(null, { embed: output });
    await m.reactions.removeAll();

    let left, right;

    if (output[1]) {
        await m.react('⬅️');

        let filter = (r, u) => r.emoji.name == '⬅️' && u.id == message.author.id;
        left = m.createReactionCollector(filter, { time: 60000 });
        left.on('collect', r => {
            m.reactions.removeAll();

            if (right) right.stop();
            left.stop();

            showPage(current - 1);
        });
    };

    if (output[2]) {
        await m.react('➡️');

        let filter = (r, u) => r.emoji.name == '➡️' && u.id == message.author.id;
        right = m.createReactionCollector(filter, { time: 60000 });
        right.on('collect', r => {
            m.reactions.removeAll();

            if (left) left.stop();
            right.stop();

            showPage(current + 1);
        });
    };
};

function createEmbed (page) {
    let embed = new Discord.MessageEmbed()
    .setDescription(content[page]);
    return embed;
};
