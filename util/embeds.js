const { MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = {
  createErrorEmbed: () => {
    return new MessageEmbed()
      .setColor("#e63946")
      .setTitle("Meow no!")
      .setThumbnail("https://i.imgur.com/8rUonv0.png")
      .setDescription("Something went wrong...");
  },
  createSuccessEmbed: () => {
    return new MessageEmbed().setColor("#2a9d8f");
  },
};
