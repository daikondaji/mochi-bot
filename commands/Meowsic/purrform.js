const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  createErrorEmbed,
  createSuccessSongEmbed,
} = require("../../util/embeds");
const { MessageEmbed } = require("discord.js");

module.exports = {
  inVoiceChannel: true,
  data: new SlashCommandBuilder()
    .setName("purrform")
    .setDescription("Plays a song from the url.")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription(
          "The url, song name, or a search query for the song you want to play"
        )
        .setRequired(true)
    ),
  async execute(client, interaction) {
    await interaction.deferReply();
    const song = interaction.options.getString("song");
    const voice_channel = interaction.member.voice.channel;

    if (!interaction.member.voice.channel) {
      // return interaction.editReply("join voice dummbo");
      return interaction.editReply({
        embeds: [
          createErrorEmbed().setDescription(
            "You need to join the voice channel before you do this!"
          ),
        ],
      });
    }

    const options = {
      textChannel: interaction.channel,
      member: interaction.member,
    };
    try {
      const queue = client.distube.getQueue(interaction.guildId);
      // if (queue.songs.length === 1 && queue.repeatMode === 2) {
      //   console.log("yay");
      // }
      await client.distube.playVoiceChannel(voice_channel, song, options);
      await interaction.deleteReply();
    } catch (e) {
      interaction.editReply({
        embeds: [createErrorEmbed().setDescription(e.message)],
      });
    }
  },
};
