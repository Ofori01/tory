import React from "react";
import SectionItem from "../../../components/ui/SectionItem";
import RadioButton from "../../../components/ui/RadioButton";
import { ValueDisplay } from "../../../components/ui";
import type {
  BackCameraRecording,
  Adjustable,
} from "../../../types/dtos/settings";

interface DriverCabinProps {
  recording?: BackCameraRecording;
  adjustable?: Adjustable;
}

const DriverCabin: React.FC<DriverCabinProps> = ({ recording, adjustable }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-card-foreground rounded-lg px-4 py-3 w-full h-full flex flex-col gap-y-3.5 grow">
        <SectionItem>
          <span className="text-zinc-300 text-sm">Driver Camera Recording</span>
          <RadioButton
            checked={recording?.Driver_Camera_Recording ?? false}
            onChange={() => {}}
          />
        </SectionItem>
        <SectionItem>
          <span className="text-zinc-300 text-sm">Driver Cabin</span>
          <RadioButton
            checked={recording?.Driver_Cabin ?? false}
            onChange={() => {}}
          />
        </SectionItem>
        <SectionItem>
          <span className="text-zinc-300 text-sm">GPS Connection</span>
          <RadioButton
            checked={recording?.GPS_Connection ?? false}
            onChange={() => {}}
          />
        </SectionItem>
        <SectionItem>
          <span className="text-zinc-300 text-sm">LTE Connection</span>
          <RadioButton
            checked={recording?.LTE_Connection ?? false}
            onChange={() => {}}
          />
        </SectionItem>
        <SectionItem>
          <span className="text-zinc-300 text-sm">
            Outrigger Limit Switch #1
          </span>
          <RadioButton
            checked={recording?.Outrigger_Limit_Switch_1 ?? false}
            onChange={() => {}}
          />
        </SectionItem>
        <SectionItem>
          <span className="text-zinc-300 text-sm">
            Outrigger Limit Switch #2
          </span>
          <RadioButton
            checked={recording?.Outrigger_Limit_Switch_2 ?? false}
            onChange={() => {}}
          />
        </SectionItem>
        <SectionItem>
          <span className="text-zinc-300 text-sm">Driver Mode</span>
          <RadioButton
            checked={recording?.Driver_Mode ?? false}
            onChange={() => {}}
          />
        </SectionItem>
        <SectionItem>
          <span className="text-zinc-300 text-sm">Toilet Mode</span>
          <RadioButton
            checked={recording?.Toilet_Mode ?? false}
            onChange={() => {}}
          />
        </SectionItem>
      </div>
      <div className="bg-card-foreground rounded-lg px-4 py-3 w-full flex flex-col gap-y-3.5 mt-3">
        <SectionItem>
          <span className="text-zinc-300 text-sm">Min BLOWER Temp</span>
          <ValueDisplay value={`${adjustable?.Min_BLOWER_Temp ?? "--"}`} />
        </SectionItem>
        <SectionItem>
          <span className="text-zinc-300 text-sm">Exhaust Fan Delta</span>
          <ValueDisplay value={`${adjustable?.Exhaust_Fan_Delta ?? "--"}`} />
        </SectionItem>
        <SectionItem>
          <span className="text-zinc-300 text-sm">Set Audio Volume</span>
          <ValueDisplay value={`${adjustable?.Set_Audio_Volume ?? "--"}`} />
        </SectionItem>
      </div>
    </div>
  );
};

export default DriverCabin;
