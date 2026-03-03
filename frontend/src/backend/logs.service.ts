import { endpoints } from "./constants";
import type { LogEntry, LogLevel } from "../types/logs";

// Format emitted by the backend:  [LEVEL] YYYY-MM-DD HH:MM:SS,ms - message
const LOG_PATTERN =
  /^\[(\w+)\]\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}),\d+\s+-\s+([\s\S]+)$/;

let _idCounter = 0;
const nextId = () => `log-${Date.now()}-${++_idCounter}`;

export function parseLogMessage(raw: string): LogEntry | null {
  const match = raw.match(LOG_PATTERN);
  if (!match) return null;

  const [, level, timestamp, message] = match;
  const knownLevels: readonly string[] = ["INFO", "WARNING", "ERROR"];
  const normalised = level.toUpperCase();

  if (!knownLevels.includes(normalised)) return null;

  return {
    id: nextId(),
    timestamp,
    level: normalised as LogLevel,
    message: message.trim(),
  };
}

class LogsService {
  
  getStreamUrl(level: "INFO" | "ERROR" = "INFO"): string {
    return `${endpoints.baseUrl}${endpoints.logs}?level=${level}`;
  }

  openStream(
    level: "INFO" | "ERROR",
    onMessage: (entry: LogEntry) => void,
    onError?: (event: Event) => void,
  ): EventSource {
    const url = this.getStreamUrl(level);
    const source = new EventSource(url);

    source.onmessage = (event: MessageEvent) => {
      const entry = parseLogMessage(event.data as string);
      if (entry) onMessage(entry);
    };

    if (onError) {
      source.onerror = onError;
    }

    return source;
  }
}

export default new LogsService();
