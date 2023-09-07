const { loadCommands } = require("../../Handlers/commandHandler");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`Client is ready ${client.user.tag}`);
    client.user.setPresence({ activities: [{ name: 'with chatGPT' }], status: 'idle' });
    loadCommands(client);
  },
};
