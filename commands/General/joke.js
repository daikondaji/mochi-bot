const { SlashCommandBuilder } = require("@discordjs/builders");
const { createErrorEmbed, createSuccessEmbed } = require("../../util/embeds");

// env variables setup
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("joke")
    .setDescription("A very punny cat joke!"),
  async execute(client, interaction) {
    await interaction.deferReply();

    const jokes = [
      "What do cats like to read? \n\n||Cat-alogues.||",
      "What do you call a pile of kittens?  \n\n||A meowntain.||",
      "What do you call the cat that was caught by the police?  \n\n||The purrpatrator.||",
      "What do you get if you cross a cat with Father Christmas?  \n\n||Santa Claws!||",
      "Why do cats go to school?  \n\n||So that they can become litter-ate.||",
      "What is a cat’s favorite discount?  \n\n||Buy one, get one furry.||",
    ];

    const rand = Math.floor(Math.random() * jokes.length);

    try {
      return interaction.editReply({
        embeds: [
          createSuccessEmbed()
            .setTitle(jokes[rand])
            .setThumbnail("https://i.imgur.com/J6wR3rd.png"),
        ],
      });
    } catch (e) {
      interaction.editReply({
        embeds: [createErrorEmbed().setDescription(e.message)],
      });
    }
  },
};
