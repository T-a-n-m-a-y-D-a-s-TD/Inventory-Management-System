import { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

const DateTimeClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[var(--neutral-200)] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-[var(--neutral-700)]">Current Time</h3>
        <Clock size={16} className="text-[var(--primary-500)]" />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <Calendar size={14} className="text-[var(--neutral-500)] mr-2" />
          <span className="text-sm text-[var(--neutral-800)]">
            {formatDate(currentTime)}
          </span>
        </div>
        
        <div className="flex items-center">
          <Clock size={14} className="text-[var(--neutral-500)] mr-2" />
          <span className="text-lg font-mono font-semibold text-[var(--primary-700)]">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DateTimeClock;