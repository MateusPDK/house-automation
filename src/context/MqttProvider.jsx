import React, { createContext, useState, useEffect } from 'react';
import mqtt from 'mqtt';

export const MqttContext = createContext();

export const MqttProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    // Conectar ao broker MQTT usando WebSocket
    const brokerUrl = 'ws://broker.hivemq.com:8000/mqtt';
    const mqttClient = mqtt.connect(brokerUrl);

    // Quando a conexão for estabelecida
    mqttClient.on('connect', () => {
      console.log('Conectado ao broker MQTT via WebSocket');
      mqttClient.subscribe('home/devices/discovery');
      mqttClient.subscribe('home/devices/+/status'); // Subscreve os status de todos os dispositivos
    });

    // Quando uma mensagem for recebida
    mqttClient.on('message', (topic, message) => {
      const [_, deviceId, action] = topic.split('/');
      const payload = JSON.parse(message.toString());

      if (action === 'discovery' && payload.authCode === '1234') {
        // Adiciona um novo dispositivo se não existir
        setDevices((prevDevices) => {
          const exists = prevDevices.some((d) => d.id === payload.id);
          if (!exists) {
            return [...prevDevices, { ...payload }];
          }
          return prevDevices;
        });
      }

      if (action === 'status') {
        // Atualiza o estado de um dispositivo
        setDevices((prevDevices) => {
          return prevDevices.map((device) =>
            device.id === deviceId ? { ...device, state: payload.state } : device
          );
        });
      }
    });

    setClient(mqttClient);

    // Limpeza ao desmontar o componente
    return () => {
      mqttClient.end();
    };
  }, []); // Só roda uma vez, quando o componente é montado

  // Função para alternar o estado de um dispositivo
  const toggleDeviceState = (deviceId, newState) => {
    if (client) {
      console.log(`Alterando estado de ${deviceId} para ${newState}`);
  
      // Publica no tópico MQTT
      const topic = `home/devices/${deviceId}/set`;
      client.publish(topic, JSON.stringify({ state: newState }));
  
      // Atualiza o estado local de devices
      setDevices((prevDevices) => {
        return prevDevices.map((device) =>
          device.id === deviceId ? { ...device, state: newState } : device
        );
      });
    }
  };

  return (
    <MqttContext.Provider value={{ devices, toggleDeviceState }}>
      {children}
    </MqttContext.Provider>
  );
};
