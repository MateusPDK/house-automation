import React from 'react';
import './toggle.scss';

const ToggleSwitch = ({ state, onclick }) => {
  const isOn = state === "on" ? true : false;

  return (
    <button
      className={`toggle-switch ${isOn ? 'on' : 'off'}`}
      onClick={onclick}
    >
      <div className="toggle-ball"></div>
    </button>
  );
};

export default ToggleSwitch;
