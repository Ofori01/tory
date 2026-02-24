import React from "react";
import SectionItem from "../../../components/ui/SectionItem";
import RadioButton from "../../../components/ui/RadioButton";
import { AdjustableValue } from "../../../components/ui";
import type {
  BackCameraRecording,
  Adjustable,
  SettingsResponse,
} from "../../../types/dtos/settings";

interface DriverCabinProps {
  recording?: BackCameraRecording;
  adjustable?: Adjustable;
  onSettingChange: (patch: Partial<SettingsResponse>) => void;
  isUpdating?: boolean;
}

const DriverCabin: React.FC<DriverCabinProps> = ({
  recording,
  adjustable,
  onSettingChange,
  isUpdating = false,
}) => {
  /** Helper to patch a single Back_Camera_Recording field */
  const toggleRecording = (field: keyof BackCameraRecording) => {
    onSettingChange({
      General: {
        Back_Camera_Recording: {
          ...recording!,
          [field]: !recording?.[field],
        },
      } as SettingsResponse["General"],
    });
  };

  /** Helper to patch a single Adjustable field by delta */
  const adjustValue = (field: keyof Adjustable, delta: number) => {
    const current = adjustable?.[field] ?? 0;
    onSettingChange({
      General: {
        Adjustable: {
          ...adjustable!,
          [field]: current + delta,
        },
      } as SettingsResponse["General"],
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-card-foreground rounded-lg px-4 py-3 w-full h-full flex flex-col gap-y-3.5 grow">
        <SectionItem>
          <span className="text-zinc-300 text-sm">Driver Camera Recording</span>
          <RadioButton
            checked={recording?.Driver_Camera_Recording ?? false}
            onChange={() => toggleRecording("Driver_Camera_Recording")}
          />
        </SectionItem>
        <SectionItem>
          <span className="text-zinc-300 text-sm">Driver Cabin</span>
          <RadioButton
            checked={recording?.Driver_Cabin ?? false}
            onChange={() => toggleRecording("Driver_Cabin")}
          />
        </SectionItem>
        <SectionItem>
          <span className="text-zinc-300 text-sm">GPS Connection</span>
          <RadioButton
            checked={recording?.GPS_Connection ?? false}
            onChange={() => toggleRecording("GPS_Connection")}
          />
        </SectionItem>
        <SectionItem>
          <span className="text-zinc-300 text-sm">LTE Connection</span>
          <RadioButton
            checked={recording?.LTE_Connection ?? false}
            onChange={() => toggleRecording("LTE_Connection")}
          />
        </SectionItem>
        <SectionItem>
          <span className="text-zinc-300 text-sm">
            Outrigger Limit Switch #1
          </span>
          <RadioButton
            checked={recording?.Outrigger_Limit_Switch_1 ?? false}
            onChange={() => toggleRecording("Outrigger_Limit_Switch_1")}
          />
        </SectionItem>
        <SectionItem>
          <span className="text-zinc-300 text-sm">
            Outrigger Limit Switch #2
          </span>
          <RadioButton
            checked={recording?.Outrigger_Limit_Switch_2 ?? false}
            onChange={() => toggleRecording("Outrigger_Limit_Switch_2")}
          />
        </SectionItem>
        <SectionItem>
          <span className="text-zinc-300 text-sm">Driver Mode</span>
          <RadioButton
            checked={recording?.Driver_Mode ?? false}
            onChange={() => toggleRecording("Driver_Mode")}
          />
        </SectionItem>
        <SectionItem>
          <span className="text-zinc-300 text-sm">Toilet Mode</span>
          <RadioButton
            checked={recording?.Toilet_Mode ?? false}
            onChange={() => toggleRecording("Toilet_Mode")}
          />
        </SectionItem>
      </div>
      <div className="bg-card-foreground rounded-lg px-4 py-3 w-full flex flex-col gap-y-3.5 mt-3">
        <SectionItem>
          <span className="text-zinc-300 text-sm">Min BLOWER Temp</span>
          <AdjustableValue
            value={`${adjustable?.Min_BLOWER_Temp ?? "--"}`}
            onDecrement={() => adjustValue("Min_BLOWER_Temp", -1)}
            onIncrement={() => adjustValue("Min_BLOWER_Temp", 1)}
            disabled={isUpdating}
          />
        </SectionItem>
        <SectionItem>
          <span className="text-zinc-300 text-sm">Exhaust Fan Delta</span>
          <AdjustableValue
            value={`${adjustable?.Exhaust_Fan_Delta ?? "--"}`}
            onDecrement={() => adjustValue("Exhaust_Fan_Delta", -1)}
            onIncrement={() => adjustValue("Exhaust_Fan_Delta", 1)}
            disabled={isUpdating}
          />
        </SectionItem>
        <SectionItem>
          <span className="text-zinc-300 text-sm">Set Audio Volume</span>
          <AdjustableValue
            value={`${adjustable?.Set_Audio_Volume ?? "--"}`}
            onDecrement={() => adjustValue("Set_Audio_Volume", -1)}
            onIncrement={() => adjustValue("Set_Audio_Volume", 1)}
            disabled={isUpdating}
          />
        </SectionItem>
      </div>
    </div>
  );
};

export default DriverCabin;
