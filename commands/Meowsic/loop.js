const { SlashCommandBuilder } = require("@discordjs/builders");
const { createErrorEmbed, createSuccessEmbed } = require("../../util/embeds");

// env variables setup
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Loops the current track")
    .addIntegerOption((option) =>
      option
        .setName("mode")
        .setDescription(
          "Pick the loop option:  off = stop looping || song = current track || queue = entire queue"
        )
        .setRequired(true)
        .addChoice("off", 0)
        .addChoice("song", 1)
        .addChoice("queue", 2)
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
      let mode = interaction.options.getInteger("mode");

      // if (queue.songs.length > 1) {
      //   mode = client.distube.setRepeatMode(queue, mode);
      // } else {
      //   mode = client.distube.setRepeatMode(queue, 2);
      // }

      mode = client.distube.setRepeatMode(queue, mode);

      console.log(`CHANGED repeat mode: ${queue.repeatMode}`);
      //   mode = mode ? (mode === 2 ? "Repeat queue" : "Repeat song") : "Off";

      interaction.editReply({
        embeds: [createSuccessEmbed().setTitle("Looping")],
      });
    } catch (e) {
      interaction.editReply({
        embeds: [createErrorEmbed().setDescription(e.message)],
      });
    }
  },
};
