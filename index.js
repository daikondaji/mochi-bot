// Require the necessary discord.js classes
const { Client, Intents, Collection } = require("discord.js");
const { DisTube } = require("distube");
const { MessageEmbed } = require("discord.js");
const { createErrorEmbed } = require("./util/embeds");
// const { SpotifyPlugin } = require("@distube/spotify");
const fs = require("fs");

// env variables setup
require("dotenv").config();

// // Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
});
client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  searchSongs: 1,
  searchCooldown: 30,
  leaveOnEmpty: true,
  emptyCooldown: 25,
  leaveOnFinish: false,
  savePreviousSongs: true,
  leaveOnStop: true,
  ytdlOptions: {
    //requestOptions: {
    //  agent //ONLY USE ONE IF YOU KNOW WHAT YOU DO!
    //},
    highWaterMark: 1024 * 1024 * 64,
    quality: "highestaudio",
    format: "audioonly",
    liveBuffer: 60000,
    dlChunkSize: 1024 * 1024 * 64,
  },
});

client.commands = new Collection();
const commandDir = fs.readdirSync("./commands");
const commandFiles = [];

commandDir.forEach((dirName) => {
  const dir = fs.readdirSync("./commands/" + dirName);
  dir.forEach((fileName) => {
    if (fileName.endsWith(".js")) {
      commandFiles.push(`${dirName}/${fileName}`);
    }
  });
});

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.on("ready", () => {
  console.log(`${client.user.username} is ready!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  const command = client.commands.get(interaction.commandName);

  // if (command.inVoiceChannel && !interaction.member.voi) {
  //   return interaction.reply("join voice dummbo");
  // }

  try {
    await command.execute(client, interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.distube.on("playSong", (queue, song) => {
  queue.textChannel.send({
    embeds: [
      new MessageEmbed()
        .setColor("#2a9d8f")
        .setTitle(`${song.name}`)
        .setAuthor("Now playing...")
        .setThumbnail("https://i.imgur.com/Zx2I7Ra.png")
        .setURL(`${song.url}`)
        .setImage(`${song.thumbnail}`)
        .addFields(
          {
            name: "Duration",
            value: `${song.formattedDuration}`,
            inline: true,
          },
          {
            name: "Requested by",
            value: `${song.user.username}`,
            inline: true,
          }
        ),
    ],
  });
});

client.distube.on("error", (channel, error) =>
  channel.send({
    embeds: [createErrorEmbed().setDescription(error.message)],
  })
);

// Login to Discord with your client's token
client.login(process.env.TOKEN);
