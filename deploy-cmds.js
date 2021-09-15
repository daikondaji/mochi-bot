const fs = require("fs");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

// env variables setup
require("dotenv").config();

const commands = [];
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
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: commands,
      }
    );

    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }
})();
