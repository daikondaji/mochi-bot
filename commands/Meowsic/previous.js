const { SlashCommandBuilder } = require("@discordjs/builders");
const { createErrorEmbed, createSuccessEmbed } = require("../../util/embeds");

// env variables setup
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("previous")
    .setDescription("Skips to the previous song"),
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

    if (queue.previousSongs.length === 0) {
      return interaction.editReply({
        embeds: [
          createErrorEmbed().setDescription("There are no purrvious songs!"),
        ],
      });
    }

    try {
      client.distube.previous(queue);

      interaction.editReply({
        embeds: [
          createSuccessEmbed()
            .setTitle("Skipped to the previous song")
            .setDescription(`Now playing ${queue.previousSongs[0].name}`),
        ],
      });
    } catch (e) {
      interaction.editReply({
        embeds: [createErrorEmbed().setDescription(e.message)],
      });
    }
  },
};
