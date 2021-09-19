const { SlashCommandBuilder } = require("@discordjs/builders");
const { createErrorEmbed, createSuccessEmbed } = require("../../util/embeds");

// env variables setup
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Changes the volume of Mochi")
    .addIntegerOption((option) =>
      option
        .setName("level")
        .setDescription("Select the volume level of Mochi. 50% is default.")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    await interaction.deferReply();

    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue) {
      return interaction.editReply({
        embeds: [
          createErrorEmbed().setDescription(
            "There is nothing in the queue right meow!"
          ),
        ],
      });
    }

    try {
      const level = interaction.options.getInteger("level");
      queue.setVolume(level);
      interaction.editReply({
        embeds: [createSuccessEmbed().setTitle(`Set the volume to ${level}%.`)],
      });
    } catch (e) {
      interaction.editReply({
        embeds: [createErrorEmbed().setDescription(e.message)],
      });
    }
  },
};
