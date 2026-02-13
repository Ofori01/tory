import React from "react";
import CameraFeed from "./CameraFeed";

const CameraPage: React.FC = () => {
  return (
    <div className=" grid grid-cols-2 grid-rows-1 gap-2 items-stretch justify-center">
      <CameraFeed cameraLocation="Front" />
      <CameraFeed cameraLocation="Back" />
    </div>
  );
};

export default CameraPage;
