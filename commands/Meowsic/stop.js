const { SlashCommandBuilder } = require("@discordjs/builders");
const { createErrorEmbed, createSuccessEmbed } = require("../../util/embeds");

// env variables setup
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops player"),
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
      client.distube.stop(queue);
      interaction.editReply({
        embeds: [
          createSuccessEmbed()
            .setTitle("Stopping the player...")
            .setDescription("Have a meowvelous day!")
            .setThumbnail("https://i.imgur.com/H3fnIto.png"),
        ],
      });
    } catch (e) {
      interaction.editReply({
        embeds: [createErrorEmbed().setDescription(e.message)],
      });
    }
  },
};
