import React, { useState } from 'react';
import type { Recording } from '../../types/logs';
import { X, Play, Pause, RotateCcw, RotateCw, Sun } from 'lucide-react';

interface RecordingModalProps {
  recording: Recording;
  onClose: () => void;
}

const RecordingModal: React.FC<RecordingModalProps> = ({ recording, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0.35); // Mock progress at 35%
  const [volume, setVolume] = useState(0.7);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = (e.clientX - rect.left) / rect.width;
    setProgress(Math.max(0, Math.min(1, fraction)));
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = 1 - (e.clientY - rect.top) / rect.height;
    setVolume(Math.max(0, Math.min(1, fraction)));
  };

  const formatTime = (fraction: number) => {
    const totalSeconds = Math.floor(fraction * 120); // Assume 2 min total
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative z-10 w-full max-w-2xl mx-4 rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video / Image Area */}
        <div className="relative bg-black aspect-video">
          <img
            src={recording.thumbnailUrl}
            alt="Recording playback"
            className="w-full h-full object-cover"
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors cursor-pointer z-20"
          >
            <X size={18} />
          </button>

          {/* Brightness Icon */}
          <button className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors cursor-pointer">
            <Sun size={20} />
          </button>

          {/* Volume Slider (vertical, left side) */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
            <div
              className="w-1 h-24 bg-white/30 rounded-full relative cursor-pointer"
              onClick={handleVolumeChange}
            >
              <div
                className="absolute bottom-0 left-0 w-full bg-white rounded-full transition-all"
                style={{ height: `${volume * 100}%` }}
              />
              <div
                className="absolute left-2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-md"
                style={{ bottom: `${volume * 100}%`, transform: 'translate(-50%, 50%)' }}
              />
            </div>
          </div>

          {/* Center Playback Controls */}
          <div className="absolute inset-0 flex items-center justify-center gap-10">
            {/* Rewind 10s */}
            <button
              className="text-white/80 hover:text-white transition-colors cursor-pointer"
              onClick={() => setProgress((p) => Math.max(0, p - 10 / 120))}
            >
              <div className="relative">
                <RotateCcw size={28} />
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold">
                  10
                </span>
              </div>
            </button>

            {/* Play / Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:scale-110 transition-transform cursor-pointer"
            >
              {isPlaying ? <Pause size={44} strokeWidth={2.5} /> : <Play size={44} strokeWidth={2.5} className="ml-1" />}
            </button>

            {/* Forward 10s */}
            <button
              className="text-white/80 hover:text-white transition-colors cursor-pointer"
              onClick={() => setProgress((p) => Math.min(1, p + 10 / 120))}
            >
              <div className="relative">
                <RotateCw size={28} />
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold">
                  10
                </span>
              </div>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
            <div className="flex items-center gap-2">
              <div
                className="flex-1 h-1 bg-white/30 rounded-full cursor-pointer relative group"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-red-500 rounded-full transition-all"
                  style={{ width: `${progress * 100}%` }}
                />
                {/* Scrubber dot */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `${progress * 100}%`, transform: 'translate(-50%, -50%)' }}
                />
              </div>
              <span className="text-white/80 text-xs font-mono min-w-[32px] text-right">
                {formatTime(progress)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordingModal;
