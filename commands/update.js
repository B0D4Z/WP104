const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder , AttachmentBuilder} = require('discord.js');
const sql = require("../config/Database");
//const Canvas = require('@napi-rs/canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageGuild)
        .setName("update")
        .setDescription("Database Update Tool!"),

    async execute(interaction) {
        const { client } = require('../bot')
        guildIcon = interaction.member.guild.iconURL();
		guildName = interaction.member.guild.name

        const guildByID = await sql.Execute(`SELECT * FROM settings WHERE 1`) //level_up_channel_id = '1000526899124117535'
        const updateEmbed = new EmbedBuilder()
            .setColor('#4ec9b0')
            .setTitle(`Database Update`)
            .setURL('http://www.phfamily.co.uk/')
            .setAuthor({ name: 'Database Update', iconURL: 'http://phfamily.co.uk/img/gifs/Influencer.gif'})
            .setThumbnail('http://phfamily.co.uk/img/gifs/Influencer.gif')
            .addFields(
                { name: `Database`, value: `Updated` },
            )
            .setTimestamp()
            .setFooter({ text: `Database Update.`, iconURL: `http://phfamily.co.uk/img/gifs/Influencer.gif` });

        //Add Guild Specific Tables to DB
        // for (let i = 0; i < guildByID.length; i++) {
        //     let guildID = guildByID[i];
        //     try {
        //         const fullName = guildID.guild_name
        //         const table = 'T' + guildID.guild_id
        //         console.log(table)
        //         const create = await sql.Execute(`CREATE TABLE IF NOT EXISTS ${table}(discord_id varchar(255) NOT NULL, war_coins int(255) NOT NULL default 0, war_chest varchar(255) NOT NULL default 0, base_level int(255) NOT NULL default 0, chest_level int(255) NOT NULL default 0, officer_name varchar(255), officer_level int(255) NOT NULL default 0, skill_level int(255) NOT NULL default 0, unit_camp varchar(255), unit_type varchar(255), unit_level decimal(3,1) NOT NULL default 0, unit_image varchar(255), battle_wins varchar(255) NOT NULL default 0, battle_losses varchar(255) NOT NULL default 0, prestige varchar(255) NOT NULL default 0, PRIMARY KEY (discord_id)) COMMENT='${fullName}';`)  
        //         }
        //     catch (e) {
        //         console.log(e);
        //         console.log(guildID);
        //     }
        // }

        const canvas = Canvas.createCanvas(1200, 600);
		const context = canvas.getContext('2d');
        const background = await Canvas.loadImage('./img/GeneralDeath.png');
        // This uses the canvas dimensions to stretch the image onto the entire canvas
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Use the helpful Attachment class structure to process the file for you
        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'GeneralDeath.png' });



            await interaction.reply({
            ephemeral: true,
            embeds: [updateEmbed],
            files: [attachment]
        });

    },
};