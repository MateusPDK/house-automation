import React from 'react';

const Lamp = ({ isOn }) => (
  <svg fill="none" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12h1m-3.5-6.5 1-1M12 3V2M5.5 5.5l-1-1M3 12H2m8 10h4m3-10a5 5 0 1 0-7 4.584V19h4v-2.416A5.001 5.001 0 0 0 17 12Z" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill={isOn ? "#FFEA00" : ""} />
  </svg>
);

const TV = ({ isOn }) => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <g data-name="Layer 2">
      <rect height="2" rx="1" ry="1" width="4" x="23.55" y="12.69" />
      <rect height="2" rx="1" ry="1" width="4" x="23.55" y="17.69" />
      <rect height="4" rx="1" ry="1" width="2" x="23" y="26.12" />
      <rect height="4" rx="1" ry="1" width="2" x="7" y="26.12" />
      <path d="M28 27.19H4a3 3 0 0 1-3-3V8.22a3 3 0 0 1 3-3h24a3 3 0 0 1 3 3v15.94a3 3 0 0 1-3 3.03Zm-24-20a1 1 0 0 0-1 1v15.97a1 1 0 0 0 1 1h24a1 1 0 0 0 1-1V8.22a1 1 0 0 0-1-1Z" />
      <path d="M20.59 23.69H6.78a2.1 2.1 0 0 1-2.09-2.09V11.12a2.44 2.44 0 0 1 2.44-2.43h13.46a2.1 2.1 0 0 1 2.09 2.09v10.81a2.1 2.1 0 0 1-2.09 2.1Zm-13.47-13a.44.44 0 0 0-.44.44v10.46a.09.09 0 0 0 .09.09h13.82a.09.09 0 0 0 .09-.09V10.78a.09.09 0 0 0-.09-.09ZM23.13 2.88a1 1 0 0 1-.5.87l-4.27 2.44h-4.72L9.37 3.75A1 1 0 0 1 9 2.38a1 1 0 0 1 .86-.5 1 1 0 0 1 .5.13L16 5.22 21.64 2a1 1 0 0 1 1.36.38 1 1 0 0 1 .13.5Z" />
      <path d="M7.13 9.69h13.46a1.09 1.09 0 0 1 1.09 1.09v10.81a1.09 1.09 0 0 1-1.09 1.09H6.78a1.09 1.09 0 0 1-1.09-1.09V11.12a1.44 1.44 0 0 1 1.44-1.43Z" fill={isOn ? "#FFEA00" : ""} />
    </g>
  </svg>
);

const Icon = ({ name, isOn = false }) => {
  const icons = {
    lamp: <Lamp isOn={isOn} />,
    tv: <TV isOn={isOn} />,
  };

  const iconSrc = icons[name];

  if (!iconSrc) {
    return <img src="/icons/default.svg" alt="default icon" />;
  }

  return iconSrc;
};

export default Icon;
