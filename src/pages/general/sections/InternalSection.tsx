import React, { useState } from "react";
import {
  ToggleSwitch,
  RadioButton,
  ValueDisplay,
} from "../../../components/ui";
import SectionItem from "../../../components/ui/SectionItem";

const InternalSection: React.FC = () => {
  const [inUseSensor, setInUseSensor] = useState(false);
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
    <div className="bg-card-foreground rounded-lg px-4 py-3 w-full flex flex-col gap-y-3.5">
      {/* In-Use Sensor - Radio */}
      <SectionItem>
        <span className="text-zinc-300 text-sm">In-Use Sensor</span>
        <RadioButton checked={inUseSensor} onChange={setInUseSensor} />
      </SectionItem>

      {/* In-Use Indication - Toggle (off) */}
      <SectionItem>
        <span className="text-zinc-300 text-sm">In-Use Indication</span>
        <ToggleSwitch checked={inUseIndication} onChange={setInUseIndication} />
      </SectionItem>

      {/* Int. Lights - Toggle (on/blue) */}
      <SectionItem>
        <span className="text-zinc-300 text-sm">Int. Lights</span>
        <ToggleSwitch checked={intLights} onChange={setIntLights} />
      </SectionItem>

      {/* Ext. Lights - Toggle (on/blue) */}
      <SectionItem>
        <span className="text-zinc-300 text-sm">Ext. Lights</span>
        <ToggleSwitch checked={extLights} onChange={setExtLights} />
      </SectionItem>

      {/* Door Lock - Toggle (on/orange) */}
      <SectionItem>
        <span className="text-zinc-300 text-sm">Door Lock</span>
        <ToggleSwitch checked={doorLock} onChange={setDoorLock} />
      </SectionItem>

      {/* Loud Speaker - Toggle (off) */}
      <SectionItem>
        <span className="text-zinc-300 text-sm">Loud Speaker</span>
        <ToggleSwitch checked={loudSpeaker} onChange={setLoudSpeaker} />
      </SectionItem>

      {/* Exhaust Fan - Toggle (off) */}
      <SectionItem>
        <span className="text-zinc-300 text-sm">Exhaust Fan</span>
        <ToggleSwitch checked={exhaustFan} onChange={setExhaustFan} />
      </SectionItem>

      {/* Blower Fan - Toggle (off) */}
      <SectionItem>
        <span className="text-zinc-300 text-sm">Blower Fan</span>
        <ToggleSwitch checked={blowerFan} onChange={setBlowerFan} />
      </SectionItem>

      {/* Int. Temp - Value Display */}
      <SectionItem>
        <span className="text-zinc-300 text-sm">Int. Temp</span>
        <ValueDisplay value={intTemp} />
      </SectionItem>

      {/* Ext. Temp - Value Display */}
      <SectionItem>
        <span className="text-zinc-300 text-sm">Ext. Temp</span>
        <ValueDisplay value={extTemp} />
      </SectionItem>

      {/* Battery - Value Display */}
      <SectionItem>
        <span className="text-zinc-300 text-sm">Battery</span>
        <ValueDisplay value={battery} />
      </SectionItem>
    </div>
  );
};

export default InternalSection;
