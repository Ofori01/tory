import React from 'react';
import type { LogFilter } from '../../types/logs';
import { Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import ToggleSwitch from '../ui/ToggleSwitch';

interface LogsFilterBarProps {
  showAll: boolean;
  onShowAllChange: (value: boolean) => void;
  selectedFilter: LogFilter | null;
  onFilterChange: (filter: LogFilter) => void;
  onInfoClick: () => void;
}

const LogsFilterBar: React.FC<LogsFilterBarProps> = ({
  showAll,
  onShowAllChange,
  selectedFilter,
  onFilterChange,
  onInfoClick,
}) => {
  const handleFilterClick = (filter: LogFilter) => {
    onShowAllChange(false);
    onFilterChange(filter);
  };

  const isFilterActive = (filter: LogFilter) => !showAll && selectedFilter === filter;

  return (
    <>
      <div className="flex items-center justify-between mb-4 bg-transparent p-2 rounded-md">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 mr-4">
            <span className="text-gray-400 text-sm font-medium">Show All Logs:</span>
            <ToggleSwitch checked={showAll} onChange={onShowAllChange} />
          </div>

          <button
            onClick={() => handleFilterClick('INFO')}
            disabled={showAll}
            className={cn(
              'px-4 py-1.5 rounded-lg cursor-pointer border text-sm font-medium transition-colors',
              isFilterActive('INFO')
                ? 'bg-[#FB923C] text-black border-[#FB923C]'
                : 'bg-transparent border-gray-600 text-gray-400 hover:border-gray-400',
              showAll && 'opacity-50 cursor-not-allowed',
            )}
          >
            Log
          </button>

          <button
            onClick={() => handleFilterClick('ERROR')}
            disabled={showAll}
            className={cn(
              'px-4 py-1.5 rounded-lg border cursor-pointer text-sm font-medium transition-colors',
              isFilterActive('ERROR')
                ? 'bg-[#FB923C] text-black border-[#FB923C]'
                : 'bg-transparent border-gray-600 text-gray-400 hover:border-gray-400',
              showAll && 'opacity-50 cursor-not-allowed',
            )}
          >
            Error log
          </button>

          <button
            onClick={() => handleFilterClick('WARNING')}
            disabled={showAll}
            className={cn(
              'px-4 py-1.5 rounded-lg border text-sm cursor-pointer font-medium transition-colors',
              isFilterActive('WARNING')
                ? 'bg-[#FB923C] text-black border-[#FB923C]'
                : 'bg-transparent border-gray-600 text-gray-400 hover:border-gray-400',
              showAll && 'opacity-50 cursor-not-allowed',
            )}
          >
            Warning Log
          </button>

          <button
            onClick={() => handleFilterClick('RECORDINGS')}
            disabled={showAll}
            className={cn(
              'px-4 py-1.5 rounded-lg border text-sm cursor-pointer font-medium transition-colors',
              isFilterActive('RECORDINGS')
                ? 'bg-[#FB923C] text-black border-[#FB923C]'
                : 'bg-transparent border-gray-600 text-gray-400 hover:border-gray-400',
              showAll && 'opacity-50 cursor-not-allowed',
            )}
          >
            Recordings
          </button>
        </div>

        <button
          onClick={onInfoClick}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Info size={20} />
        </button>
      </div>
      {/* <hr className="mb-3" /> */}
    </>
  );
};

export default LogsFilterBar;
