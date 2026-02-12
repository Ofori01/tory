import React from "react";
import GeneralSection from "./sections/GeneralSection";
import InternalSection from "./sections/InternalSection";
import DriverCabin from "./sections/DriverCabin";
import { HydraulicSystem } from "../../components/hydraulic";

const GeneralPage: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-3 items-stretch justify-center h-full">
      {/* internal external */}
      <GeneralSection sectionTitle="Internal & External">
        <InternalSection />
      </GeneralSection>
      <GeneralSection sectionTitle="Hydraulic System" className="col-span-2">
        <HydraulicSystem />
      </GeneralSection>
      <GeneralSection sectionTitle="Driver Cabin">
        <DriverCabin />
      </GeneralSection>
    </div>
  );
};

export default GeneralPage;
