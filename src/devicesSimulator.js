const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');

// Configuração do broker e tópicos
const brokerUrl = 'mqtt://broker.hivemq.com'; // Alterar se estiver usando outro broker
const baseTopic = 'home/devices';
const authenticationCode = '1234'; // Código que o app espera para autenticar os dispositivos

// Caminho absoluto do arquivo JSON
const devicesFilePath = path.resolve(__dirname, 'devices.json');

// Função para ler dispositivos do arquivo JSON
const loadDevicesFromFile = () => {
  try {
    const data = fs.readFileSync(devicesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler o arquivo devices.json:', error.message);
    return [];
  }
};

// Função para salvar dispositivos no arquivo JSON
const saveDevicesToFile = (devices) => {
  try {
    fs.writeFileSync(devicesFilePath, JSON.stringify(devices, null, 2), 'utf-8');
    console.log('Estado dos dispositivos salvo em devices.json.');
  } catch (error) {
    console.error('Erro ao salvar o arquivo devices.json:', error.message);
  }
};

// Carrega dispositivos simulados
let devices = loadDevicesFromFile();

// Conexão ao broker MQTT
const client = mqtt.connect(brokerUrl);

client.on('connect', () => {
  console.log('Simulador conectado ao broker MQTT.');

  // Função para enviar mensagens de descoberta
  const sendDiscoveryMessages = () => {
    devices.forEach((device) => {
      client.publish(
        `${baseTopic}/discovery`,
        JSON.stringify({
          id: device.id,
          name: device.name,
          authCode: authenticationCode,
        })
      );
    });
    console.log('Mensagens de descoberta enviadas.');
  };

  // Envia mensagens de descoberta ao conectar
  sendDiscoveryMessages();

  // Reenvia as mensagens de descoberta a cada 30 segundos
  setInterval(sendDiscoveryMessages, 30000);

  // Subscreve a tópicos para controle
  client.subscribe(`${baseTopic}/+/set`);
});

client.on('message', (topic, message) => {
  const [_, deviceId, action] = topic.split('/'); // Exemplo: home/devices/lampada_1/set
  const payload = JSON.parse(message.toString());

  // Localiza o dispositivo correspondente
  const device = devices.find((d) => d.id === deviceId);

  if (device && action === 'set') {
    // Atualiza o estado do dispositivo
    device.state = payload.state;
    console.log(`Estado de ${device.name} alterado para ${device.state}`);

    // Salva o estado atualizado no arquivo JSON
    saveDevicesToFile(devices);

    // Publica o novo estado no tópico de status
    client.publish(
      `${baseTopic}/${deviceId}/status`,
      JSON.stringify({ state: device.state })
    );
  }
});
