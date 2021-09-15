// Require the necessary discord.js classes
const { Client, Intents, Collection } = require("discord.js");
const fs = require("fs");

// env variables setup
require("dotenv").config();

// // Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

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

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);
