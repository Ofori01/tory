import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Recording } from '../../types/logs';
import { X, Play, Pause, RotateCcw, RotateCw, Sun, VideoOff } from 'lucide-react';
import recordingsService from '../../backend/recordings.service';

const SEGMENT_SECONDS = 10;

interface RecordingModalProps {
  recording: Recording;
  onClose: () => void;
}

const RecordingModal: React.FC<RecordingModalProps> = ({ recording, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [currentTimestamp, setCurrentTimestamp] = useState<Date>(recording.createdAt);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync volume to video element whenever it changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  const loadSegment = useCallback((timestamp: Date) => {
    setNotFound(false);
    setIsLoading(true);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setCurrentTimestamp(timestamp);
  }, []);

  const handlePrevSegment = () => {
    loadSegment(new Date(currentTimestamp.getTime() - SEGMENT_SECONDS * 1000));
  };

  const handleNextSegment = () => {
    loadSegment(new Date(currentTimestamp.getTime() + SEGMENT_SECONDS * 1000));
  };

  const handleLoadedData = () => {
    setIsLoading(false);
    setNotFound(false);
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      videoRef.current.volume = volume;
      videoRef.current.play();
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setNotFound(true);
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setCurrentTime(videoRef.current.currentTime);
      setProgress(videoRef.current.currentTime / videoRef.current.duration);
    }
  };

  const handlePlayPause = () => {
    if (!videoRef.current || notFound) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = fraction * duration;
    setProgress(fraction);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
    setVolume(fraction);
  };

  const formatTime = (seconds: number) => {
    const s = Math.floor(seconds);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const src = recordingsService.getRecordingUrl(recording.camera, currentTimestamp);

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
        <div className="relative bg-black aspect-video">

          {/* Real video element — key forces remount on segment change */}
          <video
            ref={videoRef}
            key={src}
            src={src}
            className="w-full h-full object-contain"
            onLoadedData={handleLoadedData}
            onError={handleError}
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            preload="auto"
          />

          {/* Loading spinner */}
          {isLoading && !notFound && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {/* Not found overlay */}
          {notFound && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-3">
              <VideoOff size={40} className="text-gray-500" />
              <p className="text-gray-400 text-sm text-center px-6">
                No recording available at this time.
              </p>
            </div>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors cursor-pointer z-20"
          >
            <X size={18} />
          </button>

          {/* Brightness icon */}
          <button className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors cursor-pointer">
            <Sun size={20} />
          </button>

          {/* Volume Slider (vertical, left side) */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
            <div
              className="w-1 h-24 bg-white/30 rounded-full relative cursor-pointer"
              onClick={handleVolumeClick}
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
            {/* Prev 10s segment */}
            <button
              className="text-white/80 hover:text-white transition-colors cursor-pointer"
              onClick={handlePrevSegment}
              title="Previous segment"
            >
              <div className="relative">
                <RotateCcw size={28} />
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold">10</span>
              </div>
            </button>

            {/* Play / Pause */}
            <button
              onClick={handlePlayPause}
              disabled={notFound}
              className="text-white hover:scale-110 transition-transform cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPlaying
                ? <Pause size={44} strokeWidth={2.5} />
                : <Play size={44} strokeWidth={2.5} className="ml-1" />}
            </button>

            {/* Next 10s segment */}
            <button
              className="text-white/80 hover:text-white transition-colors cursor-pointer"
              onClick={handleNextSegment}
              title="Next segment"
            >
              <div className="relative">
                <RotateCw size={28} />
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold">10</span>
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
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${progress * 100}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `${progress * 100}%`, transform: 'translate(-50%, -50%)' }}
                />
              </div>
              <span className="text-white/80 text-xs font-mono min-w-18 text-right">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordingModal;
