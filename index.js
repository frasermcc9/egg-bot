const Discord = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const auth = require('./auth.json');

const client = new CommandoClient({
    commandPrefix: "$",
    owner: '202917897176219648'
});

const { ReactionCollector } = require('discord.js');

const { Sequelize, Model, DataTypes } = require('sequelize')
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db/eggs.sqlite'
});

class User extends Model { }
User.init({
    disId: DataTypes.STRING,
    points: DataTypes.INTEGER,
    egg1: DataTypes.INTEGER,
    egg2: DataTypes.INTEGER,
    egg3: DataTypes.INTEGER,
    egg4: DataTypes.INTEGER,
    egg5: DataTypes.INTEGER,
    egg6: DataTypes.INTEGER,
}, { sequelize, modelName: 'user' });

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['core', 'Core Commands'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('error', console.error);
client.login(auth.token);

client.once('ready', () => {
    console.log(`Successfully connected to discord. Username: ${client.user.tag}. ID: ${client.user.id}`);
    client.user.setActivity('Zooming');
});

client.on('error', console.error);
client.login(auth.token);

client.on('message', async msg => {
    if (probability(1)) {
        let egg = getEgg()
        msg.react(egg.emote).then(() => {

            const filter = (reaction, author) => {
                return egg.emote == reaction.emoji && author.bot == false;
            };

            const collector = new ReactionCollector(msg, filter, { time: 1000 * 15 })
            collector.on('collect', () => {
                collector.stop()
            })

            collector.on('end', collected => {
                msg.reactions.removeAll()
                if (collected.size != 0) {
                    let user = Array.from(collected.first().users.cache)[1]
                    sequelize.sync().then(() => User.findOrCreate({ where: { disId: user[0] }, defaults: { points: 0, egg1: 0, egg2: 0, egg3: 0, egg4: 0, egg5: 0, egg6: 0 } })).then(() => {
                        User.findOne({ where: { disId: user[0] } }).then(tag => {
                            tag.increment({ points: egg.score }).then(() => {
                                tag.increment(`${egg.eggName}`, { by: 1 })
                            })
                        })
                    })
                    return msg.channel.send(`Congrats ${user[1].username}, you collected a tier ${egg.tier} egg worth ${egg.score} points!`)
                }
            })
        })
    }
});

function getEgg() {
    let val = (Math.random())
    if (val > 0 && val <= 0.3) {
        return new Egg(1, 5, "696547527364968499")
    }
    else if (val > .3 && val <= .55) {
        return new Egg(2, 10, "696547528065155072")
    }
    else if (val > .55 && val <= .75) {
        return new Egg(3, 15, "696547526957858818")
    }
    else if (val > .75 && val <= .9) {
        return new Egg(4, 25, "696547527243202580")
    }
    else if (val > .9 && val <= .98) {
        return new Egg(5, 50, "696547528472002661")
    } else {
        return new Egg(6, 75, "696547527222099969")
    }

}

class Egg {
    constructor(tier, score, emoteId) {
        this.tier = tier
        this.score = score
        this.emote = client.emojis.cache.find(emoji => emoji.id === emoteId);
        this.eggName = "egg" + tier
    }
}

function probability(probValue) {
    return Math.random() < probValue
}

