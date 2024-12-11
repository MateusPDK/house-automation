import { useEffect, useContext } from 'react';
import { MqttContext } from '../context/MqttProvider';

export const useMqtt = () => {
  const { devices, toggleDeviceState } = useContext(MqttContext);

  useEffect(() => {
    // Verificar se os dispositivos estão sendo atualizados corretamente
    console.log('Dispositivos no hook useMqtt:', devices);
  }, [devices]);

  return { devices, toggleDeviceState };
};
