const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');

// Configuração do broker e tópicos
const brokerUrl = 'mqtt://broker.hivemq.com'; // Alterar se estiver usando outro broker
const baseTopic = 'home/devices';
const authenticationCode = '1234'; // Código que o app espera para autenticar os dispositivos

// Caminho absoluto do arquivo JSON
const filePath = path.join(__dirname, 'devices.json');

// Função para ler dispositivos do arquivo JSON
const loadDevicesFromFile = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler o arquivo devices.json:', error.message);
    return [];
  }
};

// Função para salvar dispositivos no arquivo JSON
const saveDevicesToFile = (devices) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(devices, null, 2), 'utf-8');
    console.log('Estado dos dispositivos salvo em devices.json.');
  } catch (error) {
    console.error('Erro ao salvar o arquivo devices.json:', error.message);
  }
};

// Conexão ao broker MQTT
const client = mqtt.connect(brokerUrl);

client.on('connect', () => {
  console.log('Simulador conectado ao broker MQTT.');

  // Função para enviar mensagens de descoberta
  const sendDiscoveryMessages = () => {
    const devices = loadDevicesFromFile(); // Carregar dispositivos
    devices.forEach((device) => {
      client.publish(
        `${baseTopic}/discovery`,
        JSON.stringify({
          id: device.id,
          name: device.name,
          authCode: authenticationCode,
          type: device.type,
          state: device.state,
        })
      );
    });
    console.log('Mensagens de descoberta enviadas.');
  };

  // Envia mensagens de descoberta ao conectar
  sendDiscoveryMessages();

  // Reenvia as mensagens de descoberta a cada 5 segundos
  setInterval(sendDiscoveryMessages, 5000);

  // Subscreve a tópicos para controle
  client.subscribe(`${baseTopic}/+/set`);
});

client.on('message', (topic, message) => {
  console.log('Mensagem recebida:', topic, message.toString()); // Log da mensagem

  // Separar o tópico
  const topicParts = topic.split('/');
  
  // Extraímos o deviceId e o action (última parte do tópico)
  const deviceId = topicParts[2];  // 'lampada_1'
  const action = topicParts[3];    // 'set'

  if (action === 'set') {
    // Carregar dispositivos do arquivo JSON
    let devices = loadDevicesFromFile();
    console.log('Dispositivos carregados:', devices);
    
    // Encontrar o dispositivo que precisa ser atualizado
    const deviceIndex = devices.findIndex((d) => d.id === deviceId);
    console.log(`Dispositivo com ID ${deviceId} encontrado no índice: ${deviceIndex}`);

    if (deviceIndex !== -1) {
      // Atualiza o estado do dispositivo
      const newState = JSON.parse(message.toString()).state;
      devices[deviceIndex].state = newState;
      console.log(`Estado de ${devices[deviceIndex].name} alterado para ${devices[deviceIndex].state}`);

      // Salva as mudanças no arquivo JSON
      saveDevicesToFile(devices);

      // Publica o novo estado no tópico de status
      client.publish(
        `${baseTopic}/${deviceId}/status`,
        JSON.stringify({ state: devices[deviceIndex].state })
      );
      console.log(`Novo estado publicado para ${deviceId}: ${devices[deviceIndex].state}`);
    } else {
      console.log(`Dispositivo com ID ${deviceId} não encontrado.`);
    }
  }
});
