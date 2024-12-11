import { useContext } from 'react';
import { MqttContext } from '../context/MqttProvider';

export const useMqtt = () => {
  return useContext(MqttContext);
};
