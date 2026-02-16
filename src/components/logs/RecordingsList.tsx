import React from 'react';
import type { Recording } from '../../types/logs';
import RecordingItem from './RecordingItem';

interface RecordingsListProps {
  recordings: Recording[];
  onDelete: (id: string) => void;
  onClick: (recording: Recording) => void;
  className?: string;
}

const RecordingsList: React.FC<RecordingsListProps> = ({ recordings, onDelete, onClick, className }) => {
  return (
    <div className={`overflow-y-auto max-h-[600px] w-full pr-2 custom-scrollbar ${className ?? ''}`}>
      {recordings.map((recording) => (
        <RecordingItem
          key={recording.id}
          recording={recording}
          onDelete={onDelete}
          onClick={onClick}
        />
      ))}
      {recordings.length === 0 && (
        <div className="text-gray-500 text-center py-10 italic">
          No recordings available.
        </div>
      )}
    </div>
  );
};

export default RecordingsList;
