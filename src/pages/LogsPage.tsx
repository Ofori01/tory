import React, { useState, useMemo, useCallback } from 'react';
import type { LogEntry, LogFilter, Recording } from '../types/logs';
import LogsFilterBar from '../components/logs/LogsFilterBar';
import LogsList from '../components/logs/LogsList';
import RecordingsList from '../components/logs/RecordingsList';
import SystemInfoModal from '../components/modals/SystemInfoModal';
import RecordingModal from '../components/modals/RecordingModal';
import thumbnail from '../assets/camera_feed.png'

// ── Mock Data ──────────────────────────────────────────────────────────

const formatDate = (d: Date) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const generateMockLogs = (): LogEntry[] => {
  const logs: LogEntry[] = [];

  for (let i = 0; i < 5; i++) {
    logs.push({
      id: `init-${i}`,
      timestamp: formatDate(new Date(2025, 3, 3, 8, 0, 35)),
      level: 'INFO',
      message: 'All cameras connected successfully',
    });
  }

  for (let i = 0; i < 3; i++) {
    logs.push({
      id: `err-${i}`,
      timestamp: formatDate(new Date(2025, 3, 3, 14, 45, 12)),
      level: 'ERROR',
      message: 'Camera 15 (Warehouse) - Video stream corruption detected',
      details: 'Failed: WebRTC negotiation timeout',
    });
  }

  for (let i = 0; i < 3; i++) {
    logs.push({
      id: `mid-${i}`,
      timestamp: formatDate(new Date(2025, 3, 3, 8, 0, 35)),
      level: 'INFO',
      message: 'All cameras connected successfully',
    });
  }

  for (let i = 0; i < 4; i++) {
    logs.push({
      id: `warn-${i}`,
      timestamp: formatDate(new Date(2025, 3, 3, 10, 15, 46)),
      level: 'WARNING',
      message: 'Camera 7 (Hallway 1) - Connection stability issues detected',
    });
  }

  return logs;
};

const generateMockRecordings = (): Recording[] => {
  const now = Date.now();
  return [
    { id: 'rec-1', thumbnailUrl: thumbnail, createdAt: new Date(now - 5 * 60 * 1000) },         // 5 mins ago
    { id: 'rec-2', thumbnailUrl: thumbnail, createdAt: new Date(now - 24 * 60 * 60 * 1000) },    // 1 day ago
    { id: 'rec-3', thumbnailUrl: thumbnail, createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000) },  // 2 days ago
    { id: 'rec-4', thumbnailUrl: thumbnail, createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000) },  // 3 days ago
    { id: 'rec-5', thumbnailUrl: thumbnail, createdAt: new Date(now - 4 * 24 * 60 * 60 * 1000) },  // 4 days ago
    { id: 'rec-6', thumbnailUrl: thumbnail, createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000) },  // 5 days ago
    { id: 'rec-7', thumbnailUrl: thumbnail, createdAt: new Date(now - 7 * 24 * 60 * 60 * 1000) },  // 1 week ago
    { id: 'rec-8', thumbnailUrl: thumbnail, createdAt: new Date(now - 14 * 24 * 60 * 60 * 1000) }, // 2 weeks ago
  ];
};

const MOCK_LOGS = generateMockLogs();

// ── Page Component ─────────────────────────────────────────────────────

const LogsPage: React.FC = () => {
  const [showAll, setShowAll] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<LogFilter | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [recordings, setRecordings] = useState<Recording[]>(generateMockRecordings);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);

  const isRecordingsView = !showAll && selectedFilter === 'RECORDINGS';

  // Filter Logic
  const filteredLogs = useMemo(() => {
    if (showAll) return MOCK_LOGS;
    if (selectedFilter && selectedFilter !== 'RECORDINGS') {
      return MOCK_LOGS.filter((log) => log.level === selectedFilter);
    }
    return [];
  }, [showAll, selectedFilter]);

  const handleShowAllChange = (value: boolean) => {
    setShowAll(value);
    if (value) {
      setSelectedFilter(null);
    } else {
      setSelectedFilter('INFO');
    }
  };

  const handleFilterChange = (filter: LogFilter) => {
    setSelectedFilter(filter);
    setShowAll(false);
  };

  const handleDeleteRecording = useCallback((id: string) => {
    setRecordings((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex-1 bg-[#121212] border border-gray-800 rounded-lg p-4 flex flex-col overflow-hidden relative">
        {/* Title inside the panel */}
        <div className="font-heading text-lg mb-2 text-gray-200 tracking-wider">
          Logs
        </div>

        <LogsFilterBar
          showAll={showAll}
          onShowAllChange={handleShowAllChange}
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
          onInfoClick={() => setIsModalOpen(true)}
        />

        {isRecordingsView ? (
          <RecordingsList
            recordings={recordings}
            onDelete={handleDeleteRecording}
            onClick={(rec) => setSelectedRecording(rec)}
            className="flex-1"
          />
        ) : (
          <LogsList logs={filteredLogs} classname="flex-1" />
        )}
      </div>

      <SystemInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {selectedRecording && (
        <RecordingModal
          recording={selectedRecording}
          onClose={() => setSelectedRecording(null)}
        />
      )}
    </div>
  );
};

export default LogsPage;
