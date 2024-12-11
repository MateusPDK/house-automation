import React, { createContext, useState, useEffect } from 'react';
import mqtt from 'mqtt';

export const MqttContext = createContext();

export const MqttProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [devices, setDevices] = useState(() => {
    // Carregar dispositivos do localStorage no início
    const savedDevices = localStorage.getItem('mqttDevices');
    return savedDevices ? JSON.parse(savedDevices) : [];
  });

  useEffect(() => {
    const brokerUrl = 'ws://broker.hivemq.com:8000/mqtt';
    const mqttClient = mqtt.connect(brokerUrl);

    mqttClient.on('connect', () => {
      console.log('Conectado ao broker MQTT via WebSocket');
      mqttClient.subscribe('home/devices/discovery');
    });

    mqttClient.on('message', (topic, message) => {
      if (topic === 'home/devices/discovery') {
        const payload = JSON.parse(message.toString());
        if (payload.authCode === '1234') {
          setDevices((prevDevices) => {
            const exists = prevDevices.some((d) => d.id === payload.id);
            if (!exists) {
              const updatedDevices = [
                ...prevDevices,
                { id: payload.id, name: payload.name, state: 'off' },
              ];
              // Salvar dispositivos no localStorage
              localStorage.setItem('mqttDevices', JSON.stringify(updatedDevices));
              return updatedDevices;
            }
            return prevDevices;
          });
        }
      }
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end();
    };
  }, []);

  return (
    <MqttContext.Provider value={{ devices, client }}>
      {children}
    </MqttContext.Provider>
  );
};
