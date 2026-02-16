import React, { useState } from 'react';
import type { Recording } from '../../types/logs';
import { Play, MoreHorizontal, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RecordingItemProps {
  recording: Recording;
  onDelete: (id: string) => void;
  onClick: (recording: Recording) => void;
}

const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);
  const diffWeeks = Math.round(diffMs / 604800000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
};

const RecordingItem: React.FC<RecordingItemProps> = ({ recording, onDelete, onClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="flex items-center p-3 mb-2 rounded-sm bg-[#1a1a1a] hover:brightness-125 transition-all relative cursor-pointer"
      onClick={() => onClick(recording)}
    >
      {/* Thumbnail with play button */}
      <div className="relative w-14 h-10 rounded overflow-hidden shrink-0 mr-4 bg-[#2a2a2a]">
        {recording.thumbnailUrl ? (
          <img
            src={recording.thumbnailUrl}
            alt="Recording thumbnail"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#3a3020] to-[#2a2518] flex items-center justify-center">
            {/* Placeholder camera feed look */}
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-[#2a2518] opacity-80" />
              <div className="absolute top-0.5 left-0.5 text-[5px] text-gray-500 font-mono">CAM</div>
              <div className="absolute bottom-0.5 right-0.5 text-[5px] text-gray-500 font-mono">REC</div>
            </div>
          </div>
        )}
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-[#FB923C] flex items-center justify-center shadow-md">
            <Play size={10} className="text-black ml-0.5" fill="black" />
          </div>
        </div>
      </div>

      {/* Relative time */}
      <span className="text-sm text-gray-300 font-mono flex-1">
        {getRelativeTime(recording.createdAt)}
      </span>

      {/* Three-dot menu */}
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="text-gray-500 hover:text-gray-300 transition-colors p-1 cursor-pointer"
        >
          <MoreHorizontal size={18} />
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <>
            {/* Click-away backdrop */}
            <div
              className="fixed inset-0"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 z-999 -top-2 mt-1 z-50 bg-[#2a2a2a] border border-gray-700 rounded-md shadow-lg py-1 min-w-[120px]">
              <button
                onClick={() => {
                  onDelete(recording.id);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-[#3a2020] transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecordingItem;
