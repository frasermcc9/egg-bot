//Find account balance

const { Command } = require('discord.js-commando');
const { Sequelize, Model, DataTypes } = require('sequelize')
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db/eggs.sqlite'
});
const { MessageEmbed } = require('discord.js')

module.exports = class eggsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'eggs',
            aliases: ['egg', 'myegg', 'collection'],
            memberName: 'eggs',
            group: 'core',
            description: 'View someones eggs',
            guildOnly: true,
            args: [{
                type: "user",
                prompt: "Who's balance shall we peak at?",
                key: "u",
                default: msg => msg.author
            }]
        });
    }

    run(msg, { u }) {

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

        let uid = u.id;
        sequelize.sync().then(() => {
            User.findOne({ where: { disId: uid } }).then(data => {
                if (data != null) {
                    let confirmMessage = new MessageEmbed()
                        .setTitle("Your Easter Eggs")
                        .setDescription(`Total Score: **${delimit(data.points)}**`)
                        .addField('⠀', `<:egg1:696547527364968499>: ${data.egg1}`, true)
                        .addField('⠀', `<:egg2:696547528065155072>: ${data.egg2}`, true)
                        .addField('⠀', `<:egg3:696547526957858818>: ${data.egg3}`, true)
                        .addField('⠀', `<:egg4:696547527243202580>: ${data.egg4}`, true)
                        .addField('⠀', `<:egg5:696547528472002661>: ${data.egg5}`, true)
                        .addField('⠀', `<:egg6:696547527222099969>: ${data.egg6}`, true)
                        .setColor('#37db00')
                    return msg.say(confirmMessage)
                } else {
                    return msg.say("No eggs :(")
                }

            })
        })


    }
}

function delimit(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}