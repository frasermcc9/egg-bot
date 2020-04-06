//Find account balance

const { Command } = require('discord.js-commando');
const { Sequelize, Model, DataTypes } = require('sequelize')
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db/eggs.sqlite'
});
const { MessageEmbed } = require('discord.js')


module.exports = class leadersCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'leaders',
            aliases: ['leader', 'leaderboard'],
            memberName: 'leaders',
            group: 'core',
            description: 'View the leaderboard of egg hunters',
            guildOnly: true,
        });
    }

    run(msg) {

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

        sequelize.sync().then(() => {
            User.findAll().then(async data => {
                if (data != null) {
                    console.log('h')
                    let users = {}
                    data.forEach((el) => {
                        users[el.disId] = el.points
                    })
                    let sorted = Object.entries(users).sort((b, a) => a[1] - b[1]);
                    let output = []

                    for (var i = 0; i < 8; i++) {
                        let el = sorted[i]
                        if (el == undefined) break;
                        let u = await this.client.users.fetch(el[0])
                        output.push(`${i + 1} - ${u} - ${el[1]} Eggs`)
                    }
                    return msg.say(new MessageEmbed()
                        .setTitle('Easter Egg Leaderboard')
                        .setDescription(output.join('\n'))
                        .setColor('#03cffc'))
                } else {
                    return msg.say("No one has eggs :(")
                }

            })
        })


    }
}

function delimit(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}