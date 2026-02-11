import React, { useState } from "react";
import SectionItem from "../../../components/ui/SectionItem";
import RadioButton from "../../../components/ui/RadioButton";

const DriverCabin: React.FC = () => {
  const [driverCamRecording, setDriverCameraRecording] = useState(false);
  return (
    <div className="bg-card-foreground rounded-lg px-4 py-3 w-full flex flex-col gap-y-3.5">
      <SectionItem>
        <span className="text-zinc-300 text-sm">Driver Camera Recording</span>
        <RadioButton
          checked={driverCamRecording}
          onChange={setDriverCameraRecording}
        />
      </SectionItem>
      <SectionItem>
        <span className="text-zinc-300 text-sm">Back Camera Recording</span>
        <RadioButton
          checked={driverCamRecording}
          onChange={setDriverCameraRecording}
        />
      </SectionItem>
      <SectionItem>
        <span className="text-zinc-300 text-sm">Gps Connection</span>
        <RadioButton
          checked={driverCamRecording}
          onChange={setDriverCameraRecording}
        />
      </SectionItem>
      <SectionItem>
        <span className="text-zinc-300 text-sm">
          Outtertrigger Limit Switch #1
        </span>
        <RadioButton
          checked={driverCamRecording}
          onChange={setDriverCameraRecording}
        />
      </SectionItem>
      <SectionItem>
        <span className="text-zinc-300 text-sm">
          Outtertrigger Limit Switch #2
        </span>
        <RadioButton
          checked={driverCamRecording}
          onChange={setDriverCameraRecording}
        />
      </SectionItem>
      <SectionItem>
        <span className="text-zinc-300 text-sm">Driver Mode </span>
        <RadioButton
          checked={driverCamRecording}
          onChange={setDriverCameraRecording}
        />
      </SectionItem>
      <SectionItem>
        <span className="text-zinc-300 text-sm">Toilet Mode </span>
        <RadioButton
          checked={driverCamRecording}
          onChange={setDriverCameraRecording}
        />
      </SectionItem>
    </div>
  );
};

export default DriverCabin;
