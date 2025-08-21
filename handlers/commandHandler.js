const fs = require('fs');
const path = require('path');

function loadCommands(client) {
  const commandsPath = path.join(__dirname, '../commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(`✅ ${command.data.name} komutu yüklendi!`);
    } else {
      console.log(`❌ ${filePath} komutunda "data" veya "execute" özelliği eksik!`);
    }
  }
}

module.exports = { loadCommands };