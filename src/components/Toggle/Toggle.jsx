import React, { useState } from 'react';
import './toggle.scss';

const ToggleSwitch = () => {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <div className={`toggle-switch ${isOn ? 'on' : 'off'}`} onClick={handleToggle}>
      <div className="toggle-ball"></div>
    </div>
  );
};

export default ToggleSwitch;
