import React, { useState } from "react";
import { cn } from "../../lib/utils";
import { CircleX, Info } from "lucide-react";

import cameraImage from "../../assets/camera_feed.png";
import { ToggleSwitch, ValueDisplay } from "../../components/ui";

interface CameraFeedProps {
  className?: string;
  feedUrl?: string;
  cameraLocation: "Front" | "Back";
}

const CameraFeed: React.FC<CameraFeedProps> = ({
  className,
  cameraLocation,
}) => {
  const [isInfoOpen, setInfoOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-lg relative border h-120 w-full border-black/50 overflow-hidden",
        className,
      )}
    >
      {/* feed header */}
      <div className="relative top-1 bg-transparent z-99 flex flex-row justify-between items-center px-2">
        <div className="ml-1 flex flex-row items-center gap-2.5 ">
          <p>{cameraLocation} </p>
          <div className="rounded-sm backdrop-blur-lg   bg-black/20 inline-flex items-center gap-2 p-1">
            {/* recording dot */}
            <div className="rounded-full h-2 w-2 bg-red-500"></div>
            <p className="tracking-wide ">Live Feed</p>
          </div>
        </div>
        <div className="relative">
          <Info
            className="size-5 text-primary cursor-pointer"
            onClick={() => setInfoOpen(!isInfoOpen)}
          />
          {/* Info modal */}
          <div
            className={`absolute  top-6 right-0 flex  flex-col gap-1 backdrop-blur-md bg-black/15 rounded-md w-72 transition-opacity transition-discrete ease-in-out duration-1000 ${isInfoOpen ? "flex" : "hidden"} `}
          >
            <div className="inline-flex justify-between items-center px-2 ">
              <h3 className="tracking-wide text-[12px]">Info : </h3>
              <CircleX
                className="size-3.5 cursor-pointer"
                onClick={() => setInfoOpen(!isInfoOpen)}
              />
            </div>

            <hr className="bg-gray-400 h-0.5" />
            <div className="inline-flex justify-between items-center px-2">
              <p className="tracking-wide text-[12px] ">Camera Recording</p>
              <ToggleSwitch checked onChange={() => {}} />
            </div>

            <div className="inline-flex justify-between items-center px-2">
              <h3 className="tracking-wide text-[12px]">
                FPS Camera Recording
              </h3>
              <ValueDisplay value="-100+" />
            </div>
          </div>
        </div>
      </div>
      {/* Todo: will replace with video feed -> React player */}
      <div className="absolute inset-0 bg-amber-200 h-full w-full ">
        <img
          src={cameraImage}
          alt="camera-feed"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default CameraFeed;
