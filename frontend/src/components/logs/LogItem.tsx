import React from 'react';
import type { LogEntry } from '../../types/logs';
import { CircleCheck, CircleX, TriangleAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LogItemProps {
  log: LogEntry;
}

const levelConfig = {
  INFO: {
    backgroundColor: '#1D58363D',
    borderColor: '#2ecc71',
    textColor: '#2ecc71',
    icon: <CircleCheck size={16} />,
  },
  ERROR: {
    backgroundColor: '#FF000036',
    borderColor: '#ef4444',
    textColor: '#ef4444',
    icon: <CircleX size={16} />,
  },
  WARNING: {
    backgroundColor: '#897830',
    borderColor: '#fcd34d',
    textColor: '#fcd34d',
    icon: <TriangleAlert size={16} />,
  },
} as const;

const defaultConfig = {
  backgroundColor: '#1f2937',
  borderColor: '#6b7280',
  textColor: '#d1d5db',
  icon: null,
};

const LogItem: React.FC<LogItemProps> = ({ log }) => {
  const config = levelConfig[log.level] ?? defaultConfig;

  return (
    <div
      className={cn(
        'flex items-start p-3 mb-3 text-sm font-mono transition-all hover:brightness-110 rounded-sm'
      )}
      style={{
        backgroundColor: config.backgroundColor,
        borderLeftColor: config.borderColor,
        color: config.textColor,
      }}
    >
      <div className="mr-3 mt-0.5 shrink-0">{config.icon}</div>
      <div className="flex-1 min-w-0 break-words">
        <span>
          [{log.timestamp}] {log.level}: {log.message}
        </span>
        {log.details && (
          <span className="ml-1 opacity-90"> {log.details}</span>
        )}
      </div>
    </div>
  );
};

export default LogItem;
