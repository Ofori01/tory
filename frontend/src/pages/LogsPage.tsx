import React, { useState, useMemo, useCallback } from "react";
import type { LogFilter, Recording } from "../types/logs";
import LogsFilterBar from "../components/logs/LogsFilterBar";
import LogsList from "../components/logs/LogsList";
import RecordingsList from "../components/logs/RecordingsList";
import SystemInfoModal from "../components/modals/SystemInfoModal";
import RecordingModal from "../components/modals/RecordingModal";
import { useLogs, type LogStreamLevel } from "../hooks/useLogs";
import { useGetRecordings } from "../hooks/querries/useRecordingsQuery";

// ── Page Component ─────────────────────────────────────────────────────

const LogsPage: React.FC = () => {
  const [showAll, setShowAll] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<LogFilter | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(
    null,
  );

  // Fetch real recordings from backend
  const { data: fetchedRecordings = [], isLoading: recordingsLoading } =
    useGetRecordings("front");

  // Apply local deletes on top of server data
  const recordings = useMemo(
    () => fetchedRecordings.filter((r) => !deletedIds.has(r.id)),
    [fetchedRecordings, deletedIds],
  );

  const isRecordingsView = !showAll && selectedFilter === "RECORDINGS";

  // Map the UI filter to the SSE stream level.
  // The backend supports "INFO" (all logs) and "ERROR" (warnings + errors).
  // We fetch the broadest needed set and narrow client-side.
  const streamLevel: LogStreamLevel = useMemo(() => {
    if (showAll || selectedFilter === "INFO" || selectedFilter == null)
      return "INFO";
    // WARNING and ERROR → request the ERROR stream (includes both)
    return "ERROR";
  }, [showAll, selectedFilter]);

  const { logs: streamedLogs, status: streamStatus } = useLogs({
    level: streamLevel,
  });

  // Client-side filter on top of the stream
  const filteredLogs = useMemo(() => {
    if (showAll) return streamedLogs;
    if (selectedFilter && selectedFilter !== "RECORDINGS") {
      return streamedLogs.filter((log) => log.level === selectedFilter);
    }
    return [];
  }, [showAll, selectedFilter, streamedLogs]);

  const handleShowAllChange = (value: boolean) => {
    setShowAll(value);
    if (value) {
      setSelectedFilter(null);
    } else {
      setSelectedFilter("INFO");
    }
  };

  const handleFilterChange = (filter: LogFilter) => {
    setSelectedFilter(filter);
    setShowAll(false);
  };

  const handleDeleteRecording = useCallback((id: string) => {
    setDeletedIds((prev) => new Set([...prev, id]));
  }, []);

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex-1 bg-[#121212] border border-gray-800 rounded-lg p-4 flex flex-col overflow-hidden relative">
        {/* Title + stream status */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-heading text-lg text-gray-200 tracking-wider">
            Logs
          </span>
          {!isRecordingsView && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                streamStatus === "connected"
                  ? "bg-green-900/50 text-green-400"
                  : streamStatus === "connecting"
                    ? "bg-yellow-900/50 text-yellow-400"
                    : "bg-red-900/50 text-red-400"
              }`}
            >
              {streamStatus === "connected"
                ? "Live"
                : streamStatus === "connecting"
                  ? "Connecting…"
                  : "Disconnected"}
            </span>
          )}
        </div>

        <LogsFilterBar
          showAll={showAll}
          onShowAllChange={handleShowAllChange}
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
          onInfoClick={() => setIsModalOpen(true)}
        />
        <hr className="mb-3" />

        {isRecordingsView ? (
          <RecordingsList
            recordings={recordings}
            isLoading={recordingsLoading}
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
