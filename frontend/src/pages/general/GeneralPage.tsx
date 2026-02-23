import React from "react";
import GeneralSection from "./sections/GeneralSection";
import InternalSection from "./sections/InternalSection";
import DriverCabin from "./sections/DriverCabin";
import { HydraulicSystem } from "../../components/hydraulic";
import { useGetSettings } from "../../hooks/querries/useSettingsQuerries";
import { useUpdateSettings } from "../../hooks/mutations/useSettingsMutations";
import {
  SectionSkeleton,
  HydraulicSkeleton,
  DriverCabinSkeleton,
} from "../../components/ui/skeletons";
import EmptyState from "../../components/ui/EmptyState";

const GeneralPage: React.FC = () => {
  const { data: settings, isLoading, isError } = useGetSettings();
  const { mutate: updateSettings, isPending: isUpdating } = useUpdateSettings();

  const general = settings?.General;

  return (
    <div className="grid grid-cols-4 gap-3 items-stretch justify-center h-full">
      {/* Internal & External */}
      <GeneralSection sectionTitle="Internal & External">
        {isLoading ? (
          <SectionSkeleton rows={11} />
        ) : isError || !general?.Internal_External ? (
          <EmptyState message="Unable to load internal & external data" />
        ) : (
          <InternalSection
            data={general.Internal_External}
            onSettingChange={updateSettings}
          />
        )}
      </GeneralSection>

      {/* Hydraulic System */}
      <GeneralSection sectionTitle="Hydraulic System" className="col-span-2">
        {isLoading ? (
          <HydraulicSkeleton />
        ) : isError || !general?.Hydraulic_System ? (
          <EmptyState message="Unable to load hydraulic system data" />
        ) : (
          <HydraulicSystem
            data={general.Hydraulic_System}
            onSettingChange={updateSettings}
          />
        )}
      </GeneralSection>

      {/* Driver Cabin */}
      <GeneralSection sectionTitle="Driver Cabin">
        {isLoading ? (
          <DriverCabinSkeleton />
        ) : isError || !general ? (
          <EmptyState message="Unable to load driver cabin data" />
        ) : (
          <DriverCabin
            recording={general.Back_Camera_Recording}
            adjustable={general.Adjustable}
            onSettingChange={updateSettings}
            isUpdating={isUpdating}
          />
        )}
      </GeneralSection>
    </div>
  );
};

export default GeneralPage;
