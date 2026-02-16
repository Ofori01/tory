import React from 'react';
import type { LogEntry } from '../../types/logs';
import LogItem from './LogItem';

interface LogsListProps {
  logs: LogEntry[];
  classname?: string;
}

const LogsList: React.FC<LogsListProps> = ({ logs, classname }) => {
  return (
    <div className={`overflow-y-auto max-h-[600px] w-full pr-2 custom-scrollbar ${classname}`}>
      {logs.map((log) => (
        <LogItem key={log.id} log={log} />
      ))}
      {logs.length === 0 && (
          <div className="text-gray-500 text-center py-10 italic">
              No logs available for this filter.
          </div>
      )}
    </div>
  );
};

export default LogsList;
