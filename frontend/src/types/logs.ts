export type LogLevel = 'INFO' | 'ERROR' | 'WARNING';
export type LogFilter = LogLevel | 'RECORDINGS';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  details?: string;
}

export interface Recording {
  id: string;
  camera: string;
  thumbnailUrl?: string;
  createdAt: Date;
}
