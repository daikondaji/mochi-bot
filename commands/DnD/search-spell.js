const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  createErrorEmbed,
  createSuccessSongEmbed,
} = require("../../util/embeds");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search-spell")
    .setDescription(
      "Search for a spell from the DnD Wands & Wizards playbook (spells by u/Murphen44)"
    )
    .addStringOption((option) =>
      option
        .setName("spell")
        .setDescription("The name of the spell you want to look for")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    await interaction.deferReply({ ephemeral: false });

    const spells = require("../../assets/spells.json");
    const lookupSpell = interaction.options.getString("spell");

    const searchResult =
      spells[
        Object.keys(spells).find(
          (key) => key.toLowerCase() === lookupSpell.toLowerCase()
        )
      ];

    if (searchResult) {
      const {
        spellName,
        commonName,
        level,
        year,
        castingTime,
        range,
        duration,
        tag,
        description,
      } = searchResult;

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor("#7209b7")
            .setTitle(`${spellName}`)
            .setDescription(`${description}`)
            .setAuthor(`"${commonName}"`)
            .setThumbnail("https://i.imgur.com/dCWswov.png")
            .addFields(
              { name: "Level", value: `${level}`, inline: true },
              { name: "Year", value: `${year}`, inline: true },
              {
                name: "Casting Time",
                value: `${castingTime} action`,
                inline: true,
              },
              {
                name: "Range",
                value: `${typeof range === "string" ? range : range + " feet"}`,
                inline: true,
              },
              { name: "Duration", value: `${duration}`, inline: true },
              {
                name: "Tag",
                value: `${tag === null ? "None" : tag}`,
                inline: true,
              }
            ),
        ],
      });
    } else {
      interaction.editReply({
        embeds: [
          createErrorEmbed().setDescription(
            `Could not find the spell \`${lookupSpell}\``
          ),
        ],
      });
    }
  },
};
