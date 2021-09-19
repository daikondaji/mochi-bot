const { SlashCommandBuilder } = require("@discordjs/builders");
const { createErrorEmbed, createSuccessEmbed } = require("../../util/embeds");

// env variables setup
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Checks the tracks that are queued to play."),
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
      const forwardQueue = queue.songs.map((song, i) => {
        let field;
        if (i === 0) {
          field = {
            name: "\n--------------------------\n[PLAYING]",
            value: `${song.name} (${song.formattedDuration})\n===============`,
          };
        } else {
          field = {
            name: `Track #[${i}]`,
            value: `${song.name} (${song.formattedDuration})`,
            // value: `${song.name} (${song.formattedDuration})`,
            // value: "==================================",
          };
        }
        return field;
      });

      const backwardQueue = queue.previousSongs
        .slice(0)
        .reverse()
        .map((song, i) => {
          let field = {
            name: `Track #[${-1 * (i + 1)}]`,
            value: `${song.name} (${song.formattedDuration})`,
          };
          return field;
        });

      interaction.editReply({
        embeds: [
          {
            color: 0x06d6a0,
            title: "Queue",
            thumbnail: {
              url: "https://i.imgur.com/qwMk3OJ.png",
            },
            fields: [
              ...forwardQueue,
              backwardQueue.length > 0
                ? {
                    name: "\n--------------------------\nPREVIOUS TRACKS",
                    value: "===============",
                  }
                : [],
              ...backwardQueue,
            ],
          },
        ],
      });
    } catch (e) {
      interaction.editReply({
        embeds: [createErrorEmbed().setDescription(e.message)],
      });
    }
  },
};
