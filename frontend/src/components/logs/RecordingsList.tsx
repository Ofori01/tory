import React from "react";
import type { Recording } from "../../types/logs";
import RecordingItem from "./RecordingItem";

interface RecordingsListProps {
  recordings: Recording[];
  isLoading?: boolean;
  onDelete: (id: string) => void;
  onClick: (recording: Recording) => void;
  className?: string;
}

const RecordingsList: React.FC<RecordingsListProps> = ({
  recordings,
  isLoading,
  onDelete,
  onClick,
  className,
}) => {
  return (
    <div
      className={`overflow-y-auto max-h-150 w-full pr-2 custom-scrollbar ${className ?? ""}`}
    >
      {isLoading ? (
        <div className="text-gray-500 text-center py-10 italic">
          Loading recordings…
        </div>
      ) : recordings.length === 0 ? (
        <div className="text-gray-500 text-center py-10 italic">
          No recordings available.
        </div>
      ) : (
        recordings.map((recording) => (
          <RecordingItem
            key={recording.id}
            recording={recording}
            onDelete={onDelete}
            onClick={onClick}
          />
        ))
      )}
    </div>
  );
};

export default RecordingsList;
