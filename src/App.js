import React from "react";
import smarthouse from "./img/smart_house.png";
import { useMqtt } from './hooks/useMqtt';
import Device from "./components/Device/Device";

function App() {
  const { devices, toggleDeviceState } = useMqtt();

  const handleToggle = (device) => {
    const newState = device.state === 'on' ? 'off' : 'on';
    toggleDeviceState(device.id, newState);
  };
  
  function renderDevices() {
    return devices.length === 0 ? (
      <p>Nenhum dispositivo encontrado.</p>
    ) : devices.map((device) => (
      <Device
        key={device.id}
        device={device}
        onClick={handleToggle}
      />
    ))
  };

  return (
    <div className="App">
      <header>
        <img src={smarthouse} width="42" />

        <h1>House Automation</h1>
      </header>

      <div className="devices-list">
        {renderDevices()}
      </div>
    </div>
  );
}

export default App;
