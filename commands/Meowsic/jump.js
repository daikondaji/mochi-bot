const { SlashCommandBuilder } = require("@discordjs/builders");
const { createErrorEmbed, createSuccessEmbed } = require("../../util/embeds");

// env variables setup
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jump")
    .setDescription("Jump to a certain track in the forward or backward queue")
    .addIntegerOption((option) =>
      option
        .setName("track-number")
        .setDescription(
          "Select the track in the backward or forward queue that you want to jump to"
        )
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

    const trackNum = interaction.options.getInteger("track-number");
    if (
      trackNum > queue.songs.length - 1 ||
      trackNum < queue.previousSongs.length * -1
    ) {
      return interaction.editReply({
        embeds: [createErrorEmbed().setDescription("Track does not exist!")],
      });
    }

    try {
      queue.jump(trackNum);

      interaction.editReply({
        embeds: [
          createSuccessEmbed().setTitle(`Skipped to track number ${trackNum}`),
        ],
      });
    } catch (e) {
      interaction.editReply({
        embeds: [createErrorEmbed().setDescription(e.message)],
      });
    }
  },
};
