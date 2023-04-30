const sql = require("../config/Database");
const { Colours } = require('../data/colours')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, Collection, embedLength } = require('discord.js');
module.exports = {
    baseUpgrade: async function (interaction) {
        const guildIcon = interaction.member.guild.iconURL();
        const guildName = interaction.guild.name
        const Level = await sql.Execute(`SELECT * FROM levels WHERE discord_id = '${interaction.member.id}'`)
        const wallet = Level[0].war_coins
        const bank = Level[0].war_chest
        const bankLevel = Level[0].chest_level
        const baseLevel = Level[0].base_level
        const cost = (baseLevel + 1) * 25000
        let CampColour = Colours.Green
        if (Level[0].unit_camp === 'Vanguard') {
            CampColour = Colours.Vanguard
        }
        if (Level[0].unit_camp === 'Liberty') {
            CampColour = Colours.Liberty
        }
        if (Level[0].unit_camp === 'MartyrsW') {
            CampColour = Colours.MartyrsW
        }
        const upgradeButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("bank")
                    .setLabel('War-Chest')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("base")
                    .setLabel('War-Base')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("officer")
                    .setLabel('Officer')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("troop")
                    .setLabel('Unit')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("profile")
                    .setLabel('Profile')
                    .setStyle(ButtonStyle.Secondary),
            )
        const upgradeBase = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("buybase")
                    .setLabel('Upgrade')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("profile")
                .setLabel('Profile')
                .setStyle(ButtonStyle.Secondary),
            )
        const upgradeEmbed = new EmbedBuilder();
        upgradeEmbed
            .setColor(CampColour)
            .setThumbnail(guildIcon)
            .setTimestamp()
            .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
            .addFields(
                { name: `War-Coins:`, value: `$${wallet.toLocaleString()}`, inline: true },
                { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                { name: `Current Level:`, value: `${baseLevel}`, inline: true },
                { name: `Upgrade Cost:`, value: `$${cost.toLocaleString()}`, inline: true },
            )
            .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });
        return interaction.update({ embeds: [upgradeEmbed], components: [upgradeBase] })
    },
    buyBank: async function (interaction) {
        const Level = await sql.Execute(`SELECT * FROM levels WHERE discord_id = '${interaction.member.id}'`)
        let CampColour = Colours.Green
        if (Level[0].unit_camp === 'Vanguard') {
            CampColour = Colours.Vanguard
        }
        if (Level[0].unit_camp === 'Liberty') {
            CampColour = Colours.Liberty
        }
        if (Level[0].unit_camp === 'MartyrsW') {
            CampColour = Colours.MartyrsW
        }
        const upgradeBankEmbed = new EmbedBuilder();
        const upgradeButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("bank")
                    .setLabel('War-Chest')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("base")
                    .setLabel('War-Base')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("officer")
                    .setLabel('Officer')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("troop")
                    .setLabel('Unit')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("profile")
                    .setLabel('Profile')
                    .setStyle(ButtonStyle.Secondary),
            )
        const upgradeBankButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("buybank")
                    .setLabel('Upgrade')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("profile")
                .setLabel('Profile')
                .setStyle(ButtonStyle.Secondary),
            )
        const guildIcon = interaction.member.guild.iconURL();
        const guildName = interaction.member.guild.name
        const wallet = Level[0].war_coins
        const bank = Level[0].war_chest
        const baseLevel = Level[0].base_level
        const bankLevel = Level[0].chest_level
        const cost = (bankLevel + 1) * 10000
        if (bankLevel > baseLevel) {
            console.log(`Base Upgrade Needed`),
                upgradeBankEmbed
                    .setColor(CampColour)
                    .setThumbnail(guildIcon)
                    .setTimestamp()
                    .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`${interaction.member}, You need to upgrade your **War-Base** for this upgrade.`)
                    .addFields(
                        { name: `War-Coins:`, value: `$${wallet.toLocaleString()}`, inline: true },
                        { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                        { name: `Bank Level:`, value: `${bankLevel}`, inline: true },
                        { name: `Base Level:`, value: `${baseLevel}`, inline: true },
                    )
                    .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });

            return interaction.update({ embeds: [upgradeBankEmbed], components: [upgradeButtons] })
        }
        if (cost > wallet) {
            console.log(`No Money`),
                difference = cost - wallet
            upgradeBankEmbed
                .setColor(CampColour)
                .setThumbnail(guildIcon)
                .setTimestamp()
                .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                .setDescription(`${interaction.member}, You do not have enough **War-Coins** for this upgrade.\nYou are **$${difference.toLocaleString()} War-Coins short**!\nTry withdrawing from your **War-Chest**!`)
                .addFields(
                    { name: `War-Coins:`, value: `$${wallet.toLocaleString()}`, inline: true },
                    { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                    { name: `Current Level:`, value: `${bankLevel}`, inline: true },
                    { name: `Upgrade Cost:`, value: `$${cost.toLocaleString()}`, inline: true },
                )
                .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });

            return interaction.update({ embeds: [upgradeBankEmbed], components: [upgradeBankButtons] })
        }
        const newWallet = wallet - cost
        const newBank = bankLevel + 1
        upgradeBankEmbed
            .setColor(CampColour)
            .setThumbnail(guildIcon)
            .setTimestamp()
            .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
            .setDescription(`**${interaction.member}, War-Chest Upgrade Successful**`)
            .addFields(
                { name: `War-Coins:`, value: `$${newWallet.toLocaleString()}`, inline: true },
                { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                { name: `New Level:`, value: `${newBank}`, inline: true },
            )
            .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });
        const bankUpgrade = await sql.Execute(`UPDATE levels SET war_coins = ${newWallet}, chest_level = '${newBank}' WHERE discord_id = '${interaction.member.id}'`)
        console.log(`Bank: ${bankUpgrade.info}`)
        return interaction.update({ embeds: [upgradeBankEmbed], components: [upgradeButtons] })
    },
    buyBase: async function (interaction) {
        const Level = await sql.Execute(`SELECT * FROM levels WHERE discord_id = '${interaction.member.id}'`)
        let CampColour = Colours.Green
        if (Level[0].unit_camp === 'Vanguard') {
            CampColour = Colours.Vanguard
        }
        if (Level[0].unit_camp === 'Liberty') {
            CampColour = Colours.Liberty
        }
        if (Level[0].unit_camp === 'MartyrsW') {
            CampColour = Colours.MartyrsW
        }
        const upgradeBaseEmbed = new EmbedBuilder();
        const upgradeButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("bank")
                    .setLabel('War-Chest')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("base")
                    .setLabel('War-Base')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("officer")
                    .setLabel('Officer')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("troop")
                    .setLabel('Unit')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("profile")
                    .setLabel('Profile')
                    .setStyle(ButtonStyle.Secondary),
            )
        const upgradeBaseButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("buybase")
                    .setLabel('Upgrade')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("profile")
                .setLabel('Profile')
                .setStyle(ButtonStyle.Secondary),
            )
        const guildIcon = interaction.member.guild.iconURL();
        const guildName = interaction.member.guild.name
        const wallet = Level[0].war_coins
        const bank = Level[0].war_chest
        const baseLevel = Level[0].base_level
        const bankLevel = Level[0].chest_level
        const cost = (baseLevel + 1) * 25000
        if (baseLevel > bankLevel) {
            console.log(`Chest Upgrade Needed`),
                upgradeBaseEmbed
                    .setColor(CampColour)
                    .setThumbnail(guildIcon)
                    .setTimestamp()
                    .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`${interaction.member}, You need to upgrade your **War-Chest** for this upgrade.`)
                    .addFields(
                        { name: `War-Coins:`, value: `$${wallet.toLocaleString()}`, inline: true },
                        { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                        { name: `Base Level:`, value: `${baseLevel}`, inline: true },
                        { name: `Bank Level:`, value: `${bankLevel}`, inline: true },
                    )
                    .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });
            return interaction.update({ embeds: [upgradeBaseEmbed], components: [upgradeButtons] })
        }


        if (cost > wallet) {
            console.log(`No Money`),
                difference = cost - wallet
            upgradeBaseEmbed
                .setColor(CampColour)
                .setThumbnail(guildIcon)
                .setTimestamp()
                .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                .setDescription(`${interaction.member}, You do not have enough **War-Coins** for this upgrade.\nYou are **$${difference.toLocaleString()} War-Coins short**!\nTry withdrawing from your **War-Chest**!`)
                .addFields(
                    { name: `War-Coins:`, value: `$${wallet.toLocaleString()}`, inline: true },
                    { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                    { name: `Current Level:`, value: `${baseLevel}`, inline: true },
                    { name: `Upgrade Cost:`, value: `$${cost.toLocaleString()}`, inline: true },
                )
                .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });
            return interaction.update({ embeds: [upgradeBaseEmbed], components: [upgradeBaseButtons] })
        }
        const newWallet = wallet - cost
        const newBase = baseLevel + 1
        upgradeBaseEmbed
            .setColor(CampColour)
            .setThumbnail(guildIcon)
            .setTimestamp()
            .setDescription(`**${interaction.member}, Base Upgrade Successful**`)
            .addFields(
                { name: `War-Coins:`, value: `$${newWallet.toLocaleString()}`, inline: true },
                { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                { name: `New Level:`, value: `${newBase}`, inline: true },
            )
            .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });
        const baseUpgrade = await sql.Execute(`UPDATE levels SET war_coins = ${newWallet}, base_level = '${newBase}' WHERE discord_id = '${interaction.member.id}'`)
        console.log(`Base ${baseUpgrade.info}`)
        return interaction.update({ embeds: [upgradeBaseEmbed], components: [upgradeButtons] })

    },
    buyOfficer: async function (interaction) {
        const Level = await sql.Execute(`SELECT * FROM levels WHERE discord_id = '${interaction.member.id}'`)
        let CampColour = Colours.Green
        if (Level[0].unit_camp === 'Vanguard') {
            CampColour = Colours.Vanguard
        }
        if (Level[0].unit_camp === 'Liberty') {
            CampColour = Colours.Liberty
        }
        if (Level[0].unit_camp === 'MartyrsW') {
            CampColour = Colours.MartyrsW
        }
        const upgradeOfficerEmbed = new EmbedBuilder();
        const upgradeButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("bank")
                    .setLabel('War-Chest')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("base")
                    .setLabel('War-Base')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("officer")
                    .setLabel('Officer')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("troop")
                    .setLabel('Unit')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("profile")
                    .setLabel('Profile')
                    .setStyle(ButtonStyle.Secondary),
            )
        const upgradeOfficerButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("buyofficer")
                    .setLabel('Upgrade')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("profile")
                .setLabel('Profile')
                .setStyle(ButtonStyle.Secondary),
            )
        const guildIcon = interaction.member.guild.iconURL();
        const guildName = interaction.member.guild.name
        const wallet = Level[0].war_coins
        const bank = Level[0].war_chest
        const officerLevel = Level[0].officer_level
        const baseLevel = Level[0].base_level
        const cost = (officerLevel + 1) * 50000

        if (officerLevel > baseLevel) {
            console.log(`Base Upgrade Needed`),
                upgradeOfficerEmbed
                    .setColor(CampColour)
                    .setThumbnail(guildIcon)
                    .setTimestamp()
                    .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`${interaction.member}, You need to upgrade your **War-Base** for this upgrade.`)
                    .addFields(
                        { name: `War-Coins:`, value: `$${wallet.toLocaleString()}`, inline: true },
                        { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                        { name: `Base Level:`, value: `${baseLevel}`, inline: true },
                    )
                    .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });
            return interaction.update({ embeds: [upgradeOfficerEmbed], components: [upgradeButtons] })
        }


        if (cost > wallet) {
            console.log(`No Money`),
                difference = cost - wallet
            upgradeOfficerEmbed
                .setColor(CampColour)
                .setThumbnail(guildIcon)
                .setTimestamp()
                .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                .setDescription(`${interaction.member}, You do not have enough **War-Coins** for this upgrade.\nYou are **$${difference.toLocaleString()} War-Coins** short!\nTry withdrawing from your **War-Chest**!`)
                .addFields(
                    { name: `War-Coins:`, value: `$${wallet.toLocaleString()}`, inline: true },
                    { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                    { name: `Officer Level:`, value: `${officerLevel}`, inline: true },
                    { name: `Upgrade Cost:`, value: `$${cost.toLocaleString()}`, inline: true },
                )
                .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });
            return interaction.update({ embeds: [upgradeOfficerEmbed], components: [upgradeOfficerButtons] })
        }
        const newWallet = wallet - cost
        const newOfficer = officerLevel + 1
        upgradeOfficerEmbed
            .setColor(CampColour)
            .setThumbnail(guildIcon)
            .setTimestamp()
            .setDescription(`**${interaction.member}, Officer Upgrade Successful**`)
            .addFields(
                { name: `War-Coins:`, value: `$${newWallet.toLocaleString()}`, inline: true },
                { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                { name: `New Level:`, value: `${newOfficer}`, inline: true },
            )
            .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });

            const playerOfficerUpgrade = await sql.Execute(`UPDATE playerofficers SET Officer_Level = '${newOfficer}' WHERE Discord_ID = '${interaction.member.id}' AND Officer_Name = '${Level[0].officer_name}'`)
            const officerUpgrade = await sql.Execute(`UPDATE levels SET war_coins = ${newWallet}, officer_level = '${newOfficer}' WHERE discord_id = '${interaction.member.id}'`)
            console.log(`Update Player Officer: ${playerOfficerUpgrade.info}`)
            console.log(`Officer Upgrade: ${officerUpgrade.info}`)

        return interaction.update({ embeds: [upgradeOfficerEmbed], components: [upgradeButtons] })

    },
    cancel: async function (interaction) {
        const guildIcon = interaction.member.guild.iconURL();
        const guildName = interaction.member.guild.name
        const Level = await sql.Execute(`SELECT * FROM levels WHERE discord_id = '${interaction.member.id}'`)
        let CampColour = Colours.Green
        if (Level[0].unit_camp === 'Vanguard') {
            CampColour = Colours.Vanguard
        }
        if (Level[0].unit_camp === 'Liberty') {
            CampColour = Colours.Liberty
        }
        if (Level[0].unit_camp === 'MartyrsW') {
            CampColour = Colours.MartyrsW
        }
        const wallet = Level[0].war_coins
        const bank = Level[0].war_chest
 
        const upgradeButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("bank")
                    .setLabel('War-Chest')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("base")
                    .setLabel('War-Base')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("officer")
                    .setLabel('Officer')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("troop")
                    .setLabel('Unit')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("profile")
                    .setLabel('Profile')
                    .setStyle(ButtonStyle.Secondary),
            )
        const upgradeEmbed = new EmbedBuilder();
        upgradeEmbed
            .setColor(CampColour)
            .setThumbnail(guildIcon)
            .setTimestamp()
            .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
            .setDescription(`**${interaction.member}, What would you like to upgrade**?`)
            .addFields(
                { name: `War-Coins:`, value: `$${wallet.toLocaleString()}`, inline: true },
                { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
            )
            .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });
        return interaction.update({ embeds: [upgradeEmbed], components: [upgradeButtons] })

    },
    chestUpgrade: async function (interaction) {
        const guildIcon = interaction.member.guild.iconURL();
        const setDate = time.default()
        const guildName = interaction.guild.name
        const Level = await sql.Execute(`SELECT * FROM levels WHERE discord_id = '${interaction.member.id}'`)
        let CampColour = Colours.Green
        if (Level[0].unit_camp === 'Vanguard') {
            CampColour = Colours.Vanguard
        }
        if (Level[0].unit_camp === 'Liberty') {
            CampColour = Colours.Liberty
        }
        if (Level[0].unit_camp === 'MartyrsW') {
            CampColour = Colours.MartyrsW
        }
        const wallet = Level[0].war_coins
        const bank = Level[0].war_chest
        const bankLevel = Level[0].chest_level
        const baseLevel = Level[0].base_level
        const cost = (bankLevel + 1) * 10000

        const upgradeChestButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("buybank")
                    .setLabel('Upgrade')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("profile")
                .setLabel('Profile')
                .setStyle(ButtonStyle.Secondary),
            )

        const upgradeChestEmbed = new EmbedBuilder();
        upgradeChestEmbed
            .setColor(CampColour)
            .setThumbnail(guildIcon)
            .setTimestamp()
            .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
            .setDescription(`**${interaction.member}, Confirm the upgrade your War-Chest**?`)
            .addFields(
                { name: `War-Coins:`, value: `$${wallet.toLocaleString()}`, inline: true },
                { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                { name: `Current Level:`, value: `${bankLevel}`, inline: true },
                { name: `Upgrade Cost:`, value: `$${cost.toLocaleString()}`, inline: true },
            )
            .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });

        return interaction.update({ embeds: [upgradeChestEmbed], components: [upgradeChestButtons] })
    },
    officerSelect: async function (interaction) {
        const Level = await sql.Execute(`SELECT * FROM levels WHERE discord_id = '${interaction.member.id}'`)

        const selectOfficerEmbed = new EmbedBuilder();
        const selectOfficerButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel('Upgrade')
                    .setStyle(ButtonStyle.Success),
            )
        const guildIcon = interaction.member.guild.iconURL();
        const guildName = interaction.member.guild.name
        const Officer = await sql.Execute(`SELECT * FROM officers WHERE Officer_Type = 'GROUND'`)
        const officerSelection = Officer[Math.floor(Math.random() * Officer.length)]
        selectOfficerEmbed
            .setColor(CampColour)
            .setThumbnail(guildIcon)
            .setTimestamp()
            .setDescription(`**${interaction.member}, Officer Selection Successful**`)
            .addFields(
                { name: `Officer:`, value: `${officerSelection.Officer_Name}`, inline: true },
                { name: `Camp:`, value: `${officerSelection.Officer_Camp}`, inline: true },
                { name: `Skill:`, value: `${officerSelection.Skill}`, inline: true },
            )
            .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });

        const addOfficer = await sql.Execute(`INSERT INTO playerofficers (Discord_ID, Officer_ID, Officer_Type, Officer_Name, Officer_Camp, Skill, Skill_Level, Image) VALUES ('${interaction.member.id}', '${officerSelection.Officer_ID}', '${officerSelection.Officer_Type}', '${officerSelection.Officer_Name}', '${officerSelection.Officer_Camp}', '${officerSelection.Skill}', '${officerSelection.Image}', '0')`)
        const updateOfficer = await sql.Execute(`UPDATE levels SET officer_name	= '${officerSelection.Officer_Name}', officer_level = '1' WHERE discord_id = '${interaction.member.id}'`)
        console.log(`Add Officer: ${addOfficer.info}`)
        console.log(`Officer Select: ${updateOfficer.info}`)
        return interaction.update({ embeds: [selectOfficerEmbed], components: [selectOfficerButtons] })

    },
    officerUpgrade: async function (interaction) {
        const upgradeOfficerEmbed = new EmbedBuilder();
        const guildIcon = interaction.member.guild.iconURL();
        const guildName = interaction.guild.name
        const Level = await sql.Execute(`SELECT * FROM levels WHERE discord_id = '${interaction.member.id}'`)
        let CampColour = Colours.Green
        if (Level[0].unit_camp === 'Vanguard') {
            CampColour = Colours.Vanguard
        }
        if (Level[0].unit_camp === 'Liberty') {
            CampColour = Colours.Liberty
        }
        if (Level[0].unit_camp === 'MartyrsW') {
            CampColour = Colours.MartyrsW
        }
        const wallet = Level[0].war_coins
        const bank = Level[0].war_chest
        const baseLevel = Level[0].base_level
        const officerLevel = Level[0].officer_level
        const cost = (officerLevel + 1) * 50000

        const upgradeOfficerButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("buyofficer")
                    .setLabel('Upgrade')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("newofficer")
                    .setLabel('New Officer')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("skillupgrade")
                    .setLabel('Upgrade Skill')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("profile")
                    .setLabel('Profile')
                    .setStyle(ButtonStyle.Secondary),
            )
        const chooseOfficerButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("officerselect")
                    .setLabel('Select')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("profile")
                    .setLabel('Profile')
                    .setStyle(ButtonStyle.Secondary),
                )
        const upgradeButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("bank")
                    .setLabel('War-Chest')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("base")
                    .setLabel('War-Base')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("officer")
                    .setLabel('Officer')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("troop")
                    .setLabel('Unit')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("profile")
                    .setLabel('Profile')
                    .setStyle(ButtonStyle.Secondary),
            )

        if (baseLevel < 1) {
            upgradeOfficerEmbed
                .setColor(CampColour)
                .setThumbnail(guildIcon)
                .setTimestamp()
                .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                .setDescription(`${interaction.member}, You need to upgrade your **Base** to Select your **Officer**?`)
                .addFields(
                    { name: `War-Coins:`, value: `$${wallet.toLocaleString()}`, inline: true },
                    { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                    { name: `Base Level:`, value: `${baseLevel}`, inline: true },
                )
                .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });
            return interaction.update({ embeds: [upgradeOfficerEmbed], components: [upgradeButtons] })
        }
        const officer = Level[0].officer_name

        if (officer === '') {

            upgradeOfficerEmbed
                .setColor(CampColour)
                .setThumbnail(guildIcon)
                .setTimestamp()
                .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                .setDescription(`**${interaction.member}**, First you need to select your **Officer**!`)
                .addFields(
                    { name: `War-Coins:`, value: `$${wallet.toLocaleString()}`, inline: true },
                    { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                )
                .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });
            return interaction.update({ embeds: [upgradeOfficerEmbed], components: [chooseOfficerButtons] })

        } else
            upgradeOfficerEmbed
                .setColor(CampColour)
                .setThumbnail(guildIcon)
                .setTimestamp()
                .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                .setDescription(`**${interaction.member}, Confirm the upgrade your Officer**?`)
                .addFields(
                    { name: `War-Coins:`, value: `$${wallet.toLocaleString()}`, inline: true },
                    { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                    { name: `Officer Level:`, value: `${officerLevel}`, inline: true },
                    { name: `Upgrade Cost:`, value: `$${cost.toLocaleString()}`, inline: true },
                )
                .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });

        return interaction.update({ embeds: [upgradeOfficerEmbed], components: [upgradeOfficerButtons] })
    },
    unitUpgrade: async function (interaction) {
        const upgradeUnitEmbed = new EmbedBuilder();
        const guildIcon = interaction.member.guild.iconURL();
        const guildName = interaction.guild.name
        const Level = await sql.Execute(`SELECT * FROM levels WHERE discord_id = '${interaction.member.id}'`)
        let CampColour = Colours.Green
        if (Level[0].unit_camp === 'Vanguard') {
            CampColour = Colours.Vanguard
        }
        if (Level[0].unit_camp === 'Liberty') {
            CampColour = Colours.Liberty
        }
        if (Level[0].unit_camp === 'MartyrsW') {
            CampColour = Colours.MartyrsW
        }
        const wallet = Level[0].war_coins
        const bank = Level[0].war_chest
        const unitLevel = Level[0].unit_level
        const officer = Level[0].officer
        const prestige = Level[0].prestige + 1
        const officerLevel = Level[0].officer_level
        const cost = (unitLevel + 1) * (125000 * prestige)

        const upgradeUnitButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("buyunit")
                    .setLabel('Upgrade')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("profile")
                .setLabel('Profile')
                .setStyle(ButtonStyle.Secondary),
            )
        const chooseUnitButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("unitselect")
                    .setLabel('Select')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("profile")
                .setLabel('Profile')
                .setStyle(ButtonStyle.Secondary),
            )
        const upgradeButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("bank")
                    .setLabel('War-Chest')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("base")
                    .setLabel('War-Base')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("officer")
                    .setLabel('Officer')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("troop")
                    .setLabel('Unit')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("profile")
                    .setLabel('Profile')
                    .setStyle(ButtonStyle.Secondary),
            )

        if (officerLevel < 1) {
            upgradeUnitEmbed
                .setColor(CampColour)
                .setThumbnail(guildIcon)
                .setTimestamp()
                .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                .setDescription(`${interaction.member}, You need to upgrade your **Officer** to Select your **Unit**?`)
                .addFields(
                    { name: `War-Coins:`, value: `$${wallet.toLocaleString()}`, inline: true },
                    { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                    { name: `Unit Level:`, value: `${unitLevel}`, inline: true },
                )
                .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });

            return interaction.update({ embeds: [upgradeUnitEmbed], components: [upgradeButtons] })
        } else
            if (unitLevel === '0.0') {

                upgradeUnitEmbed
                    .setColor(CampColour)
                    .setThumbnail(guildIcon)
                    .setTimestamp()
                    .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`**${interaction.member}**, First you need to select your **Unit**!`)
                    .addFields(
                        { name: `War-Coins:`, value: `$${wallet.toLocaleString()}`, inline: true },
                        { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                    )
                    .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });

                return interaction.update({ embeds: [upgradeUnitEmbed], components: [chooseUnitButtons] })

            } else
                upgradeUnitEmbed
                    .setColor(CampColour)
                    .setThumbnail(guildIcon)
                    .setTimestamp()
                    .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`**${interaction.member}, Confirm the upgrade your Unit**?`)
                    .addFields(
                        { name: `War-Coins:`, value: `$${wallet.toLocaleString()}`, inline: true },
                        { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                        { name: `Unit Level:`, value: `${unitLevel}`, inline: true },
                        { name: `Upgrade Cost:`, value: `$${cost.toLocaleString()}`, inline: true },
                    )
                    .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });
        return interaction.update({ embeds: [upgradeUnitEmbed], components: [upgradeUnitButtons] })
    },
    unitSelect: async function (interaction) {
        const Level = await sql.Execute(`SELECT * FROM levels WHERE discord_id = '${interaction.member.id}'`)
        let CampColour = Colours.Green
        if (Level[0].unit_camp === 'Vanguard') {
            CampColour = Colours.Vanguard
        }
        if (Level[0].unit_camp === 'Liberty') {
            CampColour = Colours.Liberty
        }
        if (Level[0].unit_camp === 'MartyrsW') {
            CampColour = Colours.MartyrsW
        }
        const selectUnitEmbed = new EmbedBuilder();
        const selectUnitButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel('Upgrade')
                    .setStyle(ButtonStyle.Success),
            )
        const guildIcon = interaction.member.guild.iconURL();
        const guildName = interaction.member.guild.name
        const Unit = await sql.Execute(`SELECT * FROM units WHERE Unit_Level = '4.0' AND Unit_Type = 'MediumTanks'`)
        const unitSelection = Unit[Math.floor(Math.random() * Unit.length)]

        selectUnitEmbed
            .setColor(CampColour)
            .setThumbnail(guildIcon)
            .setTimestamp()
            .setDescription(`**${interaction.member}, Unit Selection Successful**`)
            .addFields(
                { name: `Unit Name:`, value: `${unitSelection.Unit_Name}`, inline: true },
                { name: `Unit Level:`, value: `${unitSelection.Unit_Level}`, inline: true },
                { name: `Camp:`, value: `${unitSelection.Camp}`, inline: true },
                { name: `Unit Type:`, value: `${unitSelection.Unit_Type}`, inline: true },
                { name: `Firepower:`, value: `${unitSelection.Firepower}`, inline: true },
                { name: `HP:`, value: `${unitSelection.HP}`, inline: true },
                { name: `Speed:`, value: `${unitSelection.Speed}`, inline: true },
            )
            .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });
        const saveUnit = await sql.Execute(`INSERT INTO playerunits (discord_id, camp, unit_type, unit_level, unit_id) VALUES ('${interaction.member.id}', '${unitSelection.Camp}', '${unitSelection.Unit_Type}', '${unitSelection.Unit_Level}', '${unitSelection.Unit_ID}')`)
        console.log(saveUnit.info)
        const updateOfficer = await sql.Execute(`UPDATE levels SET Unit_Camp = '${unitSelection.Camp}', Unit_Type = '${unitSelection.Unit_Type}', Unit_Level = '${unitSelection.Unit_Level}' WHERE discord_id = '${interaction.member.id}'`)
        console.log(updateOfficer.info)
        return interaction.update({ embeds: [selectUnitEmbed], components: [selectUnitButtons] })
    },
    buyUnit: async function (interaction) {
        const Level = await sql.Execute(`SELECT * FROM levels WHERE discord_id = '${interaction.member.id}'`)
        const camp = Level[0].unit_camp
        let CampColour = Colours.Green
        if (Level[0].unit_camp === 'Vanguard') {
            CampColour = Colours.Vanguard
        }
        if (Level[0].unit_camp === 'Liberty') {
            CampColour = Colours.Liberty
        }
        if (Level[0].unit_camp === 'MartyrsW') {
            CampColour = Colours.MartyrsW
        }
        const upgradeUnitEmbed = new EmbedBuilder();
        const upgradeButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("bank")
                    .setLabel('War-Chest')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("base")
                    .setLabel('War-Base')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("officer")
                    .setLabel('Officer')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("troop")
                    .setLabel('Unit')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("profile")
                    .setLabel('Profile')
                    .setStyle(ButtonStyle.Secondary),
            )
        const newUnitButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("bank")
                    .setLabel('War-Chest')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("base")
                    .setLabel('War-Base')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("officer")
                    .setLabel('Officer')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("newUnit")
                    .setLabel('Select New Unit')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("profile")
                    .setLabel('Profile')
                    .setStyle(ButtonStyle.Secondary),
            )

        const upgradeUnitButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("buyunit")
                    .setLabel('Upgrade')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("profile")
                .setLabel('Profile')
                .setStyle(ButtonStyle.Secondary),
            )
        const guildIcon = interaction.member.guild.iconURL();
        const guildName = interaction.member.guild.name
        const unitType = Level[0].unit_type
        const unitLevel = Level[0].unit_level
        const wallet = Level[0].war_coins
        const bank = Level[0].war_chest
        const officerLevel = Level[0].officer_level
        const prestige = Level[0].prestige + 1
        const cost = (unitLevel + 1) * (125000 * prestige)

        if (unitLevel === '9.2') {
            console.log(`Unit Maxed`),

                upgradeUnitEmbed
                    .setColor(CampColour)
                    .setThumbnail(guildIcon)
                    .setTimestamp()
                    .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`${interaction.member}, You have already **Maxed** your **${unitType}**.\nUpgrade your **Officer** to increase your **Battle Rewards**!\nUpgrade your **War-Base** to increase your **Unit Strength**!\nSelect **New Unit** below to receive your next **Unit**`)
                    .addFields(
                        { name: `War-Coins:`, value: `$${wallet.toLocaleString()}`, inline: true },
                        { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                        { name: `Unit Level:`, value: `${unitLevel}`, inline: true },
                    )
                    .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });

            return interaction.update({ embeds: [upgradeUnitEmbed], components: [newUnitButtons] })
        }

        if (unitLevel > officerLevel) {
            console.log(`Officer Upgrade Needed`),
                upgradeUnitEmbed
                    .setColor(CampColour)
                    .setThumbnail(guildIcon)
                    .setTimestamp()
                    .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`${interaction.member}, You need to upgrade your **Officer** for this upgrade.`)
                    .addFields(
                        { name: `War-Coins:`, value: `$${wallet.toLocaleString()}`, inline: true },
                        { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                        { name: `Officer Level:`, value: `${officerLevel}`, inline: true },
                        { name: `Unit Level:`, value: `${unitLevel}`, inline: true },
                    )
                    .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });

            return interaction.update({ embeds: [upgradeUnitEmbed], components: [upgradeButtons] })
        } else


            if (cost > wallet) {
                console.log(`No Money`),
                    difference = cost - wallet
                upgradeUnitEmbed
                    .setColor(CampColour)
                    .setThumbnail(guildIcon)
                    .setTimestamp()
                    .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`${interaction.member}, You do not have enough **War-Coins** for this upgrade.\nYou are **$${difference.toLocaleString()} War-Coins** short!\nTry withdrawing from your **War-Chest**!`)
                    .addFields(
                        { name: `War-Coins:`, value: `$${wallet.toLocaleString()}`, inline: true },
                        { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                        { name: `Unit Level:`, value: `${unitLevel}`, inline: true },
                        { name: `Upgrade Cost:`, value: `$${cost.toLocaleString()}`, inline: true },
                    )
                    .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });
                return interaction.update({ embeds: [upgradeUnitEmbed], components: [upgradeUnitButtons] })
            }
        const newWallet = (wallet - cost)
        const newUnit = await sql.Execute(`SELECT * FROM units WHERE Camp = '${camp}' AND Unit_Type = '${unitType}' AND Unit_Level > '${unitLevel}'`)
        const newLevel = newUnit[0].Unit_Level
        const newName = newUnit[0].Unit_Name
        const newFirepower = newUnit[0].Firepower
        const newHP = newUnit[0].HP
        const newSpeed = newUnit[0].Speed
        const newID = newUnit[0].Unit_ID
        const newImage = newUnit[0].Unit_Type
        const newEmoji = newImage.replace('.jpg', '')
        console.log(newEmoji)


        upgradeUnitEmbed
            .setColor(CampColour)
            .setThumbnail(guildIcon)
            .setTimestamp()
            .setDescription(`**${interaction.member}, Unit Upgrade Successful**`)
            .addFields(
                { name: `War-Coins:`, value: `$${newWallet.toLocaleString()}`, inline: true },
                { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                { name: `Level:`, value: `${newLevel.toLocaleString()}`, inline: true },
                { name: `Unit:`, value: `${newName}`, inline: true },
                { name: `Firepower:`, value: `${newFirepower.toLocaleString()}`, inline: true },
                { name: `Health:`, value: `${newHP.toLocaleString()}`, inline: true },
                { name: `Speed:`, value: `${newSpeed.toLocaleString()}`, inline: true },

            )
            .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });

        const unitUpgrade = await sql.Execute(`UPDATE levels SET War_Coins = ${newWallet}, Unit_Level = '${newLevel}' WHERE discord_id = '${interaction.member.id}'`)
        console.log(`Levels Unit Update${unitUpgrade.info}`)
        const updateUnit = await sql.Execute(`UPDATE playerunits SET emoji = '${newEmoji}', unit_level = '${newLevel}', unit_id = '${newID}' WHERE discord_id = '${interaction.member.id}' AND camp = '${Level[0].unit_camp}' AND unit_type = '${Level[0].unit_type}'`)
        console.log(`Player Unit Update ${updateUnit.info}`)
        return interaction.update({ embeds: [upgradeUnitEmbed], components: [upgradeButtons] })
    },
    profile: async function (interaction) {
        const Level = await sql.Execute(`SELECT * FROM levels WHERE discord_id = '${interaction.member.id}'`)
        let CampColour = Colours.Green
        if (Level[0].unit_camp === 'Vanguard') {
            CampColour = Colours.Vanguard
        }
        if (Level[0].unit_camp === 'Liberty') {
            CampColour = Colours.Liberty
        }
        if (Level[0].unit_camp === 'MartyrsW') {
            CampColour = Colours.MartyrsW
        }
        const profileEmbed = new EmbedBuilder();
        const profileButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("campaign")
                    .setLabel('Campaign')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("selectunit")
                    .setLabel('Select Unit')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("selectofficer")
                    .setLabel('Select Officer')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel('Upgrade')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("profile")
                    .setLabel('Profile')
                    .setStyle(ButtonStyle.Secondary),
            )
        const guildIcon = interaction.member.guild.iconURL();
        const guildName = interaction.member.guild.name
        const officerLevel = Level[0].officer_level || 'No Officer Chosen'
        const officer = Level[0].officer_name || 'No Officer Chosen'
        const unitType = Level[0].unit_type || 'No Unit Trained'
        const unitLevel = Level[0].unit_level || 'No Unit Trained'
        const unitCamp = Level[0].unit_camp || 'No Unit Trained'
        const officerDetails = await sql.Execute(`SELECT * from officers WHERE Officer_Name = '${officer}'`)
        const officerType = officerDetails[0].Officer_Type || 'No Officer Chosen'
        const officerCamp = officerDetails[0].Officer_Camp || 'No Officer Chosen'
        const officerSkill = officerDetails[0].Skill || 'No Officer Chosen'
        const skillLevel = Level[0].skill_level || 'No Officer Chosen'

        const unitDetails = await sql.Execute(`SELECT * FROM units WHERE Camp = '${Level[0].unit_camp}' AND Unit_type = '${Level[0].unit_type}' AND Unit_Level = '${Level[0].unit_level}'`)
        const image = unitDetails[0].Image
        const link = `http://phfamily.co.uk/img/${image}`

        profileEmbed
            .setImage(link)
            .setThumbnail(link)
            .setColor(CampColour)
            .setTimestamp()
            .setDescription(`**${interaction.member}'s Profile**`)
            .addFields(
                { name: `War-Coins:`, value: `$${Level[0].war_coins.toLocaleString()}`, inline: false },
                { name: `War-Chest:`, value: `$${Level[0].war_chest.toLocaleString()}`, inline: false },
                { name: `War-Chest Level:`, value: `${Level[0].chest_level.toLocaleString()}`, inline: false },
                { name: `Base Level:`, value: `${Level[0].base_level}`, inline: false },
                { name: `Officer:`, value: `${officer}`, inline: false },
                { name: `Officer Level:`, value: `${officerLevel}`, inline: false },
                { name: `Officer Type:`, value: `${officerType}`, inline: false },
                { name: `Officer Camp:`, value: `${officerCamp}`, inline: false },
                { name: `Officer Skill:`, value: `${officerSkill}`, inline: false },
                { name: `Skill Level:`, value: `${skillLevel}`, inline: false },
                { name: `Skill Trigger Rate:`, value: `${skillLevel * 5 + 5}%`, inline: false },
                { name: `Unit Type:`, value: `${unitType}`, inline: false },
                { name: `Unit Level:`, value: `${unitLevel}`, inline: false },
                { name: `Attack Type:`, value: `${unitDetails[0].Attack_Type}`, inline: false },
                { name: `Unit Camp:`, value: `${unitCamp}`, inline: false },
            )
            .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });


        return interaction.update({ empheral: true, embeds: [profileEmbed], components: [profileButtons] })

    },
    newUnit: async function (interaction) {
        const Level = await sql.Execute(`SELECT * FROM levels WHERE discord_id = '${interaction.member.id}'`)
        let CampColour = Colours.Green
        if (Level[0].unit_camp === 'Vanguard') {
            CampColour = Colours.Vanguard
        }
        if (Level[0].unit_camp === 'Liberty') {
            CampColour = Colours.Liberty
        }
        if (Level[0].unit_camp === 'MartyrsW') {
            CampColour = Colours.MartyrsW
        }
        const prestige = Level[0].prestige
        const newPrestige = prestige + 1
 
        const newUnitEmbed = new EmbedBuilder();
        const newUnitButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel('Upgrade')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("profile")
                    .setLabel('Profile')
                    .setStyle(ButtonStyle.Primary),
            )
        const guildIcon = interaction.member.guild.iconURL();
        const guildName = interaction.member.guild.name

        newUnitSelection = async function (prestige) {
        if (prestige === 0) return newUnitLevel = '5.0', newUnitType = 'Fighters'
        if (prestige === 1) return newUnitLevel = '4.0', newUnitType = 'Infantry'
        if (prestige === 2) return newUnitLevel = '5.0', newUnitType = 'SuperHeavy'
        if (prestige === 3) return newUnitLevel = '4.0', newUnitType = 'Howitzers'
        if (prestige === 4) return newUnitLevel = '5.0', newUnitType = 'Bombers'
        if (prestige === 5) return newUnitLevel = '4.0', newUnitType = 'TankHunters'
        if (prestige === 6) return newUnitLevel = '5.0', newUnitType = 'RocketLaunchers'
        if (prestige === 7) return newUnitLevel = '4.0', newUnitType = 'LightTanks'
        if (prestige === 8) return newUnitLevel = '4.0', newUnitType = 'HeavyTanks'
        if (prestige === 9) return newUnitLevel = '4.0', newUnitType = 'AntiTankGuns'
        module.exports.newUnitLevel = newUnitLevel
        module.exports.newUnitType = newUnitType
        }
        newUnitSelection(prestige)

        let presigeRequired = newPrestige * 10 + 1
        if (presigeRequired > Level[0].officer_level) {
            console.log(`Officer Upgrade Required`)
            newUnitEmbed
                .setColor(CampColour)
                .setThumbnail(guildIcon)
                .setTimestamp()
                .addFields(
                    { name: `Required Level: ${presigeRequired}`, value: `Current Level: ${Level[0].officer_level}` },
                )  
                .setDescription(`**${interaction.member}, Officer Upgrade Required**`)
                .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });
            return interaction.update({ embeds: [newUnitEmbed], components: [newUnitButtons] })
        } else console.log(`No Officer Upgrade Required`)

        const Unit = await sql.Execute(`SELECT * FROM units WHERE Unit_Level = '${newUnitLevel}' AND Unit_Type LIKE '%${newUnitType}%'`)
        const unitSelection = Unit[Math.floor(Math.random() * Unit.length)]

        newUnitEmbed
            .setColor(CampColour)
            .setThumbnail(guildIcon)
            .setTimestamp()
            .setDescription(`**${interaction.member}, New Unit Selection Successful**`)
            .addFields(
                { name: `Unit Name:`, value: `${unitSelection.Unit_Name}`, inline: true },
                { name: `Unit Level:`, value: `${unitSelection.Unit_Level}`, inline: true },
                { name: `Camp:`, value: `${unitSelection.Camp}`, inline: true },
                { name: `Unit Type:`, value: `${unitSelection.Unit_Type}`, inline: true },
                { name: `Firepower:`, value: `${unitSelection.Firepower}`, inline: true },
                { name: `HP:`, value: `${unitSelection.HP}`, inline: true },
                { name: `Speed:`, value: `${unitSelection.Speed}`, inline: true },
            )
            .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });
        const emoji = unitSelection.Image.replace('.jpg', '')
        console.log(emoji)
        const updateUnit = await sql.Execute(`UPDATE playerunits SET emoji = '${emoji}', unit_level = '${Level[0].unit_level}', Unit_ID = '${unitSelection.Unit_ID}' WHERE discord_id = '${interaction.member.id}' AND camp = '${Level[0].unit_camp}' AND unit_type = '${Level[0].unit_type}'`)
        const saveNewUnit = await sql.Execute(`INSERT INTO playerunits (discord_id, camp, unit_type, unit_level, unit_id) VALUES ('${interaction.member.id}', '${unitSelection.Camp}', '${unitSelection.Unit_Type}', '${unitSelection.Unit_Level}', '${unitSelection.Unit_ID}')`)
        const updateNewUnit = await sql.Execute(`UPDATE levels SET Unit_Camp = '${unitSelection.Camp}', Unit_Type = '${unitSelection.Unit_Type}', Unit_Level = '${unitSelection.Unit_Level}', prestige = '${newPrestige}' WHERE discord_id = '${interaction.member.id}'`)
        console.log(updateUnit.info)
        console.log(updateNewUnit.info)
        console.log(saveNewUnit.info)

        return interaction.update({ embeds: [newUnitEmbed], components: [newUnitButtons] })
    },
    attackSelection: async function (Attacker, Defender) {
        if (Attacker.AttackType === Attacker.OfficerType) return Attacker.Multiplier = Attacker.Multiplier * 1.5
        if (Defender.AttackType === Defender.OfficerType) return Defender.Multiplier = Defender.Multiplier * 1.5
        console.log(Defender)
    },
    newUnitSelection: async function (prestige) { //Medium is Starter Troop
        if (prestige === 0) return newUnitLevel = '5.0', newUnitType = 'Fighters'
        if (prestige === 1) return newUnitLevel = '4.0', newUnitType = 'Infantry'
        if (prestige === 2) return newUnitLevel = '5.0', newUnitType = 'SuperHeavy'
        if (prestige === 3) return newUnitLevel = '4.0', newUnitType = 'Howitzers'
        if (prestige === 4) return newUnitLevel = '5.0', newUnitType = 'Bombers'
        if (prestige === 5) return newUnitLevel = '4.0', newUnitType = 'TankHunters'
        if (prestige === 6) return newUnitLevel = '5.0', newUnitType = 'RocketLaunchers'
        if (prestige === 7) return newUnitLevel = '4.0', newUnitType = 'LightTanks'
        if (prestige === 8) return newUnitLevel = '4.0', newUnitType = 'HeavyTanks'
        if (prestige === 9) return newUnitLevel = '4.0', newUnitType = 'AntiTankGuns'
        module.exports.newUnitLevel = newUnitLevel
        module.exports.newUnitType = newUnitType
    },
    campSelection: async function (Attacker, Defender) {
        if (Attacker.UnitCamp === Attacker.OfficerCamp) return Attacker.Multiplier = Attacker.Multiplier + Attacker.Multiplier
        if (Defender.UnitCamp === Defender.OfficerCamp) return Defender.Multiplier = Defender.Multiplier + Defender.Multiplier
        if (Attacker.UnitCamp === Attacker.OfficerCamp && Attacker.AttackType === Attacker.OfficerType) return Attacker.Multiplier = Attacker.Multiplier + Attacker.Multiplier + Attacker.Multiplier + Attacker.Multiplier
        if (Defender.UnitCamp === Defender.OfficerCamp && Defender.AttackType === Defender.OfficerType) return Defender.Multiplier = Defender.Multiplier + Defender.Multiplier + Defender.Multiplier + Defender.Multiplier
    },
    selectunit: async function (interaction) {
        const playerUnits = await sql.Execute(`SELECT * FROM playerunits WHERE discord_id = '${interaction.member.id}'`)
        const unitChoices = [];
        for (const entry in playerUnits) {
            const camp = playerUnits[entry].camp
            const type = playerUnits[entry].unit_type
            const level = playerUnits[entry].unit_level
            const playerEmoji = playerUnits[entry].emoji || 'Guardian_of_the_Truth'
            const image = await interaction.member.guild.emojis.cache.find(emoji => emoji.name == playerEmoji)

            unitChoices.push({
                label: type,
                description: `${camp} - ${type} - ${level}`,
                value: type.toString(),
                //emoji: image.toString()
            })
        }
        const unitMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("selectunitmenu")
                    .setPlaceholder('Select your Unit')
                    .addOptions(unitChoices),
            )
        const selectUnitButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel('Upgrade')
                    .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("profile")
                .setLabel('Profile')
                .setStyle(ButtonStyle.Secondary),
            )
        const selectUnitEmbed = new EmbedBuilder()
            .setColor(Colours.Green)
            .setThumbnail(guildIcon)
            .setTimestamp()
            .setTitle(`Select Your Unit!`)
        interaction.update({
            embeds: [selectUnitEmbed],
            components: [unitMenu]
        })
    },
    selectunitmenu: async function (interaction) {
        const selected = interaction.values[0]
        const selectedUnit = await sql.Execute(`SELECT * FROM playerunits WHERE discord_id = '${interaction.member.id}' AND unit_type = '${selected}'`)
        const newUnitSelect = await sql.Execute(`SELECT * FROM units WHERE Camp = '${selectedUnit[0].camp}' AND Unit_Type = '${selectedUnit[0].unit_type}' AND Unit_Level = '${selectedUnit[0].unit_level}'`)
        const playerProfile = await sql.Execute(`SELECT * FROM levels WHERE discord_id = '${interaction.member.id}'`)
        const firepower = newUnitSelect[0].Firepower * (playerProfile[0].officer_level / 10)
        const HP = newUnitSelect[0].HP * playerProfile[0].base_level * 10
        const unitImage = `http://phfamily.co.uk/img/${newUnitSelect[0].Image}`
        const updateUnit = await sql.Execute(`UPDATE levels SET unit_level = '${selectedUnit[0].unit_level}', unit_camp = '${selectedUnit[0].camp}', unit_type = '${selectedUnit[0].unit_type}' WHERE discord_id = '${interaction.member.id}'`)
        let CampColour = Colours.Green
        if (selectedUnit[0].camp === 'Vanguard') {
            CampColour = Colours.Vanguard
        }
        if (selectedUnit[0].camp === 'Liberty') {
            CampColour = Colours.Liberty
        }
        if (selectedUnit[0].camp === 'MartyrsW') {
            CampColour = Colours.MartyrsW
        }
        const selectUnitMenuButtons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("cancel")
                .setLabel('Upgrade')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("selectunit")
                .setLabel('Select Unit')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("profile")
                .setLabel('Profile')
                .setStyle(ButtonStyle.Secondary),

        )
        const selectedUnitEmbed = new EmbedBuilder()
            .setTitle(`${selected} chosen`)
            .setColor(CampColour)
            .setImage(unitImage)
            .setThumbnail(unitImage)
            .setTimestamp()
            .addFields(
                { name: `Unit Name:`, value: `${newUnitSelect[0].Unit_Name.toLocaleString()}`, inline: true },
                { name: `Unit Level:`, value: `${newUnitSelect[0].Unit_Level.toLocaleString()}`, inline: true },
                { name: `Camp:`, value: `${newUnitSelect[0].Camp}`, inline: true },
                { name: `Unit Type:`, value: `${newUnitSelect[0].Unit_Type}`, inline: true },
                { name: `Firepower:`, value: `${firepower.toLocaleString()}`, inline: true },
                { name: `HP:`, value: `${HP.toLocaleString()}`, inline: true },
                { name: `Speed:`, value: `${newUnitSelect[0].Speed.toLocaleString()}`, inline: true },
            )
        
        interaction.update({
            embeds: [selectedUnitEmbed],
            components: [selectUnitMenuButtons]
        })

    },
    selectofficer: async function (interaction) {
        const playerOfficers = await sql.Execute(`SELECT * FROM playerofficers WHERE discord_id = '${interaction.member.id}' ORDER BY officer_level DESC`)
        const officerChoices = [];
        for (const entry in playerOfficers) {
            const name = playerOfficers[entry].Officer_Name
            const type = playerOfficers[entry].Officer_Type
            const camp = playerOfficers[entry].Officer_Camp
            const skill = playerOfficers[entry].Skill
            const level = playerOfficers[entry].Officer_Level
            const skill_level = playerOfficers[entry].Skill_Level


            officerChoices.push({
                label: name,
                description: `${level} - ${camp} - ${type} - ${skill} - ${skill_level}`,
                value: name.toString()
            })
        }
        let CampColour = Colours.Green

        const officerMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("selectofficermenu")
                    .setPlaceholder('Select your Officer')
                    .addOptions(officerChoices),
            )
        const selectOfficerButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel('Upgrade')
                    .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("profile")
                .setLabel('Profile')
                .setStyle(ButtonStyle.Secondary),
            )
        const selectOfficerEmbed = new EmbedBuilder()
            .setColor(CampColour)
            .setThumbnail(guildIcon)
            .setTimestamp()
            .setTitle(`Select Your Officer!`)
        interaction.update({
            embeds: [selectOfficerEmbed],
            components: [officerMenu]
        })
    },
    selectofficermenu: async function (interaction) {
        const selected = interaction.values[0]
        const selectedOfficer = await sql.Execute(`SELECT * FROM playerofficers WHERE discord_id = '${interaction.member.id}' AND Officer_Name = '${selected}'`)
        const playerProfile = await sql.Execute(`SELECT * FROM levels WHERE discord_id = '${interaction.member.id}'`)
        const officerImage = `http://phfamily.co.uk/img/${selectedOfficer[0].Image}`
        const updateOfficer = await sql.Execute(`UPDATE levels SET officer_name = '${selectedOfficer[0].Officer_Name}', officer_level = '${selectedOfficer[0].Officer_Level}', skill_level = '${selectedOfficer[0].Skill_Level}' WHERE discord_id = '${interaction.member.id}'`)
        let CampColour = Colours.Green
        if (selectedOfficer[0].Unit_Camp === 'Vanguard') {
            CampColour = Colours.Vanguard
        }
        if (selectedOfficer[0].Unit_Camp === 'Liberty') {
            CampColour = Colours.Liberty
        }
        if (selectedOfficer[0].Unit_Camp === 'MartyrsW') {
            CampColour = Colours.MartyrsW
        }
        console.log(`Officer Selected: ${updateOfficer.info}`)
        const selectOfficerMenuButtons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("cancel")
                .setLabel('Upgrade')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("selectofficer")
                .setLabel('Select Officer')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("profile")
                .setLabel('Profile')
                .setStyle(ButtonStyle.Secondary),
        )
        const selectedOfficerEmbed = new EmbedBuilder()
            .setTitle(`${selected} chosen`)
            .setColor(CampColour)
            .setImage(officerImage)
            .setTimestamp()
            .addFields(
                { name: `Officer Name:`, value: `${selectedOfficer[0].Officer_Name}`, inline: true },
                { name: `Officer Level:`, value: `${selectedOfficer[0].Officer_Level}`, inline: true },
                { name: `Camp:`, value: `${selectedOfficer[0].Officer_Camp}`, inline: true },
                { name: `Officer Type:`, value: `${selectedOfficer[0].Officer_Type}`, inline: true },
                { name: `Skill:`, value: `${selectedOfficer[0].Skill}`, inline: true },
                { name: `Skill Level:`, value: `${selectedOfficer[0].Skill_Level}`, inline: true },
            )
        
        interaction.update({
            embeds: [selectedOfficerEmbed],
            components: [selectOfficerMenuButtons]
        })

    },
    campaign: async function (interaction) {
        const campaignButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("camp1")
                    .setLabel('Professor Pain (50)')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("camp2")
                    .setLabel('The Witcher (100)')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("camp3")
                    .setLabel('Percy (150)')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("camp4")
                    .setLabel('Argent Flamce (200)')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("camp5")
                    .setLabel('The Erupter (250)')
                    .setStyle(ButtonStyle.Success),
            )
            const campaignButtons2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("camp6")
                    .setLabel('El Cartero (300)')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("camp7")
                    .setLabel('Thorn Countess (350)')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("camp8")
                    .setLabel('Steel Fighter (400)')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("camp9")
                    .setLabel('Valkrie (450)')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("camp10")
                    .setLabel('Saber of The Nation (500)')
                    .setStyle(ButtonStyle.Primary),
            )
            const campaignButtons3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("camp11")
                    .setLabel('Berserker Bear (550)')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("camp12")
                    .setLabel('War Machine (600)')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("camp13")
                    .setLabel('Guardian of Truth (650)')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("camp14")
                    .setLabel('Iron Bastion (700)')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("camp15")
                    .setLabel('Angel of Light (750)')
                    .setStyle(ButtonStyle.Danger),
            )
            const campaignButtons4 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("camp16")
                    .setLabel('TBC (800)')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("camp17")
                    .setLabel('TBC (850)')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("camp18")
                    .setLabel('TBC (900)')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("camp19")
                    .setLabel('TBC (950)')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("camp20")
                    .setLabel('TBC (1000)')
                    .setStyle(ButtonStyle.Secondary),
            )
            const campaignButtonsMenu = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("easy")
                    .setLabel('Easy')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("normal")
                    .setLabel('Normal')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("hard")
                    .setLabel('Hard')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel('Upgrade')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("profile")
                    .setLabel('Profile')
                    .setStyle(ButtonStyle.Secondary),
            )

            const campaignButtonsMenu2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("normal")
                    .setLabel('Normal')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("hard")
                    .setLabel('Hard')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("extreme")
                    .setLabel('Extreme')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel('Upgrade')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("profile")
                    .setLabel('Profile')
                    .setStyle(ButtonStyle.Secondary),
            )

        const campaignEmbed = new EmbedBuilder()
            .setColor(Colours.Green)
            .setThumbnail(guildIcon)
            .setTimestamp()
            .setDescription(`Pick your Enemy`)
            .setTitle(`Select your opponent!`)
    let buttons = campaignButtons
    let menu = campaignButtonsMenu
    if (interaction.customId === 'easy') { 
        buttons = campaignButtons
        menu = campaignButtonsMenu
        campaignEmbed
            .setColor(Colours.Green)
    }
    if (interaction.customId === 'normal') { 
        buttons = campaignButtons2
        menu = campaignButtonsMenu
        campaignEmbed
            .setColor(Colours.Liberty)
    }
    if (interaction.customId === 'hard') { 
        buttons = campaignButtons3
        menu = campaignButtonsMenu2
        campaignEmbed
            .setColor(Colours.MartyrsW)
    }
    if (interaction.customId === 'extreme') { 
        buttons = campaignButtons4
        menu = campaignButtonsMenu2
        campaignEmbed
            .setColor(Colours.Vanguard)
    }
        interaction.update({
            embeds: [campaignEmbed],
            components: [buttons, menu]
        })
    },
    challenge: async function (interaction) {
        const challengeButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel('Upgrade')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("profile")
                    .setLabel('Profile')
                    .setStyle(ButtonStyle.Secondary),
            )
        const challengeEmbed = new EmbedBuilder()
            .setDescription(`Coming Soon...`)
            .setTitle(`Challenge Mode!`)
        interaction.editReply({
            embeds: [challengeEmbed],
            //components: [challengeButtons]
        })
    },
    newOfficer: async function (interaction) {
        const Officers = await sql.Execute(`SELECT * FROM officers WHERE Officer_ID NOT IN (SELECT Officer_ID FROM playerofficers WHERE Discord_ID = '${interaction.member.id}');`)            
        const currentOfficers = await sql.Execute(`SELECT * FROM playerofficers WHERE discord_id = '${interaction.member.id}'`)
        const Level = await sql.Execute(`SELECT * FROM levels WHERE discord_id = '${interaction.member.id}'`)        
        const newOfficerEmbed = new EmbedBuilder();
        const newOfficerButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel('Upgrade')
                    .setStyle(ButtonStyle.Success),
            )
        const guildIcon = interaction.member.guild.iconURL();
        const guildName = interaction.member.guild.name
        let presigeRequired = currentOfficers.length * 20 + 1
        if (currentOfficers.length < 2 ) {
            console.log(`Less than 2`)
            presigeRequired = 1
        }
        if (presigeRequired >= Level[0].officer_level) {
            console.log(`Officer Upgrade Required`)
            newOfficerEmbed
                .setColor('#ff5b05')
                .setThumbnail(guildIcon)
                .setTimestamp()
                .addFields(
                    { name: `Required Level: ${presigeRequired}`, value: `Current Level: ${Level[0].officer_level}` },
                )  
                .setDescription(`**${interaction.member}, Officer Upgrade Required**`)
                .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });
            return interaction.update({ embeds: [newOfficerEmbed], components: [newOfficerButtons] })
        } else console.log(`No Officer Upgrade Required`)

        const officerSelection = Officers[Math.floor(Math.random() * Officers.length)]

        newOfficerEmbed
            .setColor('#ff5b05')
            .setThumbnail(guildIcon)
            .setTimestamp()
            .setDescription(`**${interaction.member}, New Officer Selection Successful**`)
            .addFields(
                { name: `Officer Name:`, value: `${officerSelection.Officer_Name}`, inline: true },
                { name: `Officer Level:`, value: `0`, inline: true },
                { name: `Camp:`, value: `${officerSelection.Officer_Camp}`, inline: true },
                { name: `Officer Type:`, value: `${officerSelection.Officer_Type}`, inline: true },
                { name: `Skill:`, value: `${officerSelection.Skill}`, inline: true },
            )
            .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });
        const saveNewOfficer = await sql.Execute(`INSERT INTO playerofficers (Discord_ID, Officer_ID, Officer_Type, Officer_Name, Officer_Camp, Skill, Image) 
        VALUES ('${interaction.member.id}', '${officerSelection.Officer_ID}', '${officerSelection.Officer_Type}', '${officerSelection.Officer_Name}', '${officerSelection.Officer_Camp}', '${officerSelection.Skill}', '${officerSelection.Image}')`)
        const updateNewOfficer = await sql.Execute(`UPDATE levels SET officer_name = '${officerSelection.Officer_Name}', officer_level = '0', skill_level = '0' WHERE discord_id = '${interaction.member.id}'`)
        console.log(updateNewOfficer.info)
        console.log(saveNewOfficer.info)

        return interaction.update({ embeds: [newOfficerEmbed], components: [newOfficerButtons] })
    },
    campaignSelection: async function (campaign) { //Medium is Starter Troop
        if (campaign === 0) return campaignUnitLevel = '9.2', campaignUnitType = 'MediumTanks', campaignUnitCamp = 'Liberty', campaignOfficer = 'Sergeant Spanner', campaignOfficerLevel = 1500, campaignBaseLevel = 1500, skillLevel = 15
        if (campaign === 1) return campaignUnitLevel = '9.2', campaignUnitType = 'MediumTanks', campaignUnitCamp = 'Liberty', campaignOfficer = 'Sergeant Spanner', campaignOfficerLevel = 25, campaignBaseLevel = 25, skillLevel = 0
        if (campaign === 2) return campaignUnitLevel = '9.2', campaignUnitType = 'Fighters', campaignUnitCamp = 'MartyrsW', campaignOfficer = 'The Witcher', campaignOfficerLevel = 50, campaignBaseLevel = 50, skillLevel = 0
        if (campaign === 3) return campaignUnitLevel = '9.2', campaignUnitType = 'Infantry', campaignUnitCamp = 'Liberty', campaignOfficer = 'Percy', campaignOfficerLevel = 100, campaignBaseLevel = 100, skillLevel = 1
        if (campaign === 4) return campaignUnitLevel = '9.2', campaignUnitType = 'SuperHeavyTanks', campaignUnitCamp = 'Vanguard', campaignOfficer = 'Argent Flamce', campaignOfficerLevel = 150, campaignBaseLevel = 150, skillLevel = 1
        if (campaign === 5) return campaignUnitLevel = '9.2', campaignUnitType = 'Howitzers', campaignUnitCamp = 'MartyrsW', campaignOfficer = 'The Erupter', campaignOfficerLevel = 200, campaignBaseLevel = 200, skillLevel = 2
        if (campaign === 6) return campaignUnitLevel = '9.2', campaignUnitType = 'Bombers', campaignUnitCamp = 'Liberty', campaignOfficer = 'El Cartero', campaignOfficerLevel = 250, campaignBaseLevel = 250, skillLevel = 2
        if (campaign === 7) return campaignUnitLevel = '9.2', campaignUnitType = 'TankHunters', campaignUnitCamp = 'Vanguard', campaignOfficer = 'Thorn Countess', campaignOfficerLevel = 300, campaignBaseLevel = 300, skillLevel = 3
        if (campaign === 8) return campaignUnitLevel = '9.2', campaignUnitType = 'RocketLaunchers', campaignUnitCamp = 'MartyrsW', campaignOfficer = 'Steel Fighter', campaignOfficerLevel = 350, campaignBaseLevel = 350, skillLevel = 4
        if (campaign === 9) return campaignUnitLevel = '9.2', campaignUnitType = 'LightTanks', campaignUnitCamp = 'Liberty', campaignOfficer = 'Valkrie', campaignOfficerLevel = 400, campaignBaseLevel = 400, skillLevel = 5
        if (campaign === 10) return campaignUnitLevel = '9.2', campaignUnitType = 'HeavyTanks', campaignUnitCamp = 'Vanguard', campaignOfficer = 'Saber of the Nation', campaignOfficerLevel = 450, campaignBaseLevel = 450, skillLevel = 6
        if (campaign === 11) return campaignUnitLevel = '9.2', campaignUnitType = 'HeavyTanks', campaignUnitCamp = 'MartyrsW', campaignOfficer = 'Berserker Bear', campaignOfficerLevel = 500, campaignBaseLevel = 500, skillLevel = 7
        if (campaign === 12) return campaignUnitLevel = '9.2', campaignUnitType = 'HeavyTanks', campaignUnitCamp = 'Liberty', campaignOfficer = 'War Machine', campaignOfficerLevel = 550, campaignBaseLevel = 550, skillLevel = 8
        if (campaign === 13) return campaignUnitLevel = '9.2', campaignUnitType = 'AntiTankGuns', campaignUnitCamp = 'Vanguard', campaignOfficer = 'Guardian of Truth', campaignOfficerLevel = 600, campaignBaseLevel = 600, skillLevel = 9
        if (campaign === 14) return campaignUnitLevel = '9.2', campaignUnitType = 'MediumTanks', campaignUnitCamp = 'MartyrsW', campaignOfficer = 'Iron Bastion', campaignOfficerLevel = 650, campaignBaseLevel = 650, skillLevel = 10
        if (campaign === 15) return campaignUnitLevel = '9.2', campaignUnitType = 'MediumTanks', campaignUnitCamp = 'Liberty', campaignOfficer = 'Angel of Light', campaignOfficerLevel = 700, campaignBaseLevel = 700, skillLevel = 11
        if (campaign === 16) return campaignUnitLevel = '9.2', campaignUnitType = 'TankHunters', campaignUnitCamp = 'Liberty', campaignOfficer = 'Sergeant Spanner', campaignOfficerLevel = 750, campaignBaseLevel = 750, skillLevel = 12
        if (campaign === 17) return campaignUnitLevel = '9.2', campaignUnitType = 'TankHunters', campaignUnitCamp = 'Liberty', campaignOfficer = 'Sergeant Spanner', campaignOfficerLevel = 800, campaignBaseLevel = 800, skillLevel = 13
        if (campaign === 18) return campaignUnitLevel = '9.2', campaignUnitType = 'TankHunters', campaignUnitCamp = 'Liberty', campaignOfficer = 'Sergeant Spanner', campaignOfficerLevel = 850, campaignBaseLevel = 850, skillLevel = 13
        if (campaign === 19) return campaignUnitLevel = '9.2', campaignUnitType = 'TankHunters', campaignUnitCamp = 'Liberty', campaignOfficer = 'Sergeant Spanner', campaignOfficerLevel = 900, campaignBaseLevel = 900, skillLevel = 14
        if (campaign === 20) return campaignUnitLevel = '9.2', campaignUnitType = 'TankHunters', campaignUnitCamp = 'Liberty', campaignOfficer = 'Sergeant Spanner', campaignOfficerLevel = 950, campaignBaseLevel = 950, skillLevel = 14
        if (campaign === 21) return campaignUnitLevel = '9.2', campaignUnitType = 'TankHunters', campaignUnitCamp = 'Liberty', campaignOfficer = 'Sergeant Spanner', campaignOfficerLevel = 1000, campaignBaseLevel = 1000, skillLevel = 15
        module.exports = {
            campaignUnitLevel: campaignUnitLevel,
            campaignUnitType: campaignUnitType,
            campaignUnitCamp: campaignUnitCamp,
            campaignOfficer: campaignOfficer,
            campaignOfficerLevel: campaignOfficerLevel,
            campaignBaseLevel: campaignBaseLevel,
            skillLevel: skillLevel
        }
    },
    skillupgrade: async function (interaction) {
        const Level = await sql.Execute(`SELECT * FROM levels WHERE discord_id = '${interaction.member.id}'`)
        let CampColour = Colours.Green
        if (Level[0].unit_camp === 'Vanguard') {
            CampColour = Colours.Vanguard
        }
        if (Level[0].unit_camp === 'Liberty') {
            CampColour = Colours.Liberty
        }
        if (Level[0].unit_camp === 'MartyrsW') {
            CampColour = Colours.MartyrsW
        }
        const skillUpgradeEmbed = new EmbedBuilder();
        const skillUpgradeButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("skillupgrade")
                    .setLabel('Upgrade')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("profile")
                    .setLabel('Profile')
                    .setStyle(ButtonStyle.Secondary),
            )
        const guildIcon = interaction.member.guild.iconURL();
        const guildName = interaction.member.guild.name
        const wallet = Level[0].war_coins
        const bank = Level[0].war_chest
        const officerLevel = Level[0].officer_level
        const skillLevel = Level[0].skill_level
        const officerLevelRequired = (skillLevel + 1) * 100
        const baseLevel = Level[0].base_level
        const cost = (skillLevel + 1) * 1000000 * (Level[0].prestige + 1)
        console.log(cost.toLocaleString(), officerLevel, officerLevelRequired)

        if (officerLevelRequired > officerLevel) {
            console.log(`Officer Upgrade Needed`),
            skillUpgradeEmbed
                    .setColor(CampColour)
                    .setThumbnail(guildIcon)
                    .setTimestamp()
                    .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`${interaction.member}, You need to upgrade your **Officer** to apply this **Skill** Upgrade.`)
                    .addFields(
                        { name: `War-Coins:`, value: `$${wallet.toLocaleString()}`, inline: true },
                        { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                        { name: `Officer Level:`, value: `${officerLevel}`, inline: true },
                        { name: `Officer Level Required:`, value: `${officerLevelRequired}`, inline: true },

                    )
                    .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });
            return interaction.update({ embeds: [skillUpgradeEmbed], components: [skillUpgradeButtons] })
        }


        if (cost > wallet) {
            console.log(`No Money`),
                difference = cost - wallet
            skillUpgradeEmbed
                .setColor(CampColour)
                .setThumbnail(guildIcon)
                .setTimestamp()
                .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                .setDescription(`${interaction.member}, You do not have enough **War-Coins** for this upgrade.\nYou are **$${difference.toLocaleString()} War-Coins** short!\nTry withdrawing from your **War-Chest**!`)
                .addFields(
                    { name: `War-Coins:`, value: `$${wallet.toLocaleString()}`, inline: true },
                    { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                    { name: `Base Level:`, value: `${baseLevel}`, inline: true },
                    { name: `Officer Level:`, value: `${officerLevel}`, inline: true },
                    { name: `Upgrade Cost:`, value: `$${cost.toLocaleString()}`, inline: true },
                )
                .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });
            return interaction.update({ embeds: [skillUpgradeEmbed], components: [skillUpgradeButtons] })
        }
        const newWallet = wallet - cost
        const newSkillLevel = skillLevel + 1
        skillUpgradeEmbed
            .setColor(CampColour)
            .setThumbnail(guildIcon)
            .setTimestamp()
            .setDescription(`**${interaction.member}, Officer Skill Upgrade Successful**`)
            .addFields(
                { name: `War-Coins:`, value: `$${newWallet.toLocaleString()}`, inline: true },
                { name: `War-Chest:`, value: `$${bank.toLocaleString()}`, inline: true },
                { name: `New Level:`, value: `${newSkillLevel}`, inline: true },
            )
            .setFooter({ text: `${guildName} - ${interaction.customId}`, iconURL: `${guildIcon}` });

            const playerOfficerUpgrade = await sql.Execute(`UPDATE playerofficers SET Skill_Level = '${newSkillLevel}' WHERE Discord_ID = '${interaction.member.id}' AND Officer_Name = '${Level[0].officer_name}'`)
            const officerUpgrade = await sql.Execute(`UPDATE levels SET war_coins = ${newWallet}, skill_level = '${newSkillLevel}' WHERE discord_id = '${interaction.member.id}'`)
            console.log(`Update Player Officer: ${playerOfficerUpgrade.info}`)
            console.log(`Officer Upgrade: ${officerUpgrade.info}`)

        return interaction.update({ embeds: [skillUpgradeEmbed], components: [skillUpgradeButtons] })

    },

}