import React from "react";
import Toggle from "../Toggle/Toggle";
import './device.scss';

const Device = ({ id, name, state }) => {

  return (
    <div className="device-item">
      <h2>{name}</h2>

      <Toggle />
    </div>
  );
};

export default Device;