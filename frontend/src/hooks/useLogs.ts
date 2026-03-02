import { useState, useEffect, useRef, useCallback } from "react";
import logsService from "../backend/logs.service";
import type { LogEntry } from "../types/logs";

export type LogStreamLevel = "INFO" | "ERROR";
export type LogStreamStatus = "connecting" | "connected" | "disconnected" | "error";

interface UseLogsOptions {
  /** "INFO" streams all logs; "ERROR" streams warnings and errors only. Defaults to "INFO". */
  level?: LogStreamLevel;
  /** Maximum number of log entries to keep in memory. Defaults to 500. */
  maxEntries?: number;
}

interface UseLogsReturn {
  logs: LogEntry[];
  status: LogStreamStatus;
  error: string | null;
  clearLogs: () => void;
}

export const useLogs = ({
  level = "INFO",
  maxEntries = 500,
}: UseLogsOptions = {}): UseLogsReturn => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<LogStreamStatus>("connecting");
  const [error, setError] = useState<string | null>(null);

  const sourceRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Stable ref so the error handler closure can schedule a reconnect without
  // creating a circular useCallback dependency.
  const connectRef = useRef<() => void>(() => {});

  const clearLogs = useCallback(() => setLogs([]), []);

  useEffect(() => {
    const connect = () => {
      // Clear any pending reconnect
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }

      // Close any existing connection first
      if (sourceRef.current) {
        sourceRef.current.close();
        sourceRef.current = null;
      }

      setStatus("connecting");
      setError(null);

      const source = logsService.openStream(
        level,
        (entry) => {
          setStatus("connected");
          setLogs((prev) => {
            const updated = [...prev, entry];
            return updated.length > maxEntries
              ? updated.slice(updated.length - maxEntries)
              : updated;
          });
        },
        () => {
          setStatus("error");
          setError("Lost connection to log stream. Reconnecting…");
          // Reconnect after 3 s via the stable ref
          reconnectTimerRef.current = setTimeout(() => connectRef.current(), 3000);
        }
      );

      source.onopen = () => {
        setStatus("connected");
        setError(null);
      };

      sourceRef.current = source;
    };

    // Keep the ref in sync with the current closure
    connectRef.current = connect;

    connect();

    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      if (sourceRef.current) {
        sourceRef.current.close();
        sourceRef.current = null;
      }
      setStatus("disconnected");
    };
  }, [level, maxEntries]);

  return { logs, status, error, clearLogs };
};
