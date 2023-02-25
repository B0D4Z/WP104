const sql = require("../config/Database");
const { TextInputStyle, ModalBuilder, EmbedBuilder, TextInputBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    battle: async function (interaction) {
        const guildIcon = interaction.member.guild.iconURL();
		const guildName = interaction.member.guild.name
		const Battle = await sql.Execute(`SELECT * FROM levels WHERE discord_id = ${interaction.member.id}`)
		const embed = new EmbedBuilder();
			embed
				.setColor('#ff5b05')
				.setThumbnail(guildIcon)
				.setTimestamp()
				.setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true })})
				.setFooter({ text: `${guildName} - Warpath Battles`, iconURL: `${guildIcon}`});


				const defender = interaction.options.getUser('target');
				if (defender.bot === true) return interaction.editReply(`${interaction.member} Stop trying to **BULLY PIXELS**, You can only **FIGHT** real members\nMan Up and pick a better foe!`)
				const DefenderDB = await sql.Execute(`SELECT * FROM levels WHERE discord_id = ${defender.id}`)
				if (defender.id === interaction.member.id) {
				embed
					.setDescription(`${interaction.member}, Stop picking fights with yourself!\nPlease select a worthy adversary!`)
	
					return interaction.editReply({ embeds: [embed] })
				}

                if (DefenderDB[0].unit_type === '') {
                    embed
                        .setDescription(`${interaction.member}, ${defender} has not trained their troops!\nPlease select a worthy adversary!`)
        
                        return interaction.editReply({ embeds: [embed] })
                    }
                const DefenderUnit = await sql.Execute(`SELECT * FROM units WHERE Camp = '${DefenderDB[0].unit_camp}' AND Unit_Type = '${DefenderDB[0].unit_type}' AND Unit_Level = '${DefenderDB[0].unit_level}'`)

                const AttackerDB = await sql.Execute(`SELECT * FROM levels WHERE discord_id = ${interaction.member.id}`);
                const AttackerUnit = await sql.Execute(`SELECT * FROM units WHERE Camp = '${AttackerDB[0].unit_camp}' AND Unit_Type = '${AttackerDB[0].unit_type}' AND Unit_Level = '${AttackerDB[0].unit_level}'`)

                const AttackerStats = {
                    Name: AttackerUnit[0].Unit_Name,
                    Firepower: AttackerUnit[0].Firepower,
                    HP: AttackerUnit[0].HP,
                    Speed: AttackerUnit[0].Speed,
                    BaseLevel: AttackerDB[0].base_level,
                    OfficerLevel: AttackerDB[0].officer_level
                }
                const DefenderStats = {
                    Name: DefenderUnit[0].Unit_Name,
                    Firepower: DefenderUnit[0].Firepower,
                    HP: DefenderUnit[0].HP,
                    Speed: DefenderUnit[0].Speed
                }
                console.log(Attacker, Defender)

                embed
					.setDescription(`${interaction.member} your **${AttackerStats.Name}** sucessfully Battled ${defender}'s **${DefenderStats.Name}**!`)

// console.log(Defender.Health)
// for (let i = Defender.Health; i >= 1; i=i-Attacker.Power) {
//     console.log(i)
//     return interaction.editReply({ embeds: [embed] });
// }

function sleep(ms) {
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
  }

let AH = Attacker.Health, DH = Defender.Health
while (DH >= 0 && AH >= 0) {
    DH = DH - Attacker.Power
    embed
        .setDescription(`${interaction.member}'s **${Attacker.Name}** hit ${defender}'s **${Defender.Name}** with a crushing blow. Dealing **${Attacker.Power.toLocaleString()}** damage!`)
    interaction.editReply({ embeds: [embed] });
    console.log(`Attacker hit for ${Attacker.Power.toLocaleString()}`)

    AH = AH - Defender.Power
    embed
        .setDescription(`${defender}'s **${Defender.Name}** hit ${interaction.member}'s **${Attacker.Name}** with a crushing blow. Dealing **${Defender.Power.toLocaleString()}** damage!`)
    interaction.editReply({ embeds: [embed] });
    console.log(`Defender hit for ${Defender.Power.toLocaleString()}`)
}


if (AH < 0) {
    embed 
        .setDescription(`${interaction.member}'s **${Attacker.Name}** has been killed by ${defender}'s **${Defender.Name}**.`)
    interaction.editReply({ embeds: [embed] });   
}
if (DH < 0) {
    embed 
    
        .setDescription(`${defender}'s **${Defender.Name}** has been killed by ${interaction.member}'s **${Attacker.Name}**.`)
    interaction.editReply({ embeds: [embed] });   
}



				//updatePlayer = await sql.Execute(`UPDATE levels SET war_coins = '${newWallet}' WHERE discord_id = ${interaction.member.id}`);
				//updateVictim = await sql.Execute(`UPDATE levels SET war_coins = '${newVictim}' WHERE discord_id = ${victim.id}`)
    }
}