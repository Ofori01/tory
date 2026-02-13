import React from "react";
import { cn } from "../../lib/utils";
import { Info } from "lucide-react";

import cameraImage from "../../assets/camera_feed.png";

interface CameraFeedProps {
  className?: string;
  feedUrl?: string;
  cameraLocation: "Front" | "Back";
}

const CameraFeed: React.FC<CameraFeedProps> = ({
  className,
  cameraLocation,
}) => {
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
        <Info className="size-5 text-primary" />
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
