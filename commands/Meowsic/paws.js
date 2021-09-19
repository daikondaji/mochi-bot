const { SlashCommandBuilder } = require("@discordjs/builders");
const { createErrorEmbed, createSuccessEmbed } = require("../../util/embeds");

// env variables setup
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("paws")
    .setDescription("Pauses player"),
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
      client.distube.pause(queue);
      interaction.editReply({
        embeds: [createSuccessEmbed().setTitle("Pausing the player...")],
      });
    } catch (e) {
      interaction.editReply({
        embeds: [createErrorEmbed().setDescription(e.message)],
      });
    }
  },
};
