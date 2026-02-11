import React from "react";
import GeneralSection from "./sections/GeneralSection";
import InternalSection from "./sections/InternalSection";

const GeneralPage: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-3 items-center justify-center ">
      {/* internal external */}
      <GeneralSection sectionTitle="Internal & External">
        <InternalSection/>
      </GeneralSection>
      <div className="h-full bg-primary col-span-2">hi</div>
      <div className="h-full bg-primary"> hi</div>
    </div>
  );
};

export default GeneralPage;
