import React from "react";
import {
  ToggleSwitch,
  RadioButton,
  ValueDisplay,
} from "../../../components/ui";
import SectionItem from "../../../components/ui/SectionItem";
import type {
  InternalExternal,
  SettingsResponse,
} from "../../../types/dtos/settings";

interface InternalSectionProps {
  data: InternalExternal;
  onSettingChange: (patch: Partial<SettingsResponse>) => void;
}

const InternalSection: React.FC<InternalSectionProps> = ({
  data,
  onSettingChange,
}) => {
  const isOn = (val: string | boolean) =>
    typeof val === "boolean" ? val : val === "ON";

  /** Toggle a boolean field on Internal_External */
  const toggleBool = (field: keyof InternalExternal) => {
    onSettingChange({
      General: {
        Internal_External: {
          ...data,
          [field]: !data[field],
        },
      } as SettingsResponse["General"],
    });
  };

  /** Toggle an ON/OFF string field on Internal_External */
  const toggleString = (field: keyof InternalExternal) => {
    const current = data[field] as string;
    onSettingChange({
      General: {
        Internal_External: {
          ...data,
          [field]: current === "ON" ? "OFF" : "ON",
        },
      } as SettingsResponse["General"],
    });
  };

  return (
    <div className="bg-card-foreground rounded-lg px-4 py-3 w-full h-full flex flex-col flex-">
      {/* In-Use Sensor - Radio */}
      <SectionItem>
        <span className="text-zinc-300 text-sm">In-Use Sensor</span>
        <RadioButton
          checked={data.In_Use_Sensor}
          onChange={() => toggleBool("In_Use_Sensor")}
        />
      </SectionItem>

      {/* In-Use Indication - Toggle */}
      <SectionItem>
        <span className="text-zinc-300 text-sm">In-Use Indication</span>
        <ToggleSwitch
          checked={isOn(data.In_Use_Indication)}
          onChange={() => toggleString("In_Use_Indication")}
        />
      </SectionItem>

      {/* Int. Lights - Toggle */}
      <SectionItem>
        <span className="text-zinc-300 text-sm">Int. Lights</span>
        <ToggleSwitch
          checked={isOn(data.Int_Lights)}
          onChange={() => toggleString("Int_Lights")}
        />
      </SectionItem>

      {/* Ext. Lights - Toggle */}
      <SectionItem>
        <span className="text-zinc-300 text-sm">Ext. Lights</span>
        <ToggleSwitch
          checked={isOn(data.Ext_Lights)}
          onChange={() => toggleString("Ext_Lights")}
        />
      </SectionItem>

      {/* Door Lock - Toggle */}
      <SectionItem>
        <span className="text-zinc-300 text-sm">Door Lock</span>
        <ToggleSwitch
          checked={isOn(data.Door_Lock)}
          onChange={() => toggleString("Door_Lock")}
        />
      </SectionItem>

      {/* Loud Speaker - Toggle */}
      <SectionItem>
        <span className="text-zinc-300 text-sm">Loud Speaker</span>
        <ToggleSwitch
          checked={isOn(data.Loudspeaker)}
          onChange={() => toggleString("Loudspeaker")}
        />
      </SectionItem>

      {/* Exhaust Fan - Toggle */}
      <SectionItem>
        <span className="text-zinc-300 text-sm">Exhaust Fan</span>
        <ToggleSwitch
          checked={isOn(data.Exhaust_Fan)}
          onChange={() => toggleString("Exhaust_Fan")}
        />
      </SectionItem>

      {/* Blower Fan - Toggle */}
      <SectionItem>
        <span className="text-zinc-300 text-sm">Blower Fan</span>
        <ToggleSwitch
          checked={isOn(data.BLOWER_Fan)}
          onChange={() => toggleString("BLOWER_Fan")}
        />
      </SectionItem>

      {/* Int. Temp - Value Display */}
      <SectionItem>
        <span className="text-zinc-300 text-sm">Int. Temp</span>
        <ValueDisplay value={`${data.Int_Temp}°`} />
      </SectionItem>

      {/* Ext. Temp - Value Display */}
      <SectionItem>
        <span className="text-zinc-300 text-sm">Ext. Temp</span>
        <ValueDisplay value={`${data.Ext_Temp}°`} />
      </SectionItem>

      {/* Battery - Value Display */}
      <SectionItem>
        <span className="text-zinc-300 text-sm">Battery</span>
        <ValueDisplay value={data.Battery} />
      </SectionItem>
    </div>
  );
};

export default InternalSection;
