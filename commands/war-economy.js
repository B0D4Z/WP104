const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sql = require("../config/Database");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('war-economy')
		.setDescription('Fund your Warpath Empire!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('balance')
				.setDescription('Shows current War-Coins Balance!')
			)
		.addSubcommand(subcommand =>
			subcommand
				.setName('deposit')
				.setDescription('Deposit War-Coins safetly in the War-Chest!')
				.addIntegerOption(option =>
					option
						.setName('dep_amount')
						.setDescription('Amount to be Deposited!')
						.setRequired(true)
					)
			)
		.addSubcommand(subcommand =>
			subcommand
				.setName('withdraw')
				.setDescription('Withdraw War-Coins from the War-Chest!')
				.addIntegerOption(option =>
					option
						.setName('wdw_amount')
						.setDescription('Amount to be Withdrawn!')
						.setRequired(true)
					)
			)
		.addSubcommand(subcommand =>
			subcommand
				.setName('shop')
				.setDescription('Shop Coming Soon!')
			)
		.addSubcommand(subcommand =>
			subcommand
				.setName('upgrade')
				.setDescription('Shop Coming Soon!')
			),

				
	async execute(interaction) {
		await interaction.deferReply({
			fetchReply: true,
			ephemeral: false,
		})
		guildIcon = interaction.member.guild.iconURL();
		guildName = interaction.member.guild.name
		Economy = await sql.Execute(`SELECT * FROM levels WHERE discord_id = ${interaction.member.id}`)
		let embed = new EmbedBuilder();
			embed
				.setColor('#ff5b05')
				.setThumbnail(guildIcon)
				.setTimestamp()
				.setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true })})
				.setFooter({ text: `${guildName} - War-Economy`, iconURL: `${guildIcon}`});

		if (interaction.options.getSubcommand() === 'balance')
		{
			const balance = Economy[0].war_coins
			const bank = Economy[0].war_chest
			console.log(balance, bank)
			embed
				.setDescription(`${interaction.member} You have **$${balance} War-Coins** in your **Wallet**!\nYou have **$${bank} War-Coins** in the **War-Chest**!`)

		}
		
		else if (interaction.options.getSubcommand() === 'deposit')
		{
			const amount = interaction.options.getInteger('dep_amount');
			const wallet = Economy[0].war_coins
			const bank = Economy[0].war_chest
			const bankLevel = Economy[0].chest_level
			const bankMax = bankLevel * 10000

			if (amount <= 0) {
			embed
				.setDescription(`${interaction.member} are you **Broke**? Try adding some **War-Coins** to the **War-Chest**!`)
			return interaction.editReply({ embeds: [embed] })
			}
			
			if (amount + bank > bankMax) {
			embed
				.setDescription(`${interaction.member} your **War-Chest** can't hold that many **War-Coins**, try upgrading your **War-Chest** to hold more!\nYou have space for **$${bankMax - bank}** **War-Coins** in your **War-Chest**!`)
			return interaction.editReply({ embeds: [embed] })
			}

			try {
				if (amount > wallet) {
				embed
					.setDescription(`${interaction.member} You do not have enough **War-Coins** for that Deposit!\nYou have **$${wallet} War-Coins** available!`)
				return interaction.editReply({ embeds: [embed] });
				} 

				const newWallet = wallet - amount
				const newBank = bank + amount

				embed
					.addFields(
						{ name: `War-Coins:`, value: ` ${newWallet}`, inline: true }, 
						{ name: `War-Chest:`, value: `${newBank}`, inline: true },
					)
				depositUpdate = await sql.Execute(`UPDATE levels SET war_coins = '${newWallet}', war_chest = '${newBank}' WHERE discord_id = ${interaction.member.id}`)

			} catch (err) {
				console.log(err);
			}

			console.log(amount)
			embed
				.setDescription(`**Deposit Sucessful**!`)
			}

		else if (interaction.options.getSubcommand() === 'withdraw')
		{
			const amount = interaction.options.getInteger('wdw_amount');
			const wallet = Economy[0].war_coins
			const bank = Economy[0].war_chest
			try {
				if (amount > bank) return interaction.editReply(`You do not have enough **War-Coins** in the **War-Chest** for that withdrawal!\nYou have **$${bank}** **War-Coins** in the **War-Chest**!`);
				const newWallet = wallet + amount
				const newBank = bank - amount
				embed
					.setDescription(`**Withdrawal Sucessful**!`)
					.addFields(
						{ name: `War-Coins:`, value: ` ${newWallet}`, inline: true }, 
						{ name: `War-Chest:`, value: `${newBank}`, inline: true },
					)
				withdrawUpdate = await sql.Execute(`UPDATE levels SET war_coins = '${newWallet}', war_chest = '${newBank}' WHERE discord_id = ${interaction.member.id}`)

			} catch (err) {
				console.log(err);
			}
		}

		else if (interaction.options.getSubcommand() === 'shop')
		{
			embed
				.setDescription(`**Coming Soon**!`)
		}

		else if (interaction.options.getSubcommand() === 'upgrade')
		{
			embed
				.setDescription(`**Coming Soon**!`)
		}

		await interaction.editReply({embeds: [embed], ephemeral: false })
		return;
	},
};