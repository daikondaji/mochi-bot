const { SlashCommandBuilder } = require("@discordjs/builders");
const { createErrorEmbed, createSuccessEmbed } = require("../../util/embeds");

// env variables setup
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("next")
    .setDescription("Skips to the next song"),
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

    if (queue.songs.length === 1) {
      client.distube.stop(queue);
      return interaction.editReply({
        embeds: [
          createSuccessEmbed()
            .setTitle("That was the last song in the queue. Stopping player.")
            .setThumbnail("https://i.imgur.com/H3fnIto.png"),
        ],
      });
    }

    try {
      client.distube.skip(queue);

      interaction.editReply({
        embeds: [createSuccessEmbed().setTitle("Skipped to the next song.")],
      });
    } catch (e) {
      interaction.editReply({
        embeds: [createErrorEmbed().setDescription(e.message)],
      });
    }
  },
};
