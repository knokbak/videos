// ⬅️ ➡️

const Discord = require('discord.js');

exports.run = async(client, msg, args) => {
    let pages = [
        'Page 1', // 0
        'Page 2', // 1
        'Page 3' // 2
    ];

    let current = 0;
    let m = await msg.channel.send('Loading pages...');

    function createEmbed (page) {
        let embed = new Discord.MessageEmbed()
        .setDescription(pages[page]);
        return embed;
    };

    function reactionsNeeded (page) {
        return [
            pages[page - 1],
            pages[page + 1]
        ];
    };

    async function showPage (page) {
        let output = createEmbed(page);
        await m.edit(null, { embed: output });
        await m.reactions.removeAll();

        let needed = reactionsNeeded(page);
        let left, right;

        if (needed[0]) {
            await m.react('⬅️');

            let filter = (r, u) => r.emoji.name == '⬅️' && u.id == msg.author.id;
            left = m.createReactionCollector(filter, { time: 60000 });

            left.on('collect', (r) => {
                if (right) right.stop();
                left.stop();

                showPage(current - 1);
                current = current - 1;
            });
        };

        if (needed[1]) {
            await m.react('➡️');

            let filter = (r, u) => r.emoji.name == '➡️' && u.id == msg.author.id;
            right = m.createReactionCollector(filter, { time: 60000 });

            right.on('collect', (r) => {
                if (left) left.stop();
                right.stop();

                showPage(current + 1);
                current = current + 1;
            });
        };
    };

    showPage(current);
};
