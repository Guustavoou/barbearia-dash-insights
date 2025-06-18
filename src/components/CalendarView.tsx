
import React from 'react';
import { cn } from '@/lib/unclicUtils';

export interface CalendarViewProps {
  appointments: any[];
  darkMode: boolean;
  currentDate?: Date;
  onDateChange?: (date: Date) => void;
  onEditAppointment?: (id: any, data: any) => Promise<void>;
  onDeleteAppointment?: (id: any) => Promise<void>;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  appointments,
  darkMode,
  currentDate,
  onDateChange,
  onEditAppointment,
  onDeleteAppointment
}) => {
  return (
    <div className={cn(
      "rounded-xl border p-6",
      darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    )}>
      <div className="text-center py-8">
        <p className={cn(
          "text-sm",
          darkMode ? "text-gray-400" : "text-gray-600"
        )}>
          Vista de calendário em desenvolvimento
        </p>
      </div>
    </div>
  );
};
