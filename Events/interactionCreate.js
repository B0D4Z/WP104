const timestamp = require('time-stamp');
module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        console.log((timestamp.utc('YYYY/MM/DD HH:mm:ss')), `${interaction.user.tag} in #${interaction.channel.name} triggered the ${interaction.commandName} command.`);
        if (!interaction.isCommand()) return;
    try {
        const command = interaction.client.commands.get(interaction.commandName)
        await command.execute(interaction);
        
    } catch (error) {
        console.error((timestamp.utc('YYYY/MM/DD HH:mm:ss')), error);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
    if (!interaction.isButton()) return;
	console.log(interaction);
    },
};