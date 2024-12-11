import React from "react";
import Toggle from "../Toggle/Toggle";
import Icon from "../Icon/Icon";
import './device.scss';

const Device = ({ device, onClick }) => {
  const { name, id, state, type } = device;

  return (
    <div id={id} className="device-item">
      <h2>{name}</h2>

      <div className="toggle-wrapper">
        <Icon
          isOn={state === "on" ? true : false}
          name={type}
        />

        <Toggle
          state={state}
          onclick={() => onClick(device)}
        />
      </div>
    </div>
  );
};

export default Device;