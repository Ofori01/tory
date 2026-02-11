import React, { useState } from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: "blue" | "orange";
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  color = "blue",
}) => {
  const bgColor = checked
    ? color === "orange"
      ? "bg-orange-500"
      : "bg-blue-500"
    : "bg-zinc-600";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${bgColor}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
};

interface RadioButtonProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-colors ${
        checked ? "border-orange-500 bg-orange-500/20" : "border-zinc-500"
      }`}
    >
      {checked && <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
    </button>
  );
};

interface ValueDisplayProps {
  value: string;
}

const ValueDisplay: React.FC<ValueDisplayProps> = ({ value }) => {
  return (
    <div className="bg-zinc-700 rounded px-3 py-0.5 min-w-12 text-center text-sm text-zinc-300">
      {value}
    </div>
  );
};

const InternalSection: React.FC = () => {
  const [inUseSensor, setInUseSensor] = useState(true);
  const [inUseIndication, setInUseIndication] = useState(false);
  const [intLights, setIntLights] = useState(true);
  const [extLights, setExtLights] = useState(true);
  const [doorLock, setDoorLock] = useState(true);
  const [loudSpeaker, setLoudSpeaker] = useState(false);
  const [exhaustFan, setExhaustFan] = useState(false);
  const [blowerFan, setBlowerFan] = useState(false);

  const intTemp = "12°";
  const extTemp = "12°";
  const battery = "12%";

  return (
    <div className="bg-zinc-800/60 rounded-lg px-4 py-3 w-full flex flex-col gap-y-2.5">
      {/* In-Use Sensor - Radio */}
      <div className="flex justify-between items-center w-full">
        <span className="text-zinc-300 text-sm">In-Use Sensor</span>
        <RadioButton checked={inUseSensor} onChange={setInUseSensor} />
      </div>

      {/* In-Use Indication - Toggle (off) */}
      <div className="flex justify-between items-center w-full">
        <span className="text-zinc-300 text-sm">In-Use Indication</span>
        <ToggleSwitch
          checked={inUseIndication}
          onChange={setInUseIndication}
          color="blue"
        />
      </div>

      {/* Int. Lights - Toggle (on/blue) */}
      <div className="flex justify-between items-center w-full">
        <span className="text-zinc-300 text-sm">Int. Lights</span>
        <ToggleSwitch
          checked={intLights}
          onChange={setIntLights}
          color="blue"
        />
      </div>

      {/* Ext. Lights - Toggle (on/blue) */}
      <div className="flex justify-between items-center w-full">
        <span className="text-zinc-300 text-sm">Ext. Lights</span>
        <ToggleSwitch
          checked={extLights}
          onChange={setExtLights}
          color="blue"
        />
      </div>

      {/* Door Lock - Toggle (on/orange) */}
      <div className="flex justify-between items-center w-full">
        <span className="text-zinc-300 text-sm">Door Lock</span>
        <ToggleSwitch
          checked={doorLock}
          onChange={setDoorLock}
          color="orange"
        />
      </div>

      {/* Loud Speaker - Toggle (off) */}
      <div className="flex justify-between items-center w-full">
        <span className="text-zinc-300 text-sm">Loud Speaker</span>
        <ToggleSwitch
          checked={loudSpeaker}
          onChange={setLoudSpeaker}
          color="blue"
        />
      </div>

      {/* Exhaust Fan - Toggle (off) */}
      <div className="flex justify-between items-center w-full">
        <span className="text-zinc-300 text-sm">Exhaust Fan</span>
        <ToggleSwitch
          checked={exhaustFan}
          onChange={setExhaustFan}
          color="blue"
        />
      </div>

      {/* Blower Fan - Toggle (off) */}
      <div className="flex justify-between items-center w-full">
        <span className="text-zinc-300 text-sm">Blower Fan</span>
        <ToggleSwitch
          checked={blowerFan}
          onChange={setBlowerFan}
          color="blue"
        />
      </div>

      {/* Int. Temp - Value Display */}
      <div className="flex justify-between items-center w-full">
        <span className="text-zinc-300 text-sm">Int. Temp</span>
        <ValueDisplay value={intTemp} />
      </div>

      {/* Ext. Temp - Value Display */}
      <div className="flex justify-between items-center w-full">
        <span className="text-zinc-300 text-sm">Ext. Temp</span>
        <ValueDisplay value={extTemp} />
      </div>

      {/* Battery - Value Display */}
      <div className="flex justify-between items-center w-full">
        <span className="text-zinc-300 text-sm">Battery</span>
        <ValueDisplay value={battery} />
      </div>
    </div>
  );
};

export default InternalSection;
